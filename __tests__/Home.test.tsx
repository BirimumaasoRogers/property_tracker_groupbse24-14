import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../src/app/page';
import React from 'react';

describe('Home', () => {
  it('renders the Next.js logo', () => {
    render(<Home />);
    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders the instructions', () => {
    render(<Home />);
    const instructions = screen.getByText(/Get started by editing/i);
    expect(instructions).toBeInTheDocument();
  });
});