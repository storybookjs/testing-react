import React from 'react';

import type { ArgsStoryFn } from '@storybook/csf';
import type { ReactFramework } from '@storybook/react';
import type { TestingStory } from './types';

const invalidStoryTypes = new Set(['string', 'number', 'boolean', 'symbol']);

export const isInvalidStory = (story?: any) => (!story || Array.isArray(story) || invalidStoryTypes.has(typeof story))

export const globalRender: ArgsStoryFn<ReactFramework> = (args, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];
export function objectEntries<T extends object>(t: T): Entries<T>[] {
  return Object.entries(t) as any;
}

export const getStoryName = (story: TestingStory) => {
  if (story.storyName) {
    return story.storyName
  }

  if (typeof story !== 'function' && story.name) {
    return story.name
  }

  return undefined
}