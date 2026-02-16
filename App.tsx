import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Generator from "./components/Generator";
import { AppState, GenerationMode } from "./types";
import { Loader2 } from "lucide-react";

const App: React.FC = () => {

  // 🔐 LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("auth") === "true"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 📊 APP VIEW STATE
  const [appState, setAppState] = useState<AppState>({
    view: "dashboard",
    mode: null,
  });


  // 🔐 HANDLE LOGIN
  const handleLogin = () => {

    const correctUsername = "admin123";
    const correctPassword = "cardcampus1234";

    if (username === correctUsername && password === correctPassword) {

      localStorage.setItem("auth", "true");

      setIsLoggedIn(true);

    }

    else {

      alert("Invalid ID or Password");

    }

  };


  const handleLogout = () => {

    localStorage.removeItem("auth");

    setIsLoggedIn(false);

    setAppState({
      view: "dashboard",
      mode: null,
    });

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
  // 🔐 LOGIN SCREEN
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

            onResetKey={() => {}}

          />

        ) : (

          <Dashboard onSelectMode={handleSelectMode} />

        )}

      </main>

    </div>

  );

};

export default App;
