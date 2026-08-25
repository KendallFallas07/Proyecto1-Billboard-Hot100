<script setup lang="ts">
const props = defineProps<{
  src?: string | null
  title: string
  artist: string
  size?: 'small' | 'large'
}>()

const failed = ref(false)

const hasImage = computed(() => {
  const value = String(props.src || '').trim()
  return value && !failed.value
})

watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <div class="record-image" :class="size === 'large' ? 'large' : 'small'">
    <img
      v-if="hasImage"
      :src="src || ''"
      :alt="`${title} - ${artist}`"
      loading="lazy"
      @error="failed = true"
    >
    <div v-else class="image-placeholder" aria-hidden="true">
      <span>♪</span>
    </div>
  </div>
</template>
