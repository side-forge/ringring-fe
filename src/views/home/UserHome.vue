<script setup lang="ts">
import SearchBar from '@/components/common/SearchBar.vue'
import { ref } from 'vue'

// 검색 상태 관리
const hasSearched = ref(false)
const searchQuery = ref('')
const attachedFileName = ref('')

// 검색 결과 데이터 (임시)
const searchResult = ref({
  phoneNumber: '',
  status: '보류',
  viewCount: 222
})

const handleAttachFile = () => {
  // 파일 첨부 로직
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      attachedFileName.value = file.name
      console.log('첨부된 파일:', file.name)
    }
  }
  input.click()
}

const handleSendMail = () => {
  // 메일 전송 로직
  alert(`"${searchQuery.value}" 검색 결과를 메일로 전송합니다.`)
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  searchResult.value.phoneNumber = query
  hasSearched.value = true
  // 파일명 초기화
  attachedFileName.value = ''
  console.log(`"${query}"를 검색합니다.`)
}
</script>

<template>
  <main class="main-content">
    <SearchBar @search="handleSearch" />

    <!-- 검색 섹션 -->
    <section class="card text-center">
      <div v-if="!hasSearched">
        <h2>번호를 검색해주세요</h2>
        <p>의심스러운 전화번호를 검색하여 피싱 여부를 확인하세요</p>
      </div>

      <!-- 검색 결과 표시 -->
      <div v-if="hasSearched" class="search-result-container fade-in">
        <!-- 액션 버튼들 -->
        <div class="action-icons">
          <input
              type="text"
              class="file-name-input"
              :value="attachedFileName"
              readonly
          />
          <button @click="handleAttachFile" class="icon-btn">
            <img src="/src/assets/images/attch_file.png" alt="파일 첨부" />
          </button>
          <button @click="handleSendMail" class="icon-btn">
            <img src="/src/assets/images/send_mail.png" alt="메일 전송" />
          </button>
        </div>

        <!-- 왼쪽: 검색 결과 정보 -->
        <div class="result-info">
          <div class="info-item">
            <span class="info-label">전화번호 :</span>
            <span class="info-value">{{ searchResult.phoneNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status :</span>
            <span class="info-value">{{ searchResult.status }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">조회 수 :</span>
            <span class="info-value">{{ searchResult.viewCount }}</span>
          </div>
        </div>

        <!-- 오른쪽 상단: 액션 버튼과 파일명 -->
        <div class="action-area">
          <!-- 파일명 표시 텍스트박스 -->
          <input
              v-if="attachedFileName"
              type="text"
              class="file-name-box"
              :value="attachedFileName"
              readonly
          />
        </div>
      </div>
    </section>

    <!-- 슬라이더 섹션 - 나중에 구현 -->
    <section class="card">
      <div class="placeholder-box">
        <p class="placeholder-text">슬라이더 영역</p>
      </div>
    </section>

    <!-- 차트 섹션 - 검색 상태에 따라 제목 변경 -->
    <section class="card">
      <h3>{{ hasSearched ? '투표 상태' : '신고 현황 추이' }}</h3>
      <div class="placeholder-box">
        <p class="placeholder-text">{{ hasSearched ? '투표' : '차트' }} 영역</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* 이 페이지에만 필요한 스타일 */
.card {
  position: relative;
}
</style>