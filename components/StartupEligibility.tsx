
import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Calculator, ShoppingBag, Loader2, PieChart } from 'lucide-react';
import { BudgetItem } from '../types';
import { generateBudgetPlan } from '../services/geminiService';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, Legend } from 'recharts';

// Step 1: Eligibility Check
const EligibilityCheck = ({ nextStep }: { nextStep: () => void }) => {
  const [formData, setFormData] = useState({
    year: '2024',
    type: 'SRL',
    debt: 'no',
    shareholderStatus: 'none' // 'student', 'unemployed', 'none'
  });

  const isEligible = 
    parseInt(formData.year) >= 2020 && 
    formData.debt === 'no';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Year of Establishment</label>
            <select 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
            >
                <option value="2025">2025 (Not established yet)</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2020">2020-2022</option>
                <option value="2019">Before 2020</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Type</label>
             <select 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
            >
                <option value="SRL">SRL (LLC)</option>
                <option value="SRL-D">SRL-D</option>
                <option value="PFA">PFA (Sole Proprietorship)</option>
                <option value="SA">SA (Joint-Stock)</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Outstanding State Debts</label>
             <select 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.debt}
                onChange={e => setFormData({...formData, debt: e.target.value})}
            >
                <option value="no">No Debts</option>
                <option value="yes">Yes, have debts</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Shareholder Status (Majority)</label>
             <select 
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.shareholderStatus}
                onChange={e => setFormData({...formData, shareholderStatus: e.target.value})}
            >
                <option value="under30">Under 30 Years Old</option>
                <option value="unemployed">Unemployed / Disabled</option>
                <option value="rural">Rural Resident</option>
                <option value="none">None of the above</option>
            </select>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-start">
            {isEligible ? <CheckCircle className="w-6 h-6 text-green-600 mr-3" /> : <XCircle className="w-6 h-6 text-red-600 mr-3" />}
            <div>
                <h3 className={`font-bold ${isEligible ? 'text-green-800' : 'text-red-800'}`}>
                    {isEligible ? 'Preliminary Status: Eligible' : 'Preliminary Status: Not Eligible'}
                </h3>
                <p className={`text-sm mt-1 ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                    {isEligible 
                        ? "Your company profile meets the basic requirements for Start-up Nation 2025 based on the simulated rules." 
                        : "Companies established before 2020 or those with outstanding debts are typically not eligible."}
                </p>
            </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
            onClick={nextStep}
            disabled={!isEligible}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
            Continue to Business Plan
        </button>
      </div>
    </div>
  );
};

// Step 2: Business Plan Scoring
const ScoringCalc = ({ nextStep, setIndustry }: { nextStep: () => void, setIndustry: (v: string) => void }) => {
    const [scoreData, setScoreData] = useState({
        green: false,
        digital: true,
        training: false,
        innovation: false,
        industry: 'IT Services'
    });

    const calculateScore = () => {
        let score = 0;
        if (scoreData.green) score += 20;
        if (scoreData.digital) score += 20;
        if (scoreData.training) score += 20;
        if (scoreData.innovation) score += 20;
        // Base score for eligible project
        score += 20; 
        return score;
    };

    const score = calculateScore();

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Proposed Business Activity (Industry)</label>
                <input 
                    type="text" 
                    value={scoreData.industry}
                    onChange={(e) => {
                        setScoreData({...scoreData, industry: e.target.value});
                        setIndustry(e.target.value);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="e.g., Bakery, Web Design, Dental Clinic"
                />
            </div>

            <div className="space-y-3">
                <p className="font-medium text-slate-900">Select Project Components:</p>
                
                <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={scoreData.green}
                        onChange={e => setScoreData({...scoreData, green: e.target.checked})}
                        className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <span className="ml-3 text-slate-700">Include Green Energy (Solar/Electric Car) - <span className="font-bold text-green-600">+20 pts</span></span>
                </label>

                <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={scoreData.digital}
                        onChange={e => setScoreData({...scoreData, digital: e.target.checked})}
                        className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <span className="ml-3 text-slate-700">Include Digitalization (Hardware/Software) - <span className="font-bold text-green-600">+20 pts</span></span>
                </label>

                <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={scoreData.training}
                        onChange={e => setScoreData({...scoreData, training: e.target.checked})}
                        className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <span className="ml-3 text-slate-700">Include Digital Skills Training - <span className="font-bold text-green-600">+20 pts</span></span>
                </label>

                <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={scoreData.innovation}
                        onChange={e => setScoreData({...scoreData, innovation: e.target.checked})}
                        className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <span className="ml-3 text-slate-700">Include Innovation / R&D / Patents - <span className="font-bold text-green-600">+20 pts</span></span>
                </label>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl text-center">
                <p className="text-sm text-blue-600 font-medium uppercase tracking-wider">Estimated Score</p>
                <p className="text-5xl font-bold text-blue-900 my-2">{score}<span className="text-2xl text-blue-400">/100</span></p>
                <p className="text-sm text-blue-700">
                    {score >= 80 ? "Excellent! Highly competitive score." : score >= 60 ? "Good, but consider adding Green Energy or Innovation components." : "Risk of rejection. Try to increase your score."}
                </p>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={nextStep}
                    className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                >
                    Get Smart Budget Plan
                </button>
            </div>
        </div>
    );
};

// Step 3: Smart Budget
const SmartBudget = ({ industry }: { industry: string }) => {
    const [items, setItems] = useState<BudgetItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await generateBudgetPlan(industry, "Urban");
            setItems(res);
            setGenerated(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const totalCost = items.reduce((acc, curr) => acc + curr.estimatedCost, 0);
    const grantLimit = 250000;
    
    const chartData = items.reduce((acc: any[], curr) => {
        const existing = acc.find(a => a.name === curr.category);
        if (existing) {
            existing.value += curr.estimatedCost;
        } else {
            acc.push({ name: curr.category, value: curr.estimatedCost });
        }
        return acc;
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6 animate-fade-in">
            {!generated && (
                <div className="text-center py-12">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">AI Budget Generator</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Generate a compliant list of eligible equipment and software for a <strong>{industry}</strong> business.
                    </p>
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium inline-flex items-center shadow-lg shadow-brand-500/30"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Calculator className="w-5 h-5 mr-2" />}
                        Generate Budget Plan
                    </button>
                </div>
            )}

            {generated && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center">
                            Recommended Purchases for {industry}
                        </h3>
                        <div className="bg-white border rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                    <tr>
                                        <th className="p-3">Item</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3 text-right">Est. Cost (RON)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 group">
                                            <td className="p-3">
                                                <div className="font-medium text-slate-900">{item.item}</div>
                                                <div className="text-xs text-slate-500">{item.reason}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right font-mono text-slate-700">
                                                {item.estimatedCost.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 font-bold">
                                    <tr>
                                        <td colSpan={2} className="p-3 text-right">Total:</td>
                                        <td className={`p-3 text-right ${totalCost > grantLimit ? 'text-red-600' : 'text-green-600'}`}>
                                            {totalCost.toLocaleString()} RON
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {totalCost > grantLimit && (
                             <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Warning: Total exceeds the 250,000 RON grant limit. You will need to cover the difference.
                             </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl border h-fit">
                        <h3 className="font-bold text-slate-900 mb-4">Budget Distribution</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPie>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} RON`} />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </RechartsPie>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span className="text-slate-600">Grant Limit:</span>
                                <span className="font-mono">250,000 RON</span>
                            </div>
                             <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span className="text-slate-600">Remaining:</span>
                                <span className="font-mono font-bold text-slate-900">
                                    {Math.max(0, 250000 - totalCost).toLocaleString()} RON
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const StartupEligibility: React.FC = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [industry, setIndustry] = useState('General');

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Start-up Nation Eligibility Tool</h2>
                    <p className="text-slate-500">Step-by-step validation of your company and business plan.</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
                
                <button 
                    onClick={() => setActiveTab(1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${
                        activeTab >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                >1</button>
                
                <button 
                    onClick={() => activeTab >= 2 && setActiveTab(2)}
                     className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${
                        activeTab >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                >2</button>
                
                <button 
                     onClick={() => activeTab >= 3 && setActiveTab(3)}
                     className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${
                        activeTab >= 3 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                >3</button>
            </div>
            
            <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
                <span>Company Details</span>
                <span>Business Plan</span>
                <span>Smart Budget</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 min-h-[400px]">
                {activeTab === 1 && <EligibilityCheck nextStep={() => setActiveTab(2)} />}
                {activeTab === 2 && <ScoringCalc nextStep={() => setActiveTab(3)} setIndustry={setIndustry} />}
                {activeTab === 3 && <SmartBudget industry={industry} />}
            </div>
        </div>
    );
}
