
import { format } from 'date-fns'

export function readable(iso: string): string {
  return format(new Date(iso), 'PPP p')
}
