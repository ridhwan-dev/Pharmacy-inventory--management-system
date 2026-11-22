
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { getMedicines } from '../services/medicineService';

vi.mock('../services/medicineService', () => ({
  getMedicines: vi.fn(),
}));

describe('Dashboard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the loading message while retrieving medicines', async () => {
    let resolveMedicines;

    getMedicines.mockImplementation(
      () => new Promise((resolve) => {
        resolveMedicines = resolve;
      })
    );

    render(<Dashboard />);

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();

    resolveMedicines([]);

    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    });
  });

  it('displays the correct medicine statistics', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    getMedicines.mockResolvedValue([
      {
        id: '1',
        name: 'Paracetamol',
        quantity: 5,
        expiryDate: formatDate(tomorrow),
      },
      {
        id: '2',
        name: 'Amoxicillin',
        quantity: 10,
        expiryDate: formatDate(yesterday),
      },
      {
        id: '3',
        name: 'Ibuprofen',
        quantity: 30,
        expiryDate: formatDate(tomorrow),
      },
    ]);

    render(<Dashboard />);

    expect(await screen.findByText('Overview')).toBeInTheDocument();

    expect(screen.getByText('Total Medicines')).toBeInTheDocument();
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
    expect(screen.getByText('Expired Medicines')).toBeInTheDocument();

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays an error message when medicines cannot be retrieved', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    getMedicines.mockRejectedValue(new Error('Firestore error'));

    render(<Dashboard />);

    expect(
      await screen.findByText(
        'Unable to load dashboard data. Please try again.'
      )
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
