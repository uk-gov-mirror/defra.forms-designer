import { format, toDate } from '~/src/models/forms/history-date-utils.js'

/**
 * Formats a date/time for display in UK timezone (Europe/London)
 * @param {string | Date} value
 * @param {string} formattedDateStr
 */
export function formatDateTime(value, formattedDateStr) {
  return format(toDate(value), formattedDateStr)
}
