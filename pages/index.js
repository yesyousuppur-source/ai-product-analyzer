import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FREE_DAILY_LIMIT = 3;
const PREMIUM_TOTAL_LIMIT = 30;
const PREMIUM_DAYS = 7;

const FB_CONFIG = {
  apiKey: "AIzaSyDww7gi4QRRNm4t3PFQ9ny8a2WLV-V9OFU",
  authDomain: "mood2meet-85866.firebaseapp.com",
  projectId: "mood2meet-85866",
  storageBucket: "mood2meet-85866.firebasestorage.app",
  messagingSenderId: "455406578867",
  appId: "1:455406578867:web:fc5a2b6a00af996bc114c6"
};

const ADS = [
  { headline: "Scale Your Business Fast", sub: "Find winning products 10x faster", cta: "Try Now Free", color: "#f59e0b" },
  { headline: "AI Marketing Suite", sub: "Auto-generate ads, copy and creatives", cta: "Start Free Trial", color: "#8b5cf6" },
  { headline: "Shopify Store Experts", sub: "Build your store in 48 hours", cta: "Book a Call", color: "#06b6d4" },
];

const PLATFORMS = [
  { id: "google_ads", name: "Google Ads", color: "#4285f4", logo: `<svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>` },
  { id: "facebook", name: "Facebook Ads", color: "#1877f2", logo: `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>` },
  { id: "instagram", name: "Instagram", color: "#e1306c", logo: `<svg viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#ig)"/></svg>` },
  { id: "youtube", name: "YouTube", color: "#ff0000", logo: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/></svg>` },
  { id: "tiktok", name: "TikTok", color: "#010101", logo: `<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#000"/></svg>` },
  { id: "pinterest", name: "Pinterest", color: "#e60023", logo: `<svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#E60023"/></svg>` },
  { id: "snapchat", name: "Snapchat", color: "#FFFC00", logo: `<svg viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.354 4.408-.074 1.86 1.498 2.127 2.404 1.544.48-.316 1.02-.536 1.46-.536.45 0 .763.159.858.417.099.267-.124.643-.898 1.054-.241.127-.55.273-.88.425-1.07.497-2.538 1.093-2.538 2.272 0 .176.029.35.089.518.33.93 1.14 1.643 1.975 2.375.413.36.85.748 1.254 1.195.36.41.574.856.574 1.27 0 .51-.314.927-.885 1.156-.434.173-1.017.267-1.602.267-.43 0-.86-.05-1.252-.15-.622-.16-1.252-.5-1.814-.83-.386-.23-.696-.42-.966-.42-.27 0-.648.185-.998.37-.58.31-1.165.621-1.814.81-.507.145-1.13.236-1.759.236-1.25 0-2.433-.407-3.112-.963-.338-.271-.604-.566-.741-.898-.14-.333-.14-.674.014-1.02.234-.542.858-1.062 1.56-1.643.456-.376.974-.808 1.384-1.295.256-.31.42-.592.42-.863 0-.543-.72-1.091-1.736-1.572-.396-.183-.806-.339-1.152-.464-.414-.146-.712-.268-.834-.41-.17-.199-.211-.452-.106-.71.113-.274.4-.46.766-.47.305-.008.61.068.886.224.298.167.557.41.791.64.154.152.29.284.408.375.136.104.28.16.406.16.256 0 .39-.2.39-.583V7.84c0-1.19-.122-3.228.354-4.408C7.855 1.069 11.21.793 12.206.793z" fill="#FFFC00"/></svg>` },
  { id: "twitter", name: "X (Twitter)", color: "#000000", logo: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="#000"/></svg>` },
];

const store = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── FIREBASE HELPER (client only) ───────────────────────────────────────────
let _auth = null;
async function getAuth() {
  if (_auth) return _auth;
  const { initializeApp, getApps } = await import("firebase/app");
  const { getAuth: fa } = await import("firebase/auth");
  const app = getApps().length ? getApps()[0] : initializeApp(FB_CONFIG);
  _auth = fa(app);
  return _auth;
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", category: "", platform: "" });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [adIdx, setAdIdx] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form");
  const [usageInfo, setUsageInfo] = useState(null);
  const [toast, setToast] = useState(null);
  const [selPlatform, setSelPlatform] = useState(null);
  const [platData, setPlatData] = useState({});
  const [platLoading, setPlatLoading] = useState(false);
  const [firstAnalysisDone, setFirstAnalysisDone] = useState(false);
  const adRef = useRef(null);

  // ── INIT FIREBASE AUTH LISTENER ─────────────────────────────────────────
  useEffect(() => {
    const accounts = store.get("apa_saved_accounts") || [];
    setSavedAccounts(accounts);

    // Firebase only runs in browser
    if (typeof window === "undefined") return;

    let unsub = null;
    (async () => {
      try {
        const auth = await getAuth();
        const { onAuthStateChanged } = await import("firebase/auth");
        unsub = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            const u = {
              email: fbUser.email,
              name: fbUser.displayName || fbUser.email.split("@")[0],
              plan: store.get("plan_" + fbUser.email) || "free",
              photo: fbUser.photoURL || null,
            };
            setUser(u);
            setUsageInfo(calcUsage(u));
            setFirstAnalysisDone(store.get("first_analysis_"+fbUser.email) || false);
            setScreen("dashboard");
          } else {
            setScreen("auth");
          }
        });
      } catch (e) {
        console.error("Firebase init error:", e);
        setScreen("auth");
      }
    })();

    return () => { if (unsub) unsub(); };
  }, []);

  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      [1,2,3].forEach((s,i) => setTimeout(() => setLoadingStep(s), (i+1)*1200));
    }
  }, [loading]);

  // ── USAGE ────────────────────────────────────────────────────────────────
  const todayKey = () => new Date().toISOString().split("T")[0];

  const calcUsage = (u) => {
    const plan = store.get("plan_"+u?.email) || "free";
    if (plan === "premium") {
      const pd = store.get("prem_"+u?.email);
      if (!pd) return { plan:"free", remaining:FREE_DAILY_LIMIT, total:FREE_DAILY_LIMIT };
      if (new Date() > new Date(pd.expiry)) return { plan:"free", remaining:FREE_DAILY_LIMIT, total:FREE_DAILY_LIMIT, expired:true };
      const used = pd.used || 0;
      return { plan, remaining:Math.max(0,PREMIUM_TOTAL_LIMIT-used), total:PREMIUM_TOTAL_LIMIT, used, expiry:pd.expiry };
    }
    const used = store.get("use_"+u?.email+"_"+todayKey()) || 0;
    return { plan, remaining:Math.max(0,FREE_DAILY_LIMIT-used), total:FREE_DAILY_LIMIT, used };
  };

  const addUsage = (u) => {
    const plan = store.get("plan_"+u?.email) || "free";
    if (plan === "premium") {
      const pd = store.get("prem_"+u?.email);
      if (pd) store.set("prem_"+u?.email, {...pd, used:(pd.used||0)+1});
    } else {
      const k = "use_"+u?.email+"_"+todayKey();
      store.set(k, (store.get(k)||0)+1);
    }
  };

  const checkLimit = (u) => {
    const info = calcUsage(u);
    if (info.expired) return { ok:false, msg:"Premium expired! Recharge." };
    if (info.remaining <= 0) return { ok:false, msg:info.plan==="free"?"Daily limit reached. Upgrade!":"Premium limit reached." };
    return { ok:true };
  };

  // ── SAVE ACCOUNT ─────────────────────────────────────────────────────────
  const saveAcc = (email, name, password, photo) => {
    const list = store.get("apa_saved_accounts") || [];
    const i = list.findIndex(a => a.email === email);
    const acc = { email, name, password:password||"", photo:photo||null };
    if (i >= 0) list[i] = acc; else list.push(acc);
    store.set("apa_saved_accounts", list);
    setSavedAccounts([...list]);
  };

  // ── GOOGLE LOGIN ─────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try {
      const auth = await getAuth();
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      saveAcc(result.user.email, result.user.displayName, "", result.user.photoURL);
      showToast("✅ Signed in with Google!");
    } catch(e) {
      if (e.code === "auth/popup-closed-by-user") setError("Sign-in cancelled.");
      else if (e.code === "auth/unauthorized-domain") setError("Domain not authorized in Firebase Console.");
      else setError("Google sign-in failed. Try email login.");
    }
    setGoogleLoading(false);
  };

  // ── EMAIL AUTH ───────────────────────────────────────────────────────────
  const handleAuth = async () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    if (authMode === "signup" && !form.name) { setError("Name required"); return; }
    setError("");
    try {
      const auth = await getAuth();
      if (authMode === "signup") {
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
        const r = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(r.user, { displayName: form.name });
        saveAcc(form.email, form.name, form.password, null);
        showToast("✅ Account created!");
      } else {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(auth, form.email, form.password);
        saveAcc(form.email, form.email.split("@")[0], form.password, null);
        showToast("✅ Logged in!");
      }
    } catch(e) {
      if (["auth/user-not-found","auth/wrong-password","auth/invalid-credential"].includes(e.code)) setError("Invalid email or password.");
      else if (e.code === "auth/email-already-in-use") setError("Email already registered. Please login.");
      else if (e.code === "auth/weak-password") setError("Password must be 6+ characters.");
      else if (e.code === "auth/too-many-requests") setError("Too many attempts. Please wait 5 minutes and try again.");
      else if (e.code === "auth/network-request-failed") setError("Network error. Check your internet connection.");
      else setError(e.message || "Auth failed.");
    }
  };

  const quickLogin = async (acc) => {
    if (!acc.password) { setError("Use Google button for this account."); return; }
    setError("");
    try {
      const auth = await getAuth();
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, acc.email, acc.password);
    } catch { setError("Quick login failed. Login manually."); }
  };

  const handleLogout = async () => {
    try {
      const auth = await getAuth();
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch {}
    setUser(null); setAnalysis(null); setUsageInfo(null);
  };

  // ── AD ───────────────────────────────────────────────────────────────────
  const showAd2 = () => new Promise(resolve => {
    setAdIdx(Math.floor(Math.random()*ADS.length));
    setAdTimer(5); setShowAd(true);
    let t = 5;
    adRef.current = setInterval(() => { t--; setAdTimer(t); if (t<=0) clearInterval(adRef.current); }, 1000);
    window._adResolve = resolve;
  });

  const closeAd = () => {
    if (adTimer > 0) return;
    clearInterval(adRef.current); setShowAd(false);
    if (window._adResolve) { window._adResolve(); window._adResolve = null; }
  };

  // ── ANALYSIS ─────────────────────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!productForm.name || !productForm.category || !productForm.platform) { setError("Fill all fields"); return; }
    setError("");
    const lim = checkLimit(user);
    if (!lim.ok) { setError(lim.msg); return; }
    const plan = store.get("plan_"+user?.email) || "free";
    if (plan === "free") await showAd2();
    setLoading(true); setAnalysis(null); setSelPlatform(null); setPlatData({});
    try {
      const res = await fetch("/api/analyze", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(productForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Failed");
      addUsage(user); setUsageInfo(calcUsage(user)); setAnalysis(data);
      // First analysis unlocks platform section once
      if (!store.get("first_analysis_"+user?.email)) {
        store.set("first_analysis_"+user?.email, true);
        setFirstAnalysisDone(true);
      } else {
        setFirstAnalysisDone(false);
      }
      showToast("✅ Analysis complete!");
    } catch(e) { setError("Analysis failed: "+e.message); }
    setLoading(false);
  };

  const fetchPlatform = async (pid) => {
    const plan = store.get("plan_"+user?.email) || "free";
    const isFirstFree = firstAnalysisDone && !store.get("first_plat_used_"+user?.email);
    if (plan !== "premium" && !isFirstFree) { setShowPremium(true); return; }
    // Mark first free platform used
    if (isFirstFree && plan !== "premium") {
      store.set("first_plat_used_"+user?.email, true);
      setFirstAnalysisDone(false);
    }
    setSelPlatform(pid);
    if (platData[pid]) return;
    setPlatLoading(true);
    try {
      const pl = PLATFORMS.find(p=>p.id===pid);
      const res = await fetch("/api/analyze", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name:productForm.name, category:productForm.category, platform:pl.name, mode:"ads_platform" }) });
      const data = await res.json();
      setPlatData(prev=>({...prev,[pid]:data}));
    } catch { showToast("Failed"); }
    setPlatLoading(false);
  };

  const activatePremium = async () => {
    setPaymentStep("processing");
    await new Promise(r=>setTimeout(r,2000));
    const expiry = new Date(Date.now()+PREMIUM_DAYS*86400000).toISOString();
    store.set("prem_"+user?.email, { expiry, used:0 });
    store.set("plan_"+user?.email, "premium");
    const u = {...user, plan:"premium"};
    setUser(u); setUsageInfo(calcUsage(u));
    setPaymentStep("success"); showToast("🎉 Premium activated!");
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3500); };

  const curPlan = user ? (store.get("plan_"+user?.email)||"free") : "free";
  const adW = ((5-adTimer)/5)*100;
  const STEPS = ["Product data received","Analyzing market trends","Generating AI insights","Creating viral hooks"];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#e8ecf1;font-family:'Inter',sans-serif;color:#1a1a2e;}
    @keyframes spin{to{transform:rotate(360deg);}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}
    .fade-in{animation:fadeIn 0.5s ease;}
    .scale-in{animation:scaleIn 0.3s ease;}
    .spinner{width:36px;height:36px;border:3px solid rgba(99,102,241,0.2);border-top:3px solid #6366f1;border-radius:50%;animation:spin 0.8s linear infinite;}
    .toast{position:fixed;top:24px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 32px rgba(16,185,129,0.4);animation:fadeIn 0.3s ease;white-space:nowrap;}
    .neu-page{min-height:100vh;background:#e8ecf1;display:flex;align-items:center;justify-content:center;padding:20px;}
    .neu-card{background:#e8ecf1;border-radius:30px;padding:40px 32px;width:100%;max-width:420px;box-shadow:8px 8px 20px #c8cdd5,-8px -8px 20px #fff;}
    .neu-avt{width:88px;height:88px;background:#e8ecf1;border-radius:50%;margin:0 auto 22px;display:flex;align-items:center;justify-content:center;box-shadow:6px 6px 14px #c8cdd5,-6px -6px 14px #fff;}
    .neu-title{font-size:24px;font-weight:800;text-align:center;color:#1a1a2e;margin-bottom:6px;}
    .neu-sub{color:#8b8fa8;font-size:14px;text-align:center;margin-bottom:26px;}
    .tabs{display:flex;background:#e8ecf1;border-radius:14px;padding:4px;margin-bottom:20px;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #fff;}
    .tab{flex:1;padding:10px 0;background:none;border:none;color:#8b8fa8;font-size:14px;font-weight:600;cursor:pointer;border-radius:11px;font-family:'Inter',sans-serif;transition:all 0.25s;}
    .tab.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:4px 4px 10px rgba(99,102,241,0.4);}
    .inp-wrap{position:relative;margin-bottom:14px;}
    .inp-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;}
    .inp{width:100%;background:#e8ecf1;border:none;border-radius:14px;padding:14px 16px 14px 44px;color:#1a1a2e;font-size:14px;font-family:'Inter',sans-serif;outline:none;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #fff;}
    .inp:focus{box-shadow:inset 5px 5px 12px #bec3cb,inset -5px -5px 12px #f2f6fc;}
    .inp::placeholder{color:#adb5bd;}
    .eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:18px;}
    .err{color:#e53e3e;font-size:12px;margin:-6px 0 10px 4px;}
    .neu-btn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:14px;padding:15px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:4px 4px 12px rgba(99,102,241,0.5);transition:all 0.2s;margin-bottom:14px;}
    .neu-btn:hover{transform:translateY(-1px);}
    .g-btn{width:100%;background:#e8ecf1;border:none;border-radius:14px;padding:13px 0;color:#4a5568;font-weight:700;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font-family:'Inter',sans-serif;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #fff;transition:all 0.2s;margin-bottom:14px;}
    .g-btn:hover{transform:translateY(-1px);}
    .g-btn:disabled{opacity:0.6;cursor:not-allowed;}
    .div{display:flex;align-items:center;gap:12px;margin:14px 0;}
    .div-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,#c8cdd5,transparent);}
    .div-txt{color:#adb5bd;font-size:11px;font-weight:600;white-space:nowrap;}
    .rem{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
    .rem input{width:18px;height:18px;accent-color:#6366f1;}
    .rem label{color:#8b8fa8;font-size:13px;flex:1;}
    .forgot{color:#6366f1;font-size:13px;font-weight:600;cursor:pointer;}
    .sw{color:#8b8fa8;font-size:13px;text-align:center;margin-top:14px;}
    .sw-lnk{color:#6366f1;cursor:pointer;font-weight:700;}
    .saved{margin-bottom:18px;}
    .saved-lbl{color:#8b8fa8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;}
    .saved-item{display:flex;align-items:center;gap:12px;background:#e8ecf1;border:none;border-radius:16px;padding:11px 14px;margin-bottom:8px;cursor:pointer;width:100%;text-align:left;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #fff;transition:all 0.2s;}
    .saved-item:hover{transform:translateX(2px);}
    .saved-avt{width:38px;height:38px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;color:#fff;flex-shrink:0;overflow:hidden;}
    .saved-avt img{width:100%;height:100%;object-fit:cover;}
    .saved-info{flex:1;min-width:0;}
    .saved-name{font-size:13px;font-weight:700;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .saved-mail{font-size:11px;color:#8b8fa8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .saved-dots{font-size:11px;color:#adb5bd;letter-spacing:2px;}
    .dashboard{min-height:100vh;background:#020817;color:#f8fafc;}
    .navbar{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(2,8,23,0.92);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100;}
    .nav-logo{font-weight:900;font-size:18px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .usage-pill{background:rgba(15,23,42,0.9);border:1px solid #1e293b;border-radius:100px;padding:7px 16px;font-size:13px;display:flex;align-items:center;gap:8px;}
    .nav-right{display:flex;align-items:center;gap:8px;}
    .upg-btn{background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:100px;padding:8px 18px;color:#fff;font-weight:800;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif;}
    .avt{width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;overflow:hidden;}
    .avt img{width:100%;height:100%;object-fit:cover;}
    .exit-btn{background:none;border:1px solid #1e293b;border-radius:8px;padding:7px 12px;color:#475569;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif;}
    .dash{max-width:880px;margin:0 auto;padding:44px 20px 100px;}
    .hero{text-align:center;margin-bottom:48px;}
    .badge{display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:100px;padding:6px 18px;font-size:12px;color:#a5b4fc;font-weight:700;margin-bottom:18px;}
    .h1{font-weight:900;font-size:clamp(26px,5vw,50px);line-height:1.1;margin-bottom:14px;letter-spacing:-1px;}
    .grad{background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .h-sub{color:#64748b;font-size:15px;max-width:520px;margin:0 auto;line-height:1.65;}
    .icard{background:rgba(15,23,42,0.8);border:1px solid rgba(99,102,241,0.15);border-radius:24px;padding:32px 28px;margin-bottom:40px;}
    .ctitle{font-weight:800;font-size:18px;margin-bottom:22px;color:#f8fafc;}
    .igrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:18px;}
    .igrp{display:flex;flex-direction:column;}
    .ilbl{font-size:11px;color:#64748b;margin-bottom:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;}
    .di{width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:13px 16px;color:#f8fafc;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:all 0.2s;}
    .di:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15);}
    .sel{cursor:pointer;}
    .ebanner{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:12px;padding:12px 16px;color:#ef4444;font-size:13px;margin-bottom:16px;}
    .ulink{color:#f59e0b;cursor:pointer;font-weight:700;}
    .abtn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border:none;border-radius:16px;padding:17px 0;color:#fff;font-weight:800;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 32px rgba(99,102,241,0.4);transition:all 0.2s;font-family:'Inter',sans-serif;}
    .abtn:hover{transform:translateY(-2px);}
    .anote{font-size:12px;opacity:0.65;font-weight:400;}
    .fnote{font-size:12px;color:#475569;text-align:center;margin-top:12px;}
    .loverlay{position:fixed;inset:0;background:rgba(2,8,23,0.97);display:flex;align-items:center;justify-content:center;z-index:7000;}
    .lcard{background:rgba(15,23,42,0.95);border:1px solid rgba(99,102,241,0.25);border-radius:24px;padding:48px 40px;text-align:center;max-width:380px;width:90%;}
    .lbrain{font-size:60px;margin-bottom:20px;animation:pulse 1.2s ease infinite;}
    .lt{font-weight:900;font-size:22px;margin-bottom:8px;color:#f8fafc;}
    .ls-sub{color:#64748b;font-size:14px;margin-bottom:28px;}
    .lsteps{display:flex;flex-direction:column;gap:8px;text-align:left;}
    .lstep{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;border:1px solid transparent;font-size:13px;color:#475569;transition:all 0.4s;}
    .lstep.done{color:#10b981;border-color:rgba(16,185,129,0.25);background:rgba(16,185,129,0.06);}
    .lstep.act{color:#a5b4fc;border-color:rgba(99,102,241,0.3);background:rgba(99,102,241,0.08);}
    .rtitle{font-weight:900;font-size:22px;margin-bottom:24px;color:#f8fafc;}
    .mrow{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;margin-bottom:18px;}
    .mcard{background:rgba(15,23,42,0.85);border:1px solid #1e293b;border-radius:18px;padding:20px 16px;position:relative;overflow:hidden;}
    .mcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6366f1,#a855f7);}
    .mlbl{font-size:11px;color:#64748b;margin-bottom:8px;font-weight:600;text-transform:uppercase;}
    .mval{font-weight:900;font-size:20px;}
    .tcol{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:12px;}
    .gcard{background:rgba(15,23,42,0.75);border:1px solid #1e293b;border-radius:18px;padding:22px 20px;margin-bottom:12px;}
    .gct{font-weight:800;font-size:15px;margin-bottom:13px;color:#e2e8f0;}
    .gctx{color:#94a3b8;line-height:1.75;font-size:14px;}
    .hitem{display:flex;align-items:flex-start;gap:12px;color:#cbd5e1;font-size:14px;margin-bottom:12px;}
    .hnum{min-width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;}
    .kwg{display:flex;flex-wrap:wrap;gap:7px;}
    .kwc{background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.22);color:#a5b4fc;border-radius:100px;padding:5px 13px;font-size:13px;}
    .psec{background:rgba(15,23,42,0.8);border:1px solid rgba(245,158,11,0.2);border-radius:22px;padding:28px 22px;margin-bottom:12px;}
    .psh{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
    .pst{font-weight:800;font-size:16px;color:#e2e8f0;}
    .psb-badge{background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:3px 12px;font-size:11px;font-weight:800;color:#fff;}
    .ps-sub{color:#64748b;font-size:13px;margin-bottom:20px;line-height:1.5;}
    .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
    .pbtn{background:rgba(2,8,23,0.7);border:1.5px solid #1e293b;border-radius:14px;padding:14px 8px 12px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;}
    .pbtn:hover{border-color:rgba(99,102,241,0.5);transform:translateY(-2px);}
    .pbtn.on{border-color:#6366f1;background:rgba(99,102,241,0.1);}
    .plogo{width:30px;height:30px;margin:0 auto 7px;}
    .pname{font-size:10px;font-weight:700;color:#94a3b8;}
    .plk{position:absolute;top:5px;right:6px;font-size:11px;}
    .pdet{background:rgba(2,8,23,0.7);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:22px 18px;margin-top:14px;animation:fadeIn 0.4s ease;}
    .pdb{margin-bottom:18px;}
    .pdt{font-size:11px;font-weight:800;color:#a5b4fc;margin-bottom:8px;text-transform:uppercase;}
    .pdtx{color:#94a3b8;font-size:13px;line-height:1.75;}
    .pdsteps{display:flex;flex-direction:column;gap:6px;}
    .pdstep{display:flex;align-items:flex-start;gap:10px;background:rgba(99,102,241,0.05);border:1px solid rgba(99,102,241,0.12);border-radius:9px;padding:8px 12px;color:#cbd5e1;font-size:13px;}
    .pdsn{min-width:20px;height:20px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex-shrink:0;}
    .pdch{display:flex;flex-wrap:wrap;gap:6px;}
    .pdchip{background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);color:#a5b4fc;border-radius:8px;padding:4px 10px;font-size:12px;}
    .lkbox{text-align:center;padding:20px;}
    .lkemoji{font-size:44px;margin-bottom:12px;}
    .lktitle{font-weight:800;font-size:17px;margin-bottom:6px;color:#f8fafc;}
    .lksub{color:#64748b;font-size:13px;margin-bottom:18px;line-height:1.6;}
    .unlkbtn{background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:12px;padding:13px 28px;color:#fff;font-weight:800;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;}
    .ad-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:9000;}
    .ad-box{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid #1e293b;border-radius:24px;padding:40px 32px;max-width:400px;width:92%;text-align:center;position:relative;animation:scaleIn 0.3s ease;}
    .ad-top{position:absolute;top:-13px;left:50%;transform:translateX(-50%);padding:5px 18px;border-radius:100px;font-size:10px;font-weight:800;color:#fff;letter-spacing:1.5px;}
    .ad-h{font-weight:900;font-size:22px;margin:14px 0 8px;color:#f8fafc;}
    .ad-s{color:#94a3b8;margin-bottom:22px;font-size:14px;}
    .ad-cta{border:none;border-radius:100px;padding:12px 30px;color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:'Inter',sans-serif;}
    .ad-prog{height:3px;background:#1e293b;border-radius:100px;margin:18px 0 0;overflow:hidden;}
    .ad-fill{height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width 1s linear;}
    .ad-close{display:block;margin:12px auto 0;background:none;border:1px solid #2d3748;border-radius:100px;padding:8px 22px;color:#94a3b8;cursor:pointer;font-size:13px;font-family:'Inter',sans-serif;}
    .ad-close.off{opacity:0.3;cursor:not-allowed;}
    .modal-ov{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:8000;backdrop-filter:blur(8px);}
    .pmodal{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid rgba(245,158,11,0.25);border-radius:28px;padding:40px 32px;max-width:460px;width:92%;text-align:center;animation:scaleIn 0.3s ease;}
    .pbadge{display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:6px 20px;font-size:12px;font-weight:800;color:#fff;margin-bottom:14px;}
    .ptitle{font-weight:900;font-size:26px;margin-bottom:6px;color:#f8fafc;}
    .pprice{font-weight:900;font-size:42px;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px;}
    .pprice span{font-size:15px;-webkit-text-fill-color:#94a3b8;}
    .phigh{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:12px 16px;margin-bottom:20px;color:#10b981;font-size:13px;font-weight:600;line-height:1.6;}
    .pflist{display:flex;flex-direction:column;gap:8px;margin-bottom:24px;text-align:left;}
    .pfi{color:#cbd5e1;font-size:14px;padding:9px 14px;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid rgba(255,255,255,0.05);}
    .pbtn2{width:100%;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:14px;padding:15px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;margin-bottom:10px;font-family:'Inter',sans-serif;}
    .mcancel{background:none;border:none;color:#475569;font-family:'Inter',sans-serif;font-size:14px;cursor:pointer;padding:8px 0;width:100%;}
    .paybox{background:#020817;border:1px solid #1e293b;border-radius:14px;padding:16px 18px;margin-bottom:14px;text-align:left;}
    .payrow{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#94a3b8;font-size:14px;}
    .payrow:last-child{border-bottom:none;}
    .paynote{color:#475569;font-size:12px;margin-bottom:14px;line-height:1.6;}
    .sfeat{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:14px;padding:16px;margin:14px 0 22px;text-align:left;}
    .sfi{color:#10b981;font-size:13px;padding:4px 0;font-weight:500;}
    footer{text-align:center;padding:22px;color:#334155;font-size:12px;border-top:1px solid rgba(255,255,255,0.03);}
    @media(max-width:600px){
      .navbar{padding:12px 14px;} .icard{padding:22px 16px;} .dash{padding:28px 14px 60px;}
      .usage-pill{display:none;} .pgrid{grid-template-columns:repeat(4,1fr);gap:6px;}
      .pbtn{padding:10px 4px 8px;} .pname{font-size:9px;} .neu-card{padding:32px 22px;}
    }
  `;

  if (screen === "loading") return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"#e8ecf1",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <div className="spinner"/>
        <p style={{color:"#8b8fa8",marginTop:16,fontSize:14,fontWeight:500}}>Loading YesYouPro...</p>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      {toast && <div className="toast">{toast}</div>}

      {/* LOADING */}
      {loading && (
        <div className="loverlay">
          <div className="lcard scale-in">
            <div className="lbrain">🧠</div>
            <h2 className="lt">Analyzing Product</h2>
            <p className="ls-sub">YYP AI is processing...</p>
            <div className="lsteps">
              {STEPS.map((s,i)=>(
                <div key={i} className={"lstep"+(loadingStep>i?" done":loadingStep===i?" act":"")}>
                  <span>{loadingStep>i?"✅":loadingStep===i?"⚙️":"○"}</span><span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AD */}
      {showAd && (
        <div className="ad-overlay">
          <div className="ad-box">
            <div className="ad-top" style={{background:ADS[adIdx].color}}>ADVERTISEMENT</div>
            <div style={{fontSize:50,marginTop:10}}>📢</div>
            <h2 className="ad-h">{ADS[adIdx].headline}</h2>
            <p className="ad-s">{ADS[adIdx].sub}</p>
            <button className="ad-cta" style={{background:ADS[adIdx].color}}>{ADS[adIdx].cta}</button>
            <div className="ad-prog"><div className="ad-fill" style={{width:adW+"%"}}/></div>
            <button onClick={closeAd} className={"ad-close"+(adTimer>0?" off":"")}>
              {adTimer>0?"⏳ Skip in "+adTimer+"s":"✕ Close & Continue"}
            </button>
          </div>
        </div>
      )}

      {/* PREMIUM MODAL */}
      {showPremium && (
        <div className="modal-ov" onClick={()=>{if(paymentStep==="form"){setShowPremium(false);setShowPayment(false);setPaymentStep("form");}}}>
          <div className="pmodal" onClick={e=>e.stopPropagation()}>
            {!showPayment ? (
              <>
                <div className="pbadge">💎 PREMIUM</div>
                <h2 className="ptitle">Unlock Everything</h2>
                <div className="pprice">₹249 <span>/ 7 days</span></div>
                <div className="phigh">🎉 After purchase:<br/>✅ <b>Zero ads</b><br/>✅ <b>30 analyses</b> in 7 days<br/>✅ <b>All 8 platforms</b> unlocked</div>
                <div className="pflist">
                  {["📺 Ads on 8+ platforms","🎬 Video Publishing Guides","🔑 Keywords & scripts","💰 Budget tips","🚫 No ads ever"].map(f=><div key={f} className="pfi">{f}</div>)}
                </div>
                <button className="pbtn2" onClick={()=>setShowPayment(true)}>🔓 Unlock — ₹249</button>
                <button className="mcancel" onClick={()=>setShowPremium(false)}>Maybe later</button>
              </>
            ) : paymentStep==="form" ? (
              <>
                <h2 className="ptitle">Complete Payment</h2>
                <div className="paybox">
                  <div className="payrow"><span>Plan</span><span>Premium 7-day</span></div>
                  <div className="payrow"><span>Amount</span><span style={{color:"#f59e0b",fontWeight:700}}>₹249</span></div>
                  <div className="payrow"><span>Analyses</span><span style={{color:"#10b981"}}>30</span></div>
                  <div className="payrow"><span>Ads</span><span style={{color:"#10b981"}}>Zero</span></div>
                </div>
                <p className="paynote">⚠️ Add Razorpay for real payments. Demo simulates success.</p>
                <button className="pbtn2" onClick={activatePremium}>💳 Pay ₹249 (Demo)</button>
                <button className="mcancel" onClick={()=>setShowPayment(false)}>← Back</button>
              </>
            ) : paymentStep==="processing" ? (
              <div style={{textAlign:"center",padding:48}}><div className="spinner" style={{margin:"0 auto"}}/><p style={{color:"#94a3b8",marginTop:20}}>Processing...</p></div>
            ) : (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:64,marginBottom:12}}>🎉</div>
                <h2 className="ptitle">Premium Activated!</h2>
                <div className="sfeat">
                  <div className="sfi">✅ Zero ads</div>
                  <div className="sfi">✅ 30 analyses (7 days)</div>
                  <div className="sfi">✅ All 8 platforms unlocked</div>
                </div>
                <button className="pbtn2" onClick={()=>{setShowPremium(false);setShowPayment(false);setPaymentStep("form");}}>🚀 Start Analyzing →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTH */}
      {screen==="auth" && (
        <div className="neu-page">
          <div className="neu-card">
            <div className="neu-avt">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8b8fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="44" height="44">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className="neu-title">{authMode==="login"?"Welcome back":"Create account"}</h1>
            <p className="neu-sub">{authMode==="login"?"Sign in to continue":"Join YesYouPro for free"}</p>

            {authMode==="login" && savedAccounts.length>0 && (
              <div className="saved">
                <div className="saved-lbl">Quick Login</div>
                {savedAccounts.map(a=>(
                  <button key={a.email} className="saved-item" onClick={()=>quickLogin(a)}>
                    <div className="saved-avt">{a.photo?<img src={a.photo} alt=""/>:a.name?.[0]?.toUpperCase()||"U"}</div>
                    <div className="saved-info">
                      <div className="saved-name">{a.name}</div>
                      <div className="saved-mail">{a.email}</div>
                      <div className="saved-dots">{a.password?"●".repeat(Math.min(a.password.length,8)):"Google Account"}</div>
                    </div>
                    <div style={{color:"#6366f1",fontSize:20,fontWeight:700}}>→</div>
                  </button>
                ))}
                <div className="div"><div className="div-line"/><div className="div-txt">OR SIGN IN MANUALLY</div><div className="div-line"/></div>
              </div>
            )}

            <div className="tabs">
              {["login","signup"].map(m=>(
                <button key={m} className={"tab"+(authMode===m?" on":"")} onClick={()=>{setAuthMode(m);setError("");}}>
                  {m==="login"?"Login":"Sign Up"}
                </button>
              ))}
            </div>

            <button className="g-btn" onClick={handleGoogle} disabled={googleLoading}>
              {googleLoading?<div className="spinner" style={{width:18,height:18,border:"2px solid rgba(99,102,241,0.2)",borderTop:"2px solid #6366f1"}}/>:(
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {googleLoading?"Signing in...":"Continue with Google"}
            </button>

            <div className="div"><div className="div-line"/><div className="div-txt">OR CONTINUE WITH EMAIL</div><div className="div-line"/></div>

            {authMode==="signup"&&<div className="inp-wrap"><span className="inp-ico">👤</span><input className="inp" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>}
            <div className="inp-wrap"><span className="inp-ico">✉️</span><input className="inp" placeholder="Email address" type="email" autoComplete="off" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div className="inp-wrap">
              <span className="inp-ico">🔒</span>
              <input className="inp" placeholder="Password" type={showPass?"text":"password"} autoComplete="new-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
              <button className="eye" onClick={()=>setShowPass(!showPass)}>{showPass?"🙈":"👁️"}</button>
            </div>
            {error&&<p className="err">⚠️ {error}</p>}
            {authMode==="login"&&<div className="rem"><input type="checkbox" id="rem" defaultChecked/><label htmlFor="rem">Remember me</label><span className="forgot">Forgot password?</span></div>}
            <button className="neu-btn" onClick={handleAuth}>{authMode==="login"?"Sign In →":"Create Account →"}</button>
            <p className="sw">{authMode==="login"?"Don't have an account? ":"Already have an account? "}<span className="sw-lnk" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setError("");setForm({email:"",password:"",name:""});}}>{authMode==="login"?"Sign Up Free":"Sign In"}</span></p>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {screen==="dashboard"&&(
        <div className="dashboard">
          <nav className="navbar">
            <div className="nav-logo">🧠 YesYouPro</div>
            {usageInfo&&<div className="usage-pill">
              <span style={{color:curPlan==="premium"?"#f59e0b":"#94a3b8",fontWeight:700}}>{curPlan==="premium"?"💎 Premium":"🆓 Free"}</span>
              <span style={{color:"#334155"}}>|</span>
              <span style={{color:usageInfo.remaining>0?"#10b981":"#ef4444",fontWeight:700}}>{usageInfo.remaining} left</span>
            </div>}
            <div className="nav-right">
              {curPlan==="free"&&<button className="upg-btn" onClick={()=>setShowPremium(true)}>💎 Upgrade</button>}
              <div className="avt">{user?.photo?<img src={user.photo} alt=""/>:user?.name?.[0]?.toUpperCase()||"U"}</div>
              <button className="exit-btn" onClick={handleLogout}>Exit</button>
            </div>
          </nav>

          <div className="dash">
            <div className="hero">
              <div className="badge">✨ YYP AI — Product Intelligence</div>
              <h1 className="h1">Product Intelligence<br/><span className="grad">Powered by YesYouPro</span></h1>
              <p className="h-sub">Enter any product and get deep market analysis, viral hooks, keywords and complete platform strategies.</p>
            </div>

            <div className="icard">
              <h3 className="ctitle">🎯 Analyze a Product</h3>
              <div className="igrid">
                <div className="igrp"><label className="ilbl">Product Name *</label><input className="di" placeholder="e.g. Portable Blender" value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})}/></div>
                <div className="igrp"><label className="ilbl">Category *</label>
                  <select className="di sel" value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}>
                    <option value="">Select category</option>
                    {["Electronics","Beauty & Skincare","Home & Kitchen","Fitness","Fashion","Pet Supplies","Toys & Games","Health & Wellness","Outdoor & Sports"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="igrp"><label className="ilbl">Platform *</label>
                  <select className="di sel" value={productForm.platform} onChange={e=>setProductForm({...productForm,platform:e.target.value})}>
                    <option value="">Select platform</option>
                    {["Amazon","Shopify","Meesho","Flipkart","Instagram","TikTok Shop","Etsy","Facebook Marketplace","WooCommerce"].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {error&&<div className="ebanner">{error}{error.includes("Upgrade")&&<span className="ulink" onClick={()=>setShowPremium(true)}> → Upgrade Now</span>}</div>}
              <button className="abtn" onClick={runAnalysis} disabled={loading}>
                🚀 Get AI Analysis {curPlan==="free"&&<span className="anote">· Ad plays first</span>}
              </button>
              {curPlan==="free"&&<p className="fnote">Free: {usageInfo?.remaining??FREE_DAILY_LIMIT}/{FREE_DAILY_LIMIT} today · <span className="ulink" onClick={()=>setShowPremium(true)}>Upgrade — no ads + 30 analyses →</span></p>}
            </div>

            {analysis&&(
              <div className="fade-in">
                <h2 className="rtitle">📊 Results — <span className="grad">{productForm.name}</span></h2>
                <div className="mrow">
                  {[{l:"🔥 Viral Score",v:analysis.viral_score,c:"#f59e0b"},{l:"📈 Demand",v:analysis.demand_level,c:"#10b981"},{l:"⚔️ Competition",v:analysis.competition_level,c:"#ef4444"},{l:"💰 Price Range",v:analysis.price_range,c:"#6366f1"}].map(m=>(
                    <div key={m.l} className="mcard"><div className="mlbl">{m.l}</div><div className="mval" style={{color:m.c}}>{m.v}</div></div>
                  ))}
                </div>
                <div className="tcol">
                  <div className="gcard"><h4 className="gct">📝 Description</h4><p className="gctx">{analysis.description}</p></div>
                  <div className="gcard"><h4 className="gct">🎯 Target Audience</h4><p className="gctx">{analysis.target_audience}</p></div>
                </div>
                <div className="gcard"><h4 className="gct">🪝 Viral Hooks</h4>{analysis.hooks?.map((h,i)=><div key={i} className="hitem"><span className="hnum">{i+1}</span><span>{h}</span></div>)}</div>
                <div className="gcard"><h4 className="gct">🔑 Keywords</h4><div className="kwg">{analysis.keywords?.map((k,i)=><div key={i} className="kwc">{k}</div>)}</div></div>
                <div className="psec">
                  <div className="psh"><div className="pst">📺 Run Ads + Publish Content</div>{curPlan==="free"&&<div className="psb-badge">🔒 PREMIUM</div>}</div>
                  <p className="ps-sub">Complete ad strategy + video publishing guide for every platform</p>
                  <div className="pgrid">
                    {PLATFORMS.map(p=>(
                      <div key={p.id} className={"pbtn"+(selPlatform===p.id?" on":"")} onClick={()=>fetchPlatform(p.id)} style={{borderColor:selPlatform===p.id?p.color:undefined}}>
                        {curPlan==="free"&&!firstAnalysisDone&&<div className="plk">🔒</div>}
                        {curPlan==="free"&&firstAnalysisDone&&<div className="plk" style={{color:"#10b981"}}>🎁</div>}
                        <div className="plogo" dangerouslySetInnerHTML={{__html:p.logo}}/>
                        <div className="pname">{p.name}</div>
                      </div>
                    ))}
                  </div>
                  {selPlatform && curPlan==="premium" && (
                    <div className="pdet">
                      {platLoading?<div style={{textAlign:"center",padding:24}}><div className="spinner" style={{margin:"0 auto 10px"}}/><p style={{color:"#64748b",fontSize:13}}>Generating...</p></div>
                      :platData[selPlatform]?(()=>{const d=platData[selPlatform];return(<>
                        {d.account_setup&&<div className="pdb"><div className="pdt">🏗️ Account Setup</div><div className="pdsteps">{d.account_setup.split("\n").filter(Boolean).map((s,i)=><div key={i} className="pdstep"><span className="pdsn">{i+1}</span><span>{s.replace(/^\d+[\.\)]\s*/,"")}</span></div>)}</div></div>}
                        {d.targeting&&<div className="pdb"><div className="pdt">🎯 Targeting</div><div className="pdtx">{d.targeting}</div></div>}
                        {d.ad_keywords?.length>0&&<div className="pdb"><div className="pdt">🔑 Keywords</div><div className="pdch">{d.ad_keywords.map((k,i)=><div key={i} className="pdchip">{k}</div>)}</div></div>}
                        {d.script&&<div className="pdb"><div className="pdt">📝 Script</div><div className="pdtx" style={{background:"rgba(99,102,241,0.06)",padding:14,borderRadius:10,border:"1px solid rgba(99,102,241,0.15)",lineHeight:1.75}}>{d.script}</div></div>}
                        {d.video_steps&&<div className="pdb"><div className="pdt">🎬 Video Publishing</div><div className="pdsteps">{d.video_steps.split("\n").filter(Boolean).map((s,i)=><div key={i} className="pdstep"><span className="pdsn">{i+1}</span><span>{s.replace(/^\d+[\.\)]\s*/,"")}</span></div>)}</div></div>}
                        {d.title&&<div className="pdb"><div className="pdt">📌 Best Title</div><div className="pdtx" style={{fontWeight:700,color:"#e2e8f0",fontSize:15}}>{d.title}</div></div>}
                        {d.budget&&<div className="pdb"><div className="pdt">💰 Budget</div><div className="pdtx">{d.budget}</div></div>}
                      </>);})():null}
                    </div>
                  )}
                  {curPlan==="free"&&!firstAnalysisDone&&(
                    <div className="lkbox">
                      <div className="lkemoji">🔒</div>
                      <div className="lktitle">Premium Feature</div>
                      <div className="lksub">You got 1 free platform preview! Upgrade to unlock all 8 platforms with complete ad strategies & video guides.</div>
                      <button className="unlkbtn" onClick={()=>setShowPremium(true)}>💎 Unlock All — ₹249</button>
                    </div>
                  )}
                  {curPlan==="free"&&firstAnalysisDone&&(
                    <div className="lkbox" style={{background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:14,padding:20}}>
                      <div style={{fontSize:36,marginBottom:8}}>🎁</div>
                      <div className="lktitle" style={{color:"#10b981"}}>1 Free Preview Available!</div>
                      <div className="lksub">Tap any platform below to see a free preview. Upgrade for all 8 platforms.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <footer>🧠 Product Analyzer · Built with AI · © YesYouPro</footer>
        </div>
      )}
    </>
  );
}
