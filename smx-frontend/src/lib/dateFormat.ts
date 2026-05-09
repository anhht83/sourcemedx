import { format } from 'date-fns'

export const shortFormattedDate = (date?: string): string =>
  date ? format(date, 'dd MMM') : ''

export const defaultFormattedDate = (date?: string): string =>
  date ? format(date, 'dd MMM yyyy') : ''
