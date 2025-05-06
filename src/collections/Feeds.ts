import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
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
      unique: true,
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
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req }) => {
        //update slug from name
        if (typeof data?.name === 'string') {
          data.slug = data.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9\-]/g, '')
        }
        //update the URL field acording to the Feed's slug
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
        if (data?.slug)
          data.url = `${baseUrl}/api/feed-endpoints/${data.slug}?token=${process.env.FEED_ACCESS_TOKEN}`
        return data
      },
    ],
  },
}
