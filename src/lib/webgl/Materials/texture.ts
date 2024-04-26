import {GLManager} from '../GLManager/GLM';

export default class Texture {
	glm: GLManager;
	texture: WebGLTexture;
	done: boolean;

	constructor(glm: GLManager, isNormalMap = false) {
		this.glm = glm;
		this.done = false;
		this.texture = this.glm.createTexture();
		this.glm.bindTexture(this.texture);
		if (isNormalMap) {
			this.glm.defineDummyNormalTexture();
		} else {
			this.glm.defineDummyTexture();
		}
	}

	loadTexture = (url: string) => {
		const img = new Image();
		img.setAttribute('crossOrigin', '');
		img.onload = () => this.onLoad(img);
		img.src = url;
	};

	onLoad = (img: HTMLImageElement) => {
		this.glm.bindTexture(this.texture);
		this.glm.defineTexture(img);
		if (this.isPowerOfTwo(img.width) && this.isPowerOfTwo(img.height)) {
			this.glm.texturePowerOfTwo();
		} else {
			this.glm.textureNoPowerOfTwo();
		}
		this.done = true;
	};

	isPowerOfTwo = (side: number) => (side & (side - 1)) === 0;
	enable = () => this.glm.bindTexture(this.texture);
	hasTexture = () => this.done;
}
