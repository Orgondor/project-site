import { GLManager } from '../GLManager/GLM';
import Shader, { QuadShader } from '../Shaders/QuadShader/shader';
import ModelType from '../Models/ModelType';
import ModelInstance from '../Models/ModelInstance';
import Camera from '../Camera/camera';

type Model = {
	type: ModelType;
	instances: ModelInstance[];
};

export default class ModelRenderer {
	glm: GLManager;
	shader: Record<QuadShader, Shader>;
	models: Record<QuadShader, Record<string, Model>>;

	constructor(glm: GLManager) {
		this.glm = glm;
		this.shader = {
			[QuadShader.Mandelbrot]: new Shader(glm, QuadShader.Mandelbrot),
			[QuadShader.RayMarch]: new Shader(glm, QuadShader.RayMarch)
		};
		this.models = {
			[QuadShader.Mandelbrot]: {},
			[QuadShader.RayMarch]: {}
		};
	}

	registerNewModel = (model: ModelType, shader: QuadShader, id: string) => {
		if (!this.models[shader][id]) {
			this.models[shader][id] = {
				type: model,
				instances: []
			};
		}
	};

	addInstance = (instance: ModelInstance, shader: QuadShader, id: string) => {
		this.models[shader][id].instances.push(instance);
	};

	preRender = () => {
		this.glm.viewport();
		this.glm.depthTest(true);
	};

	render = (camera: Camera, uptime: number) => {
		this.preRender();
		Object.values(QuadShader).forEach((shaderId: QuadShader) => {
			this.shader[shaderId].use();
			camera.enable(this.shader[shaderId]);
			this.shader[shaderId].enableTime(uptime);
			Object.keys(this.models[shaderId]).forEach((id) => {
				this.models[shaderId][id].type.use(this.shader[shaderId]);
				this.models[shaderId][id].instances.forEach((instance) => {
					this.shader[shaderId].enableTransformationMatrix(instance.getTransformationMatrix());
					this.glm.drawTriangles(this.models[shaderId][id].type.indicies.length);
				});
			});
		});
	};
}
