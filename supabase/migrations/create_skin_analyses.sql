-- Create the skin_analyses table
CREATE TABLE IF NOT EXISTS skin_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    severity_score INTEGER NOT NULL,
    description TEXT NOT NULL,
    affected_area_percentage INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users (id)
        ON DELETE CASCADE
); 