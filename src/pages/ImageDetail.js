import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ImageDetail.css';

function ImageDetail() {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const imageRes = await fetch(`http://localhost:5000/pictures/${id}`);
        const imageData = await imageRes.json();
        setImage(imageData);

        const userRes = await fetch(`http://localhost:5000/users/${imageData.user_id}`);
        const userData = await userRes.json();
        setUser(userData);

        const commentsRes = await fetch(`http://localhost:5000/comments?picture_id=${id}`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching image details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        picture_id: image.id,
        user_id: 1,
        comment_text: commentText,
        commented_at: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  if (loading) {
    return (
      <div className="image-detail-loading">
        <p>Loading image...</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="image-detail-error">
        <p>Image not found</p>
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="image-detail">
      <div className="detail-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <div className="detail-content">
          <div className="image-section">
            <img src={image.image_url} alt={image.title} className="detail-image" />
          </div>

          <div className="info-section">
            <div className="header-info">
              <h1>{image.title}</h1>
              {user && (
                <div className="user-details">
                  <img src={user.avatar_url} alt={user.username} className="user-avatar" />
                  <div className="user-text">
                    <p className="username">{user.username}</p>
                    <p className="email">{user.email}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="description">
              <h2>Description</h2>
              <p>{image.description}</p>
            </div>

            <div className="stats-section">
              <div className="stat">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{image.likes_count} Likes</span>
              </div>
              <div className="stat">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{image.comments_count} Comments</span>
              </div>
              <div className="stat">
                <span className="stat-icon">📅</span>
                <span className="stat-value">
                  {new Date(image.upload_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="like-btn">❤️ Like</button>
              <button className="save-btn">🔖 Save</button>
              <button className="share-btn">📤 Share</button>
            </div>

            <div className="comments-section">
              <h2>Comments ({comments.length})</h2>

              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="comment-input"
                />
                <button onClick={handleAddComment} className="add-comment-btn">
                  Post
                </button>
              </div>

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <p className="comment-text">{comment.comment_text}</p>
                      <p className="comment-date">
                        {new Date(comment.commented_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDetail;
