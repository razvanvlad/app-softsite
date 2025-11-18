# 🎯 Action Checklist - Softsite AI Setup

Use this checklist to track your progress setting up the Softsite AI backend.

---

## Phase 1: Get API Keys (15 minutes)

### Supabase Setup
- [ ] Go to https://supabase.com
- [ ] Create account / Sign in
- [ ] Click "New Project"
- [ ] Name: `softsite-ai`
- [ ] Set database password (save it!)
- [ ] Select region: Europe West
- [ ] Wait for project creation (2-3 min)
- [ ] Go to Settings → API
- [ ] Copy **Project URL** → Save to notepad
- [ ] Copy **anon public key** → Save to notepad
- [ ] Copy **service_role key** → Save to notepad ⚠️

### Google Gemini API
- [ ] Go to https://aistudio.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Select or create Google Cloud project
- [ ] Copy API key → Save to notepad ⚠️

### Stripe (Optional)
- [ ] Go to https://dashboard.stripe.com/apikeys
- [ ] Sign in / Create account
- [ ] Copy "Secret key" (test mode) → Save to notepad ⚠️

---

## Phase 2: Create Database (5 minutes)

- [ ] In Supabase dashboard, go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Open `SETUP_GUIDE.md` in your project
- [ ] Find **Step 2.2** - SQL script
- [ ] Copy entire SQL script (from `-- ===` to end)
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run** (or F5)
- [ ] Wait for "Success" message
- [ ] Go to **Table Editor**
- [ ] Verify 3 tables exist:
  - [ ] `profiles`
  - [ ] `chat_sessions`
  - [ ] `eligibility_checks`

### Enable Authentication
- [ ] Go to **Authentication** → **Providers**
- [ ] Verify **Email** is enabled (should be by default)
- [ ] (Optional) Enable **Google** provider for social login

---

## Phase 3: Configure Environment (2 minutes)

- [ ] In your project folder, create file named `.env`
- [ ] Copy template below and fill in YOUR values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...YOUR_SERVICE_ROLE_KEY
GEMINI_API_KEY=AIza...YOUR_GEMINI_KEY
STRIPE_SECRET_KEY=sk_test_...YOUR_STRIPE_KEY
```

- [ ] Save `.env` file
- [ ] Verify `.env` is in `.gitignore` (it is by default)
- [ ] **NEVER commit `.env` to Git!**

---

## Phase 4: Test Locally (10 minutes)

### Start Development Server
- [ ] Open terminal in project folder
- [ ] Run: `npm install` (if not done already)
- [ ] Run: `npm run dev`
- [ ] Wait for "Local: http://localhost:5173"
- [ ] Open browser to http://localhost:5173
- [ ] Verify app loads without errors

### Test Authentication
- [ ] Click **Settings** in navigation
- [ ] Click **Sign In** button
- [ ] Create test account:
  - Email: `test@example.com`
  - Password: `Test123!`
- [ ] Verify redirected back to app
- [ ] Verify "Sign Out" button appears
- [ ] Go to Supabase → **Authentication** → **Users**
- [ ] Verify new user appears in list
- [ ] Go to Supabase → **Table Editor** → `profiles`
- [ ] Verify profile row created for user

### Test AI Chat
- [ ] Click **Consultation Bot** in navigation
- [ ] Send message: "What is Start-up Nation 2025?"
- [ ] Verify AI responds (may take 3-5 seconds)
- [ ] Verify response is relevant
- [ ] Send another message: "Am I eligible?"
- [ ] Verify conversation continues
- [ ] Go to Supabase → **Table Editor** → `chat_sessions`
- [ ] Verify messages saved (should see 4 rows: 2 user, 2 assistant)

### Test Eligibility Tool
- [ ] Click **Startup Eligibility** in navigation
- [ ] **Step 1**: Fill form
  - Year: 2024
  - Type: SRL
  - Debt: No Debts
  - Shareholder: Under 30 Years Old
- [ ] Verify "Preliminary Status: Eligible" (green)
- [ ] Click "Continue to Business Plan"
- [ ] **Step 2**: Fill form
  - Industry: "Bakery"
  - Check all 4 boxes
- [ ] Verify score shows 100/100
- [ ] Click "Get Smart Budget Plan"
- [ ] Go to Supabase → **Table Editor** → `eligibility_checks`
- [ ] Verify entry saved with score=100
- [ ] **Step 3**: Click "Generate Budget Plan"
- [ ] Wait for AI (5-10 seconds)
- [ ] Verify budget items appear
- [ ] Verify pie chart displays

### Test SEO Analyzer
- [ ] Click **SEO Analyzer** in navigation
- [ ] Enter URL: `https://example.com`
- [ ] Enter keyword: `web design`
- [ ] Click "Analyze"
- [ ] Verify SEO score displays
- [ ] Verify recommendations appear

### Test Business Tools
- [ ] Click **Business Tools** in navigation
- [ ] Verify ROI Calculator works
- [ ] Enter URL in Speed Test: `https://google.com`
- [ ] Click "Test"
- [ ] Verify speed report appears

---

## Phase 5: Deploy to Vercel (10 minutes)

### Install Vercel CLI
- [ ] Open terminal
- [ ] Run: `npm install -g vercel`
- [ ] Wait for installation

### Login to Vercel
- [ ] Run: `vercel login`
- [ ] Choose login method (Email/GitHub/GitLab)
- [ ] Complete authentication
- [ ] Verify "Success!" message

### Deploy Project
- [ ] In project folder, run: `vercel`
- [ ] Answer prompts:
  - Set up and deploy? **Yes**
  - Which scope? **Your account**
  - Link to existing project? **No**
  - Project name? **softsite-ai** (or your choice)
  - Directory? **./** (press Enter)
  - Override settings? **No**
- [ ] Wait for deployment (1-2 minutes)
- [ ] Copy deployment URL (e.g., `softsite-ai.vercel.app`)
- [ ] Open URL in browser
- [ ] Verify app loads (may show errors - that's OK, we need env vars)

### Add Environment Variables to Vercel

**Option A: Via CLI (Recommended)**
```bash
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL, press Enter
# Select: Production, Preview, Development (use spacebar)

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your anon key, press Enter

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your service role key, press Enter

vercel env add GEMINI_API_KEY
# Paste your Gemini key, press Enter

vercel env add STRIPE_SECRET_KEY
# Paste your Stripe key, press Enter
```

- [ ] Run all 5 commands above
- [ ] Verify "Success" for each

**Option B: Via Dashboard**
- [ ] Go to https://vercel.com/dashboard
- [ ] Click your project (`softsite-ai`)
- [ ] Go to **Settings** → **Environment Variables**
- [ ] For each variable:
  - [ ] Click "Add New"
  - [ ] Name: `VITE_SUPABASE_URL`
  - [ ] Value: (paste your value)
  - [ ] Select: Production, Preview, Development
  - [ ] Click "Save"
- [ ] Repeat for all 5 variables

### Redeploy with Environment Variables
- [ ] Run: `vercel --prod`
- [ ] Wait for deployment
- [ ] Open production URL
- [ ] Test authentication (create account)
- [ ] Test AI chat
- [ ] Verify everything works!

---

## Phase 6: Final Verification (5 minutes)

### Local Environment
- [ ] No console errors in browser DevTools
- [ ] No TypeScript errors in terminal
- [ ] All features work as expected
- [ ] Database tables have data

### Production Environment
- [ ] App loads at Vercel URL
- [ ] Can create account
- [ ] Can sign in/out
- [ ] AI chat works
- [ ] Chat history saves
- [ ] Eligibility tool saves results
- [ ] SEO analyzer works
- [ ] Speed test works

### Security Check
- [ ] `.env` file is NOT in Git
- [ ] `.env` is in `.gitignore`
- [ ] No API keys in frontend code
- [ ] Supabase RLS policies active (check Table Editor)
- [ ] Only `VITE_*` variables in browser DevTools

---

## 🎉 Success Criteria

You're done when:
- ✅ All checkboxes above are checked
- ✅ App works locally
- ✅ App works in production (Vercel)
- ✅ No errors in console
- ✅ Database has test data
- ✅ All API keys are secure

---

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Failed to fetch chat response"
- Check `GEMINI_API_KEY` in `.env`
- Restart dev server: Ctrl+C, then `npm run dev`
- Verify API key is active in Google AI Studio

### "Supabase error: Invalid API key"
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Verify Supabase project is active (not paused)
- Check for typos in `.env`

### Chat not saving to database
- Verify SQL tables created (check Table Editor)
- Check `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Ensure user is logged in
- Check browser console for errors

### Vercel deployment fails
- Check all environment variables are set
- Verify no syntax errors in code
- Check Vercel build logs for details
- Try: `vercel --debug`

### App works locally but not in production
- Verify environment variables in Vercel dashboard
- Check Vercel function logs
- Ensure all dependencies in `package.json`
- Redeploy: `vercel --prod --force`

---

## 📞 Need Help?

If stuck, check these resources:
- **SETUP_GUIDE.md** - Detailed setup instructions
- **TESTING_CHECKLIST.md** - 27 test cases
- **ARCHITECTURE.md** - System architecture diagrams
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Gemini API**: https://ai.google.dev/docs

---

## 📊 Progress Tracker

**Date Started**: _______________  
**Date Completed**: _______________  
**Total Time**: _______________  

**Phases Completed**:
- [ ] Phase 1: Get API Keys
- [ ] Phase 2: Create Database
- [ ] Phase 3: Configure Environment
- [ ] Phase 4: Test Locally
- [ ] Phase 5: Deploy to Vercel
- [ ] Phase 6: Final Verification

**Status**: 🟡 In Progress / 🟢 Complete / 🔴 Blocked

---

**Next Steps After Completion**:
1. Add custom domain to Vercel
2. Configure email templates in Supabase
3. Set up analytics (Vercel Analytics)
4. Implement Stripe payments
5. Add more AI features
6. Invite team members

Good luck! 🚀
