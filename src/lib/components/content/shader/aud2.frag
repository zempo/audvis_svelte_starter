#ifdef GL_ES
precision highp float;
#endif


uniform float uAudio; // Audio data passed from JavaScript
uniform vec2 uResolution;
uniform float uTime;
// out vec4 FragColor;

const float PI = 3.14159265359;
float mkPoly(vec2 position, float radius, float sides){
  position = position * 2.0 - 1.0;
  float angle = atan(position.x, position.y);
  float slice = PI * 2.0 / sides;
  return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}

void main(){
  vec2 uv = ((gl_FragCoord.xy - (uResolution.xy * 0.5)) / uResolution.y);
  // vec2 translate = vec2((sin(uTime / 1.0) * 0.25),0.0);
  // uv += translate;

  // float angle = uTime * 0.3;
  float colorIntensity = smoothstep(0.0, 1.0, uAudio);
  float angle = uTime * 0.05 + (colorIntensity / 8.0);
  for (int i = 0; i < 10; i++){
    uv = abs(uv);
    uv -= 0.5;
    uv *= 1.1;
    uv *= mat2(
      cos(angle), -sin(angle),
      sin(angle), cos(angle)  
    );
  }
  vec3 c_1 = vec3(
    length(uv + vec2(colorIntensity, colorIntensity)), 
    length(uv + vec2(0.2 + colorIntensity, -0.3)),
    length(uv + vec2(0.4 + colorIntensity, -0.2))
  );

  // float loop_time = cos(6.0);
  // Calculate the alpha value based on time
  float a_1_time = 3.0; // Duration in seconds for the fade
  float a_1_lim = 0.5;   // Target alpha value
  // Calculate the alpha based on the time elapsed
  float a_1 = smoothstep(0.0, a_1_time, uTime) * a_1_lim;
  // Ensure alpha does not go below 0.5
  if (a_1 < 0.8) {
    a_1 = 1.0;
  }
  // float a_1 = alpha;

  gl_FragColor = vec4(c_1, a_1);
}