import { useState } from 'react';
import { motion } from 'motion/react';
import { Landmark, ShieldCheck, Loader2 } from 'lucide-react';
import { loginWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Landmark className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to FinPortal</h1>
        <p className="text-slate-500 mb-8">Sign in to manage your loans, investments, and accounts.</p>

        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          )}
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure & Encrypted Login</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
