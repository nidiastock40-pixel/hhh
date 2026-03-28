import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Landmark, 
  PiggyBank, 
  ShieldCheck, 
  Briefcase, 
  User, 
  Menu, 
  X, 
  Bell, 
  Search,
  MessageSquare,
  LogOut,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Loans & Credit', path: '/loans', icon: Landmark },
  { name: 'Govt Schemes', path: '/schemes', icon: Briefcase },
  { name: 'Bank Accounts', path: '/accounts', icon: User },
  { name: 'Investments', path: '/investments', icon: PiggyBank },
  { name: 'Insurance', path: '/insurance', icon: ShieldCheck },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Landmark className="w-6 h-6" />
            <span>FinPortal</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}

          {role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-4",
                location.pathname === '/admin' 
                  ? "bg-purple-50 text-purple-700" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Settings className={cn("w-5 h-5", location.pathname === '/admin' ? "text-purple-600" : "text-slate-400")} />
              Admin Panel
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search loans, schemes..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200 cursor-pointer overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.displayName || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-105 z-40"
      >
        {chatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chatbot Widget */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-40 flex flex-col">
          <Chatbot onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  );
}
