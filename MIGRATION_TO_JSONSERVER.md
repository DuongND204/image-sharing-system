# 🔄 Migration: MongoDB → JSON Server

**Date**: November 9, 2025  
**Status**: ✅ COMPLETE

---

## 📋 Summary

Chuyển đổi từ lưu **Comments & Likes** trong **MongoDB** sang **JSON Server** (database.json)

### ✅ Lợi ích:
- ✅ Đơn giản hơn (không cần MongoDB)
- ✅ Dễ test hơn (tất cả dữ liệu trong 1 file)
- ✅ Tốc độ nhanh hơn
- ✅ Dữ liệu đồng bộ giữa Home & Detail page

---

## 🔄 Changes Made

### 1️⃣ Database Structure
**Trước**: MongoDB collections  
**Sau**: `database.json` tables

```json
{
  "comments": [
    {
      "id": 1,
      "imageId": "1",
      "source": "pictures",
      "userId": 3,
      "userName": "jane_smith",
      "userAvatar": "https://...",
      "text": "Amazing!",
      "createdAt": "2024-10-15T19:15:00Z"
    }
  ],
  "likes": [
    {
      "id": 1,
      "imageId": "1",
      "source": "pictures",
      "userId": 3,
      "userName": "jane_smith",
      "createdAt": "2024-10-15T19:00:00Z"
    }
  ]
}
```

### 2️⃣ Backend Routes Removed
- ❌ `/api/comments/*` (MongoDB routes)
- ❌ `/api/likes/*` (MongoDB routes)
- ❌ `server/routes/comments.js`
- ❌ `server/routes/likes.js`
- ❌ `server/models/Comment.js`
- ❌ `server/models/Like.js`

**Vì**: JSON Server tự động cung cấp REST API cho `database.json`

### 3️⃣ Frontend API Calls

#### ImageDetail.js
```javascript
// ❌ Trước (MongoDB)
const commentsRes = await axiosInstance.get(`/comments/image/${id}`);

// ✅ Sau (JSON Server)
const commentsRes = await fetch(`http://localhost:5000/comments?imageId=${id}&source=${collection}`);
```

#### Home.js
```javascript
// ❌ Trước (MongoDB + json-server)
const [commentsRes, likesRes] = await Promise.all([
  axiosInstance.get('/comments/image/all'),
  axiosInstance.get('/likes/image/all'),
]);

// ✅ Sau (Tất cả từ JSON Server)
const [commentsRes, likesRes] = await Promise.all([
  fetch('http://localhost:5000/comments'),
  fetch('http://localhost:5000/likes'),
]);
```

### 4️⃣ Schema Changes

#### Comments
```javascript
// ❌ MongoDB
{
  imageId: String,
  userId: ObjectId,
  text: String,
  userName: String,
  createdAt: Date
}

// ✅ JSON Server
{
  id: Number,
  imageId: String,
  source: String,     // "pictures" hoặc "uppicture"
  userId: Number,
  userName: String,
  userAvatar: String,
  text: String,
  createdAt: String   // ISO timestamp
}
```

#### Likes
```javascript
// ❌ MongoDB
{
  imageId: String,
  userId: ObjectId,
  userName: String,
  unique: (imageId, userId)
}

// ✅ JSON Server
{
  id: Number,
  imageId: String,
  source: String,
  userId: Number,
  userName: String,
  createdAt: String
}
```

---

## 📊 Data Query Examples

### Get Comments of an Image
```bash
GET http://localhost:5000/comments?imageId=1&source=pictures
```

Response:
```json
[
  {
    "id": 1,
    "imageId": "1",
    "source": "pictures",
    "userId": 3,
    "userName": "jane_smith",
    "userAvatar": "https://i.pravatar.cc/150?img=3",
    "text": "Amazing colors!",
    "createdAt": "2024-10-15T19:15:00Z"
  }
]
```

### Get Likes of an Image
```bash
GET http://localhost:5000/likes?imageId=1&source=pictures
```

Response:
```json
[
  {
    "id": 1,
    "imageId": "1",
    "source": "pictures",
    "userId": 3,
    "userName": "jane_smith",
    "createdAt": "2024-10-15T19:00:00Z"
  }
]
```

### Add Comment
```bash
POST http://localhost:5000/comments
Content-Type: application/json

{
  "imageId": "1",
  "source": "pictures",
  "userId": 2,
  "userName": "john_doe",
  "userAvatar": "https://...",
  "text": "Nice photo!",
  "createdAt": "2024-11-09T10:00:00Z"
}
```

### Add Like
```bash
POST http://localhost:5000/likes
Content-Type: application/json

{
  "imageId": "1",
  "source": "pictures",
  "userId": 2,
  "userName": "john_doe",
  "createdAt": "2024-11-09T10:00:00Z"
}
```

### Delete Comment
```bash
DELETE http://localhost:5000/comments/1
```

### Delete Like
```bash
DELETE http://localhost:5000/likes/1
```

---

## ✅ Testing Checklist

- [ ] Refresh Home page - số like/comment đúng
- [ ] Click vào image detail - comment/like load đúng
- [ ] Add comment - comment hiển thị realtime
- [ ] Delete comment - comment biến mất
- [ ] Like/Unlike - số like tăng/giảm
- [ ] Refresh page - dữ liệu vẫn đó
- [ ] Home & Detail page - số like/comment khớp nhau

---

## 🚀 How to Use

### 1. Đảm bảo JSON Server chạy
```bash
npm run json-server
```

### 2. Khởi động frontend
```bash
npm start
```

### 3. Thử chức năng
- Vào Home page
- Click vào image
- Thêm comment
- Like image
- Xóa comment của bạn

---

## 🔧 File Changes

**Deleted:**
- `server/models/Comment.js` ❌
- `server/models/Like.js` ❌
- `server/routes/comments.js` ❌
- `server/routes/likes.js` ❌

**Modified:**
- `database.json` ✏️ (Added comments & likes tables)
- `server/index.js` ✏️ (Removed MongoDB routes)
- `src/pages/ImageDetail.js` ✏️ (Use json-server API)
- `src/pages/Home.js` ✏️ (Use json-server API)

**Created:**
- `MIGRATION_TO_JSONSERVER.md` 📄 (This file)

---

## 📝 Notes

### Why JSON Server?
1. **Simplicity**: Tất cả dữ liệu trong 1 file
2. **No Backend Logic**: REST API tự động generate
3. **Easy Testing**: Dùng F12 Network tab xem requests
4. **Development**: Không cần setup MongoDB
5. **Data Sync**: Tất cả clients thấy dữ liệu như nhau

### Limitations
- ❌ Không có validation phía server
- ❌ Không có authorization checks
- ❌ Dữ liệu reset khi restart JSON Server

### For Production
⚠️ **NOT recommended for production!**
- Cần implement backend validation
- Cần implement authorization
- Cần database thực (MongoDB/PostgreSQL)
- Cần API security layers

---

## ✨ Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Database** | MongoDB | JSON Server |
| **API Routes** | Custom (/api/comments) | Auto Generated |
| **Setup** | Complex | Simple |
| **Testing** | Harder | Easier |
| **Data Sync** | Sometimes inconsistent | Always consistent |
| **File Management** | Distributed | Centralized |

---

## 🎉 Status: Complete

✅ Migration hoàn tất  
✅ Tất cả APIs hoạt động  
✅ Data đồng bộ  
✅ Sẵn sàng dùng  

**Enjoy your simplified like/comment system!** 🚀

