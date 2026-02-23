-- Seed default point configuration
INSERT INTO point_config (tier_name, rank_start, rank_end, points, is_active) VALUES
('Top Tier', 1, 3, 3, true),
('Mid Tier', 4, 5, 2, true),
('Low Tier', 6, 8, 1, true);

-- Seed default rejection reasons
INSERT INTO rejection_reasons (code, label, is_active) VALUES
('INCORRECT_RESULTS', 'Rankings do not match actual game results', true),
('PARTICIPANT_DISPUTE', 'A participant disagrees with the submission', true),
('DUPLICATE_SUBMISSION', 'This game has already been recorded', true),
('MISSING_PROOF', 'Screenshot proof is required but not provided', true),
('INVALID_DATE', 'Date/time is incorrect or in the future', true),
('OTHER', 'Other reason (see details)', true);
