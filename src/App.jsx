import React, { useState, useEffect } from 'react';
import { Shield, User, CreditCard, Lock, CheckCircle, ArrowRight } from 'lucide-react';

// --- Header Component ---
const Header = ({ activePage, setActivePage }) => {
  const navItems = ['Integrator', 'Home', 'Admin', 'Audit Logs'];

  return (
    <header className="bg-[#005f5f] text-white py-3 px-6 flex items-center justify-between shadow-md w-full">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6" />
        <span className="font-bold text-xl tracking-wide text-white">MAXUT Consulting</span>
      </div>
      
      <nav className="flex gap-1">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActivePage(item)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              activePage === item 
                ? 'bg-[#004c4c] text-white' 
                : 'text-gray-200 hover:bg-[#004c4c]/50'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="text-xs text-gray-300">
        System Status: <span className="text-green-300 font-bold">Online</span>
      </div>
    </header>
  );
};

// --- Footer Component ---
const Footer = () => (
  <footer className="mt-12 mb-6 text-center text-xs text-gray-400 space-y-1">
    <p>© 2026 MAXUT Consulting. All rights reserved.</p>
    <p>Encrypted Connection • Version 2.4.1</p>
  </footer>
);

// --- TAB 1: Device Activation ---
const DeviceActivation = () => {
  const [userId, setUserId] = useState('111111111');
  const [generatedImage, setGeneratedImage] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer;
    if (generatedImage && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [generatedImage, timeLeft]); 

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setTimeLeft(30); 
    try {
      const response = await fetch('http://localhost:5000/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }), 
      });

      const data = await response.json();

      if (data.ret_code !== 0 && data.ret_code !== "0") {
        throw new Error(data.ret_msg || 'Activation failed');
      }

      setGeneratedImage(data.cronto_image || data.respMsg);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUserId('');
    setGeneratedImage(null);
    setError(null);
    setTimeLeft(30);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 pt-6 w-full">
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Device Activation</h2>
          <p className="text-gray-500 text-sm mt-1">Bind a physical or soft token to a user ID.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:border-[#005f5f]"
            />
          </div>

          <div className="pt-2 flex flex-col items-center gap-4">
            <button 
              onClick={handleGenerate}
              className={`w-full text-white font-bold py-2.5 rounded shadow-sm transition-all ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#005f5f] hover:bg-[#004c4c]'
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Generate Activation Code"}
            </button>
            
            {error && <div className="text-red-600 text-xs bg-red-50 p-2 rounded w-full border border-red-100 text-center">{error}</div>}
            <button onClick={handleClear} className="text-gray-500 text-sm underline hover:text-gray-700">Clear Form</button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] border-l border-gray-100 pl-8">
        {!generatedImage ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-gray-300 w-full">
            <Shield className="w-12 h-12 mb-4 opacity-30" />
            <span className="text-sm font-medium">Awaiting Generation</span>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className={`p-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-opacity duration-1000 ${timeLeft === 0 ? 'opacity-20' : 'opacity-100'}`}>
              <img 
                src={`data:image/png;base64,${generatedImage}`} 
                className="w-48 h-48 object-contain" 
                alt="Activation Token"
              />
            </div>
            <p className="mt-6 text-sm font-bold text-gray-800">Scan with eToken App</p>
            <div className={`mt-3 px-4 py-1 rounded-full border font-mono text-xs ${timeLeft <= 5 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              Expires in {timeLeft} s
            </div>
            {timeLeft === 0 && (
               <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-tighter">Code Expired. Please regenerate.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- TAB 2: Transaction Signing ---
const TransactionSigning = () => {
  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({
    origin: '111111111',
    beneficiary: '111111111',
    name: 'Iname fname',
    amount: '11.00'
  });
  
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [signatureCode, setSignatureCode] = useState("");
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    let timer;
    if (step === 'display' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignReal = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('http://localhost:5000/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.ret_code !== 0 && data.ret_code !== "0") {
        throw new Error(data.ret_msg || "An error occurred during signing");
      }

      setGeneratedImage(data.cronto_image || data.respMsg);
      setTimeLeft(30);
      setStep('display');

    } catch (err) {
      console.error(err);
      setError(err.message || "Connection to backend failed");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: LIVE VALIDATION LOGIC ---
  const handleValidateSignature = async () => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/validate-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature: signatureCode,
          datafield: [
            String(formData.origin),
            String(formData.beneficiary),
            String(formData.name),
            String(formData.amount)
          ]
        }),
      });

      const data = await response.json();

      if (data.respCode === "0") {
        setValidationResult('success');
      } else {
        setValidationResult('failed');
        setError(data.respMsg || "Validation Failed");
      }
    } catch (err) {
      console.error(err);
      setError("Connection to validation server failed");
      setValidationResult('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ origin: '', beneficiary: '', name: '', amount: '' });
    setGeneratedImage(null);
    setError(null);
    setStep('form');
    setValidationResult(null);
    setSignatureCode("");
  };

  if (step === 'validate') {
    return (
      <div className="w-full max-w-lg mx-auto py-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Transaction Signature Validation</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Enter Transaction Data Signature Response</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={signatureCode}
                onChange={(e) => setSignatureCode(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:border-[#005f5f]"
              />
              <button 
                onClick={handleValidateSignature} 
                disabled={isLoading}
                className="bg-[#005f5f] hover:bg-[#004c4c] text-white font-bold px-6 py-2 rounded shadow-sm transition-all disabled:bg-gray-400"
              >
                {isLoading ? "Verifying..." : "Validate"}
              </button>
            </div>
          </div>
          {validationResult === 'success' && (
            <div className="p-4 bg-green-50 border border-green-100 rounded text-green-800 text-sm flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Validation is successful!</span>
            </div>
          )}
          {validationResult === 'failed' && (
            <div className="p-4 bg-red-50 border border-red-100 rounded text-red-600 text-sm flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <button onClick={handleClear} className="mt-12 text-sm text-gray-400 hover:text-gray-600 underline">Back to Start</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-12 pt-6 w-full">
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Transaction Signing</h2>
          <p className="text-gray-500 text-sm mt-1">Generate a secure visual signature for funds transfer.</p>
        </div>
        <div className="space-y-4">
          {['origin', 'beneficiary', 'name', 'amount'].map((field) => (
            <div key={field}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{field.replace('_', ' ')}</label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={step === 'display'}
                className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:border-[#005f5f]"
              />
            </div>
          ))}
          <div className="pt-2 flex gap-4">
             <button onClick={handleClear} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded hover:bg-gray-50">Clear</button>
            <button 
              onClick={handleSignReal}
              disabled={isLoading || step === 'display'}
              className={`flex-1 text-white font-bold py-2.5 rounded shadow-sm transition-all ${isLoading ? 'bg-gray-400' : 'bg-[#005f5f] hover:bg-[#004c4c]'}`}
            >
              {isLoading ? "Generating..." : "Generate Transaction Data"}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center font-medium mt-2">{error}</div>}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border-l border-gray-100 pl-8">
        {step === 'form' ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-gray-300 w-full">
            <CreditCard className="w-12 h-12 mb-4 opacity-30" />
            <span className="text-sm font-medium">Awaiting Data</span>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
            <div className={`p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-4 transition-opacity duration-1000 ${timeLeft === 0 ? 'opacity-20' : 'opacity-100'}`}>
              <img src={`data:image/png;base64,${generatedImage}`} className="w-48 h-48 object-contain" alt="Signature" />
            </div>
            <div className={`px-4 py-1 rounded-full border font-mono text-xs mb-6 ${timeLeft <= 5 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              Image expires in {timeLeft} sec
            </div>
            {timeLeft <= 1 && (
              <button onClick={() => setStep('validate')} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg animate-bounce">
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [activePage, setActivePage] = useState('Integrator');
  const [activeTab, setActiveTab] = useState('activation');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-grow container mx-auto flex flex-col items-center py-12 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Security Integrator Portal</h1>
          <p className="text-gray-600 text-lg">Secure device management and high-value transaction authorization.</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-5xl overflow-hidden min-h-[600px] flex flex-col">
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => setActiveTab('activation')}
              className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'activation' ? 'text-[#005f5f] bg-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <User className="w-4 h-4" />
              Activation
              {activeTab === 'activation' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#005f5f]" />}
            </button>
            <button
              onClick={() => setActiveTab('transaction')}
              className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'transaction' ? 'text-[#005f5f] bg-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Transaction Data Signing (TDS)
              {activeTab === 'transaction' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#005f5f]" />}
            </button>
          </div>

          <div className="p-10 flex-grow">
            {activeTab === 'activation' ? <DeviceActivation /> : <TransactionSigning />}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}