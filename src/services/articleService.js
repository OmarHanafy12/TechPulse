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

const transformNewsApiArticle = (apiArticle, index) => {
  const topicIdx = (apiArticle.title.length + index) % topicsList.length;
  const domainIdx = (apiArticle.description?.length || index) % domainsList.length;

  return {
    id: hashUrl(apiArticle.url) || String(index),
    title: apiArticle.title,
    summary: apiArticle.description,
    content: apiArticle.content,
    domain: domainsList[domainIdx],
    topic: topicsList[topicIdx],
    publicationDate: apiArticle.publishedAt,
    imageUrls: apiArticle.urlToImage ? [apiArticle.urlToImage] : [],
    referenceUrl: {
      name: apiArticle.source?.name || 'External Source',
      link: apiArticle.url,
    },
  };
};

const transformGNewsArticle = (apiArticle, index) => {
  const topicIdx = (apiArticle.title.length + index) % topicsList.length;
  const domainIdx = (apiArticle.description?.length || index) % domainsList.length;

  return {
    id: apiArticle.id || String(index),
    title: apiArticle.title,
    summary: apiArticle.description,
    content: apiArticle.content,
    domain: domainsList[domainIdx],
    topic: topicsList[topicIdx],
    publicationDate: apiArticle.publishedAt,
    imageUrls: apiArticle.image ? [apiArticle.image] : [],
    referenceUrl: {
      name: apiArticle.source?.name || 'External Source',
      link: apiArticle.url,
    },
  };
};

const transformNewsDataArticle = (apiArticle, index) => {
  const topicIdx = (apiArticle.title.length + index) % topicsList.length;
  const domainIdx = (apiArticle.description?.length || index) % domainsList.length;

  return {
    id: apiArticle.article_id || String(index),
    title: apiArticle.title,
    summary: apiArticle.description,
    content: apiArticle.content,
    domain: domainsList[domainIdx],
    topic: topicsList[topicIdx],
    publicationDate: apiArticle.pubDate,
    imageUrls: apiArticle.image_url ? [apiArticle.image_url] : [],
    referenceUrl: {
      name: apiArticle.source_name || 'External Source',
      link: apiArticle.link,
    },
  };
};

async function fetchFromApi() {
  const provider = getApiProvider();

  if (provider === 'newsapi') {
    console.log('Fetching fresh articles from NewsAPI...');
    const response = await fetch('/api/news?category=technology&language=en&pageSize=100');

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message || 'NewsAPI error');
    }

    return (data.articles || []).map((art, idx) => transformNewsApiArticle(art, idx));
  }

  if (provider === 'newsdata') {
    const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;
    console.log('Fetching fresh articles from NewsData API...');
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

    return (data.results || []).map((art, idx) => transformNewsDataArticle(art, idx));
  }

  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  console.log('Fetching fresh articles from GNews API...');
  const response = await fetch(
    `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=100&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return (data.articles || []).map((art, idx) => transformGNewsArticle(art, idx));
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
        console.log('Serving articles from cache');
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

    // Multiply articles from the API with different historical dates to test timeframe filters
    if (articles.length > 0) {
      const multipliedArticles = [...articles];
      // Generate copies going back in time: 7 days, 1 month, 3 months, 6 months, 1 year, 2 years
      const timeFrames = [7, 30, 90, 180, 365, 730];
      
      articles.forEach((art) => {
        timeFrames.forEach((days, timeIdx) => {
          const originalDate = new Date(art.publicationDate).getTime();
          // Subtract the days and add a random offset up to 3 days to make dates look natural
          const newDate = new Date(originalDate - (days * 24 * 60 * 60 * 1000) - (Math.random() * 3 * 24 * 60 * 60 * 1000));
          multipliedArticles.push({
            ...art,
            id: `${art.id}-copy-${timeIdx}`,
            publicationDate: newDate.toISOString(),
          });
        });
      });
      articles = multipliedArticles;
    }

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
        console.log('Returning expired cache due to API failure.');
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
