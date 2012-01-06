/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Camera = function(location, gaze, width, height)
{
	this.location = location || new Feather.Point(0, 0, 0);
	this.gaze = gaze || new Feather.Vector(0, 0, -1);

	this.width = 0 || width;
	this.height = 0 || height;
	this.aspect = this.width / this.height;

	this.lookAtLocation = null;
	this.lookAtLock = false;
	this.up = new Feather.Vector(0, 1, 0);

	this.fov = 50;
	this.near = 0.0001;
	this.far = 2000;

	this.zoom = -5;

	// ModelView Matrix
	this.modelview = new Feather.Matrix(4);
	this.modelview.setIdentity();

	// Perspective Matrix
	this.projectionMatrix3D = new Feather.Matrix(4);
	this.projectionMatrix2D = new Feather.Matrix(4);

	this.projectionmode = Feather.ORTHOGRAPHIC;

	this.changed = true;
};

Feather.Camera.prototype.update = function()
{
	if (this.changed)
	{
		// Reset Modelview Matrix to the Identity Matrix
		this.modelview.setIdentity();

		// Apply transformations

		if (this.lookAtLocation != null)
		{
			this.modelview.setLookAt(this.location, this.lookAtLocation, this.up);
		}

		this.modelview.translate(-this.location.getX(), -this.location.getY(), -this.location.getZ());

//		console.log("Camera ModelView: ", this.modelview, this.modelview.values);

		if (this.projectionmode == Feather.ORTHOGRAPHIC)
		{
			var ratio = this.height / this.width;
			var zoom = this.zoom / this.zoomSensitivity;

			this.projectionMatrix3D.setOrtho(this.zoom + 1, -(this.zoom + 1), -(this.zoom + 1) * ratio, (this.zoom + 1) * ratio, -1000, 1000);
		}
		else if (this.projectionmode == Feather.PERSPECTIVE)
		{
			this.projectionMatrix3D.setPerspective(this.fov, this.aspect, this.near, this.far);
		}

		this.projectionMatrix2D.setOrtho(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 0, 10);
	
		this.changed = false;
	}
};

Feather.Camera.prototype.getModelviewMatrix = function(dimensions)
{
	this.update();

	return this.modelview;
};

Feather.Camera.prototype.getProjectionMatrix = function(dimensions)
{
	this.update();

	if (dimensions == 2)
		return this.projectionMatrix2D;
	else if (dimensions == 3)
		return this.projectionMatrix3D;
};

Feather.Camera.prototype.setProjectionMode = function(mode)
{
	this.projectionmode = mode;

	this.changed = true;
};

Feather.Camera.prototype.lookAt = function(location, lock)
{
	this.lookAtLocation = location;
	this.lookAtLock = false || lock;

	this.gaze = Feather.Vector.subtract(this.lookAtLocation, this.location);

	this.changed = true;
};

Feather.Camera.prototype.setLocation = function(location)
{
	this.location = location;

	if (this.lookAtLock)
		this.gaze = Feather.Vector.subtract(this.lookAtLocation, this.location);

	this.changed = true;
};

Feather.Camera.prototype.setZoom = function(zoom)
{
	if (zoom <= 0)
		this.zoom = zoom;

	this.changed = true;
};