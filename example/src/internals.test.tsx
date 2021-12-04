import React from 'react';
import addons from '@storybook/addons';
import { render, screen } from '@testing-library/react';

import { composeStories, composeStory } from '../../dist/index';

import * as stories from './components/Button.stories';
import * as globalConfig from '../.storybook/preview';

const { StoryWithParamsAndDecorator } = composeStories(stories);

test('returns composed parameters from story', () => {
  expect(StoryWithParamsAndDecorator.args).toEqual(stories.StoryWithParamsAndDecorator.args);
  expect(StoryWithParamsAndDecorator.parameters).toEqual({
    ...stories.StoryWithParamsAndDecorator.parameters,
    ...globalConfig.parameters,
    component: stories.default.component
  });
  expect(StoryWithParamsAndDecorator.decorators).toEqual([
    ...stories.StoryWithParamsAndDecorator.decorators!,
    ...globalConfig.decorators,
  ]);
});

// common in addons that need to communicate between manager and preview
test('should pass with decorators that need addons channel', () => {
  const PrimaryWithChannels = composeStory(stories.Primary, stories.default, {
    decorators: [
      (StoryFn: any) => {
        addons.getChannel();
        return <StoryFn />;
      },
    ],
  });
  render(<PrimaryWithChannels>Hello world</PrimaryWithChannels>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});

describe('Unsupported formats', () => {
  test('should throw error StoryFn.story notation', () => {
    const UnsupportedStory = () => <div>hello world</div>;
    UnsupportedStory.story = { parameters: {} }

    const UnsupportedStoryModule: any = {
      default: {},
      UnsupportedStory
    }

    expect(() => {
      composeStories(UnsupportedStoryModule)
    }).toThrow();
  });

  test('should throw error with non component stories', () => {
    const UnsupportedStoryModule: any = {
      default: {},
      UnsupportedStory: 123
    }

    expect(() => {
      composeStories(UnsupportedStoryModule)
    }).toThrow();
  });
})

describe('non-story exports', () => {
  test('should filter non-story exports with excludeStories', () => {
    const StoryModuleWithNonStoryExports = {
      default: {
        excludeStories: /.*Data/
      },
      LegitimateStory: () => <div>hello world</div>,
      mockData: {}
    }

    const result = composeStories(StoryModuleWithNonStoryExports)
    expect(Object.keys(result)).not.toContain('mockData');
  });

  test('should filter non-story exports with includeStories', () => {
    const StoryModuleWithNonStoryExports = {
      default: {
        includeStories: /.*Story/
      },
      LegitimateStory: () => <div>hello world</div>,
      mockData: {},
    }

    const result = composeStories(StoryModuleWithNonStoryExports)
    expect(Object.keys(result)).not.toContain('mockData');
  });
})
