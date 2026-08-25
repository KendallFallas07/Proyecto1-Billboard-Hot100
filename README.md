# Proyecto 1 - Billboard Hot 100

Universidad Nacional  
Escuela de Informática  
Arquitectura de Información

**Estudiante:** Kendall David Fallas Mena  
**Cédula:** 402630177

## Descripcion

Sitio desarrollado con Nuxt para explorar el dataset historico Billboard Hot 100.

La organizacion principal del sitio es:

```text
Década -> Año -> Fecha del ranking -> Registro
```

El proyecto tambien incorpora busqueda y paginacion para facilitar la navegacion del conjunto de datos.

## Dataset

El archivo utilizado es:

```text
dataset/hot100.csv
```

Corresponde al conjunto asignado Billboard Hot 100 e incluye informacion como fecha, cancion, artista, posicion, posicion de la semana anterior, mejor posicion, semanas en lista y URL de imagen.

## Sitio publicado

**Netlify:**  
https://6a8cf05b8870c00008db649f--proyecto1-billboard-hot100.netlify.app/

## Ejecucion local

Requisitos:

- Node.js 18 o superior
- npm

Pasos:

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://localhost:3000
```

El proyecto genera automaticamente los archivos necesarios a partir de `dataset/hot100.csv`.

## Compilacion

```bash
npm run build
```

Para generar la version estatica:

```bash
npm run generate
```

## Estructura basica

```text
app/
  components/
  pages/
  assets/
dataset/
  hot100.csv
scripts/
nuxt.config.ts
package.json
netlify.toml
README.md
```
