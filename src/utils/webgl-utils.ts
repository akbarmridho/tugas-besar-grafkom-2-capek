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
import { Vector2 } from './math/vector2.ts';
import { Vector3 } from './math/vector3.ts';
import { Texture } from '@/objects/base/texture.ts';
import { isPowerOf2 } from '@/utils/other.ts';

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

          if (value.isDirty) {
            gl.bufferData(gl.ARRAY_BUFFER, value.data, gl.STATIC_DRAW);
            value.consume();
          }

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
    let textureUnit = 0; // counter for current number of texture unit used

    function createUniformSetter(uniformInfo: WebGLActiveInfo): UniformSetters {
      const location = gl.getUniformLocation(program, uniformInfo.name);
      const type = uniformInfo.type;

      const isArray =
        uniformInfo.size > 1 && uniformInfo.name.substring(-3) === '[0]';

      if (
        uniformInfo.type === gl.SAMPLER_2D ||
        uniformInfo.type === gl.SAMPLER_CUBE
      ) {
        // case for texture
        const unit = textureUnit;
        textureUnit += uniformInfo.size; // info.size > 1 if it is sampler array

        const setupTexture = (v: Texture) => {
          v._texture = v._texture || gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, v._texture); // bind temporary texture

          const isPOT = isPowerOf2(v.width) && isPowerOf2(v.height);

          if (v.needsUpload) {
            // if need to upload data, do upload
            v.needsUpload = false;

            if (v.isLoaded && v.data !== null) {
              // begin load
              const param = [
                gl.TEXTURE_2D,
                0,
                v.format,
                v.format,
                v.type,
                v.data
              ];

              if (v.data instanceof Uint8Array) {
                // insert w and h, border for array
                param.splice(3, 0, v.width, v.height, 0);
              }

              // @ts-ignore
              gl.texImage2D(...param);

              if (isPOT) {
                gl.generateMipmap(gl.TEXTURE_2D);
              }
            } else {
              // data not loaded
              gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                1,
                1,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                new Uint8Array(v.defaultColor)
              );
            }
          }

          if (v.parameterChanged) {
            // if parameter changed, set params
            v.parameterChanged = false;

            if (!isPOT) {
              v.wrapS = v.wrapT = gl.CLAMP_TO_EDGE;
              v.minFilter = gl.LINEAR;
              console.log('image is not POT, fallback params', v);
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, v.wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, v.wrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, v.minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, v.magFilter);
          }
          gl.bindTexture(gl.TEXTURE_2D, null); // set bind to null
        };

        const renderTexture = (v: Texture) => {
          // select texture unit, bind texture to unit, set uniform sampler to unit
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, v._texture);
        };

        const render = (v: unknown) => {
          if (!(v instanceof Texture)) {
            console.error(
              `uniform ${uniformInfo.name}: found not a Texture!`,
              v
            );
            return;
          }

          setupTexture(v);
          renderTexture(v);
        };

        return (v) => {
          if (isArray && Array.isArray(v)) {
            v.forEach(render);
            gl.uniform1iv(
              location,
              v.map((_, i) => unit + i)
            );
          } else {
            render(v);
            gl.uniform1i(location, unit);
          }
        };
      }

      return (v) => {
        if (isArray) {
          if (
            v instanceof Matrix4 ||
            v instanceof Texture ||
            (Array.isArray(v) && v[0] instanceof Texture)
          ) {
            throw new Error(
              'Value cannot be a type of matrix, texture, or array of texture'
            );
          }

          if (typeof v === 'number') {
            v = [v];
          }

          if (type === gl.FLOAT) {
            gl.uniform1fv(location, v as Iterable<number>);
          } else if (gl.INT) {
            gl.uniform1iv(location, v as Iterable<number>);
          }
        } else {
          let data;

          if (v instanceof Matrix4) {
            data = v.toTypedArray();
          } else if (typeof v === 'number') {
            data = [v];
          } else {
            data = v;
          }

          // console.log("A", v, location);

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
      // console.log(key);
      if (Object.hasOwn(programInfo.uniformSetters, key)) {
        const val = uniforms[uniformName];
        if (val !== undefined && val !== null) {
          // console.log(`uniform setting value for ${key}`);
          programInfo.uniformSetters[key]!(val);
        }
      } else {
        // console.log(`uniform setters does not have ${key}`);
      }
    }
  }
}
