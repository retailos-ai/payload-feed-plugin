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
      name: 'template_language',
      label: 'Template Language',
      type: 'select',
      options: [
        { label: 'JSON', value: 'json' },
        { label: 'XML', value: 'USD' },
        { label: 'HTML', value: 'EUR' },
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
