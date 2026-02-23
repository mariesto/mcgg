## Why

Players currently login with email only, which is less convenient than using a memorable username. Additionally, the logged-in player's name in the header lacks visual identification, making the UI feel impersonal. This change improves user experience by enabling username-based login and adding a player icon/avatar beside the name.

## What Changes

- **Username Login**: Players can login using either their email address OR their display name (username)
- **Player Icon in Header**: Add a user icon/SVG beside the player's name in the header after login
- **Backend Login Enhancement**: Modify login endpoint to detect email vs username input and handle both cases
- **Frontend Login Form**: Update placeholder text and label to indicate email or username is accepted

## Capabilities

### New Capabilities

- `username-login`: Allow players to authenticate using their display name as an alternative to email

### Modified Capabilities

- `player-accounts`: Login form now accepts email or username, player header displays icon beside name

## Impact

- **Frontend**: LoginView.vue (form label/placeholder), PublicView.vue (player icon in header), DashboardView.vue (player icon in header)
- **Backend**: server/routes/auth.js (login endpoint to handle username lookup)
- **Database**: No schema changes - display_name field in players table serves as username
- **User Experience**: More flexible login, more personalized header
