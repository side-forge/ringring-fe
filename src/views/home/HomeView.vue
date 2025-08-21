<script setup lang="ts">
import { computed } from 'vue'
// import { useAuthStore } from '@/stores/auth' // Pinia 사용 시
// import { mapGetters } from 'vuex' // Vuex 사용 시

// 컴포넌트 동적 import
// import GuestHome from './GuestHome.vue'
// import UserHome from './UserHome.vue'
import AdminHome from './AdminHome.vue'

// 인증 상태 관리
// const authStore = useAuthStore() // Pinia 사용 시
// const { isLoggedIn, userRole } = mapGetters('auth', ['isLoggedIn', 'userRole']) // Vuex 사용 시

// 현재 표시할 컴포넌트 결정 (일단 GuestHome만)
const currentComponent = computed(() => {
  // return GuestHome
  // return UserHome
  return AdminHome

  // 나중에 인증 기능 추가할 때 사용
  // if (!authStore.isLoggedIn) {
  //   return GuestHome
  // }

  // switch (authStore.userRole) {
  //   case 'admin':
  //     return AdminHome
  //   case 'manager':
  //     return AdminHome // 매니저도 관리자 화면 사용하거나 별도 컴포넌트 생성
  //   case 'user':
  //   default:
  //     return UserHome
  // }
})
</script>

<template>
  <div class="container">
    <!-- 동적 컴포넌트 렌더링 -->
    <component :is="currentComponent" />
  </div>
</template>

<style scoped>
/* 필요한 경우 HomeView 전용 스타일 */
</style>