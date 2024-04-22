attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;
uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;
uniform mat4 uNormalMatrix;

const vec3 lightWorldPosition = vec3(50., 50., 50.);

varying vec3 vColor;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vSurfaceToLight;

void main(void) {
        // For normal
  vNormal = vec3(uNormalMatrix * vec4(normal, 1.0));

        // For fog
  vPosition = (Vmatrix * Mmatrix * vec4(position, 1.)).xyz;

        // For lighting
  vec3 surfaceWorldPosition = (Mmatrix * vec4(position, 1.0)).xyz;
  vSurfaceToLight = lightWorldPosition - surfaceWorldPosition;

  gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);
  vColor = color;
}