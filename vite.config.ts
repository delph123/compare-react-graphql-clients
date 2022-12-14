/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8000,
		open: true,
		proxy: {
			"/graphql": "http://localhost:4000",
		},
	},
	build: {
		outDir: "build",
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
		css: false,
		coverage: {
			provider: "c8",
			reporter: "html",
			all: true,
		},
	},
});
