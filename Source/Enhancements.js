/**
 * This file is part of the FeatherGL javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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