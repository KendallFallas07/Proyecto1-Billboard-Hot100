import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const sourceFile = 'hot100.csv'
const sourcePath = path.join(root, 'dataset', sourceFile)
const outputDir = path.join(root, 'public', 'data')
const yearsDir = path.join(outputDir, 'years')

const requiredColumns = [
  'Date',
  'Song',
  'Artist',
  'Rank',
  'Last Week',
  'Peak Position',
  'Weeks in Charts',
  'Image URL'
]

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') quoted = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''))
      if (row.some(value => value !== '')) rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''))
    if (row.some(value => value !== '')) rows.push(row)
  }

  if (!rows.length) return []
  const headers = rows[0].map(value => value.trim())
  return rows.slice(1).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])))
}

function toNumber(value) {
  const clean = String(value ?? '').trim()
  if (!clean || ['nan', 'null', '-', '--'].includes(clean.toLowerCase())) return null
  const number = Number(clean.replace(/,/g, ''))
  return Number.isFinite(number) ? number : null
}

function cleanText(value, fallback) {
  const text = String(value ?? '').trim()
  return text || fallback
}

function cleanImageUrl(value) {
  const text = String(value ?? '').trim()
  if (!text || ['nan', 'null', '-', '--'].includes(text.toLowerCase())) return ''
  return /^https?:\/\//i.test(text) ? text : ''
}

function yearFromDate(date) {
  const match = String(date).match(/(19|20)\d{2}/)
  return match ? match[0] : 'unknown'
}

function decadeFromYear(year) {
  return /^\d{4}$/.test(year) ? `${year.slice(0, 3)}0` : 'unknown'
}

function sortRecords(a, b) {
  const dateCompare = b.date.localeCompare(a.date)
  if (dateCompare) return dateCompare
  return (a.rank ?? 9999) - (b.rank ?? 9999)
}

async function main() {
  const rawText = await fs.readFile(sourcePath, 'utf8')
  const rows = parseCsv(rawText.replace(/^\uFEFF/, ''))

  if (!rows.length) throw new Error('dataset/hot100.csv no contiene registros legibles.')

  const missingColumns = requiredColumns.filter(column => !(column in rows[0]))
  if (missingColumns.length) {
    throw new Error(`Faltan columnas en dataset/hot100.csv: ${missingColumns.join(', ')}`)
  }

  const records = rows
    .map(row => {
      const date = cleanText(row.Date, '')
      const year = yearFromDate(date)

      return {
        id: '',
        date,
        year,
        decade: decadeFromYear(year),
        rank: toNumber(row.Rank),
        title: cleanText(row.Song, 'Cancion no disponible'),
        artist: cleanText(row.Artist, 'Artista no disponible'),
        lastWeek: toNumber(row['Last Week']),
        peak: toNumber(row['Peak Position']),
        weeks: toNumber(row['Weeks in Charts']),
        imageUrl: cleanImageUrl(row['Image URL'])
      }
    })
    .sort(sortRecords)
    .map((record, index) => ({ ...record, id: `${record.year}-${String(index + 1).padStart(7, '0')}` }))

  await fs.rm(outputDir, { recursive: true, force: true })
  await fs.mkdir(yearsDir, { recursive: true })

  const byYear = new Map()
  for (const record of records) {
    if (!byYear.has(record.year)) byYear.set(record.year, [])
    byYear.get(record.year).push(record)
  }

  const years = []
  for (const [year, yearRecords] of [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]))) {
    await fs.writeFile(path.join(yearsDir, `${year}.json`), JSON.stringify(yearRecords))
    const dates = yearRecords.map(record => record.date).filter(Boolean).sort()
    years.push({
      year,
      label: year === 'unknown' ? 'Fecha desconocida' : year,
      count: yearRecords.length,
      firstDate: dates[0] || null,
      lastDate: dates.at(-1) || null,
      file: `/data/years/${year}.json`
    })
  }

  const decadeMap = new Map()
  for (const yearInfo of years) {
    const decade = decadeFromYear(yearInfo.year)
    if (!decadeMap.has(decade)) {
      decadeMap.set(decade, {
        decade,
        label: decade === 'unknown' ? 'Sin fecha' : `${decade}s`,
        count: 0,
        years: []
      })
    }
    const group = decadeMap.get(decade)
    group.count += yearInfo.count
    group.years.push(yearInfo.year)
  }

  const decades = [...decadeMap.values()]
    .map(group => ({ ...group, years: group.years.sort((a, b) => b.localeCompare(a)) }))
    .sort((a, b) => b.decade.localeCompare(a.decade))

  const dates = records.map(record => record.date).filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value)).sort()
  const artists = new Set(records.map(record => record.artist).filter(Boolean))

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceFile,
    totalRecords: records.length,
    minDate: dates[0] || null,
    maxDate: dates.at(-1) || null,
    artistCount: artists.size,
    availableFields: requiredColumns,
    years,
    decades,
    warnings: []
  }

  const searchIndex = records.map(({ id, date, year, decade, rank, title, artist, lastWeek, peak, weeks, imageUrl }) => ({
    id, date, year, decade, rank, title, artist, lastWeek, peak, weeks, imageUrl
  }))

  await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  await fs.writeFile(path.join(outputDir, 'search-index.json'), JSON.stringify(searchIndex))

  console.log(`✓ Dataset: ${sourceFile}`)
  console.log(`✓ Registros procesados: ${records.length.toLocaleString('en-US')}`)
  console.log(`✓ Años generados: ${years.length}`)
}

main().catch(error => {
  console.error('\nError preparando el dataset:')
  console.error(error.message)
  process.exit(1)
})
