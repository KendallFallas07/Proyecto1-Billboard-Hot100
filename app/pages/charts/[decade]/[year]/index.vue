<script setup lang="ts">
import type { BillboardRecord } from '~/types/billboard'

const route = useRoute()
const router = useRouter()
const decade = computed(() => String(route.params.decade))
const year = computed(() => String(route.params.year))
const { loadYear, formatDate, weekPath } = useBillboardData()

const { data: records, pending, error } = await useAsyncData(
  `records-${year.value}`,
  () => loadYear(year.value),
  { watch: [year] }
)

const filter = ref(String(route.query.q || ''))
const rankFilter = ref(String(route.query.rank || 'all'))

watch(() => route.query.q, value => { filter.value = String(value || '') })
watch(() => route.query.rank, value => { rankFilter.value = String(value || 'all') })

const filteredRecords = computed<BillboardRecord[]>(() => {
  const query = filter.value.trim().toLowerCase()
  return (records.value || []).filter(record => {
    const matchesText = !query || record.title.toLowerCase().includes(query) || record.artist.toLowerCase().includes(query)
    const matchesRank = rankFilter.value === 'all' ||
      (rankFilter.value === 'top10' && (record.rank || 999) <= 10) ||
      (rankFilter.value === 'top40' && (record.rank || 999) <= 40)
    return matchesText && matchesRank
  })
})

const { page, totalPages, pagedItems, setPage } = usePager(filteredRecords, 50)

const weeks = computed(() => {
  const map = new Map<string, number>()
  for (const record of records.value || []) map.set(record.date, (map.get(record.date) || 0) + 1)
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})

let debounce: ReturnType<typeof setTimeout> | undefined
watch([filter, rankFilter], () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    router.replace({
      query: {
        q: filter.value.trim() || undefined,
        rank: rankFilter.value === 'all' ? undefined : rankFilter.value,
        page: undefined
      }
    })
  }, 250)
})

useHead(() => ({ title: `Billboard Hot 100 ${year.value}` }))
</script>

<template>
  <div class="container page-stack">
    <Breadcrumbs
      :items="[
        { label: 'Inicio', to: '/' },
        { label: 'Explorar', to: '/charts' },
        { label: `${decade}s`, to: `/charts/${decade}` },
        { label: year }
      ]"
    />

    <section class="page-header compact">
      <p class="eyebrow">Año</p>
      <h1>Billboard Hot 100 - {{ year }}</h1>
      <p v-if="records">{{ records.length.toLocaleString('es-CR') }} registros - {{ weeks.length }} semanas.</p>
    </section>

    <section v-if="records" class="week-strip" aria-label="Semanas del año">
      <div class="week-strip-head">
        <h2>Semanas disponibles</h2>
        <span>Abre una fecha para ver el ranking ordenado</span>
      </div>
      <div class="week-links">
        <NuxtLink v-for="([date, count]) in weeks" :key="date" :to="weekPath(date)">
          {{ formatDate(date) }} <small>({{ count }})</small>
        </NuxtLink>
      </div>
    </section>

    <section class="toolbar" aria-label="Filtros de registros">
      <label>
        <span>Filtrar este año</span>
        <input v-model="filter" type="search" placeholder="Cancion o artista" autocomplete="off">
      </label>
      <label>
        <span>Posicion</span>
        <select v-model="rankFilter">
          <option value="all">Todas</option>
          <option value="top10">Top 10</option>
          <option value="top40">Top 40</option>
        </select>
      </label>
      <div class="toolbar-count">
        <strong>{{ filteredRecords.length.toLocaleString('es-CR') }}</strong>
        <span>resultados</span>
      </div>
    </section>

    <p v-if="pending" class="notice">Cargando registros...</p>
    <p v-else-if="error" class="notice error">No fue posible cargar los registros de {{ year }}.</p>
    <template v-else>
      <RecordTable :records="pagedItems" show-date />
      <PaginationView :page="page" :total-pages="totalPages" @change="setPage" />
    </template>
  </div>
</template>
