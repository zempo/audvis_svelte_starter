<script>
	import { simpleVert } from '$lib/helpers/index.js';
	import { onDestroy, onMount } from 'svelte';
	import AudioVisualizer from '$lib/classes/AudioVisualizer.js';
	import audFrag1 from './aud1.frag';

	let canvas; // Canvas element reference
	let visualizer;

	// just looping, no control
	onMount(() => {
		visualizer = new AudioVisualizer(canvas, simpleVert, audFrag1, '/audio/aud1.mp3', true, true);
	});

	onDestroy(() => {
		if (visualizer) {
			visualizer.dispose();
		}
	});
</script>

<canvas class="audvis_scene" bind:this={canvas}></canvas>
