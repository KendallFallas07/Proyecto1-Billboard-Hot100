<script setup lang="ts">
const { loadManifest, formatDate } = useBillboardData()
const { data: manifest, error } = await useAsyncData('manifest-home', loadManifest)

useHead({ title: 'Inicio' })
</script>

<template>
  <div class="container page-stack">
    <section class="hero">
      <div>
        <p class="eyebrow">Proyecto 1 - Arquitectura de Informacion</p>
        <h1>Billboard Hot 100</h1>
        <p class="hero-copy">
          Sitio para explorar el historial del ranking Hot 100 por decada, año, semana y canciones.
          Tambien permite buscar por cancion o artista.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/charts" class="button primary">Explorar rankings</NuxtLink>
          <NuxtLink to="/search" class="button secondary">Buscar canciones</NuxtLink>
        </div>
      </div>
      <div class="hero-card" aria-label="Resumen del dataset">
        <template v-if="manifest">
          <strong>{{ manifest.totalRecords.toLocaleString('es-CR') }}</strong>
          <span>registros</span>
          <dl>
            <div><dt>Rango</dt><dd>{{ formatDate(manifest.minDate) }} - {{ formatDate(manifest.maxDate) }}</dd></div>
            <div><dt>Artistas</dt><dd>{{ manifest.artistCount.toLocaleString('es-CR') }}</dd></div>
            <div><dt>Fuente</dt><dd>{{ manifest.sourceFile }}</dd></div>
          </dl>
        </template>
        <p v-else-if="error" class="error-text">No fue posible leer los datos.</p>
        <p v-else>Cargando resumen...</p>
      </div>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <p class="eyebrow">Organizacion</p>
        <h2>Decada - Año - Semana - Canciones</h2>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <span class="step">1</span>
          <h3>Decada</h3>
          <p>Agrupa el historial en periodos faciles de recorrer.</p>
        </article>
        <article class="feature-card">
          <span class="step">2</span>
          <h3>Año</h3>
          <p>Muestra las semanas disponibles y registros de ese periodo.</p>
        </article>
        <article class="feature-card">
          <span class="step">3</span>
          <h3>Semana</h3>
          <p>Presenta el ranking ordenado por posicion.</p>
        </article>
        <article class="feature-card">
          <span class="step">4</span>
          <h3>Registro</h3>
          <p>Abre el detalle de una cancion en una fecha especifica.</p>
        </article>
      </div>
    </section>
  </div>
</template>
