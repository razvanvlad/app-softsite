
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Search, 
  Briefcase, 
  Menu, 
  X, 
  Bell, 
  User,
  Settings,
  FileCheck
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 mb-1 group ${
      active 
        ? 'bg-brand-50 text-brand-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
    <span>{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-accent-600 rounded-lg mr-3 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
              S
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              SoftSite AI
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Platform</div>
            <NavItem 
              to="/" 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={location.pathname === '/'} 
            />
            <NavItem 
              to="/consultant" 
              icon={Bot} 
              label="Chat Consultant" 
              active={location.pathname === '/consultant'} 
            />
             <NavItem 
              to="/startup-tools" 
              icon={FileCheck} 
              label="Eligibility & Plan" 
              active={location.pathname === '/startup-tools'} 
            />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-4 px-4">Tools</div>
            <NavItem 
              to="/seo" 
              icon={Search} 
              label="SEO Analyzer" 
              active={location.pathname === '/seo'} 
            />
            <NavItem 
              to="/tools" 
              icon={Briefcase} 
              label="Growth Tools" 
              active={location.pathname === '/tools'} 
            />
             <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-4 px-4">Account</div>
             <NavItem 
              to="/settings" 
              icon={Settings} 
              label="Settings" 
              active={location.pathname === '/settings'} 
            />
          </nav>

          {/* User Profile Snippet */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-medium text-sm">
                JD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">John Doe</p>
                <p className="text-xs text-slate-500">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 px-4 lg:px-8">
            <h1 className="text-lg font-semibold text-slate-800">
              {location.pathname === '/' && 'Overview'}
              {location.pathname === '/consultant' && 'AI Consultant'}
              {location.pathname === '/startup-tools' && 'Start-up Eligibility'}
              {location.pathname === '/seo' && 'SEO Suite'}
              {location.pathname === '/tools' && 'Business Tools'}
              {location.pathname === '/settings' && 'Settings'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/settings" className="hidden lg:flex items-center px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20">
              Upgrade to Pro
            </Link>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
