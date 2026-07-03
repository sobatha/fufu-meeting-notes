export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// POST /api/transcribe
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileEntry = formData.get('file');
    if (!fileEntry || typeof fileEntry === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const file = fileEntry as File;

    const apiKey = process.env.DEEPINFRA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'DEEPINFRA_API_KEY is not configured' }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Construct standard web FormData for DeepInfra
    const deepinfraFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type || 'audio/webm' });
    deepinfraFormData.append('audio', blob, file.name || 'audio.webm');
    deepinfraFormData.append('language', 'ja');

    const model = 'openai/whisper-large-v3-turbo';

    const res = await fetch(`https://api.deepinfra.com/v1/inference/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: deepinfraFormData
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `DeepInfra API returned status ${res.status}: ${errorText}` }, { status: res.status });
    }

    const response = await res.json() as { text: string; inference_status: unknown };

    const transcript = response.text;
    return NextResponse.json({ transcript });
  } catch (err: unknown) {
    console.error('[Transcribe API] Error during transcription:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

