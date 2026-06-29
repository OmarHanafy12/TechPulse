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

  const value = {
    homePageState,
    updateHomePageState,
    saveScrollPosition,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

