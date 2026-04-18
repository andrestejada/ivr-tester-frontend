import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import InvalidLinkPage from '@/pages/auth/InvalidLinkPage';

describe('InvalidLinkPage', () => {
  it('muestra mensaje informativo cuando el enlace es invalido', () => {
    render(<InvalidLinkPage />);

    expect(screen.getByText(/enlace inv.lido/i)).toBeInTheDocument();
    expect(screen.getByText(/el enlace ha expirado o ya fue utilizado/i)).toBeInTheDocument();
    expect(screen.getByText(/contacta al administrador/i)).toBeInTheDocument();
  });

  it('expone un enlace mailto al administrador', () => {
    render(<InvalidLinkPage />);

    const contactLink = screen.getByRole('link', { name: /contactar al administrador/i });
    expect(contactLink).toHaveAttribute('href', 'mailto:admin@ejemplo.com');
  });
});
