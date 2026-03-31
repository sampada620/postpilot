import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function GET() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
      max_tokens: 50,
    })

    return NextResponse.json({
      success: true,
      message: completion.choices[0].message.content,
      keyExists: !!process.env.GROQ_API_KEY,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      keyExists: !!process.env.GROQ_API_KEY,
    })
  }
}