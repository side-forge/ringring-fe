<template>
  <div class="container-narrow">
    <div class="card flex flex-col gap-2">
      <input type="email" placeholder="이메일 주소" class="search-box" />
      <input type="text" placeholder="핸드폰 번호" class="search-box" />
      <button class="btn">임시 비밀번호 발급</button>

      <div class="flex auth-line">
        <router-link to="/find-id">아이디 찾기</router-link>
        <router-link to="/register">회원 가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FindPasswordView",
};
</script>
