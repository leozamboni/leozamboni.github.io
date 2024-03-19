varying vec3 vertexNormal; // (0, 0, 0)
void main() {
  float intensity = pow(0.75 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
  gl_FragColor = vec4(1.00, 0.74, 0.01, 1.0) * intensity;
}