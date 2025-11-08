import { create } from 'zustand';
import toast from 'react-hot-toast';
import { persist } from 'zustand/middleware';
import axiosInstance from '../lib/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (formData) => {
        try {
          const response = await axiosInstance.post('/auth/login', formData);
          if (response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            });
            toast.success('Đăng nhập thành công!');
            return { success: true, data: response.data };
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
          );
          return { success: false, data: null };
        }
      },
      register: async (formData) => {
        try {
          const response = await axiosInstance.post('/auth/register', formData);
          if (response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            });
            toast.success('Đăng ký thành công!');
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
          );
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Đăng xuất thành công!');
      },

      forgotPassword: async (email) => {
        try {
          const response = await axiosInstance.post('/auth/forgot-password', {
            email,
          });
          if (response.data) {
            toast.success('Email khôi phục mật khẩu đã được gửi!');
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
          toast.error(errorMessage);
          throw error;
        }
      },

      resetPassword: async (token, email, password, confirmPassword) => {
        try {
          const response = await axiosInstance.put(
            `/auth/reset-password?token=${token}&email=${encodeURIComponent(
              email
            )}`,
            { password, confirmPassword }
          );
          if (response.data) {
            toast.success('Đặt lại mật khẩu thành công!');
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
          toast.error(errorMessage);
          throw error;
        }
      },
      // Initialize auth state (gọi khi app khởi động)
      initializeAuth: () => {
        const { token, user } = get();
        if (token && user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-data',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
