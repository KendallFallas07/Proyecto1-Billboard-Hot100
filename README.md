# Proyecto 1 - Billboard Hot 100

Universidad Nacional  
Curso: Arquitectura de Informacion  
Proyecto 1  
Codigo: 402630177

## Descripcion

Sitio en Nuxt 4 para explorar un dataset grande del Billboard Hot 100. La informacion se organiza de forma cronologica:

**Decada - Año - Semana del ranking - Canciones**

El sitio incluye busqueda, paginacion, breadcrumbs, detalle de registros e imagenes con placeholder cuando no existe una URL valida.

## Dataset

El dataset usado por el proyecto esta en:

```text
dataset/hot100.csv
```

Columnas esperadas:

- `Date`
- `Song`
- `Artist`
- `Rank`
- `Last Week`
- `Peak Position`
- `Weeks in Charts`
- `Image URL`

No se debe cambiar la estructura del CSV original.

## Requisitos

1. Instalar Node.js 18 o superior.
2. Instalar npm.

## Ejecutar en desarrollo

Desde la carpeta raiz del proyecto:

```bash
npm install
npm run dev
```

Abrir en el navegador:

```text
http://localhost:3000
```

Antes de iniciar Nuxt, el proyecto prepara automaticamente los datos desde `dataset/hot100.csv`.

## Preparar y validar datos

```bash
npm run prepare:data
npm run validate:project
```

Los archivos optimizados se generan en `public/data/`.

## Build

```bash
npm run build
```

## Generar version final

```bash
npm run generate
```

Para Netlify, el proyecto ya incluye `netlify.toml` con:

- comando: `npm run generate`
- carpeta publicada: `.output/public`

## URL de Netlify

Pegar aqui la URL cuando el sitio este publicado:

```text
URL_DE_NETLIFY_AQUI
```

## Rutas principales

- `/` inicio
- `/charts` decadas
- `/charts/[decade]` años de una decada
- `/charts/[decade]/[year]` semanas y registros de un año
- `/charts/[decade]/[year]/[date]` ranking de una semana
- `/record/[id]` detalle de un registro
- `/search` busqueda global
- `/about` explicacion breve del sitio

## No incluir en la entrega

No subir estas carpetas generadas:

- `node_modules`
- `.nuxt`
- `.output`
- `dist`
