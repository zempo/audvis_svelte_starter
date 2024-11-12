import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { sveltePreprocess } from 'svelte-preprocess';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src/lib/style/`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},

	preprocess: [
		mdsvex(),
		sveltePreprocess({
			scss: {
				// We can use a path relative to the root because
				// svelte-preprocess automatically adds it to `includePaths`
				// if none is defined.
				prependData: `@use '${sassPath}vars';`
			}
		})
	],
	extensions: ['.svelte', '.svx']
};

export default config;
