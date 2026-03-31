import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [totalPosts, scheduledPosts, publishedPosts, variantsByPlatform] =
      await Promise.all([
        db.contentItem.count(),
        db.scheduledPost.count({ where: { status: 'pending' } }),
        db.publishedPost.count(),
        db.contentVariant.groupBy({
          by: ['platform'],
          _count: { platform: true },
        }),
      ])

    const platformBreakdown: Record<string, number> = {}
    variantsByPlatform.forEach((item) => {
      platformBreakdown[item.platform] = item._count.platform
    })

    return NextResponse.json({
      totalPosts,
      totalScheduled: scheduledPosts,
      totalPublished: publishedPosts,
      platformBreakdown,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({
      totalPosts: 0,
      totalScheduled: 0,
      totalPublished: 0,
      platformBreakdown: {},
    })
  }
}