import React, { useState, useEffect } from 'react';
import { Shield, User, CreditCard, Lock, CheckCircle, ArrowRight, FileText, DollarSign, Activity } from 'lucide-react';

// --- Header Component ---
const Header = ({ activePage, setActivePage }) => {
  const navItems = ['Integrator', 'Home', 'Admin', 'Audit Logs'];

  return (
    <header className="bg-[#005f5f] text-white py-3 px-6 flex items-center justify-between shadow-md w-full relative z-20">
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

      <div className="text-xs text-gray-300 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
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
  const [userId, setUserId] = useState('tdsdavid'); 
  const [authCode, setAuthCode] = useState('845728628'); 
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
      
      const response = await fetch('https://maxut-app.vercel.app/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          auth_code: authCode 
        }), 
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
    setAuthCode('');
    setGeneratedImage(null);
    setError(null);
    setTimeLeft(30);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 pt-6 w-full">
      <div className="flex-1 space-y-6 pr-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Device Activation</h2>
          <p className="text-gray-500 text-sm mt-1">Bind a physical or soft token to a user ID.</p>
        </div>

        <div className="space-y-4 mt-8">
          
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-800 bg-gray-50/50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#005f5f]/20 focus:border-[#005f5f]"
                placeholder="Enter User ID"
              />
            </div>
          </div>

         
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Activation Auth Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-800 bg-gray-50/50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#005f5f]/20 focus:border-[#005f5f]"
                placeholder="Enter 9-digit Code"
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col items-center gap-4">
            <button 
              onClick={handleGenerate}
              
              disabled={isLoading || !userId || !authCode} 
              className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 transform ${
                isLoading || !userId || !authCode
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#005f5f] to-[#004c4c] hover:from-[#004c4c] hover:to-[#003939] hover:-translate-y-0.5 hover:shadow-lg'
              }`}
            >
              {isLoading ? "Processing Request..." : "Generate Activation Code"}
            </button>
            
            {error && <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg w-full border border-red-100 text-center font-medium flex items-center justify-center gap-2"><Lock className="w-3 h-3"/> {error}</div>}
            <button onClick={handleClear} className="text-gray-400 text-sm hover:text-gray-700 transition-colors">Clear Form</button>
          </div>
        </div>
      </div>

      {/* --- Visual Output Area --- */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        {!generatedImage ? (
          <div className="w-full h-full border-2 border-dashed border-gray-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group">
            <Shield className="w-12 h-12 mb-4 opacity-40 group-hover:scale-110 group-hover:text-[#005f5f] transition-all duration-500" />
            <span className="text-sm font-medium tracking-wide">Awaiting Generation</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
            <div className={`p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-1000 ${timeLeft === 0 ? 'opacity-30 grayscale' : 'opacity-100'}`}>
              <img 
                src={`data:image/png;base64,${generatedImage}`} 
                className="w-56 h-56 object-contain" 
                alt="Activation Token"
              />
            </div>
            <p className="mt-6 text-sm font-bold text-gray-800">Scan with eToken App</p>
            
            <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-[#005f5f]'}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-500 mt-2 font-bold tracking-widest">
              00:{timeLeft.toString().padStart(2, '0')}
            </div>

            {timeLeft === 0 && (
               <p className="text-red-500 text-xs mt-3 font-bold uppercase tracking-tighter bg-red-50 px-3 py-1 rounded">Code Expired</p>
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
      const response = await fetch('https://maxut-app.vercel.app/api/sign', {
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

  const handleValidateSignature = async () => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const response = await fetch('https://maxut-app.vercel.app/api/validate-signature', {
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
      <div className="w-full max-w-lg mx-auto py-12 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#005f5f]/10 mb-4">
             <Activity className="w-8 h-8 text-[#005f5f]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Signature Validation</h2>
          <p className="text-gray-500 text-sm mt-2">Enter the cryptogram response from the device</p>
        </div>

        <div className="space-y-6 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div>
            <div className="flex gap-4">
              <input
                type="text"
                value={signatureCode}
                onChange={(e) => setSignatureCode(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                placeholder="6-digit code"
                maxLength={6}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-center text-xl tracking-[0.5em] font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005f5f]/20 focus:border-[#005f5f] bg-gray-50/50"
              />
              <button 
                onClick={handleValidateSignature} 
                disabled={isLoading || signatureCode.length < 6}
                className="bg-gradient-to-r from-[#005f5f] to-[#004c4c] hover:from-[#004c4c] hover:to-[#003939] text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Validate"}
              </button>
            </div>
          </div>

          {validationResult === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center justify-center gap-2 animate-in zoom-in duration-300">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-bold">Validation Successful</span>
            </div>
          )}
          {validationResult === 'failed' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center justify-center gap-2 animate-in shake duration-300">
              <Lock className="w-5 h-5" />
              <span className="font-bold">{error}</span>
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <button onClick={handleClear} className="text-sm text-gray-400 hover:text-[#005f5f] transition-colors font-medium">Start New Transaction</button>
        </div>
      </div>
    );
  }

  // Define icons for inputs dynamically
  const getInputIcon = (fieldName) => {
    switch(fieldName) {
      case 'origin': return <CreditCard className="h-4 w-4 text-gray-400" />;
      case 'beneficiary': return <User className="h-4 w-4 text-gray-400" />;
      case 'name': return <FileText className="h-4 w-4 text-gray-400" />;
      case 'amount': return <DollarSign className="h-4 w-4 text-gray-400" />;
      default: return <Lock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 pt-6 w-full">
      <div className="flex-1 space-y-6 pr-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Transaction Signing</h2>
          <p className="text-gray-500 text-sm mt-1">Generate a secure visual signature for funds transfer.</p>
        </div>
        <div className="space-y-4 mt-6">
          {['origin', 'beneficiary', 'name', 'amount'].map((field) => (
            <div key={field}>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{field.replace('_', ' ')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   {getInputIcon(field)}
                </div>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={step === 'display'}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50/50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#005f5f]/20 focus:border-[#005f5f] disabled:opacity-60"
                />
              </div>
            </div>
          ))}
          <div className="pt-4 flex gap-4">
             <button onClick={handleClear} className="px-6 bg-white border border-gray-200 text-gray-600 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Clear</button>
            <button 
              onClick={handleSignReal}
              disabled={isLoading || step === 'display'}
              className={`flex-1 text-white font-bold py-2.5 rounded-lg shadow-md transition-all duration-200 transform ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#005f5f] to-[#004c4c] hover:from-[#004c4c] hover:to-[#003939] hover:-translate-y-0.5 hover:shadow-lg'
              }`}
            >
              {isLoading ? "Generating Data..." : "Generate Transaction Data"}
            </button>
          </div>
          {error && <div className="text-red-500 text-xs text-center font-medium mt-2 bg-red-50 py-2 rounded-lg border border-red-100">{error}</div>}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        {step === 'form' ? (
          <div className="w-full h-full border-2 border-dashed border-gray-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group">
            <CreditCard className="w-12 h-12 mb-4 opacity-40 group-hover:scale-110 group-hover:text-[#005f5f] transition-all duration-500" />
            <span className="text-sm font-medium tracking-wide">Awaiting Data</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
            <div className={`p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-1000 ${timeLeft === 0 ? 'opacity-30 grayscale' : 'opacity-100'}`}>
              <img src={`data:image/png;base64,${generatedImage}`} className="w-56 h-56 object-contain" alt="Signature" />
            </div>
            
            <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-6 overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-[#005f5f]'}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-500 mt-2 font-bold tracking-widest">
              00:{timeLeft.toString().padStart(2, '0')}
            </div>

            {timeLeft <= 1 && (
              <button 
                onClick={() => setStep('validate')} 
                className="mt-6 flex items-center gap-2 px-8 py-3 bg-[#005f5f] hover:bg-[#004c4c] text-white rounded-lg font-bold shadow-[0_4px_14px_0_rgba(0,95,95,0.39)] animate-in slide-in-from-bottom-4 duration-500 transform hover:-translate-y-1 transition-all"
              >
                Proceed to Validation <ArrowRight className="w-4 h-4" />
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800">
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-grow container mx-auto flex flex-col items-center py-12 px-4 sm:px-6">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Security Integrator Portal</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Secure device management and high-value transaction authorization platform.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-5xl overflow-hidden min-h-[600px] flex flex-col relative z-10">
          <div className="flex border-b border-gray-100 bg-gray-50/80">
            <button
              onClick={() => setActiveTab('activation')}
              className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'activation' ? 'text-[#005f5f] bg-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'activation' ? 'text-[#005f5f]' : 'text-gray-400'}`} />
              Activation
              {activeTab === 'activation' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#005f5f] rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('transaction')}
              className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'transaction' ? 'text-[#005f5f] bg-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${activeTab === 'transaction' ? 'text-[#005f5f]' : 'text-gray-400'}`} />
              Transaction Data Signing
              {activeTab === 'transaction' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#005f5f] rounded-t-full" />}
            </button>
          </div>

          <div className="p-10 flex-grow bg-white">
            {activeTab === 'activation' ? <DeviceActivation /> : <TransactionSigning />}
          </div>
        </div>
        
        {/* Decorative background blobs */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#005f5f]/5 blur-3xl pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-[#005f5f]/5 blur-3xl pointer-events-none z-0"></div>
        
        <Footer />
      </main>
    </div>
  );
}