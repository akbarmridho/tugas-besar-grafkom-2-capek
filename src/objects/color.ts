import { Serializable } from "./serializable";

export interface ColorSerialized {
    r: number;
    g: number;
    b: number;
}

export class Color extends Serializable<ColorSerialized> {
    /* Attribute */
    private r: number;
    private g: number;
    private b: number;

    /* Constructor */
    constructor(r: number, g: number, b: number) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /* Methods*/
    clone(): Color {
        return new Color(this.r, this.g, this.b);
    }

    copy(otherColor: Color): Color {
        this.r = otherColor.r;
        this.g = otherColor.g;
        this.b = otherColor.b;
        return this;
    }

    toJSON(): ColorSerialized {
        return {
            r: this.r,
            g: this.g,
            b: this.b
        };
    }
}