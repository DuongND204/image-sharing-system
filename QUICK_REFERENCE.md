# Quick Start - Like & Comment Feature

## ⚡ Chạy Ứng Dụng (3 Terminals)

### Terminal 1: JSON Server (Images)
```bash
json-server --watch database.json --port 5000
```
✅ Chạy tại: `http://localhost:5000`

### Terminal 2: Backend (MongoDB + Comments/Likes)
```bash
cd server
npm run dev
```
✅ Chạy tại: `http://localhost:4000`

### Terminal 3: Frontend (React)
```bash
npm start
```
✅ Chạy tại: `http://localhost:3000`

---

## 🔐 Test Account (MongoDB)

Tạo account mới qua **Register** page

Hoặc dùng tài khoản test từ JSON Server:
- **Email**: john@example.com
- **Password**: 123123

---

## 🎯 Quy Trình Test

1. **Truy cập**: `http://localhost:3000`
2. **Register/Login**: Tạo hoặc đăng nhập tài khoản
3. **Home Page**: Xem danh sách images
4. **Click Image**: Vào chi tiết image
   - ✅ Đã login → Thấy trang
   - ❌ Chưa login → Redirect về `/login`
5. **Like Image**: Click nút "🤍 Like" → Đổi thành "❤️ Unlike"
6. **Add Comment**: Nhập text → Click "Post"
7. **Delete Comment**: Click ✕ trên comment của bạn
8. **Logout**: Xoá auth data → Thử vào image detail → Redirect

---

## 📊 Architecture

```
Frontend (React)
    ↓
    ├─→ json-server:5000 (images, users)
    └─→ MongoDB Backend:4000 (comments, likes, auth)

Dữ Liệu:
├─ Images → database.json (json-server)
├─ Users → MongoDB
├─ Comments → MongoDB
└─ Likes → MongoDB
```

---

## 🔌 API Endpoints

### Comments
```
GET    /api/comments/image/:imageId           → Danh sách comments
POST   /api/comments                          → Thêm comment (require token)
DELETE /api/comments/:commentId               → Xóa comment (owner only)
```

### Likes
```
GET    /api/likes/image/:imageId              → Danh sách likes
POST   /api/likes                             → Like image (require token)
DELETE /api/likes/:imageId                    → Unlike image (require token)
```

---

## 🐛 Troubleshooting

### "Cannot access ImageDetail"
- [ ] Đã login?
- [ ] Token có trong localStorage?
- [ ] Browser F12 → Application → localStorage → check auth-data

### "Comments không load"
- [ ] MongoDB đang chạy?
- [ ] Backend đang chạy? (port 4000)
- [ ] Check browser console F12 → Network

### "Images không thấy"
- [ ] json-server đang chạy? (port 5000)
- [ ] database.json có tồn tại?
- [ ] Check: http://localhost:5000/pictures

### "Like/Comment API Error"
- [ ] Backend chạy? 
- [ ] Token gửi đúng?
- [ ] F12 → Network → Check request header

---

## 📝 Files Chính

```
src/
├─ components/ProtectedRoute.jsx    ← Kiểm tra auth
├─ pages/ImageDetail.js              ← Like/Comment UI
└─ styles/ImageDetail.css            ← Styling

server/
├─ models/Comment.js                 ← Comment schema
├─ models/Like.js                    ← Like schema
├─ routes/comments.js                ← Comment API
├─ routes/likes.js                   ← Like API
└─ index.js                          ← Register routes
```

---

## ✅ Features

- [x] Login → ProtectedRoute → ImageDetail
- [x] Like/Unlike images
- [x] Add/Delete comments
- [x] Comments từ MongoDB
- [x] Likes từ MongoDB
- [x] Images từ json-server
- [x] Owner-only delete comment
- [x] Unique like per image
- [x] Real-time UI update

---

## 🚀 Next Steps

- [ ] Add comment reply/nested comments
- [ ] Add comment reactions (emoji)
- [ ] Add comment count to image
- [ ] Add like count to image stats
- [ ] Add recently commented filter
- [ ] Add popular comments (most liked)

---

**Build Date**: November 9, 2025
**Branch**: `like/comment`
**Status**: ✅ Complete
