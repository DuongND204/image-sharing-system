import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Header({ searchQuery, onSearchChange }) {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className='header'>
      <div className='header-container'>
        <div className='logo'>
          <Link to='/'>
            <h1>📸 PinPhoto</h1>
          </Link>
        </div>
        <div className='search-bar'>
          <input
            type='text'
            placeholder='Search images and descriptions...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='search-input'
          />
          <button className='search-btn'>🔍</button>
        </div>
        <div className='user-menu'>
          {isAuthenticated ? (
            <div className='flex gap-2'>
              <div 
                className='user-btn' 
                onClick={() => navigate('/user')}
                style={{ cursor: 'pointer' }}
              >
                <div className='flex items-center gap-2'>
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className='w-8 h-8 rounded-lg'
                  />
                  <span className='text-lg font-medium'>{user.username}</span>
                </div>
              </div>
              <button className='' title='Đăng xuất' onClick={handleLogout}>
                <div className='flex items-center gap-2'>
                  <LogOut className='w-4 h-4 text-red-500' />
                  <span>Đăng xuất</span>
                </div>
              </button>
            </div>
          ) : (
            <div className='flex gap-2'>
              <Link to='/login' className='user-btn' title='Đăng nhập'>
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
