import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

function Header({ searchQuery, onSearchChange }) {
  const { isLoggedIn, logout, authUser } = useAuthStore();
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
          {isLoggedIn ? (
            <div className='flex gap-2'>
              <Link to='/user' className='user-btn' title='Quản lý ảnh'>
                👤 {authUser.username}
              </Link>
              <button
                className='user-btn'
                title='Đăng xuất'
                onClick={handleLogout}
              >
                Đăng xuất
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
