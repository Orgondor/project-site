import Locations from './locations';

export default `#version 300 es
  precision mediump float;
  in vec3 ${Locations.POSITION};
  in vec3 ${Locations.NORMAL};
  in vec3 ${Locations.TANGENT};
  in vec2 ${Locations.TEXTURE_COORDS};
  in vec3 ${Locations.VERTEX_COLOR};

  out vec3 lightVector;
  out vec3 pass_vertexColor;
  out vec2 pass_textureCoords;
  out vec3 surfaceNormal;
  out mat3 TBN;

  uniform mat4 ${Locations.TRANSFORMATION_MATRIX};
  uniform mat4 ${Locations.VIEW_MATRIX};
  uniform mat4 ${Locations.PROJECTION_MATRIX};
  uniform vec3 ${Locations.LIGHT_POSITION};

  void main() {
    mat4 worldViewProjectionMatrix = ${Locations.PROJECTION_MATRIX} * ${Locations.VIEW_MATRIX} * ${Locations.TRANSFORMATION_MATRIX};
    vec4 worldPos = worldViewProjectionMatrix * vec4(${Locations.POSITION}, 1.0);

    surfaceNormal = normalize((${Locations.TRANSFORMATION_MATRIX} * vec4(${Locations.NORMAL}, 0.0)).xyz);
    vec3 tangent = normalize((${Locations.TRANSFORMATION_MATRIX} * vec4(${Locations.TANGENT}, 0.0)).xyz);
    vec3 bitangent = cross(surfaceNormal, tangent);
    TBN = mat3(tangent, bitangent, surfaceNormal);

    lightVector = ${Locations.LIGHT_POSITION} - worldPos.xyz;
    gl_Position = worldPos;

    pass_textureCoords = ${Locations.TEXTURE_COORDS};
    pass_vertexColor = ${Locations.VERTEX_COLOR};
  }
`;
