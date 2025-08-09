<template>
  <div class="container-narrow">
    <div class="card flex flex-col gap-2">
      <input type="text" placeholder="아이디 입력" class="search-box" />
      <input type="password" placeholder="비밀번호 입력" class="search-box" />

      <div class="flex items-center gap-1 checkbox-wrapper">
        <input type="checkbox" id="keepLogin" class="custom-checkbox-input" />
        <label for="keepLogin" class="custom-checkbox-label">로그인 유지</label>
      </div>

      <button class="btn">로 그 인</button>

      <div class="flex auth-line">
        <router-link to="/find-id">아이디 찾기</router-link>
        <router-link to="/find-password">비밀번호 찾기</router-link>
        <router-link to="/register">회원 가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
};
</script>

<style scoped>
/* 체크박스 커스터마이징 */
.checkbox-wrapper {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin: 0;
}

.custom-checkbox-input:hover {
  border-color: #000;
}

.custom-checkbox-input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.custom-checkbox-input:checked {
  background: #000;
  border-color: #000;
}

.custom-checkbox-input:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}

.custom-checkbox-label {
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  margin-left: 2px;
}

.custom-checkbox-label:hover {
  color: #000;
}
</style>