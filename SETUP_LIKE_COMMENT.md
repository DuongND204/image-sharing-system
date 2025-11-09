# Hướng Dẫn Chạy Ứng Dụng Image Sharing System

## Yêu Cầu
- Node.js (v14 hoặc cao hơn)
- MongoDB (chạy local hoặc cloud)
- npm hoặc yarn

## Cấu Trúc Dự Án
```
image-sharing-system/
├── server/          # Backend (Node.js + Express + MongoDB)
├── src/             # Frontend (React)
└── database.json    # JSON Server (dữ liệu hình ảnh)
```

## Bước 1: Cài Đặt Dependencies

### Backend (server)
```bash
cd server
npm install
```

### Frontend (src)
```bash
npm install
```

## Bước 2: Cấu Hình Environment

### Tạo file `.env` trong folder `server/`:
```
PORT=4000
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=mongodb://localhost:27017/image-sharing-system
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@imagesite.com
CLIENT_URL=http://localhost:3000
```

### Tạo file `.env` trong folder root (frontend):
```
REACT_APP_API_URL=http://localhost:4000/api
```

## Bước 3: Chạy MongoDB

### Nếu dùng MongoDB local:
```bash
mongod
```

### Hoặc dùng MongoDB Atlas (cloud):
- Cập nhật `MONGODB_URI` trong `.env` với connection string của Atlas

## Bước 4: Chạy JSON Server (cho dữ liệu images)

Mở terminal mới:
```bash
npm install -g json-server
json-server --watch database.json --port 5000
```

JSON Server sẽ chạy tại: `http://localhost:5000`

## Bước 5: Chạy Backend (Node.js + MongoDB)

Mở terminal mới:
```bash
cd server
npm run dev
```

Backend sẽ chạy tại: `http://localhost:4000`

## Bước 6: Chạy Frontend (React)

Mở terminal mới:
```bash
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## Kiến Trúc Dữ Liệu

### Images (json-server - database.json)
```json
{
  "pictures": [
    {
      "id": 1,
      "user_id": 2,
      "title": "Sunset at the Beach",
      "description": "Beautiful sunset...",
      "image_url": "https://...",
      "likes_count": 45,
      "comments_count": 8,
      "upload_date": "2024-10-15T18:30:00Z"
    }
  ]
}
```

### Users (MongoDB)
- Được lưu trong MongoDB khi đăng ký/đăng nhập

### Comments (MongoDB)
- Lưu trong MongoDB collection `comments`
- Kết nối với `userId` (MongoDB ObjectId)
- Có thể xóa comment nếu là chủ sở hữu

### Likes (MongoDB)
- Lưu trong MongoDB collection `likes`
- Mỗi user chỉ có thể like một image một lần (unique index)
- Có thể unlike bất cứ lúc nào

## API Endpoints

### Authentication
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/forgot-password` - Quên mật khẩu
- PUT `/api/auth/reset-password` - Đặt lại mật khẩu

### Comments (require token)
- GET `/api/comments/image/:imageId` - Lấy comments của image
- POST `/api/comments` - Thêm comment (require token)
- DELETE `/api/comments/:commentId` - Xóa comment (require token, owner only)

### Likes (require token)
- GET `/api/likes/image/:imageId` - Lấy likes của image
- POST `/api/likes` - Thêm like (require token)
- DELETE `/api/likes/:imageId` - Xóa like (require token)

### Images (json-server)
- GET `/pictures` - Lấy tất cả images
- GET `/pictures/:id` - Lấy image by ID
- GET `/uppicture` - Lấy user-uploaded images

### Users (json-server)
- GET `/users` - Lấy tất cả users
- GET `/users/:id` - Lấy user by ID

## Tài Khoản Test

### Backend (MongoDB):
Các tài khoản mới được tạo qua form Register

### Frontend (json-server):
- Email: admin@imagesite.com, Password: 123456
- Email: john@example.com, Password: 123123
- Email: jane@example.com, Password: 123123

## Quy Trình Sử Dụng

1. **Đăng ký/Đăng nhập**: User tạo tài khoản hoặc đăng nhập
2. **Xem Images**: Home page hiển thị images từ json-server
3. **Xem Chi Tiết**: Click image để xem chi tiết (ProtectedRoute yêu cầu đăng nhập)
4. **Like/Comment**: Khi đã đăng nhập, user có thể:
   - Like/Unlike image
   - Thêm comments
   - Xóa comments của chính mình
5. **Upload Images**: User có thể upload images vào collection `uppicture`

## Troubleshooting

### Lỗi "Cannot access ImageDetail without login"
- Đảm bảo đã đăng nhập thành công
- Kiểm tra token được lưu trong localStorage
- Xóa cache và đăng nhập lại

### Lỗi "MongoDB connection failed"
- Kiểm tra MongoDB đang chạy
- Kiểm tra `MONGODB_URI` trong `.env` đúng
- Kiểm tra port 27017 (mặc định MongoDB)

### Lỗi "Cannot POST /api/comments"
- Kiểm tra backend đang chạy
- Kiểm tra token được gửi trong header `Authorization: Bearer <token>`
- Kiểm tra CORS được enable

### Lỗi "json-server không tìm thấy images"
- Kiểm tra `database.json` có tồn tại
- Kiểm tra json-server đang chạy tại port 5000
- Kiểm tra structure của `database.json`

## Notes

- **Comments & Likes**: Lưu trong MongoDB với user info
- **Images**: Lưu trong json-server (database.json) để dễ test
- **Authentication**: Sử dụng JWT token (1 ngày hết hạn)
- **Protected Routes**: ImageDetail, UserManager yêu cầu login
- **CORS**: Được enable để frontend có thể gọi API

## Commit & Branches

- Branch: `like/comment` - Chứa tính năng like/comment mới
- Commit khi hoàn thành một feature hoặc fix bug

---

**Happy Coding! 🎉**
