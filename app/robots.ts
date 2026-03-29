import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/setup'],
    },
    sitemap: 'https://templojireh.cl/sitemap.xml',
  }
}
