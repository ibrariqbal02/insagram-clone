import { render, screen } from '@testing-library/react';

describe('Sanity Test', () => {
  it('should verify Jest setup works', () => {
    render(<h1>Hello World</h1>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});