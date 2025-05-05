export type OutputFormat = 'json' | 'xml' | 'html'

export const outputFormatOptions: {
  label: string
  value: OutputFormat
  contentType: string
}[] = [
  {
    label: 'JSON',
    value: 'json',
    contentType: 'application/json',
  },
  {
    label: 'XML',
    value: 'xml',
    contentType: 'application/xml',
  },
  {
    label: 'HTML',
    value: 'html',
    contentType: 'text/html',
  },
]
