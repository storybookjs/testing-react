import React from 'react';
import addons from '@storybook/addons';
import { render, screen } from '@testing-library/react';

import { composeStories, composeStory } from '../../../dist/index';

import * as stories from './Button.stories';

// example with composeStories, returns an object with all stories composed with args/decorators
const { Primary } = composeStories(stories);

// example with composeStory, returns a single story composed with args/decorators
const Secondary = composeStory(stories.Secondary, stories.default);

test('renders primary button', () => {
  render(<Primary>Hello world</Primary>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});

test('reuses args from composed story', () => {
  render(<Secondary />);
  const buttonElement = screen.getByRole("button");
  expect(buttonElement.textContent).toEqual(Secondary.args!.children);
});

test('onclick handler is called', async () => {
  const onClickSpy = jest.fn();
  render(<Secondary onClick={onClickSpy} />);
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});

test('reuses args from composeStories', () => {
  const { getByText } = render(<Primary />);
  const buttonElement = getByText(/foo/i);
  expect(buttonElement).not.toBeNull();
});

describe('GlobalConfig', () => {
  test('renders with default globalConfig', () => {
    const WithEnglishText = composeStory(
      stories.StoryWithLocale,
      stories.default
    );
    const { getByText } = render(<WithEnglishText />);
    const buttonElement = getByText('Hello!');
    expect(buttonElement).not.toBeNull();
  });

  test('renders with custom globalConfig', () => {
    const WithPortugueseText = composeStory(
      stories.StoryWithLocale,
      stories.default,
      { globalTypes: { locale: { defaultValue: 'pt' } } }
    );
    const { getByText } = render(<WithPortugueseText />);
    const buttonElement = getByText('Olá!');
    expect(buttonElement).not.toBeNull();
  });
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

it('should ignore __esModules property from jest mocking', () => {
  const mockedModule = {
    __esModule: true,
    default: { title: 'Components/Button' },
    Primary: () => {},
  };

  expect(() => {
    composeStories(mockedModule)
  }).not.toThrow();
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
