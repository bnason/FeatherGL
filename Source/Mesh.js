/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Mesh = function(vertices, vertexIndexArray, normals, colors, type)
{
	/* Mesh Type
	 * The following values are accepted :
	 * POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
	 */
	this.type = type || Feather.MESH_TRIANGLES;
	this.texture = null;

	// Vertex info arrays
	this.vertices = vertices || new Array();
	this.normals = normals || new Array();
	this.colors = colors || new Array();

	this.vertexIndexArray = vertexIndexArray || new Array();

	this.vertexArray = new Array();

	this.modelview = new Feather.Matrix(4);
	this.modelview.setIdentity();

	this.transformer = function(){};

	// Lighting info
	this.lighting = true;

	this.changed = true;
	this.lastUpdated = new Date().getTime();
};

Feather.Mesh.prototype.update = function()
{
	if (this.changed)
	{
		this.updateVertexArray();

		this.changed = false;

		this.transformer();

		this.lastUpdated = new Date().getTime();
	}
};

Feather.Mesh.prototype.render = function(webgl, modelviewMatrixIn)
{
	this.update(webgl);

//	console.log("Mesh");
//	console.log("Vertices: ", this.vertices, this.vertices.length);
//	console.log("Indices: ", this.vertexIndexArray, this.vertexIndexArray.length);
//	console.log("Normals: ", this.normals, this.normals.length);
//	console.log("Colors: ", this.colors, this.colors.length);
//	console.log("Vertex Array: ", this.vertexArray, this.vertexArray.length);

	webgl.updateBuffers(this, this.vertexArray, this.vertexIndexArray);

	// Get the WebGL Drawing Context
	var gl = webgl.context;

	var modelviewMatrix = Feather.Matrix.multiply(modelviewMatrixIn, this.modelview);

//	console.log("Modelview Matrix:", modelviewMatrix, modelviewMatrix.values);

	// Generate the Normal Matrix
	var normalMatrix = new Feather.Matrix(4);
	normalMatrix.copy(modelviewMatrix);
	normalMatrix.invert();
	normalMatrix.transpose();

	// Set the ModelView and Normal Matrix data
	gl.uniformMatrix4fv(webgl.MatrixLocations['ModelView'], false, new Float32Array(modelviewMatrix.values));
	gl.uniformMatrix4fv(webgl.MatrixLocations['Normal'], false, new Float32Array(normalMatrix.values));

	gl.uniform1i(webgl.UniformLocations['UseLighting'], this.lighting);

	// Bind the vertex array and index data
	gl.bindBuffer(gl.ARRAY_BUFFER, webgl.getVertexBuffer(this));
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl.getIndexBuffer(this));

	// Set where the Attribute data locations
	gl.vertexAttribPointer(webgl.AttributeLocations['Vertex'], 4, gl.FLOAT, false, 48, 0);
	gl.vertexAttribPointer(webgl.AttributeLocations['Normal'], 4, gl.FLOAT, false, 48, 16);
	gl.vertexAttribPointer(webgl.AttributeLocations['Color'], 4, gl.FLOAT, false, 48, 32);

	// Determine type
	switch (this.type)
	{
		case Feather.MESH_TRIANGLES: var type = gl.TRIANGLES; break;
		case Feather.MESH_TRIANGLE_STRIP: var type = gl.TRIANGLE_STRIP; break;
		case Feather.MESH_TRIANGLE_FAN: var type = gl.TRIANGLE_FAN; break;
		case Feather.MESH_LINES: var type = gl.LINES; break;
		case Feather.MESH_LINE_LOOP: var type = gl.LINE_LOOP; break;
		case Feather.MESH_POINTS: var type = gl.POINTS; break;
	}
	
	// Draw!
	gl.drawElements(type, this.vertexIndexArray.length, gl.UNSIGNED_SHORT, 0);
};

Feather.Mesh.prototype.setType = function(type)
{
	this.type = type;

	if (this.webgl != null)
		this.updateBuffers(this.webgl.context);

	this.changed = true;
};

Feather.Mesh.prototype.setTransformer = function(transformer)
{
	this.transformer = transformer;

	this.changed = true;
};

Feather.Mesh.prototype.setTexture = function(texture)
{
	this.texture = texture;

	if (this.webgl != null)
		this.updateBuffers(this.webgl.context);

	this.changed = true;
};

Feather.Mesh.prototype.addVertex = function(vertex, normal, color)
{
	this.vertices.push(vertex || new Feather.Point().setXYZ(0, 0, 0));
	this.normals.push(normal || new Feather.Vector().setXYZ(0, 0, 1));
	this.colors.push(color || new Feather.Color().setRGBA(0, 0, 0, 1));
};

Feather.Mesh.prototype.addIndex = function(index) { this.vertexIndexArray.push(index); };

Feather.Mesh.prototype.updateVertexArray = function(vertex)
{
	this.vertexArray = new Array();

	for (var i = 0; i < this.vertices.length; i++)
	{
		var vertex = this.vertices[i];
		for (var j = 0; j < 3; j++)
			if (j < vertex.length)
				this.vertexArray.push(vertex[j]);
			else
				this.vertexArray.push(0);
		this.vertexArray.push(1);

		var normal = this.normals[i];
		for (var j = 0; j < 3; j++)
			if (j < normal.length)
				this.vertexArray.push(normal[j]);
			else
				this.vertexArray.push(0);
		this.vertexArray.push(0);

		var color = this.colors[i];
		for (var j = 0; j < color.length; j++)
			this.vertexArray.push(color[j]);
	}
};

Feather.Mesh.prototype.getVertexArray = function()
{
	return this.vertexArray;
};

Feather.Mesh.prototype.rotateX = function(angle) { this.modelview.rotateX(angle); this.changed = true; };
Feather.Mesh.prototype.rotateY = function(angle) { this.modelview.rotateY(angle); this.changed = true; };
Feather.Mesh.prototype.rotateZ = function(angle) { this.modelview.rotateZ(angle); this.changed = true; };
Feather.Mesh.prototype.rotate = function(angle, axis)
{
	this.modelview.rotateX(angle * axis[0]);
	this.modelview.rotateY(angle * axis[1]);
	this.modelview.rotateZ(angle * axis[2]);

	this.changed = true;
};

Feather.Mesh.prototype.translateX = function(length) { this.modelview.translateX(length); this.changed = true; };
Feather.Mesh.prototype.translateY = function(length) { this.modelview.translateY(length); this.changed = true; };
Feather.Mesh.prototype.translateZ = function(length) { this.modelview.translateZ(length); this.changed = true; };
Feather.Mesh.prototype.translate = function(x, y, z)
{
	this.modelview.translateX(x);
	this.modelview.translateY(y);
	this.modelview.translateZ(z);

	this.changed = true;
};