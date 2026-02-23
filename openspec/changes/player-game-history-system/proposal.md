## Why

Currently, players have no ownership over their data and cannot track their own game history or progress. All data management is done by admins, creating friction for players who want to participate in tracking their games. This feature enables player self-service: accounts, game history submission via tickets, and personal dashboards with competitive stats - making the leaderboard more engaging and fostering competition among players.

## What Changes

- **Player Accounts**: Players can register and log in to their own accounts
- **Player Dashboard**: Personalized dashboard showing stats, streaks, rivalries, and game history
- **Ticket System**: Players can submit game history records (batches of games) for approval
- **Participant Approval Flow**: All participants in a game must approve the ticket, or admin can override
- **Comparison Feature**: Players can compare their stats head-to-head with other players
- **Fun Competitive Elements**: Rivalries, streaks, titles, crown chase, and other gamified stats
- **Configurable Point System**: Admin can adjust point tiers (currently: rank 1-3 = 3pts, 4-5 = 2pts, 6-8 = 1pt)
- **Admin Enhancements**: Predefined rejection reasons, point configuration UI
- **Backend Refactor**: Replace JSON file storage with Supabase (frontend already uses Supabase)

## Capabilities

### New Capabilities

- `player-accounts`: User registration, authentication, and profile management for players
- `player-dashboard`: Personal dashboard with stats, streaks, rivalries, game history, and comparison features
- `ticket-system`: Game history submission via tickets with participant approval workflow
- `point-system`: Configurable tier-based point calculation for game rankings

### Modified Capabilities

- `leaderboard`: Enhanced to support player accounts and computed points from game records
- `admin-panel`: Extended with ticket approval, rejection reasons, and point configuration

## Impact

- **Frontend**: New player dashboard view, ticket creation/management UI, comparison UI, login/register flows
- **Backend**: Replace JSON file storage with Supabase; new API endpoints for tickets, player stats, comparisons
- **Database**: New tables for players, tickets, games, game_rankings, point_config, ticket_approvals
- **Existing Data**: Backend currently uses JSON files (`data/users.json`, `data/rankings.json`, `data/gameHistory.json`) - will be replaced with Supabase queries; frontend already has partial Supabase integration
