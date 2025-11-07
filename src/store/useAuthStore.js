import { create } from 'zustand';
import toast from 'react-hot-toast';
import { users as seedUsers } from '../data/users';


export const useAuthStore = create((set, get) => ({
  authUser: JSON.parse(localStorage.getItem('auth-user')) || null,
  isAuthenticated: false,

  login: (email, password) => {
    try {
      const user = seedUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        toast.error('Email hoặc mật khẩu không đúng!');
        return false;
      }
      if (user.status !== 'active') {
        toast.error('Tài khoản của bạn đã bị khóa!');
        return false;
      }
      const authUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      };

      set({ authUser, isAuthenticated: true });
      localStorage.setItem('auth-user', JSON.stringify(authUser));
      toast.success('Đăng nhập thành công!');

      return true;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập!');
      return false;
    }
  },

  // Đăng ký
  register: (userData) => {
    try {
      const newUser = {
        id: seedUsers.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'user',
        status: 'active',
        created_at: new Date().toISOString(),
        avatar_url: `https://i.pravatar.cc/150?img=${
          Math.floor(Math.random() * 70) + 1
        }`,
      };
      const authUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar_url: newUser.avatar_url,
      };
      set({ authUser, isAuthenticated: true });
      localStorage.setItem('auth-user', JSON.stringify(authUser));
      toast.success('Đăng ký thành công!');
      return true;
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      toast.error('Có lỗi xảy ra khi đăng ký!');
      return false;
    }
  },

  logout: () => {
    set({ authUser: null, isAuthenticated: false });
    localStorage.removeItem('auth-user');
    toast.success('Đã đăng xuất!');
  },
}));
