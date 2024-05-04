import { ShaderType } from '../interfaces/shader-type.ts';
import {
  AttributeMapSetters,
  AttributeObject,
  AttributeSetters
} from '../interfaces/attribute-properties.ts';
import { BufferAttribute } from '../objects/buffer-attribute.ts';
import { ProgramInfo } from '../interfaces/program.ts';

export class WebGLUtils {
  /**
   * Create and compiles a shader
   * @param gl the GL program
   * @param source the GLSL source code for the shader
   * @param type the the of shader, VERTEX_SHADER or FRAGMENT_SHADER
   */
  public static createShader(
    gl: WebGLRenderingContext,
    source: string,
    type: ShaderType
  ): WebGLShader {
    const shader = gl.createShader(type);

    if (shader === null) {
      throw new Error('Could not create shader');
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
      const errorLog = `could not compile shader: ${gl.getShaderInfoLog(shader)}`;

      gl.deleteShader(shader);

      throw new Error(errorLog);
    }

    return shader;
  }

  /**
   * Create a program from vertex and fragment shader
   *
   * @param gl
   * @param vertexShader vertex shader
   * @param fragmentShader fragment shader
   */
  public static createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program = gl.createProgram();

    if (program === null) {
      throw new Error('could not create program');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
      const errorMessage = `Failed to create program: ${gl.getProgramInfoLog(program)}`;

      gl.deleteProgram(program);

      throw new Error(errorMessage);
    }

    return program;
  }

  /**
   * Create setter function for all attributes of a shader program
   *
   * @param gl
   * @param program
   */
  public static createAttributeSetters<T extends AttributeObject>(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): AttributeMapSetters<T> {
    function createAttributeSetter(info: WebGLActiveInfo): AttributeSetters {
      // initialization time
      const loc = gl.getAttribLocation(program, info.name);
      const buf = gl.createBuffer();

      return (value) => {
        // Render time (saat memanggil setAttributes() pada render loop
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);

        if (value instanceof BufferAttribute) {
          // todo add isDirty flag to BufferAttribute
          // if (v.isDirty) {

          // Data changed Time (note that buffer is already binded
          gl.bufferData(gl.ARRAY_BUFFER, value.data, gl.STATIC_DRAW);
          // v.consume();

          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(
            loc,
            value.size,
            value.dtype,
            value.normalize,
            value.stride,
            value.offset
          );
        } else {
          gl.disableVertexAttribArray(loc);

          if (value instanceof Float32Array) {
            switch (value.length) {
              case 1:
                gl.vertexAttrib1fv(loc, value);
                break;
              case 2:
                gl.vertexAttrib2fv(loc, value);
                break;
              case 3:
                gl.vertexAttrib3fv(loc, value);
                break;
              case 4:
                gl.vertexAttrib4fv(loc, value);
                break;
              default:
                throw new Error(
                  `Invalid value length. Expecting 1 to 4 got ${value.length}`
                );
            }
          } else {
            switch (value.length) {
              case 1:
                gl.vertexAttrib1f(loc, value[0]);
                break;
              case 2:
                gl.vertexAttrib2f(loc, value[0], value[1]);
                break;
              case 3:
                gl.vertexAttrib3f(loc, value[0], value[1], value[2]);
                break;
              case 4:
                gl.vertexAttrib4f(loc, value[0], value[1], value[2], value[3]);
                break;
              default:
                throw new Error(
                  `Invalid value length. Expecting 1 to 4 got ${value.length}`
                );
            }
          }
        }
      };
    }

    const attribSetters: AttributeMapSetters<T> = {} as AttributeMapSetters<T>;

    const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < numAttributes; i++) {
      const info = gl.getActiveAttrib(program, i);

      if (!info) {
        continue;
      }

      attribSetters[info.name as keyof T] = createAttributeSetter(info);
    }

    return attribSetters;
  }

  public static setAttributes<T extends AttributeObject>(
    programInfo: ProgramInfo<T, any>,
    attributes: T
  ) {
    for (const attributeName of Object.keys(attributes)) {
      if (attributeName in programInfo.attributeSetters) {
        programInfo.attributeSetters[attributeName](attributes[attributeName]);
      }
    }
  }

  /**
   * Create a setter for a uniform of the given program with its location
   * embedded in the setter.
   *
   * @param gl
   * @param program
   */
  public static createUniformSetters(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ) {
    // todo
    // let textureUnit = 0;
    //
    // function createUniformSetter(uniformInfo: WebGLActiveInfo) {
    //   const location = gl.getUniformLocation(program, uniformInfo.name);
    //   const type = uniformInfo.type;
    //
    // }
  }
}
