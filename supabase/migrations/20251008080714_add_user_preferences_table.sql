/*
  # Add User Preferences Table

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `theme` (text) - Stores user's theme preference (light, dark, system)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_preferences` table
    - Add policy for authenticated users to read their own preferences
    - Add policy for authenticated users to insert their own preferences
    - Add policy for authenticated users to update their own preferences

  3. Notes
    - Each user can have only one preferences record
    - Theme preference defaults to 'system'
    - Automatic timestamp updates on modifications
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme text DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
