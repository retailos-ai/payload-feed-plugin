// src/collections/Feeds.ts

import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { outputFormatOptions } from '@/constants/outputFormats'
import { feedAllowedCollections } from '@/constants/feedAllowedCollections'
import jwt from 'jsonwebtoken'

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
      name: 'collection',
      label: 'Collection',
      type: 'select',
      options: await feedAllowedCollections,
      required: true,
    },
    {
      name: 'template',
      type: 'textarea',
      required: true,
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
    {
      name: 'url',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },

    {
      name: 'pagination_enabled',
      label: 'Enable Pagination',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'pagination_page',
      label: 'Default Page',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.pagination_enabled === true,
      },
    },
    {
      name: 'pagination_limit',
      label: 'Items Per Page',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.pagination_enabled === true,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        //update slug from name
        if (typeof data?.name === 'string') {
          data.slug = data.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9\-]/g, '')
        }

        //update the URL field acording to the Feed's slug
        if (!process.env.NEXT_PUBLIC_SERVER_URL)
          throw new Error('Missing NEXT_PUBLIC_SERVER_URL in environment variables')
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
        const url = new URL(`${baseUrl}/api/feed-endpoints/${data.slug}`)

        // generate token and add to url
        if (!process.env.FEED_JWT_SECRET)
          throw new Error('Missing FEED_JWT_SECRET in environment variables')
        const secret = process.env.FEED_JWT_SECRET
        const token = jwt.sign(
          {
            slug: data.slug,
          },
          secret,
          {
            algorithm: 'HS256',
          },
        )
        url.searchParams.set('token', token || '')

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
}
