import addons, { mockChannel } from '@storybook/addons';
import type { Meta } from '@storybook/react';
//@ts-ignore
// import { render as globalRender } from '@storybook/react/dist/cjs/client/preview/render';
//@ts-ignore
import { prepareStory } from '@storybook/store/dist/cjs/prepareStory'
//@ts-ignore
import { processCSFFile } from '@storybook/store/dist/cjs/processCSFFile'
//@ts-ignore
import { HooksContext } from '@storybook/store/dist/cjs/hooks'

import type { GlobalConfig, StoriesWithPartialProps, StoryFile, TestingStory } from './types';
import { objectEntries, globalRender } from './utils';

// Some addons use the channel api to communicate between manager/preview, and this is a client only feature, therefore we must mock it.
addons.setChannel(mockChannel());

let globalStorybookConfig = {
  render: globalRender
};

/** Function that sets the globalConfig of your storybook. The global config is the preview module of your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *```jsx
 * // setup.js (for jest)
 * import { setGlobalConfig } from '@storybook/testing-react';
 * import * as globalStorybookConfig from './.storybook/preview';
 *
 * setGlobalConfig(globalStorybookConfig);
 *```
 *
 * @param config - e.g. (import * as globalConfig from '../.storybook/preview')
 */
export function setGlobalConfig(config: GlobalConfig) {
  globalStorybookConfig = {...globalStorybookConfig, ...config};
}


/**
 * Function that will receive a story along with meta (e.g. a default export from a .stories file)
 * and optionally a globalConfig e.g. (import * from '../.storybook/preview)
 * and will return a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing a story in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { render } from '@testing-library/react';
 * import { composeStory } from '@storybook/testing-react';
 * import Meta, { Primary as PrimaryStory } from './Button.stories';
 *
 * const Primary = composeStory(PrimaryStory, Meta);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param story
 * @param meta - e.g. (import Meta from './Button.stories')
 * @param [globalConfig] - e.g. (import * as globalConfig from '../.storybook/preview') this can be applied automatically if you use `setGlobalConfig` in your setup files.
 */
export function composeStory<GenericArgs>(
  story: TestingStory<GenericArgs>,
  meta: Meta<GenericArgs | any>,
  globalConfig: GlobalConfig = globalStorybookConfig
) {
  story.render = typeof story === 'function' ?  story : story.render ?? globalRender;

  const preparedStory = prepareStory(
    story,
    meta,
    globalConfig
  );

  const composedStory = (extraArgs: Partial<GenericArgs>) => {
    const context = {
      ...preparedStory,
      hooks : new HooksContext(),
      globals : {},
      args : {...preparedStory.initialArgs, ...extraArgs },
    }

    return preparedStory.unboundStoryFn(context)
  }

  composedStory.storyName = story.storyName || story.name;
  composedStory.args = preparedStory.initialArgs;
  composedStory.play = preparedStory.playFunction;
  composedStory.parameters = preparedStory.parameters;

  return composedStory
}

/**
 * Function that will receive a stories import (e.g. `import * as stories from './Button.stories'`)
 * and optionally a globalConfig (e.g. `import * from '../.storybook/preview`)
 * and will return an object containing all the stories passed, but now as a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing stories in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { render } from '@testing-library/react';
 * import { composeStories } from '@storybook/testing-react';
 * import * as stories from './Button.stories';
 *
 * const { Primary, Secondary } = composeStories(stories);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param storiesImport - e.g. (import * as stories from './Button.stories')
 * @param [globalConfig] - e.g. (import * as globalConfig from '../.storybook/preview') this can be applied automatically if you use `setGlobalConfig` in your setup files.
 */
export function composeStories<
  TModule extends StoryFile
>(storiesImport: TModule, globalConfig?: GlobalConfig) {
  const { default: meta } = storiesImport;

  const result = processCSFFile(storiesImport, '', meta.title)

  // This function should take this as input: 
  // {
  //   default: Meta,
  //   Primary: Story<ButtonProps>, <-- Props extends Args
  //   Secondary: Story<OtherProps>,
  // }
    
  // And strips out default, then return composed stories as output: 
  // {
  //   Primary: ComposedStory<Partial<ButtonProps>>,
  //   Secondary: ComposedStory<Partial<OtherProps>>,
  // }

  // Compose an object containing all processed stories passed as parameters
  const composedStories = objectEntries(result.stories).filter(Boolean).reduce<Partial<StoriesWithPartialProps<TModule>>>(
    (storiesMap, [_key, story]) => {
      // const storyName = String(key)

      const result = Object.assign(storiesMap, {
        [story.exportsName]: composeStory(story, meta, globalConfig)
      });
      return result;
    },
    {}
  );

  // @TODO: the inferred type of composedStories is correct but Partial.
  // investigate whether we can return an unpartial type of that without this hack
  return composedStories as unknown as Omit<StoriesWithPartialProps<TModule>, keyof StoryFile>;
}