# Model Data Format Design

In gITF, the model could have multiple scenes in one file and one default scene.
We choose to make the model only able to have one scene instead.

## Data Structure

### Overall structure

```
{
    scene: {
        name: string,
        color: Color,
        children: number[] -> indexes of node in nodes object
    },
    nodes: Node[],
    cameras: Camera[],
    meshes: Mesh[],
    materials: Material[]
}
```

### Common Data Types

#### Color

```
interface Color {
    r: number;
    g: number;
    b: number;
}
```

#### Node

```
interface Node {
    name: string,
    camera?: number, -> index of camera in cameras object. Exist if node type is a camera
    mesh?: number, -> index of mesh in meshes object. Exist if node type is a mesh
    translation?: Vector3,
    rotation?: Euler,
    scale?: Vector3
}
```

#### Camera

```
interface Camera {
    type: string,
    projection: any
}

interface OrthographicCamera {
    type: "orthographic",
    projection: {
      top: number;
      bottom: number;
      left: number;
      right: number;
      near: number;
      far: number;
    }
}   
```

#### Mesh

```
interface Mesh {
    type: string -> Class name of the [Any]Geometry
    primitives: any -> serialized result of the geometry
    material: number -> index of material used for rendering the mesh
}
```

#### Material

```
interface Material {
    type: string -> Class name of the [Any]Material
    primitives: any -> serialized result of the geometry
}
```