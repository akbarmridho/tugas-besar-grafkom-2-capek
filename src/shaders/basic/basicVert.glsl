attribute vec4 a_position;

#ifdef WITH_TEXTURE
attribute vec2 a_texcoord;
#endif

uniform mat4 u_worldMatrix;
uniform mat4 u_viewProjectionMatrix;

#ifdef WITH_TEXTURE
varying vec2 v_texcoord;
#endif

void main() {
    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;

    #ifdef WITH_TEXTURE
    v_texcoord = a_texcoord;
    #endif
}