<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'

// 검색 및 페이징 관련
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// 필터 관련 (라디오 버튼으로 변경)
const selectedFilter = ref('자동')

// 정렬 관련
const sortField = ref('')
const sortOrder = ref('asc')

// 더미 데이터 - 실제로는 API에서 가져올 데이터
const reportList = ref([
  { id: 1, phoneNumber: '010-3733-7202', type: '리딩방', status: 'Released', confidence: '80%', isChecked: false },
  { id: 2, phoneNumber: '010-1234-5678', type: '스팸', status: 'Spam', confidence: '95%', isChecked: false },
  { id: 3, phoneNumber: '010-9876-5432', type: '보이스피싱', status: 'Released', confidence: '75%', isChecked: false },
  { id: 4, phoneNumber: '010-5555-1234', type: '사기', status: 'Released', confidence: '90%', isChecked: false },
  { id: 5, phoneNumber: '010-7777-8888', type: '리딩방', status: 'Pending', confidence: '85%', isChecked: false },
  { id: 6, phoneNumber: '010-1111-2222', type: '스팸', status: 'Pending', confidence: '70%', isChecked: false },
  { id: 7, phoneNumber: '010-3333-4444', type: '보이스피싱', status: 'Pending', confidence: '88%', isChecked: false },
  { id: 8, phoneNumber: '010-5555-6666', type: '사기', status: 'Released', confidence: '92%', isChecked: false },
  { id: 9, phoneNumber: '010-7777-9999', type: '리딩방', status: 'Spam', confidence: '78%', isChecked: false },
  { id: 10, phoneNumber: '010-1010-2020', type: '스팸', status: 'Spam', confidence: '83%', isChecked: false },
  // 더 많은 더미 데이터 생성
  ...Array.from({ length: 40 }, (_, i) => ({
    id: i + 11,
    phoneNumber: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    type: ['스팸', '보이스피싱', '사기', '리딩방'][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.5 ? 'Released' : 'Pending',
    confidence: `${Math.floor(Math.random() * 30) + 70}%`,
    isChecked: false
  }))
])

// 검색 및 필터링
const filteredList = computed(() => {
  let result = reportList.value

  // 검색 필터링
  if (searchQuery.value) {
    result = result.filter(item =>
        item.phoneNumber.includes(searchQuery.value) ||
        item.type.includes(searchQuery.value)
    )
  }

  // 필터 적용 (선택된 필터에 따라 API 호출될 예정)
  // TODO: API 연동 시 selectedFilter.value에 따라 데이터 요청

  // 정렬
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      let aValue = a[sortField.value]
      let bValue = b[sortField.value]

      // 상태의 경우 정렬 순서를 정의
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

// 페이지 범위 계산
const pageRange = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const range = 10

  let start = Math.floor((current - 1) / range) * range + 1
  let end = Math.min(start + range - 1, total)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 검색 처리
const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}

// 정렬 기능
const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
}

// 정렬 아이콘 표시
const getSortIcon = (field: string) => {
  if (sortField.value !== field) return '▼'
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

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

// 체크박스 토글
const toggleCheck = (id: number) => {
  const item = reportList.value.find(item => item.id === id)
  if (item) {
    item.isChecked = !item.isChecked
  }
}

// 필터 변경 처리
const handleFilterChange = (filterType: string) => {
  selectedFilter.value = filterType
  currentPage.value = 1
  // TODO: API 호출하여 해당 필터에 맞는 데이터 가져오기
  console.log(`필터 변경: ${filterType}`)
}

// 상태 변경 및 적용
const handleStatusChange = (item: any, event: Event) => {
  const target = event.target as HTMLSelectElement
  item.status = target.value
}

const handleApply = () => {
  const checkedItems = reportList.value.filter(item => item.isChecked)
  console.log(`상태 변경 적용:`, checkedItems.length, '개 항목')
  // TODO: API 호출하여 선택된 항목들의 상태 변경
}
</script>

<template>
  <div class="container">
    <!-- SearchBar 컴포넌트 -->
    <SearchBar @search="handleSearch" />

    <main class="main-content">
      <!-- 메인 콘텐츠 카드 -->
      <div class="card">
        <!-- 적용 버튼을 오른쪽 상단으로 이동 -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
          <button @click="handleApply" class="btn btn-primary">
            적용
          </button>
        </div>

        <!-- 필터 영역 (오른쪽 정렬) -->
        <div class="filter-action-area">
          <div class="time-refresh-section">
            <span>최근 시간 : 2025-08-11 20:11:00</span>
            <button @click="handleRefresh" class="btn btn-secondary refresh-btn" style="margin-left:10px;">
              새로고침
            </button>
          </div>
          <!-- 필터 라디오 버튼들 (오른쪽) -->
          <div class="filter-section">
            <label class="filter-item">
              <input
                  type="radio"
                  name="filter"
                  value="자동"
                  v-model="selectedFilter"
                  @change="handleFilterChange('자동')"
                  class="filter-checkbox"
              />
              <span>자동 판단</span>
            </label>
            <label class="filter-item">
              <input
                  type="radio"
                  name="filter"
                  value="수동"
                  v-model="selectedFilter"
                  @change="handleFilterChange('수동')"
                  class="filter-checkbox"
              />
              <span>수동 판단</span>
            </label>
            <label class="filter-item">
              <input
                  type="radio"
                  name="filter"
                  value="대기"
                  v-model="selectedFilter"
                  @change="handleFilterChange('대기')"
                  class="filter-checkbox"
              />
              <span>대기</span>
            </label>
          </div>
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
            <div class="col-confidence">가중치</div>
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
              <select
                  :value="item.status"
                  @change="handleStatusChange(item, $event)"
                  class="status-select"
                  :class="{ 'selected': item.isChecked }"
              >
                <option value="Pending">Pending</option>
                <option value="Spam">Spam</option>
                <option value="Released">Released</option>
              </select>
            </div>
            <div class="col-confidence">{{ item.confidence }}</div>
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
          (총 {{ filteredList.length }}개)
        </span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* common.css에서 모든 스타일을 가져와서 사용 */
</style>