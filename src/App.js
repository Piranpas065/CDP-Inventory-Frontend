import { useState } from 'react';
import InventoryDashboard from './components/InventoryDashboard';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return <InventoryDashboard activePage={activePage} onNavigate={setActivePage} />;
}

export default App;