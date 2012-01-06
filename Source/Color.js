/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Color = function()
{
	this.r = 1.0;
	this.g = 1.0;
	this.b = 1.0;
	this.a = 1.0;

	return this;
};

Feather.Color.prototype.toArray = function()
{
	return new Array(this.r, this.g, this.b, this.a);
};

Feather.Color.prototype.getRGB = function()
{
	return new Array(this.r, this.g, this.b);
};

Feather.Color.prototype.getRGBA = function()
{
	return new Array(this.r, this.g, this.b, this.a);
};

Feather.Color.prototype.setRGB = function(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;

	this.updateHex();

	return this;
};

Feather.Color.prototype.setRGBA = function(r, g, b, a)
{
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;

	this.updateHex();

	return this;
};

Feather.Color.prototype.setHex = function(hex)
{
	this.hex = (~~ hex) & 0xffffff;

	this.updateRGB();
};

Feather.Color.prototype.setHSV = function(h, s, v)
{
	var red, green, blue, i, f, p, q, t;
	
	if (v == 0.0)
	{
		red = green = blue = 0;
	}
	else
	{
		i = Math.floor(h * 6);
		f = (h * 6) - i;
		p = v * (1 - s);
		q = v * (1 - (s * f));
		t = v * (1 - (s * (1 - f)));
		
		switch (i)
		{
			case 1: red = q; green = v; blue = p; break;
			case 2: red = p; green = v; blue = t; break;
			case 3: red = p; green = q; blue = v; break;
			case 4: red = t; green = p; blue = v; break;
			case 5: red = v; green = p; blue = q; break;
			case 6: // fall through
			case 0: red = v; green = t; blue = p; break;
		}
	}

	this.r = red;
	this.g = green;
	this.b = blue;

	this.updateHex();
};

Feather.Color.prototype.updateRGB = function()
{
	this.r = (this.hex >> 16 & 255) / 255;
	this.g = (this.hex >> 8 & 255) / 255;
	this.b = (this.hex & 255) / 255;
};

Feather.Color.prototype.updateHex = function()
{
	this.hex = ~~(this.r * 255) << 16 ^ ~~(this.g * 255) << 8 ^ ~~(this.b * 255);
};