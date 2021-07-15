import { ArgTypes, Parameters, BaseDecorators, BaseAnnotations, BaseStoryFn as OriginalBaseStoryFn } from '@storybook/addons';
import type { Story } from '@storybook/react';
import { ReactElement } from 'react';

type StoryFnReactReturnType = ReactElement<unknown>;

export type BaseStoryFn<Args> = OriginalBaseStoryFn<Args, StoryFnReactReturnType> & BaseAnnotations<Args, StoryFnReactReturnType>;
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

/**
 * T represents the whole es module of a stories file. K of T means named exports (basically the Story type)
 * 1. pick the keys K of T that have properties that are Story<AnyProps>
 * 2. infer the actual prop type for each Story
 * 3. reconstruct Story with Partial. Story<Props> -> Story<Partial<Props>>
 */
export type StoriesWithPartialProps<T> = { 
  [K in keyof T as T[K] extends Story<any> ? K : never]: T[K] extends Story<infer P> ? BaseStoryFn<Partial<P>> : unknown 
}