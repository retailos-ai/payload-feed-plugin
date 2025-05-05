import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'PRODUCT_NAME',
  },
  fields: [
    {
      name: 'PRODUCT_NAME',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'CATALOG_NUMBER',
      label: 'Catalog Number',
      type: 'text',
    },
    {
      name: 'MODEL',
      label: 'Model',
      type: 'text',
    },
    {
      name: 'DETAILS',
      label: 'Product Details',
      type: 'textarea',
    },
    {
      name: 'PRODUCT_URL',
      label: 'Product URL',
      type: 'text',
      required: true,
    },
    {
      name: 'CURRENCY',
      label: 'Currency',
      type: 'select',
      options: [
        { label: 'ILS (₪)', value: 'ILS' },
        { label: 'USD ($)', value: 'USD' },
        { label: 'EUR (€)', value: 'EUR' },
      ],
      defaultValue: 'ILS',
      required: true,
    },
    {
      name: 'PRICE',
      label: 'Price',
      type: 'number',
      required: true,
    },
    {
      name: 'SHIPMENT_COST',
      label: 'Shipment Cost',
      type: 'number',
    },
    {
      name: 'DELIVERY_TIME',
      label: 'Delivery Time (days)',
      type: 'number',
    },
    {
      name: 'PRODUCTCODE',
      label: 'Product Code (ID)',
      type: 'text',
      required: true,
    },
    {
      name: 'PRODUCT_TYPE',
      label: 'Product Type',
      type: 'select',
      options: [
        { label: 'New', value: 'חדש' },
        { label: 'Refurbished', value: 'מחודש' },
        { label: 'Used', value: 'משומש' },
      ],
      required: true,
    },
    {
      name: 'MANUFACTURER',
      label: 'Manufacturer',
      type: 'text',
    },
    {
      name: 'IMAGE',
      label: 'Image URL',
      type: 'text',
    },
    {
      name: 'WARRANTY',
      label: 'Warranty (months)',
      type: 'number',
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'ISZAPPRODUCT',
      label: 'Is ZAP Product',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'ISMARKETPLACEPRODUCT',
      label: 'Is Marketplace Product',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
