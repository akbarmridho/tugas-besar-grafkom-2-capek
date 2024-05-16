precision mediump float;

//uniform vec4 u_lightColor;
uniform vec4 u_color;

void main() {
//    gl_FragColor = u_color * u_lightColor; // Ia = ka * La
    gl_FragColor = u_color;
}