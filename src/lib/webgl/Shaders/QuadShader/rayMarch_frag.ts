import Locations from './locations';

export default `#version 300 es
  precision mediump float;

  uniform float ${Locations.UPTIME};

  in vec2 pass_textureCoords;
  in vec3 surfaceNormal;

  out vec4 outColor;

  #define MAX_MARCH_STEPS 100
  #define MAX_DIST 100.
  #define SURF_DIST .01

  float GetSphereDist(vec3 pos, vec3 spherePos, float radius) {
    return length(pos-spherePos)-radius;
  }

  float GetCapsuleDist(vec3 pos, vec3 capsulePosA, vec3 capsulePosB, float radius) {
    vec3 ap = pos - capsulePosA;
    vec3 ab = capsulePosB - capsulePosA;
    float proj = clamp(dot(ap, ab) / dot(ab, ab), 0., 1.);

    vec3 closest = capsulePosA + proj * ab;

    return length(pos-closest)-radius;
  }

  float GetCylinderDist(vec3 pos, vec3 cylinderPosA, vec3 cylinderPosB, float radius) {
    vec3 ap = pos - cylinderPosA;
    vec3 ab = cylinderPosB - cylinderPosA;
    float proj = dot(ap, ab) / dot(ab, ab);

    vec3 closest = cylinderPosA + proj * ab;

    float infCylinderDist = length(pos-closest)-radius;
    float perpendicularDistToCap = (abs(proj - 0.5) - 0.5) * length(ab);
    float exteriorDist = length(max(vec2(infCylinderDist, perpendicularDistToCap), 0.));
    float interorDist = min(max(infCylinderDist, perpendicularDistToCap), 0.);

    return exteriorDist + interorDist;
  }

  float GetTorusDist(vec3 pos, vec3 torusPos, float radius, float thickness) {
    vec3 p = pos - torusPos;

    float planeDist = length(p.xz) - radius;

    return length(vec2(planeDist,p.y))-thickness;
  }

  float GetBoxDist(vec3 pos, vec3 boxPos, float size) {
    vec3 p = pos - boxPos;
    return length(max(abs(p)-size, 0.));
  }

  float GetPlaneDist(vec3 pos, vec3 planeNormal) {
    return dot(pos, planeNormal);
  }

  float GetDist(vec3 pos) {
    float planeDist = GetPlaneDist(pos, vec3(0, 1, 0));
    float capsuleDist = GetCapsuleDist(pos,vec3(0, 2, 9),vec3(0, 4, 9) + vec3(sin(${Locations.UPTIME} * 2.5), 0, cos(${Locations.UPTIME} * 2.5)) * 3., (cos(${Locations.UPTIME})+1.5)*.2);
    float sphereDist = GetSphereDist(pos,vec3(2, 1, 7) + vec3(sin(${Locations.UPTIME} * 2.5), 0, cos(${Locations.UPTIME} * 2.5)) * 0.5, 1.);
    float torusDist = GetTorusDist(pos,vec3(-1, 0.5, 7. + cos(${Locations.UPTIME} * .5)), (sin(${Locations.UPTIME} * 3.2) + 2.) * .5, (cos(${Locations.UPTIME} * 5.) + 2.) * .1);
    float boxDist = GetBoxDist(pos,vec3(-.5, .7, 6.2), (sin(${Locations.UPTIME}) + 2.) * .1);
    float cylinderDist = GetCylinderDist(pos, vec3(-1, 1, 8), vec3(-2.5, 2, 6), .4);

    float dist = min(planeDist, capsuleDist);
    dist = min(dist, sphereDist);
    dist = min(dist, torusDist);
    dist = min(dist, boxDist);
    dist = min(dist, cylinderDist);

    return dist;
  }

  vec3 GetNormal(vec3 pos) {
    float dist = GetDist(pos);
    vec2 e = vec2(.01, 0);

    vec3 normal = dist - vec3(
      GetDist(pos-e.xyy),
      GetDist(pos-e.yxy),
      GetDist(pos-e.yyx)
    );
    return normalize(normal);
  }

  float RayMarch (vec3 rayOrigin, vec3 rayDir) {
    float dist = 0.;

    for (int i=0; i<MAX_MARCH_STEPS; i++) {
      vec3 stepPos = rayOrigin + rayDir*dist;
      float stepDist = GetDist(stepPos);
      dist += stepDist;
      if (dist > MAX_DIST || stepDist < SURF_DIST) {
        break;
      }
    }

    return dist;
  }

  float GetLight(vec3 pos, vec3 normal) {
    vec3 lightPos = vec3(0,8,6);
    lightPos.xz += vec2(sin(${Locations.UPTIME}), cos(${Locations.UPTIME}))*4.;
    vec3 posToLightDir = normalize(lightPos-pos);

    float diffuse = clamp(dot(normal, posToLightDir), 0., 1.);
    float dist = RayMarch(pos+normal*SURF_DIST*2., posToLightDir);
    if (dist < length(lightPos-pos)) {
      diffuse *= 0.1;
    }

    return diffuse;
  }

  void main() {
    vec2 uv = pass_textureCoords;
    uv -= 0.5; // put 0, 0 in the center

    vec3 rayOrigin = vec3(0, 3, 0);
    vec3 rayDir = normalize(vec3(uv.x, uv.y-.2, 1));

    float dist = RayMarch(rayOrigin, rayDir);
    
    vec3 pos = rayOrigin + rayDir * dist;
    vec3 normal = GetNormal(pos);

    float lightVal = GetLight(pos, normal);

    vec3 color = vec3(lightVal);

    outColor = vec4(color,1);
  }
`;
