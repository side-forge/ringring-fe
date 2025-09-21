// src/utils/tokenManager.ts
export const tokenManager = {
    // 토큰 저장
    setTokens(accessToken: string, refreshToken: string, keepLogin: boolean = false) {
        const storage = keepLogin ? localStorage : sessionStorage;
        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', refreshToken);
    },

    // 토큰 가져오기
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    },

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    },

    // 토큰 삭제 (로그아웃)
    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
    },

    // 토큰 존재 여부 확인
    hasToken(): boolean {
        return !!this.getAccessToken();
    }
};