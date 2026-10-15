// Categorized Projects Data with links, screenshots, and tags
export const PROJECT_CATEGORIES = [
  { id: 'all', name: 'All Projects', icon: 'Folder' },
  { id: 'fullstack', name: 'Full Stack', icon: 'Layers' },
  { id: 'frontend', name: 'Frontend & UI', icon: 'Layout' },
  { id: 'social', name: 'Social Impact & IoT', icon: 'Heart' },
  { id: 'tools', name: 'Tools & Utilities', icon: 'Wrench' }
];

export const PROJECTS = [
  {
    id: 'bussaathi',
    title: 'BusSaathi – Real-Time City Transport',
    category: 'social',
    featured: true,
    description: 'A civic social-impact platform providing real-time commuter bus tracking, arrival predictions, and route maps for Tier-2/3 cities.',
    tags: ['React.js', 'Node.js', 'Firebase', 'Google Maps API', 'SCSS'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    repoLink: 'https://github.com/shefaliyadav1709/bussaathi',
    demoLink: 'https://bussaathi.vercel.app'
  },
  {
    id: 'visara',
    title: 'Visara – Smart Vision Platform',
    category: 'fullstack',
    featured: true,
    description: 'An accessibility-first platform supporting B2B and D2C distribution and real-time telemetry for smart vision sticks assisting visually impaired users.',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'AWS', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    repoLink: 'https://github.com/shefaliyadav1709/visara-platform',
    demoLink: 'https://visara.vercel.app'
  },
  {
    id: 'taskflow',
    title: 'TaskFlow – Collaborative Workflow',
    category: 'frontend',
    featured: true,
    description: 'An intuitive project management suite featuring drag-and-drop Kanban boards, team permissions, live notifications, and productivity analytics.',
    tags: ['React', 'Redux Toolkit', 'TypeScript', 'SCSS', 'Firebase'],
    image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800&auto=format&fit=crop&q=80',
    repoLink: 'https://github.com/shefaliyadav1709/taskflow',
    demoLink: 'https://taskflow-demo.vercel.app'
  },
  {
    id: 'scheds',
    title: 'Scheds – Course Schedule Generator',
    category: 'fullstack',
    featured: false,
    description: 'Automated academic timetable and clash-free course schedule generator with role-based access control and exportable calendars.',
    tags: ['ASP.NET Core', 'C#', 'SQL Server', 'REST API', 'Bootstrap'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    repoLink: 'https://github.com/shefaliyadav1709/scheds-generator',
    demoLink: 'https://scheds-academic.vercel.app'
  },
  {
    id: 'shopease',
    title: 'ShopEase – Modern E-Commerce',
    category: 'fullstack',
    featured: false,
    description: 'A full-stack headless commerce platform with product catalogs, shopping cart, Stripe secure checkout, and instant order tracking.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'React'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    repoLink: 'https://github.com/shefaliyadav1709/shopease-store',
    demoLink: 'https://shopease-demo.vercel.app'
  },
  {
    id: 'weathernow',
    title: 'WeatherNow – Live Radar & Forecast',
    category: 'tools',
    featured: false,
    description: 'Hyper-local weather telemetry app with animated radar views, air quality index, and 7-day atmospheric forecasts.',
    tags: ['React', 'OpenWeather API', 'Geolocation', 'CSS Animations'],
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
    repoLink: 'https://github.com/shefaliyadav1709/weathernow',
    demoLink: 'https://weathernow-live.vercel.app'
  }
];
