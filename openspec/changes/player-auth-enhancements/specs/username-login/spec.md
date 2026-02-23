## ADDED Requirements

### Requirement: Login with email or username
The system SHALL allow players to authenticate using either their email address or their display name (username).

#### Scenario: Login with valid email
- **WHEN** player submits login form with a valid email address and correct password
- **THEN** system authenticates the player and returns a valid session

#### Scenario: Login with valid username
- **WHEN** player submits login form with their display name (username) and correct password
- **THEN** system looks up the player by display name, retrieves their email, authenticates, and returns a valid session

#### Scenario: Login with invalid username
- **WHEN** player submits login form with a non-existent display name and any password
- **THEN** system returns an "Invalid credentials" error without revealing whether the username exists

#### Scenario: Login with correct username but wrong password
- **WHEN** player submits login form with a valid display name but incorrect password
- **THEN** system returns an "Invalid credentials" error

#### Scenario: Case-insensitive username matching
- **WHEN** player submits login form with a display name in different casing (e.g., "John" vs "john")
- **THEN** system matches the username case-insensitively and authenticates if credentials are correct

### Requirement: Login form indicates flexible input
The login form SHALL indicate to users that they can enter either email or username.

#### Scenario: Login form placeholder text
- **WHEN** player views the login form
- **THEN** the input field placeholder displays text indicating email or username is accepted

#### Scenario: Login form label
- **WHEN** player views the login form
- **THEN** the input field label indicates "Email or Username" rather than just "Email"
