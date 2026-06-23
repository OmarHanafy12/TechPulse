import React from 'react';
import { Link } from 'react-router-dom';
import { IconUser, IconClock, IconEye, IconBrain, IconShield, IconRocket, IconLeaf, IconDna, IconLayoutGrid } from "@tabler/icons-react";

const getTopicStyles = (topic) => {
  const t = topic.toLowerCase();
  if (t.includes('ai') || t.includes('artificial')) return { colorClass: 'cat-ai', dotClass: 'dot-ai', icon: <IconBrain /> };
  if (t.includes('security') || t.includes('cyber')) return { colorClass: 'cat-security', dotClass: 'dot-security', icon: <IconShield /> };
  if (t.includes('space')) return { colorClass: 'cat-space', dotClass: 'dot-space', icon: <IconRocket /> };
  if (t.includes('green') || t.includes('climate')) return { colorClass: 'cat-climate', dotClass: 'dot-climate', icon: <IconLeaf /> };
  if (t.includes('bio')) return { colorClass: 'cat-bio', dotClass: 'dot-bio', icon: <IconDna /> };
  return { colorClass: '', dotClass: '', icon: <IconLayoutGrid /> };
};

const ArticleCard = ({ article, onClick, isHero = false }) => {
  const { colorClass, dotClass, icon } = getTopicStyles(article.topic);
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
          {imageUrl ? <img src={imageUrl} alt={article.title} /> : icon}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} onClick={onClick} className="tn-card">
      <div className={`tn-card-accent ${colorClass ? '' : 'default'}`}></div>
      <div className="tn-card-body">
        <div className={`tn-card-cat ${colorClass}`}>
          {icon} {article.topic}
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
