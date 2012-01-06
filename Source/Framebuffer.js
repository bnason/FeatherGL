/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Framebuffer = function(webgl, scene, camera, width, height)
{
	this.webgl = webgl;
	this.scene = scene || new Feather.Scene();
	this.camera = camera || new Feather.Camera();

	this.width = width;
	this.height = height;
}