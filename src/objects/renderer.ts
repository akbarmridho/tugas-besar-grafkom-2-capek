import { ProgramInfo } from '@/interfaces/program.ts';
import { Scene } from '@/objects/scene.ts';
import { Node } from '@/objects/base/node.ts';
import { Camera } from '@/objects/base/camera.ts';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { WebGLUtils } from '@/utils/webgl-utils.ts';
import { ShaderType } from '@/interfaces/shader-type.ts';
import { Mesh } from '@/objects/mesh.ts';

export class WebGLRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  shaderCache: { [attr: string]: ProgramInfo } = {};
  currentProgram: ProgramInfo | null = null;

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

  /**
   * One render cycle
   *
   * @param scene
   * @param camera
   */
  render(scene: Scene, camera: Camera) {
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

    // @ts-ignore
    const toRender: Node<unknown>[] = [...scene.children];

    while (toRender.length !== 0) {
      const child = toRender.shift()!;
      // handle for light etc ( i guess handle the lights first before the mesh)

      if (child instanceof Mesh) {
        if (
          this.currentProgram === null ||
          this.currentProgram !== this.shaderCache[child.material.id]
        ) {
          this.currentProgram = this.shaderCache[child.material.id];
          WebGLUtils.setUniforms(this.currentProgram, globalUniforms);
        }

        // render the mesh
        WebGLUtils.setAttributes(
          this.currentProgram,
          child.geometry.attributes
        );
        WebGLUtils.setUniforms(this.currentProgram, child.material.uniforms);

        gl.drawArrays(gl.TRIANGLES, 0, child.geometry.attributes.position.size);
      }

      if (child.children.length !== 0) {
        toRender.push(...child.children);
      }
    }
  }
}
