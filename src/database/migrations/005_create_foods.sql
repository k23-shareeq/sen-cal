CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  serving_unit VARCHAR(10),
  serving_size NUMERIC(6,2),
  calories_per_serving NUMERIC(6,2),
  protein_per_serving NUMERIC(6,2),
  carbs_per_serving NUMERIC(6,2),
  fat_per_serving NUMERIC(6,2),
  fiber_per_serving NUMERIC(6,2),
  sugar_per_serving NUMERIC(6,2),
  category VARCHAR(50),
  confidence_level INT CHECK (confidence_level BETWEEN 60 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 