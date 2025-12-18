# Crowd Management System

A modern, real-time crowd analytics dashboard for monitoring venue occupancy, visitor demographics, and entry/exit events.

![Dashboard Preview](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Chart.js](https://img.shields.io/badge/Chart.js-4-orange)

## Features

- 🔐 **Secure Authentication** - Token-based login with protected routes
- 📊 **Real-time Dashboard** - Live occupancy metrics with comparison indicators
- 📈 **Data Visualization** - Interactive charts for occupancy and demographics
- 👥 **Visitor Tracking** - Entry/exit records with pagination
- 🔄 **Live Updates** - Socket.IO integration for real-time data
- 🎨 **Modern UI** - Professional dark theme with smooth animations
- 📱 **Responsive Design** - Works on desktop and tablet

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Charts**: Chart.js + react-chartjs-2
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crowd-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Testing Without Backend

For testing the UI without a backend:

1. Open browser console
2. Run: `localStorage.setItem('authToken', 'test-token')`
3. Navigate to `/dashboard` or `/crowd-entries`

The application includes mock data fallbacks for all features.

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment

### Netlify (Recommended)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Other Platforms

The application can be deployed to any static hosting service:
- GitHub Pages
- Render
- Firebase Hosting
- Surge
- AWS S3 + CloudFront

## API Configuration

The application connects to:
- **Base URL**: `https://hiring-dev.internal.kloudspot.com`

### Endpoints

- `POST /api/auth/login` - Authentication
- `POST /api/analytics/dwell` - Dwell time data
- `POST /api/analytics/footfall` - Footfall data
- `POST /api/analytics/occupancy` - Occupancy time-series
- `POST /api/analytics/demographics` - Demographics data
- `POST /api/analytics/entry-exit` - Entry/exit records

To change the API URL, edit `src/utils/api.js`:
```javascript
const API_BASE_URL = 'your-api-url-here';
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (Login, Dashboard, Entries)
├── services/        # API and Socket.IO services
├── utils/           # Utility functions and helpers
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── index.css        # Design system and global styles
```

## Features Overview

### Login Page
- Email/password authentication
- Password visibility toggle
- Error handling
- Automatic redirect on success

### Dashboard
- Live occupancy metrics
- Today's footfall
- Average dwell time
- Occupancy time-series chart
- Demographics pie chart
- Demographics trend chart
- Real-time updates via Socket.IO

### Crowd Entries
- Visitor entry/exit table
- Avatar generation
- Entry/exit timestamps
- Dwell time calculation
- Pagination controls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software developed for Kloudspot.

## Support

For issues or questions, please contact the development team.
