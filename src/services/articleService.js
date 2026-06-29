const CACHE_KEY = 'techpulse_articles_cache_v4';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

const topicsList = [
  'Artificial Intelligence',
  'Cybersecurity',
  'Space Tech',
  'Green Tech',
  'Hardware & Infrastructure',
  'Wireless Technology',
];
const domainsList = [
  'Core Network and Cloud',
  'Radio Access Network',
  'Energy and Sustainability',
  'Transport Network',
  'Fixed Access Network',
];

const getApiProvider = () => {
  if (import.meta.env.VITE_NEWSAPI_KEY) return 'newsapi';
  if (import.meta.env.VITE_GNEWS_API_KEY) return 'gnews';
  if (import.meta.env.VITE_NEWSDATA_API_KEY) return 'newsdata';
  return null;
};

const hashUrl = (url) => {
  if (!url) return '';
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const transformArticle = (apiArticle, index, mapping) => {
  const topicIdx = ((apiArticle.title || '').length + index) % topicsList.length;
  const domainIdx = ((apiArticle.description || '').length || index) % domainsList.length;

  return {
    id: mapping.id(apiArticle) || String(index),
    title: apiArticle.title,
    summary: apiArticle.description,
    content: apiArticle.content,
    domain: domainsList[domainIdx],
    topic: topicsList[topicIdx],
    publicationDate: mapping.pubDate(apiArticle),
    imageUrls: mapping.image(apiArticle) ? [mapping.image(apiArticle)] : [],
    referenceUrl: {
      name: mapping.sourceName(apiArticle) || 'External Source',
      link: mapping.link(apiArticle),
    },
  };
};
async function fetchFromApi() {
  const provider = getApiProvider();

  if (provider === 'newsapi') {
    const response = await fetch('/api/news?category=technology&language=en&pageSize=100');

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message || 'NewsAPI error');
    }

    return (data.articles || []).map((art, idx) => transformArticle(art, idx, {
      id: a => hashUrl(a.url),
      pubDate: a => a.publishedAt,
      image: a => a.urlToImage,
      sourceName: a => a.source?.name,
      link: a => a.url,
    }));
  }

  if (provider === 'newsdata') {
    const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&category=technology&language=en`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message || data.results?.message || 'NewsData API error');
    }

    return (data.results || []).map((art, idx) => transformArticle(art, idx, {
      id: a => a.article_id,
      pubDate: a => a.pubDate,
      image: a => a.image_url,
      sourceName: a => a.source_name,
      link: a => a.link,
    }));
  }

  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  const response = await fetch(
    `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=100&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return (data.articles || []).map((art, idx) => transformArticle(art, idx, {
    id: a => a.id,
    pubDate: a => a.publishedAt,
    image: a => a.image,
    sourceName: a => a.source?.name,
    link: a => a.url,
  }));
}

export async function fetchArticles(filters = {}) {
  try {
    const cachedDataString = localStorage.getItem(CACHE_KEY);
    if (cachedDataString) {
      const cachedData = JSON.parse(cachedDataString);
      const now = Date.now();
      if (
        now - cachedData.timestamp < CACHE_EXPIRY_MS &&
        Array.isArray(cachedData.articles) &&
        cachedData.articles.length > 0
      ) {
        return filterArticles(cachedData.articles, filters);
      }
    }

    if (!getApiProvider()) {
      console.warn(
        'No news API key found! Set VITE_NEWSAPI_KEY, VITE_GNEWS_API_KEY, or VITE_NEWSDATA_API_KEY.'
      );
      return [];
    }

    let articles = await fetchFromApi();


    if (articles.length > 0) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          articles,
        })
      );
    }

    return filterArticles(articles, filters);
  } catch (error) {
    console.error('Error fetching articles:', error);
    const cachedDataString = localStorage.getItem(CACHE_KEY);
    if (cachedDataString) {
      const cachedData = JSON.parse(cachedDataString);
      if (Array.isArray(cachedData.articles) && cachedData.articles.length > 0) {
        return filterArticles(cachedData.articles, filters);
      }
    }
    return [];
  }
}

export async function fetchArticleById(id) {
  const allArticles = await fetchArticles({});
  return allArticles.find((article) => article.id === String(id)) || null;
}

function filterArticles(articles, filters) {
  let filtered = [...articles];

  if (filters.domains) {
    const activeDomains = Object.entries(filters.domains)
      .filter(([_, isActive]) => isActive)
      .map(([domain]) => domain);

    if (activeDomains.length > 0) {
      filtered = filtered.filter((a) => activeDomains.includes(a.domain));
    }
  }

  if (filters.topics) {
    const activeTopics = Object.entries(filters.topics)
      .filter(([_, isActive]) => isActive)
      .map(([topic]) => topic);

    if (activeTopics.length > 0) {
      filtered = filtered.filter((a) => activeTopics.includes(a.topic));
    }
  }

  if (filters.startDate) {
    filtered = filtered.filter((a) => new Date(a.publicationDate) >= filters.startDate);
  }
  if (filters.endDate) {
    filtered = filtered.filter((a) => new Date(a.publicationDate) <= filters.endDate);
  }

  return filtered;
}
