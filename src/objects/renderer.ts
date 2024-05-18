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
import { OrthographicCamera } from '@/objects/camera/ortographic-camera.ts';
import { PerspectiveCamera } from './camera/perspective-camera';
import { ObliqueCamera } from './camera/oblique-camera';
import { CameraSelection } from '@/interfaces/camera.ts';
import { CameraAvailability } from '@/components/context.ts';
import { mod } from '@/utils/math/mod.ts';
import { AnimationPath } from '@/interfaces/animation.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';
import { Color } from './base/color';

type SceneChangedCallback = (
  scene: Scene,
  cameraSelection: CameraSelection,
  cameraAvailability: CameraAvailability
) => void;

export class WebGLRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  shaderCache: { [attr: string]: ProgramInfo } = {};
  currentProgram: ProgramInfo | null = null;

  onSceneChanged: Set<SceneChangedCallback> = new Set();

  selectedCamera: CameraSelection = null;

  initialCameraTR: {
    orthogonal: { position: Vector3; rotation: Euler } | null;
    perspective: { position: Vector3; rotation: Euler } | null;
    oblique: { position: Vector3; rotation: Euler } | null;
  } = { oblique: null, orthogonal: null, perspective: null };

  camera: {
    orthogonal: Camera | null;
    perspective: Camera | null;
    oblique: Camera | null;
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
    const initialPos = this.initialCameraTR[this.selectedCamera]!;

    camera.setPosition(initialPos.position);
    camera.setFromEulerRotation(initialPos.rotation);
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
    this.initialCameraTR = {
      oblique: null,
      orthogonal: null,
      perspective: null
    };
    this.camera = { oblique: null, orthogonal: null, perspective: null };
    this.selectedCamera = null;
    console.log(model.cameras);
    model.cameras.forEach((camera, i) => {
      if (camera instanceof OrthographicCamera) {
        this.initialCameraTR.orthogonal = {
          position: camera.position.clone(),
          rotation: camera.rotation.clone()
        };

        this.camera.orthogonal = camera;

        if (this.selectedCamera === null) {
          this.selectedCamera = 'orthogonal';
        }
      } else if (camera instanceof PerspectiveCamera) {
        this.initialCameraTR.perspective = {
          position: camera.position.clone(),
          rotation: camera.rotation.clone()
        };

        this.camera.perspective = camera;

        if (this.selectedCamera === null) {
          this.selectedCamera = 'perspective';
        }
      } else if (camera instanceof ObliqueCamera) {
        console.log("A");
        this.initialCameraTR.oblique = {
          position: camera.position.clone(),
          rotation: camera.rotation.clone()
        };

        this.camera.oblique = camera;

        if (this.selectedCamera === null) {
          this.selectedCamera = 'oblique';
        }
      }
    });

    model.materials.forEach((material) => {
      this.programFromMaterial(material);
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
    const toUpdate: { node: Node; path: AnimationPath }[] = [
      {
        node: this.model!.scene.getChildByName(
          this.model!.animationClip!.rootName
        )!,
        path: this.animationFrame
      }
    ];

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
          const childNode = node.getChildByName(key);

          if (childNode !== null) {
            toUpdate.push({
              node: childNode,
              path: path.children[key]
            });
          }
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
    this._lastFrameTime = 0;

    this.beginRenderCycle();
  }

  public startBackward() {
    this.isPlaying = true;
    this.isBackward = true;
    this.currentFrame = this.animationLength - 1;
    this._deltaFrame = 0;
    this._lastFrameTime = 0;

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

    const globalUniforms = {
      viewProjectionMatrix: camera.viewProjectionMatrix
    };

    console.log(camera.viewProjectionMatrix);

    // console.log(
    //   `global uniforms ${JSON.stringify(globalUniforms.viewProjectionMatrix.toJSON())}`
    // );

    // @ts-ignore
    const toRender: Node<unknown>[] = [...scene.children];

    while (toRender.length !== 0) {
      const child = toRender.shift()!;
      // handle for light etc ( i guess handle the lights first before the mesh)

      // console.log(`rendering ${child.name}`);

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
          WebGLUtils.setUniforms(this.currentProgram, globalUniforms);
        }

        // render the mesh
        WebGLUtils.setAttributes(
          this.currentProgram,
          child.geometry.attributes
        );
        WebGLUtils.setUniforms(this.currentProgram, child.material.uniforms);
        WebGLUtils.setUniforms(this.currentProgram, {
          worldMatrix: child.worldMatrix
        });

        // console.log(child.worldMatrix.toJSON());
        // console.log(`material for ${child.name}`);
        // console.log(child.material.uniforms);
        WebGLUtils.setUniforms(this.currentProgram, {
          lightColor: Color.White(),
          lightPos: [1, 0, 1],
          viewPos: [0, 0, 1],
          normalMatrix: child.worldMatrix.copy().inverse().transpose()
        });
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
