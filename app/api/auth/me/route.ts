export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ user: null })
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, image: true }
    })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}