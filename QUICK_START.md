# Quick Start Guide - Softsite AI

## 🚀 What I've Built For You

I've successfully transformed your client-side AI app into a **production-ready serverless application** with:

### ✅ Backend Infrastructure
- **3 Vercel Serverless Functions** (`/api` folder)
  - `chat.ts` - AI conversations with chat history
  - `analyze.ts` - SEO, Speed Test, Budget Plan analysis
  - `stripe-webhook.ts` - Payment webhook placeholder

### ✅ Database & Auth
- **Supabase** integration for PostgreSQL database
- **Authentication** with email/password and Google OAuth
- **Row Level Security** policies for data protection

### ✅ Frontend Updates
- All AI calls moved to backend (API keys secured)
- User authentication throughout the app
- Chat history persistence
- Eligibility check data saving

---

## 📋 What You Need to Do Next

### 1. Get Your API Keys (15 minutes)

You need **4 pieces of information** from 3 services:

#### A. Supabase (Database & Auth)
1. Go to **https://supabase.com** → Sign up/Login
2. Create a new project (name it "softsite-ai")
3. Wait 2-3 minutes for setup
4. Go to **Settings** → **API**
5. Copy these 3 values:
   - ✅ **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - ✅ **anon public key** (starts with `eyJhbGc...`)
   - ✅ **service_role key** (starts with `eyJhbGc...`) ⚠️ Secret!

#### B. Google Gemini (AI)
1. Go to **https://aistudio.google.com/app/apikey**
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`) ⚠️ Secret!

#### C. Stripe (Payments - Optional for now)
1. Go to **https://dashboard.stripe.com/apikeys**
2. Copy "Secret key" (starts with `sk_test_...`) ⚠️ Secret!

---

### 2. Create Database Tables (5 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file **`SETUP_GUIDE.md`** (I just created it)
4. Copy the entire SQL script from **Step 2.2**
5. Paste into Supabase SQL Editor
6. Click **Run**
7. Verify 3 tables created: `profiles`, `chat_sessions`, `eligibility_checks`

---

### 3. Configure Environment Variables (2 minutes)

1. In your project folder, create a file named **`.env`** (no extension)
2. Copy this template and fill in YOUR values:

```env
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...YOUR_SERVICE_ROLE_KEY

# Google Gemini
GEMINI_API_KEY=AIza...YOUR_GEMINI_KEY

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...YOUR_STRIPE_KEY
```

---

### 4. Test Locally (10 minutes)

Run these commands:

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Then follow the **`TESTING_CHECKLIST.md`** I created for you.

**Quick Test:**
1. Open http://localhost:5173
2. Go to Settings → Sign In
3. Create an account
4. Go to Consultation Bot
5. Send a message
6. Check Supabase → Table Editor → `chat_sessions` to see it saved!

---

### 5. Deploy to Vercel (10 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables (do this for each one)
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
vercel env add STRIPE_SECRET_KEY

# Deploy to production
vercel --prod
```

---

## 📚 Documentation I Created

I've created **3 comprehensive guides** for you:

1. **`SETUP_GUIDE.md`** - Complete setup instructions with SQL scripts
2. **`TESTING_CHECKLIST.md`** - 27 tests to verify everything works
3. **`QUICK_START.md`** (this file) - Fast track to get running

---

## 🔑 Summary of What You Need

| Service | What to Get | Where | Secret? |
|---------|-------------|-------|---------|
| Supabase | Project URL | Settings → API | No |
| Supabase | Anon Key | Settings → API | No |
| Supabase | Service Role Key | Settings → API | ✅ Yes |
| Google | Gemini API Key | AI Studio | ✅ Yes |
| Stripe | Secret Key | Dashboard | ✅ Yes |

---

## ⚠️ Important Security Notes

- **Never commit `.env` to Git** (it's already in `.gitignore`)
- Only `VITE_*` variables are exposed to frontend
- `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` stay on backend only
- In production, set environment variables in Vercel dashboard

---

## 🆘 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Failed to fetch chat response"
- Check `GEMINI_API_KEY` is correct in `.env`
- Restart dev server after changing `.env`

### "Supabase error: Invalid API key"
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Verify Supabase project is active

### Chat not saving to database
- Verify SQL tables are created
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Ensure user is logged in

---

## ✅ Success Checklist

Before considering this done:

- [ ] Supabase project created
- [ ] Database tables created (3 tables)
- [ ] `.env` file created with all keys
- [ ] App runs locally (`npm run dev`)
- [ ] Can sign up/sign in
- [ ] AI chat works
- [ ] Chat history saves to database
- [ ] Eligibility tool saves results
- [ ] Deployed to Vercel
- [ ] Production environment variables set

---

## 🎉 You're Ready!

Once you complete the steps above, your Softsite AI app will be:
- ✅ Fully functional with AI-powered features
- ✅ Secure (API keys on backend only)
- ✅ Scalable (serverless architecture)
- ✅ Production-ready (deployed on Vercel)
- ✅ Data-persistent (Supabase database)

**Estimated Total Time**: ~45 minutes

Good luck! 🚀
