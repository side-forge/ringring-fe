// src/stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null as null | Record<string, any>,  // 타입 지정도 가능
    }),
    actions: {
        login(userData: Record<string, any>) {
            this.isLoggedIn = true
            this.user = userData
        },
        logout() {
            this.isLoggedIn = false
            this.user = null
        }
    }
})
