export const supabaseUrl = 'https://vepespdkoynwchkjvjcp.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcGVzcGRrb3lud2Noa2p2amNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDgwNjIsImV4cCI6MjA5Njc4NDA2Mn0.0J5WHS8h8Y1htClkRqnVEasjEqWGNhlVEq2L3BNy31I';

// O supabase será inicializado no index.html e injetado em window.supabase
export const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
