<template>
  <div class="container-narrow">
    <!-- 첫 번째 영역: 개인정보 관리 -->
    <div class="card">
      <h3 class="mb-2">개인정보 관리</h3>
      <div class="flex flex-col gap-2">
        <input type="text" placeholder="이름" class="search-box" />
        <input type="text" placeholder="닉네임" class="search-box" />
        <input type="email" placeholder="이메일" class="search-box" />
        <input type="text" placeholder="핸드폰 번호" class="search-box" />

        <div class="flex gap-2 justify-center mt-2">
          <button class="btn">정보 변경</button>
          <button class="btn btn-danger">탈퇴 하기</button>
        </div>
      </div>
    </div>

    <!-- 두 번째 영역: 비밀번호 변경 -->
    <div class="card">
      <h3 class="mb-2">비밀번호 변경</h3>
      <div class="flex flex-col gap-2">
        <input type="password" placeholder="현재 비밀번호" class="search-box" />
        <input type="password" placeholder="새 비밀번호" class="search-box" />
        <input type="password" placeholder="새 비밀번호 확인" class="search-box" />

        <div class="flex justify-center mt-2">
          <button class="btn">비밀번호 변경</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MypageView",
};
</script>

<style scoped>
/* 위험한 액션 버튼 스타일 */
.btn-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-danger:hover {
  background: #dc3545;
  color: white;
}

/* 카드 간격 조정 */
.card + .card {
  margin-top: 30px;
}

/* 제목 스타일 */

</style>