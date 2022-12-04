import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  logLevel: 'debug',
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  docs: {
    docsPage: 'automatic',
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  features: {
    interactionsDebugger: true,
  },
};

module.exports = config;
