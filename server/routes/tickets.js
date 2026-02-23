import express from 'express';
import { supabase } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
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
      .from('tickets')
      .select(`
        *,
        games (
          id,
          game_mode,
          played_at,
          position,
          game_rankings (
            player_id,
            rank,
            players (id, display_name)
          )
        )
      `)
      .eq('created_by', player.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { games } = req.body;

  if (!games || !Array.isArray(games) || games.length === 0) {
    return res.status(400).json({ error: 'Games array is required' });
  }

  try {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert([{ created_by: player.id }])
      .select()
      .single();

    if (ticketError) {
      return res.status(400).json({ error: ticketError.message });
    }

    const participantIds = new Set();

    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      
      if (!game.game_mode || !game.played_at || !game.rankings) {
        continue;
      }

      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert([{
          ticket_id: ticket.id,
          game_mode: game.game_mode,
          played_at: game.played_at,
          position: i + 1,
        }])
        .select()
        .single();

      if (gameError) continue;

      for (const ranking of game.rankings) {
        await supabase
          .from('game_rankings')
          .insert([{
            game_id: gameData.id,
            player_id: ranking.player_id,
            rank: ranking.rank,
          }]);
        
        if (ranking.player_id !== player.id) {
          participantIds.add(ranking.player_id);
        }
      }
    }

    for (const participantId of participantIds) {
      await supabase
        .from('ticket_approvals')
        .insert([{
          ticket_id: ticket.id,
          player_id: participantId,
          status: 'pending',
        }]);
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.get('/pending-approvals', authMiddleware, async (req, res) => {
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
      .from('ticket_approvals')
      .select(`
        id,
        status,
        tickets (
          id,
          created_at,
          players (display_name),
          games (id, game_mode, played_at)
        )
      `)
      .eq('player_id', player.id)
      .eq('status', 'pending');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pending approvals' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        rejection_reasons (code, label),
        players (id, display_name),
        games (
          id,
          game_mode,
          played_at,
          position,
          game_rankings (
            player_id,
            rank,
            players (id, display_name)
          )
        ),
        ticket_approvals (
          player_id,
          status,
          players (id, display_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { games } = req.body;

  try {
    const { data: ticket } = await supabase
      .from('tickets')
      .select('*, players!inner (user_id)')
      .eq('id', id)
      .single();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.players.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this ticket' });
    }

    if (ticket.status !== 'pending') {
      return res.status(400).json({ error: 'Can only edit pending tickets' });
    }

    await supabase.from('game_rankings').delete().in('game_id', 
      (await supabase.from('games').select('id').eq('ticket_id', id)).data?.map(g => g.id) || []
    );
    await supabase.from('games').delete().eq('ticket_id', id);
    await supabase.from('ticket_approvals').delete().eq('ticket_id', id);

    const participantIds = new Set();
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    for (let i = 0; i < games.length; i++) {
      const game = games[i];

      const { data: gameData } = await supabase
        .from('games')
        .insert([{
          ticket_id: id,
          game_mode: game.game_mode,
          played_at: game.played_at,
          position: i + 1,
        }])
        .select()
        .single();

      if (gameData && game.rankings) {
        for (const ranking of game.rankings) {
          await supabase
            .from('game_rankings')
            .insert([{
              game_id: gameData.id,
              player_id: ranking.player_id,
              rank: ranking.rank,
            }]);
          
          if (ranking.player_id !== player.id) {
            participantIds.add(ranking.player_id);
          }
        }
      }
    }

    for (const participantId of participantIds) {
      await supabase
        .from('ticket_approvals')
        .insert([{
          ticket_id: id,
          player_id: participantId,
          status: 'pending',
        }]);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const { data: ticket } = await supabase
      .from('tickets')
      .select('*, players!inner (user_id)')
      .eq('id', id)
      .single();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.players.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this ticket' });
    }

    if (ticket.status !== 'pending') {
      return res.status(400).json({ error: 'Can only delete pending tickets' });
    }

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

router.post('/:id/approve', authMiddleware, async (req, res) => {
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

    const { data: approval } = await supabase
      .from('ticket_approvals')
      .select('*')
      .eq('ticket_id', id)
      .eq('player_id', player.id)
      .single();

    if (!approval) {
      return res.status(404).json({ error: 'No approval found for this ticket' });
    }

    await supabase
      .from('ticket_approvals')
      .update({ status: 'approved' })
      .eq('ticket_id', id)
      .eq('player_id', player.id);

    const { data: allApprovals } = await supabase
      .from('ticket_approvals')
      .select('status')
      .eq('ticket_id', id);

    const allApproved = (allApprovals || []).every(a => a.status === 'approved');

    if (allApproved && (allApprovals || []).length > 0) {
      await supabase
        .from('tickets')
        .update({ status: 'approved' })
        .eq('id', id);
    }

    res.json({ success: true, allApproved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve ticket' });
  }
});

router.post('/:id/reject', authMiddleware, async (req, res) => {
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

    const { data: approval } = await supabase
      .from('ticket_approvals')
      .select('*')
      .eq('ticket_id', id)
      .eq('player_id', player.id)
      .single();

    if (!approval) {
      return res.status(404).json({ error: 'No approval found for this ticket' });
    }

    await supabase
      .from('ticket_approvals')
      .update({ status: 'rejected' })
      .eq('ticket_id', id)
      .eq('player_id', player.id);

    await supabase
      .from('tickets')
      .update({ status: 'rejected' })
      .eq('id', id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject ticket' });
  }
});

router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        players (id, display_name),
        rejection_reasons (code, label)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

router.post('/admin/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve ticket' });
  }
});

router.post('/admin/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { rejection_reason_id, rejection_detail } = req.body;

  if (!rejection_reason_id) {
    return res.status(400).json({ error: 'Rejection reason is required' });
  }

  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'rejected',
        rejection_reason_id,
        rejection_detail,
      })
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject ticket' });
  }
});

export { router as ticketsRouter };
