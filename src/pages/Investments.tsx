import { motion } from 'motion/react';
import { ArrowUpRight, BarChart3, Landmark, PiggyBank, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const investmentOptions = [
  {
    title: 'Fixed Deposits (FD)',
    desc: 'Secure returns with flexible tenures.',
    icon: Landmark,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    returns: 'Up to 8.5% p.a.',
    risk: 'Low Risk',
    action: 'Open FD'
  },
  {
    title: 'Mutual Funds',
    desc: 'Diversified portfolios managed by experts.',
    icon: BarChart3,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    returns: '12-15% p.a. (Historical)',
    risk: 'Moderate to High Risk',
    action: 'Start Investing'
  },
  {
    title: 'Systematic Investment Plan (SIP)',
    desc: 'Invest small amounts regularly.',
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    returns: '12-15% p.a. (Historical)',
    risk: 'Moderate Risk',
    action: 'Start SIP'
  },
  {
    title: 'Public Provident Fund (PPF)',
    desc: 'Govt backed long-term savings scheme.',
    icon: PiggyBank,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    returns: '7.1% p.a. (Tax Free)',
    risk: 'Zero Risk',
    action: 'Open PPF'
  }
];

export default function Investments() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Investments & Wealth</h1>
        <p className="text-slate-500 mt-1">Grow your wealth with our curated investment options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {investmentOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.bg} ${option.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {option.risk}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{option.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 flex-grow">{option.desc}</p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-500">Expected Returns</span>
                      <span className="font-semibold text-emerald-600">{option.returns}</span>
                    </div>
                    <button 
                      onClick={() => toast.success(`Redirecting to ${option.title} application...`)}
                      className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      {option.action} <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {/* SIP Calculator Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick SIP Calculator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 flex justify-between">
                  <span>Monthly Investment</span>
                  <span className="text-indigo-600 font-bold">₹ 5,000</span>
                </label>
                <input type="range" min="500" max="50000" defaultValue="5000" className="w-full mt-2 accent-indigo-600" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 flex justify-between">
                  <span>Expected Return Rate</span>
                  <span className="text-indigo-600 font-bold">12%</span>
                </label>
                <input type="range" min="5" max="20" defaultValue="12" className="w-full mt-2 accent-indigo-600" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 flex justify-between">
                  <span>Time Period</span>
                  <span className="text-indigo-600 font-bold">10 Years</span>
                </label>
                <input type="range" min="1" max="30" defaultValue="10" className="w-full mt-2 accent-indigo-600" />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-500">Invested Amount</span>
                  <span className="font-medium text-slate-900">₹ 6,00,000</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-slate-500">Est. Returns</span>
                  <span className="font-medium text-emerald-600">₹ 5,61,695</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                  <span className="font-semibold text-indigo-900">Total Value</span>
                  <span className="text-xl font-bold text-indigo-600">₹ 11,61,695</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
