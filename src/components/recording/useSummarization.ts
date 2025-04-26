import { useState } from 'react';

/**
 * Custom hook to summarize transcripts by calling the summarize API.
 */
export function useSummarization() {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const summarize = async (transcript: string) => {
    if (!transcript) return;
    setIsSummarizing(true);
    setSummary('');
    setDocUrl('');
    setSummaryError(null);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = (await res.json()) as { summary?: string; docUrl?: string; error?: string };
      if (res.ok) {
        setSummary(data.summary ?? '');
        setDocUrl(data.docUrl ?? '');
      } else {
        setSummaryError(data.error ?? 'Summarization failed');
      }
    } catch (err: any) {
      setSummaryError(err.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  return { summary, docUrl, isSummarizing, summaryError, summarize };
}
