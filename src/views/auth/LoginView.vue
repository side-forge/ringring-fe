<template>
  <div class="container-narrow">
    <div class="card flex flex-col gap-2">
      <input v-model="form.email" type="text" placeholder="아이디 입력" class="search-box" />
      <input v-model="form.password" type="password" placeholder="비밀번호 입력" class="search-box" />

      <div class="flex items-center gap-1 checkbox-wrapper">
        <input v-model="keepLogin" type="checkbox" id="keepLogin" class="custom-checkbox-input" />
        <label for="keepLogin" class="custom-checkbox-label">로그인 유지</label>
      </div>

      <button class="btn" @click="login">로 그 인</button>

      <div class="flex auth-line">
        <router-link to="/find-id">아이디 찾기</router-link>
        <router-link to="/find-password">비밀번호 찾기</router-link>
        <router-link to="/register">회원 가입</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { userService } from "@/api/userService";
import { handleApiError } from "@/utils/errorHandler";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/auth";


const router = useRouter();
const keepLogin = ref(false); // 체크박스 상태

const authStore = useAuthStore();

const form = reactive({
  id: "",
  password: "",
});

const login = async () => {
  if (!form.email || !form.password) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  try {
    const response = await userService.login({
      email: form.email,
      password: form.password
    });

    // 성공 응답 처리
    if (response.data.code === "2000") {
      const { accessToken, refreshToken } = response.data.data;

      const decoded = jwtDecode(accessToken);

      // Pinia store에 로그인 정보 저장
      authStore.login(
          {
            accessToken,
            refreshToken,
            email: decoded.email,
            name: decoded.name || "", // 토큰에 name이 없으면 백엔드에서 넣어주거나 빈 문자열 처리
            role: decoded.roles,      // 여기서 ROLE_USER / ROLE_ADMIN 들어옴
            accountId: decoded.sub,
          },
          keepLogin.value
      );

      // 로그인 유지 여부에 따른 토큰 저장
      if (keepLogin.value) {
        // 로그인 유지: localStorage (브라우저 종료해도 유지)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        // 일반 로그인: sessionStorage (브라우저 종료시 삭제)
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      alert("로그인 성공!");
      router.push("/");
    }

  } catch (err: any) {
    const errorMessage = handleApiError(err);
    alert(errorMessage);
    console.error('Login error:', err);
  }
};
</script>