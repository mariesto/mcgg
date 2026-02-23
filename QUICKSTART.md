# Quick Start Guide

Get your ranking system up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Start the Application

```bash
npm run dev
```

That's it! The application will start automatically with:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 3. Add Your First User

1. Navigate to **http://localhost:5173/admin**
2. Enter a user name and click "Add User"
3. Repeat for all your users

## 4. Create Your First Ranking

1. Go to the Admin Panel
2. Select the date for your ranking
3. Choose users from the dropdown (hold Ctrl/Cmd to select multiple)
4. Click "Create Ranking"

## 5. View the Leaderboard

1. Go to **http://localhost:5173**
2. See the rankings and statistics
3. Switch between dates using the dropdown

## Common Tasks

### Update a User's Score

1. Go to Admin Panel
2. Click "Edit" on the user
3. Update score, wins, or losses
4. Click "Save Changes"

### Create Multiple Daily Rankings

1. For each day's ranking:
   - Select the date
   - Choose the users who participated
   - Create the ranking
2. Go to public view to see different daily boards

### Backup Your Data

Simply copy the files in the `data/` directory:
- `users.json` - All user data
- `rankings.json` - All daily rankings

## Troubleshooting

### Server won't start
- Make sure no other services are using ports 3000 or 5173
- Check that Node.js 20.19+ or 22.12+ is installed

### Data not saving
- Check that the `data/` directory exists
- Make sure you have write permissions for the directory
- Restart the server after making changes

### Frontend not loading
- Check the browser console for errors
- Make sure both server and client are running (use `npm run dev`)

## Next Steps

- Customize colors in the CSS files
- Add more users
- Create daily rankings for each game session
- Share the link with your friends to view rankings!

## Need Help?

Check the main README.md for detailed documentation about features, API endpoints, and customization options.
