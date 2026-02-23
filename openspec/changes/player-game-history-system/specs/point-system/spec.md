## ADDED Requirements

### Requirement: Tier-Based Point Calculation
The system SHALL calculate points based on player rank using configurable tiers.

#### Scenario: Calculate points for rank 1-3
- **WHEN** player finishes a game at rank 1, 2, or 3
- **THEN** system awards 3 points (default tier 1)

#### Scenario: Calculate points for rank 4-5
- **WHEN** player finishes a game at rank 4 or 5
- **THEN** system awards 2 points (default tier 2)

#### Scenario: Calculate points for rank 6-8
- **WHEN** player finishes a game at rank 6, 7, or 8
- **THEN** system awards 1 point (default tier 3)

### Requirement: Point Configuration Management
The system SHALL allow admin to configure point tiers.

#### Scenario: View point configuration
- **WHEN** admin views point configuration
- **THEN** system displays all tiers with rank ranges and point values

#### Scenario: Modify point tier
- **WHEN** admin modifies a tier's rank range or point value
- **THEN** system saves the new configuration
- **AND** all future point calculations use new values

#### Scenario: Add new tier
- **WHEN** admin adds a new tier
- **THEN** system creates new tier configuration
- **AND** tier becomes available for point calculation

#### Scenario: Deactivate tier
- **WHEN** admin deactivates a tier
- **THEN** system marks tier as inactive
- **AND** inactive tiers do not affect point calculation

### Requirement: Historical Point Computation
The system SHALL compute points at query time using current configuration.

#### Scenario: Stats reflect current config
- **WHEN** player views their statistics
- **THEN** points are calculated using current point configuration
- **AND** historical games are recalculated with current tier values

### Requirement: Point Aggregation
The system SHALL aggregate points across all approved games for each player.

#### Scenario: Total points calculation
- **WHEN** system calculates player's total points
- **THEN** system sums points from all approved games
- **AND** pending or rejected games are excluded

#### Scenario: Points by game mode
- **WHEN** system displays breakdown by mode
- **THEN** system shows points earned in RANKED, CLASSIC, and CUSTOM separately
