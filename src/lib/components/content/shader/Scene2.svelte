<script>
	import { onDestroy, onMount } from 'svelte';
	import audFrag2 from './aud2.frag';
	import * as THREE from 'three';

	let audio;
	let renderer, scene, camera, material;
	let analyser, audioContext, source;
	let frequencyData;
	let canvas; // Canvas element reference

	onMount(() => {
		initScene();
		initAudio();
		animate();
	});

	onDestroy(() => {
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
		if (audioContext) {
			audioContext.close();
		}

		// Check if renderer exists before disposing
		if (renderer) {
			renderer.dispose();
		}

		// Check if material exists before disposing
		if (material) {
			material.dispose();
		}

		// Check if scene exists before disposing
		if (scene) {
			scene.dispose();
		}
	});

	function initScene() {
		// Initialize Renderer with the canvas element
		renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(window.innerWidth, window.innerHeight);

		// Scene and Camera setup
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 5;

		// Plane with Shader Material
		const geometry = new THREE.PlaneGeometry(5, 5);
		material = new THREE.ShaderMaterial({
			fragmentShader: audFrag2,
			vertexShader: `
								varying vec2 vUv;
								void main() {
										vUv = uv;
										gl_Position = vec4(position, 1.0);
								}
						`,
			uniforms: {
				uTime: { value: 0.0 },
				uAudio: { value: 0.0 },
				uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
			}
		});
		const plane = new THREE.Mesh(geometry, material);
		scene.add(plane);
	}

	function initAudio() {
		// Create Audio Context
		audio = new Audio('/audio/aud1.mp3');
		audio.crossOrigin = 'anonymous';
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		analyser = audioContext.createAnalyser();
		source = audioContext.createMediaElementSource(audio);
		source.connect(analyser);
		analyser.connect(audioContext.destination);

		// Frequency Data Array
		frequencyData = new Uint8Array(analyser.frequencyBinCount);

		// Play the audio
		audio.play();
	}

	function animate() {
		requestAnimationFrame(animate);

		// Get audio frequency data
		analyser.getByteFrequencyData(frequencyData);
		const avgFrequency = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

		// Update shader uniforms
		material.uniforms.uTime.value += 0.05;
		material.uniforms.uAudio.value = avgFrequency / 255.0; // Normalize to [0, 1]

		renderer.render(scene, camera);
	}
</script>

<canvas class="audvis_scene" bind:this={canvas}></canvas>
