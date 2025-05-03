-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create skin_analyses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.skin_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    severity_score INTEGER NOT NULL CHECK (severity_score >= 0 AND severity_score <= 10),
    description TEXT NOT NULL,
    affected_area_percentage INTEGER NOT NULL CHECK (affected_area_percentage >= 0 AND affected_area_percentage <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create lifestyle_habits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lifestyle_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    sleep_hours DECIMAL(4,1) NOT NULL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    diet VARCHAR(50) NOT NULL,
    stress INTEGER NOT NULL CHECK (stress >= 1 AND stress <= 10),
    weather VARCHAR(20) NOT NULL,
    sunlight_minutes INTEGER NOT NULL CHECK (sunlight_minutes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_habits ENABLE ROW LEVEL SECURITY;

-- Create policies for skin_analyses
CREATE POLICY "Users can view their own skin analyses"
    ON public.skin_analyses
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skin analyses"
    ON public.skin_analyses
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policies for lifestyle_habits
CREATE POLICY "Users can view their own lifestyle habits"
    ON public.lifestyle_habits
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lifestyle habits"
    ON public.lifestyle_habits
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skin_analyses_user_id ON public.skin_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_created_at ON public.skin_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_lifestyle_habits_user_id ON public.lifestyle_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_habits_created_at ON public.lifestyle_habits(created_at); 