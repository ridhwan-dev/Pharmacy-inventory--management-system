

import { useState, useEffect } from 'react';

import {
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
} from '../services/medicineService';

function Medicines() {
  // Controls whether the medicine form is visible
  const [showForm, setShowForm] = useState(false);

  // Stores the details of the medicine being entered
  const [medicine, setMedicine] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    expiryDate: '',
  });

// Stores all medicine records
const [medicines, setMedicines] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');


useEffect(() => {
  async function loadMedicines() {
    try {
      const savedMedicines = await getMedicines();
      setMedicines(savedMedicines);
    } catch (error) {
      console.error('Error loading medicines:', error);
      setError('Unable to load medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  loadMedicines();
}, []);

  // Stores the ID of the medicine being edited
  const [editingId, setEditingId] = useState(null);

  // Stores the text entered into the medicine search box
  const [searchTerm, setSearchTerm] = useState('');

  // Adds a new medicine or updates an existing one
  
async function handleAddMedicine(e) {
  e.preventDefault();

  try {
    if (editingId) {
      await updateMedicine(editingId, medicine);

      const updatedMedicines = medicines.map((item) =>
        item.id === editingId
          ? { ...medicine, id: editingId }
          : item
      );

      setMedicines(updatedMedicines);
    } else {
      const newMedicine = {
        ...medicine,
      };

      const newId = await addMedicine(newMedicine);

      setMedicines([
        ...medicines,
        { ...newMedicine, id: newId },
      ]);
    }

    setMedicine({
      name: '',
      category: '',
      quantity: '',
      price: '',
      expiryDate: '',
    });

    setEditingId(null);
    setShowForm(false);
    setError('');
  } catch (error) {
    console.error('Error saving medicine:', error);
    setError('Unable to save medicine. Please try again.');
  }
}


  // Deletes a medicine using its unique ID

  

async function handleDeleteMedicine(id) {
  try {
    await deleteMedicine(id);

    const updatedMedicines = medicines.filter(
      (item) => item.id !== id
    );

    setMedicines(updatedMedicines);
    setError('');
  } catch (error) {
    console.error('Error deleting medicine:', error);
    setError('Unable to delete medicine. Please try again.');
  }
}

  // Loads an existing medicine into the form for editing
  function handleEditMedicine(item) {
    setMedicine({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      expiryDate: item.expiryDate,
    });

    setEditingId(item.id);
    setShowForm(true);
  }

 // Filters medicines based on the search text
  const filteredMedicines = medicines.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

// Identifies medicines with low or empty stock
const lowStockMedicines = medicines.filter(
  (item) => Number(item.quantity) <= 10
);
  // Gets today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Identifies expired medicines
  const expiredMedicines = medicines.filter(
    (item) => new Date(`${item.expiryDate}T00:00:00`) < today
  );

  // Identifies medicines expiring within the next 30 days
  const expiringSoonMedicines = medicines.filter((item) => {
    const expiryDate = new Date(`${item.expiryDate}T00:00:00`);

    const daysRemaining =
      (expiryDate - today) / (1000 * 60 * 60 * 24);

    return daysRemaining >= 0 && daysRemaining <= 30;
  });

  return (
    <section className="medicines-page">
      <h2>Medicine Inventory</h2>


{loading && <p>Loading medicines...</p>}

{error && <p className="error-message">{error}</p>}

      <p>
        Manage your pharmacy medicines, stock quantities and expiry dates.
      </p>

<input
  type="text"
  placeholder="Search medicines by name..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>


      <button
        className="add-medicine-button"
        onClick={() => {
          setMedicine({
            name: '',
            category: '',
            quantity: '',
            price: '',
            expiryDate: '',
          });
          setEditingId(null);
          setShowForm(true);
        }}
      >
        + Add Medicine
      </button>

      {showForm && (
        <form
          className="medicine-form"
          onSubmit={handleAddMedicine}
        >
          <h3>
            {editingId ? 'Edit Medicine' : 'Add New Medicine'}
          </h3>

          <label>Medicine Name</label>
          <input
            type="text"
            placeholder="Enter medicine name"
            value={medicine.name}
            onChange={(e) =>
              setMedicine({ ...medicine, name: e.target.value })
            }
            required
          />

          <label>Category</label>
          <input
            type="text"
            placeholder="Enter category"
            value={medicine.category}
            onChange={(e) =>
              setMedicine({ ...medicine, category: e.target.value })
            }
            required
          />

          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={medicine.quantity}
            onChange={(e) =>
              setMedicine({ ...medicine, quantity: e.target.value })
            }
            required
          />

          <label>Unit Price (KES)</label>
          <input
            type="number"
            placeholder="Enter unit price"
            value={medicine.price}
            onChange={(e) =>
              setMedicine({ ...medicine, price: e.target.value })
            }
            required
          />

          <label>Expiry Date</label>
          <input
            type="date"
            value={medicine.expiryDate}
            onChange={(e) =>
              setMedicine({ ...medicine, expiryDate: e.target.value })
            }
            required
          />

          <button type="submit">
            {editingId ? 'Update Medicine' : 'Save Medicine'}
          </button>
        </form>
      )}





<div className="low-stock-section">
  <h3>Low Stock Alerts</h3>

  {lowStockMedicines.length === 0 ? (
    <p>All medicines have sufficient stock.</p>
  ) : (
    lowStockMedicines.map((item) => (
      <p key={item.id}>
        {item.name} - Only {item.quantity} units remaining!
      </p>
    ))
  )}
</div>


<div className="expiry-alert-section">
  <h3>Expiry Date Alerts</h3>

  {expiredMedicines.length > 0 && (
    <div>
      <h4>Expired Medicines</h4>

      {expiredMedicines.map((item) => (
        <p key={item.id}>
          {item.name} - Expired on {item.expiryDate}
        </p>
      ))}
    </div>
  )}

  {expiringSoonMedicines.length > 0 && (
    <div>
      <h4>Expiring Within 30 Days</h4>

      {expiringSoonMedicines.map((item) => (
        <p key={item.id}>
          {item.name} - Expires on {item.expiryDate}
        </p>
      ))}
    </div>
  )}

  {expiredMedicines.length === 0 &&
    expiringSoonMedicines.length === 0 && (
      <p>No expiry alerts. All medicines are within their expiry dates.</p>
    )}
</div>

      <div className="medicines-list">
        <h3>Medicine Records</h3>
{medicines.length === 0 ? (
  <p>No medicines added yet.</p>
) : filteredMedicines.length === 0 ? (
  <p>No matching medicines found.</p>
) : null}

        {filteredMedicines.map((item) => (
          <div className="medicine-card" key={item.id}>
            <h4>{item.name}</h4>

            <p>Category: {item.category}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Unit Price: KES {item.price}</p>
            <p>Expiry Date: {item.expiryDate}</p>

            <button onClick={() => handleEditMedicine(item)}>
              Edit
            </button>

            <button onClick={() => handleDeleteMedicine(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Medicines;
