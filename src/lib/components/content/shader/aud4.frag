// #version 460

/**
 Inspired by: 
 - https://glslsandbox.com/e#109604.0
 - https://glslsandbox.com/e#109612.0
**/ 



#ifdef GL_ES
precision mediump float;
#endif

uniform float uAudio; // Audio data passed from JavaScript
uniform vec2 uResolution;
uniform float uTime;
//uniform sampler2D u_tex;
// out vec4 FragColor;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;
// http://dev.thi.ng/gradients/
vec3 c_palette( float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

float line(float x, float y, float line_width, float edge_width){
  return smoothstep(x-line_width/2.0-edge_width, x-line_width/2.0, y) - smoothstep(x+line_width/2.0, x+line_width/2.0+edge_width, y);
}

float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness, len);
return result;
}

void main(){
  float zoom = 2.0;
  vec2 uv = zoom * ((gl_FragCoord.xy - (uResolution.xy * 0.5)) / uResolution.y);
  vec2 uv_2 = zoom * ((gl_FragCoord.xy - (uResolution.xy * 0.5)) / uResolution.y);
  //for textures, use below
  // vec2 uv = zoom * (gl_FragCoord.xy / uResolution.xy);
  // uv = fract(uv * 2.0)-0.5;

  float rate = uTime * 1.0 + (uAudio);
  float rate2 = uTime * 0.15 + (uAudio*1.5);
  float rate3 = (cos(uAudio*0.25)+sin(uTime*0.1));

  for(int i = 0; i < 5; i++){
    float curr_i = float(i);
    uv += sin(uv.yx * vec2(1.6, 1.1) * (curr_i + 11.0) + rate * curr_i * vec2(3.4, 0.5) / 10.0) * 0.1; 
  }
 
  float p1 = (abs(sin(uv.y + rate * 0.0) + sin(uv.x + rate * 0.0))) * 0.5;
  vec3 c1 = vec3(0.3569, 0.7765, 0.8392);
  // vec3 c_out = (c1*p1);
  vec3 c2 = c_palette(
    p1 + rate3,
    vec3(0.000, 0.333, 0.667),vec3(-0.052, 1.000, 1.000),vec3(1.088, -0.862, 0.138),vec3(0.448, -0.052, 0.778)
  );
  vec3 c2b = c_palette(
    p1 + rate3,
    vec3(0.448, -0.052, 0.778), vec3(1.088, -0.862, 0.138), vec3(-0.052, 1.000, 1.000), vec3(0.000, 0.333, 0.667)
  );

    float p2 = length(uv_2);
  // float p_1 = length(uv) * exp(-length(uv_reset)) - p_1b;
  float freq = 2.0;
  p2 = sin((p2 * freq) - (uTime*0.5) + (uAudio * 0.25)) / freq;
  p2 = abs(p2);
  
  p2 = 0.01 / p2;

  vec3 c3 = vec3(0.9098/rate, 0.898/rate2, 0.7216/rate2);
  vec3 c4 = vec3(0.898, 0.2627, 0.051);

  float f = 0.0;
  float g = 0.0;
  float h = 0.0;
  for(float i = 0.0; i < 40.0; i++){
    if(floor(41.0) < i){
      break;      
    }
    float s = sin(rate2 + i * PI / 2.0) * 0.8;
		float c = cos(rate2 + i * PI / 2.0) * 0.8;
		float d = abs(uv.x + c);
		float e = abs(uv.y + s);
		f += 0.001 / d;
		g += 0.001 / e;
		h += 0.00003 / (d * e);
  }

  vec3 c1c = vec3(f*c3+g*c4+vec3(h));

  vec3 cp1 = (c1c);
  vec3 cp2 = (p1*c3)+(p2*c4)+(c1*p1)+(c1c-0.2);
  vec3 cp3 = (c1c-0.2)+(p2*c4);
  vec3 cp4 = (p1*c1)+(c2*p1)+(c1c-0.2);
  vec3 cp5 = (c1c+0.15)+(p2*c1c);
  vec3 cp6 = (p1*c4)+(c2*p1)+(c1c-c3);
  vec3 cp7 = (p1*c1)+(p2*c1c)+(c3*p1)+(c1c);
  vec3 cp8 = (p1*c1)+(c2*p1)+(c1c-0.2);
  vec3 cp9 = (p1*c1)+(c2b*p1)+(c1c-0.2);
  vec3 cp10 = (p1*c2b)+(c2b*p1)+(c1c-c3);

  vec3 a1[10] = vec3[10](
    cp1,cp2,cp3,cp4,cp5,cp6,cp7,cp8,cp9,cp10
  );
  int a1_idx = int(mod(uTime/12.0, 10.0)); // Modulo cycles between 0, 1, 2...etc over time
  vec3 a_out1 = a1[int(a1_idx)];

  vec3 c_out = a_out1; 

  // vec3 c_out = (p1*c1)+(p2*c1c)+(c2*p1)+(c1c-0.2); 
  // vec3 c_out = (p2*c2); 
  // vec3(0.000, 0.333, 0.667),vec3(-0.052, 1.000, 1.000),vec3(1.088, -0.862, 0.138),vec3(0.448, -0.052, 0.778)
  // vec3(0.448, -0.052, 0.778), vec3(1.088, -0.862, 0.138), vec3(-0.052, 1.000, 1.000), vec3(0.000, 0.333, 0.667)
  //glslViewer -l FILE.frag texture.png 
  // or... glslViewer shader.frag textures/*
  //FragColor = texture2D(u_tex, uv);
  gl_FragColor = vec4(c_out, 1.0);
}