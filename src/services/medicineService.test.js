
import { describe, it, expect, vi, beforeEach } from 'vitest';

const firestoreMocks = vi.hoisted(() => {
  const collectionRef = { name: 'medicines' };

  return {
    collection: vi.fn(() => collectionRef),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    collectionRef,
    medicineDocRef: { id: 'medicine-123' },
  };
});

vi.mock('firebase/firestore', () => ({
  collection: firestoreMocks.collection,
  addDoc: firestoreMocks.addDoc,
  getDocs: firestoreMocks.getDocs,
  updateDoc: firestoreMocks.updateDoc,
  deleteDoc: firestoreMocks.deleteDoc,
  doc: firestoreMocks.doc,
}));

vi.mock('./firebase', () => ({
  db: {},
}));

import {
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
} from './medicineService';

describe('Medicine Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    firestoreMocks.collection.mockReturnValue(
      firestoreMocks.collectionRef
    );

    firestoreMocks.doc.mockReturnValue(
      firestoreMocks.medicineDocRef
    );
  });

  it('adds a new medicine', async () => {
    const medicine = {
      name: 'Paracetamol',
      quantity: 20,
    };

    firestoreMocks.addDoc.mockResolvedValue({
      id: 'medicine-123',
    });

    const result = await addMedicine(medicine);

    expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
      firestoreMocks.collectionRef,
      medicine
    );

    expect(result).toBe('medicine-123');
  });

  it('retrieves all medicines', async () => {
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          id: 'medicine-123',
          data: () => ({
            name: 'Paracetamol',
            quantity: 20,
          }),
        },
      ],
    });

    const result = await getMedicines();

    expect(result).toEqual([
      {
        id: 'medicine-123',
        name: 'Paracetamol',
        quantity: 20,
      },
    ]);
  });

  it('updates an existing medicine', async () => {
    const updatedMedicine = {
      name: 'Paracetamol',
      quantity: 50,
    };

    firestoreMocks.updateDoc.mockResolvedValue(undefined);

    await updateMedicine('medicine-123', updatedMedicine);

    expect(firestoreMocks.doc).toHaveBeenCalledWith(
      {},
      'medicines',
      'medicine-123'
    );

    expect(firestoreMocks.updateDoc).toHaveBeenCalledWith(
      firestoreMocks.medicineDocRef,
      updatedMedicine
    );
  });

  it('deletes an existing medicine', async () => {
    firestoreMocks.deleteDoc.mockResolvedValue(undefined);

    await deleteMedicine('medicine-123');

    expect(firestoreMocks.doc).toHaveBeenCalledWith(
      {},
      'medicines',
      'medicine-123'
    );

    expect(firestoreMocks.deleteDoc).toHaveBeenCalledWith(
      firestoreMocks.medicineDocRef
    );
  });
});
