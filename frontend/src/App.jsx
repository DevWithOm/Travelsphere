import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Itinerary from './pages/Itinerary';
import Budget from './pages/Budget';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import PackingList from './pages/PackingList';
import Landing from './pages/Landing';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<Layout />}>
          <Route path="/plan" element={<Home />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="budget" element={<Budget />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="packing-list" element={<PackingList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
