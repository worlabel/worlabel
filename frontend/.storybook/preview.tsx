// .storybook/preview.ts
import React from 'react';
import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../src/index.css';

// QueryClient 생성
const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={['/']}>
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    </MemoryRouter>
  ),
];

export default preview;
