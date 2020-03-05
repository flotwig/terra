// precision mediump float;
// precision mediump int;

varying vec3 vPosition;
// varying vec4 vColor;

// uniform float u_time;
// uniform vec2 u_resolution;
uniform vec2 zRange;


void main() {
  float p = (vPosition.z + zRange.x) / (zRange.x - zRange.y);
  gl_FragColor = vec4(0,p/2.0 + 0.4, .1 * p,1.0);
}
