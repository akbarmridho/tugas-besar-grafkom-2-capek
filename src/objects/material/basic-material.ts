import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { Color, ColorSerialized } from '@/objects/base/color.ts';
import basicFrag from '../../shaders/basic/basicFrag.frag';
import basicVert from '../../shaders/basic/basicVert.glsl';
import { Texture, TextureSerialized } from '@/objects/base/texture.ts';
import { addDefineToShader } from '@/utils/other.ts';

export interface BasicMaterialSerialized {
  uniforms: {
    color: ColorSerialized | null;
    texture: TextureSerialized | null;
  };
}

export class BasicMaterial extends ShaderMaterial<BasicMaterialSerialized> {
  private color: Color | null;
  private _texture: Texture | null;

  constructor(color: Color | null = null, texture: Texture | null = null) {
    if (
      (color === null && texture === null) ||
      (color !== null && texture !== null)
    ) {
      throw new Error('Only color or texture can be set at a given time');
    }

    const hasTexture = texture !== null;

    super(
      hasTexture ? addDefineToShader(basicVert, 'WITH_TEXTURE') : basicVert,
      hasTexture ? addDefineToShader(basicFrag, 'WITH_TEXTURE') : basicFrag,
      {
        color,
        texture
      }
    );

    this.color = color;
    this._texture = texture;
    this._hasTexture = hasTexture;
  }

  toJSON(): BasicMaterialSerialized {
    return {
      uniforms: {
        color: this.color === null ? null : this.color.toJSON(),
        texture: this._texture === null ? null : this._texture.toJSON()
      }
    };
  }

  get texture() {
    return this._texture;
  }

  public static fromJSON(data: BasicMaterialSerialized) {
    return new BasicMaterial(
      data.uniforms.color !== null ? Color.fromJSON(data.uniforms.color) : null,
      data.uniforms.texture !== null
        ? Texture.fromJSON(data.uniforms.texture)
        : null
    );
  }
}
