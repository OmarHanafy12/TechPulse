import React from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  articlesPerPage, 
  onArticlesPerPageChange 
}) => {
  if (totalPages <= 1 && articlesPerPage === 10) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 1) {
        start = Math.max(totalPages - 3, 2);
      }
      
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="tn-pagination">
      <div className="tn-pagination-per-page">
        <span className="tn-pagination-label">Show</span>
        <div className="tn-pagination-select-wrap">
          <select 
            id="articlesPerPage" 
            className="tn-pagination-select"
            value={articlesPerPage} 
            onChange={(e) => onArticlesPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span className="tn-pagination-label">per page</span>
      </div>
      
      {totalPages > 1 && (
        <div className="tn-pagination-nav">
          <button 
            className="tn-pagination-btn"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))} 
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <IconChevronLeft size={16} />
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="tn-pagination-ellipsis">…</span>
            ) : (
              <button
                key={page}
                className={`tn-pagination-page ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            className="tn-pagination-btn"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} 
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
