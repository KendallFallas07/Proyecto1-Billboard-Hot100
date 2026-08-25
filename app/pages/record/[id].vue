<script setup lang="ts">
const route = useRoute()
const id = computed(() => String(route.params.id))
const year = computed(() => id.value.split('-')[0] || 'unknown')
const { loadYear, formatDate, weekPath, recordPath } = useBillboardData()

const { data: yearRecords, pending, error } = await useAsyncData(
  `record-source-${year.value}`,
  () => loadYear(year.value),
  { watch: [year] }
)

const record = computed(() => (yearRecords.value || []).find(item => item.id === id.value) || null)
const decade = computed(() => record.value?.decade || `${year.value.slice(0, 3)}0`)

const weekRecords = computed(() => {
  if (!record.value) return []
  return (yearRecords.value || [])
    .filter(item => item.date === record.value!.date)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
})

const currentIndex = computed(() => weekRecords.value.findIndex(item => item.id === id.value))
const previous = computed(() => currentIndex.value > 0 ? weekRecords.value[currentIndex.value - 1] : null)
const next = computed(() => currentIndex.value >= 0 && currentIndex.value < weekRecords.value.length - 1
  ? weekRecords.value[currentIndex.value + 1]
  : null)

useHead(() => ({
  title: record.value ? `${record.value.title} - ${record.value.artist}` : 'Detalle del registro'
}))
</script>

<template>
  <div class="container page-stack">
    <Breadcrumbs
      v-if="record"
      :items="[
        { label: 'Inicio', to: '/' },
        { label: 'Explorar', to: '/charts' },
        { label: `${decade}s`, to: `/charts/${decade}` },
        { label: record.year, to: `/charts/${decade}/${record.year}` },
        { label: formatDate(record.date), to: weekPath(record.date) },
        { label: record.title }
      ]"
    />

    <p v-if="pending" class="notice">Cargando detalle...</p>
    <p v-else-if="error" class="notice error">No fue posible leer el registro.</p>
    <p v-else-if="!record" class="notice warning">El registro solicitado no existe.</p>

    <template v-else>
      <article class="record-detail">
        <header class="record-detail-header">
          <RecordImage :src="record.imageUrl" :title="record.title" :artist="record.artist" size="large" />
          <div>
            <p class="eyebrow">{{ formatDate(record.date) }}</p>
            <h1>{{ record.title }}</h1>
            <p class="artist-name">{{ record.artist }}</p>
          </div>
        </header>

        <dl class="stats-grid">
          <div><dt>Posicion</dt><dd>#{{ record.rank ?? '-' }}</dd></div>
          <div><dt>Semana anterior</dt><dd>{{ record.lastWeek ?? '-' }}</dd></div>
          <div><dt>Mejor posicion</dt><dd>{{ record.peak ?? '-' }}</dd></div>
          <div><dt>Semanas en lista</dt><dd>{{ record.weeks ?? '-' }}</dd></div>
          <div><dt>Fecha</dt><dd>{{ formatDate(record.date) }}</dd></div>
          <div><dt>Año</dt><dd>{{ record.year }}</dd></div>
        </dl>
      </article>

      <nav class="prev-next" aria-label="Navegacion entre posiciones de la misma semana">
        <NuxtLink v-if="previous" :to="recordPath(previous)" class="prev-next-card">
          <small>Posicion anterior</small>
          <strong>#{{ previous.rank }} - {{ previous.title }}</strong>
          <span>{{ previous.artist }}</span>
        </NuxtLink>
        <span v-else></span>

        <NuxtLink v-if="next" :to="recordPath(next)" class="prev-next-card align-right">
          <small>Posicion siguiente</small>
          <strong>#{{ next.rank }} - {{ next.title }}</strong>
          <span>{{ next.artist }}</span>
        </NuxtLink>
      </nav>
    </template>
  </div>
</template>
