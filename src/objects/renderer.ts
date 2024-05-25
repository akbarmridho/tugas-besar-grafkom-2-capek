import { ProgramInfo } from '@/interfaces/program.ts';
import { Scene } from '@/objects/scene.ts';
import { Node } from '@/objects/base/node.ts';
import { Camera } from '@/objects/base/camera.ts';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { WebGLUtils } from '@/utils/webgl-utils.ts';
import { ShaderType } from '@/interfaces/shader-type.ts';
import { Mesh } from '@/objects/mesh.ts';
import { ParseModelResult } from '@/interfaces/parser.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from './camera/perspective-camera';
import { ObliqueCamera } from './camera/oblique-camera';
import { CameraSelection } from '@/interfaces/camera.ts';
import { CameraAvailability } from '@/components/context.ts';
import { mod } from '@/utils/math/mod.ts';
import { AnimationPath } from '@/interfaces/animation.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';
import { OrbitControl } from '@/objects/base/orbit-control.ts';
import { AmbientLight } from './light/ambient-light';
import { DirectionalLight } from './light/directional-light';
import { UniformDataType } from '@/interfaces/uniform-properties.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { PointLight } from './light/point-light';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';

type SceneChangedCallback = (
  scene: Scene,
  cameraSelection: CameraSelection,
  cameraAvailability: CameraAvailability
) => void;

type CameraResetCallback = () => void;

export class WebGLRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  shaderCache: { [attr: string]: ProgramInfo } = {};
  currentProgram: ProgramInfo | null = null;

  onSceneChanged: Set<SceneChangedCallback> = new Set();
  onCameraReset: Set<CameraResetCallback> = new Set();

  selectedCamera: CameraSelection = null;

  camera: {
    orthogonal: Camera | null;
    perspective: Camera | null;
    oblique: Camera | null;
  } = { oblique: null, perspective: null, orthogonal: null };

  orbitControl: {
    orthogonal: OrbitControl | null;
    perspective: OrbitControl | null;
    oblique: OrbitControl | null;
  } = { oblique: null, perspective: null, orthogonal: null };

  model: ParseModelResult | null = null;

  private isPlaying: boolean = false;
  private isBackward: boolean = false;
  private isRepeat: boolean = true;
  private fps: number = 30;
  private currentFrame: number = 0;
  private _deltaFrame: number = 0;
  private _lastFrameTime?: number;

  get animationLength() {
    return this.model!.animationClip!.frames.length;
  }

  private get animationFrame() {
    return this.model!.animationClip!.frames[this.currentFrame];
  }

  constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.canvas = canvas;
  }

  setViewport() {
    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  adjustCanvas(): boolean {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      return true;
    }
    return false;
  }

  public resetCamera() {
    if (this.selectedCamera === null) return;

    const camera = this.camera[this.selectedCamera]!;
    camera.zoom = 1;
    camera.resetProjection();
    camera.computeProjectionMatrix();

    this.model?.scene.setFromEulerRotation(new Euler(0, 0, 0));

    for (const handler of this.onCameraReset) {
      handler();
    }
  }

  programFromMaterial(material: ShaderMaterial) {
    if (Object.hasOwn(this.shaderCache, material.id)) {
      throw new Error('Material already have a program');
    }

    const vertexShader = WebGLUtils.createShader(
      this.gl,
      material.vertexShader,
      ShaderType.VERTEX
    );

    const fragmentShader = WebGLUtils.createShader(
      this.gl,
      material.fragmentShader,
      ShaderType.FRAGMENT
    );

    const program = WebGLUtils.createProgram(
      this.gl,
      vertexShader,
      fragmentShader
    );

    const attributeSetters = WebGLUtils.createAttributeSetters(
      this.gl,
      program
    );

    const uniformSetters = WebGLUtils.createUniformSetters(this.gl, program);

    this.shaderCache[material.id] = {
      program,
      attributeSetters,
      uniformSetters
    };
  }

  public updateFromParsedModel(model: ParseModelResult) {
    this.model = model;
    this.shaderCache = {};
    this.currentProgram = null;
    this.camera = { oblique: null, orthogonal: null, perspective: null };
    this.orbitControl = { oblique: null, orthogonal: null, perspective: null };
    this.selectedCamera = null;
    model.cameras.forEach((camera, i) => {
      if (camera instanceof OrthographicCamera) {
        this.camera.orthogonal = camera;
        this.orbitControl.orthogonal = new OrbitControl(camera);

        if (this.selectedCamera === null) {
          this.selectedCamera = 'orthogonal';
        }
      } else if (camera instanceof PerspectiveCamera) {
        this.camera.perspective = camera;
        this.orbitControl.perspective = new OrbitControl(camera);
        if (this.selectedCamera === null) {
          this.selectedCamera = 'perspective';
        }
      } else if (camera instanceof ObliqueCamera) {
        this.camera.oblique = camera;
        this.orbitControl.oblique = new OrbitControl(camera);

        if (this.selectedCamera === null) {
          this.selectedCamera = 'oblique';
        }
      }
    });

    const loadCb = () => {
      this.render();
    };

    model.materials.forEach((material) => {
      this.programFromMaterial(material);

      if (material instanceof BasicMaterial) {
        material.texture?.onLoad(loadCb);
      } else if (material instanceof PhongMaterial) {
        material.diffuseMap.onLoad(loadCb);
        material.specularMap.onLoad(loadCb);
        if (material.normalMap) {
          material.normalMap.onLoad(loadCb);
        }
      }
    });

    for (const handler of this.onSceneChanged) {
      handler(this.model.scene, this.selectedCamera, {
        oblique: this.camera.oblique !== null,
        orthogonal: this.camera.orthogonal !== null,
        perspective: this.camera.perspective !== null
      });
    }
  }

  public updateAnimation(deltaSecond: number) {
    if (this.isPlaying) {
      if (
        !this.isRepeat &&
        ((this.isBackward && this.currentFrame === 0) ||
          (!this.isBackward && this.currentFrame === this.animationLength - 1))
      ) {
        this.isPlaying = false;
        return;
      }

      this._deltaFrame += deltaSecond * this.fps;
      if (this._deltaFrame >= 1) {
        // 1 frame
        if (this.isBackward) {
          this.currentFrame = mod(
            this.currentFrame - Math.floor(this._deltaFrame),
            this.animationLength
          );
        } else {
          this.currentFrame =
            (this.currentFrame + Math.floor(this._deltaFrame)) %
            this.animationLength;
        }

        this._deltaFrame %= 1;
        this.updateSceneGraph();
      }
    }
  }

  private updateSceneGraph() {
    // Update scene graph with current frame
    // Use root as the parent and traverse according to the frame
    const toUpdate: { node: Node; path: AnimationPath }[] = [];

    const frame = this.animationFrame!;

    this.model!.scene.children.forEach((c) => {
      if (frame.children && Object.hasOwn(frame.children, c.name)) {
        const path = frame.children[c.name];
        toUpdate.push({
          node: c,
          path: path
        });
      }
    });

    while (toUpdate.length !== 0) {
      const { node, path } = toUpdate.shift()!;

      const keyframe = path.keyframe;

      if (keyframe) {
        if (keyframe.rotation) {
          node.setFromEulerRotation(
            // assume value in degree, not radian
            new Euler(
              degreeToRadian(keyframe.rotation[0]),
              degreeToRadian(keyframe.rotation[1]),
              degreeToRadian(keyframe.rotation[2])
            )
          );
        }

        if (keyframe.scale) {
          node.setScale(
            new Vector3(keyframe.scale[0], keyframe.scale[1], keyframe.scale[2])
          );
        }

        if (keyframe.translation) {
          node.setPosition(
            new Vector3(
              keyframe.translation[0],
              keyframe.translation[1],
              keyframe.translation[2]
            )
          );
        }
      }

      if (path.children) {
        for (const key of Object.keys(path.children)) {
          node.getChildrenByName(key).forEach((c) => {
            toUpdate.push({
              node: c,
              path: path.children![key]
            });
          });
        }
      }
    }
  }

  public beginRenderCycle() {
    requestAnimationFrame((val) => {
      this.runAnim(val);
    });
  }

  private runAnim(currentTime: number) {
    if (!this.isPlaying) return;
    if (this._lastFrameTime === undefined) this._lastFrameTime = currentTime;

    const deltaSecond = (currentTime - this._lastFrameTime) / 1000;
    this.updateAnimation(deltaSecond);
    this._lastFrameTime = currentTime;
    this.render();

    requestAnimationFrame((val) => {
      this.runAnim(val);
    });
  }

  public startForward() {
    this.isPlaying = true;
    this.isBackward = false;
    this.currentFrame = 0;
    this._deltaFrame = 0;
    this._lastFrameTime = undefined;
    this.beginRenderCycle();
  }

  public startBackward() {
    this.isPlaying = true;
    this.isBackward = true;
    this.currentFrame = this.animationLength - 1;
    this._deltaFrame = 0;
    this._lastFrameTime = undefined;

    this.beginRenderCycle();
  }

  public toPrevFrame() {
    this.isPlaying = false;

    if (this.currentFrame === 0) {
      return;
    }

    this.currentFrame--;
    this.updateSceneGraph();
    this.render();
  }

  public toNextFrame() {
    this.isPlaying = false;

    if (this.currentFrame === this.animationLength - 1) {
      return;
    }

    this.currentFrame++;
    this.updateSceneGraph();
    this.render();
  }

  public toFirstFrame() {
    this.isPlaying = false;
    this.currentFrame = 0;
    this.updateSceneGraph();
    this.render();
  }

  public toLastFrame() {
    this.isPlaying = false;
    this.currentFrame = this.animationLength - 1;
    this.updateSceneGraph();
    this.render();
  }

  public setRepeat(isRepeat: boolean) {
    this.isRepeat = isRepeat;
  }

  public setFps(fps: number) {
    this.fps = fps;
  }

  public stop() {
    this.isPlaying = false;
    this._deltaFrame = 0;
    this._lastFrameTime = undefined;
  }

  get currentOrbitControl() {
    return this.orbitControl[this.selectedCamera!];
  }

  /**
   * One render cycle
   *
   */
  render() {
    if (this.model === null || this.selectedCamera === null) return;
    const scene = this.model.scene;
    const camera = this.camera[this.selectedCamera]!;

    /**
     * Scene has the instance of the camera in the children
     * assume that scene could have multiple cameras, so the camera in parameter is the selected camera
     */
    const gl = this.gl;

    this.adjustCanvas();

    this.setViewport();

    // to sort the depth
    gl.enable(gl.DEPTH_TEST);

    // enable back face culling
    gl.cullFace(gl.BACK);

    const [r, g, b, a] = [...scene.color];

    gl.clearColor(r, g, b, a);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the viewProjectionMatrix

    const globalUniforms: { [key: string]: UniformDataType } = {
      viewProjectionMatrix: camera.viewProjectionMatrix
    };

    // @ts-ignore
    const toRender: Node<unknown>[] = [...scene.children];
    // @ts-ignore
    const lightToRender: Node<unknown>[] = [...scene.children];
    let numPointLights: number = 0;

    // render all light
    while (lightToRender.length !== 0) {
      const child = lightToRender.shift()!;

      if (child instanceof AmbientLight) {
        globalUniforms['ambientLight.color'] = child.visible
          ? child.color
          : Color.Black();
        globalUniforms['ambientLight.intensity'] = child.intensity;
      }

      if (child instanceof DirectionalLight) {
        globalUniforms['directionalLight.color'] = child.visible
          ? child.color
          : Color.Black();
        globalUniforms['directionalLight.direction'] = child.direction;
        globalUniforms['directionalLight.intensity'] = child.intensity;
      }

      if (child instanceof PointLight) {
        globalUniforms['pointLights[' + numPointLights + '].color'] =
          child.visible ? child.color : Color.Black();
        globalUniforms['pointLights[' + numPointLights + '].position'] =
          new Vector3(
            child.worldMatrix.elements[3],
            child.worldMatrix.elements[7],
            child.worldMatrix.elements[11]
          );
        globalUniforms['pointLights[' + numPointLights + '].intensity'] =
          child.intensity;
        globalUniforms['pointLights[' + numPointLights + '].constant'] =
          child.constant;
        globalUniforms['pointLights[' + numPointLights + '].linear'] =
          child.linear;
        globalUniforms['pointLights[' + numPointLights + '].quadratic'] =
          child.quadratic;

        numPointLights++;
      }

      if (child.children.length !== 0) {
        lightToRender.push(...child.children);
      }
    }
    globalUniforms['num_lights'] = numPointLights;

    // render all mesh
    while (toRender.length !== 0) {
      const child = toRender.shift()!;

      if (!child.visible) continue;

      if (child instanceof Mesh) {
        // console.log(this.shaderCache);
        // console.log(`child name ${child.name}`);
        if (
          this.currentProgram === null ||
          this.currentProgram !== this.shaderCache[child.material.id]
        ) {
          // console.log(`changing to mat id ${child.material.id}`);
          this.currentProgram = this.shaderCache[child.material.id];
          this.gl.useProgram(this.currentProgram.program);
        }

        WebGLUtils.setUniforms(this.currentProgram, globalUniforms);

        // render the mesh
        WebGLUtils.setAttributes(
          this.currentProgram,
          child.geometry.attributes
        );
        WebGLUtils.setUniforms(this.currentProgram, child.material.uniforms);
        WebGLUtils.setUniforms(this.currentProgram, {
          worldMatrix: child.worldMatrix,
          viewPos: camera.position.clone(),
          normalMatrix: child.worldMatrix.copy().inverse().transpose()
        });

        // console.log(child.worldMatrix.toJSON());
        // console.log(`material for ${child.name}`);
        // console.log(child.material.uniforms);
        // console.log(child.rotation.toJSON());
        // console.log(child.position.toJSON());
        // console.log(child.worldMatrix.toJSON());
        // console.log(
        //   `Drawing triangle ${child.geometry.attributes.position.count}`
        // );
        // console.log(child.geometry.attributes);
        gl.drawArrays(
          gl.TRIANGLES,
          0,
          child.geometry.attributes.position.count
        );
      }

      if (child.children.length !== 0) {
        toRender.push(...child.children);
      }
    }
  }
}
