/**
 * This file is part of the Feather javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Renderer = function()
{
	this.zoom = 10;
	this.zoomSensitivity = 10;
	this.rotation = new Feather.Vector(0, 0, 0);
	this.translation = new Feather.Vector(0, 0, 0);
	this.changed = true;
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.ambientLight = new Feather.Color(0.75, 0.75, 0.75);
	this.directionalLight = new Feather.Color(0.25, 0.25, 0.25);
	this.lightDirection = new Feather.Vector(-0.25, 2.5, -10.0);
	this.lightDirection.normalize();

	this.projectionmode = Feather.ORTHOGRAPHIC;

	this.initMatrices();
	this.drawScene();
	this.tmp = false;
};

Feather.Renderer.prototype.setProjectionMode = function(mode)
{
	if (mode == Feather.ORTHOGRAPHIC)
	{
		var ratio = this.height / this.width;
		var zoom = this.zoom / this.zoomSensitivity;

		this.projectionMatrix3D.setOrtho(-zoom, zoom, zoom * ratio, -zoom * ratio, -1000, 1000);
	}
	else if (mode == Feather.PERSPECTIVE)
	{
		this.projectionMatrix3D.setPerspective(45, this.width/this.height, 0.1, 100);
	}
};

Feather.Renderer.prototype.initMatrices = function()
{
	// 3D Perspective Matrix
	this.projectionMatrix3D = new Feather.Matrix(4);
	this.setProjectionMode(Feather.ORTHOGRAPHIC);

	// 2D Perspective Matrix
	this.projectionMatrix2D = new Feather.Matrix(4);
	this.projectionMatrix2D.setOrtho(-this.width/2, this.width/2, this.height/2, -this.height/2, 0, 10);
};

Feather.Renderer.prototype.drawScene = function()
{
	if (this.changed)
	{
		var gl = this.webgl.context;
		gl.viewport(0, 0, this.width, this.height);

		// Setup the ModelView Matrix
		var modelviewMatrix3D = new Feather.Matrix(4);
		modelviewMatrix3D.setIdentity();
		modelviewMatrix3D.translate(this.translation.values[0], this.translation.values[1], this.translation.values[2]);
		modelviewMatrix3D.translate(0, 0, -1 - (this.zoom / this.zoomSensitivity));
		modelviewMatrix3D.rotateX(this.rotation.values[0]);
		modelviewMatrix3D.rotateY(this.rotation.values[1]);
		modelviewMatrix3D.rotateZ(this.rotation.values[2]);

		var modelviewMatrix2D = new Feather.Matrix(4);
		modelviewMatrix2D.setIdentity();

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniform3fv(this.webgl.UniformLocations['AmbientLightColor'], new Float32Array(this.ambientLight.values));
		gl.uniform3fv(this.webgl.UniformLocations['DirectionalColor'], new Float32Array(this.directionalLight.values));
		gl.uniform3fv(this.webgl.UniformLocations['LightingDirection'], new Float32Array(this.lightDirection.values));

		for (var i = 0; i < this.renderables.length; i++)
		{
			if (this.renderables[i].dimensions == 3)
			{
				gl.uniformMatrix4fv(this.webgl.MatrixLocations['Projection'], false, new Float32Array(this.projectionMatrix3D.values));
				this.renderables[i].render(gl, modelviewMatrix3D);
			}
			else
			{
				gl.uniformMatrix4fv(this.webgl.MatrixLocations['Projection'], false, new Float32Array(this.projectionMatrix2D.values));
				this.renderables[i].render(gl, modelviewMatrix2D);
			}
		}

		this.changed = false;
	}
};

Feather.Renderer.prototype.zoomIn = function()
{
	this.zoom++;

	this.setProjectionMode(Feather.ORTHOGRAPHIC);

	this.changed = true;
};

Feather.Renderer.prototype.zoomOut = function()
{
	if (this.zoom > 0)
		this.zoom--;

	this.setProjectionMode(Feather.ORTHOGRAPHIC);

	this.changed = true;
};

Feather.Renderer.prototype.setZoom = function(zoom)
{
	this.zoom = zoom;

	this.setProjectionMode(Feather.ORTHOGRAPHIC);

	this.changed = true;
};

Feather.Renderer.prototype.rotate = function(x, y, z)
{
	this.rotation.values[0] += x;
	this.rotation.values[1] += y;
	this.rotation.values[2] += z;

	this.changed = true;
};

Feather.Renderer.prototype.translate = function(x, y, z)
{
	this.translation.values[0] += x;
	this.translation.values[1] += y;
	this.translation.values[2] += z;

	this.changed = true;
};