## ADDED Requirements

### Requirement: Ticket Creation
The system SHALL allow authenticated players to create tickets containing one or more game records.

#### Scenario: Create ticket with single game
- **WHEN** player submits a ticket with one game containing 1-8 player rankings
- **THEN** system creates ticket with status "pending"
- **AND** system creates approval entries for all participant players

#### Scenario: Create ticket with multiple games
- **WHEN** player submits a ticket with multiple games
- **THEN** system creates ticket containing all games
- **AND** each game has its own date, mode, and rankings

#### Scenario: Ticket includes all required fields
- **WHEN** player creates a ticket
- **THEN** each game MUST include: date/time, game mode, and at least one player ranking

### Requirement: Game Mode Selection
The system SHALL support three game modes: RANKED, CLASSIC, and CUSTOM.

#### Scenario: Select game mode
- **WHEN** player creates a game record
- **THEN** system allows selection of RANKED, CLASSIC, or CUSTOM mode

### Requirement: Player Ranking Entry
The system SHALL allow entry of player rankings (1-8) for each game.

#### Scenario: Enter player rankings
- **WHEN** player adds participants to a game
- **THEN** system requires rank (1-8) for each participant
- **AND** ranks must be unique within the game

#### Scenario: Partial player entry
- **WHEN** game has fewer than 8 tracked participants
- **THEN** system accepts the submission
- **AND** random players are implied to fill remaining positions

### Requirement: Ticket Editing
The system SHALL allow ticket creator to edit the ticket while status is "pending".

#### Scenario: Edit pending ticket
- **WHEN** ticket creator edits a pending ticket
- **THEN** system updates ticket and game records
- **AND** existing approvals are reset to "pending"

#### Scenario: Edit approved ticket rejected
- **WHEN** player attempts to edit an approved or rejected ticket
- **THEN** system rejects the edit

### Requirement: Ticket Cancellation
The system SHALL allow ticket creator to cancel a pending ticket.

#### Scenario: Cancel pending ticket
- **WHEN** ticket creator cancels a pending ticket
- **THEN** system deletes the ticket and all associated games

#### Scenario: Cancel non-pending ticket rejected
- **WHEN** player attempts to cancel an approved or rejected ticket
- **THEN** system rejects the cancellation

### Requirement: Participant Approval
The system SHALL require all participant players to approve a ticket (unless admin overrides).

#### Scenario: Player approves ticket
- **WHEN** participant player clicks approve
- **THEN** system records their approval

#### Scenario: Player rejects ticket
- **WHEN** participant player clicks reject
- **THEN** system marks ticket as "rejected"
- **AND** ticket requires admin intervention to re-open

#### Scenario: All participants approve
- **WHEN** all participants approve the ticket
- **THEN** system changes ticket status to "approved"
- **AND** player stats are updated

### Requirement: Admin Ticket Override
The system SHALL allow admin to approve or reject any ticket regardless of participant votes.

#### Scenario: Admin approves directly
- **WHEN** admin approves a pending ticket
- **THEN** ticket status changes to "approved"
- **AND** participant votes are ignored
- **AND** player stats are updated

#### Scenario: Admin rejects with reason
- **WHEN** admin rejects a ticket
- **THEN** admin MUST select a rejection reason
- **AND** ticket status changes to "rejected"

### Requirement: Rejection Reasons
The system SHALL provide predefined rejection reasons for admin use.

#### Scenario: Select rejection reason
- **WHEN** admin rejects a ticket
- **THEN** system presents predefined reasons:
  - INCORRECT_RESULTS
  - PARTICIPANT_DISPUTE
  - DUPLICATE_SUBMISSION
  - MISSING_PROOF
  - INVALID_DATE
  - OTHER (requires typed explanation)

#### Scenario: Rejection reason visible to players
- **WHEN** ticket is rejected
- **THEN** players can see the rejection reason

### Requirement: Ticket Listing
The system SHALL display player's submitted tickets and their status.

#### Scenario: View my tickets
- **WHEN** player views their tickets section
- **THEN** system lists all tickets created by the player
- **AND** shows status (pending, approved, rejected) and rejection reason if applicable
