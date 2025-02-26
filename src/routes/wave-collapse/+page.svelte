<script lang="ts">
	import { onMount } from 'svelte';
  import { WaveCollapse } from "$lib/WaveCollapse";
  import { cancelWaveCollapse, setSpeed } from "$lib/WaveCollapse/defines";

  import circuitTiles from '$lib/images/WaveCollapse/CircuitTiles.png';
  import forest from '$lib/images/WaveCollapse/Forest.png';
  import simpleSprites from '$lib/images/WaveCollapse/SimpleSprites.png';
  import mapSettings from '$lib/images/WaveCollapse/mapSettings.json';
	import type { MapSettings, MapPath } from '$lib/WaveCollapse/types';

  import RangeSlider from 'svelte-range-slider-pips';

  const typedMapSettings: MapSettings = mapSettings as unknown as MapSettings;
  const mapPaths = Object.keys(typedMapSettings) as MapPath[];

  const imagePaths = {
    CircuitTiles: circuitTiles,
    Forest: forest,
    SimpleSprites: simpleSprites
  };
  const canvasId = "waveCollapseCanvas";

  let selectedSpriteMap: MapPath = "SimpleSprites";
  let running = false;
  let cancel = false;

	onMount(() => {
    redrawCanvas();
	});

  const collapse = () =>
    WaveCollapse(
      canvasId,
      imagePaths[selectedSpriteMap],
      typedMapSettings[selectedSpriteMap],
      (input) => running = input,
      (input) => cancel = input
    );

  const redrawCanvas = () => {
    if (running) {
      cancelWaveCollapse();
      return;
    }
    
    collapse();
  };
</script>


<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;">
<div style='width: max(50vw, 40vh); padding-top: 16px; padding-bottom: 16px; display: flex; flex-direction: column; '>
  <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
    <div>Choose Texture:</div>
    <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-around;">
      {#each mapPaths as filename, i}
        <div style="width: max(10vw, 8vh)">
          <img
            src={imagePaths[filename]}
            style={`width: 100%; image-rendering: pixelated; border-style: solid; border-width: 3px; border-color: ${selectedSpriteMap === filename ? "red" : "black"}; cursor: pointer`}
            on:click={() => selectedSpriteMap = filename}
          />
        </div>
      {/each}
    </div>
  </div>
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; margin-top: 10px;">
    <div>
      <button on:click={redrawCanvas} style="padding: 5px; border: 2px solid black; border-radius: 3px; background-color: white;">{`${running ? "Cancel" : "Redraw"}`}</button>
    </div>
    <div style="width: max(20vw, 200px); display: flex; flex-direction: column; align-items: center;">
      <div>
        Draw speed:
      </div>
      <div style="width: 100%">
        <RangeSlider
        value={100}
        min={0}
        max={200}
        step={0.01}
        on:change={(e) => setSpeed(e.detail.value / 100)}
        />
      </div>
    </div>
    <!-- <Slider
      aria-label="Speed"
      sx={{ width: "min(500px, 50vw)" }}
      min={0}
      max={2}
      step={0.01}
      value={value}
      onChange={handleChange}
    /> -->
  </div>
</div>
<canvas
  id={canvasId}
  style={'border: 1px solid black; width: min(50vh, 95vw); height: min(50vh, 95vw); margin-top: 10px;'}
  width={300}
  height={300}
/>
</div>
