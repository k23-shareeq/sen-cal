CREATE TABLE IF NOT EXISTS meal_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO meal_types (name) VALUES
  ('breakfast'),
  ('lunch'),
  ('dinner'),
  ('snack')
ON CONFLICT DO NOTHING; 