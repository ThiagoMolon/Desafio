import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the cadastro form', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /cadastro/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
});
