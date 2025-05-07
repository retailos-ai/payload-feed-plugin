import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Liquid } from 'liquidjs'
import { outputFormatOptions } from '@/constants/outputFormats'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params

  // verify access token
  const token = req.nextUrl.searchParams.get('token')
  const secret = process.env.FEED_JWT_SECRET
  try {
    let decoded = jwt.verify(token || '', secret!)
    if (typeof decoded !== 'object' || decoded.slug !== slug) throw new Error('Slug mismatch')
  } catch (err) {
    return new NextResponse('Forbidden: Invalid or missing token', { status: 403 })
  }

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

  // pagination settings
  const usePagination = feed.pagination_enabled === true
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100')

  // get products from db
  const productsQuery = await payload.find({
    collection: 'products',
    pagination: usePagination,
    ...(usePagination ? { page, limit } : {}),
  })
  const products = productsQuery.docs

  // work on tamplate
  const dataForTemplate = {
    products,
    pagination: usePagination
      ? {
          page: productsQuery.page,
          total: productsQuery.totalDocs,
          totalPages: productsQuery.totalPages,
          hasNext: productsQuery.hasNextPage,
          hasPrev: productsQuery.hasPrevPage,
        }
      : undefined,
  }

  const engine = new Liquid()
  const rendered = await engine.parseAndRender(feed.template, dataForTemplate)

  const selectedFormat = outputFormatOptions.find((f) => f.value === feed.output_format)
  const contentType = selectedFormat?.contentType || 'text/plain'

  return new NextResponse(rendered, {
    headers: {
      'Content-Type': contentType,
    },
  })
}
