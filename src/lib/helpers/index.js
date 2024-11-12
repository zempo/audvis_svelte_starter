export const simpleVert = `varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`;
export const fullVert = `
                void main() {
                  gl_Position = vec4(position, 1.0);
                }`;
