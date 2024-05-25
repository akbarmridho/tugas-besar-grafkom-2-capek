attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;

uniform mat4 u_worldMatrix;
uniform mat4 u_normalMatrix;
uniform mat4 u_viewProjectionMatrix;

varying vec3 v_normal;
varying vec3 v_fragPos;
varying vec2 v_texcoord;
varying mat3 v_tbnMatrix;

void main() {
    v_fragPos = vec3(u_worldMatrix * a_position);
    v_texcoord = a_texcoord;

    vec3 tangent = normalize(vec3(u_normalMatrix * vec4(a_tangent, 0.0)));
    vec3 bitangent = normalize(vec3(u_normalMatrix * vec4(a_bitangent, 0.0)));
    v_normal = normalize(vec3(u_normalMatrix * vec4(a_normal, 0.0)));
    v_tbnMatrix = mat3(tangent, bitangent, v_normal);

    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
}