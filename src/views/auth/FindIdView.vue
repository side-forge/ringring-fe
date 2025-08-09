<template>
  <div class="container-narrow">

    <div class="card flex flex-col gap-2">
      <input type="text" placeholder="핸드폰 번호" class="search-box" />
      <button class="btn">아이디 찾기</button>

      <div class="flex auth-line">
        <router-link to="/find-password">비밀번호 찾기</router-link>
        <router-link to="/register">회원 가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FindIdView",
};
</script>
