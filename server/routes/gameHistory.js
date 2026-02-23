import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

router.get('/game-history', async (req, res) => {
  const { date } = req.query;

  try {
    const pointConfig = await getPointConfig();

    let query = supabase
      .from('game_rankings')
      .select(`
        rank,
        games!inner (
          id,
          game_mode,
          played_at,
          position,
          tickets!inner (status)
        ),
        players (id, display_name)
      `)
      .eq('games.tickets.status', 'approved')
      .order('games.played_at', { ascending: false });

    if (date) {
      query = query.gte('games.played_at', `${date}T00:00:00`).lte('games.played_at', `${date}T23:59:59`);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const groupedByDate = {};
    (data || []).forEach(record => {
      const gameDate = record.games.played_at.split('T')[0];
      const gameId = record.games.id;

      if (!groupedByDate[gameDate]) {
        groupedByDate[gameDate] = { date: gameDate, histories: {} };
      }

      if (!groupedByDate[gameDate].histories[gameId]) {
        groupedByDate[gameDate].histories[gameId] = {
          matchId: Object.keys(groupedByDate[gameDate].histories).length + 1,
          game_mode: record.games.game_mode,
          played_at: record.games.played_at,
          players: [],
        };
      }

      groupedByDate[gameDate].histories[gameId].players.push({
        name: record.players.display_name,
        position: record.rank,
      });
    });

    const result = Object.values(groupedByDate).map(day => ({
      date: day.date,
      histories: Object.values(day.histories).sort((a, b) => 
        new Date(b.played_at) - new Date(a.played_at)
      ),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game history' });
  }
});

router.get('/all-game-dates', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('played_at')
      .order('played_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const dates = [...new Set((data || []).map(g => g.played_at.split('T')[0]))];
    res.json(dates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game dates' });
  }
});

async function getPointConfig() {
  const { data } = await supabase
    .from('point_config')
    .select('*')
    .eq('is_active', true);
  return data || [];
}

export { router as gameHistoryRouter };
