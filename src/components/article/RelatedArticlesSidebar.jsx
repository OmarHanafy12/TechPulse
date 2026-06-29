import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { usePageNavigation } from '@/contexts/NavigationContext';
import { IconBrain, IconShield, IconRocket, IconLeaf, IconDna, IconLayoutGrid } from "@tabler/icons-react";

const getTopicStyles = (topic) => {
  const t = topic.toLowerCase();
  if (t.includes('ai') || t.includes('artificial')) return { colorClass: 'cat-ai', icon: <IconBrain /> };
  if (t.includes('security') || t.includes('cyber')) return { colorClass: 'cat-security', icon: <IconShield /> };
  if (t.includes('space')) return { colorClass: 'cat-space', icon: <IconRocket /> };
  if (t.includes('green') || t.includes('climate')) return { colorClass: 'cat-climate', icon: <IconLeaf /> };
  if (t.includes('bio')) return { colorClass: 'cat-bio', icon: <IconDna /> };
  return { colorClass: '', icon: <IconLayoutGrid /> };
};

const RelatedArticlesSidebar = ({ currentArticle }) => {
  const { articles } = useArticles();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = usePageNavigation();
  
  if (!currentArticle || !Array.isArray(articles)) return null;

  const related = articles.filter(article => 
    article.topic === currentArticle.topic && String(article.id) !== String(currentArticle.id)
  );

  const articlesToShow = related.slice(0, 4);

  return (
    <>
      <div 
        className={`tn-sidebar-backdrop ${isMobileSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <aside className={`tn-art-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>

        {articlesToShow.length > 0 ? (
          <>
            <div className="tn-sug-label">More in {currentArticle.topic}</div>
            {articlesToShow.map(article => {
              const { colorClass, icon } = getTopicStyles(article.topic);
              const imageUrl = article.imageUrls && article.imageUrls.length > 0 ? article.imageUrls[0] : null;
              
              return (
                <Link to={`/article/${article.id}`} key={article.id} className="tn-sug-card">
                  <div className="tn-sug-img">
                    {imageUrl ? <img src={imageUrl} alt={article.title} /> : icon}
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