import { GLManager } from '../GLManager/GLM';
import Material from '../Materials/material';

interface ModelShader {
	enablePosition: () => void;
	enableTextureCoords: () => void;
	enableNormals: () => void;
	enableTangents: () => void;
	enableColors: () => void;
	diffuseTexture?: WebGLUniformLocation;
	normalMapTexture?: WebGLUniformLocation;
}

export default class ModelType {
	glm: GLManager;
	verticies: number[];
	indicies: number[];
	normals: number[];
	tangents: number[] | undefined;
	textureCoords: number[];
	colors: number[] | undefined;
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	normalBuffer: WebGLBuffer;
	textureCoordBuffer: WebGLBuffer;
	tangentBuffer: WebGLBuffer | undefined;
	colorBuffer: WebGLBuffer | undefined;
	material: Material | undefined;

	constructor(
		glm: GLManager,
		verticies: number[],
		indicies: number[],
		normals: number[],
		textureCoords: number[],
		tangents?: number[],
		colors?: number[]
	) {
		this.glm = glm;
		this.verticies = verticies;
		this.indicies = indicies;
		this.normals = normals;
		this.textureCoords = textureCoords;
		this.tangents = tangents;
		this.colors = colors;
		this.vertexBuffer = this.glm.createBuffer();
		this._insertVerticies();
		this.indexBuffer = this.glm.createBuffer();
		this._insertIndicies();
		this.normalBuffer = this.glm.createBuffer();
		this._insertNormals();
		this.textureCoordBuffer = this.glm.createBuffer();
		this._insertTextureCoords();
		this._genTangentBuffer();
		this._genColorBuffer();
		this.material = new Material(glm);
	}

	_insertVerticies = (): void => {
		this.glm.bindArrayBuffer(this.vertexBuffer);
		this.glm.addArrayBufferData(this.verticies);
		this.glm.unbindArrayBuffer();
	};

	_insertIndicies = (): void => {
		this.glm.bindElementArrayBuffer(this.indexBuffer);
		this.glm.addElementArrayBufferData(this.indicies);
		this.glm.unbindElementArrayBuffer();
	};

	_insertNormals = (): void => {
		this.glm.bindArrayBuffer(this.normalBuffer);
		this.glm.addArrayBufferData(this.normals);
		this.glm.unbindArrayBuffer();
	};

	_insertTextureCoords = (): void => {
		this.glm.bindArrayBuffer(this.textureCoordBuffer);
		this.glm.addArrayBufferData(this.textureCoords);
		this.glm.unbindArrayBuffer();
	};

	_genTangentBuffer = (): void => {
		if (this.tangents) {
			this.tangentBuffer = this.glm.createBuffer();
			this.glm.bindArrayBuffer(this.tangentBuffer);
			this.glm.addArrayBufferData(this.tangents);
			this.glm.unbindArrayBuffer();
		}
	};

	_genColorBuffer = (): void => {
		if (this.colors) {
			this.colorBuffer = this.glm.createBuffer();
			this.glm.bindArrayBuffer(this.colorBuffer);
			this.glm.addArrayBufferData(this.colors);
			this.glm.unbindArrayBuffer();
		}
	};

	addMaterial = (material: Material): void => {
		this.material = material;
	};

	use = (shader: ModelShader): void => {
		this.glm.bindArrayBuffer(this.vertexBuffer);
		shader.enablePosition();
		this.glm.bindArrayBuffer(this.textureCoordBuffer);
		shader.enableTextureCoords();
		this.glm.bindArrayBuffer(this.normalBuffer);
		shader.enableNormals();
		this.glm.bindElementArrayBuffer(this.indexBuffer);
		if (this.material) {
			this.material.enable(shader);
		}
		if (this.tangentBuffer) {
			this.glm.bindArrayBuffer(this.tangentBuffer);
			shader.enableTangents();
		}
		if (this.colorBuffer) {
			this.glm.bindArrayBuffer(this.colorBuffer);
			shader.enableColors();
		}
	};
}
