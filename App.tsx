import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Generator from "./components/Generator";
import { AppState, GenerationMode } from "./types";
import { KeyRound, Loader2, ExternalLink, Info } from "lucide-react";

const App: React.FC = () => {
  // 🔐 LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("auth") === "true"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔑 API KEY STATE
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);

  // 📊 APP VIEW STATE
  const [appState, setAppState] = useState<AppState>({
    view: "dashboard",
    mode: null,
  });

  // 🔍 Check API Key
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else if (process.env.API_KEY) {
          setHasApiKey(true);
        }
      } catch (e) {
        console.error("Failed to check API key status", e);
      } finally {
        setIsCheckingKey(false);
      }
    };

    if (isLoggedIn) {
      checkKey();
    } else {
      setIsCheckingKey(false);
    }
  }, [isLoggedIn]);

  // 🔐 HANDLE LOGIN
  const handleLogin = () => {
    const correctUsername = "admin123";
    const correctPassword = "cardcampus1234";

    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem("auth", "true");
      setIsLoggedIn(true);
    } else {
      alert("Invalid ID or Password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
    setHasApiKey(false);
    setAppState({ view: "dashboard", mode: null });
  };

  // 🔑 API KEY SELECT
  const handleSelectKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      } else {
        alert(
          "API Key selection only works inside Project IDX / AI Studio. For local development, set process.env.API_KEY."
        );
      }
    } catch (e) {
      console.error("Failed to select API key", e);
    }
  };

  const handleResetKey = () => {
    setHasApiKey(false);
  };

  const handleSelectMode = (mode: GenerationMode) => {
    setAppState({
      view: "generator",
      mode,
    });
  };

  const handleBack = () => {
    setAppState({
      view: "dashboard",
      mode: null,
    });
  };

  // ================================
  // 🔐 LOGIN SCREEN (FIRST LAYER)
  // ================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="bg-zinc-900 p-10 rounded-2xl w-full max-w-sm shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Admin Login
          </h2>

          <input
            type="text"
            placeholder="Enter ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 p-3 rounded bg-zinc-800 border border-zinc-700"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded bg-zinc-800 border border-zinc-700"
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ================================
  // 🔄 LOADING SCREEN
  // ================================
  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        <Loader2 className="animate-spin mr-2" />
        Initializing...
      </div>
    );
  }

  // ================================
  // 🔑 API KEY SCREEN
  // ================================
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <KeyRound size={32} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-4">NanoGen Studio</h1>

          <p className="text-zinc-400 mb-8 leading-relaxed">
            To use the high-fidelity <strong>Nano Banana Pro</strong> model,
            connect a paid API key from Google AI Studio.
          </p>

          <button
            onClick={handleSelectKey}
            className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <KeyRound size={18} />
            Connect API Key
          </button>

          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-600 hover:text-zinc-400 flex items-center justify-center gap-1"
          >
            About Gemini API Billing <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

  // ================================
  // 🏠 MAIN APP
  // ================================
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleBack}
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
            <span className="font-bold text-lg tracking-tight">
              LOOKEra
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Admin
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-24 pb-8 min-h-screen flex items-center justify-center">
        {appState.view === "dashboard" ? (
          <Dashboard onSelectMode={handleSelectMode} />
        ) : appState.mode ? (
          <Generator
            mode={appState.mode}
            onBack={handleBack}
            onResetKey={handleResetKey}
          />
        ) : (
          <Dashboard onSelectMode={handleSelectMode} />
        )}
      </main>
    </div>
  );
};

export default App;
