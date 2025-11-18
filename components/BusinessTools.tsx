import React, { useState } from 'react';
import { Calculator, Tag, FileText, Clock, Zap, Loader2, AlertCircle } from 'lucide-react';
import { analyzeSpeedWithGemini } from '../services/geminiService';
import { SpeedReport } from '../types';

export const BusinessTools: React.FC = () => {
  // Simple ROI Logic
  const [investment, setInvestment] = useState(5000);
  const [revenue, setRevenue] = useState(1000);
  
  const roi = ((revenue * 12 - investment) / investment) * 100;
  const payback = investment / revenue;

  // Speed Test Logic
  const [speedUrl, setSpeedUrl] = useState('');
  const [isSpeedAnalyzing, setIsSpeedAnalyzing] = useState(false);
  const [speedReport, setSpeedReport] = useState<SpeedReport | null>(null);

  const handleSpeedTest = async () => {
    if (!speedUrl) return;
    setIsSpeedAnalyzing(true);
    setSpeedReport(null);
    try {
      const report = await analyzeSpeedWithGemini(speedUrl);
      setSpeedReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSpeedAnalyzing(false);
    }
  };

  const getSpeedColor = (score: number) => {
      if (score >= 90) return 'text-green-600 bg-green-50';
      if (score >= 50) return 'text-orange-600 bg-orange-50';
      return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Tool 1: ROI Calculator */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg mr-4">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Digital ROI Calculator</h3>
                <p className="text-sm text-slate-500">Estimate returns on digital investment</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Initial Investment (RON)</label>
                <input 
                  type="number" 
                  value={investment} 
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Est. Monthly Revenue (RON)</label>
                <input 
                  type="number" 
                  value={revenue} 
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600">Year 1 ROI:</span>
                 <span className={`font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {roi.toFixed(0)}%
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600">Payback Period:</span>
                 <span className="font-bold text-slate-900">{payback.toFixed(1)} months</span>
               </div>
            </div>
         </div>

         {/* Tool 2: Website Speed Test */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg mr-4">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Website Speed Test</h3>
                <p className="text-sm text-slate-500">AI-simulated PageSpeed analysis</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
                <input
                  type="url"
                  placeholder="https://yoursite.com"
                  value={speedUrl}
                  onChange={(e) => setSpeedUrl(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <button
                    onClick={handleSpeedTest}
                    disabled={isSpeedAnalyzing || !speedUrl}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center"
                >
                    {isSpeedAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
                </button>
            </div>

            {speedReport && (
                <div className="animate-fade-in space-y-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                        <div className="text-center">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Score</span>
                            <div className={`text-2xl font-bold mt-1 px-2 rounded ${getSpeedColor(speedReport.performanceScore)}`}>
                                {speedReport.performanceScore}
                            </div>
                        </div>
                         <div className="text-center border-l border-slate-200 pl-4">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">LCP</span>
                            <div className="text-lg font-semibold text-slate-700 mt-1">{speedReport.lcp}</div>
                        </div>
                         <div className="text-center border-l border-slate-200 pl-4">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">CLS</span>
                            <div className="text-lg font-semibold text-slate-700 mt-1">{speedReport.cls}</div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900 uppercase mb-3 flex items-center">
                            Top Issues
                        </p>
                        <ul className="space-y-2">
                            {speedReport.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start text-xs text-slate-600 bg-red-50/50 p-2 rounded border border-red-100">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {!speedReport && !isSpeedAnalyzing && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <p className="text-xs text-slate-500">Enter a URL above to get a simulated performance report and actionable technical advice.</p>
                </div>
            )}
         </div>

         {/* Placeholder Tool 3 */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-75 cursor-not-allowed relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded uppercase">Coming Soon</div>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Business Name Gen</h3>
                <p className="text-sm text-slate-500">AI-powered brand name ideas</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm">Generate unique business names, check domain availability (.ro), and get logo concepts instantly.</p>
         </div>

          {/* Placeholder Tool 4 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-75 cursor-not-allowed relative overflow-hidden">
             <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded uppercase">Coming Soon</div>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Content Calendar</h3>
                <p className="text-sm text-slate-500">30-day social media plan</p>
              </div>
            </div>
             <p className="text-slate-500 text-sm">Automatically generate a month's worth of social media posts tailored to your specific industry and audience.</p>
         </div>

       </div>
    </div>
  );
};