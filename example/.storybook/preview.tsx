import React from 'react';
import { Story } from '@storybook/react';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}

export const decorators = [
  (StoryFn: Story, { globals: { locale } }) => (
    <>
      <div>Locale: {locale}</div>
      <StoryFn />
    </>
  ),
];

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'pt', right: '🇧🇷', title: 'Português' },
        { value: 'kr', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};
