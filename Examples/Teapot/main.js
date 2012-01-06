/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

 var view;

$(document).ready(function()
{
	//* Set canvas full screen
	var canvas = $('#example');
	canvas.attr('width', $('body').width());
	canvas.attr('height', $('body').height());

	view = new Feather.View(new Feather.WebGL(canvas[0]));
//	view.camera.setLocation(new Feather.Point(14, 0, 30));
	view.camera.setZoom(-35);

	//* Create and initialize a new mesh object
	var teapot = new Feather.Mesh(
									teapotData["vertexPositions"],
									teapotData["indices"],
									teapotData["vertexNormals"],
									teapotData["colors"],
									Feather.MESH_TRIANGLES
								);

	// Add square mesh to scene
	view.scene.addMesh(teapot);

	//* Draw the scene
	view.update();

	//* Apply continuous rotation and then refresh the scene
	setInterval(
		function()
		{
			teapot.rotateY(Math.TAU/360);
			view.update();
		}, 
		1000/50
	);
});

$(window).resize(function()
{
	var canvas = $('#example');
	canvas.attr('width', $('body').width());
	canvas.attr('height', $('body').height());
});