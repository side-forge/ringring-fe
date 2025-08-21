<script setup lang="ts">
import { ref } from 'vue'
import router from "@/router"
import ReportModal from '@/views/modal/ReportModal.vue'

// Props 정의 (옵션)
interface Props {
  showLogin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLogin: true
})

// 모달 상태 관리
const isReportModalOpen = ref(false)

// 드롭다운 메뉴 상태
const isMenuOpen = ref(false)

// 로그인 버튼 클릭 핸들러
const handleLogin = () => {
  console.log('Login clicked')
  // 로그인 로직 구현
}

// 신고하기 버튼 클릭 핸들러 (register.png 아이콘)
const handleReportClick = () => {
  isReportModalOpen.value = true
  isMenuOpen.value = false // 드롭다운 닫기
}

// 알림 전송 클릭 핸들러
const handleNotificationClick = () => {
  router.push('/noticeReports')
  isMenuOpen.value = false // 드롭다운 닫기
}

// 메뉴 토글
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 메뉴 항목 클릭 핸들러
const handleMenuClick = (route: string) => {
  router.push(route)
  isMenuOpen.value = false
}

// 외부 클릭 시 메뉴 닫기
const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="header">
    <router-link class="logo" to="/">Foobar</router-link>

    <!-- 비로그인 상태 -->
<!--          <div class="header-right">-->

<!--                  <div class="menu-dropdown" @click.stop>-->
<!--                    <button @click="toggleMenu" class="btn-icon">-->
<!--                      <img src="/src/assets/images/menulist.png" alt="메뉴" />-->
<!--                    </button>-->

<!--                    &lt;!&ndash; 드롭다운 메뉴 &ndash;&gt;-->
<!--                    <div v-if="isMenuOpen" class="dropdown-menu">-->
<!--                      <button @click="handleMenuClick('/noticeList')" class="dropdown-item">-->
<!--                        공지사항-->
<!--                      </button>-->
<!--                    </div>-->
<!--                  </div>-->

<!--          <router-link to="/login">-->
<!--            <div class="btn-icon">-->
<!--              <img src="/src/assets/images/todologin.png" alt="로그인" />-->
<!--            </div>-->
<!--          </router-link>-->
<!--          </div>-->

    <!-- 로그인 상태 -->
<!--    <div class="header-right">-->

<!--      <div class="menu-dropdown" @click.stop>-->
<!--        <button @click="toggleMenu" class="btn-icon">-->
<!--          <img src="/src/assets/images/menulist.png" alt="메뉴" />-->
<!--        </button>-->

<!--        &lt;!&ndash; 드롭다운 메뉴 &ndash;&gt;-->
<!--        <div v-if="isMenuOpen" class="dropdown-menu">-->
<!--          <button @click="handleMenuClick('/noticeList')" class="dropdown-item">-->
<!--            공지사항-->
<!--          </button>-->
<!--          <button @click="handleReportClick" class="dropdown-item">-->
<!--            신고하기-->
<!--          </button>-->
<!--          <button @click="handleNotificationClick" class="dropdown-item">-->
<!--            알림 전송-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 마이페이지 버튼 &ndash;&gt;-->
<!--      <router-link to="/mypage" class="btn-icon">-->
<!--        <img src="/src/assets/images/login.png" alt="마이 페이지" />-->
<!--      </router-link>-->
<!--    </div>-->

<!--    &lt;!&ndash; 신고하기 모달 &ndash;&gt;-->
<!--    <ReportModal v-model="isReportModalOpen" />-->

    <!--     관리자   -->
        <div class="header-right">
          <!-- 메뉴 드롭다운 -->
          <div class="menu-dropdown" @click.stop>
            <button @click="toggleMenu" class="btn-icon">
              <img src="/src/assets/images/menulist.png" alt="메뉴" />
            </button>

            <!-- 드롭다운 메뉴 -->
            <div v-if="isMenuOpen" class="dropdown-menu">
              <button @click="handleMenuClick('/processingStatusView')" class="dropdown-item">
                처리현황
              </button>
              <button @click="handleMenuClick('/noticeAdminList')" class="dropdown-item">
                공지사항
              </button>
            </div>
          </div>

          <router-link to="/mypage" class="btn-icon">
            <img src="/src/assets/images/login.png" alt="마이 페이지" />
          </router-link>
        </div>

    <!-- 외부 클릭 감지를 위한 오버레이 -->
    <div v-if="isMenuOpen" @click="closeMenu" class="menu-overlay"></div>
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