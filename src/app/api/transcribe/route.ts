export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { NextRequest } from 'next/server';

// POST /api/transcribe
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Send to Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file as any,
      model: 'whisper-1',
      response_format: 'text'
    });

    // Extract text and return
    const transcriptionData = transcription as any;
    const transcript = transcriptionData.text ?? transcriptionData;
    return NextResponse.json({ transcript });
  } catch (err: any) {
    console.error('Transcription error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
