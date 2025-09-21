<template>
  <div class="container-narrow">
    <div class="card flex flex-col gap-2">
        <input v-model="form.name" type="text" placeholder="이름" class="search-box" />


      <input v-model="form.nickname" type="text" placeholder="닉네임" class="search-box" />
      <input v-model="form.password1" type="password" placeholder="1차 비밀번호" class="search-box" />
      <input v-model="form.password2" type="password" placeholder="2차 비밀번호" class="search-box" />

      <!-- 이메일 입력: ref로 포커스 주기 -->
      <div class="flex gap-1 verification-row">
        <input  ref="emailInputRef"  v-model="form.email" type="email" placeholder="이메일" class="search-box" @input="resetEmailCheck"/>
        <button class="btn verification-btn" @click="checkDuplicationEmail">
          아이디 중복 체크
        </button>
      </div>

      <div class="flex gap-1 verification-row">
        <input v-model="form.verificationCode" type="text" placeholder="인증 코드" class="search-box flex-input" />
        <button class="btn verification-btn" @click="sendVerificationCode">
          인증 코드 보내기
        </button>
      </div>

      <input v-model="form.phoneNumber" type="text" placeholder="핸드폰 번호" class="search-box" />

      <button class="btn mt-2" @click="register">
        가입 하기
      </button>

      <!-- 상태 라벨 (선택) -->
      <p v-if="emailChecked" style="margin-top:8px">
        <span v-if="emailUsable" style="color:#2e7d32">사용 가능한 아이디(이메일)입니다.</span>
        <span v-else style="color:#c62828">사용 불가능한 아이디(이메일)입니다.</span>
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { userService } from "@/api/userService";

export default {
  name: "RegisterView",
  setup() {
    const router = useRouter();

    const form = reactive({
      name: "",
      nickname: "",
      password1: "",
      password2: "",
      email: "",
      phoneNumber: "",
      verificationCode: "",
    });

    const emailInputRef = ref(null);
    const codeInputRef = ref(null);   // ✅ 인증코드 포커스용

    // 이메일 중복 체크 상태
    const emailChecked = ref(false);
    const emailUsable = ref(false);

    const resetEmailCheck = () => {
      emailChecked.value = false;
      emailUsable.value = false;
    };

    const checkDuplicationEmail = async () => {
      if (!form.email) {
        alert("이메일을 입력해주세요.");
        emailInputRef.value?.focus();
        return;
      }
      try {
        const res = await userService.checkEmailAvailability(form.email);
        const ok = res?.data?.code === "2000";
        const usable = !!res?.data?.data?.usable;

        emailChecked.value = true;
        emailUsable.value = usable;

        if (!ok) {
          alert("중복 체크 처리 중 오류가 발생했습니다.");
          return;
        }
        if (usable) {
          alert("사용 가능한 아이디(이메일)입니다.");
        } else {
          alert("사용 불가능한 아이디(이메일)입니다. 다른 이메일을 입력해주세요.");
          emailInputRef.value?.focus();
        }
      } catch (err) {
        console.error(err);
        alert("중복 체크 실패: " + (err.response?.data?.message || "알 수 없는 오류"));
      }
    };

    const sendVerificationCode = async () => {
      if (!emailChecked.value) {
        alert("이메일 중복 체크를 먼저 해주세요.");
        emailInputRef.value?.focus();
        return;
      }
      if (!emailUsable.value) {
        alert("사용 불가능한 이메일입니다. 다른 이메일을 입력해주세요.");
        emailInputRef.value?.focus();
        return;
      }
      try {
        await userService.sendVerificationCode(form.email);
        alert("인증 코드가 전송되었습니다.");
        codeInputRef.value?.focus();
      } catch (err) {
        console.error(err);
        alert("인증 코드 전송 실패: " + (err.response?.data?.message || "알 수 없는 오류"));
      }
    };

    const register = async () => {
      // 1) 이메일 체크 선행
      if (!emailChecked.value) {
        alert("이메일 중복 체크를 먼저 해주세요.");
        emailInputRef.value?.focus();
        return;
      }
      if (!emailUsable.value) {
        alert("사용 불가능한 이메일입니다. 다른 이메일을 입력해주세요.");
        emailInputRef.value?.focus();
        return;
      }

      // 2) 비밀번호 확인
      if (form.password1 !== form.password2) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 3) 인증코드 검증 (✅ 핵심)
      if (!form.verificationCode) {
        alert("인증 코드를 입력해주세요.");
        codeInputRef.value?.focus();
        return;
      }
      try {
        const vres = await userService.verifyEmailCode(form.email, form.verificationCode);
        const vok  = vres?.data?.code === "2000";
        // vres가 200이어도 code체계가 다르면 아래 조건을 조정
        if (!vok) {
          alert("인증 코드 검증에 실패했습니다.");
          codeInputRef.value?.focus();
          return;
        }
      } catch (err) {
        console.error(err);
        alert("인증 코드 검증 실패: " + (err.response?.data?.message || "알 수 없는 오류"));
        codeInputRef.value?.focus();
        return;
      }

      // 4) 가입 요청 — 요청 스펙 그대로 전송
      const userData = {
        email: form.email,
        password: form.password1,
        name: form.name,
        nickname: form.nickname,
        phoneNumber: form.phoneNumber,
      };

      try {
        await userService.signup(userData);
        alert("회원가입 성공!");
        router.push("/login");
      } catch (err) {
        console.error(err);
        alert("회원가입 실패: " + (err.response?.data?.message || "알 수 없는 오류"));
      }
    };

    return {
      form,
      emailInputRef,
      codeInputRef,
      emailChecked,
      emailUsable,
      resetEmailCheck,
      checkDuplicationEmail,
      sendVerificationCode,
      register,
    };
  },
};
</script>

<style scoped>
/* 인증 코드 영역 스타일 */
.verification-row {
  align-items: stretch;
}

.flex-input {
  flex: 1;
  min-width: 0;
}

.verification-btn {
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;
  padding: 10px 16px;
}

@media (max-width: 768px) {
  .verification-row {
    flex-direction: column;
  }

  .verification-btn {
    margin-top: 10px;
  }
}
</style>
