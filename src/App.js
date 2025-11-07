import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageDetail from './pages/ImageDetail';
import UserManager from './pages/UserManager';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route
          path='/image/:id'
          element={
            <ProtectedRoute>
              <ImageDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path='/image/:source/:id'
          element={
            <ProtectedRoute>
              <ImageDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path='/user'
          element={
            <ProtectedRoute>
              <UserManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
