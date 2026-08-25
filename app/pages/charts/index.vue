<script setup lang="ts">
const { loadManifest, formatDate } = useBillboardData()
const { data: manifest } = await useAsyncData('manifest-charts', loadManifest)

useHead({ title: 'Explorar rankings' })
</script>

<template>
  <div class="container page-stack">
    <Breadcrumbs :items="[{ label: 'Inicio', to: '/' }, { label: 'Explorar' }]" />

    <section class="page-header">
      <p class="eyebrow">Exploracion</p>
      <h1>Selecciona una decada</h1>
      <p>La navegacion sigue la jerarquia: decada - año - semana - canciones.</p>
    </section>

    <section v-if="manifest" class="decade-grid">
      <NuxtLink
        v-for="decade in manifest.decades"
        :key="decade.decade"
        :to="`/charts/${decade.decade}`"
        class="decade-card"
      >
        <span class="decade-label">{{ decade.label }}</span>
        <strong>{{ decade.count.toLocaleString('es-CR') }}</strong>
        <span>registros</span>
        <small>{{ decade.years.length }} años disponibles</small>
      </NuxtLink>
    </section>

    <section v-if="manifest" class="dataset-summary">
      <strong>Cobertura:</strong> {{ formatDate(manifest.minDate) }} - {{ formatDate(manifest.maxDate) }}
    </section>
  </div>
</template>
