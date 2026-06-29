import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isTopicOpen, setIsTopicOpen] = useState(true);

  return (
    <SidebarContext.Provider
      value={{
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isDesktopSidebarOpen,
        setIsDesktopSidebarOpen,
        isTopicOpen,
        setIsTopicOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
