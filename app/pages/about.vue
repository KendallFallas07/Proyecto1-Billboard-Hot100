<script setup lang="ts">
useHead({ title: 'Acerca del sitio' })
</script>

<template>
  <div class="container page-stack reading-width">
    <Breadcrumbs :items="[{ label: 'Inicio', to: '/' }, { label: 'Acerca del sitio' }]" />

    <section class="page-header">
      <p class="eyebrow">Proyecto academico</p>
      <h1>Organizacion de la informacion</h1>
    </section>

    <section class="prose-card">
      <h2>Jerarquia</h2>
      <p>
        Cada registro pertenece a una fecha del Billboard Hot 100. Por eso el sitio organiza el dataset como
        <strong> decada - año - semana - canciones</strong>. Esta estructura permite llegar al ranking de una
        semana sin cargar todo el archivo en una sola lista.
      </p>

      <h2>Navegacion</h2>
      <p>
        El sitio usa navegacion principal, migas de pan, enlaces internos con NuxtLink y anterior/siguiente
        en el detalle de canciones de una misma semana.
      </p>

      <h2>Busqueda y paginacion</h2>
      <p>
        La busqueda permite consultar por cancion o artista, ignorando mayusculas y minusculas. Los listados
        largos usan paginacion para mostrar grupos de 25 o 50 registros.
      </p>

      <h2>Dataset</h2>
      <p>
        El archivo usado por el proyecto es <code>dataset/hot100.csv</code>. El script
        <code>scripts/prepare-data.mjs</code> lee sus ocho columnas, genera archivos JSON por año y crea un
        indice sencillo para busqueda.
      </p>
    </section>
  </div>
</template>
