# Introduction
FeatherGL is a lightweight open source JavaScript library for managing a WebGL environment.

# Download
 * [Homepage](http://www.brandonnason.com/software/feathergl/)
 * [GitHub Repo](https://github.com/bnason/FeatherGL)
 * Latest source archive: [tar.gz](https://github.com/bnason/FeatherGL/tarball/master) [zip](https://github.com/bnason/FeatherGL/zipball/master)

# Use
    view = new Feather.View(new Feather.WebGL(canvas[0]));

    // Create the Vertex Array
    var vertices = 
        [
            [0, 0, 0], 
            [1, 0, 0],
            [-Math.cos(Math.PI*2/3), Math.sin(Math.PI*2/3), 0],
        ];
    // Create the Vertex Index Array
    var vertexIndexArray = [ 0, 1, 2 ];

    // Create the Normals Array
    var normals =
        [
            [0, 0, -1],
            [0, 0, -1],
            [0, 0, -1],
        ];

    // Construct an RGBA color
    var colors =
        [
            [1.0, 0.0, 0.0, 1.0],
            [0.0, 1.0, 0.0, 1.0],
            [0.0, 0.0, 1.0, 1.0],
        ];

    //* Create and initialize a new mesh object
    var triangle = new Feather.Mesh(vertices, vertexIndexArray, normals, colors, Feather.MESH_TRIANGLE_STRIP);

    // Center the triangle
    triangle.translateX(-0.5);
    triangle.translateY(-0.5);

    // Add square mesh to scene
    view.scene.addMesh(triangle);

    //* Draw the scene
    view.update();