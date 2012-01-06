/**
 * This file is part of the Feather javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Point = function()
{
	var __name__ = 'Point';
	this.variableName = '';

	if (arguments.length == 1)
	{
		this.size = arguments[0];

		this.values = new Array(this.size);

		for (var i = 0; i < this.size; i++)
			this.values[i] = 0;
	}
	else
	{
		this.size = arguments.length;

		this.values = new Array(this.size);

		for (var i = 0; i < this.size; i++)
			this.values[i] = arguments[i];
	}
}

Feather.Point.prototype.toArray = function() { return this.values; };

Feather.Point.prototype.toSource = function()
{
	var source = '';

	if (this.variableName != '')
		source = this.variableName + ' = ';

	source += 'Point(' + this.values.join(', ') + ');';

	return source;
};

Feather.Point.prototype.toArgument = function()
{
	if (this.variableName != '')
		return this.variableName;

	return 'Point(' + this.values.join(', ') + ')';
};

//* Getters
Feather.Point.prototype.getX = function() { return this.values[0]; }
Feather.Point.prototype.getY = function() { return this.values[1]; }
Feather.Point.prototype.getZ = function() { return this.values[2]; }

Feather.Point.prototype.getVariableName = function() { return this.variableName; }


//* Setters
Feather.Point.prototype.setX = function(X) { this.values[0] = X; }
Feather.Point.prototype.setY = function(Y) { this.values[1] = Y; }
Feather.Point.prototype.setZ = function(Z) { this.values[2] = Z; }
Feather.Point.prototype.setXY = function(X, Y) { this.values[0] = X; this.values[1] = Y; }
Feather.Point.prototype.setXYZ = function(X, Y, Z) { this.values[0] = X; this.values[1] = Y; this.values[2] = Z; }

// Operations that act on this object
Feather.Point.prototype.copy = function(source)
{
	if (this.size != source.size)
		throw "Feather.Point.copy failed: Sizes must match " + this.size + " != " + source.size;

	this.values = source.toArray().slice();
};

Feather.Point.prototype.add = function(vector)
{
	if (!(vector instanceof Feather.Vector))
		throw "Feather.Point.add failed: Must be vector";

	if (this.size != vector.size)
		throw "Feather.Point.add failed: Sizes must match";

	var va = vector.toArray();
	for (var i = 0; i < this.size; i++)
		this.values[i] += va[i];
};

Feather.Point.prototype.subtract = function(point)
{
	if (!(point instanceof Feather.Point))
		throw "Feather.Point.subtract failed: Must be point";

	if (this.size != point.size)
		throw "Feather.Point.subtract failed: Sizes must match";

	var vector = new Feather.Vector(this.size);
	vector.copy(this);

	for (var i = 0; i < vector.size; i++)
		vector.values[i] -= point.values[i];

	return vector;
};

Feather.Point.prototype.translate = function(vector)
{
	if (vector.size != this.size)
		throw "Feather.Point.translate failed: Dimensions must match"

	var va = vector.toArray();
	for (var i = 0; i < this.size; i++)
		this.values[i] += va[i];
};

Feather.Point.prototype.copy = function(source)
{
	if (this.size != source.size)
		throw "Feather.Point.copy: Dimensions must match";

	this.values = source.toArray().slice();
};

// Operations that act on external objects and create new instance
Feather.Point.add = function(a, b)
{
	var point = new Feather.Point(a.size);
	point.copy(a);
	point.add(b);
	return point;
};

Feather.Point.subtract = function(point1, point2)
{
	var vector = new Feather.Vector(point1.size);
	vector.copy(point1);
	vector.subtract(point2);
	return vector;
};

Feather.Point.translate = function(point1, vector)
{
	var point = new Feather.Point(point1.size);
	point.copy(point1);
	point.translate(vector);
	return point;
};

Feather.Point.copy = function(source)
{
	var point = new Feather.Point(source.size);
	point.copy(source);
	return point;
};
