const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "src", "services", "articleService.js");
let content = fs.readFileSync(file, "utf8");

const topicsList = [
  "Artificial Intelligence",
  "Cybersecurity",
  "Space Tech",
  "Green Tech",
  "Hardware & Infrastructure",
  "Wireless Technology",
];
const domainsList = [
  "Core Network and Cloud",
  "Radio Access Network",
  "Energy and Sustainability",
  "Transport Network",
  "Fixed Access Network",
];
const images = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&h=450&fit=crop",
];

const newArticles = [];
for (let i = 13; i <= 50; i++) {
  const topic = topicsList[i % topicsList.length];
  const domain = domainsList[i % domainsList.length];
  const img = images[i % images.length];
  const month = String((i % 12) + 1).padStart(2, "0");
  const day = String((i % 28) + 1).padStart(2, "0");
  const year = i % 2 === 0 ? "2025" : "2026";

  newArticles.push(`  {
    id: 'dummy-${i}',
    title: 'Future of ${topic} in ${year}: A Comprehensive Overview',
    summary: 'Exploring the latest innovations and challenges in ${topic} as they relate to ${domain}.',
    content: 'This in-depth analysis covers how ${topic} is reshaping the landscape of ${domain}. With new advancements emerging in ${year}, organizations must adapt to these technological shifts. The integration of these systems continues to evolve rapidly, presenting both unprecedented opportunities and unique security challenges for the industry at large.',
    domain: '${domain}',
    topic: '${topic}',
    publicationDate: '${year}-${month}-${day} 10:00:00',
    imageUrls: ['${img}'],
    referenceUrl: { name: 'Tech Insights', link: '#' }
  }`);
}

if (!content.includes("dummy-50")) {
  content = content.replace(
    /\s*\}\r?\n\];/g,
    "\\n  },\\n" + newArticles.join(",\\n") + "\\n];",
  );
  fs.writeFileSync(file, content);
  console.log("Successfully added 38 dummy articles");
} else {
  console.log("Articles already added");
}
