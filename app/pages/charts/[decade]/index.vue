<script setup lang="ts">
const route = useRoute()
const decade = computed(() => String(route.params.decade))
const { loadManifest, formatDate } = useBillboardData()
const { data: manifest } = await useAsyncData('manifest-decade', loadManifest)

const decadeInfo = computed(() => manifest.value?.decades.find(item => item.decade === decade.value))
const years = computed(() => {
  if (!manifest.value || !decadeInfo.value) return []
  return decadeInfo.value.years
    .map(year => manifest.value!.years.find(item => item.year === year))
    .filter(item => item !== undefined)
})

useHead(() => ({ title: decadeInfo.value?.label || `Decada ${decade.value}` }))
</script>

<template>
  <div class="container page-stack">
    <Breadcrumbs
      :items="[
        { label: 'Inicio', to: '/' },
        { label: 'Explorar', to: '/charts' },
        { label: decadeInfo?.label || decade }
      ]"
    />

    <section class="page-header">
      <p class="eyebrow">Decada</p>
      <h1>{{ decadeInfo?.label || decade }}</h1>
      <p v-if="decadeInfo">{{ decadeInfo.count.toLocaleString('es-CR') }} registros distribuidos por año.</p>
    </section>

    <section class="year-grid">
      <NuxtLink
        v-for="yearInfo in years"
        :key="yearInfo.year"
        :to="`/charts/${decade}/${yearInfo.year}`"
        class="year-card"
      >
        <strong>{{ yearInfo.label }}</strong>
        <span>{{ yearInfo.count.toLocaleString('es-CR') }} registros</span>
        <small>{{ formatDate(yearInfo.firstDate) }} - {{ formatDate(yearInfo.lastDate) }}</small>
      </NuxtLink>
    </section>

    <p v-if="manifest && !decadeInfo" class="notice error">No existe esa decada en el dataset cargado.</p>
  </div>
</template>
