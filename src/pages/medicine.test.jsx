
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Medicines from './Medicines';

import {
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
} from '../services/medicineService';

vi.mock('../services/medicineService', () => ({
  addMedicine: vi.fn(),
  getMedicines: vi.fn(),
  updateMedicine: vi.fn(),
  deleteMedicine: vi.fn(),
}));

function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

describe('Medicines component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMedicines.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays a loading message while retrieving medicines', () => {
    getMedicines.mockImplementation(
      () => new Promise(() => {})
    );

    render(<Medicines />);

    expect(screen.getByText('Loading medicines...')).toBeInTheDocument();
  });

  it('displays an empty message when there are no medicines', async () => {
    render(<Medicines />);

    expect(
      await screen.findByText('No medicines added yet.')
    ).toBeInTheDocument();
  });

  it('displays medicine records and stock and expiry alerts', async () => {
    getMedicines.mockResolvedValue([
      {
        id: '1',
        name: 'Paracetamol',
        category: 'Painkiller',
        quantity: 5,
        price: 20,
        expiryDate: getDateOffset(-5),
      },
      {
        id: '2',
        name: 'Amoxicillin',
        category: 'Antibiotic',
        quantity: 30,
        price: 50,
        expiryDate: getDateOffset(10),
      },
      {
        id: '3',
        name: 'Ibuprofen',
        category: 'Painkiller',
        quantity: 50,
        price: 30,
        expiryDate: getDateOffset(60),
      },
    ]);

    render(<Medicines />);

    expect(await screen.findByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    expect(screen.getByText('Ibuprofen')).toBeInTheDocument();

    expect(
      screen.getByText(/Only 5 units remaining/)
    ).toBeInTheDocument();

    expect(screen.getByText('Expired Medicines')).toBeInTheDocument();
    expect(
      screen.getByText('Expiring Within 30 Days')
    ).toBeInTheDocument();
  });

  it('searches for medicines by name', async () => {
    getMedicines.mockResolvedValue([
      {
        id: '1',
        name: 'Paracetamol',
        category: 'Painkiller',
        quantity: 20,
        price: 20,
        expiryDate: getDateOffset(60),
      },
      {
        id: '2',
        name: 'Amoxicillin',
        category: 'Antibiotic',
        quantity: 30,
        price: 50,
        expiryDate: getDateOffset(60),
      },
    ]);

    render(<Medicines />);

    await screen.findByText('Paracetamol');

    fireEvent.change(
      screen.getByPlaceholderText('Search medicines by name...'),
      { target: { value: 'amox' } }
    );

    expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    expect(screen.queryByText('Paracetamol')).not.toBeInTheDocument();
  });

  it('displays a message when no medicines match the search', async () => {
    getMedicines.mockResolvedValue([
      {
        id: '1',
        name: 'Paracetamol',
        category: 'Painkiller',
        quantity: 20,
        price: 20,
        expiryDate: getDateOffset(60),
      },
    ]);

    render(<Medicines />);

    await screen.findByText('Paracetamol');

    fireEvent.change(
      screen.getByPlaceholderText('Search medicines by name...'),
      { target: { value: 'Aspirin' } }
    );

    expect(
      screen.getByText('No matching medicines found.')
    ).toBeInTheDocument();
  });

  it('adds a new medicine', async () => {
    addMedicine.mockResolvedValue('new-medicine-id');

    render(<Medicines />);

    await screen.findByText('No medicines added yet.');

    fireEvent.click(screen.getByRole('button', { name: '+ Add Medicine' }));

    fireEvent.change(screen.getByPlaceholderText('Enter medicine name'), {
      target: { value: 'Paracetamol' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter category'), {
      target: { value: 'Painkiller' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter quantity'), {
      target: { value: '25' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter unit price'), {
      target: { value: '20' },
    });

    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: getDateOffset(60) },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save Medicine' }));

    await waitFor(() => {
      expect(addMedicine).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Paracetamol',
          category: 'Painkiller',
          quantity: '25',
          price: '20',
        })
      );
    });

    expect(await screen.findByText('Paracetamol')).toBeInTheDocument();
  });

  it('updates an existing medicine', async () => {
    getMedicines.mockResolvedValue([
      {
        id: 'medicine-1',
        name: 'Paracetamol',
        category: 'Painkiller',
        quantity: '5',
        price: '20',
        expiryDate: getDateOffset(60),
      },
    ]);

    render(<Medicines />);

    await screen.findByText('Paracetamol');

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    fireEvent.change(screen.getByPlaceholderText('Enter quantity'), {
      target: { value: '50' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Medicine' }));

    await waitFor(() => {
      expect(updateMedicine).toHaveBeenCalledWith(
        'medicine-1',
        expect.objectContaining({ quantity: '50' })
      );
    });

    expect(await screen.findByText('Quantity: 50')).toBeInTheDocument();
  });

  it('keeps other medicines unchanged when updating one medicine', async () => {
    getMedicines.mockResolvedValue([
      {
        id: 'medicine-1',
        name: 'Paracetamol',
        category: 'Painkiller',
        quantity: '5',
        price: '20',
        expiryDate: getDateOffset(60),
      },
      {
        id: 'medicine-2',
        name: 'Amoxicillin',
        category: 'Antibiotic',
        quantity: '30',
        price: '50',
        expiryDate: getDateOffset(60),
      },
    ]);

    render(<Medicines />);

    await screen.findByText('Paracetamol');

    const editButtons = screen.getAllByRole('button', {
      name: 'Edit',
    });

    fireEvent.click(editButtons[0]);

    fireEvent.change(screen.getByPlaceholderText('Enter quantity'), {
      target: { value: '50' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Medicine' }));

    await waitFor(() => {
      expect(updateMedicine).toHaveBeenCalledWith(
        'medicine-1',
        expect.objectContaining({ quantity: '50' })
      );
    });

    expect(screen.getByText('Quantity: 50')).toBeInTheDocument();
    expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 30')).toBeInTheDocument();
  });

  it('deletes an existing medicine', async () => {
    getMedicines.mockResolvedValue([
      {
        id: 'medicine-1',
        name: 'Paracetamol',
        category: 'Painkiller',
        quantity: '20',
        price: '20',
        expiryDate: getDateOffset(60),
      },
    ]);

    render(<Medicines />);

    await screen.findByText('Paracetamol');

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteMedicine).toHaveBeenCalledWith('medicine-1');
    });

    expect(
      await screen.findByText('No medicines added yet.')
    ).toBeInTheDocument();
  });

  it('displays an error when loading medicines fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    getMedicines.mockRejectedValue(new Error('Firestore error'));

    render(<Medicines />);

    expect(
      await screen.findByText(
        'Unable to load medicines. Please try again.'
      )
    ).toBeInTheDocument();
  });

  it('displays an error when saving a medicine fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    addMedicine.mockRejectedValue(new Error('Save failed'));

    render(<Medicines />);

    await screen.findByText('No medicines added yet.');

    fireEvent.click(screen.getByRole('button', { name: '+ Add Medicine' }));

    fireEvent.change(screen.getByPlaceholderText('Enter medicine name'), {
      target: { value: 'Paracetamol' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter category'), {
      target: { value: 'Painkiller' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter quantity'), {
      target: { value: '20' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter unit price'), {
      target: { value: '20' },
    });

    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: getDateOffset(60) },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save Medicine' }));

    expect(
      await screen.findByText(
        'Unable to save medicine. Please try again.'
      )
    ).toBeInTheDocument();
  });

  it('displays an error when deleting a medicine fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    getMedicines.mockResolvedValue([
      {
        id: 'medicine-1',
        name: 'Paracetamol',
        category: 'Painkiller',
        quantity: '20',
        price: '20',
        expiryDate: getDateOffset(60),
      },
    ]);

    deleteMedicine.mockRejectedValue(new Error('Delete failed'));

    render(<Medicines />);

    await screen.findByText('Paracetamol');

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByText(
        'Unable to delete medicine. Please try again.'
      )
    ).toBeInTheDocument();
  });
});
