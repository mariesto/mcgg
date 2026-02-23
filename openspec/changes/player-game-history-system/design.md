## Context

The system uses Vue 3 frontend with partial Supabase integration and an Express backend still using JSON file storage. This change consolidates to Supabase-only for consistency and enables player self-service features.

**Current Architecture (mixed):**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Vue 3      │────▶│  Express    │────▶│  JSON files │
│  Frontend   │     │  Backend    │     │  (data/)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       └──────────────────────────────────┐
                                          ▼
                                   ┌─────────────┐
                                   │  Supabase   │
                                   │ (partial)   │
                                   └─────────────┘
```

**Target Architecture (Supabase-only):**
```
┌─────────────┐                            ┌─────────────┐
│  Vue 3      │───────────────────────────▶│  Supabase   │
│  Frontend   │   (Auth + Data direct)     │  (Postgres) │
└─────────────┘                            └─────────────┘

                    Optional: Backend for complex queries
                    (most operations go direct to Supabase)
```

## Goals / Non-Goals

**Goals:**
- Enable player self-registration and authentication via Supabase Auth
- Implement ticket-based game history submission with participant approval
- Create engaging player dashboards with competitive stats
- Replace all JSON file storage with Supabase
- Support configurable point system managed by admins

**Non-Goals:**
- Auto-approval of tickets (requires scheduler, out of scope for v1)
- Screenshot attachments (future enhancement)
- Real-time notifications (can use polling for now)
- Mobile app (web-only for now)
- Data migration from JSON files (start fresh with new schema)

## Decisions

### 1. Architecture: Supabase-first (minimal backend)

**Rationale:** 
- Frontend already uses Supabase for some operations
- Supabase provides auth, database, and RLS out of the box
- Reduces backend complexity - most operations can go direct
- Backend only needed for complex aggregations (rivalries, streaks)

**Alternative considered:** Keep Express backend as primary
- Rejected: Duplicates logic, inconsistent with frontend patterns, more code to maintain

### 2. Auth: Supabase Auth with email/password

**Rationale:**
- Built-in session management
- Secure password handling
- Easy integration with frontend
- Row-level security potential

**Alternative considered:** Custom JWT implementation
- Rejected: More code, security risk, Supabase handles this well

### 3. Point System: Store raw ranks, compute points at query time

**Rationale:**
- Admin can change point config without data migration
- Always accurate to current configuration
- Simpler data model (no denormalized points)

**Alternative considered:** Store computed points in game_rankings
- Rejected: Historical data becomes wrong if config changes

### 4. Ticket Approval: Parallel paths (participants OR admin)

**Rationale:**
- Admin has full authority - can approve regardless of participant votes
- Participants can self-approve for trust-based workflow
- Rejection requires ANY participant to vote, OR admin rejects

**Flow:**
```
Ticket Created
      │
      ├──────────────────────────────┐
      ▼                              ▼
[Admin reviews]              [Participants vote]
      │                              │
      │                              ├── All approve ──► APPROVED
      │                              └── Any reject  ──► REJECTED
      │
      ├── Approve ──► APPROVED (ignores votes)
      └── Reject   ──► REJECTED (with reason)
```

### 5. Database Schema

```sql
-- Players (linked to Supabase auth.users)
players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Point configuration (admin managed)
point_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name VARCHAR(50) NOT NULL,
  rank_start INT NOT NULL,
  rank_end INT NOT NULL,
  points INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Rejection reasons (admin managed)
rejection_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
)

-- Tickets
tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES players(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason_id UUID REFERENCES rejection_reasons(id),
  rejection_detail TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)

-- Games within a ticket
games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  game_mode VARCHAR(20) NOT NULL CHECK (game_mode IN ('RANKED', 'CLASSIC', 'CUSTOM')),
  played_at TIMESTAMPTZ NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Individual player rankings per game
game_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  rank INT NOT NULL CHECK (rank >= 1 AND rank <= 8),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_id, player_id)
)

-- Participant approvals
ticket_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ticket_id, player_id)
)

-- Admin role flag (extend Supabase auth)
admin_users (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Players don't confirm tickets | Admin can override any ticket |
| Point config change affects historical stats | Document that stats are computed with current config |
| Inactive players block tickets | Admin override is the solution for now |
| Supabase rate limits | Most queries are read-heavy; implement caching if needed |

## Open Questions

- Player display names: auto-generate from email or require on signup?
- Title system: should titles persist or recalculate on-the-fly?
- Should we keep minimal Express backend or go fully serverless with Supabase Edge Functions?
