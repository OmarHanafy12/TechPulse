import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import ArticleCard from '@/components/ui/ArticleCard';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import { parseMonthYear } from '@/utils/dateUtils';
import { usePageNavigation } from '@/contexts/NavigationContext';
import { useArticles } from '@/hooks/useArticles';

const HomePage = () => {
  const { 
    homePageState, 
    updateHomePageState, 
    saveScrollPosition,
    filters,
    setFilters,
    handleClearFilters,
    isDesktopSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = usePageNavigation();
  
  const { articles, loading } = useArticles();
  
  const [currentPage, setCurrentPage] = useState(homePageState.currentPage);
  const [articlesPerPage, setArticlesPerPage] = useState(homePageState.articlesPerPage);
  const [searchQuery, setSearchQuery] = useState(homePageState.searchQuery);
  
  const scrollRestored = useRef(false);
  const isInitialized = useRef(false);

  // Restore scroll position on mount
  useEffect(() => {
    if (!scrollRestored.current && homePageState.scrollPosition > 0) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({
            top: homePageState.scrollPosition,
            behavior: 'auto'
          });
          scrollRestored.current = true;
        }, 100);
      });
    }
  }, [homePageState.scrollPosition]);

  // Update context when local page state changes
  useEffect(() => {
    if (isInitialized.current) {
      updateHomePageState({
        currentPage,
        articlesPerPage,
        searchQuery
      });
    } else {
      isInitialized.current = true;
    }
  }, [currentPage, articlesPerPage, searchQuery, updateHomePageState]);

  useEffect(() => {
    const handleScroll = () => {
      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        saveScrollPosition();
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(window.scrollTimeout);
    };
  }, [saveScrollPosition]);



  const uniqueTopics = useMemo(() => {
    if (!Array.isArray(articles)) return [];
    const topics = [...new Set(articles.map(a => a.topic))];
    return topics.sort();
  }, [articles]);

  const sortedAndFilteredArticles = useMemo(() => {
    if (!Array.isArray(articles)) return [];
    
    const selectedTopics = Object.keys(filters.topics).filter(key => filters.topics[key]);
    
    let filtered = [...articles].sort((a, b) => parseMonthYear(b.publicationDate) - parseMonthYear(a.publicationDate));

    filtered = filtered.filter(article => {
      const articleDate = parseMonthYear(article.publicationDate);
      if (!articleDate) return false;

      const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(article.topic);

      if (!topicMatch) return false;

      if (filters.startDate) {
        const start = filters.startDate;
        if (articleDate.getFullYear() < start.getFullYear() || (articleDate.getFullYear() === start.getFullYear() && articleDate.getMonth() < start.getMonth())) {
          return false;
        }
      }
      if (filters.endDate) {
        const end = filters.endDate;
        if (articleDate.getFullYear() > end.getFullYear() || (articleDate.getFullYear() === end.getFullYear() && articleDate.getMonth() > end.getMonth())) {
          return false;
        }
      }
      return true;
    });

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(lowercasedQuery) ||
        article.domain.toLowerCase().includes(lowercasedQuery) ||
        article.topic.toLowerCase().includes(lowercasedQuery)
      );
    }
    return filtered;
  }, [filters, articles, searchQuery]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = sortedAndFilteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(sortedAndFilteredArticles.length / articlesPerPage);

  const handleArticlesPerPageChange = (newPerPage) => {
    setArticlesPerPage(newPerPage);
    setCurrentPage(1);
  };
  
  const handleArticleClick = () => {
    saveScrollPosition();
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (scrollRestored.current) {
      setCurrentPage(1);
    }
  }, [filters]);

  if (loading) {
    return <div className="tn-main">Loading articles...</div>;
  }

  const isPageOne = currentPage === 1;
  const heroArticle = isPageOne && currentArticles.length > 0 ? currentArticles[0] : null;
  const gridArticles = isPageOne ? currentArticles.slice(1) : currentArticles;

  return (
    <div className={`tn-home-layout ${!isDesktopSidebarOpen ? 'desktop-closed' : ''}`}>
      <div 
        className={`tn-sidebar-backdrop ${isMobileSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <Sidebar 
        topics={uniqueTopics}
        filters={filters}
        setFilters={setFilters}
        onClearFilters={handleClearFilters}
      />
      
      <main className="tn-main">
        <div className="tn-section-header">
          <div className="tn-section-title">Content ({sortedAndFilteredArticles.length})</div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        
        {heroArticle && (
          <div className="hero-wrapper">
            <ArticleCard 
              key={heroArticle.id} 
              article={heroArticle} 
              onClick={handleArticleClick}
              isHero={true}
            />
          </div>
        )}

        {gridArticles.length > 0 ? (
          <div className="tn-cards-grid">
            {gridArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onClick={handleArticleClick}
                isHero={false}
              />
            ))}
          </div>
        ) : (
          !heroArticle && <p>No articles found matching your criteria.</p>
        )}

        {sortedAndFilteredArticles.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            articlesPerPage={articlesPerPage}
            onArticlesPerPageChange={handleArticlesPerPageChange}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;