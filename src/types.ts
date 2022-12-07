import type {
  AnnotatedStoryFn,
  Args,
  PlayFunction, PlayFunctionContext,
  ProjectAnnotations,
  StoryAnnotations,
} from '@storybook/types';
import type { ReactRenderer } from '@storybook/react';

/**
 * Object representing the preview.ts module
 *
 * Used in storybook testing utilities.
 * @see [Unit testing with Storybook](https://storybook.js.org/docs/react/workflows/unit-testing)
 */
export type GlobalConfig = ProjectAnnotations<ReactRenderer>;

export type TestingStory<T = Args> = StoryAnnotations<ReactRenderer, T>;

export type TestingStoryPlayContext<T = Args> = Partial<PlayFunctionContext<ReactRenderer, T>> & Pick<PlayFunctionContext, 'canvasElement'>

export type StoryFn<TArgs = Args> = AnnotatedStoryFn<ReactRenderer, TArgs> & { play: PlayFunction<ReactRenderer, TArgs> }

/**
 * T represents the whole es module of a stories file. K of T means named exports (basically the Story type)
 * 1. pick the keys K of T that have properties that are Story<AnyProps>
 * 2. infer the actual prop type for each Story
 * 3. reconstruct Story with Partial. Story<Props> -> Story<Partial<Props>>
 */
export type StoriesWithPartialProps<T> = {
  [K in keyof T]: T[K] extends StoryAnnotations<ReactRenderer, infer P> ? StoryFn<Partial<P>> : number
}