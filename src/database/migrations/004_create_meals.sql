CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_type_id UUID REFERENCES meal_types(id),
  meal_date DATE NOT NULL,
  name VARCHAR(100) NOT NULL,
  notes TEXT,
  total_calories NUMERIC(6,2),
  total_protein NUMERIC(6,2),
  total_carbs NUMERIC(6,2),
  total_fat NUMERIC(6,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 