<script setup lang="ts">
const route = useRoute()
const decade = computed(() => String(route.params.decade))
const year = computed(() => String(route.params.year))
const date = computed(() => String(route.params.date))
const { loadYear, formatDate } = useBillboardData()

const { data: yearRecords, pending, error } = await useAsyncData(
  `week-source-${year.value}`,
  () => loadYear(year.value),
  { watch: [year] }
)

const records = computed(() =>
  (yearRecords.value || [])
    .filter(record => record.date === date.value)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
)

const { page, totalPages, pagedItems, setPage } = usePager(records, 25)

useHead(() => ({ title: `Chart ${formatDate(date.value)}` }))
</script>

<template>
  <div class="container page-stack">
    <Breadcrumbs
      :items="[
        { label: 'Inicio', to: '/' },
        { label: 'Explorar', to: '/charts' },
        { label: `${decade}s`, to: `/charts/${decade}` },
        { label: year, to: `/charts/${decade}/${year}` },
        { label: formatDate(date) }
      ]"
    />

    <section class="page-header compact">
      <p class="eyebrow">Chart semanal</p>
      <h1>{{ formatDate(date) }}</h1>
      <p v-if="records.length">{{ records.length }} posiciones encontradas para esta semana.</p>
    </section>

    <p v-if="pending" class="notice">Cargando chart semanal...</p>
    <p v-else-if="error" class="notice error">No se pudo cargar la informacion.</p>
    <p v-else-if="!records.length" class="notice warning">No hay registros para esta fecha.</p>
    <template v-else>
      <RecordTable :records="pagedItems" />
      <PaginationView :page="page" :total-pages="totalPages" @change="setPage" />
    </template>
  </div>
</template>
