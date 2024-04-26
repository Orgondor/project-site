import { GLManager } from './GLManager/GLM';
import QuadRenderer from './Renderer/QuadRenderer';
import ModelType from './Models/ModelType';
import ModelInstance from './Models/ModelInstance';
import quad from './Models/quad';
import Camera from './Camera/camera';
import { MouseListener } from './EventHandlers/mouse';
import { KeyListener } from './EventHandlers/keyboard';
import { QuadShader } from './Shaders/QuadShader/shader';

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

	const modelRenderer = new QuadRenderer(glm);
	const modelType = new ModelType(glm, quad.vertices, quad.indices, quad.normals, quad.textureCoords);
	modelRenderer.registerNewModel(modelType, QuadShader.Mandelbrot, 'quad');

	const camera = new Camera(glm, keyListener, mouseListener,0, 0, 1.5);

	const startTime = Date.now() / 1000;
	let lastUpdate = startTime;

	for (let i = 0; i < 9; i++) {
		const col = i % 3;
		const row = Math.floor(i / 3);
		const instance = new ModelInstance();
		instance.updateRotation(0, 0, 0);
		instance.updatePosition((col-1) *2.1, (row-1) *2.1, 0);
		modelRenderer.addInstance(instance, QuadShader.Mandelbrot, 'quad');
	}

	const render = () => {
		const now = Date.now() / 1000;
		const deltaTime = now - lastUpdate;
		lastUpdate = now;
		glm.clear(0, 0, 0, 1);
		//instance.updateRotation(0.1, 0, 0);
		camera.update(deltaTime);
		modelRenderer.render(camera, now - startTime);
		window.requestAnimationFrame(render);
	};

	window.requestAnimationFrame(render);
};
