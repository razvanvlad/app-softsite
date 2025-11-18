# Testing Checklist for Softsite AI

## 🎯 Pre-Testing Setup

- [ ] All environment variables are set in `.env`
- [ ] Supabase database tables are created
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server is running (`npm run dev`)

---

## 🔐 Authentication Tests

### Test 1: Sign Up
- [ ] Navigate to `/settings`
- [ ] Click "Sign In" button
- [ ] Create new account with email/password
- [ ] Verify email confirmation (check inbox if enabled)
- [ ] Verify redirected back to app
- [ ] Verify "Sign Out" button appears
- [ ] Check Supabase **Authentication** → **Users** for new user
- [ ] Check `profiles` table has new entry

### Test 2: Sign Out
- [ ] Click "Sign Out" button
- [ ] Verify "Sign In" button reappears
- [ ] Verify user state is cleared

### Test 3: Sign In (Existing User)
- [ ] Sign in with existing credentials
- [ ] Verify successful login
- [ ] Verify profile data loads correctly

---

## 💬 AI Consultation Bot Tests

### Test 4: Basic Chat Functionality
- [ ] Navigate to `/consultant`
- [ ] Send message: "What is Start-up Nation 2025?"
- [ ] Verify AI responds within 5 seconds
- [ ] Verify response is relevant to Romanian startup grants
- [ ] Send 2 more messages
- [ ] Verify conversation history is maintained

### Test 5: Chat History Persistence (Logged In)
- [ ] Ensure you're logged in
- [ ] Send a unique message (e.g., "Test message 12345")
- [ ] Check Supabase `chat_sessions` table
- [ ] Verify message is saved with correct `user_id`
- [ ] Verify AI response is also saved

### Test 6: Chat Without Login
- [ ] Sign out
- [ ] Navigate to `/consultant`
- [ ] Send a message
- [ ] Verify AI still responds
- [ ] Check Supabase `chat_sessions` table
- [ ] Verify message is NOT saved (user_id is null)

### Test 7: CTA After 3 Questions
- [ ] Refresh page (clear history)
- [ ] Ask 3 questions
- [ ] Verify "Free Expert Consultation" CTA appears after 3rd response
- [ ] Click "Book Free 15-min Call"
- [ ] Verify Calendly link opens (or placeholder)

---

## 🎯 Startup Eligibility Tool Tests

### Test 8: Eligibility Check (Eligible)
- [ ] Navigate to `/startup-tools`
- [ ] **Step 1**: Select:
  - Year: 2024
  - Type: SRL
  - Debt: No Debts
  - Shareholder: Under 30 Years Old
- [ ] Verify "Preliminary Status: Eligible" shows (green)
- [ ] Click "Continue to Business Plan"

### Test 9: Eligibility Check (Not Eligible)
- [ ] Refresh page
- [ ] **Step 1**: Select:
  - Year: Before 2020
  - Debt: Yes, have debts
- [ ] Verify "Preliminary Status: Not Eligible" shows (red)
- [ ] Verify "Continue" button is disabled

### Test 10: Scoring Calculator
- [ ] Complete Step 1 as eligible
- [ ] **Step 2**: Enter industry (e.g., "Bakery")
- [ ] Check all 4 components (Green, Digital, Training, Innovation)
- [ ] Verify score shows 100/100
- [ ] Uncheck "Green Energy"
- [ ] Verify score updates to 80/100
- [ ] Click "Get Smart Budget Plan"

### Test 11: Budget Plan Generation
- [ ] **Step 3**: Click "Generate Budget Plan"
- [ ] Wait for AI to generate (5-10 seconds)
- [ ] Verify budget items appear in table
- [ ] Verify items are relevant to selected industry
- [ ] Verify pie chart displays correctly
- [ ] Verify total cost is calculated
- [ ] Verify "Remaining" budget shows correct value

### Test 12: Eligibility Data Persistence
- [ ] Ensure you're logged in
- [ ] Complete all 3 steps
- [ ] Check Supabase `eligibility_checks` table
- [ ] Verify entry exists with:
  - Correct `user_id`
  - `is_eligible` = true
  - `score` matches your selections
  - `details` JSON contains form data

---

## 🔍 SEO Analyzer Tests

### Test 13: SEO Analysis
- [ ] Navigate to `/seo`
- [ ] Enter URL: `https://example.com`
- [ ] Enter keyword: `web design`
- [ ] Click "Analyze"
- [ ] Verify loading state shows
- [ ] Verify SEO score displays (0-100)
- [ ] Verify recommendations appear
- [ ] Verify semantic keywords are listed
- [ ] Verify score color changes based on value (green/yellow/red)

### Test 14: SEO Error Handling
- [ ] Enter invalid URL (e.g., "not a url")
- [ ] Click "Analyze"
- [ ] Verify error message appears
- [ ] Verify app doesn't crash

---

## 🛠️ Business Tools Tests

### Test 15: ROI Calculator
- [ ] Navigate to `/tools`
- [ ] Enter Investment: 10000
- [ ] Enter Monthly Revenue: 2000
- [ ] Verify ROI calculates correctly: ((2000*12 - 10000) / 10000) * 100 = 140%
- [ ] Verify Payback Period: 10000 / 2000 = 5 months

### Test 16: Website Speed Test
- [ ] Enter URL: `https://google.com`
- [ ] Click "Test"
- [ ] Verify loading state shows
- [ ] Verify performance score displays
- [ ] Verify metrics (LCP, CLS) appear
- [ ] Verify recommendations list shows

---

## ⚙️ Settings Page Tests

### Test 17: Profile Editing (Logged In)
- [ ] Navigate to `/settings`
- [ ] Verify profile data loads from Supabase
- [ ] Click "Edit Profile"
- [ ] Change "Full Name" to "Test User 2"
- [ ] Click "Save"
- [ ] Verify edit mode exits
- [ ] Check Supabase `profiles` table for updated name

### Test 18: Subscription Display
- [ ] Click "Subscription" tab
- [ ] Verify "Free Starter" plan shows as active
- [ ] Verify "Pro Growth" plan shows "Upgrade" button
- [ ] Click "Upgrade to Pro"
- [ ] Verify loading state
- [ ] Verify Stripe checkout alert (simulated)

### Test 19: Settings Without Login
- [ ] Sign out
- [ ] Navigate to `/settings`
- [ ] Verify "Sign In" button appears
- [ ] Verify profile shows placeholder data
- [ ] Click "Sign In"
- [ ] Verify authentication flow works

---

## 🌐 Navigation & UI Tests

### Test 20: Dashboard
- [ ] Navigate to `/` (dashboard)
- [ ] Verify all feature cards display
- [ ] Click each card
- [ ] Verify navigation to correct page

### Test 21: Responsive Design
- [ ] Open browser DevTools
- [ ] Toggle device toolbar (mobile view)
- [ ] Test each page on:
  - iPhone SE (375px)
  - iPad (768px)
  - Desktop (1920px)
- [ ] Verify layouts adapt correctly
- [ ] Verify no horizontal scroll

### Test 22: Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if available)
- [ ] Verify no console errors

---

## 🚨 Error Handling Tests

### Test 23: Network Errors
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to send chat message
- [ ] Verify error message appears
- [ ] Verify app doesn't crash

### Test 24: Invalid API Key
- [ ] Temporarily change `GEMINI_API_KEY` to invalid value
- [ ] Restart dev server
- [ ] Try to use AI chat
- [ ] Verify error message appears
- [ ] Restore correct API key

### Test 25: Supabase Connection Error
- [ ] Temporarily change `VITE_SUPABASE_URL` to invalid value
- [ ] Restart dev server
- [ ] Try to sign in
- [ ] Verify error handling
- [ ] Restore correct URL

---

## 📊 Performance Tests

### Test 26: Page Load Speed
- [ ] Open DevTools → Lighthouse
- [ ] Run audit on each page
- [ ] Verify Performance score > 80
- [ ] Verify Accessibility score > 90

### Test 27: AI Response Time
- [ ] Send chat message
- [ ] Measure time to first response
- [ ] Verify < 5 seconds for typical query

---

## ✅ Final Checks

- [ ] No console errors in browser
- [ ] No TypeScript errors in terminal
- [ ] All links work correctly
- [ ] All images load
- [ ] Favicon displays
- [ ] Page titles are correct
- [ ] Meta descriptions are present

---

## 🐛 Bug Tracking

If you find issues, document them here:

| Issue | Page | Severity | Status |
|-------|------|----------|--------|
| Example: Chat not saving | /consultant | High | Fixed |
|  |  |  |  |

---

## 📝 Test Results Summary

**Date Tested**: _______________  
**Tester**: _______________  
**Environment**: Local / Staging / Production  

**Total Tests**: 27  
**Passed**: ___  
**Failed**: ___  
**Blocked**: ___  

**Overall Status**: ✅ Ready / ⚠️ Needs Fixes / ❌ Not Ready

---

## 🚀 Ready for Production?

Before deploying to production, ensure:
- [ ] All critical tests pass
- [ ] No high-severity bugs
- [ ] Environment variables set in Vercel
- [ ] Supabase RLS policies verified
- [ ] Analytics configured
- [ ] Error monitoring set up (e.g., Sentry)
- [ ] Backup strategy in place
