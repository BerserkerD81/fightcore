import { within, userEvent, expect } from '@storybook/test';

import { Page } from './Page';

export default {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const LoggedOut = {};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const nomaral = {
  play: async ({ canvasElement }) => {
  }
};
