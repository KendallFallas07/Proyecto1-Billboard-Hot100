<script setup lang="ts">
import type { SearchRecord } from '~/types/billboard'

const route = useRoute()
const router = useRouter()
const { loadSearchIndex } = useBillboardData()

const query = ref(String(route.query.q || ''))
const activeQuery = ref(query.value)
const yearFilter = ref(String(route.query.year || 'all'))

const { data: index, pending, error } = await useAsyncData('global-search-index', loadSearchIndex)

const years = computed(() => [...new Set((index.value || []).map(item => item.year))].sort((a, b) => b.localeCompare(a)))

const results = computed<SearchRecord[]>(() => {
  const q = activeQuery.value.trim().toLowerCase()
  if (!q) return []

  return (index.value || [])
    .filter(item => yearFilter.value === 'all' || item.year === yearFilter.value)
    .filter(item => {
      const title = item.title.toLowerCase()
      const artist = item.artist.toLowerCase()
      return title.includes(q) || artist.includes(q)
    })
    .sort((a, b) => b.date.localeCompare(a.date) || (a.rank ?? 999) - (b.rank ?? 999))
})

const { page, totalPages, pagedItems, setPage } = usePager(results, 50)

let debounce: ReturnType<typeof setTimeout> | undefined
watch([query, yearFilter], () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    activeQuery.value = query.value
    router.replace({
      query: {
        q: query.value.trim() || undefined,
        year: yearFilter.value === 'all' ? undefined : yearFilter.value,
        page: undefined
      }
    })
  }, 250)
})

watch(() => route.query.q, value => {
  query.value = String(value || '')
  activeQuery.value = query.value
})
watch(() => route.query.year, value => { yearFilter.value = String(value || 'all') })

useHead({ title: 'Buscar' })
</script>

<template>
  <div class="container page-stack">
    <Breadcrumbs :items="[{ label: 'Inicio', to: '/' }, { label: 'Buscar' }]" />

    <section class="page-header">
      <p class="eyebrow">Busqueda global</p>
      <h1>Buscar canciones</h1>
      <p>Busca por cancion o artista. Tambien puedes limitar los resultados a un año.</p>
    </section>

    <section class="search-panel">
      <label class="search-main">
        <span>Termino de busqueda</span>
        <input v-model="query" type="search" placeholder="Ej.: Madonna o Billie Jean" autofocus autocomplete="off">
      </label>
      <label>
        <span>Año</span>
        <select v-model="yearFilter">
          <option value="all">Todos los años</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </label>
    </section>

    <p v-if="pending" class="notice">Preparando indice de busqueda...</p>
    <p v-else-if="error" class="notice error">No fue posible cargar el indice.</p>
    <p v-else-if="!query.trim()" class="empty-state">Escribe una cancion o artista para comenzar.</p>
    <p v-else-if="!results.length" class="empty-state">No se encontraron coincidencias.</p>
    <template v-else>
      <div class="results-summary">
        <strong>{{ results.length.toLocaleString('es-CR') }}</strong> resultados para "{{ query }}"
      </div>
      <RecordTable :records="pagedItems" show-date />
      <PaginationView :page="page" :total-pages="totalPages" @change="setPage" />
    </template>
  </div>
</template>
