// src/app/(frontend)/feeds/[slug]/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Liquid } from 'liquidjs'
import { contentTypeOptions } from '@/constants/ContentTypes'
import { feedAllowedCollections } from '@/constants/feedAllowedCollections'

import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params

  // get feed according to slug
  const payload = await getPayload({ config: configPromise })
  const feedDoc = await payload.find({
    collection: 'feeds',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const feed = feedDoc.docs?.[0]
  if (!feed) return new NextResponse('Feed not found', { status: 404 })

  // verify access token
  const token = req.nextUrl.searchParams.get('token')
  if (token !== feed.token)
    return new NextResponse('Forbidden: Invalid or missing token', { status: 403 })

  // check if Feed is active
  if (!feed.is_active) return new NextResponse('Feed is disabled', { status: 403 })

  // pagination settings
  const usePagination = feed.pagination_enabled === true
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100')

  // get collection
  const collection = feed.collection
  if (!feedAllowedCollections.find((c) => c.value === collection))
    return new NextResponse('Invalid collection', { status: 400 })

  // get items from db
  const itemsQuery = await payload.find({
    collection: collection,
    pagination: usePagination,
    ...(usePagination ? { page, limit } : {}),
  })
  const items = itemsQuery.docs

  // work on tamplate
  const dataForTemplate = {
    items,
    pagination: usePagination
      ? {
          page: itemsQuery.page,
          total: itemsQuery.totalDocs,
          totalPages: itemsQuery.totalPages,
          hasNext: itemsQuery.hasNextPage,
          hasPrev: itemsQuery.hasPrevPage,
        }
      : undefined,
  }

  const engine = new Liquid()
  const rendered = await engine.parseAndRender(feed.template, dataForTemplate)

  const selectedFormat = contentTypeOptions.find((f) => f.value === feed.content_type)
  const contentType = selectedFormat?.contentType || 'text/plain'

  return new NextResponse(rendered, {
    headers: {
      'Content-Type': contentType,
    },
  })
}
