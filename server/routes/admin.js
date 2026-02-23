import express from 'express';
import { supabase } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/players', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get players' });
  }
});

router.post('/players/:id/deactivate', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('players')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate player' });
  }
});

router.post('/players/:id/activate', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('players')
      .update({ is_active: true })
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate player' });
  }
});

router.get('/point-config', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('point_config')
      .select('*')
      .order('rank_start', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get point config' });
  }
});

router.put('/point-config', async (req, res) => {
  const { tiers } = req.body;

  if (!tiers || !Array.isArray(tiers)) {
    return res.status(400).json({ error: 'Tiers array is required' });
  }

  try {
    for (const tier of tiers) {
      if (tier.id) {
        await supabase
          .from('point_config')
          .update({
            tier_name: tier.tier_name,
            rank_start: tier.rank_start,
            rank_end: tier.rank_end,
            points: tier.points,
            is_active: tier.is_active,
          })
          .eq('id', tier.id);
      } else {
        await supabase
          .from('point_config')
          .insert([tier]);
      }
    }

    const { data } = await supabase
      .from('point_config')
      .select('*')
      .order('rank_start', { ascending: true });

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update point config' });
  }
});

router.get('/rejection-reasons', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rejection_reasons')
      .select('*')
      .order('code', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rejection reasons' });
  }
});

router.post('/rejection-reasons', async (req, res) => {
  const { code, label } = req.body;

  if (!code || !label) {
    return res.status(400).json({ error: 'Code and label are required' });
  }

  try {
    const { data, error } = await supabase
      .from('rejection_reasons')
      .insert([{ code, label, is_active: true }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rejection reason' });
  }
});

export { router as adminRouter };
