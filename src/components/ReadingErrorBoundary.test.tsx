import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReadingErrorBoundary from './ReadingErrorBoundary';

test('a failed reading surface keeps its exit available and can recover', () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  let fail = true;
  const Surface = () => { if (fail) throw new Error('Playback rendering failure'); return <p>Reading recovered</p>; };
  render(<><button>Close article</button><ReadingErrorBoundary><Surface /></ReadingErrorBoundary></>);
  expect(screen.getByRole('alert')).toHaveTextContent('This page was interrupted.');
  expect(screen.getByRole('button', { name: 'Close article' })).toBeEnabled();
  fail = false;
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(screen.getByText('Reading recovered')).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  log.mockRestore();
});
