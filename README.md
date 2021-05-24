<p align="center">
  <img src="https://user-images.githubusercontent.com/1671563/111436322-21b31180-8702-11eb-943f-93b5a0b02b50.png" alt="Storybook React Testing" width="100" />
</p>

<p align="center">Testing utilities that allow you to reuse your stories in your unit tests</p>

<br/>

## The problem

You are using [Storybook](https://storybook.js.org/) for your components and writing tests for them with [jest](https://jestjs.io/), most likely alongside [Enzyme](https://enzymejs.github.io/enzyme/) or [React testing library](https://testing-library.com/). In your Storybook stories, you already defined the scenarios of your components. You also set up the necessary decorators (theming, routing, state management, etc.) to make them all render correctly. When you're writing tests, you also end up defining scenarios of your components, as well as setting up the necessary decorators. By doing the same thing twice, you feel like you're spending too much effort, making writing and maintaining stories/tests become less like fun and more like a burden.

## The solution

`@storybook/testing-react` is a solution to reuse your Storybook stories in your React tests. By reusing your stories in your tests, you have a catalog of component scenarios ready to be tested. All [args](https://storybook.js.org/docs/react/writing-stories/args) and [decorators](https://storybook.js.org/docs/react/writing-stories/decorators) from your [story](https://storybook.js.org/docs/react/api/csf#named-story-exports) and its [meta](https://storybook.js.org/docs/react/api/csf#default-export), and also [global decorators](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators), will be composed by this library and returned to you in a simple component. This way, in your unit tests, all you have to do is select which story you want to render, and all the necessary setup will be already done for you. This is the missing piece that allows for better shareability and maintenance between writing tests and writing Storybook stories.

## Installation

This library should be installed as one of your project's `devDependencies`:

via [npm](https://www.npmjs.com/)

```
npm install --save-dev @storybook/testing-react
```

or via [yarn](https://classic.yarnpkg.com/)

```
yarn add --dev @storybook/testing-react
```

## Setup

### Storybook 6 and Component Story Format

This library requires you to be using Storybook version 6, [Component Story Format (CSF)](https://storybook.js.org/docs/react/api/csf) and [hoisted CSF annotations](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations), which is the recommended way to write stories since Storybook 6.

Essentially, if you use Storybook 6 and your stories look similar to this, you're good to go!

```jsx
// CSF: default export (meta) + named exports (stories)
export default {
  title: 'Example/Button',
  component: Button,
};

const Primary = args => <Button {...args} />; // or with Template.bind({})
Primary.args = {
  primary: true,
};
```

### Global config

> This is an optional step. If you don't have [global decorators](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators), there's no need to do this. However, if you do, this is a necessary step for your global decorators to be applied.

If you have global decorators/parameters/etc and want them applied to your stories when testing them, you first need to set this up. You can do this by adding to or creating a jest [setup file](https://jestjs.io/docs/configuration#setupfiles-array):

```tsx
// setupFile.js <-- this will run before the tests in jest.
import { setGlobalConfig } from '@storybook/testing-react';
import * as globalStorybookConfig from './.storybook/preview'; // path of your preview.js file

setGlobalConfig(globalStorybookConfig);
```

For the setup file to be picked up, you need to pass it as an option to jest in your test command:

```json
// package.json
{
  "test": "react-scripts test --setupFiles ./setupFile.js"
}
```

## Usage

### `composeStories`

`composeStories` will process all stories from the component you specify, compose args/decorators in all of them and return an object containing the composed stories.

If you use the composed story (e.g. PrimaryButton), the component will render with the args that are passed in the story. However, you are free to pass any props on top of the component, and those props will override the default values passed in the story's args.

```tsx
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Button.stories'; // import all stories from the stories file

// Every component that is returned maps 1:1 with the stories, but they already contain all decorators from story level, meta level and global level.
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText(
    /Text coming from args in stories file!/i
  );
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overriden props', () => {
  render(<Primary>Hello world</Primary>); // you can override props and they will get merged with values from the Story's args
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

### `composeStory`

You can use `composeStory` if you wish to apply it for a single story rather than all of your stories. You need to pass the meta (default export) as well.

```tsx
import { render, screen } from '@testing-library/react';
import { composeStory } from '@storybook/testing-react';
import Meta, { Primary as PrimaryStory } from './Button.stories';

// Returns a component that already contain all decorators from story level, meta level and global level.
const Primary = composeStory(PrimaryStory, Meta);

test('onclick handler is called', async () => {
  const onClickSpy = jest.fn();
  render(<Primary onClick={onClickSpy} />);
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
```

## Typescript

`@storybook/testing-react` is typescript ready and provides autocompletion to easily detect all stories of your component:

![component autocompletion](https://user-images.githubusercontent.com/1671563/111436219-034d1600-8702-11eb-82bb-36913b235787.png)

It also provides the props of the components just as you would normally expect when using them directly in your tests:

![props autocompletion](https://user-images.githubusercontent.com/1671563/111436252-0d6f1480-8702-11eb-8186-0102863f66f1.png)

### Disclaimer

For the types to be automatically picked up, your stories must be typed. See an example:

```tsx
import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, ButtonProps } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
} as Meta;

// Story<Props> is the key piece needed for typescript validation
const Template: Story<ButtonProps> = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'foo',
  size: 'large',
};
```

## License

[MIT](./LICENSE)
