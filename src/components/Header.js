import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>📸 PinPhoto</h1>
          </Link>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search images and descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
