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
    normalMap?: TextureSerialized;
  };
}

export class PhongMaterial extends ShaderMaterial<PhongMaterialSerialized> {
  private _ambient: Color;
  private _diffuseMap: Texture;
  private _specularMap: Texture;
  private _shininess: number;
  private _normalMap?: Texture;

  constructor(
    color: Color = Color.fromHex(0x0f0f0f),
    diffuse: Color | Texture = Color.Red(),
    specular: Color | Texture = Color.Red(),
    shininess: number,
    normalMap?: Texture
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

    const hasNormalMap = normalMap ? 1.0 : 0.0;

    super(phongVert, phongFrag, {
      color,
      diffuseMap,
      specularMap,
      shininess,
      normalMap,
      hasNormalMap
    });

    this._ambient = color;
    this._diffuseMap = diffuseMap;
    this._specularMap = specularMap;
    this._shininess = shininess;
    this._normalMap = normalMap;
  }

  get diffuseMap() {
    return this._diffuseMap;
  }

  get specularMap() {
    return this._specularMap;
  }

  get normalMap() {
    return this._normalMap;
  }

  toJSON(): PhongMaterialSerialized {
    return {
      uniforms: {
        color: this._ambient.toJSON(),
        diffuseMap: this._diffuseMap.toJSON(),
        specularMap: this._specularMap.toJSON(),
        shininess: this._shininess,
        normalMap: this._normalMap ? this._normalMap.toJSON() : undefined
      }
    };
  }

  public static fromJSON(data: PhongMaterialSerialized) {
    return new PhongMaterial(
      Color.fromJSON(data.uniforms.color),
      Texture.fromJSON(data.uniforms.diffuseMap),
      Texture.fromJSON(data.uniforms.specularMap),
      data.uniforms.shininess,
      data.uniforms.normalMap
        ? Texture.fromJSON(data.uniforms.normalMap)
        : undefined
    );
  }
}
