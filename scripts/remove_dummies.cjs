const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'services', 'articleService.js');
let content = fs.readFileSync(file, 'utf8');

// The marker where the dummy articles start
const startMarker = '// Dummy articles with varied dates for testing time frame filters';
// The marker where the function begins
const endMarker = 'export async function fetchArticles(filters = {}) {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    // Slice out the dummy articles
    content = content.substring(0, startIndex) + content.substring(endIndex);
}

// Modify size parameter in fetch
content = content.replace(/size=10/g, 'size=50');

// Replace the fallback warnings
content = content.replace(/console\.warn\("No NewsData API Key found! Returning dummy articles\."\);\r?\n\s*return filterArticles\(DUMMY_ARTICLES, filters\);/g, 'console.warn("No NewsData API Key found! Returning empty array.");\n      return [];');

// Replace the allArticles assignment
content = content.replace(/const allArticles = \[\.\.\.articles, \.\.\.DUMMY_ARTICLES\];/g, 'const allArticles = articles;');

// Replace the fallback catch return
content = content.replace(/\/\/ If no cache exists either, return the dummy articles as a last resort\r?\n\s*console\.log\("No cache available\. Returning dummy articles as fallback\."\);\r?\n\s*return filterArticles\(DUMMY_ARTICLES, filters\);/g, 'return [];');

// Bump cache key
content = content.replace(/const CACHE_KEY = 'techpulse_newsdata_cache_v5';/g, "const CACHE_KEY = 'techpulse_newsdata_cache_v6';");

fs.writeFileSync(file, content);
console.log('Update successful');
