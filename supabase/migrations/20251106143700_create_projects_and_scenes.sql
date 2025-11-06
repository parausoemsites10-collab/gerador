/*
  # Storyboard AI Database Schema

  ## Overview
  This migration creates the database schema for the Storyboard AI application,
  which allows users to create AI-generated storyboards with multiple scenes.

  ## New Tables
  
  ### `projects`
  Stores storyboard projects created by users.
  - `id` (uuid, primary key) - Unique project identifier
  - `name` (text) - Project name/title
  - `description` (text, nullable) - Project description
  - `api_key` (text, nullable) - Encrypted API key for image generation
  - `cookies` (text, nullable) - Encrypted cookies for authentication
  - `step1_data` (jsonb, nullable) - Story details (title, synopsis, characters, etc.)
  - `step2_data` (jsonb, nullable) - Scene list data
  - `step3_data` (jsonb, nullable) - Generated images data
  - `created_at` (timestamptz) - When the project was created
  - `updated_at` (timestamptz) - When the project was last modified

  ### `scenes`
  Stores individual scenes within projects.
  - `id` (uuid, primary key) - Unique scene identifier
  - `project_id` (uuid, foreign key) - Reference to parent project
  - `scene_number` (integer) - Order of scene in project
  - `title` (text) - Scene title
  - `description` (text) - Scene description
  - `prompt` (text, nullable) - AI prompt used for generation
  - `images` (jsonb, nullable) - Generated image URLs and metadata
  - `status` (text) - Scene status: 'pending', 'generating', 'completed', 'error'
  - `created_at` (timestamptz) - When the scene was created
  - `updated_at` (timestamptz) - When the scene was last modified

  ## Security
  - Enable RLS on all tables
  - For now, allowing public access for development
  - Future: Add authentication-based policies when auth is implemented

  ## Important Notes
  1. API keys and cookies should be encrypted at application level before storage
  2. JSONB fields allow flexible schema for different step data
  3. Scene status tracking enables async image generation workflows
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  api_key text,
  cookies text,
  step1_data jsonb DEFAULT '{}'::jsonb,
  step2_data jsonb DEFAULT '{}'::jsonb,
  step3_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scene_number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  prompt text,
  images jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster project lookups
CREATE INDEX IF NOT EXISTS idx_scenes_project_id ON scenes(project_id);
CREATE INDEX IF NOT EXISTS idx_scenes_scene_number ON scenes(project_id, scene_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scenes_updated_at ON scenes;
CREATE TRIGGER update_scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development
-- TODO: Replace with authentication-based policies in production
CREATE POLICY "Allow all access to projects"
  ON projects
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to scenes"
  ON scenes
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);