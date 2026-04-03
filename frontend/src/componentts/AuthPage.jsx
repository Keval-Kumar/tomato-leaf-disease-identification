import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, MapPin, Bell, Settings, ChevronRight,
  Edit2, Check, TrendingUp, Sprout, Star, Activity,
  X, Loader2, Leaf, Bug, Shield, BarChart3
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// GOOGLE OAUTH SETUP
// 1. Go to https://console.cloud.google.com/
// 2. Create new project → APIs & Services → Credentials
// 3. Create OAuth 2.0 Client ID → Web Application
// 4. Add to Authorized JavaScript origins:
//    - http://localhost:5173 (for dev)
//    - https://yourdomain.com (for production)
// 5. Replace the value below with your actual Client ID
// ─────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
// Example: "123456789-abc123def456.apps.googleusercontent.com"

// ── FLOATING LEAVES BG ──
function AgriBackground() {
  const items = ["🌿","🍃","🌱","🍀","🌾","🍅","🌻","🌺"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div animate={{scale:[1,1.2,1],x:[0,20,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut"}}
        style={{position:"absolute",top:"-5%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(39,174,96,0.2),transparent 70%)",filter:"blur(40px)"}}/>
      <motion.div animate={{scale:[1,1.15,1],y:[0,30,0]}} transition={{duration:12,repeat:Infinity,ease:"easeInOut",delay:3}}
        style={{position:"absolute",bottom:"-10%",right:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(127,209,79,0.15),transparent 70%)",filter:"blur(50px)"}}/>
      <motion.div animate={{scale:[1,1.1,1]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut",delay:1}}
        style={{position:"absolute",top:"40%",right:"20%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(47,160,216,0.1),transparent 70%)",filter:"blur(40px)"}}/>
      
      {/* Floating icons */}
      {items.map((icon,i)=>(
        <motion.div key={i} style={{
          position:"absolute",
          left:`${10+i*11}%`,
          top:`${Math.random()*80+5}%`,
          fontSize:`${Math.random()*14+12}px`,
          opacity:0.08+Math.random()*0.1,
        }}
          animate={{y:[0,-40,0],rotate:[0,15,-15,0],opacity:[0.06,0.18,0.06]}}
          transition={{duration:5+Math.random()*7,repeat:Infinity,delay:Math.random()*5,ease:"easeInOut"}}>
          {icon}
        </motion.div>
      ))}
    </div>
  );
}

// ── GOOGLE SIGN IN ──
function GoogleSignInButton({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Check if real client ID is configured
    if (GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
      setSdkReady(false);
      return;
    }

    const existing = document.getElementById("gis-sdk");
    if (existing) { initGoogle(); return; }

    const script = document.createElement("script");
    script.id = "gis-sdk";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initGoogle();
    script.onerror = () => onError("Failed to load Google Sign-In. Check your internet connection.");
    document.head.appendChild(script);
  }, []);

  const initGoogle = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
    });
    setSdkReady(true);
  };

  const handleCredentialResponse = (response) => {
    try {
      // Decode the JWT token from Google
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const userData = JSON.parse(window.atob(base64));
      setLoading(false);
      onSuccess({
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        sub: userData.sub,
        givenName: userData.given_name,
        familyName: userData.family_name,
        emailVerified: userData.email_verified,
        joinedAt: new Date().toISOString(),
      });
    } catch (err) {
      setLoading(false);
      onError("Authentication failed. Please try again.");
    }
  };

  const handleSignIn = () => {
    if (!window.google || !sdkReady) return;
    setLoading(true);
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Render manual button if One Tap is blocked
        setLoading(false);
        window.google.accounts.id.renderButton(
          document.getElementById("google-btn-container"),
          { theme:"outline", size:"large", shape:"rectangular", width:300, text:"signin_with" }
        );
      }
    });
  };

  // If client ID not configured — show setup instructions
  if (GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl p-4 text-xs" style={{background:"rgba(230,126,34,0.08)",border:"1px solid rgba(230,126,34,0.25)"}}>
          <p className="font-bold mb-2" style={{color:"#e67e22"}}>⚙️ Setup Required</p>
          <p style={{color:"#d35400",lineHeight:1.7}}>
            Replace <code className="bg-orange-50 px-1 rounded">GOOGLE_CLIENT_ID</code> in AuthPage.jsx with your actual Google OAuth Client ID.<br/>
            Get one free at: <span className="font-bold">console.cloud.google.com</span>
          </p>
        </div>
        {/* Demo button for testing only */}
        <button
          onClick={() => onSuccess({name:"Demo Farmer",email:"farmer@agroai.in",picture:null,sub:"demo_"+Date.now(),joinedAt:new Date().toISOString()})}
          className="w-full flex items-center justify-center gap-3 rounded-2xl py-3.5 px-6 text-sm font-bold text-white transition-all hover:opacity-90"
          style={{background:"linear-gradient(135deg,#636e72,#2d3436)"}}>
          🚧 Demo Mode (Dev Only)
        </button>
      </div>
    );
  }

  return (
    <div>
      <div id="google-btn-container" className="flex justify-center mb-3"/>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
        onClick={handleSignIn} disabled={loading}
        className="w-full flex items-center justify-center gap-3 rounded-2xl py-3.5 px-6 text-sm font-bold transition-all"
        style={{background:"white",border:"1.5px solid rgba(0,0,0,0.12)",color:"#2d3436",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400"/> : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {loading ? "Signing in..." : "Continue with Google"}
      </motion.button>
    </div>
  );
}

// ── SIGN IN PAGE ──
function SignInPage({ onSuccess }) {
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{background:"linear-gradient(135deg,#e8f5e9 0%,#f0f9eb 30%,#e3f2fd 60%,#f9f7e8 100%)"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>
      <AgriBackground/>

      <motion.div initial={{opacity:0,scale:0.92,y:20}} animate={{opacity:1,scale:1,y:0}}
        transition={{duration:0.5,type:"spring"}}
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(39,174,96,0.2)",boxShadow:"0 24px 60px rgba(0,0,0,0.1)"}}>

        {/* Top accent bar */}
        <div style={{height:5,background:"linear-gradient(90deg,#27ae60,#7FD14F,#2FA0D8)"}}/>

        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div animate={{rotate:[0,6,-6,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
              className="w-18 h-18 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{background:"linear-gradient(135deg,#27ae60,#7FD14F)",width:72,height:72,boxShadow:"0 8px 24px rgba(39,174,96,0.3)"}}>
              <Leaf className="h-9 w-9 text-white"/>
            </motion.div>
            <h1 className="text-2xl font-black" style={{color:"#2d3436",fontFamily:"'Playfair Display',serif"}}>AgroAI</h1>
            <p className="text-xs font-medium mt-1" style={{color:"#636e72"}}>Tomato Disease Intelligence Platform</p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-bold mb-1.5" style={{color:"#2d3436"}}>Welcome, Farmer 🌱</h2>
            <p className="text-xs leading-relaxed" style={{color:"#636e72"}}>
              Sign in to access your personalized farm dashboard, scan history, and live market insights.
            </p>
          </div>

          {error && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
              className="rounded-xl p-3 mb-4 text-xs font-medium flex items-center gap-2"
              style={{background:"rgba(231,76,60,0.08)",border:"1px solid rgba(231,76,60,0.25)",color:"#c0392b"}}>
              <X className="h-3.5 w-3.5 flex-shrink-0"/>{error}
            </motion.div>
          )}

          <GoogleSignInButton onSuccess={onSuccess} onError={setError}/>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{background:"#ecf0f1"}}/>
            <span className="text-[10px] font-semibold" style={{color:"#b2bec3"}}>OR</span>
            <div className="flex-1 h-px" style={{background:"#ecf0f1"}}/>
          </div>

          <motion.button whileHover={{scale:1.01}} onClick={()=>window.location.href="/"}
            className="w-full py-3 rounded-2xl text-xs font-semibold transition-all"
            style={{background:"rgba(0,0,0,0.03)",border:"1px solid rgba(0,0,0,0.08)",color:"#636e72"}}>
            Continue as Guest (No account)
          </motion.button>

          <div className="mt-6 space-y-2">
            {[
              {icon:"🗂️",text:"Save and track disease scan history"},
              {icon:"📊",text:"Personalised market price alerts"},
              {icon:"🌦️",text:"Location-based weather advisories"},
            ].map(f=>(
              <div key={f.text} className="flex items-center gap-2 text-xs" style={{color:"#636e72"}}>
                <span>{f.icon}</span><span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── ACCOUNT DASHBOARD ──
function AccountDashboard({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user.name||"Farmer");

  // Load REAL scan history from localStorage (saved by PredictionsPage)
  const [scanHistory, setScanHistory] = useState(()=>{
    // try { return JSON.parse(localStorage.getItem("agroai_scans")||"[]"); } catch{ return []; }
    try { return JSON.parse(localStorage.getItem("agroai_scan_history")||"[]"); } catch{ return []; }
  });

  // Load real alert saves
  const [savedAlerts, setSavedAlerts] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("agroai_alerts")||"[]"); } catch{ return []; }
  });

  const realStats = [
    {label:"Disease Scans",  value:scanHistory.length,  icon:<Activity className="h-4 w-4"/>,  color:"#e05d44"},
    {label:"Alerts Saved",   value:savedAlerts.length,  icon:<Bell className="h-4 w-4"/>,      color:"#f39c12"},
    {label:"Crops Tracked",  value:new Set(scanHistory.map(s=>s.cropType||"tomato")).size||1, icon:<Sprout className="h-4 w-4"/>, color:"#27ae60"},
    {label:"Market Checks",  value:parseInt(localStorage.getItem("agroai_market_checks")||"0"), icon:<TrendingUp className="h-4 w-4"/>, color:"#2FA0D8"},
  ];

  const TABS = ["overview","scans","alerts","settings"];

  const removeAlert = (i) => {
    const updated = savedAlerts.filter((_,idx)=>idx!==i);
    setSavedAlerts(updated);
    localStorage.setItem("agroai_alerts",JSON.stringify(updated));
  };

  return(
    <div className="min-h-screen" style={{background:"linear-gradient(135deg,#f0f9eb 0%,#ffffff 50%,#f9f7e8 100%)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <motion.div animate={{scale:[1,1.1,1]}} transition={{duration:12,repeat:Infinity}}
          style={{position:"absolute",top:0,right:0,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(39,174,96,0.06),transparent 70%)",filter:"blur(40px)"}}/>
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 sticky top-0"
        style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(16px)",
               borderBottom:"1px solid rgba(39,174,96,0.12)",boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={()=>window.location.href="/"}
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-70"
              style={{border:"1px solid rgba(0,0,0,0.08)",color:"#636e72"}}>
              ← Home
            </button>
            <div style={{height:16,width:1,background:"#ecf0f1"}}/>
            <div className="text-sm font-bold" style={{color:"#2d3436"}}>My Account</div>
          </div>
          <motion.button whileHover={{scale:1.03}} onClick={onSignOut}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
            style={{background:"rgba(231,76,60,0.08)",border:"1px solid rgba(231,76,60,0.2)",color:"#e74c3c"}}>
            <LogOut className="h-3.5 w-3.5"/> Sign Out
          </motion.button>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6">

        {/* Profile Card */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
          className="rounded-3xl overflow-hidden mb-6"
          style={{background:"white",border:"1.5px solid rgba(39,174,96,0.12)",boxShadow:"0 8px 24px rgba(0,0,0,0.06)"}}>
          <div className="h-28 relative" style={{background:"linear-gradient(135deg,#27ae60,#7FD14F,#2FA0D8)"}}>
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 70% 50%,white 0%,transparent 60%);"}}/>
            <div className="absolute inset-0 flex items-center justify-end pr-6">
              <span className="text-4xl opacity-30">🌿</span>
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-semibold" style={{color:"rgba(255,255,255,0.6)"}}>
              {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
            </div>
          </div>

          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <div className="w-18 h-18 rounded-2xl overflow-hidden"
                  style={{width:72,height:72,border:"3px solid white",background:"linear-gradient(135deg,#27ae60,#7FD14F)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
                  {user.picture
                    ? <img src={user.picture} alt="avatar" className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-3xl">👨‍🌾</div>
                  }
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{background:"#27ae60",border:"2px solid white"}}>
                  <Check className="h-2.5 w-2.5 text-white"/>
                </div>
              </div>
              <motion.button whileHover={{scale:1.03}} onClick={()=>setEditingName(v=>!v)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold"
                style={{background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.08)",color:"#636e72"}}>
                <Edit2 className="h-3 w-3"/> Edit Profile
              </motion.button>
            </div>
            <div>
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input value={displayName} onChange={e=>setDisplayName(e.target.value)}
                    className="border-b-2 text-xl font-black outline-none bg-transparent"
                    style={{borderColor:"#27ae60",color:"#2d3436",fontFamily:"'Playfair Display',serif",width:200}}
                    onBlur={()=>{setEditingName(false);const u={...user,name:displayName};localStorage.setItem("agroai_user",JSON.stringify(u));}}
                    autoFocus/>
                  <Check className="h-4 w-4 cursor-pointer" style={{color:"#27ae60"}} onClick={()=>setEditingName(false)}/>
                </div>
              ):(
                <h2 className="text-xl font-black mb-0.5" style={{color:"#2d3436",fontFamily:"'Playfair Display',serif"}}>
                  {displayName}
                </h2>
              )}
              <p className="text-xs" style={{color:"#636e72"}}>{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
                  style={{background:"rgba(39,174,96,0.1)",border:"1px solid rgba(39,174,96,0.25)",color:"#27ae60"}}>
                  <Star className="h-2.5 w-2.5"/> Verified Farmer
                </div>
                <span className="text-[10px]" style={{color:"#b2bec3"}}>
                  Member since {new Date(user.joinedAt||Date.now()).toLocaleDateString("en-IN",{month:"long",year:"numeric"})}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {realStats.map((s,i)=>(
            <motion.div key={s.label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              whileHover={{scale:1.03,y:-2}}
              className="rounded-2xl p-4 text-center"
              style={{background:"white",border:`1.5px solid ${s.color}15`,boxShadow:`0 4px 12px ${s.color}10`}}>
              <div className="flex justify-center mb-2" style={{color:s.color}}>{s.icon}</div>
              <div className="text-2xl font-black" style={{color:"#2d3436"}}>{s.value}</div>
              <div className="text-[10px] font-medium mt-0.5" style={{color:"#b2bec3"}}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {TABS.map(tab=>(
            <motion.button key={tab} whileHover={{scale:1.03}} onClick={()=>setActiveTab(tab)}
              className="flex-shrink-0 rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all"
              style={activeTab===tab
                ? {background:"rgba(39,174,96,0.1)",border:"1.5px solid rgba(39,174,96,0.3)",color:"#27ae60"}
                : {border:"1.5px solid #ecf0f1",color:"#636e72"}}>
              {tab}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            transition={{duration:0.2}}>

            {activeTab==="overview" && (
              <div className="space-y-4">
                {/* Recent Scans */}
                <div className="rounded-2xl overflow-hidden" style={{background:"white",border:"1.5px solid #ecf0f1",boxShadow:"0 4px 12px rgba(0,0,0,0.04)"}}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{borderBottom:"1px solid #ecf0f1",background:"#fafafa"}}>
                    <span className="text-xs font-bold" style={{color:"#2d3436"}}>Recent Disease Scans</span>
                    <button onClick={()=>window.location.href="/predictions"}
                      className="text-[11px] font-bold flex items-center gap-1" style={{color:"#27ae60"}}>
                      New Scan <ChevronRight className="h-3 w-3"/>
                    </button>
                  </div>
                  {scanHistory.length===0 ? (
                    <div className="py-8 text-center">
                      <div className="text-3xl mb-2">🔬</div>
                      <p className="text-xs" style={{color:"#b2bec3"}}>No scans yet. Try scanning a tomato leaf!</p>
                      <button onClick={()=>window.location.href="/predictions"}
                        className="mt-3 text-xs font-bold px-4 py-2 rounded-xl text-white"
                        style={{background:"linear-gradient(135deg,#27ae60,#7FD14F)"}}>
                        Start First Scan
                      </button>
                    </div>
                  ) : (
                    scanHistory.slice(0,5).map((scan,i)=>(
                      <div key={i} className="flex items-center gap-3 px-4 py-3" style={{borderBottom:"1px solid #fafafa"}}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                          style={{background:`${scan.color||"#27ae60"}12`}}>
                          {scan.icon||"🍅"}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold" style={{color:"#2d3436"}}>{scan.disease||scan.label||"Unknown"}</div>
                          <div className="text-[10px]" style={{color:"#b2bec3"}}>{scan.date||"Recently"}</div>
                        </div>
                        <div className="text-sm font-black" style={{color:scan.color||"#27ae60"}}>{scan.confidence||"—"}%</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {label:"Scan Tomato Leaf", icon:"🔬", route:"/predictions", color:"#e05d44"},
                    {label:"Farm News",         icon:"📰", route:"/news",        color:"#2FA0D8"},
                    {label:"Tomato Map",        icon:"🗺️", route:"/map",         color:"#27ae60"},
                    {label:"Cultivation Guide", icon:"📖", route:"/tomato-cultivation", color:"#e67e22"},
                  ].map(a=>(
                    <motion.button key={a.label} whileHover={{scale:1.03,y:-2}} onClick={()=>window.location.href=a.route}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold text-white"
                      style={{background:`linear-gradient(135deg,${a.color},${a.color}bb)`,boxShadow:`0 4px 12px ${a.color}30`}}>
                      <span className="text-xl">{a.icon}</span>{a.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {activeTab==="scans" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium" style={{color:"#b2bec3"}}>Your disease scan history ({scanHistory.length} scans)</div>
                  {scanHistory.length>0 && (
                    // <button onClick={()=>{localStorage.removeItem("agroai_scans");setScanHistory([]);}}
                    <button onClick={()=>{localStorage.removeItem("agroai_scan_history");setScanHistory([]);}}
                      className="text-[11px] font-semibold" style={{color:"#e74c3c"}}>Clear All</button>
                  )}
                </div>
                {scanHistory.length===0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{background:"white",border:"1.5px solid #ecf0f1"}}>
                    <div className="text-4xl mb-3">🔬</div>
                    <p className="text-sm font-semibold mb-1" style={{color:"#2d3436"}}>No scans yet</p>
                    <p className="text-xs mb-4" style={{color:"#636e72"}}>Scan a tomato leaf to detect diseases instantly</p>
                    <button onClick={()=>window.location.href="/predictions"}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{background:"linear-gradient(135deg,#27ae60,#7FD14F)"}}>
                      Start Scanning
                    </button>
                  </div>
                ):(
                  scanHistory.map((scan,i)=>(
                    <motion.div key={i} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3"
                      style={{background:"white",border:"1.5px solid #ecf0f1",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{background:`${scan.color||"#27ae60"}12`}}>{scan.icon||"🍅"}</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold" style={{color:"#2d3436"}}>{scan.disease||scan.label}</div>
                        <div className="text-[10px]" style={{color:"#b2bec3"}}>{scan.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black" style={{color:scan.color||"#27ae60"}}>{scan.confidence}%</div>
                        <div className="text-[10px]" style={{color:"#b2bec3"}}>confidence</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab==="alerts" && (
              <div className="space-y-3">
                <div className="text-xs font-medium mb-2" style={{color:"#b2bec3"}}>Saved alerts ({savedAlerts.length})</div>
                {savedAlerts.length===0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{background:"white",border:"1.5px solid #ecf0f1"}}>
                    <div className="text-3xl mb-2">🔔</div>
                    <p className="text-xs" style={{color:"#b2bec3"}}>No saved alerts. Save alerts from the News page!</p>
                  </div>
                ):(
                  savedAlerts.map((a,i)=>(
                    <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}}
                      className="rounded-2xl px-4 py-3 flex items-center gap-3"
                      style={{background:"white",border:"1.5px solid #ecf0f1",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                      <span className="text-xl">{a.icon||"🔔"}</span>
                      <div className="flex-1">
                        <div className="text-xs font-semibold" style={{color:"#2d3436"}}>{a.title}</div>
                        <div className="text-[10px]" style={{color:"#b2bec3"}}>{a.time}</div>
                      </div>
                      <button onClick={()=>removeAlert(i)}>
                        <X className="h-3.5 w-3.5 transition-opacity hover:opacity-60" style={{color:"#b2bec3"}}/>
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab==="settings" && (
              <div className="space-y-3">
                {[
                  {label:"Notification Preferences", icon:<Bell className="h-4 w-4"/>,    desc:"Disease & market alerts"},
                  {label:"Location Settings",        icon:<MapPin className="h-4 w-4"/>,   desc:"Manage location access"},
                  {label:"Privacy & Data",           icon:<Shield className="h-4 w-4"/>,   desc:"Control your data"},
                  {label:"About AgroAI",             icon:<Leaf className="h-4 w-4"/>,     desc:"Version 2.0.0"},
                ].map(item=>(
                  <motion.button key={item.label} whileHover={{scale:1.01,x:2}}
                    className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all"
                    style={{background:"white",border:"1.5px solid #ecf0f1",boxShadow:"0 2px 8px rgba(0,0,0,0.03)"}}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{background:"rgba(39,174,96,0.08)",color:"#27ae60"}}>{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold" style={{color:"#2d3436"}}>{item.label}</div>
                      <div className="text-[10px]" style={{color:"#b2bec3"}}>{item.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4" style={{color:"#b2bec3"}}/>
                  </motion.button>
                ))}
                <motion.button whileHover={{scale:1.01}} onClick={onSignOut}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold mt-4"
                  style={{background:"rgba(231,76,60,0.06)",border:"1.5px solid rgba(231,76,60,0.2)",color:"#e74c3c"}}>
                  <LogOut className="h-4 w-4"/> Sign Out
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ── MAIN ──
export default function AuthPage() {
  const [user, setUser] = useState(()=>{
    try{ const s=localStorage.getItem("agroai_user"); return s?JSON.parse(s):null; }catch{ return null; }
  });

  const handleSignIn = (userData) => {
    localStorage.setItem("agroai_user",JSON.stringify(userData));
    setUser(userData);
  };

  const handleSignOut = () => {
    localStorage.removeItem("agroai_user");
    if(window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
    setUser(null);
  };

  if(!user) return <SignInPage onSuccess={handleSignIn}/>;
  return <AccountDashboard user={user} onSignOut={handleSignOut}/>;
}

// ── HOOK for other pages ──
export function useAuth() {
  const [user, setUser] = useState(()=>{
    try{ const s=localStorage.getItem("agroai_user"); return s?JSON.parse(s):null; }catch{ return null; }
  });
  useEffect(()=>{
    const h=()=>{ try{ const s=localStorage.getItem("agroai_user"); setUser(s?JSON.parse(s):null); }catch{ setUser(null); } };
    window.addEventListener("storage",h);
    return()=>window.removeEventListener("storage",h);
  },[]);
  return {user, isSignedIn:!!user};
}