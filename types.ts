
export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  isTyping?: boolean;
  isCTA?: boolean;
}

export interface SeoReport {
  url: string;
  score: number;
  title: string;
  recommendations: {
    priority: 'High' | 'Medium' | 'Low';
    text: string;
  }[];
  keywords: string[];
}

export interface SpeedReport {
  url: string;
  performanceScore: number;
  fcp: string;
  lcp: string;
  cls: string;
  recommendations: string[];
}

export interface RoiCalculation {
  investment: number;
  revenueMonth1: number;
  revenueYear1: number;
  breakEvenMonth: number;
}

export interface UserProfile {
  name: string;
  email: string;
  companyName: string;
  cui: string;
  industry: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface EligibilityCriteria {
  registrationYear: number;
  companyType: 'SRL' | 'SRL-D' | 'SA' | 'Other';
  associatesUnder30: boolean;
  associatesTraining: boolean;
  debtFree: boolean;
}

export interface BudgetItem {
  category: string;
  item: string;
  estimatedCost: number;
  isEligible: boolean;
  reason: string;
}

export enum AppRoute {
  DASHBOARD = '/',
  CONSULTANT = '/consultant',
  STARTUP_TOOLS = '/startup-tools',
  SEO = '/seo',
  TOOLS = '/tools',
  SETTINGS = '/settings'
}
