<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '@/router'

// 페이징 관련
const currentPage = ref(1)
const itemsPerPage = 10

// 등록된 공지사항 목록 (더미 데이터 - 페이징 테스트를 위해 더 많이 생성)
const noticeList = ref([
  {
    id: 1,
    title: '시스템 점검 안내',
    important: true,
    date: '2024-01-15',
    status: '게시중',
    views: 150
  },
  {
    id: 2,
    title: '새로운 기능 업데이트',
    important: false,
    date: '2024-01-10',
    status: '게시중',
    views: 89
  },
  {
    id: 3,
    title: '연말연시 휴무 안내',
    important: true,
    date: '2023-12-20',
    status: '게시종료',
    views: 245
  },
  {
    id: 4,
    title: '보안 정책 변경 안내',
    important: false,
    date: '2023-12-15',
    status: '게시중',
    views: 67
  },
  {
    id: 5,
    title: '서비스 이용약관 개정',
    important: true,
    date: '2023-12-01',
    status: '게시종료',
    views: 198
  },
  // 페이징 테스트를 위한 추가 더미 데이터
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    title: `공지사항 제목 ${i + 6}`,
    important: Math.random() > 0.7,
    date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    status: Math.random() > 0.3 ? '게시중' : '게시종료',
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

// 공지사항 추가 페이지로 이동 (NoticeForm.vue - 추가 모드)
const handleAddNotice = () => {
  router.push('/noticeForm')
}

// 공지사항 상세 페이지로 이동
const handleNoticeClick = (id: number) => {
  router.push(`/notices/${id}`)
}

// 공지사항 수정 페이지로 이동 (NoticeForm.vue - 수정 모드)
const editNotice = (id: number, event: Event) => {
  // 이벤트 전파 방지 (상세 페이지로 이동하지 않도록)
  event.stopPropagation()

  // 수정 페이지로 이동
  router.push(`/noticeForm`)
  console.log(`공지사항 ${id}번 수정`)
}

// 공지사항 삭제
const deleteNotice = (id: number, event: Event) => {
  // 이벤트 전파 방지 (상세 페이지로 이동하지 않도록)
  event.stopPropagation()

  if (confirm('이 공지사항을 삭제하시겠습니까?')) {
    noticeList.value = noticeList.value.filter(notice => notice.id !== id)

    // 삭제 후 현재 페이지에 데이터가 없으면 이전 페이지로 이동
    if (paginatedList.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
    }
  }
}
</script>

<template>
  <div class="container">
    <main class="main-content">
      <!-- 등록된 공지사항 목록 -->
      <section class="card">
        <!-- 제목과 추가 버튼 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3>등록된 공지사항</h3>
          <button @click="handleAddNotice" class="btn btn-primary">
            + 추가
          </button>
        </div>

        <div class="list-container">
          <div class="list-item header-row">
            <div class="col-check">번호</div>
            <div class="col-phone">제목</div>
            <div class="col-type">상태</div>
            <div class="col-status">등록일</div>
            <div class="col-confidence">조회수</div>
            <div class="col-actions">관리</div>
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
            <div class="col-type">
              <span :class="['status-badge', notice.status === '게시중' ? 'confirmed' : 'suspicious']">
                {{ notice.status }}
              </span>
            </div>
            <div class="col-status">{{ notice.date }}</div>
            <div class="col-confidence">{{ notice.views }}</div>
            <div class="col-actions">
              <button @click="editNotice(notice.id, $event)" class="action-btn edit">
                수정
              </button>
              <button @click="deleteNotice(notice.id, $event)" class="action-btn delete">
                삭제
              </button>
            </div>
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

/* 공지사항 목록용 그리드 조정 (관리 컬럼을 더 넓게) */
.list-item {
  grid-template-columns: 60px 2fr 100px 120px 80px 120px;
}

/* 클릭 가능한 행 스타일 */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-row:hover {
  background: #f8f9fa !important;
}

/* 관리 버튼들이 행 클릭을 방해하지 않도록 */
.col-actions {
  pointer-events: auto;
  display: flex;
  gap: 5px;
}

.action-btn {
  pointer-events: auto;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

/* 수정 버튼 스타일 */
.action-btn.edit {
  color: #0d6efd;
  border-color: #0d6efd;
  background: white;
}

.action-btn.edit:hover {
  background: #0d6efd;
  color: white;
}

/* 삭제 버튼 스타일 */
.action-btn.delete {
  color: #dc3545;
  border-color: #dc3545;
  background: white;
}

.action-btn.delete:hover {
  background: #dc3545;
  color: white;
}
</style>