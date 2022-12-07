import type {
  AnnotatedStoryFn,
  Args,
  PlayFunction, PlayFunctionContext,
  Store_CSFExports,
  StoryAnnotations,
} from '@storybook/types';
import type { ReactRenderer } from '@storybook/react';

export type TestingStory<TArgs = Args> = StoryAnnotations<ReactRenderer, TArgs>;

export type StoryFile = Store_CSFExports<ReactRenderer, any>;

export type TestingStoryPlayContext<TArgs = Args> = Partial<PlayFunctionContext<ReactRenderer, TArgs>> & Pick<PlayFunctionContext, 'canvasElement'>

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