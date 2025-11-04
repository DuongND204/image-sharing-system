import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ImageCard.css';

function ImageCard({ image, user }) {
  return (
    <Link to={`/image/${image.id}`} className="image-card-link">
      <div className="image-card">
        <div className="image-container">
          <img src={image.image_url} alt={image.title} className="image" />
          <div className="image-overlay">
            <p className="image-title">{image.title}</p>
          </div>
        </div>
        <div className="image-info">
          <div className="title-section">
            <p className="image-title-card">{image.title}</p>
            {user && <span className="author-name">by {user.username}</span>}
          </div>
          <p className="description">{image.description}</p>
          <div className="stats">
            <span>❤️ {image.likes_count}</span>
            <span>💬 {image.comments_count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ImageCard;
