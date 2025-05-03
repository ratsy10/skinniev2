import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Initializing Supabase client...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createDummyUser() {
    console.log('Attempting to create dummy user...');
    const { data: user, error } = await supabase.auth.signUp({
        email: 'test.user@skinnie.app',
        password: 'dummyPassword123!',
        options: {
            data: {
                name: 'Test User'
            }
        }
    });

    if (error) {
        console.error('Error creating dummy user:', error);
        return null;
    }

    console.log('User created successfully:', user.user.id);
    return user.user.id;
}

async function importSkinAnalyses(userId) {
    console.log('Reading score.csv file...');
    const csvContent = fs.readFileSync('score.csv', 'utf-8');
    const records = parse(csvContent, { columns: true });

    console.log(`Importing ${records.length} skin analyses...`);
    for (const record of records) {
        const { error } = await supabase
            .from('skin_analyses')
            .insert({
                user_id: userId,
                severity_score: parseInt(record.severity_score),
                description: record.description,
                affected_area_percentage: parseInt(record.affected_area_percentage),
                created_at: new Date(record.modification_date).toISOString()
            });

        if (error) {
            console.error('Error inserting skin analysis:', error);
        }
    }
}

async function importLifestyleHabits(userId) {
    console.log('Reading lifestyle.json file...');
    const jsonContent = JSON.parse(fs.readFileSync('lifestyle.json', 'utf-8'));

    console.log(`Importing ${jsonContent.length} lifestyle records...`);
    for (const record of jsonContent) {
        const { error } = await supabase
            .from('lifestyle_habits')
            .insert({
                user_id: userId,
                day: record.day,
                sleep_hours: record.sleep_hours,
                diet: record.diet,
                stress: record.stress,
                weather: record.weather,
                sunlight_minutes: record.sunlight_minutes
            });

        if (error) {
            console.error('Error inserting lifestyle habit:', error);
        }
    }
}

async function main() {
    console.log('Starting data import process...');
    const userId = await createDummyUser();
    if (!userId) {
        console.error('Failed to create dummy user');
        return;
    }

    console.log('Importing skin analyses...');
    await importSkinAnalyses(userId);

    console.log('Importing lifestyle habits...');
    await importLifestyleHabits(userId);

    console.log('\nData import completed!');
    console.log('Dummy user credentials:');
    console.log('Email: test.user@skinnie.app');
    console.log('Password: dummyPassword123!');
}

main().catch(console.error); 