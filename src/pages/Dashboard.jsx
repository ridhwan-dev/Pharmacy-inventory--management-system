
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { getMedicines } from '../services/medicineService';

function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Retrieve medicine records from Firestore
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const savedMedicines = await getMedicines();
        setMedicines(savedMedicines);
        setError('');
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Count medicines with 10 or fewer units
  const lowStockCount = medicines.filter(
    (item) => Number(item.quantity) <= 10
  ).length;

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count expired medicines
  const expiredCount = medicines.filter(
    (item) => new Date(`${item.expiryDate}T00:00:00`) < today
  ).length;

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <section className="dashboard-content">
      <h2>Overview</h2>

      {error && (
        <p className="error-message">{error}</p>
      )}

      <div className="stats-grid">
        <StatCard
          title="Total Medicines"
          value={medicines.length}
        />

        <StatCard
          title="Low Stock"
          value={lowStockCount}
        />

        <StatCard
          title="Expired Medicines"
          value={expiredCount}
        />
      </div>
    </section>
  );
}

export default Dashboard;
