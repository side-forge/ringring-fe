<template>
  <div class="container-narrow">
    <div class="card flex flex-col gap-2">
      <input type="text" placeholder="이름" class="search-box" />
      <input type="text" placeholder="닉네임" class="search-box" />
      <input type="password" placeholder="1차 비밀번호" class="search-box" />
      <input type="password" placeholder="2차 비밀번호" class="search-box" />
      <input type="email" placeholder="이메일" class="search-box" />

      <div class="flex gap-1 verification-row">
        <input type="text" placeholder="인증 코드" class="search-box flex-input" />
        <button class="btn verification-btn">인증 코드 보내기</button>
      </div>

      <input type="text" placeholder="핸드폰 번호" class="search-box" />

      <button class="btn mt-2">가입 하기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
};
</script>

<style scoped>
/* 인증 코드 영역 스타일 */
.verification-row {
  align-items: stretch;
}

.flex-input {
  flex: 1;
  min-width: 0; /* flex item이 축소될 수 있도록 */
}

.verification-btn {
  white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */
  flex-shrink: 0; /* 버튼이 축소되지 않도록 */
  min-width: fit-content; /* 콘텐츠에 맞는 최소 너비 */
  padding: 10px 16px; /* 패딩 조정으로 더 컴팩트하게 */
}

/* 반응형 디자인 - 작은 화면에서 세로 배치 */
@media (max-width: 768px) {
  .verification-row {
    flex-direction: column;
  }

  .verification-btn {
    margin-top: 10px;
  }
}
</style>