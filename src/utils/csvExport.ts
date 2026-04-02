import type { CmcListing, CmcUrls } from '../types/cmc'
import { getQuote } from './sortListings'
import { firstHttp } from './url'

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function n(v: number | undefined): string {
  if (v == null || Number.isNaN(v)) return ''
  return String(v)
}

const HEADERS = [
  'cmc_rank',
  'id',
  'name',
  'symbol',
  'slug',
  'date_added',
  'quote_currency',
  'price',
  'market_cap',
  'volume_24h',
  'percent_change_24h',
  'percent_change_7d',
  'website_url',
  'explorer_url',
  'technical_doc_url',
  'source_code_url',
  'twitter_url',
  'reddit_url',
  'facebook_url',
  'chat_url',
  'announcement_url',
  'message_board_url',
] as const

export function buildCmcListingsCsv(
  rows: CmcListing[],
  convert: string,
  urlsById: Record<number, CmcUrls | undefined>,
): string {
  const lines: string[] = [
    HEADERS.map((h) => escapeCsvCell(h)).join(','),
  ]

  for (const row of rows) {
    const q = getQuote(row, convert)
    const u = urlsById[row.id]
    const cells = [
      n(row.cmc_rank),
      n(row.id),
      row.name,
      row.symbol,
      row.slug,
      row.date_added ?? '',
      convert,
      n(q?.price),
      n(q?.market_cap),
      n(q?.volume_24h),
      n(q?.percent_change_24h),
      n(q?.percent_change_7d),
      firstHttp(u?.website) ?? '',
      firstHttp(u?.explorer) ?? '',
      firstHttp(u?.technical_doc) ?? '',
      firstHttp(u?.source_code) ?? '',
      firstHttp(u?.twitter) ?? '',
      firstHttp(u?.reddit) ?? '',
      firstHttp(u?.facebook) ?? '',
      firstHttp(u?.chat) ?? '',
      firstHttp(u?.announcement) ?? '',
      firstHttp(u?.message_board) ?? '',
    ]
    lines.push(cells.map((c) => escapeCsvCell(c)).join(','))
  }

  return `\uFEFF${lines.join('\r\n')}`
}

export function downloadCsvFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(url)
}

export function defaultCsvFilename(): string {
  const d = new Date()
  const pad = (x: number) => String(x).padStart(2, '0')
  return `cmc-tokens-${String(d.getFullYear())}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.csv`
}
