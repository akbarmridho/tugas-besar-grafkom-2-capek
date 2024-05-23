precision mediump float;

struct AmbientLight {
    vec4 color;
    float intensity;
};

// Ambient Light
uniform AmbientLight u_ambientLight;

#ifdef WITH_TEXTURE
varying vec2 v_texcoord;
uniform sampler2D u_texture;
#else
uniform vec4 u_color;
#endif

void main() {
    #ifdef WITH_TEXTURE
    gl_FragColor = vec4(u_ambientLight.color.rgb * u_ambientLight.intensity * texture2D(u_texture, v_texcoord).rgb, 1.0);
    #else
    gl_FragColor = vec4(u_ambientLight.color.rgb * u_ambientLight.intensity * u_color.rgb, u_color.a);
    #endif
}