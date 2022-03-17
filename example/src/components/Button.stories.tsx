import React from 'react';
import { StoryFn as CSF2Story, StoryObj as CSF3Story, Meta, ComponentStoryObj } from '@storybook/react';
import { useArgs } from '@storybook/addons';
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

const Template: CSF2Story<ButtonProps> = args => <Button {...args} />;

export const Primary: CSF3Story<ButtonProps> = {
  args: {
    children: 'foo',
    size: 'large',
    primary: true,
  },
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

export const StoryWithLocale: CSF2Story = (args, { globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <Button>{caption}</Button>;
};
StoryWithLocale.storyName = 'WithLocale'

export const StoryWithParamsAndDecorator: CSF2Story<ButtonProps> = args => {
  return <Button {...args} />;
};
StoryWithParamsAndDecorator.args = {
  children: 'foo',
};
StoryWithParamsAndDecorator.parameters = {
  layout: 'centered',
};
StoryWithParamsAndDecorator.decorators = [StoryFn => <StoryFn />];

export const CSF3Button: CSF3Story<ButtonProps> = {
  args: { children: 'foo' },
};

export const CSF3ButtonWithRender: CSF3Story<ButtonProps> = {
  ...CSF3Button,
  render: (args: ButtonProps) => (
    <div>
      <p data-testid="custom-render">I am a custom render function</p>
      <Button {...args} />
    </div>
  ),
};

export const InputFieldFilled: CSF3Story = {
  render: () => {
    return <input />;
  },
  play: async (context) => {
    await userEvent.type(screen.getByRole('textbox'), 'Hello world!');
  },
};


type Story = ComponentStoryObj<typeof Button>;

export const StoryWithDecoratorUseHook: Story = {
  args: {
    children: 'foo',
    size: 'large',
    primary: true,
  },
  decorators: [
    (Story) => {
      const [args] = useArgs();
      return (<div><div>args.size:{args.size}</div><Story></Story></div>)
    }
  ]
};
