# TechPulse

A modern technology news aggregator built with React. Browse, filter, and search the latest tech headlines — featuring a responsive design system with dark mode, animated transitions, and a clean editorial layout.

> **Live Demo:** _Add your deployed URL here_

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool & dev server
- **React Router v6** — Client-side routing
- **GNews API** — Technology news data source
- **react-datepicker** — Date range filtering
- **yet-another-react-lightbox** — Image gallery viewer
- **@tabler/icons-react** — Icon system
- **Vanilla CSS** — Custom design system with CSS custom properties

## Features

- **Homepage Feed** — Hero card + responsive grid of article cards
- **Article Detail** — Full article view with image lightbox
- **Filtering** — Filter by topic and date range via collapsible sidebar
- **Search** — Expanding search bar with instant client-side filtering
- **Pagination** — Configurable articles per page with smart page number display
- **Dark Mode** — Toggle between light and dark themes
- **Related Articles** — Sidebar with topic-based article suggestions
- **Responsive** — Mobile-first design with animated sidebar overlays
- **Caching** — LocalStorage cache with 1-hour expiry to minimize API calls
- **Scroll Restoration** — Preserves scroll position when navigating back
- **Error Boundary** — Graceful error handling at the app root

## Getting Started

### Prerequisites

- Node.js 20+
- A free [GNews API key](https://gnews.io/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/TechPulse.git
cd TechPulse

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local
# Then edit .env.local and add your GNews API key

# Start the development server
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── article/          # Article detail page & related sidebar
│   ├── layout/           # NavBar, Footer, MainLayout
│   └── ui/               # Reusable UI components (cards, pagination, search, sidebar)
├── contexts/             # React context for navigation, filters, theme
├── hooks/                # Custom hooks (useArticles, useArticle)
├── pages/                # Route-level page components
├── services/             # API service layer with caching
├── styles/               # Design system, layout, and component CSS
│   └── components/       # Component-specific stylesheets
└── utils/                # Utility functions (date parsing)
```
