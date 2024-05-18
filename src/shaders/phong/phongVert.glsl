attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_worldMatrix;
uniform mat4 u_normalMatrix;
uniform mat4 u_viewProjectionMatrix;

varying vec3 v_normal;
varying vec3 v_fragPos;

void main() {
    v_fragPos = vec3(u_worldMatrix * a_position);
    v_normal = (u_normalMatrix * vec4(a_normal, 1.0)).xyz;
    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
}