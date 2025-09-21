<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'

// 코드 스플리팅(선택)
const GuestHome = defineAsyncComponent(() => import('./GuestHome.vue'))
const UserHome  = defineAsyncComponent(() => import('./UserHome.vue'))
const AdminHome = defineAsyncComponent(() => import('./AdminHome.vue'))

const auth = useAuthStore()

// 새로고침 시 저장소 복원
onMounted(() => {
  auth.initializeAuth()
})

/**
 * 역할 기반 컴포넌트 선택
 * - 미로그인: GuestHome
 * - ROLE_ADMIN: AdminHome
 * - ROLE_USER: UserHome
 * - 그 외: GuestHome
 */
const currentComponent = computed(() => {
  if (!auth.isLoggedIn || !auth.user) return GuestHome
  if (auth.isAdmin) return AdminHome
  if (auth.isUser)  return UserHome
  return GuestHome
})
</script>

<template>
  <div class="container">
    <Suspense>
      <component :is="currentComponent" />
      <template #fallback>
        <div style="padding:24px">로딩 중…</div>
      </template>
    </Suspense>
  </div>
</template>
