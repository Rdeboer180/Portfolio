import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { UnlockProvider, useUnlock } from '../context/UnlockContext';
import ProjectLink from './ProjectLink';
import { usePanelNavigation } from '../hooks/usePanelNavigation';

function Fixture() {
  usePanelNavigation();
  const { promptOpen, continueLocked, dismissPrompt } = useUnlock();
  const location = useLocation();
  return <>
    <ProjectLink to="/work/wheelrack">WheelRack</ProjectLink>
    <ProjectLink to="/work/aem-component-system">AEM</ProjectLink>
    <ProjectLink to="/work/playdraft">PlayDraft</ProjectLink>
    <span data-testid="location">{location.pathname}</span>
    {promptOpen && <div role="dialog"><button onClick={continueLocked}>Don't ask again</button><button onClick={dismissPrompt}>Close</button></div>}
  </>;
}

const mount = () => render(<MemoryRouter><UnlockProvider><Fixture /></UnlockProvider></MemoryRouter>);
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

test('prompts on protected work and remembers opting out across visits', () => {
  const view = mount();
  fireEvent.click(screen.getByText('WheelRack'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByTestId('location')).toHaveTextContent('/');
  fireEvent.click(screen.getByText("Don't ask again"));
  expect(screen.getByTestId('location')).toHaveTextContent('/work/wheelrack/');
  fireEvent.click(screen.getByText('AEM'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByTestId('location')).toHaveTextContent('/work/aem-component-system/');
  view.unmount();
  mount();
  fireEvent.click(screen.getByText('WheelRack'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('closing does not opt out; public work never prompts', () => {
  mount();
  fireEvent.click(screen.getByText('PlayDraft'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('WheelRack'));
  fireEvent.click(screen.getByText('Close'));
  fireEvent.click(screen.getByText('AEM'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('already unlocked visitors go straight to protected work', () => {
  localStorage.setItem('rd-unlocked', 'true');
  mount();
  fireEvent.click(screen.getByText('WheelRack'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByTestId('location')).toHaveTextContent('/work/wheelrack/');
});
