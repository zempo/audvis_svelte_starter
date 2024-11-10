<script>
	import { onDestroy, onMount } from 'svelte';
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
			audio.pause(); // Stop audio playback
			audio.currentTime = 0; // Reset playback position
		}
		if (audioContext) {
			audioContext.close(); // Close audio context
		}
		renderer.dispose(); // Free up renderer resources
		material.dispose(); // Free up material resources
		scene.dispose(); // Dispose the scene if needed
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
			uniforms: {
				uTime: { value: 0.0 },
				uAudio: { value: 0.0 },
				uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
			},
			vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                uniform float uTime;
                uniform float uAudio;
                uniform vec2 uResolution;
                varying vec2 vUv;

                void main() {
                    float colorIntensity = smoothstep(0.0, 1.0, uAudio);
                    vec3 color = vec3(
                        0.5 + 0.5 * cos(uTime + colorIntensity * 3.0),
                        0.5 + 0.5 * sin(uTime + colorIntensity * 5.0),
                        0.5 + 0.5 * cos(uTime + colorIntensity * 7.0)
                    );
                    gl_FragColor = vec4(color, 1.0);
                }
            `
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
