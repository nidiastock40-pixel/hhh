import { motion } from 'motion/react';
import { Building, CheckCircle2, ChevronRight, Landmark, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const banks = [
  {
    type: 'Government Banks',
    icon: Landmark,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    options: [
      { name: 'State Bank of India', features: ['Zero Balance Account', 'YONO App Access', 'Free Debit Card'] },
      { name: 'Punjab National Bank', features: ['Instant Account Opening', 'Free NEFT/RTGS', 'Cheque Book'] },
      { name: 'Bank of Baroda', features: ['bob World App', 'Attractive FD Rates', 'Locker Facility'] },
    ]
  },
  {
    type: 'Private Banks',
    icon: Building,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    options: [
      { name: 'HDFC Bank', features: ['Premium Banking', 'Pre-approved Loans', 'Rewards Debit Card'] },
      { name: 'ICICI Bank', features: ['iMobile Pay', 'Instant Credit Card', 'Wealth Management'] },
      { name: 'Axis Bank', features: ['ASAP Digital Account', 'Cashback Offers', 'Forex Services'] },
    ]
  },
  {
    type: 'NBFCs & Digital Banks',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    options: [
      { name: 'Jupiter', features: ['100% Digital', '1% Cashback', 'No Hidden Fees'] },
      { name: 'Fi Money', features: ['Smart Deposits', 'AI Insights', 'Zero Forex Markup'] },
      { name: 'NiyoX', features: ['High Interest Savings', 'Zero Balance', 'Investments Integrated'] },
    ]
  }
];

export default function Accounts() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Open Bank Account</h1>
        <p className="text-slate-500 mt-1">Open a savings or current account instantly with our partner banks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {banks.map((category) => {
            const Icon = category.icon;
            return (
              <section key={category.type}>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.bg} ${category.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {category.type}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {category.options.map((bank) => (
                    <div key={bank.name} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{bank.name}</h3>
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Building className="w-5 h-5" />
                        </div>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {bank.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => toast.success(`Redirecting to ${bank.name} for account opening...`)}
                        className="w-full py-2.5 bg-slate-50 text-slate-700 font-semibold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        Open Account <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Requirements</h3>
            <p className="text-sm text-slate-600 mb-6">Keep these documents handy for a seamless digital account opening experience.</p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 text-indigo-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Aadhaar Card</p>
                  <p className="text-xs text-slate-500 mt-1">Linked with active mobile number</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 text-indigo-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">PAN Card</p>
                  <p className="text-xs text-slate-500 mt-1">Original physical card for Video KYC</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 text-indigo-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">White Paper & Pen</p>
                  <p className="text-xs text-slate-500 mt-1">For signature capture during Video KYC</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-800 font-medium">Video KYC Timing</p>
              <p className="text-xs text-amber-700 mt-1">Available from 10:00 AM to 6:00 PM on working days.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
