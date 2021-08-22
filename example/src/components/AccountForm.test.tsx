import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountForm } from './AccountForm';
import { ThemeProvider, convert, themes } from '@storybook/theming';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}

import { composeStories } from '../../../dist/index';

import * as stories from './AccountForm.stories';

const { StandardEmailFilled, StandardEmailFailed } = composeStories(stories);

test('fills email correctly', async () => {
  render(<StandardEmailFilled />);
  // await act(async () => {
  await StandardEmailFilled.play!()
  // })

  expect((screen.getByTestId('email') as HTMLInputElement).value).toBe('michael@chromatic.com');
});

// Failing test
test('validates wrong email format', async () => {
  render(<StandardEmailFailed />);
  await act(async () => {
    await StandardEmailFailed.play!()
  })

  const emailValidation = screen.getByText(/Please enter a correctly formatted email address/i);
  expect(emailValidation).not.toBeNull();
});

// Failing test just using the component normally, without composeStories
test('validates wrong email format (without using testing-react)', async () => {
  render(
    <ThemeProvider theme={convert(themes.light)}>
      <AccountForm />
    </ThemeProvider>
  );

  await act(async () => {
    await userEvent.type(screen.getByTestId('email'), 'michael@chromatic.com.com@com');
    await userEvent.type(screen.getByTestId('password1'), 'testpasswordthatwontfail');
    await userEvent.click(screen.getByTestId('submit'));
  })

  const emailValidation = screen.getByText(/Please enter a correctly formatted email address/i);
  expect(emailValidation).not.toBeNull();
});