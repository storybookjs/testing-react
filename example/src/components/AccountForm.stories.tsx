import React from 'react';
import type { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { AccountForm, AccountFormProps } from './AccountForm';

export default {
  title: 'CSF3/AccountForm',
  component: AccountForm,
  parameters: {
    layout: 'centered',
  },
  render: (args: AccountFormProps) => (<div>
    <p>This uses a custom render from meta</p>
    <AccountForm {...args} />
  </div>)
} as ComponentMeta<typeof AccountForm>;

type Story = ComponentStoryObj<typeof AccountForm>

export const Standard: Story = {
  args: { passwordVerification: false },
};

export const StandardEmailFilled: Story = {
  ...Standard,
  play: () => userEvent.type(screen.getByTestId('email'), 'michael@chromatic.com'),
};

export const StandardEmailFailed: Story = {
  ...Standard,
  play: async () => {
    await userEvent.type(screen.getByTestId('email'), 'michael@chromatic.com.com@com');
    await userEvent.type(screen.getByTestId('password1'), 'testpasswordthatwontfail');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

export const StandardPasswordFailed: Story = {
  ...Standard,
  play: async (context) => {
    await StandardEmailFilled.play!(context);
    await userEvent.type(screen.getByTestId('password1'), 'asdf');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

export const StandardFailHover: Story = {
  ...StandardPasswordFailed,
  play: async (context) => {
    await StandardPasswordFailed.play!(context);
    await sleep(100);
    await userEvent.hover(screen.getByTestId('password-error-info'));
  },
};

export const Verification: Story = {
  args: { passwordVerification: true },
};

export const VerificationPasssword1: Story = {
  ...Verification,
  play: async (context) => {
    await StandardEmailFilled.play!(context);
    await userEvent.type(screen.getByTestId('password1'), 'asdfasdf');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

export const VerificationPasswordMismatch: Story = {
  ...Verification,
  play: async (context) => {
    await StandardEmailFilled.play!(context);
    await userEvent.type(screen.getByTestId('password1'), 'asdfasdf');
    await userEvent.type(screen.getByTestId('password2'), 'asdf1234');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const VerificationSuccess: Story = {
  ...Verification,
  play: async (context) => {
    await StandardEmailFilled.play!(context);
    await sleep(1000);
    await userEvent.type(screen.getByTestId('password1'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.type(screen.getByTestId('password2'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.click(screen.getByTestId('submit'));
  },
};

export const StandardWithRenderFunction: Story = {
  ...Standard,
  render: (args: AccountFormProps) => (<div>
    <p>This uses a custom render from story</p>
    <AccountForm {...args} />
  </div>),
};