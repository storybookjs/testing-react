import React from 'react';
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
