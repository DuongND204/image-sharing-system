import React from 'react';
import '../styles/CategoryFilter.css';

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const handleCategoryClick = (categoryId) => {
    console.log(`Clicked category: ${categoryId}, type: ${typeof categoryId}`);
    onCategoryChange(categoryId);
  };

  return (
    <div className="category-filter">
      <button
        className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
        onClick={() => handleCategoryClick(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category.id)}
          title={category.name}
        >
          <span className="category-icon">{category.icon}</span>
          <span className="category-name">{category.name}</span>
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
