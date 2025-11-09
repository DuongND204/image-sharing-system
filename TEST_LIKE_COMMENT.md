# 🧪 Test Like & Comment Features

## Hướng dẫn kiểm tra lỗi

### 1️⃣ **Kiểm tra Backend có chạy không**

```bash
curl http://localhost:4000/api/health
```

**Kết quả mong đợi**: `{"ok":true}`

---

### 2️⃣ **Kiểm tra MongoDB Connection**

Kiểm tra thử một comment GET request:

```bash
curl http://localhost:4000/api/comments/image/1
```

**Kết quả mong đợi**: Array `[]` hoặc danh sách comments

---

### 3️⃣ **Kiểm tra Token gửi đúng không**

**Trong Browser Console:**

```javascript
// Lấy token từ localStorage
const token = JSON.parse(localStorage.getItem('auth-data')).state.token;
console.log('Token:', token);
```

**Kết quả mong đợi**: Token dạng `eyJhbGc...` (JWT)

---

### 4️⃣ **Test Add Comment Manual**

**Trong Browser Console:**

```javascript
const token = JSON.parse(localStorage.getItem('auth-data')).state.token;
const imageId = '1'; // Hoặc lấy từ URL

fetch('http://localhost:4000/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    imageId: imageId,
    text: 'Test comment'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

---

### 5️⃣ **Test Like Manual**

**Trong Browser Console:**

```javascript
const token = JSON.parse(localStorage.getItem('auth-data')).state.token;
const imageId = '1';

fetch('http://localhost:4000/api/likes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    imageId: imageId
  })
})
.then(res => res.json())
.then(data => console.log('Like Response:', data))
.catch(err => console.error('Like Error:', err));
```

---

### 6️⃣ **Kiểm tra Network Tab**

1. Mở **F12** → **Network**
2. Thử add comment
3. Tìm request `POST comments`
4. Kiểm tra:
   - **Headers**: Có `Authorization: Bearer <token>` không?
   - **Status**: 201 (created) hay lỗi (401, 500)?
   - **Response**: Có data trả về không?

---

### 7️⃣ **Kiểm tra Backend Logs**

Xem terminal chạy `npm run dev` (server folder):

- Có thấy `POST /api/comments` không?
- Có lỗi gì trong middleware không?

---

## 🔍 Các vấn đề thường gặp

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-----------|---------|
| 401 Unauthorized | Token không gửi hoặc hết hạn | Logout + Login lại |
| 404 Not Found | API endpoint sai | Kiểm tra server/routes/comments.js |
| 500 Server Error | MongoDB không connect | Kiểm tra MongoDB URI trong .env |
| Comment không hiển thị | Frontend không fetch lại | Check `useEffect` dependency |
| Like không thay đổi | isLiked state không update | Kiểm tra `setIsLiked` call |

---

## ✅ Checklist trước khi test

- [ ] Backend chạy: `npm run dev` (trong folder `/server`)
- [ ] Frontend chạy: `npm start` (trong folder gốc)
- [ ] JSON Server chạy: `npm run json-server` (hoặc terminal khác)
- [ ] MongoDB connect thành công (check logs)
- [ ] Đã login (có token trong localStorage)
- [ ] Mở ImageDetail page của một image

---

## 🆘 Nếu vẫn không được

### Trace tỉng tỉng:

1. **Console:** Có error đỏ không? Paste lên
2. **Network:** Cái API call nào fail? (status code?)
3. **Backend logs:** Có lỗi gì không?
4. **MongoDB:** Kiểm tra `db.comments.find()` có data không?

---

**Cần help? Cho tôi biết:**
- ❌ Cái exact error message bạn thấy?
- ❌ Network tab status code là gì?
- ❌ Backend logs log gì?

