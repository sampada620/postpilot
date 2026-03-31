import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { platform, scheduledAt, content, topic } = await req.json()

    if (!platform || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    const result = await db.contentItem.create({
      data: {
        topic: topic || 'Untitled',
        status: 'scheduled',
        workspaceId: 'default',
        variants: {
          create: {
            platform,
            body: content,
            status: 'scheduled',
            scheduledPost: {
              create: {
                platform,
                scheduledAt: new Date(scheduledAt || new Date()),
                status: 'pending',
              }
            }
          }
        }
      },
      include: {
        variants: {
          include: {
            scheduledPost: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Post scheduled for ${platform}`,
      scheduledPost: result.variants[0]?.scheduledPost
    })
  } catch (error: any) {
    console.error('Schedule error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to schedule' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const posts = await db.scheduledPost.findMany({
      include: {
        variant: {
          include: {
            contentItem: true
          }
        }
      },
      orderBy: { scheduledAt: 'asc' },
    })
    return NextResponse.json({ posts })
  } catch (error: any) {
    return NextResponse.json({ posts: [] })
  }
}