import OpenAI from 'openai';
import { google } from 'googleapis';

/**
 * Generates a summary for a meeting transcript using DeepInfra google/gemma-4-31B-it.
 */
export async function summarizeTranscript(transcript: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.DEEPINFRA_API_KEY!,
    baseURL: 'https://api.deepinfra.com/v1/openai'
  });
  const completion = await openai.chat.completions.create({
    model: 'google/gemma-4-31B-it',
    messages: [
      { role: 'system', content: '詳しく要約を作成してください。' },
      { role: 'user', content: `以下の会議の内容を要約してください。夫婦2人の月次のミーティングの録音の文字起こしです。項目ごとに二人の発言それぞれのまとめを作成し、会議全体のまとめも最後に作成するようにしてください。:\n\n${transcript}` }
    ],
    temperature: 0.5
  });
  return completion?.choices?.[0]?.message?.content?.trim() ?? '';
}

/**
 * Creates a Google Doc with the given summary and returns its edit URL.
 */
export async function saveSummaryToGoogleDoc(summary: string): Promise<string> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive'
    ]
  });
  const docsClient = google.docs({ version: 'v1', auth });
  const driveClient = google.drive({ version: 'v3', auth });
  const doc = await docsClient.documents.create({
    requestBody: { title: `夫婦ミーティング要約 ${new Date().toLocaleString()}` }
  });
  const docId = doc.data.documentId!;
  await docsClient.documents.batchUpdate({
    documentId: docId,
    requestBody: { requests: [ { insertText: { location: { index: 1 }, text: summary } } ] }
  });
  // Move document into specified Google Drive folder if provided
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (folderId) {
    await driveClient.files.update({
      fileId: docId,
      addParents: folderId,
      supportsAllDrives: true,
      fields: 'id, parents'
    });
  }
  return `https://docs.google.com/document/d/${docId}/edit`;
}
