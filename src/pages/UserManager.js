import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import '../styles/Home.css';
import '../styles/UserManager.css';

function UserManager() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [pictures, setPictures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const [form, setForm] = useState({
    user_id: 2,
    title: '',
    description: '',
    image_url: '',
    image_file: null,
    image_preview: '',
    category_id: '',
    visibility: 'public',
    is_hidden: false,
  });

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [picsRes, catsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/uppicture'),
        fetch('http://localhost:5000/categories'),
        fetch('http://localhost:5000/users'),
      ]);
      const allPictures = await picsRes.json();
      const allUsers = await usersRes.json();
      setCategories(await catsRes.json());
      
      // Tìm user_id tương ứng với user hiện tại
      let userId = null;
      if (user) {
        // Tìm user trong JSON server theo email hoặc username (case-insensitive)
        const matchedUser = allUsers.find(
          (u) => 
            (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
            (u.username && user.username && u.username.toLowerCase() === user.username.toLowerCase())
        );
        
        if (matchedUser) {
          userId = matchedUser.id;
          setCurrentUserId(userId);
        } else {
          // Nếu không tìm thấy user trong JSON server, tự động tạo user mới
          try {
            const maxId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) : 0;
            const newUserId = maxId + 1;
            
            const newUser = {
              id: newUserId,
              username: user.username || `user_${newUserId}`,
              email: user.email || '',
              password: '', // Không lưu password trong JSON server
              role: 'user',
              status: 'active',
              created_at: new Date().toISOString(),
              avatar_url: user.avatarUrl || `https://api.dicebear.com/9.x/pixel-art-neutral/png?seed=${user.username}`
            };
            
            // Tạo user mới trong JSON server
            const createUserRes = await fetch('http://localhost:5000/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser)
            });
            
            if (createUserRes.ok) {
              const createdUser = await createUserRes.json();
              userId = createdUser.id;
              setCurrentUserId(userId);
              console.log('Đã tạo user mới trong JSON server:', userId);
            } else {
              // Nếu tạo thất bại, thử tìm lại một lần nữa (có thể đã được tạo từ auth controller)
              const retryUsersRes = await fetch('http://localhost:5000/users');
              const retryUsers = await retryUsersRes.json();
              const retryMatchedUser = retryUsers.find(
                (u) => 
                  (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
                  (u.username && user.username && u.username.toLowerCase() === user.username.toLowerCase())
              );
              if (retryMatchedUser) {
                userId = retryMatchedUser.id;
                setCurrentUserId(userId);
                console.log('Đã tìm thấy user sau khi retry:', userId);
              }
            }
          } catch (createError) {
            console.error('Lỗi khi tạo user trong JSON server:', createError);
            // Thử tìm lại một lần nữa
            try {
              const retryUsersRes = await fetch('http://localhost:5000/users');
              const retryUsers = await retryUsersRes.json();
              const retryMatchedUser = retryUsers.find(
                (u) => 
                  (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
                  (u.username && user.username && u.username.toLowerCase() === user.username.toLowerCase())
              );
              if (retryMatchedUser) {
                userId = retryMatchedUser.id;
                setCurrentUserId(userId);
                console.log('Đã tìm thấy user sau khi retry (catch):', userId);
              }
            } catch (retryError) {
              console.error('Lỗi khi retry tìm user:', retryError);
            }
          }
        }
      }
      
      // Filter ảnh theo user_id của user hiện tại
      if (userId) {
        setPictures(allPictures.filter((p) => p.user_id === userId));
        setForm((prev) => ({ ...prev, user_id: userId }));
      } else {
        // Nếu vẫn không có user_id, không hiển thị ảnh nào
        setPictures([]);
        setCurrentUserId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Open edit modal if redirected with editId
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('editId');
    if (editId && pictures.length > 0) {
      const item = pictures.find((p) => String(p.id) === String(editId));
      if (item) {
        setEditingId(item.id);
        setForm({
          user_id: item.user_id || currentUserId || 2,
          title: item.title || '',
          description: item.description || '',
          image_url: item.image_url || '',
          image_file: null,
          image_preview: item.image_url || '',
          category_id: item.category_id ?? '',
          visibility: item.visibility || 'public',
          is_hidden: !!item.is_hidden,
        });
        setIsModalOpen(true);
      }
    }
  }, [location.search, pictures]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      user_id: currentUserId || 2,
      title: '',
      description: '',
      image_url: '',
      image_file: null,
      image_preview: '',
      category_id: '',
      visibility: 'public',
      is_hidden: false,
    });
  };

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image_file) {
      alert('Vui lòng chọn ảnh từ máy.');
      return;
    }
    
    // Đảm bảo có user_id hợp lệ
    let userId = form.user_id;
    if (!userId || userId === 2) {
      // Nếu chưa có user_id hoặc là giá trị mặc định, thử tìm/tạo lại
      if (user) {
        try {
          const usersRes = await fetch('http://localhost:5000/users');
          const allUsers = await usersRes.json();
          const matchedUser = allUsers.find(
            (u) => 
              (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
              (u.username && user.username && u.username.toLowerCase() === user.username.toLowerCase())
          );
          
          if (matchedUser) {
            userId = matchedUser.id;
            setCurrentUserId(userId);
          } else {
            // Tạo user mới nếu chưa có
            const maxId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) : 0;
            const newUserId = maxId + 1;
            const newUser = {
              id: newUserId,
              username: user.username || `user_${newUserId}`,
              email: user.email || '',
              password: '',
              role: 'user',
              status: 'active',
              created_at: new Date().toISOString(),
              avatar_url: user.avatarUrl || `https://api.dicebear.com/9.x/pixel-art-neutral/png?seed=${user.username}`
            };
            
            const createUserRes = await fetch('http://localhost:5000/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser)
            });
            
            if (createUserRes.ok) {
              const createdUser = await createUserRes.json();
              userId = createdUser.id;
              setCurrentUserId(userId);
            } else {
              alert('Không thể tạo tài khoản trong hệ thống. Vui lòng thử lại.');
              return;
            }
          }
        } catch (error) {
          console.error('Lỗi khi tìm/tạo user:', error);
          alert('Có lỗi xảy ra. Vui lòng thử lại.');
          return;
        }
      } else {
        alert('Bạn cần đăng nhập để thêm ảnh.');
        return;
      }
    }
    
    let imageUrl = '';
    try {
      imageUrl = await fileToDataUrl(form.image_file);
    } catch (err) {
      console.error(err);
    }

    const { image_file, image_preview, ...rest } = form;
    const payload = {
      ...rest,
      image_url: imageUrl,
      user_id: Number(userId),
      category_id: form.category_id === '' ? null : Number(form.category_id),
      upload_date: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
    };

    try {
      setLoading(true);
      if (isEditing) {
        await fetch(`http://localhost:5000/uppicture/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('http://localhost:5000/uppicture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      await loadData();
      resetForm();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      user_id: item.user_id || currentUserId || 2,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      image_file: null,
      image_preview: item.image_url,
      category_id: item.category_id ?? '',
      visibility: item.visibility || 'public',
      is_hidden: !!item.is_hidden,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await fetch(`http://localhost:5000/uppicture/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredPictures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pictures;
    return pictures.filter((p) =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }, [pictures, searchQuery]);

  return (
    <div className="home">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="home-content user-manager">
        <div className="um-toolbar">
          <div className="um-title">Quản lý ảnh </div>
          <button className="um-upload-btn" onClick={async () => { 
            // Đảm bảo có currentUserId trước khi mở modal
            if (!currentUserId && user) {
              // Nếu chưa có user_id, thử tìm/tạo lại
              await loadData();
            }
            resetForm(); 
            setIsModalOpen(true); 
          }}>
            + Ghim 
          </button>
        </div>

        {loading ? (
          <div className="um-loading">Đang tải...</div>
        ) : !currentUserId && user ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>Không tìm thấy tài khoản của bạn trong hệ thống.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Vui lòng đăng xuất và đăng nhập lại, hoặc liên hệ quản trị viên.
            </p>
          </div>
        ) : filteredPictures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>Bạn chưa có ảnh nào.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Nhấn nút "+ Ghim" để thêm ảnh đầu tiên của bạn!
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredPictures.map((p) => (
              <div key={p.id} className="masonry-item">
                <div className="pin-card">
                  <div className="pin-media">
                    <Link to={`/image/uppicture/${p.id}?manage=1`}>
                      <img src={p.image_url} alt={p.title} />
                    </Link>
                    <div className="pin-actions">
                      <button className="pin-btn" onClick={() => handleEdit(p)}>Sửa</button>
                      <button className="pin-btn danger" onClick={() => handleDelete(p.id)}>Xóa</button>
                    </div>
                  </div>
                  <div className="pin-meta">
                    <div className="pin-title">{p.title}</div>
                    <div className="pin-desc">{p.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="um-modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="um-modal" onClick={(e) => e.stopPropagation()}>
              <div className="um-modal-header">
                <div className="um-modal-title">{isEditing ? 'Cập nhật ảnh' : 'Tạo Ghim'}</div>
                <button className="um-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="um-form">
                <div
                  className={`um-dropzone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files && e.dataTransfer.files[0];
                    if (!file) return;
                    setForm((prev) => ({ ...prev, image_file: file }));
                    const localUrl = URL.createObjectURL(file);
                    setForm((prev) => ({ ...prev, image_preview: localUrl }));
                  }}
                  onClick={() => document.getElementById('um-file').click()}
                >
                  {form.image_preview ? (
                    <img src={form.image_preview} alt="preview" />
                  ) : (
                    <div className="um-dropzone-empty">
                      <div className="um-dropzone-icon">↑</div>
                      <div>Chọn một tệp hoặc kéo và thả tệp ở đây</div>
                    </div>
                  )}
                </div>
                <input
                  id="um-file"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    setForm((prev) => ({ ...prev, image_file: file }));
                    const localUrl = URL.createObjectURL(file);
                    setForm((prev) => ({ ...prev, image_preview: localUrl }));
                  }}
                />

                <div className="um-right">
                  <label>Tiêu đề</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Thêm tiêu đề"
                  />

                  <label>Mô tả</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Thêm mô tả chi tiết"
                  />

                  <label>Danh mục</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option value={c.id} key={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <label>Hiển thị</label>
                  <select
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  >
                    <option value="public">Công khai</option>
                    <option value="private">Riêng tư</option>
                  </select>

                  <div className="um-checkbox">
                    <input
                      id="is_hidden"
                      type="checkbox"
                      checked={form.is_hidden}
                      onChange={(e) => setForm({ ...form, is_hidden: e.target.checked })}
                    />
                    <label htmlFor="is_hidden">Ẩn ảnh</label>
                  </div>

                  <div className="um-actions">
                    <button type="button" className="secondary" onClick={() => setForm((prev) => ({ ...prev, image_file: null, image_preview: '' }))}>Hủy </button>
                    <button type="submit">{isEditing ? 'Cập nhật' : 'Lưu ghim'}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManager;


