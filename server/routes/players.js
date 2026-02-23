import express from 'express';
import { supabase } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

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

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  const { displayName } = req.body;

  if (!displayName) {
    return res.status(400).json({ error: 'displayName is required' });
  }

  try {
    const { data, error } = await supabase
      .from('players')
      .update({ display_name: displayName })
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/me/stats', authMiddleware, async (req, res) => {
  try {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const pointConfig = await getPointConfig();

    const { data: rankings } = await supabase
      .from('game_rankings')
      .select(`
        rank,
        games!inner (
          id,
          game_mode,
          played_at,
          tickets!inner (status)
        )
      `)
      .eq('player_id', player.id)
      .eq('games.tickets.status', 'approved');

    let totalPoints = 0;
    let gamesPlayed = 0;
    let wins = 0;
    let losses = 0;
    let firstPlaces = 0;
    let topThreeFinishes = 0;

    (rankings || []).forEach(r => {
      gamesPlayed++;
      const points = calculatePointsForRank(r.rank, pointConfig);
      totalPoints += points;

      if (r.rank <= 3) {
        wins++;
        topThreeFinishes++;
        if (r.rank === 1) firstPlaces++;
      } else {
        losses++;
      }
    });

    res.json({
      totalPoints,
      gamesPlayed,
      wins,
      losses,
      winRate: gamesPlayed > 0 ? ((wins / gamesPlayed) * 100).toFixed(1) : 0,
      firstPlaces,
      topThreeFinishes,
      topThreeRate: gamesPlayed > 0 ? ((topThreeFinishes / gamesPlayed) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

router.get('/me/history', authMiddleware, async (req, res) => {
  try {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const { data, error } = await supabase
      .from('game_rankings')
      .select(`
        rank,
        games (
          id,
          game_mode,
          played_at,
          ticket_id
        )
      `)
      .eq('player_id', player.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get history' });
  }
});

router.get('/me/streak', authMiddleware, async (req, res) => {
  try {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const { data: rankings } = await supabase
      .from('game_rankings')
      .select('rank, created_at')
      .eq('player_id', player.id)
      .order('created_at', { ascending: false });

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (const r of (rankings || [])) {
      if (r.rank <= 3) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        if (currentStreak === 0) {
          currentStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }

    if (currentStreak === 0 && (rankings?.[0]?.rank || 0) <= 3) {
      currentStreak = tempStreak;
    }

    res.json({ currentStreak, bestStreak });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get streak' });
  }
});

router.get('/me/rivalries', authMiddleware, async (req, res) => {
  try {
    const { data: player } = await supabase
      .from('players')
      .select('id, display_name')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const { data: myRankings } = await supabase
      .from('game_rankings')
      .select('game_id, rank')
      .eq('player_id', player.id);

    const gameIds = (myRankings || []).map(r => r.game_id);
    const myRankMap = {};
    (myRankings || []).forEach(r => {
      myRankMap[r.game_id] = r.rank;
    });

    const { data: otherRankings } = await supabase
      .from('game_rankings')
      .select('game_id, rank, player_id, players (id, display_name)')
      .in('game_id', gameIds)
      .neq('player_id', player.id);

    const rivalryStats = {};
    (otherRankings || []).forEach(r => {
      const opponentId = r.player_id;
      const opponentName = r.players?.display_name || 'Unknown';
      
      if (!rivalryStats[opponentId]) {
        rivalryStats[opponentId] = { id: opponentId, name: opponentName, gamesTogether: 0, iWon: 0, theyWon: 0 };
      }

      rivalryStats[opponentId].gamesTogether++;
      if (myRankMap[r.game_id] < r.rank) {
        rivalryStats[opponentId].iWon++;
      } else {
        rivalryStats[opponentId].theyWon++;
      }
    });

    let nemesis = null;
    let prey = null;
    let maxLossRate = 0;
    let maxWinRate = 0;

    Object.values(rivalryStats).forEach(stat => {
      if (stat.gamesTogether >= 3) {
        const lossRate = stat.theyWon / stat.gamesTogether;
        const winRate = stat.iWon / stat.gamesTogether;

        if (lossRate > maxLossRate && lossRate > 0.5) {
          maxLossRate = lossRate;
          nemesis = stat;
        }
        if (winRate > maxWinRate && winRate > 0.5) {
          maxWinRate = winRate;
          prey = stat;
        }
      }
    });

    res.json({ nemesis, prey });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rivalries' });
  }
});

router.get('/me/title', authMiddleware, async (req, res) => {
  try {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const { data: rankings } = await supabase
      .from('game_rankings')
      .select('rank, created_at')
      .eq('player_id', player.id)
      .order('created_at', { ascending: true });

    const gamesPlayed = (rankings || []).length;

    if (gamesPlayed < 5) {
      return res.json({ title: 'Fresh Meat', description: 'New player (less than 5 games)' });
    }

    const topThreeCount = (rankings || []).filter(r => r.rank <= 3).length;
    const topThreeRate = topThreeCount / gamesPlayed;

    if (topThreeRate >= 0.6 && gamesPlayed >= 100) {
      return res.json({ title: 'Legend', description: '100+ games, 60%+ Top 3 rate' });
    }

    const neverBelow5 = (rankings || []).every(r => r.rank <= 5);
    if (neverBelow5 && gamesPlayed >= 10) {
      return res.json({ title: 'The Consistent', description: 'Never finished below rank 5' });
    }

    return res.json({ title: 'The Rookie', description: 'Keep playing to earn titles!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get title' });
  }
});

router.get('/me/crown-chase', authMiddleware, async (req, res) => {
  try {
    const pointConfig = await getPointConfig();

    const { data: allPlayers } = await supabase
      .from('players')
      .select('id, display_name');

    const playerPoints = {};
    for (const p of (allPlayers || [])) {
      playerPoints[p.id] = { id: p.id, display_name: p.display_name, points: 0 };
    }

    const { data: allRankings } = await supabase
      .from('game_rankings')
      .select('player_id, rank, games!inner (tickets!inner (status))')
      .eq('games.tickets.status', 'approved');

    (allRankings || []).forEach(r => {
      const points = calculatePointsForRank(r.rank, pointConfig);
      if (playerPoints[r.player_id]) {
        playerPoints[r.player_id].points += points;
      }
    });

    const sortedPlayers = Object.values(playerPoints).sort((a, b) => b.points - a.points);
    const king = sortedPlayers[0] || null;

    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const myPoints = playerPoints[player.id]?.points || 0;
    const pointsBehind = king ? king.points - myPoints : 0;
    const myRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;

    res.json({
      king,
      myPoints,
      pointsBehind: Math.max(0, pointsBehind),
      myRank,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get crown chase' });
  }
});

router.get('/:id/compare', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const pointConfig = await getPointConfig();

    const { data: myRankings } = await supabase
      .from('game_rankings')
      .select('game_id, rank')
      .eq('player_id', player.id);

    const { data: theirRankings } = await supabase
      .from('game_rankings')
      .select('game_id, rank')
      .eq('player_id', id);

    const { data: theirPlayer } = await supabase
      .from('players')
      .select('id, display_name')
      .eq('id', id)
      .single();

    if (!theirPlayer) {
      return res.status(404).json({ error: 'Opponent not found' });
    }

    let myPoints = 0;
    let myWins = 0;
    let myTopThree = 0;
    (myRankings || []).forEach(r => {
      myPoints += calculatePointsForRank(r.rank, pointConfig);
      if (r.rank <= 3) { myWins++; myTopThree++; }
    });

    let theirPoints = 0;
    let theirWins = 0;
    let theirTopThree = 0;
    (theirRankings || []).forEach(r => {
      theirPoints += calculatePointsForRank(r.rank, pointConfig);
      if (r.rank <= 3) { theirWins++; theirTopThree++; }
    });

    const myGameIds = new Set((myRankings || []).map(r => r.game_id));
    const theirGameIds = new Set((theirRankings || []).map(r => r.game_id));
    const sharedGames = [...myGameIds].filter(gid => theirGameIds.has(gid));

    let iRankedHigher = 0;
    let theyRankedHigher = 0;
    sharedGames.forEach(gameId => {
      const myRank = myRankings.find(r => r.game_id === gameId)?.rank || 0;
      const theirRank = theirRankings.find(r => r.game_id === gameId)?.rank || 0;
      if (myRank < theirRank) iRankedHigher++;
      else if (theirRank < myRank) theyRankedHigher++;
    });

    res.json({
      me: {
        id: player.id,
        points: myPoints,
        gamesPlayed: (myRankings || []).length,
        wins: myWins,
        topThreeRate: (myRankings || []).length > 0 
          ? ((myTopThree / myRankings.length) * 100).toFixed(1) 
          : 0,
      },
      them: {
        id: theirPlayer.id,
        display_name: theirPlayer.display_name,
        points: theirPoints,
        gamesPlayed: (theirRankings || []).length,
        wins: theirWins,
        topThreeRate: (theirRankings || []).length > 0 
          ? ((theirTopThree / theirRankings.length) * 100).toFixed(1) 
          : 0,
      },
      headToHead: {
        gamesTogether: sharedGames.length,
        iRankedHigher,
        theyRankedHigher,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare players' });
  }
});

export { router as playersRouter };
