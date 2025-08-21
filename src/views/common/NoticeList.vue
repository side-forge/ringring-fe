<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '@/router'

// 페이징 관련
const currentPage = ref(1)
const itemsPerPage = 10

// 공지사항 목록 (더미 데이터 - 페이징 테스트를 위해 더 많이 생성)
const noticeList = ref([
  {
    id: 1,
    title: '시스템 점검 안내',
    date: '2024-01-15',
    views: 150
  },
  {
    id: 2,
    title: '새로운 기능 업데이트',
    date: '2024-01-10',
    views: 89
  },
  {
    id: 3,
    title: '연말연시 휴무 안내',
    date: '2023-12-20',
    views: 245
  },
  {
    id: 4,
    title: '보안 정책 변경 안내',
    date: '2023-12-15',
    views: 67
  },
  {
    id: 5,
    title: '서비스 이용약관 개정',
    date: '2023-12-01',
    views: 198
  },
  // 페이징 테스트를 위한 추가 더미 데이터
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    title: `공지사항 제목 ${i + 6}`,
    important: Math.random() > 0.7,
    date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    views: Math.floor(Math.random() * 300)
  }))
])

// 페이징 관련 computed
const totalPages = computed(() => {
  return Math.ceil(noticeList.value.length / itemsPerPage)
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return noticeList.value.slice(start, end)
})

const pageRange = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const range = 10

  let start = Math.floor((current - 1) / range) * range + 1
  let end = Math.min(start + range - 1, total)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 페이지 변경
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 이전/다음 10페이지 이동
const moveTenPages = (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    currentPage.value = Math.max(1, currentPage.value - 10)
  } else {
    currentPage.value = Math.min(totalPages.value, currentPage.value + 10)
  }
}

const canMoveTenPagesPrev = computed(() => {
  return currentPage.value > 10
})

const canMoveTenPagesNext = computed(() => {
  return currentPage.value + 10 <= totalPages.value
})

// 첫 페이지/마지막 페이지로 이동
const moveToEdge = (direction: 'first' | 'last') => {
  if (direction === 'first') {
    currentPage.value = 1
  } else {
    currentPage.value = totalPages.value
  }
}

// 공지사항 상세 페이지로 이동
const handleNoticeClick = (id: number) => {
  router.push(`/notices/${id}`)
}
</script>

<template>
  <div class="container">
    <main class="main-content">
      <!-- 공지사항 목록 -->
      <section class="card">
        <!-- 제목 -->
        <div style="margin-bottom: 20px;">
          <h3>공지사항</h3>
        </div>

        <div class="list-container">
          <div class="list-item header-row">
            <div class="col-check">번호</div>
            <div class="col-phone">제목</div>
            <div class="col-status">등록일</div>
            <div class="col-confidence">조회수</div>
          </div>

          <div
              v-for="notice in paginatedList"
              :key="notice.id"
              class="list-item data-row clickable-row"
              @click="handleNoticeClick(notice.id)"
          >
            <div class="col-check">{{ notice.id }}</div>
            <div class="col-phone">
              {{ notice.title }}
            </div>
            <div class="col-status">{{ notice.date }}</div>
            <div class="col-confidence">{{ notice.views }}</div>
          </div>
        </div>

        <!-- 페이징 중앙 배치 -->
        <div class="flex justify-center items-center gap-1 mt-4">
          <!-- 맨 처음으로 (<<) -->
          <button
              @click="moveToEdge('first')"
              :disabled="currentPage === 1"
              class="page-btn double"
              title="첫 페이지"
          >
            ≪
          </button>

          <!-- 이전 10페이지 (<) -->
          <button
              @click="moveTenPages('prev')"
              :disabled="!canMoveTenPagesPrev"
              class="page-btn single"
              title="이전 10페이지"
          >
            ‹
          </button>

          <!-- 페이지 번호들 -->
          <button
              v-for="page in pageRange"
              :key="page"
              @click="changePage(page)"
              :class="['page-btn', 'number', { active: currentPage === page }]"
          >
            {{ page }}
          </button>

          <!-- 다음 10페이지 (>) -->
          <button
              @click="moveTenPages('next')"
              :disabled="!canMoveTenPagesNext"
              class="page-btn single"
              title="다음 10페이지"
          >
            ›
          </button>

          <!-- 맨 끝으로 (>>) -->
          <button
              @click="moveToEdge('last')"
              :disabled="currentPage === totalPages"
              class="page-btn double"
              title="마지막 페이지"
          >
            ≫
          </button>
        </div>

        <!-- 페이지 정보 -->
        <div class="text-center mt-2">
          <span class="page-info">
            {{ currentPage }} / {{ totalPages }} 페이지
            (총 {{ noticeList.length }}개)
          </span>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
/* common.css에서 모든 스타일을 가져와서 사용 */
.card {
  position: relative;
}

/* 중요 뱃지 스타일 */
.important-badge {
  background: #dc3545;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 8px;
}

/* 공지사항 목록용 그리드 조정 (관리 컬럼 제거) */
.list-item {
  grid-template-columns: 80px 2fr 120px 100px;
}

/* 클릭 가능한 행 스타일 */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-row:hover {
  background: #f8f9fa !important;
}

/* 반응형 */
@media (max-width: 768px) {
  .list-item {
    grid-template-columns: 60px 2fr 100px;
    font-size: 0.9em;
  }

  .col-confidence {
    display: none;
  }
}
</style>