<script setup lang="ts">

  import { useAuthStore } from '@/stores/auth'
  const auth = useAuthStore()


  import AppHeader from '@/components/common/AppHeader.vue'  // ← 이거 꼭 추가!
  import AppFooter from '@/components/common/AppFooter.vue'  // 만약 푸터도 있다면

</script>

<template>
  <AppHeader :isLoggedIn="auth.isLoggedIn" />

  <main>
    <router-view />
  </main>

  <AppFooter />
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
