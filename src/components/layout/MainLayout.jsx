import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useSidebar } from '@/contexts/SidebarContext';

const MainLayout = () => {
  const { pathname } = useLocation();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="tn-root">
      <NavBar />
      <main key={pathname} className="tn-page-transition">
        <div 
          className={`tn-sidebar-backdrop ${isMobileSidebarOpen ? 'visible' : ''}`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;