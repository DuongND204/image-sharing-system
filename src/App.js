import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageDetail from './pages/ImageDetail';
import UserManager from './pages/UserManager';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image/:id" element={<ImageDetail />} />
        <Route path="/image/:source/:id" element={<ImageDetail />} />
        <Route path="/user" element={<UserManager />} />
      </Routes>
    </Router>
  );
}

export default App;
