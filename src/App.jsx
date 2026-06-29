import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import ArticleDetailPage from "@/components/article/ArticleDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SidebarProvider>
          <FilterProvider>
            <NavigationProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="article/:articleId" element={<ArticleDetailPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Router>
            </NavigationProvider>
          </FilterProvider>
        </SidebarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

