
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import { db } from './firebase';

// Reference to the medicines collection
const medicinesCollection = collection(db, 'medicines');

// CREATE: Add a new medicine
export async function addMedicine(medicine) {
  const document = await addDoc(medicinesCollection, medicine);
  return document.id;
}

// READ: Retrieve all medicines
export async function getMedicines() {
  const snapshot = await getDocs(medicinesCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

// UPDATE: Update an existing medicine
export async function updateMedicine(id, updatedMedicine) {
  const medicineDocument = doc(db, 'medicines', id);

  await updateDoc(medicineDocument, updatedMedicine);
}

// DELETE: Remove a medicine
export async function deleteMedicine(id) {
  const medicineDocument = doc(db, 'medicines', id);

  await deleteDoc(medicineDocument);
}
