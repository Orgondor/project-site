<script lang="ts">
	import { onMount } from 'svelte';
	import runMixed from '$lib/webgl/QuadWebGL';
	import runRayMarching from '$lib/webgl/rayMarching';
	import runMandelbrot from '$lib/webgl/mandelbrot';
	import runTextured from '$lib/webgl/WebGL';

	onMount(() => {
		runMixed('mixed');
		runRayMarching('rayMarching');
		runMandelbrot('mandelbrot');
		runTextured('textured');
	});
</script>

<div class="flex flex-row justify-center space-x-8">
	<div>
		<h1 class="text-3xl my-10">Ray Marching</h1>

		<canvas id="rayMarching" style="height: 30vh; width: 30vh;" />
	</div>
	<div>
		<h1 class="text-3xl my-10">Mandelbrot</h1>

		<canvas id="mandelbrot" style="height: 30vh; width: 30vh;" />
	</div>
	<div>
		<h1 class="text-3xl my-10">Mixed</h1>

		<canvas id="mixed" style="height: 30vh; width: 30vh;" />
	</div>
</div>

<div class="flex flex-row justify-center">
	<div>
		<h1 class="text-3xl my-10">Textured</h1>

		<canvas id="textured" style="height: 40vh; width: 60vh;" />
	</div>
</div>
