// src/collections/Feeds/index.ts

import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { contentTypeOptions } from '@/constants/ContentTypes'
import { feedAllowedCollections } from '@/constants/feedAllowedCollections'
import { randomBytes } from 'crypto'
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
      unique: true,
    },
    {
      name: 'Description',
      type: 'textarea',
    },

    {
      name: 'content_type',
      label: 'Content Type',
      type: 'select',
      options: contentTypeOptions.map(({ label, value }) => ({ label, value })),
      defaultValue: 'json',
      required: true,
    },

    {
      name: 'collection',
      label: 'Collection',
      type: 'select',
      options: await feedAllowedCollections,
      required: true,
    },

    {
      name: 'pagination_enabled',
      label: 'Enable Pagination',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      type: 'row',
      fields: [
        {
          name: 'pagination_page',
          label: 'Default Page',
          type: 'number',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'pagination_limit',
          label: 'Items Per Page',
          type: 'number',
          admin: {
            width: '50%',
          },
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.pagination_enabled === true,
      },
    },

    {
      name: 'template',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
      },
    },

    {
      name: 'is_active',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },

    ...slugField(),
    {
      name: 'type_name',
      label: 'Type Name',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'token',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },

    {
      name: 'last_Modified_By',
      label: 'Last Modified By',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ operation, data, req }) => {
        if (req.user) data.last_Modified_By = req.user.id

        // genreate token
        if (operation === 'create' || !data.token) {
          const token = randomBytes(16).toString('hex')
          data.token = token.toString()
        }

        //update slug from name
        if (!data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9\-]/g, '')
        }

        //update the URL field acording to the Feed's slug
        if (!process.env.NEXT_PUBLIC_SERVER_URL)
          throw new Error('Missing NEXT_PUBLIC_SERVER_URL in environment variables')
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
        const url = new URL(`${baseUrl}/feeds/${data.slug}`)
        url.searchParams.set('token', data.token || '')

        // add pagination settings
        if (data?.pagination_enabled) {
          if (data.pagination_page) url.searchParams.set('page', data.pagination_page.toString())
          if (data.pagination_limit) url.searchParams.set('limit', data.pagination_limit.toString())
        }

        data.url = url.toString()
        return data
      },
    ],
  },

  versions: {
    maxPerDoc: 50,
  },
}
