/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

Feather.Matrix = function(size)
{
	this.size = size;
	this.values = new Array(size*size);
};

Feather.Matrix.prototype.copy = function(source)
{
	this.values = source.values.slice();
};

Feather.Matrix.copy = function(source)
{
	var matrix = new Feather.Matrix(source.size);

	matrix.copy(source);

	return matrix;
};

Feather.Matrix.prototype.multiply = function(multiplicand)
{
	if (!(multiplicand instanceof Feather.Vector) && !(multiplicand instanceof Feather.Matrix))
		throw "Feather.Matrix.multiply failed: Must be of type Feather.Matrix or Feather.Vector";

	if (this.size != multiplicand.size)
		throw "Feather.Matrix.multiply failed: Not conformable";

	if (multiplicand instanceof Feather.Vector)
	{
		var vector = new Feather.Vector(this.size);

		var va = multiplicand.toArray();
		for (var i = 0; i < this.size; i++)
			for (var j = 0; j < this.size; j++)
			{
//				console.log(vector.values[i], this.values[i*3+j], va[j]);
				vector.values[i] += this.values[i*3+j] * va[j];
			}

		return vector;
	}
	else if (multiplicand instanceof Feather.Matrix)
	{
		// Cache the matrix values (makes for huge speed increases!)
		var a00 = this.values[ 0], a01 = this.values[ 1], a02 = this.values[ 2], a03 = this.values[ 3];
		var a10 = this.values[ 4], a11 = this.values[ 5], a12 = this.values[ 6], a13 = this.values[ 7];
		var a20 = this.values[ 8], a21 = this.values[ 9], a22 = this.values[10], a23 = this.values[11];
		var a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];

		// Cache the matrix values (makes for huge speed increases!)
		var b00 = multiplicand.values[ 0], b01 = multiplicand.values[ 1], b02 = multiplicand.values[ 2], b03 = multiplicand.values[ 3];
		var b10 = multiplicand.values[ 4], b11 = multiplicand.values[ 5], b12 = multiplicand.values[ 6], b13 = multiplicand.values[ 7];
		var b20 = multiplicand.values[ 8], b21 = multiplicand.values[ 9], b22 = multiplicand.values[10], b23 = multiplicand.values[11];
		var b30 = multiplicand.values[12], b31 = multiplicand.values[13], b32 = multiplicand.values[14], b33 = multiplicand.values[15];

		this.values[ 0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
		this.values[ 1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
		this.values[ 2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
		this.values[ 3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
		this.values[ 4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
		this.values[ 5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
		this.values[ 6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
		this.values[ 7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
		this.values[ 8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
		this.values[ 9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
		this.values[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
		this.values[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
		this.values[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
		this.values[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
		this.values[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
		this.values[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

		return this;
	}
};

Feather.Matrix.multiply = function(a, b)
{
	var out = Feather.Matrix.copy(a);

	out.multiply(b);

	return out;
};

Feather.Matrix.prototype.invert = function()
{
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3];
	var a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7];
	var a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];
	var a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];

	var b00 = a00*a11 - a01*a10;
	var b01 = a00*a12 - a02*a10;
	var b02 = a00*a13 - a03*a10;
	var b03 = a01*a12 - a02*a11;
	var b04 = a01*a13 - a03*a11;
	var b05 = a02*a13 - a03*a12;
	var b06 = a20*a31 - a21*a30;
	var b07 = a20*a32 - a22*a30;
	var b08 = a20*a33 - a23*a30;
	var b09 = a21*a32 - a22*a31;
	var b10 = a21*a33 - a23*a31;
	var b11 = a22*a33 - a23*a32;

	// Calculate the determinant (inlined to avoid double-caching)
	var invDet = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);

	this.values[0] = (a11*b11 - a12*b10 + a13*b09)*invDet;
	this.values[1] = (-a01*b11 + a02*b10 - a03*b09)*invDet;
	this.values[2] = (a31*b05 - a32*b04 + a33*b03)*invDet;
	this.values[3] = (-a21*b05 + a22*b04 - a23*b03)*invDet;
	this.values[4] = (-a10*b11 + a12*b08 - a13*b07)*invDet;
	this.values[5] = (a00*b11 - a02*b08 + a03*b07)*invDet;
	this.values[6] = (-a30*b05 + a32*b02 - a33*b01)*invDet;
	this.values[7] = (a20*b05 - a22*b02 + a23*b01)*invDet;
	this.values[8] = (a10*b10 - a11*b08 + a13*b06)*invDet;
	this.values[9] = (-a00*b10 + a01*b08 - a03*b06)*invDet;
	this.values[10] = (a30*b04 - a31*b02 + a33*b00)*invDet;
	this.values[11] = (-a20*b04 + a21*b02 - a23*b00)*invDet;
	this.values[12] = (-a10*b09 + a11*b07 - a12*b06)*invDet;
	this.values[13] = (a00*b09 - a01*b07 + a02*b06)*invDet;
	this.values[14] = (-a30*b03 + a31*b01 - a32*b00)*invDet;
	this.values[15] = (a20*b03 - a21*b01 + a22*b00)*invDet;
};

Feather.Matrix.prototype.transpose = function()
{
	var a01 = this.values[1]
	var a02 = this.values[2];
	var a12 = this.values[5];

	this.values[1] = this.values[3];
	this.values[2] = this.values[6];
	this.values[3] = a01;
	this.values[5] = this.values[7];
	this.values[6] = a02;
	this.values[7] = a12;
};

Feather.Matrix.prototype.rotate = function(angle, x, y, z)
{
	var len = Math.sqrt(x*x + y*y + z*z);

	if (!len) { return null; }

	if (len != 1) {
		len = 1 / len;
		x *= len; 
		y *= len; 
		z *= len;
	}

	var s = Math.sin(angle);
	var c = Math.cos(angle);
	var t = 1-c;

	// Cache the matrix values (makes for huge speed increases!)
	var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3];
	var a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7];
	var a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];

	// Construct the elements of the rotation matrix
	var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
	var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
	var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;

	// Perform rotation-specific matrix multiplication
	this.values[0] = a00*b00 + a10*b01 + a20*b02;
	this.values[1] = a01*b00 + a11*b01 + a21*b02;
	this.values[2] = a02*b00 + a12*b01 + a22*b02;
	this.values[3] = a03*b00 + a13*b01 + a23*b02;

	this.values[4] = a00*b10 + a10*b11 + a20*b12;
	this.values[5] = a01*b10 + a11*b11 + a21*b12;
	this.values[6] = a02*b10 + a12*b11 + a22*b12;
	this.values[7] = a03*b10 + a13*b11 + a23*b12;

	this.values[8] = a00*b20 + a10*b21 + a20*b22;
	this.values[9] = a01*b20 + a11*b21 + a21*b22;
	this.values[10] = a02*b20 + a12*b21 + a22*b22;
	this.values[11] = a03*b20 + a13*b21 + a23*b22;
};

/*
 * Feather.Matrix.rotateX
 * Rotates a matrix by the given angle around the X axis
 *
 * Params:
 * angle - angle (in radians) to rotate
 *
 */
Feather.Matrix.prototype.rotateX = function(angle)
{
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	// Cache the matrix values (makes for huge speed increases!)
	var a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7];
	var a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];

	// Perform axis-specific matrix multiplication
	this.values[4] = a10*c + a20*s;
	this.values[5] = a11*c + a21*s;
	this.values[6] = a12*c + a22*s;
	this.values[7] = a13*c + a23*s;

	this.values[8] = a10*-s + a20*c;
	this.values[9] = a11*-s + a21*c;
	this.values[10] = a12*-s + a22*c;
	this.values[11] = a13*-s + a23*c;
};

/*
 * Feather.Matrix..rotateY
 * Rotates a matrix by the given angle around the Y axis
 *
 * Params:
 * angle - angle (in radians) to rotate
 *
 */
Feather.Matrix.prototype.rotateY = function(angle)
{
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	// Cache the matrix values (makes for huge speed increases!)
	var a00 = this.values[0], a01 = this.values[1], a02 = this.values[ 2], a03 = this.values[ 3];
	var a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];

	// Perform axis-specific matrix multiplication
	this.values[ 0] = (a00 * c) + (a20 * -s);
	this.values[ 1] = (a01 * c) + (a21 * -s);
	this.values[ 2] = (a02 * c) + (a22 * -s);
	this.values[ 3] = (a03 * c) + (a23 * -s);

	this.values[ 8] = (a00 * s) + (a20 * c);
	this.values[ 9] = (a01 * s) + (a21 * c);
	this.values[10] = (a02 * s) + (a22 * c);
	this.values[11] = (a03 * s) + (a23 * c);
};

/*
 * Feather.Matrix.rotateZ
 * Rotates a matrix by the given angle around the Z axis
 *
 * Params:
 * angle - angle (in radians) to rotate
 */
Feather.Matrix.prototype.rotateZ = function(angle)
{
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	// Cache the matrix values (makes for huge speed increases!)
	var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3];
	var a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7];

	// Perform axis-specific matrix multiplication
	this.values[0] = a00*c + a10*s;
	this.values[1] = a01*c + a11*s;
	this.values[2] = a02*c + a12*s;
	this.values[3] = a03*c + a13*s;

	this.values[4] = a00*-s + a10*c;
	this.values[5] = a01*-s + a11*c;
	this.values[6] = a02*-s + a12*c;
	this.values[7] = a03*-s + a13*c;
};

Feather.Matrix.prototype.translate = function(x, y, z)
{
	this.values[12] = this.values[0]*x + this.values[4]*y + this.values[ 8]*z + this.values[12];
	this.values[13] = this.values[1]*x + this.values[5]*y + this.values[ 9]*z + this.values[13];
	this.values[14] = this.values[2]*x + this.values[6]*y + this.values[10]*z + this.values[14];
	this.values[15] = this.values[3]*x + this.values[7]*y + this.values[11]*z + this.values[15];
};

Feather.Matrix.prototype.translateX = function(length) { this.translate(length, 0, 0); };
Feather.Matrix.prototype.translateY = function(length) { this.translate(0, length, 0); };
Feather.Matrix.prototype.translateZ = function(length) { this.translate(0, 0, length); };

Feather.Matrix.prototype.setIdentity = function()
{
	for (i = 0; i < this.size*this.size; i++)
		if (i % (this.size + 1) == 0)
			this.values[i] = 1;
		else
			this.values[i] = 0;
};

Feather.Matrix.prototype.setPerspective = function(fov, aspect, near, far)
{
	var ymax, ymin, xmin, xmax;

	ymax = near * Math.tan( fov * Math.PI / 360 );
	ymin = -ymax;
	xmin = ymin * aspect;
	xmax = ymax * aspect;

	this.makeFrustum(xmin, xmax, ymin, ymax, near, far);
};

Feather.Matrix.prototype.setFrustum = function(left, right, bottom, top, near, far)
{
	var m, x, y, a, b, c, d;

	x = 2 * near / ( right - left );
	y = 2 * near / ( top - bottom );
	a = ( right + left ) / ( right - left );
	b = ( top + bottom ) / ( top - bottom );
	c = - ( far + near ) / ( far - near );
	d = - 2 * far * near / ( far - near );

	this.values = [
		 x,  0,  0,  0,
		 0,  y,  0,  0,
		 a,  b,  c, -1,
		 0,  0,  d,  0
	];
};

Feather.Matrix.prototype.setOrtho = function(left, right, top, bottom, near, far)
{
	var x, y, z, w, h, p;

	w = right - left;
	h = top - bottom;
	p = far - near;
	x = -( left + right ) / w;
	y = -( top + bottom ) / h;
	z = -( far + near ) / p;

	this.values = [
		2 / w, 0, 0, 0,
		0, 2 / h, 0, 0,
		0, 0, -2 / p, 0,
		x, y, z, 1
	];
};

Feather.Matrix.prototype.setRotation = function(axis, angle)
{
	var cost = Math.cos(angle);
	var sint = Math.sin(angle);
	var icost = 1 - cost;
	var ux = axis.toArray()[0];
	var uy = axis.toArray()[1];
	var uz = axis.toArray()[2];

	this.values = [
		           cost + ux * ux * icost, ux * uy * icost - uz *       sint, ux * uz * icost + uy *       sint,
		uy * ux * icost + uz *       sint,            cost + uy * uy * icost, uy * uz * icost - ux *       sint,
		uz * ux * icost - uy *       sint, uz * uy * icost + ux *       sint,            cost + uz * uz * icost
	];
};

Feather.Matrix.prototype.setLookAt = function(eye, at, up)
{
	var y = Feather.Vector.normalize(up);
	var z = Feather.Vector.subtract(eye, at);
	z.normalize();
	var x = Feather.Vector.cross(y, z);

	this.values[ 0] = x.getX()
	this.values[ 4] = x.getY();
	this.values[ 8] = x.getZ();
	this.values[12] = 0;
	this.values[ 1] = y.getX();
	this.values[ 5] = y.getY();
	this.values[ 9] = y.getZ();
	this.values[13] = 0;
	this.values[ 2] = z.getX();
	this.values[ 6] = z.getY();
	this.values[10] = z.getZ();
	this.values[14] = 0;
	this.values[ 3] = 0;
	this.values[ 7] = 0;
	this.values[11] = 0;
	this.values[15] = 1;
}

Feather.Matrix.makeRotation = function(axis, angle)
{
	var matrix = new Feather.Matrix(3);
	matrix.setRotation(axis, angle);
	return matrix;
};