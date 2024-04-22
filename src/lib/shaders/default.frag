precision mediump float;
varying vec3 vColor;

vec4 u_fogColor = vec4(174. / 255., 185. / 255., 255. / 255., 1.);
float u_fogNear = 0.1;
float u_fogFar = 300.;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vSurfaceToLight;

const vec3 source_ambient_color = vec3(1., 1., 1.);
const vec3 source_diffuse_color = vec3(1., 1., 1.);
const vec3 source_specular_color = vec3(1., 1., 1.);

const vec3 mat_ambient_color = vec3(0.8, 0.8, 0.8);
const vec3 mat_diffuse_color = vec3(0.8, 0.8, 0.8);
const vec3 mat_specular_color = vec3(0.4, 0.4, 0.4);
const float mat_shininess = 0.2;

void main(void) {
  vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
  vec3 normal = normalize(vNormal);

  vec3 I_ambient = source_ambient_color * mat_ambient_color;

  vec3 I_diffuse = source_diffuse_color * mat_diffuse_color * max(0., dot(vNormal, surfaceToLightDirection));

  vec3 V = normalize(vPosition);
  vec3 R = reflect(surfaceToLightDirection, normal);

  vec3 I_specular = source_specular_color * mat_specular_color * pow(max(dot(R, V), 0.), mat_shininess);

  vec3 I = I_ambient + I_diffuse + I_specular;

  vec4 color = vec4(I * vColor, 1.);

  float fogDistance = length(vPosition);
  float fogAmount = smoothstep(u_fogNear, u_fogFar, fogDistance);

  gl_FragColor = mix(color, u_fogColor, fogAmount);
}