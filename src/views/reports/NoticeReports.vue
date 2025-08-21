<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'

// 검색 관련
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// 정렬 관련
const sortField = ref('')
const sortOrder = ref('asc') // 'asc' 또는 'desc'

// 더미 데이터 - 실제로는 API에서 가져올 데이터 (50개로 증가)
const notificationList = ref([
  { id: 1, phoneNumber: '010-3733-7202', type: '리딩방', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 2, phoneNumber: '010-1234-5678', type: '스팸', status: '확인', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 3, phoneNumber: '010-9876-5432', type: '보이스피싱', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 4, phoneNumber: '010-5555-1234', type: '사기', status: '확인', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 5, phoneNumber: '010-7777-8888', type: '리딩방', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 6, phoneNumber: '010-1111-2222', type: '스팸', status: '확인', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 7, phoneNumber: '010-3333-4444', type: '보이스피싱', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 8, phoneNumber: '010-5555-6666', type: '사기', status: '확인', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 9, phoneNumber: '010-7777-9999', type: '리딩방', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 10, phoneNumber: '010-1010-2020', type: '스팸', status: '확인', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 11, phoneNumber: '010-3030-4040', type: '보이스피싱', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 12, phoneNumber: '010-5050-6060', type: '사기', status: '확인', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 13, phoneNumber: '010-7070-8080', type: '리딩방', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 14, phoneNumber: '010-9090-1010', type: '스팸', status: '확인', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  { id: 15, phoneNumber: '010-2020-3030', type: '보이스피싱', status: '의심', isChecked: false, suspiciousProcessed: false, confirmedProcessed: false },
  // ... 더 많은 데이터 (총 50개)
  ...Array.from({ length: 35 }, (_, i) => ({
    id: i + 16,
    phoneNumber: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    type: ['스팸', '보이스피싱', '사기', '리딩방'][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.5 ? '의심' : '확인',
    isChecked: false,
    suspiciousProcessed: false,
    confirmedProcessed: false
  }))
])

// 검색 기능
const filteredList = computed(() => {
  let result = notificationList.value

  // 검색 필터링
  if (searchQuery.value) {
    result = result.filter(item =>
        item.phoneNumber.includes(searchQuery.value) ||
        item.type.includes(searchQuery.value)
    )
  }

  // 정렬
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      let aValue = a[sortField.value]
      let bValue = b[sortField.value]

      // 상태의 경우 정렬 순서를 정의 (의심 -> 확인 순서)
      if (sortField.value === 'status') {
        const statusOrder = { '의심': 0, '확인': 1 }
        aValue = statusOrder[aValue]
        bValue = statusOrder[bValue]
      }

      if (sortOrder.value === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }

  return result
})

// 페이징 관련
const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / itemsPerPage)
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredList.value.slice(start, end)
})

// 페이지 범위 계산 (1-10 표시)
const pageRange = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const range = 10

  let start = Math.floor((current - 1) / range) * range + 1
  let end = Math.min(start + range - 1, total)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// SearchBar에서 온 검색 처리
const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
  console.log('검색:', query)
}

// 정렬 기능
const handleSort = (field: string) => {
  if (sortField.value === field) {
    // 같은 필드 클릭 시 정렬 순서 토글
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 다른 필드 클릭 시 새로운 필드로 오름차순 정렬
    sortField.value = field
    sortOrder.value = 'asc'
  }
  currentPage.value = 1 // 정렬 시 첫 페이지로 이동
}

// 정렬 아이콘 표시 여부
const getSortIcon = (field: string) => {
  if (sortField.value !== field) return '▼' // 정렬 가능함을 표시
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

// 페이지 변경
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 이전/다음 10페이지 이동 (완전히 새로 작성된 로직)
const moveTenPages = (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    // 이전 10페이지: 현재 페이지에서 10을 빼되, 최소 1페이지
    currentPage.value = Math.max(1, currentPage.value - 10)
  } else {
    // 다음 10페이지: 현재 페이지에서 10을 더하되, 최대 totalPages
    currentPage.value = Math.min(totalPages.value, currentPage.value + 10)
  }
}

// 이전/다음 10페이지 버튼 활성화 여부 (완전히 새로 작성된 로직)
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

// 체크박스 토글
const toggleCheck = (id: number) => {
  const item = notificationList.value.find(item => item.id === id)
  if (item) {
    item.isChecked = !item.isChecked
  }
}

// 작업 버튼 클릭 (독립적)
const handleAction = (id: number, action: string) => {
  const item = notificationList.value.find(item => item.id === id)
  if (item) {
    if (action === '의심') {
      item.suspiciousProcessed = !item.suspiciousProcessed
    } else if (action === '확인') {
      item.confirmedProcessed = !item.confirmedProcessed
    }
    console.log(`${item.phoneNumber}: ${action} 처리 ${item.suspiciousProcessed || item.confirmedProcessed ? '완료' : '취소'}`)
  }
}

// 적용 버튼 클릭
const handleApply = () => {
  const checkedItems = notificationList.value.filter(item => item.isChecked)
  const processedItems = notificationList.value.filter(item => item.suspiciousProcessed || item.confirmedProcessed)

  console.log('선택된 항목:', checkedItems.length)
  console.log('처리된 항목:', processedItems.length)
  console.log('적용 처리 완료')
}
</script>

<template>
  <div class="container">
    <!-- SearchBar 컴포넌트 재사용 -->
    <SearchBar @search="handleSearch" />

    <!-- 메인 콘텐츠 카드 -->
    <div class="card">
      <!-- 적용 버튼을 오른쪽 상단으로 이동 -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
        <button @click="handleApply" class="btn btn-primary">
          적용
        </button>
      </div>

      <!-- 리스트 테이블 -->
      <div class="list-container">
        <div class="list-item header-row">
          <div class="col-check">선택</div>
          <div class="col-phone">전화번호</div>
          <div class="col-type">유형</div>
          <div class="col-status" @click="handleSort('status')" style="cursor: pointer; user-select: none;">
            상태 {{ getSortIcon('status') }}
          </div>
          <div class="col-actions">알림 상태</div>
        </div>

        <div
            v-for="item in paginatedList"
            :key="item.id"
            class="list-item data-row"
        >
          <div class="col-check">
            <input
                :checked="item.isChecked"
                @change="toggleCheck(item.id)"
                type="checkbox"
                class="item-checkbox"
            />
          </div>
          <div class="col-phone">{{ item.phoneNumber }}</div>
          <div class="col-type">{{ item.type }}</div>
          <div class="col-status">
            <span :class="['status-badge', item.status === '의심' ? 'suspicious' : 'confirmed']">
              {{ item.status }}
            </span>
          </div>
          <div class="col-actions">
            <button
                @click="handleAction(item.id, '의심')"
                :class="['action-btn', 'suspicious', { 'processed': item.suspiciousProcessed }]"
                title="의심 처리"
            >
              의심
            </button>
            <button
                @click="handleAction(item.id, '확인')"
                :class="['action-btn', 'confirmed', { 'processed': item.confirmedProcessed }]"
                title="확인 처리"
            >
              확인
            </button>
          </div>
        </div>
      </div>

      <!-- 페이징을 중앙으로 이동 -->
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

        <!-- 이전 10페이지 (<) - 수정된 조건 -->
        <button
            @click="moveTenPages('prev')"
            :disabled="!canMoveTenPagesPrev"
            class="page-btn single"
            title="이전 10페이지"
        >
          ‹
        </button>

        <!-- 페이지 번호들 (1-10) -->
        <button
            v-for="page in pageRange"
            :key="page"
            @click="changePage(page)"
            :class="['page-btn', 'number', { active: currentPage === page }]"
        >
          {{ page }}
        </button>

        <!-- 다음 10페이지 (>) - 수정된 조건 -->
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
          (총 {{ filteredList.length }}개)
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* common.css에서 모든 스타일을 가져와서 사용 */
</style>