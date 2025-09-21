// src/stores/auth.ts
import { defineStore } from 'pinia'

interface User {
    email: string;
    name: string;
    role: string;
    accountId: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null as User | null,
        accessToken: '',
        refreshToken: '',
    }),

    getters: {
        isAdmin: (state) => state.user?.role === 'ROLE_ADMIN',
        isUser: (state) => state.user?.role === 'ROLE_USER',
        userRole: (state) => state.user?.role || '',
    },

    actions: {
        login(loginData: {
            accessToken: string;
            refreshToken: string;
            email: string;
            name: string;
            role: string;
            accountId: string;
        }, keepLogin: boolean = false) {
            this.isLoggedIn = true;
            this.accessToken = loginData.accessToken;
            this.refreshToken = loginData.refreshToken;
            this.user = {
                email: loginData.email,
                name: loginData.name,
                role: loginData.role,
                accountId: loginData.accountId,
            };

            // 토큰 저장
            const storage = keepLogin ? localStorage : sessionStorage;
            storage.setItem('accessToken', loginData.accessToken);
            storage.setItem('refreshToken', loginData.refreshToken);
            storage.setItem('userInfo', JSON.stringify(this.user));
        },

        logout() {
            this.isLoggedIn = false;
            this.user = null;
            this.accessToken = '';
            this.refreshToken = '';

            // 토큰 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('userInfo');
        },

        // 페이지 새로고침시 상태 복원
        initializeAuth() {
            const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');

            if (accessToken && userInfo) {
                this.isLoggedIn = true;
                this.accessToken = accessToken;
                this.user = JSON.parse(userInfo);
            }
        }
    }
})