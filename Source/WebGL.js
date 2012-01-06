/**
 * This file is part of the Feather javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.WebGL = function(canvas)
{
	this.canvas = canvas;
	this.meshes = new Array();
	this.vertexBuffers = new Array();
	this.indexBuffers = new Array();
	this.meshBuffers = new Array();

	try
	{
		this.context = this.canvas.getContext('experimental-webgl', { antialias: true });
		if (this.context == null)
			this.context = this.canvas.getContext('webgl', { antialias: true });
	} catch(e)
	{
		console.log(e);
		return;
	}

	var gl = this.context;

	// Setup
	gl.clearColor(0, 0, 0, 0);
	gl.clearDepth(1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.LIGHTING);
//	gl.enable(0x0B10);
//	gl.enable(gl.GL_LINE_SMOOTH);
	gl.enable(0x8642)
//	gl.enable(gl.TEXTURE_2D);

	// Create Shader Program
	this.ShaderProgram = gl.createProgram();

	var vertexShader = this.getShader(gl.VERTEX_SHADER, this.shaders['vertex'].join("\n"));
	gl.attachShader(this.ShaderProgram, vertexShader);

	var fragmentShader = this.getShader(gl.FRAGMENT_SHADER, this.shaders['fragment'].join("\n"));
	gl.attachShader(this.ShaderProgram, fragmentShader);

	gl.linkProgram(this.ShaderProgram);

	if (!gl.getProgramParameter(this.ShaderProgram, gl.LINK_STATUS))
		console.log("Unable to intialize the shader program.");

	gl.useProgram(this.ShaderProgram);

	// Save Matrix Locations
	this.MatrixLocations = new Array();
	this.MatrixLocations['Projection'] = gl.getUniformLocation(this.ShaderProgram, "uProjectionMatrix");
	this.MatrixLocations['ModelView'] = gl.getUniformLocation(this.ShaderProgram, "uModelViewMatrix");
	this.MatrixLocations['Normal'] = gl.getUniformLocation(this.ShaderProgram, "uNormalMatrix");

	// Save Attribute Locations
	this.AttributeLocations = new Array();
	this.AttributeLocations['Vertex'] = gl.getAttribLocation(this.ShaderProgram, "aVertex");
	this.AttributeLocations['Normal'] = gl.getAttribLocation(this.ShaderProgram, "aNormal");
	this.AttributeLocations['Color'] = gl.getAttribLocation(this.ShaderProgram, "aColor");

	gl.enableVertexAttribArray(this.AttributeLocations['Vertex']);
	gl.enableVertexAttribArray(this.AttributeLocations['Normal']);
	gl.enableVertexAttribArray(this.AttributeLocations['Color']);

	// Save Uniform Locations
	this.UniformLocations = new Array();
	this.UniformLocations['AmbientLightColor'] = gl.getUniformLocation(this.ShaderProgram, "uAmbientLightColor");
	this.UniformLocations['LightingDirection'] = gl.getUniformLocation(this.ShaderProgram, "uLightingDirection");
	this.UniformLocations['DirectionalColor'] = gl.getUniformLocation(this.ShaderProgram, "uDirectionalColor");
	this.UniformLocations['UseLighting'] = gl.getUniformLocation(this.ShaderProgram, "uUseLighting");
};

Feather.WebGL.prototype.updateBuffers = function(mesh, vertexArray, indexArray)
{
	var id = this.meshes.indexOf(mesh)
	if (id == -1)
	{
		this.meshes.push(mesh);

		id = this.meshes.indexOf(mesh);

		this.vertexBuffers[id] = this.context.createBuffer();
		this.indexBuffers[id] = this.context.createBuffer();
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[id]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffers[id]);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
};

Feather.WebGL.prototype.getVertexBuffer = function(mesh)
{
	var id = this.meshes.indexOf(mesh);

	if (id != -1)
		return this.vertexBuffers[id];

	return null;
};

Feather.WebGL.prototype.getIndexBuffer = function(mesh)
{
	var id = this.meshes.indexOf(mesh);

	if (id != -1)
		return this.indexBuffers[id];

	return null;
};

Feather.WebGL.prototype.getShader = function(type, source)
{
	gl = this.context;
	shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.log("An error occurred compiling the shader: " + type + "\n" + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
};