import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const dataDir = path.join(root, 'public', 'data')

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(dataDir, 'manifest.json'), 'utf8'))
  const searchIndex = JSON.parse(await fs.readFile(path.join(dataDir, 'search-index.json'), 'utf8'))

  const ids = new Set()
  let total = 0
  const problems = []

  for (const year of manifest.years) {
    const file = path.join(dataDir, 'years', `${year.year}.json`)
    const records = JSON.parse(await fs.readFile(file, 'utf8'))
    total += records.length

    if (records.length !== year.count) problems.push(`El conteo de ${year.year} no coincide con manifest.json.`)

    for (const record of records) {
      if (!record.id) problems.push(`Registro sin id en ${year.year}.`)
      if (ids.has(record.id)) problems.push(`ID duplicado: ${record.id}`)
      ids.add(record.id)
      if (!record.title) problems.push(`Registro ${record.id} sin título.`)
      if (!record.artist) problems.push(`Registro ${record.id} sin artista.`)
      if (record.year !== year.year) problems.push(`Registro ${record.id} está guardado en un año incorrecto.`)
    }
  }

  if (total !== manifest.totalRecords) problems.push('El total de registros por año no coincide con manifest.json.')
  if (searchIndex.length !== manifest.totalRecords) problems.push('El índice de búsqueda no tiene el mismo total de registros.')
  if (ids.size !== manifest.totalRecords) problems.push('La cantidad de IDs únicos no coincide con el total de registros.')

  if (problems.length) {
    console.error('✗ Validación fallida:')
    for (const problem of problems.slice(0, 30)) console.error(`- ${problem}`)
    if (problems.length > 30) console.error(`- ... y ${problems.length - 30} problemas adicionales.`)
    process.exit(1)
  }

  console.log('✓ manifest.json válido')
  console.log(`✓ ${manifest.years.length} archivos de año válidos`)
  console.log(`✓ ${manifest.totalRecords.toLocaleString('en-US')} IDs únicos`)
  console.log('✓ índice de búsqueda consistente')
  if (manifest.warnings?.length) {
    console.warn('⚠ El preprocesador reportó advertencias:')
    for (const warning of manifest.warnings) console.warn(`- ${warning}`)
  }
}

main().catch(error => {
  console.error('✗ No se pudo validar el proyecto:')
  console.error(error.message)
  process.exit(1)
})
