export interface TextureOption {
  name: string;
  diffuse?: string;
  specular?: string;
  displacement?: string;
  normal?: string;
}

export const TextureOptions: TextureOption[] = [
  {
    name: 'color'
  },
  {
    name: 'foil',
    diffuse: '/textures/foil/diffuse.png',
    displacement: '/textures/foil/displacement.png',
    normal: '/textures/foil/normal.png',
    specular: '/textures/foil/specular.png'
  },
  {
    name: 'grass',
    diffuse: '/textures/grass/diffuse.png',
    displacement: '/textures/grass/displacement.png',
    normal: '/textures/grass/normal.png',
    specular: '/textures/grass/specular.png'
  },
  {
    name: 'bricks',
    diffuse: '/textures/bricks/diffuse.png',
    displacement: '/textures/bricks/displacement.png',
    normal: '/textures/bricks/normal.png',
    specular: '/textures/bricks/specular.png'
  },
  {
    name: 'metal-plate',
    diffuse: '/textures/metal-plate/diffuse.png',
    displacement: '/textures/metal-plate/displacement.png',
    normal: '/textures/metal-plate/normal.png',
    specular: '/textures/metal-plate/specular.png'
  },
  {
    name: 'diamond-plate',
    diffuse: '/textures/diamond-plate/diffuse.png',
    displacement: '/textures/diamond-plate/displacement.png',
    normal: '/textures/diamond-plate/normal.png'
  },
  {
    name: 'metal',
    diffuse: '/textures/metal/diffuse.png',
    displacement: '/textures/metal/displacement.png',
    normal: '/textures/metal/normal.png',
    specular: '/textures/metal/specular.png'
  },
  {
    name: 'planks',
    diffuse: '/textures/planks/diffuse.png',
    displacement: '/textures/planks/displacement.png',
    normal: '/textures/planks/normal.png',
    specular: '/textures/planks/specular.png'
  },
  {
    name: 'plastic',
    diffuse: '/textures/plastic/diffuse.png',
    displacement: '/textures/plastic/displacement.png',
    normal: '/textures/plastic/normal.png',
    specular: '/textures/plastic/specular.png'
  },
  {
    name: 'rock',
    diffuse: '/textures/rock/diffuse.png',
    displacement: '/textures/rock/displacement.png',
    normal: '/textures/rock/normal.png',
    specular: '/textures/rock/specular.png'
  },
  {
    name: 'tiles',
    diffuse: '/textures/tiles/diffuse.png',
    displacement: '/textures/tiles/displacement.png',
    normal: '/textures/tiles/normal.png',
    specular: '/textures/tiles/specular.png'
  }
];
