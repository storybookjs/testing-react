import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent} from '@storybook/testing-library';

import { AccountForm, AccountFormProps } from './AccountForm';

const meta = {
  title: 'CSF3/AccountForm',
  component: AccountForm,
  parameters: {
    layout: 'centered',
  },
  render: (args: AccountFormProps) => (<div>
    <p>This uses a custom render from meta</p>
    <AccountForm {...args} />
  </div>)
} as Meta<typeof AccountForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: { passwordVerification: false },
};

export const StandardEmailFilled: Story = {
  ...Standard,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'michael@chromatic.com');
  }
};

export const StandardEmailFailed: Story = {
  ...Standard,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'michael@chromatic.com.com@com');
    await userEvent.type(canvas.getByTestId('password1'), 'testpasswordthatwontfail');
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

export const StandardPasswordFailed: Story = {
  ...Standard,
  play: async (context) => {
    const {canvasElement} = context;
    const canvas = within(canvasElement);
    await StandardEmailFilled.play!(context);
    await userEvent.type(canvas.getByTestId('password1'), 'asdf');
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

export const StandardFailHover: Story = {
  ...StandardPasswordFailed,
  play: async (context) => {
    const {canvasElement} = context;
    const canvas = within(canvasElement);
    await StandardPasswordFailed.play!(context);
    await sleep(100);
    await userEvent.hover(canvas.getByTestId('password-error-info'));
  },
};

export const Verification: Story = {
  args: { passwordVerification: true },
};

export const VerificationPasssword1: Story = {
  ...Verification,
  play: async (context) => {
    const {canvasElement} = context;
    const canvas = within(canvasElement);
    await StandardEmailFilled.play!(context);
    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

export const VerificationPasswordMismatch: Story = {
  ...Verification,
  play: async (context) => {
    const {canvasElement} = context;
    const canvas = within(canvasElement);
    await StandardEmailFilled.play!(context);
    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');
    await userEvent.type(canvas.getByTestId('password2'), 'asdf1234');
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const VerificationSuccess: Story = {
  ...Verification,
  play: async (context) => {
    const {canvasElement} = context;
    const canvas = within(canvasElement);
    await StandardEmailFilled.play!(context);
    await sleep(1000);
    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.type(canvas.getByTestId('password2'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

export const StandardWithRenderFunction: Story = {
  ...Standard,
  render: (args: AccountFormProps) => (<div>
    <p>This uses a custom render from story</p>
    <AccountForm {...args} />
  </div>),
};