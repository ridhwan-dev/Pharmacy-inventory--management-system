import './App.css';
import StatCard from './components/StatCard';


function App () {
  return (
    <div className="app-container">
      <aside className="Sidebar">
        <h2 className="brand">PIMS</h2>

        <nav className="navigation">
          <a href="#"className="nav-link-active">Dashboard</a>
          <a href="#"className="nav-link">Medicines</a>
          <a href="#"className="nav-link">Stock alerts</a>
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>Pharmacy Dashboard</h1>
            <p>Manage Your Pharmacy Inventory</p>
          </div>

          <div className="user-profile">
            <span>Pharmacy staff</span>
          </div>
        </header>
        <section className="dasboard-content">
          <h2>overview</h2>
          <div className="stats-grid">
            <StatCard title="Total Medicine" value={0} />
            <StatCard title="Low Stock" value={0} />
            <StatCard title="Expiry Medicines" value={0} />

            





      
          </div>
        </section>
      </main>
    </div>
  )



}
export default App;