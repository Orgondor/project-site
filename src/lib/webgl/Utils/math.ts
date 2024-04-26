import { mat4, vec3 } from 'gl-matrix';

export const toRadians = (deg: number) => deg * (Math.PI / 180);

export const createTransformationMatrix = (
	x: number,
	y: number,
	z: number,
	yaw: number,
	pitch: number,
	roll: number,
	scale: number
) => {
	const matrix: mat4 = mat4.create(); // creates an identity matrix
	mat4.translate(matrix, matrix, vec3.fromValues(x, y, z));
	mat4.rotateX(matrix, matrix, toRadians(yaw));
	mat4.rotateY(matrix, matrix, toRadians(roll));
	mat4.rotateZ(matrix, matrix, toRadians(pitch));
	mat4.scale(matrix, matrix, vec3.fromValues(scale, scale, scale));
	return matrix;
};
