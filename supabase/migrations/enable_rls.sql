-- Enable Row Level Security
ALTER TABLE skin_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own analyses"
    ON skin_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analyses"
    ON skin_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
    ON skin_analyses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
    ON skin_analyses FOR DELETE
    USING (auth.uid() = user_id); 