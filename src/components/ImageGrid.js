import React from 'react';
import ImageCard from './ImageCard';
import '../styles/ImageGrid.css';

function ImageGrid({ images, users }) {
  if (images.length === 0) {
    return <div className="no-results">No images found. Try different search terms or categories.</div>;
  }

  return (
    <div className="image-grid">
      {images.map((image) => {
        const user = users.find((u) => u.id === image.user_id);
        return <ImageCard key={image.id} image={image} user={user} />;
      })}
    </div>
  );
}

export default ImageGrid;
