export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

interface DiscussionItem {
  id: string;
  name: string;
}

// Load Google Sheets credentials from environment
const discussionSheetId = process.env.MEETING_ITEM_ID!;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL!;
const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
  privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  const sheets = google.sheets({ version: 'v4', auth });

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: discussionSheetId,
      range: 'A:B',
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      const items: DiscussionItem[] = rows.slice(1).map((row) => ({
        id: row[0],
        name: row[1],
      }));
      return NextResponse.json({ success: true, items });
    } else {
      return NextResponse.json({ success: true, items: [] });
    }
  } catch (error: unknown) {
    console.error('Error reading from sheet', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, name } = (await req.json()) as DiscussionItem;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: discussionSheetId,
        range: 'A:A',
    });

    const rows = response.data.values;
    if (!rows) {
        return NextResponse.json({ success: false, error: 'Could not find item to update' }, { status: 404 });
    }

    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
        return NextResponse.json({ success: false, error: 'Could not find item to update' }, { status: 404 });
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: discussionSheetId,
      range: `B${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[name]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating sheet', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
