-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get player id from auth user
CREATE OR REPLACE FUNCTION get_player_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM players WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Players policies
CREATE POLICY "Players are viewable by everyone" ON players
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own player profile" ON players
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own player profile" ON players
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all players" ON players
  FOR ALL USING (is_admin());

-- Point config policies (admin only)
CREATE POLICY "Point config is viewable by everyone" ON point_config
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage point config" ON point_config
  FOR ALL USING (is_admin());

-- Tickets policies
CREATE POLICY "Tickets are viewable by everyone" ON tickets
  FOR SELECT USING (true);

CREATE POLICY "Players can create tickets" ON tickets
  FOR INSERT WITH CHECK (created_by = get_player_id());

CREATE POLICY "Ticket creators can update pending tickets" ON tickets
  FOR UPDATE USING (created_by = get_player_id() AND status = 'pending');

CREATE POLICY "Ticket creators can delete pending tickets" ON tickets
  FOR DELETE USING (created_by = get_player_id() AND status = 'pending');

CREATE POLICY "Admins can manage all tickets" ON tickets
  FOR ALL USING (is_admin());

-- Games policies (inherit from tickets)
CREATE POLICY "Games are viewable by everyone" ON games
  FOR SELECT USING (true);

CREATE POLICY "Players can create games in their own tickets" ON games
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM tickets WHERE id = ticket_id AND created_by = get_player_id())
  );

CREATE POLICY "Players can update games in their own pending tickets" ON games
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM tickets WHERE id = ticket_id AND created_by = get_player_id() AND status = 'pending')
  );

CREATE POLICY "Admins can manage all games" ON games
  FOR ALL USING (is_admin());

-- Game rankings policies
CREATE POLICY "Game rankings are viewable by everyone" ON game_rankings
  FOR SELECT USING (true);

CREATE POLICY "Players can create rankings in their own tickets" ON game_rankings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM games g
      JOIN tickets t ON t.id = g.ticket_id
      WHERE g.id = game_id AND t.created_by = get_player_id()
    )
  );

CREATE POLICY "Admins can manage all game rankings" ON game_rankings
  FOR ALL USING (is_admin());

-- Ticket approvals policies
CREATE POLICY "Ticket approvals are viewable by everyone" ON ticket_approvals
  FOR SELECT USING (true);

CREATE POLICY "Players can approve/reject their own approvals" ON ticket_approvals
  FOR UPDATE USING (player_id = get_player_id());

CREATE POLICY "Admins can manage all approvals" ON ticket_approvals
  FOR ALL USING (is_admin());

-- Admin users policies
CREATE POLICY "Admin users table is not directly accessible" ON admin_users
  FOR ALL USING (false);
