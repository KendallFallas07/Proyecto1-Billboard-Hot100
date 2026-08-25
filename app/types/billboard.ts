export interface BillboardRecord {
  id: string
  date: string
  year: string
  decade: string
  rank: number | null
  title: string
  artist: string
  lastWeek: number | null
  peak: number | null
  weeks: number | null
  imageUrl: string
}

export interface YearSummary {
  year: string
  label: string
  count: number
  firstDate: string | null
  lastDate: string | null
  file: string
}

export interface DecadeSummary {
  decade: string
  label: string
  count: number
  years: string[]
}

export interface BillboardManifest {
  generatedAt: string
  sourceFile: string
  totalRecords: number
  minDate: string | null
  maxDate: string | null
  artistCount: number
  availableFields: string[]
  years: YearSummary[]
  decades: DecadeSummary[]
  warnings: string[]
}

export interface SearchRecord {
  id: string
  date: string
  year: string
  decade: string
  rank: number | null
  title: string
  artist: string
  lastWeek: number | null
  peak: number | null
  weeks: number | null
  imageUrl: string
}
