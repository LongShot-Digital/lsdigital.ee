import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { join, relative, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, except for `node_modules` and mdsvex files. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');
			const isMdsvex = filename.endsWith('.md') || filename.endsWith('.svx');

			return isExternalLibrary || isMdsvex ? undefined : true;
		}
	},

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false
		})
	},

	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			layout: join(import.meta.dirname, 'src/lib/layouts/prose.svelte')
		})
	],

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
