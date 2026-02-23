## ADDED Requirements

### Requirement: Player-Aware Leaderboard
The system SHALL display leaderboard with linked player profiles.

#### Scenario: View public leaderboard
- **WHEN** visitor views leaderboard
- **THEN** system displays all players sorted by total points descending
- **AND** each entry shows display name, points, games played, and win rate

#### Scenario: Highlight logged-in player
- **WHEN** authenticated player views leaderboard
- **THEN** system highlights their own row

### Requirement: Leaderboard Ranking
The system SHALL rank players by total points with tiebreakers.

#### Scenario: Tiebreaker by games won
- **WHEN** two players have equal points
- **THEN** player with more wins ranks higher

#### Scenario: Tiebreaker by games played
- **WHEN** two players have equal points and wins
- **THEN** player with fewer games played ranks higher (higher efficiency)

### Requirement: Leaderboard Filtering
The system SHALL allow filtering leaderboard by time period.

#### Scenario: Filter by time period
- **WHEN** user selects a time period (daily, weekly, monthly, all-time)
- **THEN** system shows leaderboard based on games within that period

### Requirement: King of the Hill
The system SHALL identify and highlight the current #1 player.

#### Scenario: Crown indicator
- **WHEN** player is ranked #1
- **THEN** leaderboard displays crown icon next to their name
- **AND** shows days held at #1 position

### Requirement: Leaderboard Stats Summary
The system SHALL display aggregate statistics at the top of leaderboard.

#### Scenario: View stats summary
- **WHEN** visitor views leaderboard
- **THEN** system displays total games played, total players, and most active player
