export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { summarizeTranscript, saveSummaryToGoogleDoc } from './services';

export async function POST(req: NextRequest) {
  try {
    const { transcript } = (await req.json()) as { transcript: string };
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    // Generate summary
    const summary = await summarizeTranscript(transcript);

    // Save to Google Docs
    const docUrl = await saveSummaryToGoogleDoc(summary);

    return NextResponse.json({ summary, docUrl });
  } catch (err: unknown) {
    console.error('Summary error', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
