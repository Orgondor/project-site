import {GLManager} from '../../GLManager/GLM';
import VertexSource from './vertex';
import MandelbrotSource from './mandelbrot_frag';
import RayMarchSource from './rayMarch_frag';
import Locations from './locations';
import { mat4 } from 'gl-matrix';

export enum QuadShader {
	Mandelbrot = 'mandelbrot',
	RayMarch = 'raymarch'
}
const shaderMap: Record<QuadShader, string> = {
	[QuadShader.Mandelbrot]: MandelbrotSource,
	[QuadShader.RayMarch]: RayMarchSource
};

export default class ModelShader {
	glm: GLManager;
	program: WebGLProgram;
	positionAttribute: number;
	normalAttribute: number;
	textureCoordsAttribute: number;
	transformationMatrix: WebGLUniformLocation;
	viewMatrix: WebGLUniformLocation;
	projectionMatrix: WebGLUniformLocation;
	uptime: WebGLUniformLocation;

	constructor(glm: GLManager, shader: QuadShader) {
		this.glm = glm;

		const vertexShader = this.glm.createVertexShader();
		this.glm.addShaderSource(vertexShader, VertexSource);
		this.glm.compileShader(vertexShader);
		this.compileStatus(vertexShader);

		const fragShader = this.glm.createFragmentShader();
		this.glm.addShaderSource(fragShader, shaderMap[shader]);
		this.glm.compileShader(fragShader);
		this.compileStatus(fragShader);

		const rayMarchShader = this.glm.createFragmentShader();
		this.glm.addShaderSource(rayMarchShader, RayMarchSource);
		this.glm.compileShader(rayMarchShader);
		this.compileStatus(rayMarchShader);

		this.program = this.glm.createShaderProgram();
		this.glm.attachShaderProgram(this.program, vertexShader);
		this.glm.attachShaderProgram(this.program, fragShader);
		this.glm.linkProgram(this.program);

		this.positionAttribute = this.glm.getAttributeLocation(this.program, Locations.POSITION);
		this.normalAttribute = this.glm.getAttributeLocation(this.program, Locations.NORMAL);
		this.textureCoordsAttribute = this.glm.getAttributeLocation(this.program, Locations.TEXTURE_COORDS);
		this.transformationMatrix = this.glm.getUniformLocation(this.program, Locations.TRANSFORMATION_MATRIX);
		this.viewMatrix = this.glm.getUniformLocation(this.program, Locations.VIEW_MATRIX);
		this.projectionMatrix = this.glm.getUniformLocation(this.program, Locations.PROJECTION_MATRIX);
		this.uptime = this.glm.getUniformLocation(this.program, Locations.UPTIME);
	}

	compileStatus = (shader: WebGLShader) => {
		if (!this.glm.gl.getShaderParameter(shader, this.glm.gl.COMPILE_STATUS)) {
			console.error(this.glm.gl.getShaderInfoLog(shader));
		}
	};

	use = () => {
		this.glm.useProgram(this.program);
	};

	enablePosition = () => {
		this.glm.enableVertexAttributeArray(this.positionAttribute);
		this.glm.pointToAttribute(this.positionAttribute, 3);
	};

	enableNormals = () => {
		this.glm.enableVertexAttributeArray(this.normalAttribute);
		this.glm.pointToAttribute(this.normalAttribute, 3);
	};

	enableTextureCoords = () => {
		this.glm.enableVertexAttributeArray(this.textureCoordsAttribute);
		this.glm.pointToAttribute(this.textureCoordsAttribute, 2);
	};

	enableTransformationMatrix = (matrix: mat4) => {
		this.glm.uploadMatrix4fv(this.transformationMatrix, matrix);
	};

	enableViewProjectionMatrices = (viewMatrix: mat4, projectionMatrix: mat4) => {
		this.glm.uploadMatrix4fv(this.viewMatrix, viewMatrix);
		this.glm.uploadMatrix4fv(this.projectionMatrix, projectionMatrix);
	};

	enableTime = (uptime: number) => {
		this.glm.uploadFloat(this.uptime, uptime);
	};

	enableTangents = () => {
		return;
	};
	enableColors = () => {
		return;
	};
}
