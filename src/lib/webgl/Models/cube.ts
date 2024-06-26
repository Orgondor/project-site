const vertices = [
	// Top
	-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

	// Bottom
	-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

	// Back
	-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

	// Front
	-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

	// Right
	1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

	// Left
	-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
];

const indices = [
	0,
	1,
	2,
	0,
	2,
	3, // Top
	4,
	5,
	6,
	4,
	6,
	7, // Bottom
	8,
	9,
	10,
	8,
	10,
	11, // Back
	12,
	13,
	14,
	12,
	14,
	15, // Front
	16,
	17,
	18,
	16,
	18,
	19, // Right
	20,
	21,
	22,
	20,
	22,
	23 // Left
];

const normals = [
	// Top
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

	// Bottom
	0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

	// Back
	0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

	// Front
	0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

	// Right
	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

	// Left
	-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
];

const tangents = [
	// Top
	0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

	// Bottom
	0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

	// Back
	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

	// Front
	-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,

	// Right
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

	// Left
	0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
];

const textureCoords = [
	// Top
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	// Bottom
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	// Back
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	// Front
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	// Right
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	// Left
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
];

// Each face different
// const colors = [
//   // Top
//   1.0, 0.0, 1.0,
//   1.0, 0.0, 1.0,
//   1.0, 0.0, 1.0,
//   1.0, 0.0, 1.0,

//   // Bottom
//   1.0, 0.0, 0.0,
//   1.0, 0.0, 0.0,
//   1.0, 0.0, 0.0,
//   1.0, 0.0, 0.0,

//   // Back
//   0.0, 1.0, 0.0,
//   0.0, 1.0, 0.0,
//   0.0, 1.0, 0.0,
//   0.0, 1.0, 0.0,

//   // Front
//   0.0, 1.0, 1.0,
//   0.0, 1.0, 1.0,
//   0.0, 1.0, 1.0,
//   0.0, 1.0, 1.0,

//   // Right
//   0.0, 0.0, 1.0,
//   0.0, 0.0, 1.0,
//   0.0, 0.0, 1.0,
//   0.0, 0.0, 1.0,

//   // Left
//   1.0, 1.0, 0.0,
//   1.0, 1.0, 0.0,
//   1.0, 1.0, 0.0,
//   1.0, 1.0, 0.0
// ];

// white
const colors = [
	// Top
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

	// Bottom
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

	// Back
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

	// Front
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

	// Right
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

	// Left
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
];

export default { vertices, indices, normals, tangents, textureCoords, colors };
