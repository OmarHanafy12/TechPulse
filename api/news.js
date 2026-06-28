export default async function handler(req, res) {
  const apiKey = process.env.VITE_NEWSAPI_KEY || process.env.NEWSAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ status: 'error', message: 'Missing NewsAPI key' });
  }

  const { category = 'technology', language = 'en', pageSize = '100' } = req.query;

  const searchParams = new URLSearchParams({
    category,
    language,
    pageSize,
    apiKey,
  });

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?${searchParams}`);
    const data = await response.json();

    // Enable CORS just in case
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
