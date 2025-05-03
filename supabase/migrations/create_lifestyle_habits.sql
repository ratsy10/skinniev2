-- Create the lifestyle_habits table
CREATE TABLE IF NOT EXISTS public.lifestyle_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    sleep_hours DECIMAL(4,1) NOT NULL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    diet VARCHAR(50) NOT NULL,
    stress INTEGER NOT NULL CHECK (stress >= 1 AND stress <= 10),
    weather VARCHAR(20) NOT NULL,
    sunlight_minutes INTEGER NOT NULL CHECK (sunlight_minutes >= 0),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.lifestyle_habits ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own data
CREATE POLICY "Users can insert their own lifestyle data"
    ON public.lifestyle_habits
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own data
CREATE POLICY "Users can view their own lifestyle data"
    ON public.lifestyle_habits
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX lifestyle_habits_user_id_idx ON public.lifestyle_habits(user_id);
CREATE INDEX lifestyle_habits_created_at_idx ON public.lifestyle_habits(created_at); 