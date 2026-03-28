import { useState, useEffect } from 'react';
import { ArrowRight, CreditCard, Landmark, LineChart, ShieldCheck, Wallet, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const stats = [
  { name: 'Active Loans', value: '₹ 45,000', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Investments', value: '₹ 1,20,000', icon: LineChart, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { name: 'Insurance Cover', value: '₹ 50,00,000', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  { name: 'Credit Score', value: '785', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const quickActions = [
  { title: 'Apply for Personal Loan', desc: 'Instant approval up to ₹5L', link: '/loans', icon: Wallet },
  { title: 'Open Bank Account', desc: 'Zero balance, 5 mins process', link: '/accounts', icon: Landmark },
  { title: 'Check PM Mudra Eligibility', desc: 'Govt backed business loan', link: '/schemes', icon: ArrowRight },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3));
    const unsub = onSnapshot(q, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'announcements');
    });

    return () => unsub();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!</h1>
        <p className="text-slate-500 mt-1">Here's your financial overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Eligibility Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-md">
              <h2 className="text-xl font-bold mb-2">Check Your Loan Eligibility Instantly</h2>
              <p className="text-indigo-100 mb-6">Our AI analyzes your profile across 40+ banks and NBFCs to find the best pre-approved offers.</p>
              <Link to="/loans" className="inline-block bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Check Now
              </Link>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Top Aggregators */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Compare & Apply</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Paisabazaar', 'BankBazaar', 'Wishfin'].map((partner) => (
                <Link to="/loans" key={partner} className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all group">
                  <div className="w-12 h-12 bg-slate-100 rounded-full mb-3 flex items-center justify-center group-hover:bg-indigo-100">
                    <Landmark className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-indigo-700">{partner}</span>
                  <span className="text-xs text-slate-500 mt-1">Multiple Banks</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Announcements */}
          {announcements.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                Latest Announcements
              </h3>
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="font-semibold text-slate-900">{ann.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link 
                    key={action.title} 
                    to={action.link}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{action.title}</p>
                      <p className="text-sm text-slate-500">{action.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Payment Partners */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Partners</h3>
            <div className="flex flex-wrap gap-2">
              {['Razorpay', 'Cashfree', 'Setu'].map((partner) => (
                <span key={partner} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg border border-slate-200">
                  {partner}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">Powered by Open Banking APIs for instant verification.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
