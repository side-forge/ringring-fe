<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props 정의
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// Emits 정의
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 신고 폼 데이터
const reportForm = ref({
  phoneNumber: '',
  type: '',
  alertSchedule: false,
  attachedFile: null as File | null
})

// 신고 유형 옵션
const reportTypes = [
  { value: 'voice-phishing', label: '보이스피싱' },
  { value: 'spam', label: '스팸/광고' },
  { value: 'fraud', label: '사기' },
  { value: 'other', label: '기타' }
]

// 모달 닫기
const closeModal = () => {
  emit('update:modelValue', false)
}

// 오버레이 클릭 처리
const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// ESC 키 처리
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// 파일 업로드 처리
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    reportForm.value.attachedFile = target.files[0]
  }
}

// 폼 제출
const handleSubmit = () => {
  if (!reportForm.value.phoneNumber || !reportForm.value.type) {
    alert('전화번호와 타입을 선택해주세요.')
    return
  }

  console.log('신고 데이터:', reportForm.value)

  // 여기서 API 호출
  // await submitReport(reportForm.value)

  alert('신고가 접수되었습니다.')
  handleCancel()
}

// 취소 처리
const handleCancel = () => {
  // 폼 초기화
  reportForm.value = {
    phoneNumber: '',
    type: '',
    alertSchedule: false,
    attachedFile: null
  }
  closeModal()
}

// 라이프사이클
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
        v-if="modelValue"
        class="modal-overlay"
        @click="handleOverlayClick"
    >
      <div class="modal-content" @click.stop>
        <!-- 신고 폼 - 이미지와 동일한 디자인 -->
        <div class="report-form-container">
          <!-- 헤더 -->
          <div class="form-header">
            <h2>신고하기</h2>
          </div>

          <!-- 폼 영역 -->
          <div class="form-content">
            <!-- 전화번호 입력 -->
            <div class="form-row">
              <label class="form-label">전화번호:</label>
              <input
                  v-model="reportForm.phoneNumber"
                  type="tel"
                  class="form-input"
                  placeholder=""
              />
            </div>

            <!-- 타입 선택 -->
            <div class="form-row">
              <label class="form-label">타입:</label>
              <select v-model="reportForm.type" class="form-select">
                <option value="">선택해주세요</option>
                <option
                    v-for="type in reportTypes"
                    :key="type.value"
                    :value="type.value"
                >
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- 알림예약 체크박스 -->
            <div class="form-row">
              <label class="form-label">알림예약:</label>
              <label class="checkbox-label">
                <input
                    v-model="reportForm.alertSchedule"
                    type="checkbox"
                    class="form-checkbox"
                />
                <span class="checkbox-text">예약하기</span>
              </label>
            </div>

            <!-- 파일 첨부 -->
            <div class="form-row">
              <label class="form-label">파일첨부:</label>
              <div class="file-input-container">
                <input
                    :value="reportForm.attachedFile ? reportForm.attachedFile.name : ''"
                    type="text"
                    class="form-input file-display"
                    placeholder="첨부파일을 선택하세요"
                    readonly
                />
                <button
                    type="button"
                    class="file-attach-btn"
                    @click="$refs.fileInput.click()"
                >
                  <img src="/src/assets/images/attch_file.png" alt="파일 첨부" />
                </button>
                <input
                    ref="fileInput"
                    @change="handleFileChange"
                    type="file"
                    class="form-file-hidden"
                    accept="image/*,audio/*,.pdf,.doc,.docx"
                />
              </div>
            </div>

            <!-- 버튼 영역 -->
            <div class="form-buttons">
              <button @click="handleSubmit" class="btn-submit" type="button">
                접수
              </button>
              <button @click="handleCancel" class="btn-submit" type="button">
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>