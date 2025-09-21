<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import ReportModal from '@/views/modal/ReportModal.vue'
import { userService } from "@/api/userService";

interface Props {
  showLogin?: boolean
}
const props = withDefaults(defineProps<Props>(), { showLogin: true })

// Pinia auth
const auth = useAuthStore()

// 새로고침 등으로 초기 렌더 시 상태 복원
onMounted(() => {
  if (!auth.isLoggedIn) auth.initializeAuth()
})

// 모달/메뉴 상태
const isReportModalOpen = ref(false)
const isMenuOpen = ref(false)

// 편의 computed
const isLoggedIn = computed(() => auth.isLoggedIn)
const isAdmin = computed(() => auth.isAdmin)
const isUser  = computed(() => auth.isUser)

// 라우팅/액션
const handleLogin = () => {
  router.push('/login')
}
const handleLogout = async () => {
  try {
    const response = await userService.logout();  // ✅ 파라미터 제거

    // 서버가 정상 응답(code 200 등)일 때만 실행
    if (response && response.status === 200) {
      auth.logout();
      router.push('/');
      isMenuOpen.value = false;
    } else {
      console.log('로그아웃 실패 응답:', JSON.stringify(response));
    }
  } catch (error) {
    console.error('로그아웃 오류:', error);
    alert('로그아웃 실패');
  }
};


const handleReportClick = () => {
  isReportModalOpen.value = true
  isMenuOpen.value = false
}
const handleNotificationClick = () => {
  router.push('/noticeReports')
  isMenuOpen.value = false
}
const handleMenuClick = (route: string) => {
  router.push(route)
  isMenuOpen.value = false
}
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="header">
    <router-link class="logo" to="/">Foobar</router-link>

    <!-- 비로그인 상태 -->
    <div v-if="!isLoggedIn" class="header-right">
      <div class="menu-dropdown" @click.stop>
        <button @click="toggleMenu" class="btn-icon">
          <img src="/src/assets/images/menulist.png" alt="메뉴" />
        </button>

        <div v-if="isMenuOpen" class="dropdown-menu">
          <button @click="handleMenuClick('/noticeList')" class="dropdown-item">
            공지사항
          </button>
        </div>
      </div>

      <router-link v-if="props.showLogin" to="/login" class="btn-icon">
        <img src="/src/assets/images/todologin.png" alt="로그인" />
      </router-link>
    </div>

    <!-- 로그인 상태: ROLE_USER -->
    <div v-else-if="isUser" class="header-right">
      <div class="menu-dropdown" @click.stop>
        <button @click="toggleMenu" class="btn-icon">
          <img src="/src/assets/images/menulist.png" alt="메뉴" />
        </button>

        <div v-if="isMenuOpen" class="dropdown-menu">
          <button @click="handleMenuClick('/noticeList')" class="dropdown-item">
            공지사항
          </button>
          <button @click="handleReportClick" class="dropdown-item">
            신고하기
          </button>
          <button @click="handleNotificationClick" class="dropdown-item">
            알림 전송
          </button>
          <button @click="handleMenuClick('/mypage')" class="dropdown-item">
            마이페이지
          </button>
          <button @click="handleLogout" class="dropdown-item">
            로그아웃
          </button>
        </div>
      </div>

      <router-link to="/mypage" class="btn-icon">
        <img src="/src/assets/images/login.png" alt="마이 페이지" />
      </router-link>
    </div>

    <!-- 로그인 상태: ROLE_ADMIN -->
    <div v-else-if="isAdmin" class="header-right">
      <div class="menu-dropdown" @click.stop>
        <button @click="toggleMenu" class="btn-icon">
          <img src="/src/assets/images/menulist.png" alt="메뉴" />
        </button>

        <div v-if="isMenuOpen" class="dropdown-menu">
          <button @click="handleMenuClick('/processingStatusView')" class="dropdown-item">
            처리현황
          </button>
          <button @click="handleMenuClick('/noticeAdminList')" class="dropdown-item">
            공지사항
          </button>
          <button @click="handleMenuClick('/mypage')" class="dropdown-item">
            마이페이지
          </button>
          <button @click="handleLogout" class="dropdown-item">
            로그아웃
          </button>
        </div>
      </div>

      <router-link to="/mypage" class="btn-icon">
        <img src="/src/assets/images/login.png" alt="마이 페이지" />
      </router-link>
    </div>

    <!-- 외부 클릭 감지를 위한 오버레이 -->
    <div v-if="isMenuOpen" @click="closeMenu" class="menu-overlay"></div>

    <!-- 신고하기 모달 -->
    <ReportModal v-model="isReportModalOpen" />
  </header>
</template>

<style scoped>
/* common.css에서 모든 스타일을 가져와서 사용 */

/* 드롭다운 메뉴 관련 스타일 */
.menu-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 120px;
  margin-top: 8px;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  color: inherit;
  text-decoration: none;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>