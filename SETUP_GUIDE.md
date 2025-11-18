# Softsite AI Backend Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google Gemini API key
- A Stripe account (for future payment integration)

---

## 🔑 Step 1: Get Your API Keys & Credentials

### 1.1 Supabase Setup

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name (e.g., "softsite-ai")
   - Set a strong database password (save this!)
   - Select a region close to your users (e.g., Europe West for Romania)
   - Wait 2-3 minutes for project creation

2. **Get Your Supabase Keys**
   - Once created, go to **Settings** → **API**
   - Copy the following values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJhbGc...`)
     - **service_role key** (starts with `eyJhbGc...`) ⚠️ **Keep this secret!**

3. **Enable Email Authentication**
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider
   - (Optional) Enable **Google** provider for social login
   - Configure email templates if desired

### 1.2 Google Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select a Google Cloud project (or create a new one)
4. Copy the API key (starts with `AIza...`)
5. ⚠️ **Keep this secret!**

### 1.3 Stripe API Keys (Optional - for future use)

1. Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret key** (starts with `sk_test_...` for test mode)
3. ⚠️ **Keep this secret!**

---

## 🗄️ Step 2: Create Supabase Database Tables

### 2.1 Access SQL Editor

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL below

### 2.2 Run This SQL Script

```sql
-- ============================================
-- SOFTSITE AI DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- Stores user profile information
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  cui TEXT, -- Romanian company ID
  industry TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. CHAT_SESSIONS TABLE
-- Stores AI consultation chat history
-- ============================================
CREATE TABLE chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own chat history
CREATE POLICY "Users can view own chats"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);

-- ============================================
-- 3. ELIGIBILITY_CHECKS TABLE
-- Stores Start-up Nation eligibility results
-- ============================================
CREATE TABLE eligibility_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_eligible BOOLEAN NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  details JSONB, -- Stores form data and scoring details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own eligibility checks
CREATE POLICY "Users can view own eligibility checks"
  ON eligibility_checks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own eligibility checks"
  ON eligibility_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_eligibility_checks_user_id ON eligibility_checks(user_id);
CREATE INDEX idx_eligibility_checks_created_at ON eligibility_checks(created_at DESC);

-- ============================================
-- 4. AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 2.3 Verify Tables Created

1. Go to **Table Editor** in Supabase
2. You should see 3 new tables:
   - `profiles`
   - `chat_sessions`
   - `eligibility_checks`

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Create `.env` File

In your project root, create a `.env` file (copy from `.env.example`):

```bash
# Copy the example file
cp .env.example .env
```

### 3.2 Fill in Your Values

Open `.env` and replace with your actual keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...YOUR_SERVICE_ROLE_KEY

# Google Gemini API
GEMINI_API_KEY=AIza...YOUR_GEMINI_KEY

# Stripe (Optional - for future use)
STRIPE_SECRET_KEY=sk_test_...YOUR_STRIPE_KEY
```

⚠️ **IMPORTANT**: 
- Never commit `.env` to Git
- `.env` is already in `.gitignore`
- Only `VITE_*` variables are exposed to the frontend

---

## 🧪 Step 4: Test Locally

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Start Development Server

```bash
npm run dev
```

The app should open at `http://localhost:5173`

### 4.3 Test Authentication

1. Go to **Settings** page
2. Click "Sign In"
3. Create a test account with email/password
4. Verify you're logged in (should see "Sign Out" button)

### 4.4 Test AI Chat

1. Go to **Consultation Bot**
2. Send a message (e.g., "Am I eligible for Start-up Nation?")
3. Verify AI responds
4. Check Supabase **Table Editor** → `chat_sessions` to see saved messages

### 4.5 Test Eligibility Tool

1. Go to **Startup Eligibility**
2. Complete all 3 steps
3. Check Supabase **Table Editor** → `eligibility_checks` to see saved results

---

## 🚀 Step 5: Deploy to Vercel

### 5.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 5.2 Login to Vercel

```bash
vercel login
```

### 5.3 Deploy

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** softsite-ai (or your choice)
- **Directory?** `./` (current directory)
- **Override settings?** No

### 5.4 Add Environment Variables to Vercel

**Option A: Via CLI**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
vercel env add STRIPE_SECRET_KEY
```

**Option B: Via Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable from your `.env` file
5. Select **Production**, **Preview**, and **Development** for each

### 5.5 Redeploy

```bash
vercel --prod
```

Your app is now live! 🎉

---

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit API keys to Git
- [ ] Supabase Row Level Security (RLS) is enabled on all tables
- [ ] Service role key is only used in backend (`api/` folder)
- [ ] Frontend only uses `VITE_SUPABASE_ANON_KEY`
- [ ] Vercel environment variables are set to "Production" only for sensitive keys

---

## 🐛 Troubleshooting

### "Failed to fetch chat response"
- Check `GEMINI_API_KEY` is set correctly
- Verify API key is active in Google AI Studio
- Check browser console for detailed errors

### "Supabase error: JWT expired"
- User needs to sign in again
- Check Supabase project is active

### "Cannot read properties of undefined (reading 'id')"
- User is not authenticated
- Wrap component with `useAuth()` check

### Chat history not saving
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in backend
- Check `chat_sessions` table exists
- Verify RLS policies are correct

---

## 📚 Next Steps

1. **Customize AI Context**: Edit `STARTUP_NATION_CONTEXT` in `api/chat.ts`
2. **Add More Tools**: Create new analysis types in `api/analyze.ts`
3. **Implement Stripe**: Complete payment flow in `api/stripe-webhook.ts`
4. **Add Email Notifications**: Use Supabase Edge Functions
5. **Analytics**: Integrate Vercel Analytics or Google Analytics

---

## 🆘 Need Help?

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Gemini API**: [https://ai.google.dev/docs](https://ai.google.dev/docs)

Good luck with your Softsite AI app! 🚀
