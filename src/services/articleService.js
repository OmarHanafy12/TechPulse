const CACHE_KEY = 'techpulse_gnews_cache_v1';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Map GNews response to our internal article structure
const transformArticle = (apiArticle, index) => {
  // GNews doesn't always provide domains/topics, so we'll infer some or assign generic ones
  // to keep the UI looking colorful and populated.
  const topicsList = ['Artificial Intelligence', 'Cybersecurity', 'Space Tech', 'Green Tech', 'Hardware & Infrastructure', 'Wireless Technology'];
  const domainsList = ['Core Network and Cloud', 'Radio Access Network', 'Energy and Sustainability', 'Transport Network', 'Fixed Access Network'];
  
  // Deterministic random-ish assignment based on string length so it stays consistent
  const topicIdx = (apiArticle.title.length + index) % topicsList.length;
  const domainIdx = (apiArticle.description?.length || index) % domainsList.length;

  return {
    id: apiArticle.id || String(index), // Use GNews MD5 id if available, fallback to index
    title: apiArticle.title,
    summary: apiArticle.description,
    content: apiArticle.content,
    domain: domainsList[domainIdx],
    topic: topicsList[topicIdx],
    publicationDate: apiArticle.publishedAt,
    imageUrls: apiArticle.image ? [apiArticle.image] : [],
    referenceUrl: { 
      name: apiArticle.source?.name || 'External Source', 
      link: apiArticle.url 
    }
  };
};

export async function fetchArticles(filters = {}) {
  try {
    // 1. Check Cache
    const cachedDataString = localStorage.getItem(CACHE_KEY);
    if (cachedDataString) {
      const cachedData = JSON.parse(cachedDataString);
      const now = Date.now();
      if (now - cachedData.timestamp < CACHE_EXPIRY_MS) {
        console.log("Serving articles from cache");
        return filterArticles(cachedData.articles, filters);
      }
    }

    // 2. Fetch from API if cache is empty or expired
    const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
    if (!apiKey) {
      console.warn("No GNews API Key found! Returning empty array.");
      return [];
    }

    console.log("Fetching fresh articles from GNews API...");
    // Fetch top technology headlines (max 100 to allow local filtering)
    const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=100&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const articles = (data.articles || []).map((art, idx) => transformArticle(art, idx));

    // 3. Save to Cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      articles: articles
    }));

    return filterArticles(articles, filters);

  } catch (error) {
    console.error("Error fetching articles:", error);
    // If API fails, try to return expired cache as fallback
    const cachedDataString = localStorage.getItem(CACHE_KEY);
    if (cachedDataString) {
       console.log("Returning expired cache due to API failure.");
       return filterArticles(JSON.parse(cachedDataString).articles, filters);
    }
    return [];
  }
}

export async function fetchArticleById(id) {
  // We grab the full list from cache (or fetch if empty) and find the specific one
  const allArticles = await fetchArticles({});
  return allArticles.find(article => article.id === String(id)) || null;
}

// Helper to filter locally so we don't spam the API on every click
function filterArticles(articles, filters) {
  let filtered = [...articles];

  // Domain filters
  if (filters.domains) {
    const activeDomains = Object.entries(filters.domains)
      .filter(([_, isActive]) => isActive)
      .map(([domain]) => domain);
    
    if (activeDomains.length > 0) {
      filtered = filtered.filter(a => activeDomains.includes(a.domain));
    }
  }

  // Topic filters
  if (filters.topics) {
    const activeTopics = Object.entries(filters.topics)
      .filter(([_, isActive]) => isActive)
      .map(([topic]) => topic);
    
    if (activeTopics.length > 0) {
      filtered = filtered.filter(a => activeTopics.includes(a.topic));
    }
  }

  // Date filters
  if (filters.startDate) {
    filtered = filtered.filter(a => new Date(a.publicationDate) >= filters.startDate);
  }
  if (filters.endDate) {
    filtered = filtered.filter(a => new Date(a.publicationDate) <= filters.endDate);
  }

  return filtered;
}
