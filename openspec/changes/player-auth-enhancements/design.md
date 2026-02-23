## Context

Current login flow:
1. Frontend sends `{ email, password }` to `/api/auth/login`
2. Backend directly calls Supabase `signInWithPassword` with email
3. No username-based authentication exists

Current header display:
- PublicView.vue: Shows `{{ player?.display_name }}` without icon
- DashboardView.vue: Shows `{{ player?.display_name || 'Player' }}` without icon

## Goals / Non-Goals

**Goals:**
- Enable login with either email or display_name
- Add user icon beside player name in headers
- Maintain backward compatibility (email login still works)
- Keep security unchanged (password validation via Supabase)

**Non-Goals:**
- Profile pictures/avatars (just an SVG icon)
- Changing registration flow
- Admin login changes (admin still uses email)

## Decisions

### 1. Email vs Username Detection

**Decision:** Detect by presence of `@` character.

**Rationale:** Simple heuristic that works for all valid emails. Display names are unlikely to contain `@`.

```javascript
const isEmail = identifier.includes('@');
```

**Alternative considered:** Regex email validation. Rejected because:
- Overkill for this use case
- Could reject valid edge-case emails

### 2. Username Lookup Flow

**Decision:** When username is provided, lookup email from `players` table by `display_name`, then authenticate with that email.

**Flow:**
```
Input: identifier (email or username) + password
  ↓
Is email? ──Yes──→ Direct Supabase auth with identifier
  ↓ No
Lookup players.display_name = identifier
  ↓
Found? ──No──→ Return "Invalid credentials"
  ↓ Yes
Get player's email from auth.users
  ↓
Supabase auth with email + password
```

**Rationale:** Supabase Auth only supports email-based login. We bridge username to email via database lookup.

### 3. Player Icon Design

**Decision:** Use a simple user SVG icon (circle with shoulders silhouette).

**Rationale:** 
- Matches existing icon style in the codebase
- No external dependencies
- Consistent with nav-link icons

### 4. Case Sensitivity for Usernames

**Decision:** Case-insensitive username matching using PostgreSQL `LOWER()`.

**Rationale:** User experience - prevents "John" vs "john" login issues.

## Risks / Trade-offs

- **Username collision risk:** Two players could have same display_name with different casing. Mitigation: Case-insensitive lookup returns first match. Future: Add unique constraint on `LOWER(display_name)`.
- **Enumeration attack:** Attackers could discover valid usernames by trying different inputs. Mitigation: Same error message for invalid username and wrong password ("Invalid credentials").
- **Performance:** Extra database query for username logins. Mitigation: Indexed lookup on `display_name` is fast.
