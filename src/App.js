import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageDetail from './pages/ImageDetail';
import UserManager from './pages/UserManager';
import './App.css';
import AdminUI from './usermanagement/AdminUI';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image/:id" element={<ImageDetail />} />
        <Route path="/image/:source/:id" element={<ImageDetail />} />
        <Route path="/user" element={<UserManager />} />
        <Route path="/admin" element={<AdminUI />} />
      </Routes>
    </Router>
  );
}

export default App;
