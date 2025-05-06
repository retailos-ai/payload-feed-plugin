import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Liquid } from 'liquidjs'
import { outputFormatOptions } from '@/constants/outputFormats'

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  // get access token from the quary
  const token = req.nextUrl.searchParams.get('token')
  if (token !== process.env.FEED_ACCESS_TOKEN) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  // ***

  // get template
  const { slug } = context.params

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

  const { template } = feed
  // ***

  // get products from db
  const productsQuery = await payload.find({
    collection: 'products',
    pagination: false,
  })
  const products = productsQuery.docs
  const dataForTemplate = { products }
  // ***

  const engine = new Liquid()
  const rendered = await engine.parseAndRender(template, dataForTemplate)

  const selectedFormat = outputFormatOptions.find((f) => f.value === feed.output_format)
  const contentType = selectedFormat?.contentType || 'text/plain'

  return new NextResponse(rendered, {
    headers: {
      'Content-Type': contentType,
    },
  })
}
