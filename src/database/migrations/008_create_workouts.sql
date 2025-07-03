-- Drop and recreate the enum type
DROP TYPE IF EXISTS workout_type CASCADE;
CREATE TYPE workout_type AS ENUM (
  'cycling',
  'swimming',
  'walking',
  'yoga',
  'strength_training',
  'stretching',
  'other'
);

-- Drop and recreate the workouts table
DROP TABLE IF EXISTS workouts CASCADE;
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  workout_type workout_type NOT NULL,
  duration_minutes INTEGER,
  total_calories_burned NUMERIC(6,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);