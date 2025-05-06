export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

interface NotesBody {
  userId: string;
  notes: Record<number, { mood: string; note: string }>;
}

// Load Google Sheets credentials from environment
const husbandSheetId = process.env.PERSONAL_SHEET_ID_HUSBAND!;
const wifeSheetId = process.env.PERSONAL_SHEET_ID_WIFE!;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL!;
const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

const getSheetId = (userId: string) =>
  userId.startsWith('n') ? wifeSheetId : husbandSheetId;

export async function POST(req: Request) {
  try {
    const { userId, notes } = (await req.json()) as NotesBody;
    const sheetId = getSheetId(userId);
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
  } catch (error: unknown) {
    console.error('Error appending to sheet', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
