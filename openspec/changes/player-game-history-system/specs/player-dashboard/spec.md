## ADDED Requirements

### Requirement: Personal Statistics Display
The system SHALL display player statistics including total points, games played, wins, losses, and win rate.

#### Scenario: View own stats
- **WHEN** player views their dashboard
- **THEN** system displays total points, games played, win rate, and current rank

### Requirement: Game History Display
The system SHALL display player's game history showing date, mode, and rank for each game.

#### Scenario: View game history
- **WHEN** player views game history section
- **THEN** system lists all approved games sorted by date descending
- **AND** each entry shows date, game mode, and player's rank

### Requirement: Streak Tracking
The system SHALL track and display player streaks (consecutive top 3 finishes).

#### Scenario: Hot streak displayed
- **WHEN** player has 2 or more consecutive top 3 finishes
- **THEN** dashboard displays current streak with fire emoji indicator

#### Scenario: Best streak displayed
- **WHEN** player views dashboard
- **THEN** system shows their all-time best streak

### Requirement: Rivalries Display
The system SHALL identify and display the player's nemesis (player who beats them most) and prey (player they beat most).

#### Scenario: Nemesis identified
- **WHEN** player has played 3+ games with another player
- **AND** that player beats them more than 50% of the time
- **THEN** system displays that player as "Your Nemesis"

#### Scenario: Prey identified
- **WHEN** player has played 3+ games with another player
- **AND** player beats them more than 50% of the time
- **THEN** system displays that player as "Your Prey"

### Requirement: Crown Chase
The system SHALL show how far the player is from the #1 ranked player.

#### Scenario: Points behind leader
- **WHEN** player is not ranked #1
- **THEN** dashboard displays points needed to overtake current #1

#### Scenario: Currently #1
- **WHEN** player is ranked #1
- **THEN** dashboard displays "You are the King!" message

### Requirement: Player Title
The system SHALL assign titles to players based on their performance.

#### Scenario: New player title
- **WHEN** player has fewer than 5 games
- **THEN** system displays title "Fresh Meat"

#### Scenario: Rising star title
- **WHEN** player climbs 3+ ranks in a week
- **THEN** system displays title "Rising Star"

### Requirement: Comparison Feature
The system SHALL allow players to compare their statistics with any other player.

#### Scenario: Compare with another player
- **WHEN** player selects another player to compare
- **THEN** system displays side-by-side comparison including:
  - Total points
  - Games played
  - Win rate
  - Top 3 finish rate
  - 1st place count
  - Head-to-head record (who ranked higher in shared games)

#### Scenario: Head-to-head calculation
- **WHEN** comparing two players who have played games together
- **THEN** system counts games where both participated
- **AND** shows how many times each ranked higher

### Requirement: Pending Confirmations
The system SHALL display tickets requiring player's approval.

#### Scenario: Show pending confirmations
- **WHEN** player is a participant in a pending ticket
- **THEN** dashboard displays ticket with approve/reject actions
