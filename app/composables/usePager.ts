import type { ComputedRef, Ref } from 'vue'

export const usePager = <T>(items: Ref<T[]> | ComputedRef<T[]>, pageSize = 50) => {
  const route = useRoute()
  const router = useRouter()

  const page = computed(() => {
    const raw = Number(route.query.page || 1)
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)))
  const safePage = computed(() => Math.min(page.value, totalPages.value))
  const start = computed(() => (safePage.value - 1) * pageSize)
  const pagedItems = computed(() => items.value.slice(start.value, start.value + pageSize))

  const setPage = async (newPage: number) => {
    const target = Math.min(Math.max(1, newPage), totalPages.value)
    await router.push({ query: { ...route.query, page: target === 1 ? undefined : String(target) } })
    if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  watch(totalPages, async () => {
    if (page.value > totalPages.value) await setPage(totalPages.value)
  })

  return { page: safePage, totalPages, pagedItems, setPage }
}
