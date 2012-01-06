/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Light = function(location, color)
{
	this.location = location || new Feather.Point(0, 0, 0);
	this.color = color || new Feather.Color(0, 0, 0);
};