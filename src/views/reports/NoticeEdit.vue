<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'

// 폼 데이터
const formData = ref({
  title: '',
  content: '',
  important: false,
  startDate: '',
  endDate: ''
})

// 첨부파일 관리
const attachedFileName = ref('')

// 파일 첨부 핸들러
const handleAttachFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,.pdf,.doc,.docx,.txt'

  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      attachedFileName.value = file.name
      console.log('첨부된 파일:', file.name)
    }
  }
  input.click()
}

// 파일 제거
const removeFile = () => {
  attachedFileName.value = ''
}

// 폼 제출
const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    alert('제목을 입력해주세요.')
    return
  }
  if (!formData.value.content.trim()) {
    alert('내용을 입력해주세요.')
    return
  }

  console.log('공지사항 등록:', formData.value)
  alert('공지사항이 등록되었습니다.')

  // TODO: API 호출 로직 추가
  // 등록 성공 후 목록 페이지로 이동
  router.push('/noticeList')
}

// 취소 버튼
const handleCancel = () => {
  if (confirm('작성중인 내용이 사라집니다. 계속하시겠습니까?')) {
    router.push('/noticeList')
  }
}

// 목록으로 돌아가기
const handleBackToList = () => {
  if (confirm('작성중인 내용이 사라집니다. 계속하시겠습니까?')) {
    router.push('/noticeList')
  }
}
</script>

<template>
  <div class="container">
    <main class="main-content">

      <!-- 작성 도움말 -->
      <section class="card">
        <h3>작성 도움말</h3>
        <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 15px 0 0 20px;">
          <li>제목과 내용은 필수 입력 항목입니다.</li>
          <li>중요 공지사항으로 설정하면 목록에서 "중요" 배지가 표시됩니다.</li>
          <li>게시 기간을 설정하지 않으면 무기한으로 게시됩니다.</li>
          <li>첨부파일은 이미지, PDF, 문서 파일을 지원합니다.</li>
          <li>등록 후에는 공지사항 목록에서 확인할 수 있습니다.</li>
        </ul>
      </section>

      <!-- 공지사항 등록 폼 -->
      <section class="card">
        <!-- 헤더 영역 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h3>공지사항 등록</h3>
          <button @click="handleBackToList" class="btn btn-secondary">
            ← 목록으로
          </button>
        </div>

        <!-- 액션 버튼들 (파일 첨부) -->
        <div class="search-result-container" style="margin-bottom: 40px;">
          <div class="action-icons">
            <input
                type="text"
                class="file-name-input"
                :value="attachedFileName"
                readonly
                placeholder="첨부된 파일이 없습니다"
                style="padding-left: 15px;"
            />
            <button @click="handleAttachFile" class="icon-btn">
              <img src="/src/assets/images/attch_file.png" alt="파일 첨부" />
            </button>
          </div>
        </div>

        <!-- 공지사항 등록 폼 -->
        <div class="form-content">
          <!-- 제목 -->
          <div class="form-row">
            <label class="form-label">제목</label>
            <input
                v-model="formData.title"
                type="text"
                class="form-input"
                placeholder="공지사항 제목을 입력하세요"
            />
          </div>

          <!-- 중요 공지 여부 -->
          <div class="form-row">
            <label class="form-label">설정</label>
            <label class="checkbox-label">
              <input
                  v-model="formData.important"
                  type="checkbox"
                  class="form-checkbox"
              />
              <span class="checkbox-text">중요 공지사항</span>
            </label>
          </div>

          <!-- 게시 기간 (캘린더 활성화) -->
          <div class="form-row">
            <label class="form-label">게시기간</label>
            <input
                v-model="formData.startDate"
                type="date"
                class="form-input"
                style="flex: 1; margin-right: 10px;"
            />
            <span style="align-self: center;">~</span>
            <input
                v-model="formData.endDate"
                type="date"
                class="form-input"
                style="flex: 1; margin-left: 10px;"
            />
          </div>

          <!-- 첨부파일 표시 (하단에 별도로) -->
          <!--          <div v-if="attachedFileName" class="action-area">-->
          <!--            <input-->
          <!--                type="text"-->
          <!--                class="file-name-box"-->
          <!--                :value="attachedFileName"-->
          <!--                readonly-->
          <!--            />-->
          <!--          </div>-->

          <!-- 내용 -->
          <div class="form-row" style="align-items: flex-start;">
            <label class="form-label">내용</label>
            <textarea
                v-model="formData.content"
                class="form-textarea"
                rows="15"
                placeholder="공지사항 내용을 입력하세요"
            ></textarea>
          </div>

          <!-- 버튼 영역 -->
          <div class="form-buttons">
            <button @click="handleCancel" class="btn-cancel">
              취소
            </button>
            <button @click="handleSubmit" class="btn-submit">
              등록
            </button>
          </div>
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
</style>