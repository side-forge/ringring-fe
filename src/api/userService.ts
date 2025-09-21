// src/api/userService.ts
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const userService = {
    // 이메일 중복 체크
    async checkEmailAvailability(email: string) {
        return await apiClient.post(
            API_ENDPOINTS.USERS.IDENTIFIER_AVAILABILITY,
            { type: 'email', value: email }
        );
    },

    // 이메일 인증 코드 발송
    async sendVerificationCode(email: string) {
        return await apiClient.post(
            API_ENDPOINTS.USERS.VERIFY_EMAIL_REQUEST,
            { email }
        );
    },

    // ✅ 이메일 인증 코드 검증
    // 백엔드 스펙이 { email, code } 라 가정 (필요시 key만 바꾸면 됨)
    async verifyEmailCode(email: string, code: string) {
        return await apiClient.post(
            API_ENDPOINTS.USERS.VERIFY_EMAIL_CONFIRM,
            { email, code }
        );
    },

    // ✅ 회원가입
    async signup(data: {
        email: string;
        password: string;
        name: string;
        nickname: string;
        phoneNumber: string;
    }) {
        return await apiClient.post(API_ENDPOINTS.USERS.SIGNUP, data);
    },

    async login(loginData: { id: string; password: string }) {
        return await apiClient.post(API_ENDPOINTS.USERS.LOGIN, loginData);
    },

    async logout() {
        const token =
            localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

        return await apiClient.post(
            API_ENDPOINTS.USERS.LOGOUT,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },
};
