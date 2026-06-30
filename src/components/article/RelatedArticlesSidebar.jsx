import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useSidebar } from '@/contexts/SidebarContext';
import { getTopicStyles } from '@/utils/topicUtils';

const RelatedArticlesSidebar = ({ currentArticle }) => {
  const { articles } = useArticles();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();
  
  if (!currentArticle || !Array.isArray(articles)) return null;

  const related = articles.filter(article => 
    article.topic === currentArticle.topic && String(article.id) !== String(currentArticle.id)
  );

  const articlesToShow = related.slice(0, 4);

  return (
    <>
      <aside className={`tn-art-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>

        {articlesToShow.length > 0 ? (
          <>
            <div className="tn-sug-label">More in {currentArticle.topic}</div>
            {articlesToShow.map(article => {
              const { colorClass, icon: TopicIcon } = getTopicStyles(article.topic);
              const imageUrl = article.imageUrls && article.imageUrls.length > 0 ? article.imageUrls[0] : null;
              
              return (
                <Link to={`/article/${article.id}`} key={article.id} className="tn-sug-card">
                  <div className="tn-sug-img">
                    {imageUrl ? <img src={imageUrl} alt={article.title} /> : <TopicIcon />}
                  </div>
                  <div className="tn-sug-content">
                    <div className={`tn-sug-cat ${colorClass}`}>{article.topic}</div>
                    <div className="tn-sug-title">{article.title}</div>
                    <div className="tn-sug-time">{article.publicationDate}</div>
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--aster)', padding: '12px 0' }}>
            No related articles found.
          </div>
        )}
      </aside>
    </>
  );
};

export default RelatedArticlesSidebar;