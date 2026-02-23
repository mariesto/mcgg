## ADDED Requirements

### Requirement: Ticket Management
The system SHALL allow admin to view and manage all tickets.

#### Scenario: View all tickets
- **WHEN** admin views ticket management section
- **THEN** system displays all tickets sorted by creation date descending
- **AND** shows status, creator, participant count, and game count

#### Scenario: Filter tickets by status
- **WHEN** admin filters by status (pending, approved, rejected)
- **THEN** system shows only tickets matching the filter

### Requirement: Ticket Approval/Rejection
The system SHALL allow admin to approve or reject any ticket.

#### Scenario: Admin approves ticket
- **WHEN** admin clicks approve on a pending ticket
- **THEN** ticket status changes to "approved"
- **AND** all participant stats are updated immediately
- **AND** participant approval statuses are ignored

#### Scenario: Admin rejects ticket
- **WHEN** admin clicks reject on a pending ticket
- **THEN** admin must select a rejection reason
- **AND** ticket status changes to "rejected"

### Requirement: Point Configuration UI
The system SHALL provide admin interface for managing point tiers.

#### Scenario: View point configuration
- **WHEN** admin navigates to point configuration
- **THEN** system displays all tiers in a table with rank range and points

#### Scenario: Edit tier
- **WHEN** admin edits a tier's rank start, rank end, or point value
- **THEN** system validates no overlap with other active tiers
- **AND** system saves changes

#### Scenario: Validation error
- **WHEN** admin creates overlapping tier ranges
- **THEN** system rejects with "Tier ranges cannot overlap" error

### Requirement: Player Management
The system SHALL allow admin to manage player accounts.

#### Scenario: View all players
- **WHEN** admin views player management
- **THEN** system displays all players with their stats

#### Scenario: Deactivate player
- **WHEN** admin deactivates a player account
- **THEN** player cannot log in
- **AND** player's historical data remains visible

### Requirement: Rejection Reason Management
The system SHALL allow admin to manage predefined rejection reasons.

#### Scenario: View rejection reasons
- **WHEN** admin views rejection reason settings
- **THEN** system displays all configured rejection reasons

#### Scenario: Add rejection reason
- **WHEN** admin adds a new rejection reason
- **THEN** system makes it available in rejection dropdown
