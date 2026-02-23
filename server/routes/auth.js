import express from 'express';
import { supabase } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;

  console.log('Registration attempt:', { email, displayName });

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Email, password, and displayName are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    console.log('Auth user created:', authData.user?.id);

    if (!authData.user) {
      return res.status(400).json({ error: 'Failed to create user account' });
    }

    console.log('Creating player record...');
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert([{
        user_id: authData.user.id,
        display_name: displayName,
      }])
      .select()
      .single();

    console.log('Player insert result:', { playerData, playerError });

    if (playerError) {
      console.error('Player insert error:', playerError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: 'Failed to create player profile: ' + playerError.message });
    }

    res.json({
      user: authData.user,
      player: playerData,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  console.log('Login attempt:', { identifier });

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/username and password are required' });
  }

  try {
    let email = identifier;

    const isEmail = identifier.includes('@');
    console.log('Is email?', isEmail);

    if (!isEmail) {
      console.log('Looking up player by display_name:', identifier);
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('user_id')
        .ilike('display_name', identifier)
        .single();

      console.log('Player lookup result:', { playerData, playerError });

      if (playerError || !playerData) {
        console.log('Player not found');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Getting auth user by id:', playerData.user_id);
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(
        playerData.user_id
      );

      console.log('Auth user result:', { authUser: authUser?.user?.email, authError });

      if (authError || !authUser.user) {
        console.log('Auth user not found');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      email = authUser.user.email;
      console.log('Using email for auth:', email);
    }

    console.log('Attempting signInWithPassword with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (playerError) {
      console.error('Player fetch error:', playerError);
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', data.user.id)
      .single();

    res.json({
      session: data.session,
      user: data.user,
      player: playerData,
      isAdmin: !!adminData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: playerData, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', req.user.id)
      .single();

    res.json({
      user: req.user,
      player: playerData,
      isAdmin: !!adminData,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export { router as authRouter };
