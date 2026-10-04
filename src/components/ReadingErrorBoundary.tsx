import React from 'react';

/** A reading failure must never remove the drawer's exit or the portfolio behind it. */
export default class ReadingErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error('Reading panel failed:', error); }
  render() {
    if (this.state.failed) return <section className="project-panel__loading" role="alert">
      <h2>This page was interrupted.</h2>
      <p>You can try loading it again or close the drawer to keep exploring.</p>
      <button className="project-panel__close" onClick={() => this.setState({ failed: false })}>Try again</button>
    </section>;
    return this.props.children;
  }
}
