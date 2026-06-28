import { useState, useEffect } from 'react';
import { fetchArticles, fetchArticleById } from '@/services/articleService';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchArticles();
        if (isMounted) {
          setArticles(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching articles:', err);
          setError(err.message || 'Failed to load articles');
          setArticles([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  return { articles, loading, error };
};

export const useArticle = (id) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    
    const loadArticle = async () => {
      try {
        setLoading(true);
        const data = await fetchArticleById(id);
        if (isMounted) {
          setArticle(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Error fetching article ${id}:`, err);
          setError(err.message || "Failed to load article");
          setArticle(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { article, loading, error };
};
