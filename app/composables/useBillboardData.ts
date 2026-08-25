import type { BillboardManifest, BillboardRecord, SearchRecord } from '~/types/billboard'

let manifestCache: BillboardManifest | null = null
const yearCache = new Map<string, BillboardRecord[]>()
let searchCache: SearchRecord[] | null = null

export const useBillboardData = () => {
  const loadManifest = async (): Promise<BillboardManifest> => {
    if (manifestCache) return manifestCache
    manifestCache = await $fetch<BillboardManifest>('/data/manifest.json')
    return manifestCache
  }

  const loadYear = async (year: string): Promise<BillboardRecord[]> => {
    if (yearCache.has(year)) return yearCache.get(year)!
    const records = await $fetch<BillboardRecord[]>(`/data/years/${encodeURIComponent(year)}.json`)
    yearCache.set(year, records)
    return records
  }

  const loadSearchIndex = async (): Promise<SearchRecord[]> => {
    if (searchCache) return searchCache
    searchCache = await $fetch<SearchRecord[]>('/data/search-index.json')
    return searchCache
  }

  const formatDate = (value: string | null | undefined): string => {
    if (!value) return 'Sin fecha'
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) return value
    const [, year, month, day] = match
    return `${day}/${month}/${year}`
  }

  const recordPath = (record: Pick<BillboardRecord, 'id'> | Pick<SearchRecord, 'id'>) =>
    `/record/${encodeURIComponent(record.id)}`

  const weekPath = (date: string) => {
    const year = date.slice(0, 4)
    const decade = /^\d{4}$/.test(year) ? `${year.slice(0, 3)}0` : 'unknown'
    return `/charts/${encodeURIComponent(decade)}/${encodeURIComponent(year)}/${encodeURIComponent(date)}`
  }

  return {
    loadManifest,
    loadYear,
    loadSearchIndex,
    formatDate,
    recordPath,
    weekPath
  }
}
