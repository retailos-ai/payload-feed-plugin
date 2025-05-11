export type ContentType = 'json' | 'xml' | 'html'

export const contentTypeOptions: {
  label: string
  value: ContentType
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
