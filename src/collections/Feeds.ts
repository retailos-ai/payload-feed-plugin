import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Feeds: CollectionConfig = {
  slug: 'feeds',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'output_format',
      label: 'Output Format',
      type: 'select',
      options: [
        { label: 'JSON', value: 'json' },
        { label: 'XML', value: 'xml' },
        { label: 'HTML', value: 'html' },
      ],
      defaultValue: 'json',
      required: true,
    },
    {
      name: 'template',
      type: 'textarea',
      required: true,
    },

    ...slugField(),
  ],
}
