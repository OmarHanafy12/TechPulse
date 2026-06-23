import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="tn-root">
      <NavBar />
      <main key={pathname} className="tn-page-transition">
        <Outlet context={{ articles: [] }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;