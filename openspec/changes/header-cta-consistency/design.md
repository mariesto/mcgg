## Context

Three views currently have headers with different button styling:

| View | Current State |
|------|---------------|
| PublicView.vue | Uses `.nav-link` class, has theme toggle, consistent styling |
| AdminView.vue | Uses `.nav-link` class, has theme toggle, consistent styling |
| DashboardView.vue | Uses `.logout-action` class (different), missing theme toggle |
| TicketListView.vue | Uses `.btn.btn-primary` for "Submit New Game" (different from header pattern) |

The reference pattern from PublicView.vue uses:
- `.nav-link` class for all header CTAs
- SVG icons alongside text labels
- `.theme-toggle` button with sun/moon icons
- `isDarkMode` ref and `toggleTheme()` function for theme persistence

## Goals / Non-Goals

**Goals:**
- Make DashboardView header match PublicView/AdminView styling
- Add theme toggle functionality to player dashboard
- Make TicketListView "Submit New Game" button match header CTA pattern
- Ensure theme preference persists and syncs across all views

**Non-Goals:**
- Changing the visual design of buttons
- Adding new features beyond consistency
- Backend changes

## Decisions

### 1. Use `.nav-link` class for all header CTAs

**Rationale:** This is the established pattern in PublicView.vue and AdminView.vue. It ensures visual and behavioral consistency.

**Alternative considered:** Create a shared component. Rejected because:
- Only 4 views exist
- Simple CSS class application is sufficient
- No need for component abstraction overhead

### 2. Copy theme toggle logic from PublicView to DashboardView

**Rationale:** The theme toggle logic is already implemented and tested in PublicView.vue:
- `isDarkMode` ref
- `toggleTheme()` function
- localStorage persistence
- System preference detection

**Alternative considered:** Extract to composable. Rejected for now - can be refactored later if more views need it.

### 3. "Submit New Game" as `.nav-link` with icon

**Rationale:** Matches header CTA pattern. Current `.btn.btn-primary` looks like a form submit button, not a navigation action.

**Icon choice:** Plus icon (`+`) to indicate "create new" action.

## Risks / Trade-offs

- **CSS specificity:** `.nav-link` styles may need adjustment if view-specific overrides exist. Mitigation: Check computed styles in browser.
- **Theme sync:** If user toggles theme in Dashboard, then navigates to PublicView, both should stay in sync via localStorage.
