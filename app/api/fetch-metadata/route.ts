import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParams = searchParams.get('url');

  if (!urlParams) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  let finalUrl = urlParams;
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'https://' + finalUrl;
  }

  try {
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ title: '' }); // Fail gracefully
  }
}
