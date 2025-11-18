import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { analyzeSeoWithGemini } from '../services/geminiService';
import { SeoReport } from '../types';

export const SeoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url || !keyword) return;
    setIsAnalyzing(true);
    setError('');
    setReport(null);

    try {
      const result = await analyzeSeoWithGemini(url, keyword);
      setReport(result);
    } catch (err) {
      setError("Failed to analyze. Please ensure API key is set and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 50) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">AI SEO Analyzer</h2>
        <p className="text-slate-500 mb-8">Enter your website and target keyword to get actionable AI insights.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
            <input 
              type="url" 
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Keyword</label>
            <input 
              type="text" 
              placeholder="e.g., Web Design Bucharest"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full p-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Score Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">SEO Score</h3>
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  barSize={10} 
                  data={[{ name: 'score', value: report.score, fill: getScoreColor(report.score) }]} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={5} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col mt-8">
                <span className="text-4xl font-bold text-slate-900">{report.score}</span>
                <span className="text-sm text-slate-500">/100</span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-4 px-4">
              Your page is {report.score > 70 ? 'performing well' : 'needs improvement'} for "{keyword}".
            </p>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Recommendations</h3>
            <div className="space-y-4">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start p-4 rounded-lg bg-slate-50 border border-slate-100">
                  {rec.priority === 'High' ? (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="ml-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <p className="text-slate-700 mt-1 text-sm leading-relaxed">{rec.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

           {/* Suggested Keywords */}
           <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-semibold text-slate-900 mb-4">Semantic Keywords</h3>
             <div className="flex flex-wrap gap-2">
                {report.keywords.map((kw, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                    {kw}
                  </span>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};