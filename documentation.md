# SoftSite AI - SaaS Platform Documentation

## 1. Project Overview
**SoftSite AI** is a comprehensive SaaS platform designed to help Small and Medium Enterprises (SMEs) in Romania. Its primary focus is assisting entrepreneurs with the "Start-up Nation 2025" funding program through AI-driven consultation, eligibility tools, and business automation utilities.

The application is a **Single Page Application (SPA)** built with React, utilizing the **Google Gemini API** for intelligence and **Tailwind CSS** for the user interface.

---

## 2. Technical Stack

### Frontend
- **Framework**: React 19 (via Vite/ES Modules)
- **Styling**: Tailwind CSS (Utility-first framework)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM v6/v7

### Artificial Intelligence
- **Provider**: Google Gemini API (`@google/genai`)
- **Model**: `gemini-2.5-flash`
- **Implementation**: Client-side API calls via `services/geminiService.ts`

### Integrations (Simulated/Client-side)
- **Payments**: Stripe JS SDK (Frontend integration only)
- **Backend**: None (Serverless/Client-side architecture)

---

## 3. Features Breakdown

### A. Functional Features (Real Logic & AI)

These features are fully implemented using React state logic, mathematical formulas, or live calls to the Gemini AI model.

#### 1. AI Consultation Bot (`/consultant`)
- **Functionality**: A chat interface allowing users to ask questions about Start-up Nation 2025.
- **Tech**: 
  - Uses `streamChatResponse` in `geminiService.ts`.
  - Maintains conversation history in React State.
  - **RAG (Retrieval-Augmented Generation)**: Simulated via **Context Injection**. The system prompt contains a condensed version of the official Start-up Nation 2025 Applicant Guide (Simulated data based on real program structures), enabling the AI to answer specific eligibility questions accurately without an external vector database.
- **Key Feature**: Automatically triggers a "Book a Call" CTA after 3 user interactions.

#### 2. Startup Eligibility Tools (`/startup-tools`)
- **Eligibility Checker**: 
  - **Logic**: Real conditional logic checks registration year (>=2020), debts, and company type.
- **Business Plan Scorer**:
  - **Logic**: Calculates a score out of 100 based on user checkboxes (Green Energy, Digitalization, Training, Innovation), reflecting the actual structure of grant evaluation grids.
- **Smart Budget Generator**:
  - **Tech**: **Real AI Generation**. Sends the user's industry and location to Gemini (`generateBudgetPlan`) to generate a structured JSON list of eligible equipment and software purchases customized for that specific business type.

#### 3. ROI Calculator (`/tools`)
- **Logic**: Performs real-time mathematical calculations for Return on Investment (ROI) and Payback Period based on user input (Investment vs. Monthly Revenue).

#### 4. Dashboard (`/`)
- **UI**: Fully responsive dashboard with Recharts data visualization.
- **Data**: Currently displays static demo data to showcase layout and visualization capabilities.

---

### B. Simulated Features (Mocked / AI Hallucinated)

These features provide the *experience* of a full SaaS product but rely on simulation due to the lack of a backend server or browser security restrictions (CORS/No Live Web Access).

#### 1. SEO Analyzer (`/seo`)
- **Simulation**: The Gemini models used via browser keys cannot crawl live websites (due to CORS and lack of internet browsing tools in this specific SDK configuration).
- **Behavior**: The app sends the URL and Keyword to the AI. The AI is prompted to *simulate* a realistic audit based on the domain name and industry context.
- **Result**: The scores and recommendations are "hallucinated" by the AI to look realistic, but they are not based on the actual live HTML of the target website.

#### 2. Website Speed Test (`/tools`)
- **Simulation**: Similar to the SEO Analyzer. The browser cannot run a Lighthouse audit on external domains without a Node.js proxy.
- **Behavior**: The AI generates a JSON response with realistic LCP (Largest Contentful Paint), CLS, and Performance scores typical for the type of website entered.

#### 3. Stripe Payments (`/settings`)
- **Simulation**: The "Upgrade to Pro" button triggers `initiateProCheckout`.
- **Behavior**: 
  - It loads the real Stripe.js SDK (`loadStripe`).
  - It waits for a 2-second artificial delay.
  - It returns `success: true`.
  - **Missing**: In a real app, this would call a backend endpoint to create a Stripe Checkout Session ID. Since there is no backend, we cannot generate a valid session to redirect the user to the actual Stripe hosted page.

#### 4. User Persistence
- **Limitation**: There is no database (PostgreSQL/MongoDB).
- **Behavior**: User profile changes (Name, Company, Plan) are stored in React State. Refreshing the browser resets all data to defaults.

---

## 4. Application Structure

```
/
├── components/
│   ├── Layout.tsx            # Sidebar, Header, Responsive Shell
│   ├── Dashboard.tsx         # Main Overview
│   ├── ConsultationBot.tsx   # AI Chat Interface
│   ├── StartupEligibility.tsx# 3-Step Grant Tool
│   ├── SeoAnalyzer.tsx       # AI SEO Simulator
│   ├── BusinessTools.tsx     # ROI & Speed Tools
│   └── Settings.tsx          # Profile & Stripe Integration
├── services/
│   ├── geminiService.ts      # AI API Interaction & Prompts
│   └── stripeService.ts      # Payment Simulation
├── types.ts                  # TypeScript Interfaces
├── App.tsx                   # Routing Configuration
├── index.tsx                 # Entry Point
└── documentation.md          # Project Documentation
```

## 5. Future Roadmap (To make it Production Ready)

To convert this simulation into a production-ready SaaS, the following steps are required:

1.  **Backend Implementation**: Node.js/Express or Next.js API routes to handle secret API keys (Stripe Secret Key) and database connections.
2.  **Database**: PostgreSQL (Supabase) to store User Profiles, Chat History, and Subscription Status.
3.  **Real SEO/Speed Data**: Integrate Google PageSpeed Insights API and a scraping service (like Puppeteer) on the backend to replace the AI simulation with real data.
4.  **Authentication**: Implement Auth (Clerk, Auth0, or Supabase Auth) for secure login.
5.  **Payment Webhooks**: Set up Stripe Webhooks to listen for successful payments and update the database.
