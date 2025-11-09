# 🔧 Setup Scripts - Tự Động Cài Đặt

Có 2 script tự động để giúp bạn cài đặt ứng dụng dễ hơn.

---

## 🖥️ Cho Windows

### Cách 1: Double-click (Dễ Nhất)
```
Vào folder project → Double-click setup.bat
```

### Cách 2: Command Prompt
```cmd
cd C:\Users\YourUsername\Downloads\SWD\image-sharing-system
setup.bat
```

### Cách 3: PowerShell
```powershell
cd C:\Users\YourUsername\Downloads\SWD\image-sharing-system
.\setup.bat
```

---

## 🐧 Cho Linux/Mac

### Cách 1: Terminal
```bash
cd ~/Downloads/SWD/image-sharing-system
bash setup.sh
```

### Cách 2: Make it executable (First time only)
```bash
chmod +x setup.sh
./setup.sh
```

---

## 📋 Script Làm Gì?

✅ Kiểm tra Node.js & npm  
✅ Cài đặt frontend dependencies  
✅ Cài đặt backend dependencies  
✅ Tạo .env files  
✅ Hướng dẫn chạy ứng dụng  

---

## 🚀 Sau Khi Setup

Script sẽ hướng dẫn bạn:

### Bước 1: Install json-server (lần đầu)
```bash
npm install -g json-server
```

### Bước 2: Mở 3 Terminals

**Terminal 1** - JSON Server:
```bash
json-server --watch database.json --port 5000
```

**Terminal 2** - Backend:
```bash
cd server
npm run dev
```

**Terminal 3** - Frontend:
```bash
npm start
```

### Bước 3: Visit
```
http://localhost:3000
```

---

## ⚙️ .env Configuration

Script sẽ tạo 2 file .env:

### `server/.env` (Backend)
```
PORT=4000
JWT_SECRET=your_jwt_secret_key_change_this
MONGODB_URI=mongodb://localhost:27017/image-sharing-system
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@imagesite.com
CLIENT_URL=http://localhost:3000
```

**⚠️ Cần cập nhật**:
- `JWT_SECRET` - Thay đổi thành key khác
- `MONGODB_URI` - Nếu dùng Atlas cloud
- `EMAIL_*` - Nếu muốn dùng email reset password

### `.env` (Frontend)
```
REACT_APP_API_URL=http://localhost:4000/api
```

---

## ❓ Vấn Đề Thường Gặp

### "Node.js not found"
- [ ] Cài Node.js từ https://nodejs.org
- [ ] Restart terminal
- [ ] Try script lại

### "Permission denied" (Mac/Linux)
```bash
chmod +x setup.sh
./setup.sh
```

### Dependencies không cài
- [ ] Xóa `node_modules` folders
- [ ] Xóa `package-lock.json`
- [ ] Run script lại

### Port bị dùng
- Thay đổi port trong command:
```bash
# JSON Server port 5001
json-server --watch database.json --port 5001

# Backend port 4001 (update server/.env)
PORT=4001
```

---

## 📝 Manual Setup (Không Dùng Script)

Nếu script không work, làm manual:

```bash
# Install dependencies
npm install
cd server
npm install
cd ..

# Create .env files (xem mẫu ở trên)

# Terminal 1
json-server --watch database.json --port 5000

# Terminal 2
cd server && npm run dev

# Terminal 3
npm start
```

---

## ✅ Kiểm Tra

Sau khi setup, check:

- [ ] Port 5000: http://localhost:5000/pictures
- [ ] Port 4000: http://localhost:4000/api/health
- [ ] Port 3000: http://localhost:3000

Nếu tất cả green → Ready! 🎉

---

**Đơn giản hơn không thể! 🚀**

