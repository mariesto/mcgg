## ADDED Requirements

### Requirement: Player Registration
The system SHALL allow new players to register an account using email and password.

#### Scenario: Successful registration
- **WHEN** a new player submits valid email and password
- **THEN** system creates a new account and sends verification email

#### Scenario: Duplicate email
- **WHEN** a player registers with an already-used email
- **THEN** system rejects registration with "Email already in use" error

### Requirement: Player Authentication
The system SHALL allow registered players to log in using email and password.

#### Scenario: Successful login
- **WHEN** player submits correct email and password
- **THEN** system authenticates player and redirects to dashboard

#### Scenario: Invalid credentials
- **WHEN** player submits incorrect email or password
- **THEN** system rejects login with "Invalid credentials" error

### Requirement: Player Profile
The system SHALL allow players to set and update their display name.

#### Scenario: Update display name
- **WHEN** player updates their display name
- **THEN** system saves the new display name
- **AND** display name appears in leaderboard and comparisons

#### Scenario: Display name uniqueness
- **WHEN** player sets a display name already used by another player
- **THEN** system accepts it (display names need not be unique)

### Requirement: Player Logout
The system SHALL allow authenticated players to log out.

#### Scenario: Logout
- **WHEN** player clicks logout
- **THEN** system ends session and redirects to public page
