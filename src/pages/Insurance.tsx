import { motion } from 'motion/react';
import { HeartPulse, ShieldAlert, ShieldCheck, Umbrella } from 'lucide-react';
import { toast } from 'sonner';

const insurances = [
  {
    title: 'Health Insurance',
    desc: 'Comprehensive coverage for medical emergencies.',
    icon: HeartPulse,
    color: 'text-rose-600',
    bg: 'bg-rose-100',
    cover: 'Up to ₹1 Crore',
    premium: 'Starts at ₹450/month'
  },
  {
    title: 'Term Life Insurance',
    desc: 'Financial security for your family.',
    icon: ShieldCheck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    cover: 'Up to ₹2 Crores',
    premium: 'Starts at ₹600/month'
  },
  {
    title: 'Motor Insurance',
    desc: 'Protect your car or two-wheeler.',
    icon: ShieldAlert,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    cover: 'Comprehensive',
    premium: 'Starts at ₹2000/year'
  },
  {
    title: 'Travel Insurance',
    desc: 'Coverage for domestic and international trips.',
    icon: Umbrella,
    color: 'text-sky-600',
    bg: 'bg-sky-100',
    cover: 'Up to $500,000',
    premium: 'Starts at ₹50/day'
  }
];

export default function Insurance() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Insurance & Protection</h1>
        <p className="text-slate-500 mt-1">Secure your future and protect your assets with our insurance plans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insurances.map((insurance) => {
          const Icon = insurance.icon;
          return (
            <div key={insurance.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${insurance.bg} ${insurance.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{insurance.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{insurance.desc}</p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Cover</span>
                    <span className="font-medium text-slate-900">{insurance.cover}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Premium</span>
                    <span className="font-medium text-emerald-600">{insurance.premium}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toast.success(`Getting quote for ${insurance.title}...`)}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Get Quote
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
