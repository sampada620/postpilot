import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Auth handled by custom JWT' })
}

export async function POST() {
  return NextResponse.json({ message: 'Auth handled by custom JWT' })
}