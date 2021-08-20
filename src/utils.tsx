import React from 'react';

import type { FunctionComponent } from 'react';
import type { Story } from '@storybook/react';

export const globalRender: Story = (args, { parameters }) => {
  if (!parameters.component) {
    throw new Error(`
      Could not render story due to missing 'component' property in Meta.
      Please refer to https://github.com/storybookjs/testing-react#csf3
    `);
  }

  const Component = parameters.component as FunctionComponent;
  return <Component {...args} />;
};

const invalidStoryTypes = new Set(['string', 'number', 'boolean', 'symbol']);

export const isInvalidStory = (story?: any) => (!story || Array.isArray(story) || invalidStoryTypes.has(typeof story))