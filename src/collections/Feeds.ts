import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { outputFormatOptions } from '@/constants/outputFormats'

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
      options: outputFormatOptions.map(({ label, value }) => ({ label, value })),
      defaultValue: 'json',
      required: true,
    },
    {
      name: 'template',
      type: 'textarea',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    ...slugField(),
  ],

  hooks: {
    beforeChange: [
      //update the URL field acording to the Feed's slug
      ({ data, req }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
        if (data?.slug) data.url = `${baseUrl}/api/feed-endpoints/${data.slug}`
        return data
      },
    ],
  },
}
