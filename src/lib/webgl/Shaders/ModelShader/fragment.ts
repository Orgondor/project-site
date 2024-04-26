import Locations from './locations';

export default `#version 300 es
  precision mediump float;
  in vec3 pass_vertexColor;

  in vec2 pass_textureCoords;
  in vec3 lightVector;
  in vec3 surfaceNormal;
  in mat3 TBN;

  out vec4 outColor;

  uniform sampler2D ${Locations.DIFFUSE_TEXTURE};
  uniform sampler2D ${Locations.NORMAL_MAP_TEXTURE};

  uniform vec3 ${Locations.LIGHT_COLOR};
  uniform float ${Locations.LIGHT_AMBIENT};

  vec4 getDiffuseTexture() {
    return texture(${Locations.DIFFUSE_TEXTURE}, pass_textureCoords);
  }

  vec3 getNormal() {
    //return surfaceNormal;
    return normalize(TBN * (texture(${Locations.NORMAL_MAP_TEXTURE}, pass_textureCoords).rgb * 2.0 - 1.0));
  }

  float nDot() {
    vec3 unitNormal = getNormal();
    vec3 unitLightVector = normalize(lightVector);
    return dot(unitNormal, unitLightVector);
  }

  vec4 diffuseLighting() {
    float brightness = max(nDot(), ${Locations.LIGHT_AMBIENT});
    return vec4(brightness * ${Locations.LIGHT_COLOR}.rgb, 1.0);
  }

  void main() {
    outColor = vec4(pass_vertexColor, 1.0) * diffuseLighting() * getDiffuseTexture();
    // float ndot = nDot();
    // outColor = vec4(ndot, ndot, ndot, 1.0);
  }
`;
