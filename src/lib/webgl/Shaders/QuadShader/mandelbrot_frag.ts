import Locations from './locations';

export default `#version 300 es
  precision mediump float;

  uniform float ${Locations.UPTIME};

  in vec2 pass_textureCoords;
  in vec3 surfaceNormal;

  out vec4 outColor;

  #define MAX_STEPS 100
  #define MAX_LENGTH 1000000.
  #define E 2.718281828459045
  #define PI 3.141592653589793

  vec2 calcStep(vec2 pos, vec2 startPos) {
    return vec2(pos.x * pos.x - pos.y * pos.y, 2. * (pos.x * pos.y)) + startPos;
  }

  void main() {
    vec2 uv = pass_textureCoords;
    uv -= 0.5; // put 0, 0 in the center

    float timeCurve = cos(${Locations.UPTIME}*PI*0.1);
    
    float timeZoom = timeCurve * .5 + .5;
    vec2 uvFar = uv * timeZoom;

    timeZoom = -timeCurve * 5000. + 5000.;
    vec2 uvClose = uv / timeZoom;

    uv = uvFar;

    float startZoom = 2.7;
    vec2 startPos = vec2((uv.x - 0.384) * startZoom, (uv.y + 0.132) * startZoom);
    vec2 stepPos = startPos;
    float breakStep = 0.;
    for (int i=0; i<MAX_STEPS; i++) {
      if (length(stepPos) > MAX_LENGTH) {
        breakStep = float(i);
        break;
      }
      stepPos = calcStep(stepPos, startPos);
    }

    float rb = clamp(breakStep, 0., 1.);

    vec3 color = vec3(rb * clamp(breakStep * breakStep / float(MAX_STEPS), 0., 1.), clamp(breakStep * 2. / float(MAX_STEPS), 0., 1.), rb * clamp(breakStep * 0.2 / float(MAX_STEPS), 0., 1.));

    outColor = vec4(color,1);
  }
`;
