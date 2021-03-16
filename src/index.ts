import { defaultDecorateStory, combineParameters } from '@storybook/client-api';
import type { Meta, Story, StoryContext } from '@storybook/react';
import type { GlobalConfig } from './types';

let globalStorybookConfig = {};

/** Function that sets the globalConfig of your storybook. The global config is the preview module of your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *```jsx
 * // setup.js (for jest)
 * import { setGlobalConfig } from '@storybook/react-testing';
 * import * as globalStorybookConfig from './.storybook/preview';
 *
 * setGlobalConfig(globalStorybookConfig);
 *```
 *
 * @param config - e.g. (import * as globalConfig from '../.storybook/preview')
 */
export function setGlobalConfig(config: GlobalConfig) {
  globalStorybookConfig = config;
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
 * import { composeStory } from '@storybook/react-testing';
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
  story: Story<GenericArgs>,
  meta: Meta,
  globalConfig: GlobalConfig = globalStorybookConfig
) {
  const finalStoryFn = (context: StoryContext) => {
    const { passArgsFirst = true } = context.parameters;
    if (!passArgsFirst) {
      throw new Error(
        'composeStory does not support legacy style stories (with passArgsFirst = false).'
      );
    }
    return story(context.args as GenericArgs, context);
  };

  const combinedDecorators = [
    ...(story.decorators || []),
    ...(meta?.decorators || []),
    ...(globalConfig?.decorators || []),
  ];

  const decorated = defaultDecorateStory(
    finalStoryFn as any,
    combinedDecorators as any
  );

  return ((extraArgs: Record<string, any>) =>
    decorated({
      id: '',
      kind: '',
      name: '',
      argTypes: globalConfig.argTypes || {},
      globals: globalConfig.globalTypes,
      parameters: combineParameters(
        globalConfig.parameters || {},
        meta.parameters || {},
        story.parameters || {}
      ),
      args: {
        ...meta.args,
        ...story.args,
        ...extraArgs,
      },
    })) as Story<Partial<GenericArgs>>;
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
 * import { composeStories } from '@storybook/react-testing';
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
  T extends { default: Meta } & { [K in keyof T]: T[K] }
>(storiesImport: T, globalConfig?: GlobalConfig) {
  const { default: meta, ...stories } = storiesImport;

  // Compose an object containing all processed stories passed as parameters
  const composedStories = Object.entries(stories).reduce(
    (storiesMap, [key, story]: [string, unknown]) => {
      // eslint-disable-next-line no-param-reassign
      storiesMap[key] = composeStory(story as Story, meta, globalConfig);
      return storiesMap;
    },
    {} as { [key: string]: Story }
  );

  return (composedStories as unknown) as Pick<T, Exclude<keyof T, 'default'>>;
}
