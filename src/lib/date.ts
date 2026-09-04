/**
 * Date and Time utilities for handling IST (UTC+05:30) date-time strings
 */

/**
 * Formats a Date object or ISO string into `YYYY-MM-DDTHH:mm` format for `<input type="datetime-local">` in IST.
 */
export function formatToDatetimeLocal(dateStr?: string | null): string {
  if (!dateStr) {
    return formatInISTDatetimeLocal(new Date())
  }

  const trimmed = dateStr.trim()

  // Handle legacy date-only format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00`
  }

  // Handle datetime-local format already passed in (YYYY-MM-DDTHH:mm)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed
  }

  const d = new Date(trimmed)
  if (isNaN(d.getTime())) {
    return formatInISTDatetimeLocal(new Date())
  }

  return formatInISTDatetimeLocal(d)
}

/**
 * Formats a JS Date object into `YYYY-MM-DDTHH:mm` string in IST timezone (Asia/Kolkata).
 */
function formatInISTDatetimeLocal(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '00'

  const year = getPart('year')
  const month = getPart('month')
  const day = getPart('day')
  let hour = getPart('hour')
  if (hour === '24') hour = '00'
  const minute = getPart('minute')

  return `${year}-${month}-${day}T${hour}:${minute}`
}

/**
 * Converts a datetime-local input string (`YYYY-MM-DDTHH:mm`) into a full ISO-8601 timestamp string with IST (+05:30) offset.
 * Example input: `2026-08-09T10:30` -> Output: `2026-08-09T10:30:00+05:30`
 */
export function datetimeLocalToISTISO(dateTimeLocalVal: string): string {
  if (!dateTimeLocalVal) return ''

  const trimmed = dateTimeLocalVal.trim()

  // YYYY-MM-DDTHH:mm
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    return `${trimmed}:00+05:30`
  }

  // YYYY-MM-DDTHH:mm:ss
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return `${trimmed}+05:30`
  }

  // If already contains offset (+ / -) or Z
  return trimmed
}

/**
 * Formats an ISO date string or Date object into a readable date and time string in IST format.
 * Example output: `09/08/2026, 10:30 am` for date+time, or `09/08/2026` for legacy date-only records.
 */
export function formatISTDateTime(dateStr?: string | null): string {
  if (!dateStr) return ''

  try {
    const trimmed = dateStr.trim()

    // Handle legacy YYYY-MM-DD date string directly
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-')
      return `${day}/${month}/${year}`
    }

    const date = new Date(trimmed)
    if (isNaN(date.getTime())) return dateStr

    // Check if timestamp is legacy midnight UTC/IST or contains explicit non-zero time
    const isLegacyMidnight = /T00:00:00(\.000)?(Z|\+00:00|\+05:30)?$/.test(trimmed)

    if (!isLegacyMidnight) {
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    }

    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/**
 * Formats any date string/ISO timestamp into full ISO-8601 format with constant time 00:00:00 and +05:30 offset for frontend display.
 * Example output: `2026-08-09T00:00:00+05:30`
 */
export function toISTFullISOString(dateStr?: string | null): string {
  if (!dateStr) return ''

  const trimmed = dateStr.trim()

  // Extract YYYY-MM-DD pattern directly if present
  const dateMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
  if (dateMatch) {
    return `${dateMatch[1]}T00:00:00+05:30`
  }

  const d = new Date(trimmed)
  if (isNaN(d.getTime())) return trimmed

  // Format to IST date parts
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(d)
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '00'

  const year = getPart('year')
  const month = getPart('month')
  const day = getPart('day')

  return `${year}-${month}-${day}T00:00:00+05:30`
}
