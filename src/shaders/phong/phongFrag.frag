precision mediump float;

struct AmbientLight {
    vec4 color;
    float intensity;
};

struct DirectionalLight {
    vec4 color; // ambient color
    vec3 direction; // direction
    float intensity;
};

struct PointLight {
    vec4 color;
    vec3 position;
    float intensity;
    float radius;

    float constant;
    float linear;
    float quadratic;
};

// Material Attribute
uniform vec4 u_color;
uniform sampler2D u_diffuseMap;
uniform sampler2D u_specularMap;
uniform float u_shininess;
uniform sampler2D u_normalMap;
uniform float u_hasNormalMap;

// View Position
uniform vec3 u_viewPos;

// Ambient Light
uniform AmbientLight u_ambientLight;

// Directional Light
uniform DirectionalLight u_directionalLight;

// Point Light
const int MAX_LIGHTS = 5;
uniform PointLight u_pointLights[MAX_LIGHTS];
uniform int u_num_lights;

// Variable from vertex shader
varying vec3 v_normal;
varying vec3 v_fragPos;
varying vec2 v_texcoord;
varying mat3 v_tbnMatrix;

// Calculate the impact of light from directional light
vec3 calculateDirLight(DirectionalLight light, vec3 normal, vec3 viewDir) {
    vec3 lightDir = normalize(-light.direction);

    // Ambient component
    vec3 ambient = light.color.rgb * light.intensity * u_color.rgb;

    // Diffuse component
    float diffuseStrength = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = light.color.rgb * diffuseStrength * light.intensity * texture2D(u_diffuseMap, v_texcoord).rgb;

    // Specular component
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float specularStrength = pow(max(dot(normal, halfwayDir), 0.0), u_shininess);
    vec3 specular = light.color.rgb * specularStrength * light.intensity * texture2D(u_specularMap, v_texcoord).rgb;

    return (ambient + diffuse + specular);
}

// Calculate the impact of light from point light
vec3 calculatePointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
    vec3 lightDir = normalize(light.position - fragPos);

    float lambertTerm = dot(normal, lightDir);

    if(lambertTerm > 0.0) {
        // Attenuation
        float distance = length(light.position - fragPos);
        if(light.radius > 0.0) {
            distance = distance / light.radius;
        }
        float attenuation = 1.0 / (light.constant + (light.linear * distance) + (light.quadratic * distance * distance));

        // Ambient component
        vec3 ambient = light.color.rgb * light.intensity * u_color.rgb;

        // Diffuse component
        float diffuseStrength = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = light.color.rgb * diffuseStrength * light.intensity * texture2D(u_diffuseMap, v_texcoord).rgb;

        // Specular component
        vec3 halfwayDir = normalize(lightDir + viewDir);
        float specularStrength = pow(max(dot(normal, halfwayDir), 0.0), u_shininess);
        vec3 specular = light.color.rgb * specularStrength * light.intensity * texture2D(u_specularMap, v_texcoord).rgb;

        return ((ambient) + (diffuse * attenuation) + (specular * attenuation));
    }

    return vec3(0.0, 0.0, 0.0);
}

void main() {
    // Initalize needed 
    vec3 norm;

    if(u_hasNormalMap == 1.0) {
        norm = texture2D(u_normalMap, v_texcoord).rgb;
        norm = norm * 2.0 - 1.0;
        norm = normalize(v_tbnMatrix * norm);
    } else {
        norm = v_normal;
    }

    vec3 viewDir = normalize(u_viewPos - v_fragPos);

    // Impact of light from ambient light
    vec3 result = u_ambientLight.color.rgb * u_ambientLight.intensity * texture2D(u_diffuseMap, v_texcoord).rgb;

    // Impact of light from directional light
    result += calculateDirLight(u_directionalLight, norm, viewDir);

    // Impact of light from points light
    for(int i = 0; i < MAX_LIGHTS; i++) {
        if(i >= u_num_lights) {
            break;
        }
        result += calculatePointLight(u_pointLights[i], norm, v_fragPos, viewDir);
    }

    gl_FragColor = vec4(result, u_color.a);
}