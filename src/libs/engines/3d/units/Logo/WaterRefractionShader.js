/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 */



var WaterRefractionShader = {

	uniforms: {

		'color': {
			value: null
		},

		'time': {
			value: 0
		},

		'tDiffuse': {
			value: null
		},

		'tDudv': {
			value: null
		},

		'textureMatrix': {
			value: null
		}

	},

	vertexShader: `

		uniform mat4 textureMatrix;

		varying vec2 vUv;
		varying vec4 vUvRefraction;

		void main() {

			vUv = uv;

			vUvRefraction = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

	`,

	fragmentShader: `

  uniform vec3 color;
  uniform float time;
  uniform sampler2D tDiffuse;
  uniform sampler2D tDudv;

  varying vec2 vUv;
  varying vec4 vUvRefraction;


  void main() {

  vec2 vScale = vec2(.15, .15);

  // fetch bump texture, unpack from [0..1] to [-1..1]
  vec4 bumpTex=2.0 * texture2D(tDudv, vUv.xy) - 1.0;
  
  // displace texture coordinates
  vec2 newUV = bumpTex.xy * vScale + vUv.xy;


  // fetch refraction map
  gl_FragColor = vec4(texture2D(tDiffuse, newUV).xyz, 1);

  }
	`
};

export { WaterRefractionShader };
