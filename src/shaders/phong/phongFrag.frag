precision mediump float;

uniform vec4 u_color;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform vec4 u_lightColor;
uniform float u_shininess;
uniform vec3 u_lightPos;
uniform vec3 u_viewPos;

varying vec3 v_normal;
varying vec3 v_fragPos;

void main() {
    // ambient
    vec3 ambient = u_color.rgb;

    // diffuse
    vec3 norm = normalize(v_normal);
    vec3 lightDir = normalize(u_lightPos - v_fragPos);
    float diffuseStrength = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diffuseStrength * u_diffuseColor.rgb;

    // specular
    vec3 viewDir = normalize(u_viewPos - v_fragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float specularStrength = pow(max(dot(norm, halfwayDir), 0.0), u_shininess);
    vec3 specular = specularStrength * u_specularColor.rgb;

    // result
    vec3 color = ambient * u_lightColor.rgb + diffuse + specular;
    gl_FragColor = vec4(color, u_color.a);
}