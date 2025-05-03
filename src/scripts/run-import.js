import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
config({ path: join(__dirname, '../../.env') });

// Run the import script
const child = spawn('node', ['importDummyData.js'], {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
        ...process.env,
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
    }
}); 