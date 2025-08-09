<script setup lang="ts">
// Props 정의 (옵션)
import router from "@/router";

interface Props {
  showLogin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLogin: true
})

// 로그인 버튼 클릭 핸들러
const handleLogin = () => {
  console.log('Login clicked')
  // 로그인 로직 구현
}

</script>

<template>
  <header class="header">
    <router-link class="logo" to="/">Foobar</router-link>
<!--    <div class="logo" @click="handleHome">Foobar</div>-->
    <router-link class="header-right" to="/login">
      <div class="btn-icon">
        <img src="/src/assets/images/todologin.png" alt="로그인" />
      </div>
    </router-link>
  </header>
</template>

<style>
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* btn-icon 내부 이미지 스타일 */
.btn-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 480px) {
  .header-right {
    order: -1;
    align-self: flex-end;
  }
}
</style>