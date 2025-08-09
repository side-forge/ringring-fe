<script setup lang="ts">
import { ref } from 'vue'

// Props 정의
interface Props {
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '번호를 입력하세요...'
})

// Emits 정의
const emit = defineEmits<{
  search: [query: string]
}>()

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value)
  }
}
</script>

<template>
  <div class="search-container">
    <input
        v-model="searchQuery"
        type="text"
        class="search-box"
        :placeholder="placeholder"
        @keypress.enter="handleSearch"
    >
    <button class="search-btn" @click="handleSearch">🔍</button>
  </div>
</template>

<style scoped>
/* SearchBar 컴포넌트에 특화된 스타일만 */
</style>