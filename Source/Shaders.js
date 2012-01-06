/**
 * This file is part of the Feather javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.WebGL.prototype.shaders = 
{
	"vertex": [
		"uniform mat4 uProjectionMatrix;",
		"uniform mat4 uModelViewMatrix;",
		"uniform mat4 uNormalMatrix;",
		"uniform vec3 uAmbientLightColor;",
		"uniform vec3 uLightingDirection;",
		"uniform vec3 uDirectionalColor;",
		"uniform bool uUseLighting;",
		"",
		"attribute vec4 aVertex;",
		"attribute vec4 aNormal;",
		"attribute vec4 aColor;",
		"",
		"varying vec4 vColor;",
		"varying vec3 vLighting;",
		"",
		"void main(void)",
		"{",
		"gl_PointSize = 8.0;",
		"",
		"gl_Position = uProjectionMatrix * (uModelViewMatrix * aVertex);",
		"vColor = aColor;",
		"",
		"if (uUseLighting) {",
		"vec4 transformedNormal = uNormalMatrix * aNormal;",
		"float directionalLight = max(dot(transformedNormal.xyz, uLightingDirection), 0.0);",
		"vLighting = uAmbientLightColor + (uDirectionalColor * directionalLight);",
		"} else {",
		"vLighting = vec3(1.0, 1.0, 1.0);",
		"}",
		"}"
	],
	"fragment": [
		"#ifdef GL_ES",
		"precision highp float;",
		"#endif",
		"",
		"varying vec4 vColor;",
		"varying vec3 vLighting;",
		"",
		"void main(void)",
		"{",
		"gl_FragColor = vec4(vColor.rbg * vLighting, vColor.a);",
		"}"
	]
}