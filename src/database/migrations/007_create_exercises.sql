CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  calories_burned_per_min NUMERIC(6,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 