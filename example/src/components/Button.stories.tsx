import React from 'react';
import { Story, Meta, StoryContext } from '@storybook/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button, ButtonProps } from './Button';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    label: { defaultValue: 'Button' },
  },
} as Meta;

const Template: Story<ButtonProps> = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'foo',
  size: 'large',
  primary: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Children coming from story args!',
  primary: false,
};

const getCaptionForLocale = (locale: string) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'pt':
      return 'Olá!';
    default:
      return 'Hello!';
  }
};

export const StoryWithLocale: Story = (args, { globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <Button>{caption}</Button>;
};

export const StoryWithParamsAndDecorator: Story<ButtonProps> = args => {
  return <Button {...args} />;
};
StoryWithParamsAndDecorator.args = {
  children: 'foo',
};
StoryWithParamsAndDecorator.parameters = {
  layout: 'centered',
};
StoryWithParamsAndDecorator.decorators = [StoryFn => <StoryFn />];

export const CSF3Button: Story<ButtonProps> = {
  args: { children: 'foo' },
};

export const CSF3ButtonWithRender: Story<ButtonProps> = {
  ...CSF3Button,
  render: (args: ButtonProps) => (
    <div>
      <p data-testid="custom-render">I am a custom render function</p>
      <Button {...args} />
    </div>
  ),
};

export const InputFieldFilled: Story = {
  render: () => {
    return <input />;
  },
  play: async (context: StoryContext) => {
    console.log(context);
    await userEvent.type(screen.getByRole('textbox'), 'Hello world!');
  },
};
