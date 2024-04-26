import Texture from './texture';
import {GLManager} from '../GLManager/GLM';

interface MaterialShader {
	diffuseTexture?: WebGLUniformLocation;
	normalMapTexture?: WebGLUniformLocation;
}

export default class Material {
	glm: GLManager;
	diffuse: Texture;
	normalMap: Texture;

	constructor(glm: GLManager) {
		this.glm = glm;
		this.diffuse = new Texture(glm);
		this.normalMap = new Texture(glm, true);
	}

	addDiffuse = (url: string) => {
		this.diffuse.loadTexture(url);
		return this;
	};

	addNormalMap = (url: string) => {
		this.normalMap.loadTexture(url);
		return this;
	};

	_enableDiffuse = (shader: MaterialShader) => {
		if (shader.diffuseTexture) {
			this.glm.activeTexture(0);
			this.diffuse.enable();
			this.glm.uploadInt(shader.diffuseTexture, 0);
		}
	};

	_enableNormalMap = (shader: MaterialShader) => {
		if (shader.normalMapTexture) {
			this.glm.activeTexture(1);
			this.normalMap.enable();
			this.glm.uploadInt(shader.normalMapTexture, 1);
		}
	};

	enable = (shader: MaterialShader) => {
		this._enableDiffuse(shader);
		this._enableNormalMap(shader);
	};
}
