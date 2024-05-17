import { ShaderType } from '../interfaces/shader-type.ts';
import {
  AttributeMapSetters,
  AttributeObject,
  AttributeSetters
} from '../interfaces/attribute-properties.ts';
import { BufferAttribute } from '../objects/base/buffer-attribute.ts';
import { ProgramInfo } from '../interfaces/program.ts';
import {
  UniformMapSetters,
  UniformObject,
  UniformSetters,
  UniformSetterWebGLType
} from '../interfaces/uniform-properties.ts';
import { Matrix4 } from './math/matrix4.ts';

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
  public static createAttributeSetters(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): AttributeMapSetters {
    function createAttributeSetter(info: WebGLActiveInfo): AttributeSetters {
      // initialization time
      const loc = gl.getAttribLocation(program, info.name);

      return (value) => {
        if (value instanceof BufferAttribute) {
          value._buffer = value._buffer || gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, value._buffer);

          // if (value.isDirty) {
          gl.bufferData(gl.ARRAY_BUFFER, value.data, gl.STATIC_DRAW);
          //   value.consume();
          // }

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

    const attribSetters: AttributeMapSetters = {};

    const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < numAttributes; i++) {
      const info = gl.getActiveAttrib(program, i);

      if (!info) {
        continue;
      }

      attribSetters[info.name] = createAttributeSetter(info);
    }

    return attribSetters;
  }

  public static setAttributes(
    programInfo: ProgramInfo,
    attributes: AttributeObject
  ) {
    for (const attributeName of Object.keys(attributes)) {
      const key = `a_${attributeName}`;

      if (Object.hasOwn(programInfo.attributeSetters, key)) {
        programInfo.attributeSetters[key]!(attributes[attributeName]!);
        // console.log(`attribute setting value for ${key}`);
      } else {
        // console.log(`attribute setters does not have ${key}`);
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
  ): UniformMapSetters {
    let textureUnit = 0;

    function createUniformSetter(uniformInfo: WebGLActiveInfo): UniformSetters {
      const location = gl.getUniformLocation(program, uniformInfo.name);
      const type = uniformInfo.type;

      const isArray =
        uniformInfo.size > 1 && uniformInfo.name.substring(-3) === '[0]';

      return (v) => {
        if (isArray) {
          if (v instanceof Matrix4) {
            throw new Error('Value cannot be a type of matrix');
          }

          if (typeof v === 'number') {
            v = [v];
          }

          if (type === gl.FLOAT) {
            gl.uniform1fv(location, v);
          } else if (gl.INT) {
            gl.uniform1iv(location, v);
          } else if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
            const units: number[] = [];

            for (let i = 0; i < uniformInfo.size; i++) {
              units.push(textureUnit++);
            }

            const bindPoint =
              type === gl.SAMPLER_2D ? gl.TEXTURE_2D : gl.TEXTURE_CUBE_MAP;

            gl.uniform1iv(location, units);

            for (const [i, val] of [...v].entries()) {
              gl.activeTexture(gl.TEXTURE0 + units[i]);
              gl.bindTexture(bindPoint, val);
            }
          }
        } else {
          let data;

          if (v instanceof Matrix4) {
            data = v.toTypedArray();
          } else {
            data = v;
          }

          if (Object.hasOwn(UniformSetterWebGLType, type)) {
            // @ts-ignore
            const funcName = UniformSetterWebGLType[type] as string;

            if (funcName.startsWith('Matrix')) {
              // @ts-ignore
              gl[`uniform${funcName}`](location, false, data);
            } else {
              // @ts-ignore
              gl[`uniform${funcName}`](location, ...data);
            }
          } else if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
            const bindPoint =
              type === gl.SAMPLER_2D ? gl.TEXTURE_2D : gl.TEXTURE_CUBE_MAP;
            textureUnit++;
            gl.uniform1i(location, textureUnit);
            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            gl.bindTexture(bindPoint, v);
          } else {
            throw new Error('Invalid type');
          }
        }
      };
    }

    const uniformSetters: UniformMapSetters = {};

    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(program, i);

      if (!info) {
        continue;
      }

      let name = info.name;

      if (name.substring(-3) === '[0]') {
        name = name.substring(0, name.length - 3);
      }

      uniformSetters[info.name] = createUniformSetter(info);
    }

    return uniformSetters;
  }

  public static setUniforms(programInfo: ProgramInfo, uniforms: UniformObject) {
    for (const uniformName of Object.keys(uniforms)) {
      const key = `u_${uniformName}`;

      if (Object.hasOwn(programInfo.uniformSetters, key)) {
        // console.log(`uniform setting value for ${key}`);
        programInfo.uniformSetters[key]!(uniforms[uniformName]!);
      } else {
        // console.log(`uniform setters does not have ${key}`);
      }
    }
  }
}
