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
mat3 normalMat = mat3(u_normalMatrix);

vec3 tangent = normalize(vec3(normalMat * a_tangent));
vec3 bitangent = normalize(vec3(normalMat * a_bitangent));
vec3 normal = normalize(vec3(normalMat * a_normal));

vec3 position = vec3(u_worldMatrix * a_position);
if(u_hasDisplacementMap == 1.0) {
position = position + (((texture2D(u_displacementMap, a_texcoord).r * u_displacementScale) + u_displacementBias) * normal);
}

v_tbnMatrix = mat3(tangent, bitangent, normal);
v_fragPos = position;
v_normal = normal;
v_texcoord = a_texcoord;

gl_Position = u_viewProjectionMatrix * vec4(position, 1.0);
}