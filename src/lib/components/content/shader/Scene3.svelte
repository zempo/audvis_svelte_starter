<script>
	import AudioVisualizer from '$lib/classes/AudioVisualizer.js';
	import { fullVert } from '$lib/helpers/index.js';
	import { onDestroy, onMount } from 'svelte';
	import audFrag3 from './aud3.frag';

	let canvas; // Canvas element reference
	let visualizer;
	let isPlaying = false;

	onMount(() => {
		visualizer = new AudioVisualizer(
			canvas,
			fullVert,
			audFrag3,
			'/audio/aud2.mp3',
			true,
			isPlaying
		);
	});

	onDestroy(() => {
		if (visualizer) {
			visualizer.dispose();
		}
	});

	function togglePlayPause() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			visualizer.play();
		} else {
			visualizer.pause();
		}
	}
</script>

<button on:click={togglePlayPause}>
	{isPlaying ? 'Pause' : 'Play'}
</button>
<canvas class="audvis_scene" bind:this={canvas}></canvas>
