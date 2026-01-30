# 🎨 LinkedIn Post Generator - Frontend

> Modern React application with AI-powered post generation, real-time updates, and beautiful UI

[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)

---

## 🎯 Overview

The frontend is a **Single Page Application (SPA)** built with **React 19** and **Vite**, offering a modern, responsive, and intuitive interface for LinkedIn post generation. It features real-time AI post generation, comprehensive content management, analytics visualization, and a beautiful glassmorphic design system.

### Key Highlights
- ✅ **Modern UI/UX:** Clean, professional design with smooth animations
- ✅ **AI Integration:** Real-time post generation with live preview
- ✅ **Responsive Design:** Mobile-first approach, works on all devices
- ✅ **Performance:** Lightning-fast with Vite build tool
- ✅ **State Management:** React Context API for global state
- ✅ **Protected Routes:** Client-side authentication guards
- ✅ **Interactive Charts:** Data visualization with Recharts
- ✅ **Toast Notifications:** User-friendly feedback with React Hot Toast

---

## ✨ Features

### 🎨 User Interface
- **Glassmorphic Design:** Modern, premium aesthetic with blur effects
- **Dark Mode Ready:** Beautiful gradient backgrounds
- **Smooth Animations:** Framer Motion for fluid transitions
- **Icon System:** Lucide React for consistent iconography
- **Responsive Layout:** Adapts seamlessly to all screen sizes

### 🔐 Authentication
- **Login Page:** Secure email/password authentication
- **Signup Page:** Two-step OTP verification flow
- **Protected Routes:** Automatic redirect for unauthenticated users
- **Persistent Sessions:** Token-based session management
- **User Context:** Global auth state with React Context

### 🚀 Core Features

**1. Dashboard**
- Quick overview of user statistics
- Recent posts display
- Navigation to all features
- Performance metrics at a glance

**2. AI Post Generator**
- Topic input with character counter
- Tone selection (Professional, Casual, Inspiring)
- Hook style options (Question, Stat, Story)
- Call-to-action choices (Comment, Share, Connect)
- Real-time LinkedIn preview
- Quick-start templates
- One-click save to library

**3. Posts Library**
- Grid/List view toggle
- Advanced search and filtering
- Sort by date, engagement, favorites
- Filter by tone, date range, min score
- Favorite posts system
- Edit and delete posts
- Copy to clipboard
- Engagement score indicators

**4. Templates**
- Pre-built post templates
- Category organization
- Quick template selection
- Save custom templates
- Template editing

**5. Analytics**
- Interactive charts and graphs
- Engagement metrics over time
- Post performance breakdown
- Tone effectiveness analysis
- Export data capabilities

**6. Scheduled Posts**
- View all scheduled content
- Reschedule or cancel posts
- Status tracking (scheduled/published/failed)
- Bulk actions

**7. User Profile**
- Profile information management
- Account settings
- Change password
- Email preferences

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library |
| **Vite** | 7.2.4 | Build tool & dev server |
| **React Router** | 7.13.0 | Client-side routing |
| **TailwindCSS** | 3.4.17 | Utility-first CSS framework |
| **Framer Motion** | 12.29.2 | Animation library |
| **Recharts** | 3.7.0 | Chart library |
| **Lucide React** | 0.563.0 | Icon library |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **PostCSS** | 8.5.6 | CSS processing |
| **Autoprefixer** | 10.4.23 | CSS vendor prefixes |
| **ESLint** | 9.39.1 | Code linting |

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/                    # API configuration
│   │   └── config.js          # API base URL
│   │
│   ├── auth/                   # Authentication
│   │   ├── AuthContext.jsx    # Auth context provider
│   │   └── ProtectedRoute.jsx # Route guard component
│   │
│   ├── components/             # Reusable components
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Sidebar.jsx        # Side navigation
│   │   ├── PostCard.jsx       # Post display card
│   │   ├── FilterBar.jsx      # Search & filter controls
│   │   ├── Chart.jsx          # Analytics charts
│   │   └── ...                # Other components
│   │
│   ├── context/                # React Context providers
│   │   ├── AuthContext.jsx    # Global auth state
│   │   └── UserContext.jsx    # User data state
│   │
│   ├── pages/                  # Application pages
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Registration page
│   │   ├── Home.jsx           # Landing page
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── GeneratePost.jsx   # AI post generator
│   │   ├── Posts.jsx          # Posts library
│   │   ├── Templates.jsx      # Template management
│   │   ├── Analytics.jsx      # Analytics dashboard
│   │   ├── ScheduledPosts.jsx # Scheduled posts view
│   │   └── Profile.jsx        # User profile
│   │
│   ├── services/               # API service layer
│   │   └── api.js             # API client with axios
│   │
│   ├── utils/                  # Utility functions
│   │   └── helpers.js         # Helper functions
│   │
│   ├── App.jsx                 # Main app component
│   ├── App.css                # App-specific styles
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles & Tailwind
│
├── public/                     # Static assets
│   └── vite.svg               # Favicon
│
├── index.html                  # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── .env.example              # Environment variables template
└── README.md                  # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Steps

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your backend URL
```

---

## 🔐 Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# For production (after deploying backend to Render)
# VITE_API_URL=https://your-backend.onrender.com
```

> [!NOTE]
> Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

---

## 🗺️ Pages & Routes

| Route | Component | Description | Protected |
|-------|-----------|-------------|-----------|
| `/` | Home | Landing page | ❌ |
| `/login` | Login | User login | ❌ |
| `/signup` | Signup | User registration | ❌ |
| `/dashboard` | Dashboard | Main dashboard | ✅ |
| `/generate` | GeneratePost | AI post generator | ✅ |
| `/posts` | Posts | Posts library | ✅ |
| `/templates` | Templates | Template management | ✅ |
| `/analytics` | Analytics | Analytics dashboard | ✅ |
| `/scheduled` | ScheduledPosts | Scheduled posts | ✅ |
| `/profile` | Profile | User profile | ✅ |

### Route Protection

Protected routes automatically redirect unauthenticated users to the login page:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🧩 Components

### Key Components

**Navbar**
- Application branding
- User profile dropdown
- Logout functionality
- Responsive mobile menu

**Sidebar**
- Navigation menu
- Active route highlighting
- Icon-based navigation
- Collapsible on mobile

**PostCard**
- Display post content
- Engagement score indicator
- Favorite toggle
- Edit/Delete actions
- Copy to clipboard
- Share functionality

**FilterBar**
- Search input
- Tone filter dropdown
- Date range picker
- Score filter slider
- Favorites filter toggle

**Chart**
- Engagement over time
- Tone performance comparison
- Interactive tooltips
- Responsive design

---

## ▶️ Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Features:
- Hot Module Replacement (HMR)
- Fast refresh for instant updates
- Source maps for debugging

---

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Production Optimizations
- Code splitting
- Tree shaking
- Minification
- Asset optimization
- Gzip compression

---

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with a custom configuration:

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

### Global Styles

Located in `index.css`:
- Custom font imports (Inter)
- Tailwind base, components, utilities
- Custom CSS variables
- Global resets

### Design System

**Colors:**
- Primary: Indigo/Purple gradient
- Success: Green
- Error: Red
- Warning: Yellow
- Neutral: Gray scale

**Typography:**
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800

**Spacing:**
- Consistent 4px/8px grid system

---

## 🔧 API Integration

### API Service Layer

Located in `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Example API call
export const generatePost = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all subsequent API requests
5. Auto-redirect on token expiration

---

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Set Environment Variables:**
- Go to Vercel dashboard
- Navigate to project settings
- Add `VITE_API_URL` with your backend URL
- Redeploy

### Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Deploy dist folder:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

3. **Configure redirects** for SPA routing:

Create `public/_redirects`:
```
/*    /index.html   200
```

---

## 🧪 Development Tips

### ESLint Configuration

Linting is configured in `eslint.config.js`. Run linter:

```bash
npm run lint
```

### Debugging

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Use React DevTools extension
4. Network tab for API calls

### Performance Monitoring

- Use React Profiler
- Check Lighthouse scores
- Monitor bundle size with `vite-bundle-visualizer`

---

## 📦 Dependencies

See [package.json](package.json) for full list. Key dependencies:

**Production:**
- `react` & `react-dom` - UI library
- `react-router-dom` - Routing
- `framer-motion` - Animations
- `recharts` - Charts
- `lucide-react` - Icons
- `react-hot-toast` - Notifications

**Development:**
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `eslint` - Code linting
- `autoprefixer` - CSS prefixing

---

## 🎓 Technical Highlights

### Performance Optimizations
✅ Code splitting with React.lazy()  
✅ Lazy loading for images  
✅ Debounced search inputs  
✅ Memoized components with React.memo()  
✅ Virtual scrolling for large lists  

### Accessibility
✅ Semantic HTML  
✅ ARIA attributes  
✅ Keyboard navigation  
✅ Focus management  
✅ Screen reader support  

### Best Practices
✅ Component composition  
✅ Custom hooks for reusability  
✅ PropTypes validation  
✅ Error boundaries  
✅ Consistent code style  

---

## 📄 License

This project is part of the LinkedIn Post Generator application.

---

## 👨‍💻 Developer

**Kenguva Manibhaskar**
- Email: kenguva.manibhaskar@gmail.com
- GitHub: [@manibhaskar29](https://github.com/manibhaskar29)

---

<p align="center">Part of the <a href="../README.md">LinkedIn Post Generator</a> project</p>
