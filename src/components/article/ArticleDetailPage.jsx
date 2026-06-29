import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RelatedArticlesSidebar from '@/components/article/RelatedArticlesSidebar';
import { useArticle } from '@/hooks/useArticles';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { usePageNavigation } from '@/contexts/NavigationContext';
import { IconArrowLeft } from '@tabler/icons-react';

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const { article, loading } = useArticle(articleId);
  const { isDesktopSidebarOpen, setIsDesktopSidebarOpen } = usePageNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsDesktopSidebarOpen(true);
  }, [setIsDesktopSidebarOpen]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleBackClick = useCallback((e) => {
    e.preventDefault();
    navigate('/');
  }, [navigate]);

  if (loading) {
    return <div>Loading article...</div>;
  }
  
  if (!article) {
    return <div>Article not found.</div>;
  }

  const hasContent = article.content && article.content.trim() !== '';
  const lightboxSlides = article.imageUrls ? article.imageUrls.map(url => ({ src: url })) : [];

  return (
    <>
      <div className={`tn-article-layout ${!isDesktopSidebarOpen ? 'desktop-closed' : ''}`}>
        <article className="tn-article-main">

          <div className="tn-art-eyebrow-wrap">
            <div className="tn-art-eyebrow">
              {article.topic}
            </div>
          </div>

          <button
            onClick={handleBackClick}
            className="tn-back-wrap"
            style={{ cursor: 'pointer' }}
          >
            <span className="tn-back-icon">
              <IconArrowLeft size={16} />
            </span>
            <span className="tn-back-label">Back to home</span>
          </button>


          <h1 className="tn-art-title">{article.title}</h1>

          <div className="tn-art-meta">
            <div className="tn-art-author-wrap">
              <div className="tn-art-avatar">TP</div>
              <div>
                <div className="tn-art-author-name">TechPulse Team</div>
                <div className="tn-art-author-role">{article.domain}</div>
              </div>
            </div>
            <div className="tn-art-date">
               {article.publicationDate}
            </div>
          </div>

          {article.imageUrls && article.imageUrls.length > 0 && (
            <div className="tn-art-img" style={{ cursor: 'zoom-in' }} onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
              <img src={article.imageUrls[0]} alt={article.title} />
            </div>
          )}

          {hasContent && (
            <div className="tn-art-body">
              {article.content
                .replace(/\s*\[\+?\d+\s+chars?\]\.?\s*$/i, '')
                .replace(/\s*…\s*\[\+?\d+\s+chars?\]\s*$/i, '')
                .trim()
                .split(/\n\n+/)
                .map((paragraph, idx) => (
                  <p key={idx}>{paragraph.trim()}</p>
                ))
              }
            </div>
          )}

          {article.imageUrls && article.imageUrls.length > 1 && (
            <div className="tn-art-inline-gallery">
              {article.imageUrls.slice(1).map((url, idx) => (
                <div key={idx} className="tn-art-inline-img" onClick={() => { setLightboxIndex(idx + 1); setLightboxOpen(true); }}>
                  <img src={url} alt={`${article.title} ${idx + 2}`} />
                </div>
              ))}
            </div>
          )}


        </article>
        
        <RelatedArticlesSidebar currentArticle={article} />
      </div>

      <Lightbox 
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        styles={{
          container: { backgroundColor: "white" },
          backdrop: { backgroundColor: "white" },
        }}
      />
    </>
  );
};

export default ArticleDetailPage;
