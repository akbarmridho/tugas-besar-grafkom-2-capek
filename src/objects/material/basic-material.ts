import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { Color } from '@/objects/base/color.ts';
import basicFrag from '../../shaders/basic/basicFrag.frag';
import basicVert from '../../shaders/basic/basicVert.glsl';
import { Texture, TextureSerialized } from '@/objects/base/texture.ts';

export interface BasicMaterialSerialized {
  uniforms: {
    texture: TextureSerialized;
  };
}

export class BasicMaterial extends ShaderMaterial<BasicMaterialSerialized> {
  private _texture: Texture;

  constructor(data: Color | Texture = Color.Red()) {
    const texture = data instanceof Color ? new Texture({ data: data }) : data;
    super(basicVert, basicFrag, {
      texture
    });

    this._texture = texture;
  }

  toJSON(): BasicMaterialSerialized {
    return {
      uniforms: {
        texture: this._texture.toJSON()
      }
    };
  }

  get texture() {
    return this._texture;
  }

  public static fromJSON(data: BasicMaterialSerialized) {
    return new BasicMaterial(Texture.fromJSON(data.uniforms.texture));
  }
}
