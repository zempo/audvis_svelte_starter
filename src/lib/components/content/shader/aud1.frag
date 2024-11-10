#ifdef GL_ES
precision mediump float;
#endif

uniform float uAudio; // Audio data passed from JavaScript
uniform vec2 uResolution; // Canvas resolution
uniform float uTime; // Time for continuous color cycling

void main() {
    vec2 st = gl_FragCoord.xy / uResolution; // Normalize coordinates
    
    // Adjust color based on audio data
    float colorIntensity = smoothstep(0.0, 1.0, uAudio); // Map audio value [0,1]

    // Create a color gradient based on time and audio input
    vec3 color = vec3(
        0.5 + 0.5 * cos(uTime + colorIntensity * 3.0),
        0.5 + 0.5 * sin(uTime + colorIntensity * 5.0),
        0.5 + 0.5 * cos(uTime + colorIntensity * 7.0)
    );

    gl_FragColor = vec4(color, 1.0); // Output color to fragment
}