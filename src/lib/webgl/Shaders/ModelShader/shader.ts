import {GLManager} from '../../GLManager/GLM';
import VertexSource from './vertex';
import FragmentSource from './fragment';
import Locations from './locations';
import { mat4 } from 'gl-matrix';
import Light from '../../LightSource/Light';

export default class ModelShader {
	glm: GLManager;
	program: WebGLProgram;
	positionAttribute: number;
	normalAttribute: number;
	tangentAttribute: number;
	textureCoordsAttribute: number;
	colorAttribute: number;
	diffuseTexture: WebGLUniformLocation;
	normalMapTexture: WebGLUniformLocation;
	transformationMatrix: WebGLUniformLocation;
	viewMatrix: WebGLUniformLocation;
	projectionMatrix: WebGLUniformLocation;
	lightPosition: WebGLUniformLocation;
	lightColor: WebGLUniformLocation;
	lightAmibient: WebGLUniformLocation;

	constructor(glm: GLManager) {
		this.glm = glm

		const vertexShader = this.glm.createVertexShader();
		this.glm.addShaderSource(vertexShader, VertexSource);
		this.glm.compileShader(vertexShader);
		this.compileStatus(vertexShader);

		const fragmentShader = this.glm.createFragmentShader();
		this.glm.addShaderSource(fragmentShader, FragmentSource);
		this.glm.compileShader(fragmentShader);
		this.compileStatus(fragmentShader);

		const program = this.glm.createShaderProgram();
		this.glm.attachShaderProgram(program, vertexShader);
		this.glm.attachShaderProgram(program, fragmentShader);
		this.glm.linkProgram(program);

		this.positionAttribute = this.glm.getAttributeLocation(program, Locations.POSITION);
		this.normalAttribute = this.glm.getAttributeLocation(program, Locations.NORMAL);
		this.tangentAttribute = this.glm.getAttributeLocation(program, Locations.TANGENT);
		this.textureCoordsAttribute = this.glm.getAttributeLocation(program, Locations.TEXTURE_COORDS);
		this.colorAttribute = this.glm.getAttributeLocation(program, Locations.VERTEX_COLOR);
		this.diffuseTexture = this.glm.getUniformLocation(program, Locations.DIFFUSE_TEXTURE);
		this.normalMapTexture = this.glm.getUniformLocation(program, Locations.NORMAL_MAP_TEXTURE);
		this.transformationMatrix = this.glm.getUniformLocation(program, Locations.TRANSFORMATION_MATRIX);
		this.viewMatrix = this.glm.getUniformLocation(program, Locations.VIEW_MATRIX);
		this.projectionMatrix = this.glm.getUniformLocation(program, Locations.PROJECTION_MATRIX);
		this.lightPosition = this.glm.getUniformLocation(program, Locations.LIGHT_POSITION);
		this.lightColor = this.glm.getUniformLocation(program, Locations.LIGHT_COLOR);
		this.lightAmibient = this.glm.getUniformLocation(program, Locations.LIGHT_AMBIENT);
		this.program = program;
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

	enableTangents = () => {
		this.glm.enableVertexAttributeArray(this.tangentAttribute);
		this.glm.pointToAttribute(this.tangentAttribute, 3);
	};

	enableTextureCoords = () => {
		this.glm.enableVertexAttributeArray(this.textureCoordsAttribute);
		this.glm.pointToAttribute(this.textureCoordsAttribute, 2);
	};

	enableColors = () => {
		this.glm.enableVertexAttributeArray(this.colorAttribute);
		this.glm.pointToAttribute(this.colorAttribute, 3);
	};

	enableTransformationMatrix = (matrix: mat4) => {
		this.glm.uploadMatrix4fv(this.transformationMatrix, matrix);
	};

	enableViewProjectionMatrices = (viewMatrix: mat4, projectionMatrix: mat4) => {
		this.glm.uploadMatrix4fv(this.viewMatrix, viewMatrix);
		this.glm.uploadMatrix4fv(this.projectionMatrix, projectionMatrix);
	};

	enableLight = (light: Light) => {
		this.glm.uploadVec3f(this.lightPosition, light.getPosition());
		this.glm.uploadVec3f(this.lightColor, light.getColor());
		this.glm.uploadFloat(this.lightAmibient, light.getAmbient());
	};
}
