CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  steps INTEGER,
  water_ml INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 