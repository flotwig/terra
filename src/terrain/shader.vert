varying vec3 vPosition;
// varying vec4 vColor;

void main()	{

  vPosition = position;
  // vColor = color;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
