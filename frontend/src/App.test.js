import { render, screen } from '@testing-library/react';
import App from './App';

test('renders top navigation brand', () => {
  render(<App />);
  const brand = screen.getByText(/Simple Notes/i);
  expect(brand).toBeInTheDocument();
});
