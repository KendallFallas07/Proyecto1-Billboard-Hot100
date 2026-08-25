<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink to="/" class="brand" aria-label="Ir al inicio">
        <span class="brand-mark">100</span>
        <span>
          <strong>Billboard Hot 100</strong>
          <small>Arquitectura de Informacion</small>
        </span>
      </NuxtLink>

      <nav class="main-nav" aria-label="Navegacion principal">
        <NuxtLink to="/">Inicio</NuxtLink>
        <NuxtLink to="/charts">Explorar</NuxtLink>
        <NuxtLink to="/search">Buscar</NuxtLink>
        <NuxtLink to="/about">Acerca del sitio</NuxtLink>
      </nav>
    </div>
  </header>
</template>
