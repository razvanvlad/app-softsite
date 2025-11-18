import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');

    try {
        // Test 1: Check if we can connect and list tables (indirectly via a simple query)
        // We'll try to select from the profiles table, limiting to 1 row.
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (profilesError) {
            console.error('❌ Connection Failed (Profiles Table):', profilesError.message);
        } else {
            console.log('✅ Connection Successful (Profiles Table)');
            console.log('   Data:', profiles);
        }

        // Test 2: Check chat_sessions table
        const { data: chats, error: chatsError } = await supabase
            .from('chat_sessions')
            .select('*')
            .limit(1);

        if (chatsError) {
            console.error('❌ Connection Failed (Chat Sessions Table):', chatsError.message);
        } else {
            console.log('✅ Connection Successful (Chat Sessions Table)');
        }

        // Test 3: Check eligibility_checks table
        const { data: eligibility, error: eligibilityError } = await supabase
            .from('eligibility_checks')
            .select('*')
            .limit(1);

        if (eligibilityError) {
            console.error('❌ Connection Failed (Eligibility Checks Table):', eligibilityError.message);
        } else {
            console.log('✅ Connection Successful (Eligibility Checks Table)');
        }

    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

testConnection();
