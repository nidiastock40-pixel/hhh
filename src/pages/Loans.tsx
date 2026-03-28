import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Building2, CheckCircle2, ChevronRight, Landmark, Search, Wallet, Upload, Loader2, Sparkles, X } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { toast } from 'sonner';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const aggregators = [
  { name: 'Paisabazaar', desc: 'Compare 40+ Banks', logo: Landmark, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'BankBazaar', desc: 'Instant Approval', logo: Building2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { name: 'Wishfin', desc: 'Best Interest Rates', logo: Wallet, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const nbfcs = [
  { name: 'Bajaj Finserv', type: 'Personal & EMI', rate: '11.99% p.a.', time: '5 Mins' },
  { name: 'Tata Capital', type: 'Business & Home', rate: '10.50% p.a.', time: '24 Hours' },
  { name: 'Lendingkart', type: 'MSME Loans', rate: '1.25% p.m.', time: '3 Days' },
  { name: 'KreditBee', type: 'Instant Cash', rate: '1.02% p.m.', time: '10 Mins' },
];

export default function Loans() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', amount: '', purpose: '' });
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type
              }
            },
            "Extract the following information from this document to fill a loan application: Name, Contact Information (email or phone), Loan Amount (if mentioned, otherwise empty), and Purpose (if mentioned, otherwise empty). Return ONLY a JSON object."
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                contact: { type: Type.STRING },
                amount: { type: Type.STRING },
                purpose: { type: Type.STRING }
              }
            }
          }
        });

        if (response.text) {
          const extracted = JSON.parse(response.text);
          setFormData(prev => ({
            ...prev,
            name: extracted.name || prev.name,
            contact: extracted.contact || prev.contact,
            amount: extracted.amount || prev.amount,
            purpose: extracted.purpose || prev.purpose
          }));
        }
      };
    } catch (error) {
      console.error("Error extracting data:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  const getAiSuggestion = async () => {
    setIsSuggesting(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on this loan application profile: 
        Name: ${formData.name}
        Contact: ${formData.contact}
        Amount: ${formData.amount}
        Purpose: ${formData.purpose}
        
        Suggest the best loan product or lender (e.g., Personal Loan from HDFC, Business Loan from Bajaj Finserv) and give a 1-2 sentence reason why. Keep it concise.`
      });
      setAiSuggestion(response.text || 'No suggestion available.');
    } catch (error) {
      console.error("Error getting suggestion:", error);
      setAiSuggestion("Could not generate suggestion at this time.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("You must be logged in to apply.");
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'applications'), {
        userId: auth.currentUser.uid,
        name: formData.name,
        contact: formData.contact,
        amount: Number(formData.amount),
        purpose: formData.purpose,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      toast.success(`Application Submitted! ID: ${docRef.id.slice(0, 6).toUpperCase()}`);
      setIsModalOpen(false);
      setFormData({ name: '', contact: '', amount: '', purpose: '' });
      setAiSuggestion('');
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loans & Credit</h1>
          <p className="text-slate-500 mt-1">Apply for loans across multiple banks and NBFCs.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search lenders..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none w-full sm:w-64 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['personal', 'business', 'home', 'education'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Loan
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Aggregators */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-600" />
              Compare via Aggregators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {aggregators.map((agg) => {
                const Icon = agg.logo;
                return (
                  <div key={agg.name} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${agg.bg} ${agg.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{agg.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{agg.desc}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsModalOpen(true)}>
                      Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top NBFCs */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Direct NBFC Partners
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-200">
                {nbfcs.map((nbfc) => (
                  <div key={nbfc.name} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="font-bold text-slate-600">{nbfc.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{nbfc.name}</h3>
                        <p className="text-sm text-slate-500">{nbfc.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      <div className="text-sm font-medium text-slate-900">Starts at {nbfc.rate}</div>
                      <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        Disbursal in {nbfc.time}
                      </div>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-6 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors">
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Eligibility Check Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">Auto Eligibility Check</h3>
            <p className="text-slate-300 text-sm mb-6">Connect your bank account via Setu Open Banking to instantly check your eligibility across 20+ lenders.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>No impact on CIBIL score</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>100% secure via Account Aggregator</span>
              </div>
            </div>

            <button 
              onClick={() => toast.success('Bank account connected successfully via Setu!')}
              className="w-full mt-8 bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Connect Bank Account
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* AI Suggestion */}
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                <span className="text-indigo-700 font-bold text-sm">AI</span>
              </div>
              <h3 className="font-bold text-indigo-900">Smart Suggestion</h3>
            </div>
            <p className="text-sm text-indigo-800 mb-4">Based on your profile, you have a high chance of approval for a Personal Loan from <strong>Tata Capital</strong>.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View Offer <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loan Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Loan Application</h2>
              <p className="text-slate-500 text-sm mb-6">Fill in your details or upload a document to auto-fill.</p>

              {/* AI Auto-fill Document Upload */}
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI Auto-Fill
                    </h3>
                    <p className="text-xs text-indigo-700 mt-1">Upload your ID or business document to auto-fill the form.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isExtracting}
                    className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isExtracting ? 'Extracting...' : 'Upload Doc'}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*,application/pdf"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Contact (Phone/Email)</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.contact}
                      onChange={e => setFormData({...formData, contact: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Loan Amount (₹)</label>
                    <input 
                      type="number" 
                      required 
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Purpose</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.purpose}
                      onChange={e => setFormData({...formData, purpose: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* AI Suggestion Area */}
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-900">AI Loan Suggestion</h3>
                    <button 
                      type="button"
                      onClick={getAiSuggestion}
                      disabled={isSuggesting || !formData.amount}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 flex items-center gap-1"
                    >
                      {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Get Suggestion
                    </button>
                  </div>
                  {aiSuggestion ? (
                    <p className="text-sm text-slate-700">{aiSuggestion}</p>
                  ) : (
                    <p className="text-xs text-slate-500">Fill out the form and click "Get Suggestion" to see the best loan options for you.</p>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
