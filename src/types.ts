import { ArgTypes, Parameters, BaseDecorators } from '@storybook/addons';
import { StoryFnReactReturnType } from '@storybook/react/dist/client/preview/types';

/**
 * Object representing the preview.ts module
 *
 * Used in storybook testing utilities.
 * @see [Unit testing with Storybook](https://storybook.js.org/docs/react/workflows/unit-testing)
 */
export type GlobalConfig = {
  decorators?: BaseDecorators<StoryFnReactReturnType>;
  parameters?: Parameters;
  argTypes?: ArgTypes;
  [key: string]: any;
};
