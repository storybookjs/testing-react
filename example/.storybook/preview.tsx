import React from 'react';
import { Story } from '@storybook/react';

export const decorators = [
  (
    StoryFn: Story,
    {
      globals: {
        locale: { value = 'en' },
      },
    }
  ) => (
    <>
      <div>{value}</div>
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
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'kr', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};
