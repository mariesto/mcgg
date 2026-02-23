## ADDED Requirements

### Requirement: Player icon displayed in header
The system SHALL display a user icon beside the player's display name in the header when logged in.

#### Scenario: Player icon in PublicView header
- **WHEN** a logged-in player views the PublicView (leaderboard)
- **THEN** a user icon (SVG) is displayed immediately before their display name in the header

#### Scenario: Player icon in DashboardView header
- **WHEN** a logged-in player views their dashboard
- **THEN** a user icon (SVG) is displayed immediately before their display name in the header

#### Scenario: Icon style consistency
- **WHEN** the player icon is displayed
- **THEN** the icon matches the existing icon style used for other header elements (nav-link icons)
