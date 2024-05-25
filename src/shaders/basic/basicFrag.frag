precision mediump float;

struct AmbientLight {
    vec4 color;
    float intensity;
};

// Ambient Light
uniform AmbientLight u_ambientLight;

varying vec2 v_texcoord;
uniform sampler2D u_texture;

void main() {
    gl_FragColor = vec4(u_ambientLight.color.rgb * u_ambientLight.intensity * texture2D(u_texture, v_texcoord).rgb, 1.0);
}