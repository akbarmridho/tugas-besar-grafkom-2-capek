import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { Color, ColorSerialized } from '@/objects/base/color.ts';
import basicFrag from '../../shaders/basic/basicFrag.frag';
import basicVert from '../../shaders/basic/basicVert.glsl';

export interface BasicMaterialSerialized {
  uniforms: {
    color: ColorSerialized;
  };
}

export class BasicMaterial extends ShaderMaterial<BasicMaterialSerialized> {
  private color: Color;

  constructor(color: Color = Color.Red()) {
    super(basicVert, basicFrag, { color });

    this.color = color;
  }

  toJSON(): BasicMaterialSerialized {
    return {
      uniforms: {
        color: this.color.toJSON()
      }
    };
  }

  public static fromJSON(data: BasicMaterialSerialized) {
    return new BasicMaterial(Color.fromJSON(data.uniforms.color));
  }
}
