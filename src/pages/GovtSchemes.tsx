import { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, CheckCircle2, ChevronRight, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const schemes = [
  {
    id: 'mudra',
    name: 'PM Mudra Loan',
    desc: 'Loans up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises.',
    features: ['No collateral required', 'Low interest rates', 'Flexible repayment'],
    eligibility: 'Any Indian Citizen with a business plan for a non-farm sector income generating activity.',
  },
  {
    id: 'pmegp',
    name: 'PMEGP',
    desc: 'Prime Minister\'s Employment Generation Programme for setting up micro-enterprises.',
    features: ['Subsidy up to 35%', 'Margin money assistance', 'Bank finance'],
    eligibility: 'Any individual above 18 years of age. At least VIII standard pass for projects costing above Rs.10 lakh in the manufacturing sector.',
  },
  {
    id: 'standup',
    name: 'Stand-Up India',
    desc: 'Loans between ₹10 Lakhs and ₹1 Crore for SC/ST and women entrepreneurs.',
    features: ['Composite loan', 'Rupay debit card', 'Credit guarantee'],
    eligibility: 'SC/ST and/or woman entrepreneur, above 18 years of age.',
  },
];

export default function GovtSchemes() {
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = (id: string) => {
    setSelectedScheme(id);
    setIsApplying(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Government Loan Schemes</h1>
        <p className="text-slate-500 mt-1">Explore and apply for various government-backed financial assistance programs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheme List */}
        <div className="lg:col-span-2 space-y-6">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{scheme.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">{scheme.desc}</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {scheme.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Eligibility</h3>
                  <p className="text-sm text-slate-600">{scheme.eligibility}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => handleApply(scheme.id)}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  Apply Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">Why Apply Through Us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 text-indigo-600 shadow-sm">1</div>
                <div>
                  <p className="font-semibold text-indigo-900 text-sm">Single Application</p>
                  <p className="text-xs text-indigo-700 mt-1">Apply to multiple banks with one form.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 text-indigo-600 shadow-sm">2</div>
                <div>
                  <p className="font-semibold text-indigo-900 text-sm">AI Assistance</p>
                  <p className="text-xs text-indigo-700 mt-1">Get help filling out complex forms.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 text-indigo-600 shadow-sm">3</div>
                <div>
                  <p className="font-semibold text-indigo-900 text-sm">Fast Tracking</p>
                  <p className="text-xs text-indigo-700 mt-1">Direct integration with bank APIs.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 relative"
          >
            <button 
              onClick={() => setIsApplying(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Application Form</h2>
                  <p className="text-slate-500 text-sm">Fill in your details to apply for {schemes.find(s => s.id === selectedScheme)?.name}</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Application Submitted Successfully!'); setIsApplying(false); }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Aadhaar Number</label>
                    <input type="text" required pattern="\d{12}" title="12 digit Aadhaar number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">PAN Number</label>
                    <input type="text" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Loan Amount Required (₹)</label>
                    <input type="number" required min="10000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Business Description</label>
                  <textarea required rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Upload Documents (Aadhaar, PAN, Business Proof)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
