<script setup lang="ts">
import type { BillboardRecord, SearchRecord } from '~/types/billboard'

defineProps<{
  records: Array<BillboardRecord | SearchRecord>
  showDate?: boolean
}>()

const { formatDate, recordPath, weekPath } = useBillboardData()
</script>

<template>
  <div class="table-wrap">
    <table class="record-table">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Posicion</th>
          <th>Cancion</th>
          <th>Artista</th>
          <th v-if="showDate">Semana</th>
          <th>Semana anterior</th>
          <th>Mejor posicion</th>
          <th>Semanas</th>
          <th><span class="sr-only">Detalle</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>
            <NuxtLink :to="recordPath(record)" class="image-link">
              <RecordImage :src="record.imageUrl" :title="record.title" :artist="record.artist" />
            </NuxtLink>
          </td>
          <td class="rank-cell">#{{ record.rank ?? '-' }}</td>
          <td>
            <NuxtLink :to="recordPath(record)" class="record-title">{{ record.title }}</NuxtLink>
          </td>
          <td>{{ record.artist }}</td>
          <td v-if="showDate">
            <NuxtLink :to="weekPath(record.date)">{{ formatDate(record.date) }}</NuxtLink>
          </td>
          <td>{{ 'lastWeek' in record ? record.lastWeek ?? '-' : '-' }}</td>
          <td>{{ record.peak ?? '-' }}</td>
          <td>{{ record.weeks ?? '-' }}</td>
          <td><NuxtLink :to="recordPath(record)" class="detail-link">Ver</NuxtLink></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
