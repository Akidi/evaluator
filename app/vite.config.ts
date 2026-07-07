/// <reference types="vitest/config" />
import { paraglideVitePlugin } from '@inlang/paraglide-js';

import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  server: {
    fs: {
      // app is a pnpm workspace member, so @sveltejs/kit and the root-level
      // $formula library resolve from the repo root, one level up.
      allow: ['..']
    },
    watch: {
      // Windows -> WSL (podman machine) -> container bind mounts don't
      // propagate inotify events, so the default watcher never sees edits.
      // Polling stats files instead, which works across that boundary.
      usePolling: true,
      interval: 300
    }
  },
  plugins: [
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
        experimental: { async: true }
      },
      adapter: adapter(),
      alias: { $formula: path.resolve(dirname, '..') },
      preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
      extensions: ['.svelte', '.svx', '.md'],
      experimental: {
        remoteFunctions: true,
        handleRenderingErrors: true,
        forkPreloads: true
      },
      typescript: {
        config: (config) => ({
          ...config,
          include: [...config.include, '../drizzle.config.ts']
        })
      }
    }),
    paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' })
  ],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium', headless: true }]
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**']
        }
      },

      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      },

      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }]
          }
        }
      }
    ]
  }
});
