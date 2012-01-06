/**
 * This file is part of the Feather javascript library
 *
 * (c) Brandon Nason <brandon.nason@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */ 

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