import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/UserManager.css';

function UserManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pictures, setPictures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const FIXED_USER_ID = 2; // user mặc định nếu chưa đăng nhập
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
      const [picsRes, catsRes] = await Promise.all([
        fetch('http://localhost:5000/uppicture'),
        fetch('http://localhost:5000/categories'),
      ]);
      setPictures(await picsRes.json());
      setCategories(await catsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          user_id: item.user_id || 2,
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
      user_id: FIXED_USER_ID,
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
      user_id: Number(FIXED_USER_ID),
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
      user_id: item.user_id || FIXED_USER_ID,
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
          <button className="um-upload-btn" onClick={() => { resetForm(); setIsModalOpen(true); }}>
            + Ghim 
          </button>
        </div>

        {loading ? (
          <div className="um-loading">Đang tải...</div>
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


