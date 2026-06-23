import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import ArticleDetailPage from "@/components/article/ArticleDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { NavigationProvider } from "@/contexts/NavigationContext";

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;

