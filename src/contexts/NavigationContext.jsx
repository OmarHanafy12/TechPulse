import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const NavigationContext = createContext();

export const usePageNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "usePageNavigation must be used within a NavigationProvider"
    );
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  // --- Your existing page state logic (preserved) ---
  const defaultPageState = {
    currentPage: 1,
    articlesPerPage: 10,
    searchQuery: "",
    scrollPosition: 0,
  };

  const [homePageState, setHomePageState] = useState(() => {
    try {
      const saved = localStorage.getItem("homePageState");
      return saved ? JSON.parse(saved) : defaultPageState;
    } catch (error) {
      console.warn("Failed to load saved page state:", error);
      return defaultPageState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("homePageState", JSON.stringify(homePageState));
    } catch (error) {
      console.warn("Failed to save page state:", error);
    }
  }, [homePageState]);

  const updateHomePageState = useCallback((newState) => {
    setHomePageState((prev) => ({ ...prev, ...newState }));
  }, []);

  const saveScrollPosition = useCallback(() => {
    const scrollY = window.scrollY;
    updateHomePageState({ scrollPosition: scrollY });
  }, [updateHomePageState]);

  // --- NEW: Filter state logic (integrated) ---
  const initialFilters = {
    topics: {},
    startDate: null,
    endDate: null,
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("appTheme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // --- Provide all values through the context ---
  const value = {
    homePageState,
    updateHomePageState,
    saveScrollPosition,
    filters,
    setFilters,
    handleClearFilters,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isDesktopSidebarOpen,
    setIsDesktopSidebarOpen,
    isTopicOpen,
    setIsTopicOpen,
    theme,
    toggleTheme,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
