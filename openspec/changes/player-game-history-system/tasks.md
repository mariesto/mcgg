## 1. Database Setup

- [x] 1.1 Create `players` table in Supabase
- [x] 1.2 Create `point_config` table in Supabase
- [x] 1.3 Create `rejection_reasons` table in Supabase
- [x] 1.4 Create `tickets` table in Supabase
- [x] 1.5 Create `games` table in Supabase
- [x] 1.6 Create `game_rankings` table in Supabase
- [x] 1.7 Create `ticket_approvals` table in Supabase
- [x] 1.8 Create `admin_users` table in Supabase
- [x] 1.9 Seed default point configuration (tier 1: 1-3=3pts, tier 2: 4-5=2pts, tier 3: 6-8=1pt)
- [x] 1.10 Seed default rejection reasons (INCORRECT_RESULTS, PARTICIPANT_DISPUTE, DUPLICATE_SUBMISSION, MISSING_PROOF, INVALID_DATE, OTHER)
- [x] 1.11 Set up Row Level Security policies

## 2. Backend - Replace JSON with Supabase

- [x] 2.1 Remove JSON file storage functions from server/index.js
- [x] 2.2 Add Supabase client to backend
- [x] 2.3 Replace `/api/users` endpoints with Supabase queries
- [x] 2.4 Replace `/api/rankings` endpoints with Supabase queries
- [x] 2.5 Replace `/api/game-history` endpoints with Supabase queries
- [x] 2.6 Replace `/api/statistics` with Supabase queries
- [ ] 2.7 Delete unused JSON files (data/users.json, data/rankings.json, data/gameHistory.json)

## 3. Backend - Authentication

- [x] 3.1 Create auth middleware for verifying Supabase JWT tokens
- [x] 3.2 Create admin middleware for checking admin role
- [x] 3.3 Create `/api/auth/register` endpoint (wraps Supabase signUp + creates player record)
- [x] 3.4 Create `/api/auth/me` endpoint to get current user with player profile
- [x] 3.5 Create `/api/players/profile` endpoint to update display name

## 4. Backend - Point System

- [x] 4.1 Create `/api/admin/point-config` GET endpoint
- [x] 4.2 Create `/api/admin/point-config` PUT endpoint
- [x] 4.3 Create point calculation utility function
- [x] 4.4 Create point aggregation query for player stats

## 5. Backend - Ticket System

- [x] 5.1 Create `/api/tickets` GET endpoint (list user's tickets)
- [x] 5.2 Create `/api/tickets` POST endpoint (create ticket with games)
- [x] 5.3 Create `/api/tickets/:id` GET endpoint (ticket details)
- [x] 5.4 Create `/api/tickets/:id` PUT endpoint (edit pending ticket)
- [x] 5.5 Create `/api/tickets/:id` DELETE endpoint (cancel pending ticket)
- [x] 5.6 Create `/api/tickets/:id/approve` POST endpoint (participant approval)
- [x] 5.7 Create `/api/tickets/:id/reject` POST endpoint (participant rejection)
- [x] 5.8 Create `/api/tickets/pending-approvals` GET endpoint (tickets awaiting user's approval)
- [x] 5.9 Create `/api/admin/tickets` GET endpoint (all tickets for admin)
- [x] 5.10 Create `/api/admin/tickets/:id/approve` POST endpoint (admin override approve)
- [x] 5.11 Create `/api/admin/tickets/:id/reject` POST endpoint (admin override reject)

## 6. Backend - Player Stats & Dashboard

- [x] 6.1 Create `/api/players/me/stats` GET endpoint (personal stats)
- [x] 6.2 Create `/api/players/me/history` GET endpoint (game history)
- [x] 6.3 Create `/api/players/me/streak` GET endpoint (current and best streak)
- [x] 6.4 Create `/api/players/me/rivalries` GET endpoint (nemesis and prey)
- [x] 6.5 Create `/api/players/me/title` GET endpoint (current title)
- [x] 6.6 Create `/api/players/:id/compare` GET endpoint (head-to-head comparison)
- [x] 6.7 Create `/api/players/me/crown-chase` GET endpoint (points behind leader)

## 7. Backend - Leaderboard

- [x] 7.1 Create `/api/leaderboard` GET endpoint with sorting and tiebreakers
- [x] 7.2 Add time period filtering to leaderboard endpoint
- [x] 7.3 Add crown/king tracking to leaderboard endpoint
- [x] 7.4 Create `/api/stats/summary` GET endpoint (aggregate stats)

## 8. Backend - Admin Panel

- [x] 8.1 Create `/api/admin/players` GET endpoint (list all players)
- [x] 8.2 Create `/api/admin/players/:id/deactivate` POST endpoint
- [x] 8.3 Create `/api/admin/rejection-reasons` GET endpoint
- [x] 8.4 Create `/api/admin/rejection-reasons` POST endpoint (add new reason)

## 9. Frontend - Authentication

- [x] 9.1 Update Supabase client configuration for auth
- [x] 9.2 Create Login.vue component
- [x] 9.3 Create Register.vue component
- [x] 9.4 Create auth composable for state management
- [x] 9.5 Add route guards for protected routes
- [x] 9.6 Create navigation with login/logout buttons

## 10. Frontend - Player Dashboard

- [x] 10.1 Create Dashboard.vue layout component
- [x] 10.2 Create stats overview section with personal statistics
- [x] 10.3 Create streak display component with fire emoji
- [x] 10.4 Create rivalries section (nemesis and prey)
- [x] 10.5 Create crown chase section (distance to #1)
- [x] 10.6 Create player title display component
- [x] 10.7 Create game history list component
- [x] 10.8 Create pending confirmations section with approve/reject buttons

## 11. Frontend - Comparison Feature

- [x] 11.1 Create player selector dropdown component
- [x] 11.2 Create comparison view with side-by-side stats
- [x] 11.3 Create head-to-head record display
- [x] 11.4 Add progress bars for visual comparison

## 12. Frontend - Ticket System

- [x] 12.1 Create TicketList.vue component (my tickets)
- [x] 12.2 Create TicketCreate.vue component with form
- [x] 12.3 Create game entry form (date, mode, rankings)
- [x] 12.4 Create participant selector with rank input
- [x] 12.5 Create TicketEdit.vue component
- [x] 12.6 Create TicketDetail.vue component with approval status

## 13. Frontend - Leaderboard Updates

- [x] 13.1 Update Leaderboard.vue to use new API
- [x] 13.2 Add logged-in player highlight
- [x] 13.3 Add crown icon for #1 player
- [x] 13.4 Add time period filter dropdown
- [x] 13.5 Add stats summary section

## 14. Frontend - Admin Panel Updates

- [x] 14.1 Create AdminTickets.vue component
- [x] 14.2 Create ticket approval/rejection with reason selector
- [x] 14.3 Create AdminPointConfig.vue component
- [x] 14.4 Create tier management form
- [x] 14.5 Create AdminPlayers.vue component with deactivate action
- [x] 14.6 Create rejection reason management section

## 15. Cleanup & Testing

- [x] 15.1 Remove old JSON-based code from backend
- [x] 15.2 Remove old data files (data/*.json)
- [ ] 15.3 Test player registration flow
- [ ] 15.4 Test ticket creation with multiple games
- [ ] 15.5 Test participant approval flow
- [ ] 15.6 Test admin override flow
- [ ] 15.7 Test point calculation with different configurations
- [ ] 15.8 Test comparison feature
- [ ] 15.9 Test leaderboard filtering
- [x] 15.10 Add error handling and loading states
- [x] 15.11 Add responsive styling for mobile
