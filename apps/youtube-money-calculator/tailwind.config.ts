import type { Config } from 'tailwindcss';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
} satisfies Config;
