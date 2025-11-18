import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

describe('Login page smoke', () => {
  it('renders login form', () => {
    render(<Login />);
    const email = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i) || screen.queryByRole('textbox');
    const password = screen.queryByLabelText(/senha|password/i) || screen.queryByPlaceholderText(/senha|password/i) || screen.queryByTestId('password-input');
    const button = screen.queryByRole('button');
    expect(button).toBeTruthy();
  });
});
