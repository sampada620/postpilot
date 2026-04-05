export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const existing = await db.workspace.findFirst({
      where: { id: 'default' }
    })

    if (existing) {
      return NextResponse.json({
        message: 'Workspace already exists',
        workspace: existing
      })
    }

    const workspace = await db.workspace.create({
      data: {
        id: 'default',
        name: 'My Workspace',
        plan: 'free',
      }
    })

    return NextResponse.json({
      message: 'Workspace created!',
      workspace
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}