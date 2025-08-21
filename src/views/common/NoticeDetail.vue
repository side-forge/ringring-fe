<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const noticeId = computed(() => route.params.id as string)

// 공지사항 데이터
const noticeData = ref({
  title: '',
  content: '',
  link: '',
  createdDate: '',
  views: 0,
  status: ''
})

// 로딩 상태
const isLoading = ref(true)

// 공지사항 상세 데이터 로드
const loadNoticeDetail = async () => {
  try {
    isLoading.value = true

    // TODO: API 호출하여 상세 데이터 가져오기
    // const response = await api.getNoticeDetail(noticeId.value)
    // noticeData.value = response.data

    // 임시 더미 데이터 (실제로는 API에서 가져올 데이터)
    const dummyData = {
      title: `공지사항 제목`,
      content: `이것은 ${noticeId.value}번 공지사항의 상세 내용입니다.\n\n여러 줄의 내용이 들어갈 수 있습니다.\n\n중요한 안내사항이나 업데이트 내용을 자세히 설명합니다.`,
      link: 'https://www.youtube.com/watch?v=wAA4bmn9xHI',
      createdDate: '2024-01-15',
      views: 150,
      status: '게시중'
    }

    // 조회수 증가 (실제로는 API에서 처리)
    dummyData.views += 1

    noticeData.value = { ...dummyData }
    console.log(`공지사항 ${noticeId.value}번 상세 데이터 로드됨`)
  } catch (error) {
    console.error('공지사항 상세 데이터 로드 실패:', error)
    alert('공지사항 정보를 불러오는데 실패했습니다.')
    router.push('/noticeList')
  } finally {
    isLoading.value = false
  }
}

// 임베드 URL 생성 함수
const getEmbedUrl = (url: string) => {
  if (!url) return ''

  // YouTube URL 처리
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo URL 처리
  const vimeoRegex = /vimeo\.com\/(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // 이미지 URL인지 확인
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const isImage = imageExtensions.some(ext => url.toLowerCase().includes(ext))
  if (isImage) {
    return url
  }

  return url
}

// 링크 타입 확인
const getLinkType = (url: string) => {
  if (!url) return 'none'

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube'
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo'
  }

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const isImage = imageExtensions.some(ext => url.toLowerCase().includes(ext))
  if (isImage) {
    return 'image'
  }

  return 'link'
}

// 컴포넌트 마운트 시 실행
onMounted(() => {
  loadNoticeDetail()
})

// 목록으로 돌아가기
const handleBackToList = () => {
  router.push('/noticeList')
}
</script>

<template>
  <div class="container">
    <main class="main-content">

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="card text-center">
        <p>로딩 중...</p>
      </div>

      <!-- 공지사항 상세 내용 -->
      <section v-else class="card">
        <!-- 헤더 영역 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h2>{{ noticeData.title }}</h2>
          <div style="display: flex; gap: 10px;">
            <button @click="handleBackToList" class="btn btn-secondary">
              목록으로
            </button>
          </div>
        </div>

        <!-- 공지사항 정보 -->
        <div class="notice-info">
          <div class="info-row">
            <span class="info-label">등록일:</span>
            <span class="info-value">{{ noticeData.createdDate }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">조회수:</span>
            <span class="info-value">{{ noticeData.views }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">상태:</span>
            <span :class="['status-badge', noticeData.status === '게시중' ? 'confirmed' : 'suspicious']">
              {{ noticeData.status }}
            </span>
          </div>
        </div>

        <!-- 구분선 -->
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

        <!-- 링크 미디어 표시 -->
        <div v-if="noticeData.link && getLinkType(noticeData.link) !== 'none'" class="media-container">
          <!-- YouTube 비디오 -->
          <iframe
              v-if="getLinkType(noticeData.link) === 'youtube'"
              :src="getEmbedUrl(noticeData.link)"
              frameborder="0"
              allowfullscreen
              class="video-embed"
          ></iframe>

          <!-- Vimeo 비디오 -->
          <iframe
              v-else-if="getLinkType(noticeData.link) === 'vimeo'"
              :src="getEmbedUrl(noticeData.link)"
              frameborder="0"
              allowfullscreen
              class="video-embed"
          ></iframe>

          <!-- 이미지 -->
          <img
              v-else-if="getLinkType(noticeData.link) === 'image'"
              :src="noticeData.link"
              alt="공지사항 이미지"
              class="content-image"
          />

          <!-- 일반 링크 -->
          <div v-else class="link-container">
            <p><strong>관련 링크:</strong></p>
            <a :href="noticeData.link" target="_blank" class="external-link">
              {{ noticeData.link }}
            </a>
          </div>
        </div>

        <!-- 내용 -->
        <div class="notice-content">
          <h4>내용</h4>
          <div class="content-text">
            {{ noticeData.content }}
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

/* 공지사항 정보 스타일 */
.notice-info {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-weight: 600;
  color: #495057;
  min-width: 60px;
}

.info-value {
  color: #6c757d;
}

/* 상태 뱃지 스타일 */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.confirmed {
  background: #d1e7dd;
  color: #0f5132;
}

.status-badge.suspicious {
  background: #f8d7da;
  color: #721c24;
}

/* 미디어 컨테이너 */
.media-container {
  margin: 30px 0;
  text-align: center;
}

/* 비디오 임베드 스타일 */
.video-embed {
  width: 100%;
  max-width: 800px;
  height: 450px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 이미지 스타일 */
.content-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 링크 컨테이너 */
.link-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}

.external-link {
  color: #0d6efd;
  text-decoration: none;
  word-break: break-all;
}

.external-link:hover {
  text-decoration: underline;
}

/* 내용 스타일 */
.notice-content {
  margin: 30px 0;
}

.notice-content h4 {
  margin-bottom: 15px;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 10px;
}

.content-text {
  line-height: 1.8;
  color: #495057;
  white-space: pre-wrap;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 15px;
}

/* 하단 액션 버튼 */
.bottom-actions {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

/* 반응형 */
@media (max-width: 768px) {
  .notice-info {
    flex-direction: column;
    gap: 10px;
  }

  .video-embed {
    height: 250px;
  }
}
</style>