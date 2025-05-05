import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Liquid } from 'liquidjs'

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
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

  let contentType: string

  switch (feed.output_format) {
    case 'json':
      contentType = 'application/json'
      break
    case 'xml':
      contentType = 'application/xml'
      break
    case 'html':
      contentType = 'text/html'
      break
    default:
      contentType = 'text/plain'
  }

  return new NextResponse(rendered, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
