<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const visiblePages = computed(() => {
  const pages = new Set<number>([1, props.totalPages])
  for (let current = props.page - 2; current <= props.page + 2; current++) {
    if (current >= 1 && current <= props.totalPages) pages.add(current)
  }
  return [...pages].sort((a, b) => a - b)
})
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Paginacion">
    <button :disabled="page <= 1" @click="emit('change', page - 1)">Anterior</button>

    <template v-for="(current, index) in visiblePages" :key="current">
      <span v-if="index > 0 && current - visiblePages[index - 1] > 1" class="ellipsis">...</span>
      <button
        :class="{ active: current === page }"
        :aria-current="current === page ? 'page' : undefined"
        @click="emit('change', current)"
      >
        {{ current }}
      </button>
    </template>

    <button :disabled="page >= totalPages" @click="emit('change', page + 1)">Siguiente</button>
    <span class="page-count">Pagina {{ page }} de {{ totalPages }}</span>
  </nav>
</template>
