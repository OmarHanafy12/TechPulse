import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>404 - Page Not Found</h1>
      <p style={{ margin: '20px 0', color: 'var(--color-text-secondary)' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
