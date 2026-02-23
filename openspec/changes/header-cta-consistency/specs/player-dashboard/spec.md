## ADDED Requirements

### Requirement: Theme toggle in player dashboard header
The player dashboard header SHALL include a theme toggle button that allows users to switch between light and dark modes.

#### Scenario: User toggles theme to dark mode
- **WHEN** user clicks the theme toggle button while in light mode
- **THEN** the interface switches to dark mode and the preference is saved to localStorage

#### Scenario: User toggles theme to light mode
- **WHEN** user clicks the theme toggle button while in dark mode
- **THEN** the interface switches to light mode and the preference is saved to localStorage

#### Scenario: Theme preference persists on page reload
- **WHEN** user reloads the player dashboard page
- **THEN** the theme matches the previously saved preference from localStorage

### Requirement: Consistent header CTA styling
The player dashboard header CTAs SHALL use the `.nav-link` class with SVG icons, matching the styling pattern established in PublicView.

#### Scenario: Logout button uses nav-link styling
- **WHEN** user views the player dashboard header
- **THEN** the logout button uses `.nav-link` class with an SVG icon and text label

#### Scenario: All header buttons match PublicView pattern
- **WHEN** user views the player dashboard header
- **THEN** all header buttons use `.nav-link` class with consistent spacing, colors, and hover states
