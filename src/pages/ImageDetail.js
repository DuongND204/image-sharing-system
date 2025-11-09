import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import '../styles/ImageDetail.css';

function ImageDetail() {
  const { id, source } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [image, setImage] = useState(null);
  const [imageUser, setImageUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // URL API
  const API_JSONSERVER = 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const collection = source || 'pictures';

        // Lấy thông tin image từ json-server
        const imageRes = await fetch(`${API_JSONSERVER}/${collection}/${id}`);
        const imageData = await imageRes.json();
        if (!imageData.user_id) imageData.user_id = 2;
        setImage(imageData);

        // Lấy thông tin user của image từ json-server
        if (imageData && imageData.user_id) {
          try {
            const userRes = await fetch(`${API_JSONSERVER}/users/${imageData.user_id}`);
            if (userRes.ok) {
              const userData = await userRes.json();
              setImageUser(userData);
            }
          } catch (err) {
            console.error('Error fetching image user:', err);
          }
        }

        // Lấy comments từ json-server
        try {
          const commentsRes = await fetch(`${API_JSONSERVER}/comments?imageId=${id}&source=${collection}`);
          if (commentsRes.ok) {
            const commentsData = await commentsRes.json();
            setComments(commentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          }
        } catch (err) {
          console.error('Error fetching comments:', err);
        }

        // Lấy likes từ json-server
        try {
          const likesRes = await fetch(`${API_JSONSERVER}/likes?imageId=${id}&source=${collection}`);
          if (likesRes.ok) {
            const likesData = await likesRes.json();
            setLikes(likesData);

            // Kiểm tra user đã like chưa
            if (currentUser) {
              const liked = likesData.some((like) => like.userId === currentUser.id);
              setIsLiked(!!liked);
            }
          }
        } catch (err) {
          console.error('Error fetching likes:', err);
        }
      } catch (error) {
        console.error('Error fetching image details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, source, currentUser]);

  const urlParams = new URLSearchParams(location.search);
  const manageMode = urlParams.get('manage') === '1' && (source === 'uppicture');

  const handleBack = () => {
    // Ưu tiên quay lại trang quản lý khi vào từ đó
    if (manageMode) {
      navigate('/user');
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleDeletePicture = async () => {
    try {
      await fetch(`http://localhost:5000/uppicture/${id}`, { method: 'DELETE' });
      navigate('/user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditRedirect = () => {
    navigate(`/user?editId=${id}`);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUser) return;

    try {
      setSubmittingComment(true);
      const collection = source || 'pictures';
      
      const response = await fetch(`${API_JSONSERVER}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: id,
          source: collection,
          userId: currentUser.id,
          userName: currentUser.username,
          userAvatar: currentUser.avatar_url || currentUser.avatarUrl,
          text: commentText,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${API_JSONSERVER}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleToggleLike = async () => {
    if (!currentUser) return;

    try {
      const collection = source || 'pictures';
      
      if (isLiked) {
        // Unlike - find and delete the like
        const likeToDelete = likes.find((like) => like.userId === currentUser.id);
        if (likeToDelete) {
          const response = await fetch(`${API_JSONSERVER}/likes/${likeToDelete.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setIsLiked(false);
            setLikes(likes.filter((like) => like.userId !== currentUser.id));
          }
        }
      } else {
        // Like - create new like
        const response = await fetch(`${API_JSONSERVER}/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageId: id,
            source: collection,
            userId: currentUser.id,
            userName: currentUser.username,
            createdAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const newLike = await response.json();
          setLikes([...likes, newLike]);
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
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
        <button onClick={handleBack} className="back-link" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          ← Quay lại
        </button>
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
              {imageUser && (
                <div className="user-details">
                  <img src={imageUser.avatar_url} alt={imageUser.username} className="user-avatar" />
                  <div className="user-text">
                    <p className="username">{imageUser.username}</p>
                    <p className="email">{imageUser.email}</p>
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
                <span className="stat-value">{likes.length} Likes</span>
              </div>
              <div className="stat">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{comments.length} Comments</span>
              </div>
              <div className="stat">
                <span className="stat-icon">📅</span>
                <span className="stat-value">
                  {new Date(image.upload_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className={`like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleToggleLike}
                disabled={!currentUser}
              >
                {isLiked ? '❤️ Unlike' : '🤍 Like'}
              </button>
              <button className="save-btn">🔖 Save</button>
              <button className="share-btn">📤 Share</button>
            </div>

            <div className="comments-section">
              <h2>Comments ({comments.length})</h2>

              <div className="add-comment">
                <input
                  type="text"
                  placeholder={currentUser ? 'Add a comment...' : 'Login to comment'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !submittingComment) {
                      handleAddComment();
                    }
                  }}
                  className="comment-input"
                  disabled={!currentUser || submittingComment}
                />
                <button
                  onClick={handleAddComment}
                  className="add-comment-btn"
                  disabled={!currentUser || submittingComment || !commentText.trim()}
                >
                  {submittingComment ? '...' : 'Post'}
                </button>
              </div>

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment">
                      <div className="comment-header">
                        <p className="comment-author">{comment.userName}</p>
                        {currentUser && currentUser._id === comment.userId && (
                          <button
                            className="delete-comment-btn"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      <p className="comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {manageMode && (
              <div className="action-buttons" style={{ marginTop: 16 }}>
                <button className="save-btn" onClick={handleEditRedirect}>✏️ Sửa</button>
                <button className="share-btn" onClick={handleDeletePicture}>🗑️ Xóa</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDetail;
