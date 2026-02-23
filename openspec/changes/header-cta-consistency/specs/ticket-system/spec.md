## ADDED Requirements

### Requirement: Submit New Game button uses header CTA styling
The "Submit New Game" button in TicketListView header SHALL use the `.nav-link` class with an SVG icon, matching the site-wide header CTA pattern.

#### Scenario: Submit button displays with icon and text
- **WHEN** user views the ticket list page header
- **THEN** the "Submit New Game" button uses `.nav-link` class with a plus icon and text label

#### Scenario: Submit button matches other header CTAs
- **WHEN** user views the ticket list page header
- **THEN** the "Submit New Game" button has consistent spacing, colors, and hover states with other `.nav-link` buttons
