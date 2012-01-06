
var Feather = Feather || { };
// Perspective Mode
Feather.ORTHOGRAPHIC = 0;
Feather.PERSPECTIVE = 1;

// Alignment
Feather.ALIGN_CENTER = 0;
Feather.ALIGN_LEFT = 1;
Feather.ALIGN_RIGHT = 2;

// Mesh Types
Feather.MESH_TRIANGLES = 0;
Feather.MESH_TRIANGLE_STRIP = 1;
Feather.MESH_TRIANGLE_FAN = 2;
Feather.MESH_LINES = 3;
Feather.MESH_LINE_LOOP = 4;
Feather.MESH_POINTS = 5;

// Caps
Feather.CAP_FLAT = 0;
Feather.CAP_SQUARE = 1;
Feather.CAP_ROUND = 2;
Feather.CAP_TRIANGLE = 3;
// Constants
Math.TAU = Math.PI * 2;

Array.prototype.sum = function()
{
	for (var i = 0, L = this.length, sum = 0; i < L; sum += this[i++]);
	return sum;
}

Array.prototype.product = function()
{
	for (var i = 0, L = this.length, product = 1; i < L; product =  product * this[i++]);
	return product;
}

function overflow(min, max, value)
{
	if (value >= max)
		return value - max;

	if (value <= min)
		return min - value;

	return value;
}

function clip(min, max, value)
{
	if (value >= max)
		return 0;

	if (value <= min)
		return 0;

	return value;
}
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
Feather.Mesh = function(vertices, vertexIndexArray, normals, colors, type)
{
	/* Mesh Type
	 * The following values are accepted :
	 * POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
	 */
	this.type = type || Feather.MESH_TRIANGLES;
	this.texture = null;

	// Vertex info arrays
	this.vertices = vertices || new Array();
	this.normals = normals || new Array();
	this.colors = colors || new Array();

	this.vertexIndexArray = vertexIndexArray || new Array();

	this.vertexArray = new Array();

	this.modelview = new Feather.Matrix(4);
	this.modelview.setIdentity();

	this.transformer = function(){};

	// Lighting info
	this.lighting = true;

	this.changed = true;
	this.lastUpdated = new Date().getTime();
};

Feather.Mesh.prototype.update = function()
{
	if (this.changed)
	{
		this.updateVertexArray();

		this.changed = false;

		this.transformer();

		this.lastUpdated = new Date().getTime();
	}
};

Feather.Mesh.prototype.render = function(webgl, modelviewMatrixIn)
{
	this.update(webgl);

//	console.log("Mesh");
//	console.log("Vertices: ", this.vertices, this.vertices.length);
//	console.log("Indices: ", this.vertexIndexArray, this.vertexIndexArray.length);
//	console.log("Normals: ", this.normals, this.normals.length);
//	console.log("Colors: ", this.colors, this.colors.length);
//	console.log("Vertex Array: ", this.vertexArray, this.vertexArray.length);

	webgl.updateBuffers(this, this.vertexArray, this.vertexIndexArray);

	// Get the WebGL Drawing Context
	var gl = webgl.context;

	var modelviewMatrix = Feather.Matrix.multiply(modelviewMatrixIn, this.modelview);

//	console.log("Modelview Matrix:", modelviewMatrix, modelviewMatrix.values);

	// Generate the Normal Matrix
	var normalMatrix = new Feather.Matrix(4);
	normalMatrix.copy(modelviewMatrix);
	normalMatrix.invert();
	normalMatrix.transpose();

	// Set the ModelView and Normal Matrix data
	gl.uniformMatrix4fv(webgl.MatrixLocations['ModelView'], false, new Float32Array(modelviewMatrix.values));
	gl.uniformMatrix4fv(webgl.MatrixLocations['Normal'], false, new Float32Array(normalMatrix.values));

	gl.uniform1i(webgl.UniformLocations['UseLighting'], this.lighting);

	// Bind the vertex array and index data
	gl.bindBuffer(gl.ARRAY_BUFFER, webgl.getVertexBuffer(this));
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl.getIndexBuffer(this));

	// Set where the Attribute data locations
	gl.vertexAttribPointer(webgl.AttributeLocations['Vertex'], 4, gl.FLOAT, false, 48, 0);
	gl.vertexAttribPointer(webgl.AttributeLocations['Normal'], 4, gl.FLOAT, false, 48, 16);
	gl.vertexAttribPointer(webgl.AttributeLocations['Color'], 4, gl.FLOAT, false, 48, 32);

	// Determine type
	switch (this.type)
	{
		case Feather.MESH_TRIANGLES: var type = gl.TRIANGLES; break;
		case Feather.MESH_TRIANGLE_STRIP: var type = gl.TRIANGLE_STRIP; break;
		case Feather.MESH_TRIANGLE_FAN: var type = gl.TRIANGLE_FAN; break;
		case Feather.MESH_LINES: var type = gl.LINES; break;
		case Feather.MESH_LINE_LOOP: var type = gl.LINE_LOOP; break;
		case Feather.MESH_POINTS: var type = gl.POINTS; break;
	}
	
	// Draw!
	gl.drawElements(type, this.vertexIndexArray.length, gl.UNSIGNED_SHORT, 0);
};

Feather.Mesh.prototype.setType = function(type)
{
	this.type = type;

	if (this.webgl != null)
		this.updateBuffers(this.webgl.context);

	this.changed = true;
};

Feather.Mesh.prototype.setTransformer = function(transformer)
{
	this.transformer = transformer;

	this.changed = true;
};

Feather.Mesh.prototype.setTexture = function(texture)
{
	this.texture = texture;

	if (this.webgl != null)
		this.updateBuffers(this.webgl.context);

	this.changed = true;
};

Feather.Mesh.prototype.addVertex = function(vertex, normal, color)
{
	this.vertices.push(vertex || new Feather.Point().setXYZ(0, 0, 0));
	this.normals.push(normal || new Feather.Vector().setXYZ(0, 0, 1));
	this.colors.push(color || new Feather.Color().setRGBA(0, 0, 0, 1));
};

Feather.Mesh.prototype.addIndex = function(index) { this.vertexIndexArray.push(index); };

Feather.Mesh.prototype.updateVertexArray = function(vertex)
{
	this.vertexArray = new Array();

	for (var i = 0; i < this.vertices.length; i++)
	{
		var vertex = this.vertices[i];
		for (var j = 0; j < 3; j++)
			if (j < vertex.length)
				this.vertexArray.push(vertex[j]);
			else
				this.vertexArray.push(0);
		this.vertexArray.push(1);

		var normal = this.normals[i];
		for (var j = 0; j < 3; j++)
			if (j < normal.length)
				this.vertexArray.push(normal[j]);
			else
				this.vertexArray.push(0);
		this.vertexArray.push(0);

		var color = this.colors[i];
		for (var j = 0; j < color.length; j++)
			this.vertexArray.push(color[j]);
	}
};

Feather.Mesh.prototype.getVertexArray = function()
{
	return this.vertexArray;
};

Feather.Mesh.prototype.rotateX = function(angle) { this.modelview.rotateX(angle); this.changed = true; };
Feather.Mesh.prototype.rotateY = function(angle) { this.modelview.rotateY(angle); this.changed = true; };
Feather.Mesh.prototype.rotateZ = function(angle) { this.modelview.rotateZ(angle); this.changed = true; };
Feather.Mesh.prototype.rotate = function(angle, axis)
{
	this.modelview.rotateX(angle * axis[0]);
	this.modelview.rotateY(angle * axis[1]);
	this.modelview.rotateZ(angle * axis[2]);

	this.changed = true;
};

Feather.Mesh.prototype.translateX = function(length) { this.modelview.translateX(length); this.changed = true; };
Feather.Mesh.prototype.translateY = function(length) { this.modelview.translateY(length); this.changed = true; };
Feather.Mesh.prototype.translateZ = function(length) { this.modelview.translateZ(length); this.changed = true; };
Feather.Mesh.prototype.translate = function(x, y, z)
{
	this.modelview.translateX(x);
	this.modelview.translateY(y);
	this.modelview.translateZ(z);

	this.changed = true;
};
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
Feather.Framebuffer = function(webgl, scene, camera, width, height)
{
	this.webgl = webgl;
	this.scene = scene || new Feather.Scene();
	this.camera = camera || new Feather.Camera();

	this.width = width;
	this.height = height;
}
Feather.WebGL = function(canvas)
{
	this.canvas = canvas;
	this.meshes = new Array();
	this.vertexBuffers = new Array();
	this.indexBuffers = new Array();
	this.meshBuffers = new Array();

	try
	{
		this.context = this.canvas.getContext('experimental-webgl', { antialias: true });
		if (this.context == null)
			this.context = this.canvas.getContext('webgl', { antialias: true });
	} catch(e)
	{
		console.log(e);
		return;
	}

	var gl = this.context;

	// Setup
	gl.clearColor(0, 0, 0, 0);
	gl.clearDepth(1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.LIGHTING);
//	gl.enable(0x0B10);
//	gl.enable(gl.GL_LINE_SMOOTH);
	gl.enable(0x8642)
//	gl.enable(gl.TEXTURE_2D);

	// Create Shader Program
	this.ShaderProgram = gl.createProgram();

	var vertexShader = this.getShader(gl.VERTEX_SHADER, this.shaders['vertex'].join("\n"));
	gl.attachShader(this.ShaderProgram, vertexShader);

	var fragmentShader = this.getShader(gl.FRAGMENT_SHADER, this.shaders['fragment'].join("\n"));
	gl.attachShader(this.ShaderProgram, fragmentShader);

	gl.linkProgram(this.ShaderProgram);

	if (!gl.getProgramParameter(this.ShaderProgram, gl.LINK_STATUS))
		console.log("Unable to intialize the shader program.");

	gl.useProgram(this.ShaderProgram);

	// Save Matrix Locations
	this.MatrixLocations = new Array();
	this.MatrixLocations['Projection'] = gl.getUniformLocation(this.ShaderProgram, "uProjectionMatrix");
	this.MatrixLocations['ModelView'] = gl.getUniformLocation(this.ShaderProgram, "uModelViewMatrix");
	this.MatrixLocations['Normal'] = gl.getUniformLocation(this.ShaderProgram, "uNormalMatrix");

	// Save Attribute Locations
	this.AttributeLocations = new Array();
	this.AttributeLocations['Vertex'] = gl.getAttribLocation(this.ShaderProgram, "aVertex");
	this.AttributeLocations['Normal'] = gl.getAttribLocation(this.ShaderProgram, "aNormal");
	this.AttributeLocations['Color'] = gl.getAttribLocation(this.ShaderProgram, "aColor");

	gl.enableVertexAttribArray(this.AttributeLocations['Vertex']);
	gl.enableVertexAttribArray(this.AttributeLocations['Normal']);
	gl.enableVertexAttribArray(this.AttributeLocations['Color']);

	// Save Uniform Locations
	this.UniformLocations = new Array();
	this.UniformLocations['AmbientLightColor'] = gl.getUniformLocation(this.ShaderProgram, "uAmbientLightColor");
	this.UniformLocations['LightingDirection'] = gl.getUniformLocation(this.ShaderProgram, "uLightingDirection");
	this.UniformLocations['DirectionalColor'] = gl.getUniformLocation(this.ShaderProgram, "uDirectionalColor");
	this.UniformLocations['UseLighting'] = gl.getUniformLocation(this.ShaderProgram, "uUseLighting");
};

Feather.WebGL.prototype.updateBuffers = function(mesh, vertexArray, indexArray)
{
	var id = this.meshes.indexOf(mesh)
	if (id == -1)
	{
		this.meshes.push(mesh);

		id = this.meshes.indexOf(mesh);

		this.vertexBuffers[id] = this.context.createBuffer();
		this.indexBuffers[id] = this.context.createBuffer();
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[id]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffers[id]);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
};

Feather.WebGL.prototype.getVertexBuffer = function(mesh)
{
	var id = this.meshes.indexOf(mesh);

	if (id != -1)
		return this.vertexBuffers[id];

	return null;
};

Feather.WebGL.prototype.getIndexBuffer = function(mesh)
{
	var id = this.meshes.indexOf(mesh);

	if (id != -1)
		return this.indexBuffers[id];

	return null;
};

Feather.WebGL.prototype.getShader = function(type, source)
{
	gl = this.context;
	shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.log("An error occurred compiling the shader: " + type + "\n" + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
};
Feather.WebGL.prototype.shaders = 
{
	"vertex": [
		"uniform mat4 uProjectionMatrix;",
		"uniform mat4 uModelViewMatrix;",
		"uniform mat4 uNormalMatrix;",
		"uniform vec3 uAmbientLightColor;",
		"uniform vec3 uLightingDirection;",
		"uniform vec3 uDirectionalColor;",
		"uniform bool uUseLighting;",
		"",
		"attribute vec4 aVertex;",
		"attribute vec4 aNormal;",
		"attribute vec4 aColor;",
		"",
		"varying vec4 vColor;",
		"varying vec3 vLighting;",
		"",
		"void main(void)",
		"{",
		"gl_PointSize = 8.0;",
		"",
		"gl_Position = uProjectionMatrix * (uModelViewMatrix * aVertex);",
		"vColor = aColor;",
		"",
		"if (uUseLighting) {",
		"vec4 transformedNormal = uNormalMatrix * aNormal;",
		"float directionalLight = max(dot(transformedNormal.xyz, uLightingDirection), 0.0);",
		"vLighting = uAmbientLightColor + (uDirectionalColor * directionalLight);",
		"} else {",
		"vLighting = vec3(1.0, 1.0, 1.0);",
		"}",
		"}"
	],
	"fragment": [
		"#ifdef GL_ES",
		"precision highp float;",
		"#endif",
		"",
		"varying vec4 vColor;",
		"varying vec3 vLighting;",
		"",
		"void main(void)",
		"{",
		"gl_FragColor = vec4(vColor.rbg * vLighting, vColor.a);",
		"}"
	]
}
Feather.Camera = function(location, gaze, width, height)
{
	this.location = location || new Feather.Point(0, 0, 0);
	this.gaze = gaze || new Feather.Vector(0, 0, -1);

	this.width = 0 || width;
	this.height = 0 || height;
	this.aspect = this.width / this.height;

	this.lookAtLocation = null;
	this.lookAtLock = false;
	this.up = new Feather.Vector(0, 1, 0);

	this.fov = 50;
	this.near = 0.0001;
	this.far = 2000;

	this.zoom = -5;

	// ModelView Matrix
	this.modelview = new Feather.Matrix(4);
	this.modelview.setIdentity();

	// Perspective Matrix
	this.projectionMatrix3D = new Feather.Matrix(4);
	this.projectionMatrix2D = new Feather.Matrix(4);

	this.projectionmode = Feather.ORTHOGRAPHIC;

	this.changed = true;
};

Feather.Camera.prototype.update = function()
{
	if (this.changed)
	{
		// Reset Modelview Matrix to the Identity Matrix
		this.modelview.setIdentity();

		// Apply transformations

		if (this.lookAtLocation != null)
		{
			this.modelview.setLookAt(this.location, this.lookAtLocation, this.up);
		}

		this.modelview.translate(-this.location.getX(), -this.location.getY(), -this.location.getZ());

//		console.log("Camera ModelView: ", this.modelview, this.modelview.values);

		if (this.projectionmode == Feather.ORTHOGRAPHIC)
		{
			var ratio = this.height / this.width;
			var zoom = this.zoom / this.zoomSensitivity;

			this.projectionMatrix3D.setOrtho(this.zoom + 1, -(this.zoom + 1), -(this.zoom + 1) * ratio, (this.zoom + 1) * ratio, -1000, 1000);
		}
		else if (this.projectionmode == Feather.PERSPECTIVE)
		{
			this.projectionMatrix3D.setPerspective(this.fov, this.aspect, this.near, this.far);
		}

		this.projectionMatrix2D.setOrtho(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 0, 10);
	
		this.changed = false;
	}
};

Feather.Camera.prototype.getModelviewMatrix = function(dimensions)
{
	this.update();

	return this.modelview;
};

Feather.Camera.prototype.getProjectionMatrix = function(dimensions)
{
	this.update();

	if (dimensions == 2)
		return this.projectionMatrix2D;
	else if (dimensions == 3)
		return this.projectionMatrix3D;
};

Feather.Camera.prototype.setProjectionMode = function(mode)
{
	this.projectionmode = mode;

	this.changed = true;
};

Feather.Camera.prototype.lookAt = function(location, lock)
{
	this.lookAtLocation = location;
	this.lookAtLock = false || lock;

	this.gaze = Feather.Vector.subtract(this.lookAtLocation, this.location);

	this.changed = true;
};

Feather.Camera.prototype.setLocation = function(location)
{
	this.location = location;

	if (this.lookAtLock)
		this.gaze = Feather.Vector.subtract(this.lookAtLocation, this.location);

	this.changed = true;
};

Feather.Camera.prototype.setZoom = function(zoom)
{
	if (zoom <= 0)
		this.zoom = zoom;

	this.changed = true;
};
Feather.Light = function(location, color)
{
	this.location = location || new Feather.Point(0, 0, 0);
	this.color = color || new Feather.Color(0, 0, 0);
};
Feather.Scene = function()
{
	this.meshes = new Array();
	this.lights = new Array();

	this.origin = new Feather.Point();

	this.ambientLightColor = new Feather.Color().setRGB(0.5, 0.5, 0.5);

	this.directionalLight = new Array();
	this.directionalLight['enabled'] = true;
	this.directionalLight['color'] = new Feather.Color().setRGBA(0.25, 0.25, 0.25, 1.0);
	this.directionalLight['direction'] = new Feather.Vector().setXYZ(0, 5, 10.0).normalize();

	this.changed = true;
};

Feather.Scene.prototype.addMesh = function(mesh)
{
	this.meshes.push(mesh);
	mesh.update();
	this.changed = true;
};

Feather.Scene.prototype.render = function(webgl, modelviewMatrix3D, projectionMatrix3D)
{
//	console.log("Scene Render");
//	console.log("ModelviewMatrix3D", modelviewMatrix3D, modelviewMatrix3D.values);
//	console.log("ProjectionMatrix3D", projectionMatrix3D, projectionMatrix3D.values);
//	console.log("Ambient Light", this.ambientLight, this.ambientLight.toArray());
//	console.log("Directional Light Color", this.directionalLight['color'], this.directionalLight['color'].toArray());
//	console.log("Directional Light Direction", this.directionalLight['direction'], this.directionalLight['direction'].toArray());

	var gl = webgl.context;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniform3fv(webgl.UniformLocations['AmbientLightColor'], new Float32Array(this.ambientLightColor.getRGB()));
//	console.log(this.ambientLightColor.toArray());

	gl.uniform1i(webgl.UniformLocations['UseLighting'], this.directionalLight['enabled']);
	if (this.directionalLight['enabled'])
	{
		gl.uniform3fv(webgl.UniformLocations['DirectionalColor'], new Float32Array(this.directionalLight['color'].getRGB()));
		gl.uniform3fv(webgl.UniformLocations['LightingDirection'], new Float32Array(this.directionalLight['direction'].toArray()));
	}

	for (var i = 0; i < this.meshes.length; i++)
	{
		gl.uniformMatrix4fv(webgl.MatrixLocations['Projection'], false, new Float32Array(projectionMatrix3D.values));
		this.meshes[i].render(webgl, modelviewMatrix3D);
	}
};
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