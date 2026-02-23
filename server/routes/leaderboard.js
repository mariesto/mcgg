import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

const getPointConfig = async () => {
  const { data } = await supabase
    .from('point_config')
    .select('*')
    .eq('is_active', true);
  return data || [];
};

const calculatePointsForRank = (rank, pointConfig) => {
  const tier = pointConfig.find(t => rank >= t.rank_start && rank <= t.rank_end);
  return tier ? tier.points : 0;
};

router.get('/', async (req, res) => {
  const { period } = req.query;

  try {
    const pointConfig = await getPointConfig();

    const { data: allPlayers } = await supabase
      .from('players')
      .select('id, display_name, is_active')
      .eq('is_active', true);

    const playerStats = {};
    (allPlayers || []).forEach(p => {
      playerStats[p.id] = {
        id: p.id,
        display_name: p.display_name,
        points: 0,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        firstPlaces: 0,
      };
    });

    let query = supabase
      .from('game_rankings')
      .select('player_id, rank, games!inner (played_at, tickets!inner (status))')
      .eq('games.tickets.status', 'approved');

    if (period) {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'monthly':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query = query.gte('games.played_at', startDate.toISOString());
      }
    }

    const { data: rankings } = await query;

    (rankings || []).forEach(r => {
      if (playerStats[r.player_id]) {
        const points = calculatePointsForRank(r.rank, pointConfig);
        playerStats[r.player_id].points += points;
        playerStats[r.player_id].gamesPlayed++;
        
        if (r.rank <= 3) {
          playerStats[r.player_id].wins++;
          if (r.rank === 1) {
            playerStats[r.player_id].firstPlaces++;
          }
        } else {
          playerStats[r.player_id].losses++;
        }
      }
    });

    const leaderboard = Object.values(playerStats)
      .filter(p => p.gamesPlayed > 0)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.gamesPlayed - b.gamesPlayed;
      })
      .map((player, index) => ({
        ...player,
        rank: index + 1,
        winRate: player.gamesPlayed > 0 
          ? ((player.wins / player.gamesPlayed) * 100).toFixed(1) 
          : 0,
      }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

router.get('/crown', async (req, res) => {
  try {
    const pointConfig = await getPointConfig();

    const { data: allPlayers } = await supabase
      .from('players')
      .select('id, display_name, is_active')
      .eq('is_active', true);

    const playerPoints = {};
    (allPlayers || []).forEach(p => {
      playerPoints[p.id] = { id: p.id, display_name: p.display_name, points: 0 };
    });

    const { data: rankings } = await supabase
      .from('game_rankings')
      .select('player_id, rank, games!inner (tickets!inner (status))')
      .eq('games.tickets.status', 'approved');

    (rankings || []).forEach(r => {
      const points = calculatePointsForRank(r.rank, pointConfig);
      if (playerPoints[r.player_id]) {
        playerPoints[r.player_id].points += points;
      }
    });

    const sorted = Object.values(playerPoints).sort((a, b) => b.points - a.points);
    const king = sorted[0] || null;

    res.json({ king });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get crown info' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { data: players } = await supabase
      .from('players')
      .select('id')
      .eq('is_active', true);

    const { data: games } = await supabase
      .from('games')
      .select('id, tickets!inner (status)')
      .eq('tickets.status', 'approved');

    const { data: rankings } = await supabase
      .from('game_rankings')
      .select('player_id, rank, games!inner (tickets!inner (status))')
      .eq('games.tickets.status', 'approved');

    const gamesPerPlayer = {};
    (rankings || []).forEach(r => {
      gamesPerPlayer[r.player_id] = (gamesPerPlayer[r.player_id] || 0) + 1;
    });

    let mostActivePlayer = null;
    let maxGames = 0;
    Object.entries(gamesPerPlayer).forEach(([playerId, count]) => {
      if (count > maxGames) {
        maxGames = count;
        mostActivePlayer = playerId;
      }
    });

    let mostActivePlayerData = null;
    if (mostActivePlayer) {
      const { data } = await supabase
        .from('players')
        .select('id, display_name')
        .eq('id', mostActivePlayer)
        .single();
      mostActivePlayerData = data ? { ...data, gamesPlayed: maxGames } : null;
    }

    res.json({
      totalPlayers: (players || []).length,
      totalGames: (games || []).length,
      mostActivePlayer: mostActivePlayerData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

export { router as leaderboardRouter };
