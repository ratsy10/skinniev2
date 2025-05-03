import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertDummyData() {
  try {
    // First, create or get the test user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'test@skinnie.com',
      password: 'test123456'
    });

    if (signUpError) {
      // If user already exists, try to sign in
      const { data: { user: existingUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@skinnie.com',
        password: 'test123456'
      });

      if (signInError) throw signInError;
      console.log('Signed in existing user:', existingUser);
    } else {
      console.log('Created new user:', user);
    }

    // Get the user ID
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const userId = currentUser.id;

    // Generate dates for the past 60 days starting from March 3rd, 2025
    const startDate = new Date('2025-03-03');
    const dates = Array.from({ length: 60 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });

    // Insert lifestyle data
    for (const date of dates) {
      const { error: lifestyleError } = await supabase
        .from('lifestyle_habits')
        .insert({
          user_id: userId,
          sleep_hours: 6 + Math.random() * 4, // Random between 6-10 hours
          diet: ['balanced', 'high protein', 'high sugar', 'processed foods'][Math.floor(Math.random() * 4)],
          stress: Math.floor(1 + Math.random() * 10), // Random between 1-10
          weather: ['warm', 'cold', 'humid', 'dry'][Math.floor(Math.random() * 4)],
          sunlight_minutes: Math.floor(30 + Math.random() * 90), // Random between 30-120 minutes
          created_at: date.toISOString(),
          day: date.getDate() // Add the day field
        });

      if (lifestyleError) {
        console.error('Error inserting lifestyle data:', lifestyleError);
        continue;
      }

      // Insert matching skin analysis (every 3 days)
      if (date.getDate() % 3 === 0) {
        const { error: analysisError } = await supabase
          .from('skin_analyses')
          .insert({
            user_id: userId,
            severity_score: Math.floor(1 + Math.random() * 10), // Random between 1-10
            description: 'Mild acne visible on the forehead and cheeks. Some redness is present.',
            affected_area_percentage: Math.floor(5 + Math.random() * 20), // Random between 5-25%
            created_at: date.toISOString()
          });

        if (analysisError) {
          console.error('Error inserting analysis data:', analysisError);
        }
      }
    }

    console.log('Successfully inserted dummy data');
  } catch (error) {
    console.error('Error in insertDummyData:', error);
  }
}

insertDummyData(); 