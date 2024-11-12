import * as THREE from 'three';

/**
 * ? USAGE
 * <script>
	import { simpleVert } from '$lib/helpers/index.js';
	import { onDestroy, onMount } from 'svelte';
	import AudioVisualizer from '$lib/classes/AudioVisualizer.js';
	import audFrag1 from './aud1.frag';

	let canvas; // Canvas element reference
	let visualizer;

	onMount(() => {
		visualizer = new AudioVisualizer(canvas, simpleVert, audFrag1, '/audio/aud1.mp3', true);
	});

	onDestroy(() => {
		if (visualizer) {
			visualizer.dispose();
		}
	});
</script>

<canvas class="audvis_scene" bind:this={canvas}></canvas>
 * 
 * */

class AudioVisualizer {
	constructor(canvas, vertShader, fragmentShader, audioFile, loopAudio = false, isPlaying = false) {
		this.canvas = canvas;
		this.fragmentShader = fragmentShader;
		this.vertShader =
			vertShader ??
			`
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `;
		this.audioFile = audioFile;
		this.loopAudio = loopAudio;
		this.isPlaying = isPlaying;

		// Initialize essential properties
		this.renderer = null;
		this.scene = null;
		this.camera = null;
		this.material = null;
		this.analyser = null;
		this.audioContext = null;
		this.source = null;
		this.frequencyData = null;
		this.audio = null;

		this.initScene();
		this.initAudio();
		// this.animate();
		if (this.isPlaying) this.play();
	}

	initScene() {
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.z = 5;

		const geometry = new THREE.PlaneGeometry(5, 5);
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0.0 },
				uAudio: { value: 0.0 },
				uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
			},
			vertexShader: this.vertShader,
			fragmentShader: this.fragmentShader // Use the provided fragment shader
		});
		const plane = new THREE.Mesh(geometry, this.material);
		this.scene.add(plane);
	}

	initAudio() {
		this.audio = new Audio(this.audioFile);
		this.audio.loop = this.loopAudio;
		this.audio.crossOrigin = 'anonymous';
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = this.audioContext.createAnalyser();
		this.source = this.audioContext.createMediaElementSource(this.audio);
		this.source.connect(this.analyser);
		this.analyser.connect(this.audioContext.destination);

		this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
		// this.audio.play();
	}

	play() {
		this.audio.play();
		this.isPlaying = true;
		this.animate();
	}

	pause() {
		this.audio.pause();
		this.isPlaying = false;
	}

	animate = () => {
		if (!this.isPlaying) return;

		requestAnimationFrame(this.animate);
		this.analyser.getByteFrequencyData(this.frequencyData);
		const avgFrequency = this.frequencyData.reduce((a, b) => a + b, 0) / this.frequencyData.length;

		this.material.uniforms.uTime.value += 0.05;
		this.material.uniforms.uAudio.value = avgFrequency / 255.0;

		this.renderer.render(this.scene, this.camera);
	};

	dispose() {
		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
		if (this.audioContext) {
			this.audioContext.close();
		}

		if (this.renderer) {
			this.renderer.dispose();
		}

		if (this.material) {
			this.material.dispose();
		}

		if (this.scene) {
			this.scene.dispose();
		}
	}
}

export default AudioVisualizer;
