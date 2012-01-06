/**
 * This file is part of the Feather javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.View = function(webgl, scene, camera)
{
	this.webgl = webgl;
	this.scene = scene || new Feather.Scene();
	this.camera = camera || new Feather.Camera(null, null, this.webgl.canvas.width, this.webgl.canvas.height);

	this.pickerBuffer = new Feather.Framebuffer(this.webgl, this.camera.width, this.camera.height);

	this.changed = true;

	$(window).resize(function()
	{
		this.camera.height = this.webgl.canvas.height;
		this.camera.width = this.webgl.canvas.width;
		this.camera.aspect = this.camera.width / this.camera.height;
	});
};

Feather.View.prototype.update = function()
{
	this.webgl.context.viewport(0, 0, this.webgl.canvas.width, this.webgl.canvas.height);

	// Configure all the matricies etc

	// Setup the ModelView Matrix
	var modelviewMatrix3D = this.camera.getModelviewMatrix();
	var modelviewMatrix2D = new Feather.Matrix(4);
	modelviewMatrix2D.setIdentity();

	// Call the render function
	this.scene.render(this.webgl, modelviewMatrix3D, this.camera.getProjectionMatrix(3));
};

Feather.View.prototype.pickObjectAt = function(mouse)
{
	var mouseNormalized = new Feather.Point(mouse.getX() * 2 / this.camera.width - 1, 1- mouse.getY() * 2 / this.camera.height, 0);

	var selectRay = Feather.UnProject(mouseNormalized, this.camera.getModelviewMatrix(3), this.camera.getProjectionMatrix(3), [0, 0, this.camera.width, this.camera.height]);
};