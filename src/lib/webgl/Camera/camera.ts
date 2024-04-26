import { vec3, vec4, mat4 } from 'gl-matrix';
import { toRadians } from '../Utils/math';
import {GLManager} from '../GLManager/GLM';
import {MouseListener} from '../EventHandlers/mouse';
import {KeyListener} from '../EventHandlers/keyboard';

const maxZoomInFOV = 10;
const maxZoomOutFOV = 80;

interface CameraShader {
	enableViewProjectionMatrices: (viewMatrix: mat4, projectionMatrix: mat4) => void;
}

export default class Camera {
	glm: GLManager;
	keyListener: KeyListener;
	mouseListener: MouseListener;
	x: number;
	y: number;
	z: number;
	pitch: number;
	yaw: number;
	roll: number;
	near: number;
	far: number;
	fov: number;
	yawPlus: number;
	yawMinus: number;
	yawSpeed: number;
	viewMatrix: mat4;
	projectionMatrix: mat4;

	constructor(glm: GLManager,
		keyListener: KeyListener,
		mouseListener: MouseListener,x = 0, y = 0, z = 0, pitch = 0, yaw = 0, roll = 0, near = 0.1, far = 1000, fov = 70) {
		this.glm = glm;
		this.keyListener = keyListener;
		this.mouseListener = mouseListener;
		this.x = x;
		this.y = y;
		this.z = z;
		this.pitch = pitch;
		this.yaw = yaw;
		this.roll = roll;
		this.near = near;
		this.far = far;
		this.fov = fov;
		this.viewMatrix = this.createViewMatrix();
		this.projectionMatrix = this.createProjectionMatrix();
		this.yawPlus = 0;
		this.yawMinus = 0;
		this.yawSpeed = 100;
		

		this.mouseListener.subscribeToDrag(this);
		this.mouseListener.subscribeToWheel(this);
		this.keyListener.subscribeToKey(this);
	}

	onkeydown = (e: KeyboardEvent) => {
		// hard coded for now
		if (e.key === 'q') {
			this.yawPlus = 1;
		}
		if (e.key === 'e') {
			this.yawMinus = 1;
		}
	};

	onkeyup = (e: KeyboardEvent) => {
		// hard coded for now
		if (e.key === 'q') {
			this.yawPlus = 0;
		}
		if (e.key === 'e') {
			this.yawMinus = 0;
		}
	};

	ondrag = (dx: number, dy: number) => {
		// Temporary solution for moving relative to the orientation of the camera
		const matrix = mat4.create(); // creates an identity matrix
		mat4.rotateX(matrix, matrix, toRadians(-this.pitch));
		mat4.rotateY(matrix, matrix, toRadians(-this.roll));
		mat4.rotateZ(matrix, matrix, toRadians(-this.yaw));

		const move = vec4.create();
		move[0] = dx * 0.01;
		move[1] = -dy * 0.01;

		vec4.transformMat4(move, move, matrix);

		this.x += move[0];
		this.y += move[1];

		this.generateMatrices();
	};

	onwheel = (e: WheelEvent) => {
		this.fov = Math.min(Math.max(this.fov + e.deltaY * 0.01, maxZoomInFOV), maxZoomOutFOV);
		this.generateMatrices();
	};

	update = (deltaTime: number) => {
		this.yaw += (this.yawPlus - this.yawMinus) * this.yawSpeed * deltaTime;
		this.generateMatrices();
	};

	enable = (shader: CameraShader) => {
		shader.enableViewProjectionMatrices(this.viewMatrix, this.projectionMatrix);
	};

	generateMatrices = () => {
		this.viewMatrix = this.createViewMatrix();
		this.projectionMatrix = this.createProjectionMatrix();
	};

	createViewMatrix = () => {
		const matrix = mat4.create(); // creates an identity matrix
		mat4.rotateX(matrix, matrix, toRadians(this.pitch));
		mat4.rotateY(matrix, matrix, toRadians(this.roll));
		mat4.rotateZ(matrix, matrix, toRadians(this.yaw));
		mat4.translate(matrix, matrix, vec3.fromValues(-this.x, -this.y, -this.z));
		return matrix;
	};

	createProjectionMatrix = () => {
		const aspectRatio = this.glm.gl.canvas.width / this.glm.gl.canvas.height;
		const matrix = mat4.create();
		mat4.perspective(matrix, toRadians(this.fov), aspectRatio, this.near, this.far);
		return matrix;
	};
}
