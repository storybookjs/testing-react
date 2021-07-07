import type { StorybookConfig } from '@storybook/react/types';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  logLevel: 'debug',
  addons: ['@storybook/preset-create-react-app', '@storybook/addon-essentials'],
  features: {
    previewCsfV3: true,
  },
};

module.exports = config;
