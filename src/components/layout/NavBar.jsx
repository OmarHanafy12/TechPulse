import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { usePageNavigation } from "@/contexts/NavigationContext";
import { IconSun, IconMoon } from "@tabler/icons-react";

const NavBar = () => {
  const { 
    updateHomePageState, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    isDesktopSidebarOpen,
    setIsDesktopSidebarOpen,
    theme,
    toggleTheme
  } = usePageNavigation();

  const location = useLocation();
  const isArticlePage = location.pathname.startsWith('/article/');

  const handleHomeClick = () => {
    updateHomePageState({
      currentPage: 1,
      searchQuery: "",
      scrollPosition: 0,
    });
  };

  return (
    <nav className="tn-nav">
      <div className="tn-nav-left" style={{ display: 'flex', alignItems: 'center' }}>
        {!isArticlePage && (
          <>
            <button 
              className={`tn-desktop-toggle tn-burger ${isDesktopSidebarOpen ? 'is-active' : ''}`}
              onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
              aria-label="Toggle Filter Sidebar"
            >
              <span className="tn-burger-bar"></span>
              <span className="tn-burger-bar"></span>
              <span className="tn-burger-bar"></span>
            </button>
            <div className="tn-desktop-toggle-label-wrap">
              <span className="tn-desktop-toggle-label">Filter</span>
            </div>
          </>
        )}
        <NavLink
          to="/"
          onClick={handleHomeClick}
          className="tn-logo"
          style={isArticlePage ? { marginLeft: 0 } : undefined}
        >
          <span className="tn-logo-dot"></span> TechPulse
        </NavLink>
      </div>

      <div className="tn-nav-right">
        <button 
          onClick={toggleTheme}
          style={{ background: 'transparent', border: 'none', color: 'var(--luster)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
        </button>

        {isArticlePage && (
          <div className="tn-right-burger-group">
            <button 
              className={`tn-desktop-toggle tn-burger tn-burger-right ${isDesktopSidebarOpen ? 'is-active' : ''}`}
              onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
              aria-label="Toggle Related Sidebar"
            >
              <span className="tn-burger-bar"></span>
              <span className="tn-burger-bar"></span>
              <span className="tn-burger-bar"></span>
            </button>
            <div className="tn-desktop-toggle-label-wrap tn-toggle-label-right">
              <span className="tn-desktop-toggle-label tn-label-right">Related</span>
            </div>
          </div>
        )}

        <button 
          className={`tn-mobile-toggle tn-burger ${isMobileSidebarOpen ? 'is-active' : ''}`}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <span className="tn-burger-bar"></span>
          <span className="tn-burger-bar"></span>
          <span className="tn-burger-bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
