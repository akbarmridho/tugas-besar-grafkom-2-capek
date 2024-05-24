import { Color, ColorSerialized } from '../base/color';
import { ShaderMaterial } from '../base/shader-material';
import phongFrag from '../../shaders/phong/phongFrag.frag';
import phongVert from '../../shaders/phong/phongVert.glsl';

import { Texture, TextureSerialized } from '../base/texture';

export interface PhongMaterialSerialized {
  uniforms: {
    color: ColorSerialized;
    diffuseMap: TextureSerialized;
    specularMap: TextureSerialized;
    shininess: number;
  };
}

export class PhongMaterial extends ShaderMaterial<PhongMaterialSerialized> {
  private _ambient: Color;
  private _diffuseMap: Texture;
  private _specularMap: Texture;
  private _shininess: number;

  constructor(
    color: Color = Color.fromHex(0x0f0f0f),
    diffuse: Color | Texture = Color.Red(),
    specular: Color | Texture = Color.Red(),
    shininess: number
  ) {
    let diffuseMap: Texture;
    if (diffuse instanceof Color) {
      diffuseMap = new Texture({ data: diffuse });
    } else {
      diffuseMap = diffuse;
    }

    let specularMap: Texture;
    if (specular instanceof Color) {
      specularMap = new Texture({ data: specular });
    } else {
      specularMap = specular;
    }

    super(phongVert, phongFrag, {
      color,
      diffuseMap,
      specularMap,
      shininess
    });

    this._ambient = color;
    this._diffuseMap = diffuseMap;
    this._specularMap = specularMap;
    this._shininess = shininess;
  }

  toJSON(): PhongMaterialSerialized {
    return {
      uniforms: {
        color: this._ambient.toJSON(),
        diffuseMap: this._diffuseMap.toJSON(),
        specularMap: this._specularMap.toJSON(),
        shininess: this._shininess
      }
    };
  }

  public static fromJSON(data: PhongMaterialSerialized) {
    return new PhongMaterial(
      Color.fromJSON(data.uniforms.color),
      Texture.fromJSON(data.uniforms.diffuseMap),
      Texture.fromJSON(data.uniforms.specularMap),
      data.uniforms.shininess
    );
  }
}
