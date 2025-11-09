# Tóm Tắt Các Thay Đổi - Like & Comment Feature

## Vấn Đề Được Sửa

### 1. **Lỗi ImageDetail không vào được sau đăng nhập**
   - **Nguyên nhân**: `ProtectedRoute` chỉ kiểm tra `authUser` mà không kiểm tra token đúng cách
   - **Giải pháp**: 
     - Cập nhật `ProtectedRoute.jsx` để kiểm tra `isAuthenticated`, `token`, và `user` từ zustand store
     - Đảm bảo tất cả các giá trị này đều tồn tại trước khi cho phép access

### 2. **Phân Tách Dữ Liệu**
   - **Images**: Lưu trong `database.json` (json-server) - chạy tại port 5000
   - **Users/Comments/Likes**: Lưu trong MongoDB - chạy tại port 4000

## Thay Đổi Chi Tiết

### Frontend (src/)

#### `src/components/ProtectedRoute.jsx`
```javascript
// Trước:
const { authUser } = useAuthStore();
if (!authUser) { return <Navigate to="/login" replace />; }

// Sau:
const { isAuthenticated, user, token } = useAuthStore();
if (!isAuthenticated || !token || !user) { return <Navigate to="/login" replace />; }
```

#### `src/pages/ImageDetail.js` (Rewritten)
**Thay đổi chính:**
- Sử dụng `useAuthStore()` để lấy user hiện tại và token
- Tách `imageUser` (user sở hữu image) từ `currentUser` (user đang đăng nhập)
- Gọi API từ 2 endpoints khác nhau:
  - Image: `http://localhost:5000` (json-server)
  - Comments/Likes: `http://localhost:4000/api` (MongoDB)
- Thêm state cho likes, isLiked, submitting status
- Hàm xử lý:
  - `handleAddComment()` - Gửi POST tới `/api/comments`
  - `handleDeleteComment()` - Gửi DELETE tới `/api/comments/:id`
  - `handleToggleLike()` - Like/Unlike image
- UI cập nhật:
  - Nút Like có trạng thái liked/unliked
  - Comments hiển thị tên author và nút delete
  - Input comment disabled khi chưa login
  - Nút Post disabled khi text rỗng

#### `src/styles/ImageDetail.css`
**Thêm CSS cho:**
- `.comment-header` - Layout comment author + delete button
- `.comment-author` - Tên người bình luận
- `.delete-comment-btn` - Nút xóa comment (hover đỏ)
- `.like-btn.liked` - Style khi đã like
- Disabled state cho buttons

### Backend (server/)

#### `server/models/Comment.js` (NEW)
```javascript
{
  imageId: String,        // ID của image
  userId: ObjectId,       // Ref đến User
  text: String,          // Nội dung comment
  userName: String,      // Tên user (cache)
  userAvatar: String,    // Avatar user (cache)
  createdAt: Date,       // Tự động
  updatedAt: Date        // Tự động
}
```

#### `server/models/Like.js` (NEW)
```javascript
{
  imageId: String,       // ID của image
  userId: ObjectId,      // Ref đến User
  userName: String,      // Tên user (cache)
  createdAt: Date,       // Tự động
  updatedAt: Date        // Tự động
}
// Unique index: (imageId, userId) - mỗi user chỉ like 1 lần
```

#### `server/routes/comments.js` (NEW)
- **GET** `/image/:imageId` - Lấy comments (public)
- **POST** `/` - Thêm comment (protected, require token)
- **DELETE** `/:commentId` - Xóa comment (protected, owner only)

#### `server/routes/likes.js` (NEW)
- **GET** `/image/:imageId` - Lấy likes (public)
- **GET** `/image/:imageId/user/:userId` - Check user liked (public)
- **POST** `/` - Thêm like (protected, require token)
- **DELETE** `/:imageId` - Unlike (protected, require token)

#### `server/middlewares/authMiddleware.js`
**Sửa export:**
```javascript
// Trước:
export default { protectRoute };

// Sau:
export const protectRoute = async (req, res, next) => { ... }
export default { protectRoute };
```

#### `server/index.js`
**Thêm imports:**
```javascript
import commentsRouter from './routes/comments.js';
import likesRouter from './routes/likes.js';

// Thêm routes:
app.use('/api/comments', commentsRouter);
app.use('/api/likes', likesRouter);
```

### Database

#### `database.json`
- Đã có `comments[]` và `likes[]` tables
- Cấu trúc phù hợp với json-server

## API Endpoints Mới

### Comments
```
GET  /api/comments/image/:imageId
POST /api/comments                 (require token)
DELETE /api/comments/:commentId    (require token, owner only)
```

### Likes
```
GET /api/likes/image/:imageId
GET /api/likes/image/:imageId/user/:userId
POST /api/likes                 (require token)
DELETE /api/likes/:imageId      (require token)
```

## Flow Đăng Nhập → Image Detail → Like/Comment

```
1. User nhấn Login
   → zustand store lưu user, token, isAuthenticated=true
   
2. User click image
   → ProtectedRoute kiểm tra isAuthenticated + token + user
   → ✅ Pass → Vào ImageDetail
   → ❌ Fail → Về /login
   
3. ImageDetail component:
   → Fetch image từ json-server
   → Fetch comments từ MongoDB (public)
   → Fetch likes từ MongoDB (public)
   → Check if currentUser liked this image
   
4. User click Like:
   → POST /api/likes (gửi token)
   → MongoDB lưu like
   → Update UI (likes[], isLiked=true)
   
5. User thêm comment:
   → POST /api/comments (gửi token + text)
   → MongoDB lưu comment
   → Update UI (comments[])
   
6. User click delete comment:
   → DELETE /api/comments/:id (gửi token)
   → Check owner (comment.userId === currentUser._id)
   → ✅ Owner → xóa
   → ❌ Not owner → 403 Forbidden
```

## Quy Trình Test

1. **Setup**
   ```bash
   # Terminal 1: JSON Server
   json-server --watch database.json --port 5000
   
   # Terminal 2: MongoDB Backend
   cd server && npm run dev
   
   # Terminal 3: React Frontend
   npm start
   ```

2. **Test Flow**
   - Đăng ký tài khoản mới
   - Đăng nhập
   - Click vào image
   - Thêm like/comment
   - Kiểm tra xóa comment
   - Logout và thử vào image detail (phải về login)

## Files Được Tạo/Sửa

### Tạo:
- `server/models/Comment.js`
- `server/models/Like.js`
- `server/routes/comments.js`
- `server/routes/likes.js`
- `SETUP_LIKE_COMMENT.md`
- `CHANGES_LIKE_COMMENT.md` (file này)

### Sửa:
- `src/components/ProtectedRoute.jsx`
- `src/pages/ImageDetail.js`
- `src/styles/ImageDetail.css`
- `server/middlewares/authMiddleware.js`
- `server/index.js`

## Security

- **Protected Routes**: Comments/Likes POST/DELETE yêu cầu JWT token
- **Owner Only**: Chỉ chủ sở hữu comment mới có thể xóa
- **Unique Constraint**: Mỗi user chỉ like 1 lần trên 1 image
- **CORS Enabled**: Frontend & backend trên port khác nhau

## Lưu Ý

1. **MongoDB phải chạy** - comments/likes không hoạt động nếu MongoDB offline
2. **json-server phải chạy** - images không load nếu json-server offline
3. **Token hết hạn 1 ngày** - sau đó cần đăng nhập lại
4. **Browser localStorage** - lưu auth data, xóa nếu gặp lỗi persistent

---

**Đã hoàn thành tính năng Like & Comment! ✅**
