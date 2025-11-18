import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Globe, Users, Activity, Zap, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', visitors: 400 },
  { name: 'Tue', visitors: 300 },
  { name: 'Wed', visitors: 550 },
  { name: 'Thu', visitors: 450 },
  { name: 'Fri', visitors: 600 },
  { name: 'Sat', visitors: 350 },
  { name: 'Sun', visitors: 200 },
];

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const FeatureCard = ({ title, description, link, cta, icon: Icon }: any) => (
  <div className="relative group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-200 transition-all overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 text-brand-600 transform rotate-12 translate-x-4 -translate-y-4" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm mb-6 relative z-10">{description}</p>
    <Link to={link} className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700 text-sm relative z-10">
      {cta} <ArrowRight className="w-4 h-4 ml-1" />
    </Link>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, John</h2>
            <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Activity} label="Avg. Uptime" value="99.9%" trend="+0.1%" color="bg-blue-500" />
        <StatCard icon={Globe} label="SEO Score" value="82/100" trend="+4pts" color="bg-indigo-500" />
        <StatCard icon={Users} label="Site Visits" value="12.5k" trend="+12%" color="bg-violet-500" />
        <StatCard icon={Zap} label="Load Time" value="0.8s" trend="-0.2s" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Traffic Overview</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Lead Magnets */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h3 className="font-bold text-xl mb-2">Start-up Nation 2025</h3>
                    <p className="text-brand-100 text-sm mb-4">Check your eligibility and get instant answers with our AI consultant.</p>
                    <Link to="/consultant" className="inline-block bg-white text-brand-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-50 transition-colors">
                        Chat Now
                    </Link>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-500 rounded-full opacity-20 blur-xl"></div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Recommended Tools</h3>
                <div className="space-y-3">
                    <Link to="/seo" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 text-sm">SEO Analyzer</p>
                            <p className="text-xs text-slate-500">Audit your website</p>
                        </div>
                    </Link>
                    <Link to="/tools" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mr-3">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 text-sm">ROI Calculator</p>
                            <p className="text-xs text-slate-500">Estimate returns</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};