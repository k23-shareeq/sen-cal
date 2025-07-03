-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop the enum type if it exists and recreate it
DROP TYPE IF EXISTS meal_type_enum CASCADE;
CREATE TYPE meal_type_enum AS ENUM (
  'breakfast',
  'lunch',
  'dinner',
  'snack'
);

-- Drop the table if it exists and recreate it
DROP TABLE IF EXISTS meals CASCADE;
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_type meal_type_enum NOT NULL,
  name VARCHAR(100) NOT NULL,
  notes TEXT,
  total_calories NUMERIC(6,2),
  total_protein NUMERIC(6,2),
  total_carbs NUMERIC(6,2),
  total_fat NUMERIC(6,2),
  total_fiber NUMERIC(6,2),
  total_sugar NUMERIC(6,2),
  confidence_level INT CHECK (confidence_level BETWEEN 60 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);