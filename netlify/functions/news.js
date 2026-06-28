exports.handler = async (event) => {
  const apiKey = process.env.VITE_NEWSAPI_KEY || process.env.NEWSAPI_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: 'Missing NewsAPI key' }),
    };
  }

  const params = event.queryStringParameters || {};
  const searchParams = new URLSearchParams({
    category: params.category || 'technology',
    language: params.language || 'en',
    pageSize: params.pageSize || '100',
    apiKey,
  });

  const response = await fetch(`https://newsapi.org/v2/top-headlines?${searchParams}`);
  const data = await response.json();

  return {
    statusCode: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  };
};
