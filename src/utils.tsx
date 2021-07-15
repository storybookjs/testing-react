import React from 'react';

import type { FunctionComponent } from 'react';
import type { Story } from '@storybook/react';

export const globalRender: Story = (args, { parameters }) => {
  const Component = parameters.component as FunctionComponent;
  return <Component {...args} />;
};

const invalidStoryTypes = new Set(['string', 'number', 'boolean', 'symbol']);

export const isInvalidStory = (story?: any) => (!story || Array.isArray(story) || invalidStoryTypes.has(typeof story))