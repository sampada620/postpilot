import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export async function POST() {
  try {
    // Check if default workspace exists
    const existing = await db.workspace.findFirst({
      where: { id: 'default' }
    })

    if (existing) {
      return NextResponse.json({ workspace: existing })
    }

    // Create default workspace
    const workspace = await db.workspace.create({
      data: {
        id: 'default',
        name: 'My Workspace',
        plan: 'free',
      }
    })

    return NextResponse.json({ workspace })
  } catch (error) {
    console.error('Workspace error:', error)
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const workspace = await db.workspace.findFirst()
    return NextResponse.json({ workspace })
  } catch (error) {
    return NextResponse.json({ workspace: null })
  }
}