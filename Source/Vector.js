/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Vector = function()
{
	this.values = [0, 0, 0];
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
};

//* Getters
Feather.Vector.prototype.getX = function() { return this.X; }
Feather.Vector.prototype.getY = function() { return this.Y; }
Feather.Vector.prototype.getZ = function() { return this.Z; }

//* Setters
Feather.Vector.prototype.setX = function(X) { this.X = X; return this; }
Feather.Vector.prototype.setY = function(Y) { this.Y = Y; return this; }
Feather.Vector.prototype.setZ = function(Z) { this.Z = Z; return this; }
Feather.Vector.prototype.setXY = function(X, Y) { this.X = X; this.Y = Y; return this; }
Feather.Vector.prototype.setXYZ = function(X, Y, Z) { this.X = X; this.Y = Y; this.Z = Z; return this; }

Feather.Vector.prototype.toArray = function()
{
	return [this.X, this.Y, this.Z];
};

Feather.Vector.prototype.toPoint = function()
{
	var point = new Feather.Point().setXYZ(this.X, this.Y, this.Z);

	return point;
};

Feather.Vector.prototype.pointAt = function(point)
{
	this.values = point.values;

	return this;
};

// Operations that act on this object
Feather.Vector.prototype.normalize = function()
{
	var sum = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
	var length = Math.sqrt(sum);

	if (length == 1)
		return this;

	this.X /= length;
	this.Y /= length;
	this.Z /= length;

	return this;
};

Feather.Vector.prototype.add = function(vector)
{
	if (this.size != vector.size)
		throw "Sizes must be the same for vector addition";

	if (typeof vector != 'Vector')
		throw "Can only add Vector to Vector instance";

	for (var i = 0; i < this.size; i++)
		this.values[i] += vector.values[i];
};

Feather.Vector.prototype.subtract = function(vector)
{
	if (this.size != vector.size)
		throw "Vector sizes must be the same for vector addition";

	var values = vector.toArray();
	for (var i = 0; i < this.size; i++)
		this.values[i] -= values[i];
};

Feather.Vector.prototype.dot = function(vector)
{
	if (!(vector instanceof Feather.Vector))
		throw "Feather.Vector.prototype.cross failed: Must be vector";

	if (this.size != vector.size)
		throw "Feather.Vector.dot: Dimensions must be equal.";

	var sumprod = 0;
	for (var i = 0; i < this.size; i++)
		sumprod += this.values[i] * vector.values[i];

	return sumprod;
};

Feather.Vector.prototype.cross = function(vector)
{
	if (!(vector instanceof Feather.Vector))
		throw "Feather.Vector.prototype.cross failed: Must be vector";

	if (this.size != 3 || this.size != vector.size)
		throw "Vector sizes must be the same for vector addition";

	var x1 = this.X, y1 = this.Y, z1 = this.Z;
	var x2 = vector.X, y2 = vector.Y, z2 = vector.Z;

	this.X = y1 * z2 - z1 * y2;
	this.Y = z1 * x2 - x1 * z2;
	this.Z = x1 * y2 - y1 * x2;
};

Feather.Vector.prototype.scale = function(scale)
{
	for (var i = 0; i < this.size; i++)
		this.values[i] *= scale;
};

Feather.Vector.prototype.invert = function()
{
	for (var i = 0; i < this.size; i++)
		this.values[i] = -this.values[i];
};

Feather.Vector.prototype.length = function()
{
	var sumprod = 0;
	for (var i = 0; i < this.size; i++)
		sumprod += this.values[i] * this.values[i];

	return Math.sqrt(sumprod);
};

Feather.Vector.prototype.copy = function(source)
{
	if (this.size != source.size)
		throw "Vector size must match";

	this.values = source.toArray().slice();
};

// Operations that act on external objects and create new instance
Feather.Vector.normalize = function(vector1)
{
	var vector = Feather.Vector.copy(vector1);
	vector.normalize();
	return vector;
};

Feather.Vector.add = function(vector1, vector2)
{
	var vector = Feather.Vector.copy(vector1);
	vector.add(vector2);
	return vector;
};

Feather.Vector.subtract = function(vector1, vector2)
{
	var vector = Feather.Vector.copy(vector1);
	vector.subtract(vector2);
	return vector;
};

Feather.Vector.dot = function(vector1, vector2)
{
	return vector1.dot(vector2);
};

Feather.Vector.cross = function(vector1, vector2)
{
	var vector = Feather.Vector.copy(vector1);
	vector.cross(vector2);
	return vector;
};

Feather.Vector.scale = function(vector1, scale)
{
	var vector = Feather.Vector.copy(vector1);
	vector.scale(scale);
	return vector;
};

Feather.Vector.invert = function(vector1)
{
	var vector = Feather.Vector.copy(vector1);
	vector.invert();
	return vector;
};

Feather.Vector.length = function(vector1)
{
	return vector1.length();
};

Feather.Vector.copy = function(source)
{
	var vector = new Feather.Vector(source.size);
	vector.copy(source);
	return vector;
};