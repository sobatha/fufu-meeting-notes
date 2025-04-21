import { NextResponse } from 'next/server';
// @ts-ignore: googleapis has no type declarations
import { google } from 'googleapis';

interface NotesBody {
  notes: Record<number, { mood: string; note: string }>;
}

const sheetId = '1W4crPzWA90H5otNnz9FxCPSYzvii4BQMBkk8Yf_Q58U';
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCWvf9yT1sCU0JS\niCitaiwMd57xhb82xtQgfLPT4rbk08NRBZjTfBmdephXSFeRI+fDpecTcmv0FV/m\nWnU0wEHAQZxoABRMIDfgbz7gcVmJTEL2XiGDajY9gngjKXVx6w2+UpwfPtFDPZfi\nSq3TNeI21SyWmCugflWC3W1Epy2cVAnuY/ckaA39dSqvBPuKJOI3ozb+kNfpKfxh\ng5ckM4Ga4ENRfgQ6CAFtAveXkE/YYOpd1cAci6bXoMkb1jFBkxirg0IykVGW9S1H\n5ozGNAwvm5w/H1MAvw5/j00rJGtz+hAlQvPAhRxnkHvvVDOyyTJx3XNLHPbp7Z5A\nNw6z/s6zAgMBAAECggEAKNC/JuNnwARtM82cPgA+dw24oqrVMG67pyQ8yMVdQi44\nd2qti63RfbthHlj/JNR0/5ufKrvTkR5sfgHGNIdOBlF9mQdUd5xNpN5aRwlJ9gwJ\nIY4xQtTyZMs73kFuhG7hpMPXc/pdTPiTdHlGAadYXgJwdUI0pdsvKiTsXidqCSap\nkkbT/hS1tedx8DEqLPa9fy7nJtonSbHANvPcr/oddn/MSPTCaV1VrjQ/9Bji88mX\njF7igFbeNU8wImvPlS8cn0jvn46qhUofW8cMILwoHW3TlYfX7Oo1sixEhPunJ77P\nTciO5oyYjvMM0ClTWDfx3QkecCzL+9bj5v1OI+ncgQKBgQDPp7GROaMbOkGEqydC\ntlS0r7gosKDJVtPglSvDUz4N3ASYog2fKDZgdF1Gj+LNzPccUUZkAlY00Zj0fL71\nfkU6yS6wKv6vf4emBWJU+H04iaLbSxdcU2UyColYIJeJIEb76ftRUPBJsL7c4fsS\nINJ6/UFzzvz1UuuGh65FpwW98wKBgQC51kdveAKROtbb3/TxiVgkU+7yO9tWmxe+\nY+hmy/hUw0TTSQnUr7i+BMfwIH5rOfXIBO++6CwIB13V5Ylga8SZtnN1h6mSAanL\nGFspR3TE/zN4RFLJq24qPWUTga7FKkCeIHopONbz/Qnq1P7xcxnfgQfqolokoyg9\nhS/jA/EcQQKBgA1zSkAi4JrB4j6Kq4dZshDmFOKl1jRUaHLylpwXRzy0lKOiU4mM\nnEERKH2KkmFMNnFiHlIaCKVxMhwb/G6AWFGfeGO21Tpe41VwodbpJYtE9wSHT6MO\nT862+gB4U/hw28gzdrDksjvDtAkwpgedkqSexN+Qd7gYP+M95J7kW63bAoGAGkE+\nyG3RFwmUD25dob5AuKkvCgQQ4fR5b0mYLOXGSNtpntwjymulExuDz9YXZjjDE6Y2\n5ObSSbQYur56ISg4l2ridwlamKkpfusK/hL9WVOgxu4IMDvLDaas4AujUHG+vVhj\nSe2g2Mm4G/hJqH0Ve7E0GB8l0yVF6yMk99K3vsECgYA+sl9dHDUrOvLF+Jv+rD7Z\nn8fB/D/jSKDZ8dud3DTFPnCyAHjEGtuyaX1XSV0LY2wFR0zv87DgzGUkC2aQ5gpK\n36RxYMP473mHa/miZNgA4CNOFulP/6AkVbVgyZnrz6zlkm3MEMIDR3CC8+qH4bOa\noZE6aETs7Qgw3ozI6/zYsw==\n-----END PRIVATE KEY-----\n";
const clientEmail = 'cloud-flare-worker@fufu-meeting.iam.gserviceaccount.com';

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
      range: 'Sheet1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error appending to sheet', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
