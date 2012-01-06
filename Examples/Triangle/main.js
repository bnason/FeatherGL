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

	// Create the Vertex Array
	var vertices = 
		[
			[0, 0, 0], 
			[1, 0, 0],
			[-Math.cos(Math.PI*2/3), Math.sin(Math.PI*2/3), 0],
		];
	// Create the Vertex Index Array
	var vertexIndexArray = [ 0, 1, 2 ];

	// Create the Normals Array
	var normals =
		[
			[0, 0, -1],
			[0, 0, -1],
			[0, 0, -1],
		];

	// Construct an RGBA color
	var colors =
		[
			[1.0, 0.0, 0.0, 1.0],
			[0.0, 1.0, 0.0, 1.0],
			[0.0, 0.0, 1.0, 1.0],
		];

	//* Create and initialize a new mesh object
	var triangle = new Feather.Mesh(vertices, vertexIndexArray, normals, colors, Feather.MESH_TRIANGLE_STRIP);

	// Center the square
	triangle.translateX(-0.5);
	triangle.translateY(-0.5);

	// Add square mesh to scene
	view.scene.addMesh(triangle);

	//* Draw the scene
	view.update();
});

$(window).resize(function()
{
	var canvas = $('#example');
	canvas.attr('width', $('body').width());
	canvas.attr('height', $('body').height());

	view.update();
});