import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// This simulates publishing — in production this would call real APIs
export const dynamic = 'force-dynamic'
export async function POST() {
  try {
    // Find all pending posts that are due
    const duePosts = await db.scheduledPost.findMany({
      where: {
        status: 'pending',
        scheduledAt: {
          lte: new Date()
        }
      },
      include: {
        variant: {
          include: {
            contentItem: true
          }
        }
      }
    })

    const published = []

    for (const post of duePosts) {
      // Simulate publishing to platform
      const mockPostUrl = `https://${post.platform.toLowerCase().replace('/', '')}.com/post/${Math.random().toString(36).substr(2, 9)}`

      // Create published post record
      await db.publishedPost.create({
        data: {
          scheduledPostId: post.id,
          platformPostId: `mock_${Date.now()}`,
          publishedAt: new Date(),
          url: mockPostUrl,
        }
      })

      // Update scheduled post status
      await db.scheduledPost.update({
        where: { id: post.id },
        data: { status: 'published' }
      })

      // Update variant status
      await db.contentVariant.update({
        where: { id: post.variantId },
        data: { status: 'published' }
      })

      published.push({
        platform: post.platform,
        topic: post.variant.contentItem.topic,
        url: mockPostUrl,
      })
    }

    return NextResponse.json({
      success: true,
      published: published.length,
      posts: published,
      message: published.length > 0
        ? `Published ${published.length} post(s)`
        : 'No posts due for publishing'
    })
  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}