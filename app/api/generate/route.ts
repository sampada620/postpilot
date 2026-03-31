import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const platformPrompts: Record<string, string> = {
  'Blog':       'Write an 800 word blog post with H2 headings and practical insights.',
  'LinkedIn':   'Write a 300 word LinkedIn post. Strong hook, short paragraphs, 3 key insights, end with a question. Add 3 hashtags.',
  'Twitter/X':  'Write a Twitter thread of 5 tweets numbered (1/, 2/, etc.). Hook first, CTA last. Under 270 chars each.',
  'Instagram':  'Write an Instagram caption of 100 words with line breaks. End with 8 hashtags.',
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      )
    }

    const { topic, platforms, tone } = await req.json()

    if (!topic || !platforms?.length) {
      return NextResponse.json(
        { error: 'Topic and platforms are required' },
        { status: 400 }
      )
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const promises = platforms.map(async (platform: string) => {
      const prompt = platformPrompts[platform] || platformPrompts['LinkedIn']

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert content writer. Write in a ${tone || 'Professional'} tone.`,
          },
          {
            role: 'user',
            content: `Topic: "${topic}"\n\n${prompt}`,
          },
        ],
        max_tokens: 1000,
      })

      const content = completion.choices[0]?.message?.content || ''
      return [platform, content]
    })

    const results = await Promise.all(promises)
    const content = Object.fromEntries(results)

    // Save to DB
    try {
      const { db } = await import('@/lib/db')
      await db.contentItem.create({
        data: {
          topic,
          status: 'draft',
          workspaceId: 'default',
          variants: {
            create: Object.entries(content).map(([platform, body]) => ({
              platform,
              body: body as string,
              status: 'draft',
            })),
          },
        },
      })
    } catch (dbError) {
      console.error('DB save failed:', dbError)
    }

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}