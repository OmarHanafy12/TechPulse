import React from 'react';
import { Link } from 'react-router-dom';
import { IconUser, IconClock, IconEye } from "@tabler/icons-react";
import { getTopicStyles } from '@/utils/topicUtils';

const ArticleCard = ({ article, onClick, isHero = false }) => {
  const { colorClass, dotClass, icon: TopicIcon } = getTopicStyles(article.topic);
  const imageUrl = article.imageUrls && article.imageUrls.length > 0 ? article.imageUrls[0] : null;

  if (isHero) {
    return (
      <Link to={`/article/${article.id}`} onClick={onClick} className="tn-hero-card">
        <div>
          <div className="tn-hero-title">{article.title}</div>
          <div className="tn-hero-meta">
            <span><IconUser size={14} /> TechPulse Team</span>
            <span><IconClock size={14} /> {article.publicationDate}</span>
            <span><IconEye size={14} /> 5K views</span>
          </div>
        </div>
        <div className="tn-hero-img-placeholder">
          {imageUrl ? <img src={imageUrl} alt={article.title} /> : <TopicIcon />}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} onClick={onClick} className="tn-card">
      <div className={`tn-card-accent ${colorClass ? '' : 'default'}`}></div>
      <div className="tn-card-body">
        <div className={`tn-card-cat ${colorClass}`}>
          <TopicIcon /> {article.topic}
        </div>
        <div className="tn-card-title">{article.title}</div>
        <div className="tn-card-excerpt">{article.summary}</div>
        <div className="tn-card-footer">
          <div className="tn-card-author">
            <div className={`tn-card-author-dot ${dotClass}`}>TP</div> TechPulse
          </div>
          <div className="tn-card-time">
            <IconClock size={12} /> {article.publicationDate}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
