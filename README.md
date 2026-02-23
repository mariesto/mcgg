# Magic Chess Go Go Ranking System

A simple and appealing web application for tracking rankings and game scores.

## Features

- 🏆 Public leaderboard showing daily rankings
- 👥 User management (add, edit, delete users)
- 📅 Create daily rankings with custom dates
- 📊 Statistics showing the user with the most losses
- 🎨 Beautiful, responsive UI with smooth animations
- 🔧 Simple backend using Node.js and Express
- 💾 JSON file-based storage (easy to backup and modify)

## Project Structure

```
mcgg-rank/
├── client/          # Vue.js frontend (if using separate client)
├── server/          # Node.js backend API
│   └── index.js     # Express server with API endpoints
├── src/             # Vue.js source files
│   ├── components/  # Reusable components
│   ├── views/       # Page components
│   ├── router/      # Vue Router configuration
│   ├── App.vue      # Main app component
│   └── main.js      # App entry point
├── data/            # JSON storage files
│   ├── users.json   # User data
│   └── rankings.json # Daily rankings
├── public/          # Static files
├── vite.config.js   # Vite configuration
└── package.json     # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn

### Installation

1. Install dependencies:
```sh
npm install
```

### Development

Run the development server (includes both backend and frontend):

```sh
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Production Build

Build for production:

```sh
npm run build
```

Then preview the production build:

```sh
npm run preview
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Rankings

- `GET /api/current-ranking` - Get today's ranking
- `GET /api/rankings/:date` - Get ranking for specific date
- `GET /api/rankings` - Get all rankings
- `POST /api/rankings` - Create a new ranking

### Statistics

- `GET /api/statistics` - Get overall statistics (most losses, user count, etc.)

## Usage

### Public View

Navigate to http://localhost:5173 to see:
- User with most losses at the top
- Daily leaderboard with user scores, wins, and losses
- Medal icons for top 3 positions
- Ability to view rankings from different dates

### Admin Panel

Navigate to http://localhost:5173/admin to:
- Add new users
- Edit existing users (name, score, wins, losses)
- Delete users
- Create daily rankings by selecting users
- Delete rankings
- See all users and their statistics

## Data Storage

All data is stored in JSON files in the `data/` directory:

- `users.json` - Contains user information (name, score, wins, losses)
- `rankings.json` - Contains daily rankings with user IDs

The data persists between restarts since it's file-based.

## Customization

### Colors

You can customize the color scheme by modifying the CSS variables in the component files. The main colors are:
- Primary: `#667eea` and `#764ba2` (gradient)
- Secondary: `#e94560`
- Success: `#27ae60`
- Error: `#e74c3c`

### Fonts

The default font is `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`. You can change it in the global CSS.

## Troubleshooting

### Port already in use

If port 3000 or 5173 is already in use, you can:
- Stop other services using those ports
- Modify the port in `vite.config.js` or `server/index.js`

### Database errors

The application uses file-based storage. If you encounter issues:
- Check that the `data/` directory exists
- Ensure you have write permissions for the data files
- Delete the data files to reset (only recommended if needed)

## License

This is a personal project for fun. Feel free to use and modify as needed!
