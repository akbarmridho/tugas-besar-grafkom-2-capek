precision mediump float;

struct AmbientLight {
    vec4 color;
    float intensity;
};

struct DirectionalLight {
    vec4 color;
    vec3 direction;
    float intensity;
};

// Material Attribute
uniform vec4 u_color;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;

// View Position
uniform vec3 u_viewPos;

// Ambient Light
uniform AmbientLight u_ambientLight;

// Directional Light
uniform DirectionalLight u_directionalLight;

// Variable from vertex shader
varying vec3 v_normal;
varying vec3 v_fragPos;

// Calculate the impact of light from directional light
vec3 calculateDirLight(DirectionalLight light, vec3 normal, vec3 viewDir) {
    vec3 lightDir = normalize(light.direction);

    // Ambient component
    vec3 ambient = light.color.rgb * light.intensity * u_color.rgb;

    // Diffuse component
    float diffuseStrength = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diffuseStrength * light.intensity * u_diffuseColor.rgb;

    // Specular component
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float specularStrength = pow(max(dot(normal, halfwayDir), 0.0), u_shininess);
    vec3 specular = specularStrength * light.intensity * u_specularColor.rgb;

    return (ambient + diffuse + specular);
}

void main() {
    // Initalize needed value
    vec3 viewDir = normalize(u_viewPos - v_fragPos);

    // Impact of light from ambient light
    vec3 result = u_ambientLight.color.rgb * u_ambientLight.intensity * u_color.rgb;

    // Impact of light from directional light
    result += calculateDirLight(u_directionalLight, normalize(v_normal), viewDir);

    gl_FragColor = vec4(result, u_color.a);
}