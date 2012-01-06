#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec3 vLighting;

void main(void)
{
	gl_FragColor = vec4(vColor.rbg * vLighting, vColor.a);
}