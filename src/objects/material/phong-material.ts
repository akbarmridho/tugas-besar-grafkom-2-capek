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
    displacementMap?: TextureSerialized;
    displacementScale?: number;
    displacementBias?: number;
  };
}

export class PhongMaterial extends ShaderMaterial<PhongMaterialSerialized> {
  private _ambient: Color;
  private _diffuseMap: Texture;
  private _specularMap: Texture;
  private _shininess: number;
  private _normalMap?: Texture;
  private _displacementMap?: Texture;
  private _displacementScale?: number;
  private _displacementBias?: number;

  constructor(
    color: Color = Color.fromHex(0x0f0f0f),
    diffuse: Color | Texture = Color.Red(),
    specular: Color | Texture = Color.Red(),
    shininess: number,
    additionalTexture?: {
      normalMap?: Texture;
      displacement?: {
        displacementMap: Texture;
        displacementScale: number;
        displacementBias: number;
      };
    }
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

    const hasNormalMap =
      additionalTexture && additionalTexture.normalMap ? 1.0 : 0.0;
    const normalMap = additionalTexture?.normalMap;

    const hasDisplacementMap =
      additionalTexture && additionalTexture.displacement ? 1.0 : 0.0;
    const displacementMap = additionalTexture?.displacement?.displacementMap;
    const displacementScale =
      additionalTexture?.displacement?.displacementScale;
    const displacementBias = additionalTexture?.displacement?.displacementBias;

    super(phongVert, phongFrag, {
      color,
      diffuseMap,
      specularMap,
      shininess,
      normalMap,
      hasNormalMap,
      displacementMap,
      displacementScale,
      displacementBias,
      hasDisplacementMap
    });

    this._ambient = color;
    this._diffuseMap = diffuseMap;
    this._specularMap = specularMap;
    this._shininess = shininess;
    this._normalMap = normalMap;
    this._displacementMap = displacementMap;
    this._displacementScale = displacementScale;
    this._displacementBias = displacementBias;
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

  get displacementMap() {
    return this._displacementMap;
  }

  toJSON(): PhongMaterialSerialized {
    return {
      uniforms: {
        color: this._ambient.toJSON(),
        diffuseMap: this._diffuseMap.toJSON(),
        specularMap: this._specularMap.toJSON(),
        shininess: this._shininess,
        normalMap: this._normalMap ? this._normalMap.toJSON() : undefined,
        displacementMap: this._displacementMap
          ? this._displacementMap.toJSON()
          : undefined,
        displacementScale: this._displacementScale
          ? this._displacementScale
          : undefined,
        displacementBias: this._displacementBias
          ? this._displacementBias
          : undefined
      }
    };
  }

  public static fromJSON(data: PhongMaterialSerialized) {
    let displacement:
      | {
          displacementMap: Texture;
          displacementScale: number;
          displacementBias: number;
        }
      | undefined;

    if (data.uniforms.displacementMap) {
      displacement = {
        displacementMap: Texture.fromJSON(data.uniforms.displacementMap),
        displacementScale: data.uniforms.displacementScale!,
        displacementBias: data.uniforms.displacementBias!
      };
    } else {
      displacement = undefined;
    }

    return new PhongMaterial(
      Color.fromJSON(data.uniforms.color),
      Texture.fromJSON(data.uniforms.diffuseMap),
      Texture.fromJSON(data.uniforms.specularMap),
      data.uniforms.shininess,
      {
        normalMap: data.uniforms.normalMap
          ? Texture.fromJSON(data.uniforms.normalMap)
          : undefined,
        displacement
      }
    );
  }
}
