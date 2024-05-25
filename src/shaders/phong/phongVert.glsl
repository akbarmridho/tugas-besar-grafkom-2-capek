attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;

uniform mat4 u_worldMatrix;
uniform mat4 u_normalMatrix;
uniform mat4 u_viewProjectionMatrix;
uniform sampler2D u_displacementMap;
uniform float u_displacementScale;
uniform float u_displacementBias;
uniform float u_hasDisplacementMap;

varying vec3 v_normal;
varying vec3 v_fragPos;
varying vec2 v_texcoord;
varying mat3 v_tbnMatrix;

void main() {
    vec3 normal = normalize(a_normal);

    vec4 position;
    if(u_hasDisplacementMap == 1.0) {
        position = a_position + vec4(((texture2D(u_displacementMap, a_texcoord).rgb * u_displacementScale + u_displacementBias) * normal), 0.0);
    } else {
        position = a_position;
    }

    vec3 tangent = normalize(vec3(u_normalMatrix * vec4(a_tangent, 0.0)));
    vec3 bitangent = normalize(vec3(u_normalMatrix * vec4(a_bitangent, 0.0)));
    v_normal = normalize(vec3(u_normalMatrix * vec4(normal, 0.0)));
    v_tbnMatrix = mat3(tangent, bitangent, v_normal);

    v_fragPos = vec3(u_worldMatrix * position);
    v_texcoord = a_texcoord;

    gl_Position = u_viewProjectionMatrix * u_worldMatrix * position;
}