import { GLManager } from './GLManager/GLM';
import ModelRenderer from './Renderer/ModelRenderer';
import ModelType from './Models/ModelType';
import ModelInstance from './Models/ModelInstance';
import cube from './Models/cube';
import Light from './LightSource/Light';
import Material from './Materials/material';
import Camera from './Camera/camera';
import {MouseListener} from './EventHandlers/mouse';
import {KeyListener} from './EventHandlers/keyboard';
import { vec3 } from 'gl-matrix';
import diffuse from '$lib/images/sexkaitb_2K_Albedo.jpg';
import normalMap from '$lib/images/sexkaitb_2K_Normal.jpg';

export default (canvasId: string): void => {
	const canvas = document.getElementById(canvasId);
	if (!canvas) {
		console.error('Failed to find canvas component with id:', canvasId);
		return;
	}

	if (!(canvas instanceof HTMLCanvasElement)) {
		console.error('The component with given id:', canvasId, 'is not a canvas');
		return;
	} else {
		const cs = getComputedStyle(canvas);
		canvas.width = parseInt(cs.getPropertyValue('width'), 10);
		canvas.height = parseInt(cs.getPropertyValue('height'), 10);
		canvas.style.outline = 'none';
		canvas.tabIndex = -1;
	}

	const gl = canvas.getContext('webgl2');

	if (!gl) {
		console.error('Failed to get webgl context');
		return;
	}

	const glm = new GLManager(gl);
  const mouseListener = new MouseListener(canvas);
  const keyListener = new KeyListener(canvas);

	const modelRenderer = new ModelRenderer(glm);
	const light = new Light(0, -100, 0, 1.0, 1.0, 1.0, 0.3);
	const material = new Material(glm);
	material.addDiffuse(diffuse);
	material.addNormalMap(normalMap);
	const modelType = new ModelType(
    glm,
		cube.vertices,
		cube.indices,
		cube.normals,
		cube.textureCoords,
		cube.tangents,
		cube.colors
	);
	modelType.addMaterial(material);
	modelRenderer.registerNewModel(modelType, 'cube');

	const camera = new Camera(glm, keyListener, mouseListener,3, -2, 5, -35);

	const instances: ModelInstance[] = [];

	const startTime = Date.now() / 1000;
	let lastUpdate = startTime;

	// for (let i = 0; i < 9; i++) {
	//   instances.push(new ModelInstance());
	//   modelRenderer.addInstance(instances[i], "cube");
	// }

	for (let i = 0; i < 9; i++) {
		instances.push(new ModelInstance((i % 3) * 3, Math.floor(i / 3) * 3));
		modelRenderer.addInstance(instances[i], 'cube');
	}

	const render = () => {
		const now = Date.now() / 1000;
		const deltaTime = now - lastUpdate;
		const uptime = now - startTime;
		lastUpdate = now;
		glm.clear(0, 0, 0, 1);
		const newLightPos = vec3.fromValues(
			Math.sin(uptime) * 200,
			Math.cos(uptime) * 200,
			200 + Math.sin(uptime * 0.3) * 100
		);
		light.setPosition(newLightPos);
		instances.forEach((instance, i) => {
			instance.updateRotation(0.1 * i, 0.1 * i, 0.1 * i);
		});
		camera.update(deltaTime);
		modelRenderer.render(light, camera);
		window.requestAnimationFrame(render);
	};

	window.requestAnimationFrame(render);
};
