<div align="center">

# Magic Chess Go Go

### Player Ranking System

<img src="public/mcgg%20logo.png" alt="MCGG Logo" width="120" height="120">

*A competitive ranking platform for Magic Chess Go Go players*

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

</div>

---

## Overview

Track your game performance, compete with friends, and climb the leaderboard. Submit games through a ticket system, get approval from participants, and watch your stats grow.

## Features

### For Players

| Feature | Description |
|---------|-------------|
| **Player Accounts** | Register with email, login with email or username |
| **Personal Dashboard** | Stats, streaks, rivalries, game history at a glance |
| **Game Submission** | Submit games via tickets, participants approve |
| **Head-to-Head Compare** | Compare your stats against any other player |
| **Crown Chase** | Track how close you are to the #1 spot |
| **Titles & Streaks** | Earn titles, track win streaks with fire emojis |

### For Admins

| Feature | Description |
|---------|-------------|
| **Ticket Management** | Approve/reject game submissions with predefined reasons |
| **Point Configuration** | Adjust point tiers (1-3, 4-5, 6-8 placements) |
| **Player Management** | View and deactivate player accounts |
| **Rejection Reasons** | Manage predefined rejection categories |

## Tech Stack

```
Frontend          Backend           Database
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Vue 3       │   │ Express.js  │   │ Supabase    │
│ Vite        │ + │ Node.js     │ + │ PostgreSQL  │
│ Vue Router  │   │ REST API    │   │ Row Level   │
│ CSS Vars    │   │ JWT Auth    │   │ Security    │
└─────────────┘   └─────────────┘   └─────────────┘
```

## Quick Start

### Prerequisites

- Node.js `20.19.0+` or `22.12.0+`
- Supabase account (free tier works)

### Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-repo/mcgg-rank.git
   cd mcgg-rank
   npm install
   ```

2. **Configure Environment**
   
   Create `.env` in project root:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

3. **Run Database Migrations**
   
   Execute SQL files in `supabase/migrations/` via Supabase SQL Editor:
   - `001_initial_schema.sql`
   - `002_seed_data.sql`
   - `003_rls_policies.sql`

4. **Start Development**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Production Build

```bash
npm run build
npm run preview
```

### VPS Deployment

See `DEPLOY_VPS.md` for a full Ubuntu VPS deployment guide (nginx + systemd + HTTPS).

## Project Structure

```
mcgg-rank/
├── src/
│   ├── views/           # Page components
│   │   ├── PublicView.vue       # Public leaderboard
│   │   ├── DashboardView.vue    # Player dashboard
│   │   ├── LoginView.vue        # Login (email/username)
│   │   ├── RegisterView.vue     # Registration
│   │   ├── CompareView.vue      # Head-to-head comparison
│   │   ├── TicketListView.vue   # My tickets
│   │   ├── TicketCreateView.vue # Submit games
│   │   └── AdminView.vue        # Admin panel
│   ├── composables/     # Reusable logic
│   │   └── useAuth.js           # Authentication state
│   ├── lib/
│   │   ├── supabase.js          # Supabase client
│   │   └── api.js               # API helpers
│   └── router/          # Vue Router config
├── server/
│   ├── index.js         # Express server entry
│   ├── routes/          # API routes
│   │   ├── auth.js      # Login, register, logout
│   │   ├── players.js   # Player stats & profile
│   │   ├── tickets.js   # Game submission workflow
│   │   ├── leaderboard.js
│   │   └── admin.js
│   └── middleware/
│       ├── auth.js      # JWT verification
│       └── admin.js     # Admin role check
├── supabase/
│   └── migrations/      # Database schema & seeds
└── public/              # Static assets
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new player account |
| POST | `/api/auth/login` | Login (email or username) |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Get current user |

### Players
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players/me/stats` | Personal statistics |
| GET | `/api/players/me/history` | Game history |
| GET | `/api/players/me/streak` | Current & best streak |
| GET | `/api/players/me/rivalries` | Nemesis & prey |
| GET | `/api/players/me/title` | Current earned title |
| GET | `/api/players/me/crown-chase` | Distance to #1 |
| GET | `/api/players/:id/compare` | Head-to-head comparison |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | My submitted tickets |
| POST | `/api/tickets` | Submit new games |
| GET | `/api/tickets/pending-approvals` | Tickets awaiting my approval |
| POST | `/api/tickets/:id/approve` | Approve a ticket |
| POST | `/api/tickets/:id/reject` | Reject a ticket |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/tickets` | All tickets |
| POST | `/api/admin/tickets/:id/approve` | Admin override approve |
| POST | `/api/admin/tickets/:id/reject` | Admin override reject |
| GET | `/api/admin/point-config` | Get point tiers |
| PUT | `/api/admin/point-config` | Update point tiers |
| GET | `/api/admin/players` | All players |

## Point System

Default configuration (configurable via admin panel):

| Placement | Points |
|-----------|--------|
| 1st - 3rd | 3 pts |
| 4th - 5th | 2 pts |
| 6th - 8th | 1 pt |

## Theme Support

Dark and light themes with system preference detection. Toggle available in header on all views.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use and modify!

---

<div align="center">
Built with ❤️ for Magic Chess Go Go players
</div>
