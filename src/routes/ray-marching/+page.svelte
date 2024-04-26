<script lang="ts">
	import { onMount } from 'svelte';
	import runRayMarching from '$lib/webgl/QuadWebGL';

	onMount(() => {
		runRayMarching('quadwebgl');
	});
</script>

<h1 class="text-3xl my-10">Ray Marching</h1>

<canvas id="quadwebgl" height="800" width="100%" />
