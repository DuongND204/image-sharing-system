import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageDetail from './pages/ImageDetail';
import UserManager from './pages/UserManager';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminUserPage from './usermanagement/AdminUserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
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
        <Route
          path='/admin'
          element={
            // <ProtectedRoute>
              <AdminUserPage />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
