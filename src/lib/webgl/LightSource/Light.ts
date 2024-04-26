import { vec3 } from 'gl-matrix';

export default class Light {
	x: number;
	y: number;
	z: number;
	r: number;
	g: number;
	b: number;
	ambient: number;

	constructor(x: number, y: number, z: number, r: number, g: number, b: number, ambient: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = r;
		this.g = g;
		this.b = b;
		this.ambient = ambient;
	}

	setPosition = (pos: vec3) => {
		this.x = pos[0];
		this.y = pos[1];
		this.z = pos[2];
	};

	setColor = (color: vec3) => {
		this.r = color[0];
		this.g = color[1];
		this.b = color[2];
	};

	getPosition = () => vec3.fromValues(this.x, this.y, this.z);
	getColor = () => vec3.fromValues(this.r, this.g, this.b);
	getAmbient = () => this.ambient;
}
