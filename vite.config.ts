import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	// Source Maps
	// See https://web.dev/source-maps/
	build: {
		sourcemap: true, // enable production source maps
	  },
	  css: {
		devSourcemap: true // enable CSS source maps during development
	  }
});
