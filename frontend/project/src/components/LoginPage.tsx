// --- START OF REFACTORED FILE LoginPage.tsx ---

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Mail, Lock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

// REFACTORED: Removed speech recognition for login to simplify. Can be re-added later.
// It was tightly coupled with the old localStorage logic.

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, isLoading } = useApp(); // REFACTORED: Get isLoading from context
  
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPassword, setAgentPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // REFACTORED: The handleCustomerLogin now calls the async function from context
  const handleCustomerLogin = async () => {
    if (customerEmail.trim() && customerPassword.trim()) {
      setLoginError('');
      const success = await loginUser(customerEmail.trim(), customerPassword.trim());
      if (success) {
        navigate('/customer');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    }
  };
  
  // REFACTORED: The handleAgentLogin now calls the async function from context
  const handleAgentLogin = async () => {
    if (agentEmail.trim() && agentPassword.trim()) {
      setLoginError('');
      const success = await loginUser(agentEmail.trim(), agentPassword.trim());
      if (success) {
        navigate('/agent');
      } else {
        setLoginError('Invalid agent credentials. Please try again.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, loginFunction: () => void) => {
    if (e.key === 'Enter') {
      loginFunction();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Shield className="w-16 h-16 text-yellow-400" />
            <h1 className="text-6xl font-bold text-white">VIBank</h1>
          </div>
          <p className="text-xl text-blue-200 font-medium">
            Voice-Enabled AI Banking Assistant
          </p>
        </div>

        {loginError && (
          <div className="mb-6 bg-red-900/30 backdrop-blur-lg rounded-xl p-4 border border-red-400/30 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200">{loginError}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Login */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Customer Login</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="customer-email" className="block text-white font-semibold mb-3 text-lg"><Mail className="w-5 h-5 inline mr-2" />Email</label>
                <input id="customer-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} onKeyPress={(e) => handleKeyPress(e, handleCustomerLogin)} className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-400" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="customer-password" className="block text-white font-semibold mb-3 text-lg"><Lock className="w-5 h-5 inline mr-2" />Password</label>
                <input id="customer-password" type="password" value={customerPassword} onChange={(e) => setCustomerPassword(e.target.value)} onKeyPress={(e) => handleKeyPress(e, handleCustomerLogin)} className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-400" placeholder="Enter your password" />
              </div>
              <button onClick={handleCustomerLogin} disabled={isLoading || !customerEmail || !customerPassword} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105">
                {isLoading ? 'Logging in...' : 'Login as Customer'}
              </button>
            </div>
          </div>

          {/* Agent Login */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Agent Login</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="agent-email" className="block text-white font-semibold mb-2"><Mail className="w-4 h-4 inline mr-2" />Agent Email</label>
                <input id="agent-email" type="email" value={agentEmail} onChange={(e) => setAgentEmail(e.target.value)} onKeyPress={(e) => handleKeyPress(e, handleAgentLogin)} className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Enter agent email" />
              </div>
              <div>
                <label htmlFor="agent-password" className="block text-white font-semibold mb-2"><Lock className="w-4 h-4 inline mr-2" />Password</label>
                <input id="agent-password" type="password" value={agentPassword} onChange={(e) => setAgentPassword(e.target.value)} onKeyPress={(e) => handleKeyPress(e, handleAgentLogin)} className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Enter password" />
              </div>
              <button onClick={handleAgentLogin} disabled={isLoading || !agentEmail || !agentPassword} className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                {isLoading ? 'Logging in...' : 'Login as Agent'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};