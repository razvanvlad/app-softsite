
import React, { useState } from 'react';
import { User, Shield, CreditCard, Check, Building, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { initiateProCheckout } from '../services/stripeService';
import { useAuth } from '../contexts/AuthContext';

export const Settings: React.FC = () => {
    const { user, signInWithGoogle, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile');
    const [profile, setProfile] = useState<UserProfile>({
        name: user?.user_metadata?.full_name || 'Guest User',
        email: user?.email || 'guest@example.com',
        companyName: user?.user_metadata?.company_name || 'My Company SRL',
        cui: user?.user_metadata?.cui || '',
        industry: user?.user_metadata?.industry || 'IT Services',
        plan: 'free' // In real app, fetch from DB
    });

    // Update local profile state when user changes
    React.useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                name: user.user_metadata?.full_name || prev.name,
                email: user.email || prev.email,
                // ... other fields if stored in metadata
            }));
        }
    }, [user]);

    const [isEditing, setIsEditing] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeError, setUpgradeError] = useState('');

    const handleSave = () => {
        setIsEditing(false);
        // Logic to save to backend would go here
    };

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        setUpgradeError('');
        try {
            await initiateProCheckout();
            // In a real app, the browser redirects to Stripe here.
            // For this demo, we'll optimistically update the UI to show what happens after success.
            alert("Redirecting to Stripe Checkout...");
            // setProfile({...profile, plan: 'pro'}); // Uncomment to test UI state change
        } catch (error) {
            setUpgradeError("Unable to initialize payment. Please try again later.");
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
                {user ? (
                    <button onClick={signOut} className="text-sm text-red-600 hover:underline">Sign Out</button>
                ) : (
                    <button onClick={signInWithGoogle} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm">Sign In</button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile'
                            ? 'border-brand-600 text-brand-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('subscription')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'subscription'
                            ? 'border-brand-600 text-brand-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Subscription
                    </div>
                </button>
            </div>

            {/* Profile Content */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Company Profile</h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="text-sm text-brand-600 font-medium hover:underline">
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => setIsEditing(false)} className="text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                                <button onClick={handleSave} className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700">Save</button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                disabled={!isEditing}
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg disabled:text-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                disabled={!isEditing}
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg disabled:text-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <div className="relative">
                                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    disabled={!isEditing}
                                    value={profile.companyName}
                                    onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                                    className="w-full pl-9 p-2 bg-slate-50 border border-slate-200 rounded-lg disabled:text-slate-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CUI / VAT Number</label>
                            <input
                                disabled={!isEditing}
                                value={profile.cui}
                                onChange={e => setProfile({ ...profile, cui: e.target.value })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg disabled:text-slate-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription Content */}
            {activeTab === 'subscription' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    {/* Free Plan */}
                    <div className={`bg-white p-6 rounded-xl border shadow-sm flex flex-col ${profile.plan === 'free' ? 'border-brand-200 ring-1 ring-brand-100' : 'border-slate-200'}`}>
                        <div className="mb-4">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {profile.plan === 'free' ? 'Current Plan' : 'Basic'}
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">Free Starter</h3>
                            <p className="text-slate-500 text-sm">Essential tools for early-stage startups</p>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-6">€0<span className="text-base font-normal text-slate-500">/mo</span></div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 mr-2" /> Basic SEO Analysis</li>
                            <li className="flex items-center text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 mr-2" /> AI Consultant (Limited)</li>
                            <li className="flex items-center text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 mr-2" /> Website Speed Test</li>
                        </ul>

                        {profile.plan === 'free' ? (
                            <button className="w-full py-2 bg-slate-100 text-slate-400 font-medium rounded-lg cursor-default">
                                Active
                            </button>
                        ) : (
                            <button
                                onClick={() => setProfile({ ...profile, plan: 'free' })}
                                className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                            >
                                Downgrade
                            </button>
                        )}
                    </div>

                    {/* Pro Plan */}
                    <div className={`relative bg-white p-6 rounded-xl border-2 shadow-lg flex flex-col overflow-hidden ${profile.plan === 'pro' ? 'border-brand-600 ring-2 ring-brand-100' : 'border-brand-600'}`}>
                        {profile.plan !== 'pro' && (
                            <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        )}
                        <div className="mb-4">
                            {profile.plan === 'pro' && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                                    Current Plan
                                </span>
                            )}
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">Pro Growth</h3>
                            <p className="text-slate-500 text-sm">Full power for serious businesses</p>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-6">€29<span className="text-base font-normal text-slate-500">/mo</span></div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center text-sm text-slate-700"><Check className="w-4 h-4 text-brand-600 mr-2" /> <strong>Advanced</strong> SEO Reports</li>
                            <li className="flex items-center text-sm text-slate-700"><Check className="w-4 h-4 text-brand-600 mr-2" /> Unlimited AI Consultations</li>
                            <li className="flex items-center text-sm text-slate-700"><Check className="w-4 h-4 text-brand-600 mr-2" /> Competitor Analysis</li>
                            <li className="flex items-center text-sm text-slate-700"><Check className="w-4 h-4 text-brand-600 mr-2" /> Priority Support</li>
                        </ul>

                        {profile.plan === 'pro' ? (
                            <button className="w-full py-2 bg-brand-50 text-brand-700 font-medium rounded-lg cursor-default">
                                Active
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleUpgrade}
                                    disabled={isUpgrading}
                                    className="w-full py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center disabled:opacity-70"
                                >
                                    {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upgrade to Pro'}
                                </button>
                                {upgradeError && (
                                    <div className="flex items-center mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
                                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                                        {upgradeError}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
