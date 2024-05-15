attribute vec4 a_position;

uniform mat4 u_worldMatrix;
uniform mat4 u_viewProjectionMatrix;

void main() {
    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
}