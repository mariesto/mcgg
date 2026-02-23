## 1. Backend - Username Login Support

- [x] 1.1 Modify `/api/auth/login` endpoint to accept `identifier` instead of `email` (support both email and username)
- [x] 1.2 Add email detection logic (check for `@` character)
- [x] 1.3 Add username lookup query (case-insensitive search on `players.display_name`)
- [x] 1.4 Retrieve email from `auth.users` table when username is provided
- [x] 1.5 Return "Invalid credentials" error for both invalid username and wrong password cases

## 2. Frontend - Login Form Updates

- [x] 2.1 Update LoginView.vue form label from "Email" to "Email or Username"
- [x] 2.2 Update LoginView.vue input placeholder to indicate email or username is accepted
- [x] 2.3 Rename `email` ref to `identifier` in LoginView.vue
- [x] 2.4 Update login function call to pass `identifier` instead of `email`
- [x] 2.5 Update useAuth.js `login` function to accept `identifier` parameter
- [x] 2.6 Update supabase.js `signInWithEmail` to accept identifier (backend handles resolution)

## 3. Frontend - Player Icon in Header

- [x] 3.1 Add user SVG icon to PublicView.vue header beside player's display name
- [x] 3.2 Add user SVG icon to DashboardView.vue header beside player's display name
- [x] 3.3 Style the icon to match existing nav-link icons (18px size, proper spacing)

## 4. Testing

- [ ] 4.1 Test login with valid email
- [ ] 4.2 Test login with valid username (case-insensitive)
- [ ] 4.3 Test login with invalid username shows "Invalid credentials"
- [ ] 4.4 Test login with valid username but wrong password shows "Invalid credentials"
- [ ] 4.5 Test player icon displays in PublicView header when logged in
- [ ] 4.6 Test player icon displays in DashboardView header when logged in
