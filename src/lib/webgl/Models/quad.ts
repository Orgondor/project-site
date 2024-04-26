const vertices = [
	// Top
	-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0
];

const indices = [
	0,
	1,
	2,
	0,
	2,
	3 // Top
];

const normals = [
	// Top
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0
];

const textureCoords = [
	// Top
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
];

export default { vertices, indices, normals, textureCoords };
