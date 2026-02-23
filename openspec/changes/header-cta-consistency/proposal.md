## Why

Header CTAs (Call-to-Action buttons) across different views are inconsistent in styling and missing functionality. DashboardView uses different button classes than PublicView/AdminView, and the theme toggle is completely missing from the player dashboard. This creates a disjointed user experience and violates UI consistency principles.

## What Changes

- **DashboardView.vue**: Replace `.logout-action` with `.nav-link` class matching PublicView pattern, add missing theme toggle button with `toggleTheme()` logic
- **TicketListView.vue**: Replace `.btn.btn-primary` on "Submit New Game" with `.nav-link` class with icon, matching header CTA pattern
- All header CTAs will use consistent `.nav-link` styling with icons

## Capabilities

### New Capabilities

None - this is a UI consistency fix, not a new feature.

### Modified Capabilities

- `player-dashboard`: Add theme toggle functionality to header
- `ticket-system`: Update header CTA styling to match site-wide pattern

## Impact

- **Frontend**: DashboardView.vue, TicketListView.vue
- **User Experience**: Consistent header styling across all views, theme persistence now works in player dashboard
- **No backend changes required**
