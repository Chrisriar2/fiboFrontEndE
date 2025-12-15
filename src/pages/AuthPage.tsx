import React, { useState } from 'react';
import { X, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { InputField, ButtonPrimary, ScrollReveal } from '../components/ui/SharedUI';
import { authApi } from '../services/authApi';

export const AuthView = ({ onLoginSuccess, onBack }: any) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');
  const [loading, setLoading] = useState(false);

  const switchMode = (mode: 'login' | 'register' | 'recover') => setAuthMode(mode);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'login') {
        // For demo: grab values from form inputs (simple approach)
        const form = e.target as HTMLFormElement;
        const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
        const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
        const { access_token } = await authApi.login({ email, password });
        // store token in localStorage (basic)
        if (access_token) localStorage.setItem('token', access_token);
        onLoginSuccess && onLoginSuccess();
      } else if (authMode === 'register') {
        const form = e.target as HTMLFormElement;
        const username = (form.querySelector('input[placeholder="Phidias"]') as HTMLInputElement)?.value || '';
        const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
        const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
        await authApi.register({ username, email, password });
        // after register, switch to login
        setAuthMode('login');
      } else {
        // recover
        setAuthMode('login');
      }
    } catch (err) {
      console.error('Auth error', err);
      alert('Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const config = {
    login: { title: 'Welcome Back', subtitle: 'Your collection awaits.', btnText: 'Sign In' },
    register: { title: 'Create Account', subtitle: 'Join the creative community.', btnText: 'Sign Up' },
    recover: { title: 'Recover Access', subtitle: "We'll send you a new key.", btnText: 'Send Instructions' }
  }[authMode];

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col lg:flex-row overflow-hidden">
      <button onClick={onBack} className="absolute top-8 right-8 z-50 text-white/40 hover:text-white transition-colors"><X size={32} /></button>
      <div className="lg:w-1/2 h-48 lg:h-full relative overflow-hidden bg-black/50" />
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-serif text-white mb-2">{config.title}</h2>
            <p className="text-white/40 text-sm font-light tracking-wide">{config.subtitle}</p>
          </div>
          <form onSubmit={handleSubmit}>
            {authMode === 'register' && <InputField label="Artist Name" placeholder="Phidias" icon={User} />}
            <InputField label="Email Address" type="email" placeholder="artist@museo.ai" icon={Mail} />
            {authMode !== 'recover' && <InputField label="Password" type="password" placeholder="••••••••" icon={Lock} />}
            <ButtonPrimary type="submit" className="w-full mt-4">{config.btnText}</ButtonPrimary>
          </form>

          <div className="mt-6 text-center">
            {authMode !== 'login' ? (
              <button onClick={() => switchMode('login')} className="text-xs text-white/40">Back to Sign In</button>
            ) : (
              <div>
                <button onClick={() => switchMode('register')} className="mr-4 text-xs text-white/40">Sign Up</button>
                <button onClick={() => switchMode('recover')} className="text-xs text-white/40">Recover</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
