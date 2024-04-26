import Locations from './locations';

export default `#version 300 es
  precision mediump float;
  in vec3 ${Locations.POSITION};
  in vec3 ${Locations.NORMAL};
  in vec2 ${Locations.TEXTURE_COORDS};

  out vec2 pass_textureCoords;
  out vec3 surfaceNormal;

  uniform mat4 ${Locations.TRANSFORMATION_MATRIX};
  uniform mat4 ${Locations.VIEW_MATRIX};
  uniform mat4 ${Locations.PROJECTION_MATRIX};

  void main() {
    mat4 worldViewProjectionMatrix = ${Locations.PROJECTION_MATRIX} * ${Locations.VIEW_MATRIX} * ${Locations.TRANSFORMATION_MATRIX};
    vec4 worldPos = worldViewProjectionMatrix * vec4(${Locations.POSITION}, 1.0);

    surfaceNormal = normalize((${Locations.TRANSFORMATION_MATRIX} * vec4(${Locations.NORMAL}, 0.0)).xyz);

    gl_Position = worldPos;

    pass_textureCoords = ${Locations.TEXTURE_COORDS};
  }
`;
