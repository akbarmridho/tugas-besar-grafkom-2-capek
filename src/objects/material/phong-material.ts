import { Color, ColorSerialized } from '../base/color';
import { ShaderMaterial } from '../base/shader-material';
import phongFrag from '../../shaders/phong/phongFrag.frag';
import phongVert from '../../shaders/phong/phongVert.glsl';

import { Texture } from '../base/texture';

export interface PhongMaterialSerialized {
  uniforms: {
    color: ColorSerialized;
    diffuseColor: ColorSerialized;
    specularColor: ColorSerialized;
    shininess: number;
  };
}

export class PhongMaterial extends ShaderMaterial<PhongMaterialSerialized> {
  private _color: Color;
  private _diffuseColor: Color;
  private _specularColor: Color;
  private _shininess: number;
  private diffuseMap?: Texture;
  private specularMap?: Texture;

  constructor(
    color: Color = Color.Red(),
    diffuseColor: Color = Color.Red(),
    specularColor: Color = Color.Red(),
    shininess: number,
    diffuseMap?: Texture,
    specularMap?: Texture
  ) {
    super(phongVert, phongFrag, {
      color,
      diffuseColor,
      specularColor,
      shininess
    });
    this._color = color;
    this._diffuseColor = diffuseColor;
    this._specularColor = specularColor;
    this._shininess = shininess;
  }

  toJSON(): PhongMaterialSerialized {
    return {
      uniforms: {
        color: this._color.toJSON(),
        diffuseColor: this._diffuseColor.toJSON(),
        specularColor: this._specularColor.toJSON(),
        shininess: this._shininess
      }
    };
  }

  public static fromJSON(data: PhongMaterialSerialized) {
    return new PhongMaterial(
      Color.fromJSON(data.uniforms.color),
      Color.fromJSON(data.uniforms.diffuseColor),
      Color.fromJSON(data.uniforms.specularColor),
      data.uniforms.shininess
    );
  }
}
