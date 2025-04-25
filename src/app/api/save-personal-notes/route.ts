export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
// @ts-ignore: googleapis has no type declarations
import { google } from 'googleapis';

interface NotesBody {
  notes: Record<number, { mood: string; note: string }>;
}

// Load Google Sheets credentials from environment
const sheetId = process.env.GOOGLE_SHEET_ID!;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL!;
const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');


export async function POST(req: Request) {
  try {
    const { notes } = (await req.json()) as NotesBody;
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    const sheets = google.sheets({ version: 'v4', auth });
    const values = [
      [
        new Date().toISOString(),
        notes[1].mood,
        notes[1].note,
        notes[2].mood,
        notes[2].note,
        notes[3].mood,
        notes[3].note,
      ],
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      valueInputOption: 'RAW',
      range: 'A:G',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { 
        values 
      },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error appending to sheet', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
