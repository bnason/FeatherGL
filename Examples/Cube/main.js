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

	// Create Vertex Positions Arrays
	var vertices = {
		'front'  : [ [0, 0,  0], [1, 0,  0], [0, 1,  0], [1, 1,  0] ],
		'back'   : [ [0, 0, -1], [1, 0, -1], [0, 1, -1], [1, 1, -1] ],
		'left'   : [ [0, 0,  0], [0, 0, -1], [0, 1,  0], [0, 1, -1] ],
		'right'  : [ [1, 0,  0], [1, 0, -1], [1, 1,  0], [1, 1, -1] ],
		'top'    : [ [0, 1,  0], [1, 1,  0], [0, 1, -1], [1, 1, -1] ],
		'bottom' : [ [0, 0,  0], [1, 0,  0], [0, 0, -1], [1, 0, -1] ],
	};

	// Normals
	var normals = {
		'front'  : [ [ 0,  0,  1], [ 0,  0,  1], [ 0,  0,  1], [ 0,  0,  1] ],
		'back'   : [ [ 0,  0, -1], [ 0,  0, -1], [ 0,  0, -1], [ 0,  0, -1] ],
		'left'   : [ [-1,  0,  0], [-1,  0,  0], [-1,  0,  0], [-1,  0,  0] ],
		'right'  : [ [ 1,  0,  0], [ 1,  0,  0], [ 1,  0,  0], [ 1,  0,  0] ],
		'top'    : [ [ 0,  1,  0], [ 0,  1,  0], [ 0,  1,  0], [ 0,  1,  0] ],
		'bottom' : [ [ 0, -1,  0], [ 0, -1,  0], [ 0, -1,  0], [ 0, -1,  0] ],
	};

	// Normals
	var colors = {
		'front'  : [ [1.0, 0.0, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0] ],
		'back'   : [ [0.0, 1.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0] ],
		'left'   : [ [0.0, 0.0, 1.0, 1.0], [0.0, 0.0, 1.0, 1.0], [0.0, 0.0, 1.0, 1.0], [0.0, 0.0, 1.0, 1.0] ],
		'right'  : [ [1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 0.0, 1.0] ],
		'top'    : [ [1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 1.0, 1.0] ],
		'bottom' : [ [0.0, 1.0, 1.0, 1.0], [0.0, 1.0, 1.0, 1.0], [0.0, 1.0, 1.0, 1.0], [0.0, 1.0, 1.0, 1.0] ],
	};

	var indices = [ 0, 1, 2, 3 ];

	//* Create and initialize a new mesh object
	var front = new Feather.Mesh(vertices['front'], indices, normals['front'], colors['front'], Feather.MESH_TRIANGLE_STRIP);
	var back = new Feather.Mesh(vertices['back'], indices, normals['back'], colors['back'], Feather.MESH_TRIANGLE_STRIP);
	var left = new Feather.Mesh(vertices['left'], indices, normals['left'], colors['left'], Feather.MESH_TRIANGLE_STRIP);
	var right = new Feather.Mesh(vertices['right'], indices, normals['right'], colors['right'], Feather.MESH_TRIANGLE_STRIP);
	var top = new Feather.Mesh(vertices['top'], indices, normals['top'], colors['top'], Feather.MESH_TRIANGLE_STRIP);
	var bottom = new Feather.Mesh(vertices['bottom'], indices, normals['bottom'], colors['bottom'], Feather.MESH_TRIANGLE_STRIP);

	// Add meshs to scene
	view.scene.addMesh(front);
	view.scene.addMesh(back);
	view.scene.addMesh(left);
	view.scene.addMesh(right);
	view.scene.addMesh(top);
	view.scene.addMesh(bottom);

	var angle = Math.TAU/8;
	var X = 0.0;
	var Y = 1.0;

	front.rotate(angle, [X, Y, 0]);
	back.rotate(angle, [X, Y, 0]);
	left.rotate(angle, [X, Y, 0]);
	right.rotate(angle, [X, Y, 0]);
	top.rotate(angle, [X, Y, 0]);
	bottom.rotate(angle, [X, Y, 0]);

	front.translate(-0.5, -0.5, 0);
	back.translate(-0.5, -0.5, 0);
	left.translate(-0.5, -0.5, 0);
	right.translate(-0.5, -0.5, 0);
	top.translate(-0.5, -0.5, 0);
	bottom.translate(-0.5, -0.5, 0);

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