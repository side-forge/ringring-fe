export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL,
    PREFIX: import.meta.env.VITE_API_PREFIX || '/api/v1',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
} as const;

export const API_ENDPOINTS = {
    USERS: {
        IDENTIFIER_AVAILABILITY: `${API_CONFIG.PREFIX}/users/identifier/availability`,
        VERIFY_EMAIL_REQUEST: `${API_CONFIG.PREFIX}/users/email/verifications`,
        VERIFY_EMAIL_CONFIRM: `${API_CONFIG.PREFIX}/users/email/verifications/confirm`,
        SIGNUP: `${API_CONFIG.PREFIX}/dev/users/signup`,
        LOGIN: `${API_CONFIG.PREFIX}/auth/login`,
        LOGOUT: `${API_CONFIG.PREFIX}/auth/logout`,
    },
} as const;