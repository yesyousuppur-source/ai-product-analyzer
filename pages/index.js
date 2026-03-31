import { useState, useEffect, useRef } from "react";

// Firebase lazy init - only on client side
const firebaseConfig = {
  apiKey: "AIzaSyDww7gi4QRRNm4t3PFQ9ny8a2WLV-V9OFU",
  authDomain: "mood2meet-85866.firebaseapp.com",
  projectId: "mood2meet-85866",
  storageBucket: "mood2meet-85866.firebasestorage.app",
  messagingSenderId: "455406578867",
  appId: "1:455406578867:web:fc5a2b6a00af996bc114c6"
};

let auth = null;
let googleProvider = null;

const getFirebaseAuth = async () => {
  if (auth) return auth;
  const { initializeApp, getApps } = await import("firebase/app");
  const { getAuth, GoogleAuthProvider } = await import("firebase/auth");
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  return auth;
};

const FREE_DAILY_LIMIT = 3;
const PREMIUM_TOTAL_LIMIT = 30;
const PREMIUM_DAYS = 7;

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
  get: (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

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
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformData, setPlatformData] = useState({});
  const [platformLoading, setPlatformLoading] = useState(false);
  const adIntervalRef = useRef(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const accounts = store.get("apa_saved_accounts") || [];
    setSavedAccounts(accounts);

    getFirebaseAuth().then((authInstance) => {
    const { onAuthStateChanged } = require("firebase/auth");
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          plan: store.get("apa_plan_" + firebaseUser.email) || "free",
          photoURL: firebaseUser.photoURL || null,
        };
        setUser(u);
        setUsageInfo(getUsageInfo(u));
        setScreen("dashboard");
      } else {
        setScreen("auth");
      }
    });
    });
  }, []);

  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      [1,2,3].forEach((s,i) => setTimeout(() => setLoadingStep(s), (i+1)*1200));
    }
  }, [loading]);

  const getTodayKey = () => new Date().toISOString().split("T")[0];

  const getUsageInfo = (u) => {
    const plan = store.get("apa_plan_" + u?.email) || u?.plan || "free";
    if (plan === "premium") {
      const pd = store.get("apa_premium_" + u?.email);
      if (!pd) return { plan:"free", remaining:FREE_DAILY_LIMIT, total:FREE_DAILY_LIMIT };
      const expired = new Date() > new Date(pd.expiry);
      if (expired) return { plan:"free", remaining:FREE_DAILY_LIMIT, total:FREE_DAILY_LIMIT, expired:true };
      const used = pd.used || 0;
      return { plan, remaining:Math.max(0, PREMIUM_TOTAL_LIMIT-used), total:PREMIUM_TOTAL_LIMIT, used, expiry:pd.expiry };
    }
    const used = store.get("apa_usage_"+(u?.email)+"_"+getTodayKey()) || 0;
    return { plan, remaining:Math.max(0, FREE_DAILY_LIMIT-used), total:FREE_DAILY_LIMIT, used };
  };

  const incrementUsage = (u) => {
    const plan = store.get("apa_plan_"+u?.email) || "free";
    if (plan === "premium") {
      const pd = store.get("apa_premium_"+u?.email);
      if (pd) store.set("apa_premium_"+u?.email, {...pd, used:(pd.used||0)+1});
    } else {
      const key = "apa_usage_"+u?.email+"_"+getTodayKey();
      store.set(key, (store.get(key)||0)+1);
    }
  };

  const checkLimit = (u) => {
    const info = getUsageInfo(u);
    if (info.expired) return { allowed:false, reason:"Premium expired! Please recharge." };
    if (info.remaining <= 0) return { allowed:false, reason:info.plan==="free"?"Daily limit reached (3/day). Upgrade to Premium!":"Premium limit reached. Please recharge." };
    return { allowed:true };
  };

  const saveAccount = (email, name, password, photoURL) => {
    const accounts = store.get("apa_saved_accounts") || [];
    const idx = accounts.findIndex(a => a.email === email);
    const acc = { email, name, password: password||"", photoURL: photoURL||null };
    if (idx >= 0) accounts[idx] = acc; else accounts.push(acc);
    store.set("apa_saved_accounts", accounts);
    setSavedAccounts([...accounts]);
  };

  // Google Sign In
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const authInstance = await getFirebaseAuth();
      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(authInstance, googleProvider);
      const fbUser = result.user;
      saveAccount(fbUser.email, fbUser.displayName, "", fbUser.photoURL);
      showToast("✅ Signed in with Google!");
    } catch (e) {
      if (e.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (e.code === "auth/unauthorized-domain") {
        setError("Domain not authorized. Add your domain in Firebase Console → Authentication → Settings → Authorized domains.");
      } else {
        setError("Google sign-in failed: " + e.message);
      }
    }
    setGoogleLoading(false);
  };

  // Email/Password Auth
  const handleAuth = async () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    if (authMode === "signup" && !form.name) { setError("Name is required"); return; }
    setError("");
    try {
      if (authMode === "signup") {
        const authInstance = await getFirebaseAuth();
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
        const result = await createUserWithEmailAndPassword(authInstance, form.email, form.password);
        await updateProfile(result.user, { displayName: form.name });
        saveAccount(form.email, form.name, form.password, null);
        showToast("✅ Account created!");
      } else {
        const authInstance2 = await getFirebaseAuth();
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(authInstance2, form.email, form.password);
        saveAccount(form.email, form.email.split("@")[0], form.password, null);
        showToast("✅ Logged in!");
      }
    } catch (e) {
      if (e.code === "auth/user-not-found" || e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (e.code === "auth/email-already-in-use") {
        setError("Email already registered. Please login.");
      } else if (e.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError(e.message);
      }
    }
  };

  const quickLogin = async (account) => {
    if (!account.password) {
      setError("This account used Google login. Please use 'Continue with Google'.");
      return;
    }
    setError("");
    try {
      const authInst = await getFirebaseAuth();
      const { signInWithEmailAndPassword: signIn } = await import("firebase/auth");
      await signIn(authInst, account.email, account.password);
    } catch(e) {
      setError("Quick login failed. Please login manually.");
    }
  };

  const handleLogout = async () => {
    const authInst = await getFirebaseAuth();
    const { signOut } = await import("firebase/auth");
    await signOut(authInst);
    setUser(null); setAnalysis(null); setUsageInfo(null);
  };

  const showInterstitialAd = () => new Promise((resolve) => {
    setAdIdx(Math.floor(Math.random()*ADS.length));
    setAdTimer(5); setShowAd(true);
    let t = 5;
    adIntervalRef.current = setInterval(() => { t--; setAdTimer(t); if (t<=0) clearInterval(adIntervalRef.current); }, 1000);
    window._adResolve = resolve;
  });

  const closeAd = () => {
    if (adTimer > 0) return;
    clearInterval(adIntervalRef.current);
    setShowAd(false);
    if (window._adResolve) { window._adResolve(); window._adResolve = null; }
  };

  const runAnalysis = async () => {
    if (!productForm.name || !productForm.category || !productForm.platform) { setError("Please fill all product fields"); return; }
    setError("");
    const check = checkLimit(user);
    if (!check.allowed) { setError(check.reason); return; }
    const currentPlan = store.get("apa_plan_"+user?.email) || "free";
    if (currentPlan === "free") await showInterstitialAd();
    setLoading(true); setAnalysis(null); setSelectedPlatform(null); setPlatformData({});
    try {
      const res = await fetch("/api/analyze", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(productForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Failed");
      incrementUsage(user); setUsageInfo(getUsageInfo(user)); setAnalysis(data);
      showToast("✅ Analysis complete!");
    } catch(e) { setError("Analysis failed: "+e.message); }
    setLoading(false);
  };

  const fetchPlatformData = async (platformId) => {
    const currentPlan = store.get("apa_plan_"+user?.email) || "free";
    if (currentPlan !== "premium") { setShowPremium(true); return; }
    setSelectedPlatform(platformId);
    if (platformData[platformId]) return;
    setPlatformLoading(true);
    try {
      const platform = PLATFORMS.find(p=>p.id===platformId);
      const res = await fetch("/api/analyze", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name:productForm.name, category:productForm.category, platform:platform.name, mode:"ads_platform", platformId }) });
      const data = await res.json();
      setPlatformData(prev=>({...prev,[platformId]:data}));
    } catch(e) { showToast("Failed to fetch platform data"); }
    setPlatformLoading(false);
  };

  const activatePremium = async () => {
    setPaymentStep("processing");
    await new Promise(r=>setTimeout(r,2000));
    const expiry = new Date(Date.now()+PREMIUM_DAYS*86400000).toISOString();
    store.set("apa_premium_"+user?.email, { expiry, used:0 });
    store.set("apa_plan_"+user?.email, "premium");
    const updated = {...user, plan:"premium"};
    setUser(updated); setUsageInfo(getUsageInfo(updated));
    setPaymentStep("success"); showToast("🎉 Premium activated!");
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3500); };

  const currentPlan = user ? (store.get("apa_plan_"+user?.email) || "free") : "free";
  const adTimerWidth = ((5-adTimer)/5)*100;
  const STEPS = ["Product data received","Analyzing market trends","Generating AI insights","Creating viral hooks"];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
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

    /* AUTH - NEUMORPHIC */
    .neu-page{min-height:100vh;background:#e8ecf1;display:flex;align-items:center;justify-content:center;padding:20px;}
    .neu-card{background:#e8ecf1;border-radius:30px;padding:40px 32px;width:100%;max-width:420px;box-shadow:8px 8px 20px #c8cdd5,-8px -8px 20px #ffffff;}
    .neu-avatar{width:88px;height:88px;background:#e8ecf1;border-radius:50%;margin:0 auto 22px;display:flex;align-items:center;justify-content:center;box-shadow:6px 6px 14px #c8cdd5,-6px -6px 14px #ffffff;overflow:hidden;}
    .neu-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
    .neu-title{font-size:24px;font-weight:800;text-align:center;color:#1a1a2e;margin-bottom:6px;}
    .neu-sub{color:#8b8fa8;font-size:14px;text-align:center;margin-bottom:26px;}
    .auth-tabs-neu{display:flex;background:#e8ecf1;border-radius:14px;padding:4px;margin-bottom:20px;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #ffffff;}
    .auth-tab-neu{flex:1;padding:10px 0;background:none;border:none;color:#8b8fa8;font-size:14px;font-weight:600;cursor:pointer;border-radius:11px;transition:all 0.25s;font-family:'Inter',sans-serif;}
    .auth-tab-neu.active{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:4px 4px 10px rgba(99,102,241,0.4);}
    .neu-inp-wrap{position:relative;margin-bottom:14px;}
    .neu-inp-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#8b8fa8;font-size:16px;pointer-events:none;}
    .neu-inp{width:100%;background:#e8ecf1;border:none;border-radius:14px;padding:14px 16px 14px 44px;color:#1a1a2e;font-size:14px;font-family:'Inter',sans-serif;outline:none;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #ffffff;transition:all 0.2s;}
    .neu-inp:focus{box-shadow:inset 5px 5px 12px #bec3cb,inset -5px -5px 12px #f2f6fc;}
    .neu-inp::placeholder{color:#adb5bd;}
    .neu-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#8b8fa8;font-size:18px;padding:4px;}
    .err-text{color:#e53e3e;font-size:12px;margin:-6px 0 10px 4px;font-weight:500;}
    .neu-btn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:14px;padding:15px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:4px 4px 12px rgba(99,102,241,0.5),-2px -2px 8px rgba(255,255,255,0.3);transition:all 0.2s;margin-bottom:14px;}
    .neu-btn:hover{transform:translateY(-1px);}
    .neu-google-btn{width:100%;background:#e8ecf1;border:none;border-radius:14px;padding:13px 0;color:#4a5568;font-weight:700;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font-family:'Inter',sans-serif;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #ffffff;transition:all 0.2s;margin-bottom:14px;}
    .neu-google-btn:hover{box-shadow:6px 6px 14px #c0c5cd,-6px -6px 14px #ffffff;transform:translateY(-1px);}
    .neu-google-btn:disabled{opacity:0.6;cursor:not-allowed;}
    .divider{display:flex;align-items:center;gap:12px;margin:14px 0;}
    .divider-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,#c8cdd5,transparent);}
    .divider-txt{color:#adb5bd;font-size:11px;font-weight:600;white-space:nowrap;letter-spacing:0.5px;}
    .remember{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
    .remember input{width:18px;height:18px;accent-color:#6366f1;cursor:pointer;}
    .remember label{color:#8b8fa8;font-size:13px;cursor:pointer;flex:1;}
    .forgot{color:#6366f1;font-size:13px;font-weight:600;cursor:pointer;}
    .auth-switch{color:#8b8fa8;font-size:13px;text-align:center;margin-top:14px;}
    .auth-lnk{color:#6366f1;cursor:pointer;font-weight:700;}

    /* SAVED ACCOUNTS */
    .saved-wrap{margin-bottom:18px;}
    .saved-lbl{color:#8b8fa8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;}
    .saved-acc{display:flex;align-items:center;gap:12px;background:#e8ecf1;border:none;border-radius:16px;padding:11px 14px;margin-bottom:8px;cursor:pointer;width:100%;text-align:left;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #ffffff;transition:all 0.2s;}
    .saved-acc:hover{box-shadow:6px 6px 14px #c0c5cd,-6px -6px 14px #ffffff;transform:translateX(2px);}
    .saved-avt{width:38px;height:38px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;color:#fff;flex-shrink:0;overflow:hidden;}
    .saved-avt img{width:100%;height:100%;object-fit:cover;}
    .saved-info{flex:1;min-width:0;}
    .saved-name{font-size:13px;font-weight:700;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .saved-email{font-size:11px;color:#8b8fa8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .saved-pass{font-size:11px;color:#adb5bd;letter-spacing:2px;margin-top:2px;}
    .saved-arrow{color:#6366f1;font-size:18px;font-weight:700;flex-shrink:0;}

    /* DASHBOARD */
    .dashboard{min-height:100vh;background:#020817;color:#f8fafc;}
    .navbar{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(2,8,23,0.92);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100;}
    .nav-logo{font-weight:900;font-size:18px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .usage-pill{background:rgba(15,23,42,0.9);border:1px solid #1e293b;border-radius:100px;padding:7px 16px;font-size:13px;display:flex;align-items:center;gap:8px;}
    .pill-div{color:#334155;}
    .nav-right{display:flex;align-items:center;gap:8px;}
    .upgrade-btn{background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:100px;padding:8px 18px;color:#fff;font-weight:800;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif;}
    .avatar{width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;overflow:hidden;}
    .avatar img{width:100%;height:100%;object-fit:cover;}
    .logout-btn{background:none;border:1px solid #1e293b;border-radius:8px;padding:7px 12px;color:#475569;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif;}
    .dash-content{max-width:880px;margin:0 auto;padding:44px 20px 100px;}
    .hero{text-align:center;margin-bottom:48px;}
    .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:100px;padding:6px 18px;font-size:12px;color:#a5b4fc;font-weight:700;margin-bottom:18px;}
    .hero-title{font-weight:900;font-size:clamp(26px,5vw,50px);line-height:1.1;margin-bottom:14px;letter-spacing:-1px;}
    .grad-text{background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .hero-sub{color:#64748b;font-size:15px;max-width:520px;margin:0 auto;line-height:1.65;}
    .input-card{background:rgba(15,23,42,0.8);border:1px solid rgba(99,102,241,0.15);border-radius:24px;padding:32px 28px;margin-bottom:40px;}
    .card-title{font-weight:800;font-size:18px;margin-bottom:22px;color:#f8fafc;}
    .input-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:18px;}
    .inp-group{display:flex;flex-direction:column;}
    .inp-label{font-size:11px;color:#64748b;margin-bottom:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;}
    .inp{width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:13px 16px;color:#f8fafc;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:all 0.2s;}
    .inp:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15);}
    .sel{cursor:pointer;}
    .error-banner{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:12px;padding:12px 16px;color:#ef4444;font-size:13px;margin-bottom:16px;}
    .upg-link{color:#f59e0b;cursor:pointer;font-weight:700;}
    .analyze-btn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border:none;border-radius:16px;padding:17px 0;color:#fff;font-weight:800;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 32px rgba(99,102,241,0.4);transition:all 0.2s;font-family:'Inter',sans-serif;}
    .analyze-btn:hover{transform:translateY(-2px);}
    .ad-note{font-size:12px;opacity:0.65;font-weight:400;}
    .free-note{font-size:12px;color:#475569;text-align:center;margin-top:12px;}
    .loading-overlay{position:fixed;inset:0;background:rgba(2,8,23,0.97);display:flex;align-items:center;justify-content:center;z-index:7000;}
    .loading-card{background:rgba(15,23,42,0.95);border:1px solid rgba(99,102,241,0.25);border-radius:24px;padding:48px 40px;text-align:center;max-width:380px;width:90%;}
    .loading-brain{font-size:60px;margin-bottom:20px;animation:pulse 1.2s ease infinite;}
    .loading-title{font-weight:900;font-size:22px;margin-bottom:8px;color:#f8fafc;}
    .loading-sub{color:#64748b;font-size:14px;margin-bottom:28px;}
    .loading-steps{display:flex;flex-direction:column;gap:8px;text-align:left;}
    .ls{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;border:1px solid transparent;font-size:13px;color:#475569;transition:all 0.4s;}
    .ls.done{color:#10b981;border-color:rgba(16,185,129,0.25);background:rgba(16,185,129,0.06);}
    .ls.active{color:#a5b4fc;border-color:rgba(99,102,241,0.3);background:rgba(99,102,241,0.08);}
    .results-title{font-weight:900;font-size:22px;margin-bottom:24px;color:#f8fafc;}
    .metrics-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;margin-bottom:18px;}
    .metric-card{background:rgba(15,23,42,0.85);border:1px solid #1e293b;border-radius:18px;padding:20px 16px;position:relative;overflow:hidden;}
    .metric-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6366f1,#a855f7);}
    .metric-label{font-size:11px;color:#64748b;margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;}
    .metric-val{font-weight:900;font-size:20px;}
    .two-col{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:12px;}
    .glass-card{background:rgba(15,23,42,0.75);border:1px solid #1e293b;border-radius:18px;padding:22px 20px;margin-bottom:12px;}
    .gc-title{font-weight:800;font-size:15px;margin-bottom:13px;color:#e2e8f0;}
    .gc-text{color:#94a3b8;line-height:1.75;font-size:14px;}
    .hook-item{display:flex;align-items:flex-start;gap:12px;color:#cbd5e1;font-size:14px;margin-bottom:12px;line-height:1.55;}
    .hook-num{min-width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;}
    .kw-grid{display:flex;flex-wrap:wrap;gap:7px;}
    .kw-chip{background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.22);color:#a5b4fc;border-radius:100px;padding:5px 13px;font-size:13px;font-weight:500;}
    .platforms-section{background:rgba(15,23,42,0.8);border:1px solid rgba(245,158,11,0.2);border-radius:22px;padding:28px 22px;margin-bottom:12px;}
    .ps-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
    .ps-title{font-weight:800;font-size:16px;color:#e2e8f0;}
    .ps-badge{background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:3px 12px;font-size:11px;font-weight:800;color:#fff;}
    .ps-sub{color:#64748b;font-size:13px;margin-bottom:20px;line-height:1.5;}
    .platforms-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
    .platform-btn{background:rgba(2,8,23,0.7);border:1.5px solid #1e293b;border-radius:14px;padding:14px 8px 12px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;}
    .platform-btn:hover{border-color:rgba(99,102,241,0.5);transform:translateY(-2px);}
    .platform-btn.active{border-color:#6366f1;background:rgba(99,102,241,0.1);}
    .platform-logo{width:30px;height:30px;margin:0 auto 7px;}
    .platform-name{font-size:10px;font-weight:700;color:#94a3b8;}
    .lock-badge{position:absolute;top:5px;right:6px;font-size:11px;}
    .platform-detail{background:rgba(2,8,23,0.7);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:22px 18px;margin-top:14px;animation:fadeIn 0.4s ease;}
    .pd-block{margin-bottom:18px;}
    .pd-title{font-size:11px;font-weight:800;color:#a5b4fc;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.8px;}
    .pd-text{color:#94a3b8;font-size:13px;line-height:1.75;}
    .pd-steps{display:flex;flex-direction:column;gap:6px;}
    .pd-step{display:flex;align-items:flex-start;gap:10px;background:rgba(99,102,241,0.05);border:1px solid rgba(99,102,241,0.12);border-radius:9px;padding:8px 12px;color:#cbd5e1;font-size:13px;line-height:1.5;}
    .pd-step-num{min-width:20px;height:20px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex-shrink:0;}
    .pd-chips{display:flex;flex-wrap:wrap;gap:6px;}
    .pd-chip{background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);color:#a5b4fc;border-radius:8px;padding:4px 10px;font-size:12px;font-weight:500;}
    .lock-box{text-align:center;padding:20px 16px;}
    .lock-emoji{font-size:44px;margin-bottom:12px;}
    .lock-title{font-weight:800;font-size:17px;margin-bottom:6px;color:#f8fafc;}
    .lock-sub{color:#64748b;font-size:13px;margin-bottom:18px;line-height:1.6;}
    .unlock-btn{background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:12px;padding:13px 28px;color:#fff;font-weight:800;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;}
    .ad-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:9000;}
    .ad-box{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid #1e293b;border-radius:24px;padding:40px 32px;max-width:400px;width:92%;text-align:center;position:relative;animation:scaleIn 0.3s ease;}
    .ad-badge-top{position:absolute;top:-13px;left:50%;transform:translateX(-50%);padding:5px 18px;border-radius:100px;font-size:10px;font-weight:800;color:#fff;letter-spacing:1.5px;}
    .ad-headline{font-weight:900;font-size:22px;margin:14px 0 8px;color:#f8fafc;}
    .ad-sub{color:#94a3b8;margin-bottom:22px;font-size:14px;line-height:1.5;}
    .ad-cta{border:none;border-radius:100px;padding:12px 30px;color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:'Inter',sans-serif;}
    .ad-prog{height:3px;background:#1e293b;border-radius:100px;margin:18px 0 0;overflow:hidden;}
    .ad-prog-fill{height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width 1s linear;}
    .ad-close-btn{display:block;margin:12px auto 0;background:none;border:1px solid #2d3748;border-radius:100px;padding:8px 22px;color:#94a3b8;cursor:pointer;font-size:13px;font-family:'Inter',sans-serif;}
    .ad-close-btn.disabled{opacity:0.3;cursor:not-allowed;}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:8000;backdrop-filter:blur(8px);}
    .premium-modal{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid rgba(245,158,11,0.25);border-radius:28px;padding:40px 32px;max-width:460px;width:92%;text-align:center;animation:scaleIn 0.3s ease;}
    .prem-badge{display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:6px 20px;font-size:12px;font-weight:800;color:#fff;margin-bottom:14px;letter-spacing:1px;}
    .prem-title{font-weight:900;font-size:26px;margin-bottom:6px;color:#f8fafc;}
    .prem-price{font-weight:900;font-size:42px;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px;}
    .prem-price span{font-size:15px;-webkit-text-fill-color:#94a3b8;color:#94a3b8;}
    .prem-highlight{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:12px 16px;margin-bottom:20px;color:#10b981;font-size:13px;font-weight:600;line-height:1.6;}
    .prem-features{display:flex;flex-direction:column;gap:8px;margin-bottom:24px;text-align:left;}
    .prem-feature{color:#cbd5e1;font-size:14px;padding:9px 14px;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid rgba(255,255,255,0.05);}
    .prem-btn{width:100%;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:14px;padding:15px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;margin-bottom:10px;font-family:'Inter',sans-serif;}
    .modal-cancel{background:none;border:none;color:#475569;font-family:'Inter',sans-serif;font-size:14px;cursor:pointer;padding:8px 0;width:100%;}
    .pay-box{background:#020817;border:1px solid #1e293b;border-radius:14px;padding:16px 18px;margin-bottom:14px;text-align:left;}
    .pay-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#94a3b8;font-size:14px;}
    .pay-row:last-child{border-bottom:none;}
    .pay-note{color:#475569;font-size:12px;margin-bottom:14px;line-height:1.6;}
    .success-features{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:14px;padding:16px;margin:14px 0 22px;text-align:left;}
    .sf-item{color:#10b981;font-size:13px;padding:4px 0;font-weight:500;}
    .footer{text-align:center;padding:22px 20px;color:#334155;font-size:12px;border-top:1px solid rgba(255,255,255,0.03);}
    @media(max-width:600px){
      .navbar{padding:12px 14px;}
      .input-card{padding:22px 16px;}
      .dash-content{padding:28px 14px 60px;}
      .usage-pill{display:none;}
      .platforms-grid{grid-template-columns:repeat(4,1fr);gap:6px;}
      .platform-btn{padding:10px 4px 8px;}
      .platform-name{font-size:9px;}
      .neu-card{padding:32px 22px;}
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

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-card scale-in">
            <div className="loading-brain">🧠</div>
            <h2 className="loading-title">Analyzing Product</h2>
            <p className="loading-sub">YYP AI is processing your request...</p>
            <div className="loading-steps">
              {STEPS.map((s,i)=>(
                <div key={i} className={"ls"+(loadingStep>i?" done":loadingStep===i?" active":"")}>
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
            <div className="ad-badge-top" style={{background:ADS[adIdx].color}}>ADVERTISEMENT</div>
            <div style={{fontSize:50,marginTop:10}}>📢</div>
            <h2 className="ad-headline">{ADS[adIdx].headline}</h2>
            <p className="ad-sub">{ADS[adIdx].sub}</p>
            <button className="ad-cta" style={{background:ADS[adIdx].color}}>{ADS[adIdx].cta}</button>
            <div className="ad-prog"><div className="ad-prog-fill" style={{width:adTimerWidth+"%"}}/></div>
            <button onClick={closeAd} className={"ad-close-btn"+(adTimer>0?" disabled":"")}>
              {adTimer>0?"⏳ Skip in "+adTimer+"s":"✕ Close & Continue"}
            </button>
          </div>
        </div>
      )}

      {/* PREMIUM MODAL */}
      {showPremium && (
        <div className="modal-overlay" onClick={()=>{if(paymentStep==="form"){setShowPremium(false);setShowPayment(false);setPaymentStep("form");}}}>
          <div className="premium-modal" onClick={e=>e.stopPropagation()}>
            {!showPayment ? (
              <>
                <div className="prem-badge">💎 PREMIUM PLAN</div>
                <h2 className="prem-title">Unlock Everything</h2>
                <div className="prem-price">₹149 <span>/ 7 days</span></div>
                <div className="prem-highlight">🎉 After purchase:<br/>✅ <b>Zero ads</b> — ad-free experience<br/>✅ <b>30 analyses</b> in 7 days<br/>✅ <b>All 8 platforms</b> unlocked</div>
                <div className="prem-features">
                  {["📺 Ads on 8+ platforms","🎬 Video Publishing Guides","🔑 Platform keywords & scripts","💰 Budget & ROI tips","🚫 No ads ever"].map(f=>(
                    <div key={f} className="prem-feature">{f}</div>
                  ))}
                </div>
                <button className="prem-btn" onClick={()=>setShowPayment(true)}>🔓 Unlock Premium — ₹149</button>
                <button className="modal-cancel" onClick={()=>setShowPremium(false)}>Maybe later</button>
              </>
            ) : paymentStep==="form" ? (
              <>
                <h2 className="prem-title">Complete Payment</h2>
                <div className="pay-box">
                  <div className="pay-row"><span>Plan</span><span>Premium 7-day</span></div>
                  <div className="pay-row"><span>Amount</span><span style={{color:"#f59e0b",fontWeight:700}}>₹149</span></div>
                  <div className="pay-row"><span>Analyses</span><span style={{color:"#10b981"}}>30 total</span></div>
                  <div className="pay-row"><span>Ads</span><span style={{color:"#10b981"}}>Zero</span></div>
                </div>
                <p className="pay-note">⚠️ Add Razorpay for real payments. Demo simulates success.</p>
                <button className="prem-btn" onClick={activatePremium}>💳 Pay ₹149 (Demo)</button>
                <button className="modal-cancel" onClick={()=>setShowPayment(false)}>← Back</button>
              </>
            ) : paymentStep==="processing" ? (
              <div style={{textAlign:"center",padding:48}}>
                <div className="spinner" style={{margin:"0 auto"}}/>
                <p style={{color:"#94a3b8",marginTop:20}}>Processing...</p>
              </div>
            ) : (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:64,marginBottom:12}}>🎉</div>
                <h2 className="prem-title">Premium Activated!</h2>
                <div className="success-features">
                  <div className="sf-item">✅ Zero ads</div>
                  <div className="sf-item">✅ 30 analyses (7 days)</div>
                  <div className="sf-item">✅ All 8 platforms unlocked</div>
                </div>
                <button className="prem-btn" onClick={()=>{setShowPremium(false);setShowPayment(false);setPaymentStep("form");}}>🚀 Start Analyzing →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTH - NEUMORPHIC */}
      {screen==="auth" && (
        <div className="neu-page">
          <div className="neu-card">
            <div className="neu-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8b8fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="44" height="44">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className="neu-title">{authMode==="login"?"Welcome back":"Create account"}</h1>
            <p className="neu-sub">{authMode==="login"?"Sign in to continue":"Join YesYouPro for free"}</p>

            {/* Saved accounts */}
            {authMode==="login" && savedAccounts.length>0 && (
              <div className="saved-wrap">
                <div className="saved-lbl">Quick Login</div>
                {savedAccounts.map(acc=>(
                  <button key={acc.email} className="saved-acc" onClick={()=>quickLogin(acc)}>
                    <div className="saved-avt">
                      {acc.photoURL ? <img src={acc.photoURL} alt=""/> : acc.name?.[0]?.toUpperCase()||"U"}
                    </div>
                    <div className="saved-info">
                      <div className="saved-name">{acc.name}</div>
                      <div className="saved-email">{acc.email}</div>
                      <div className="saved-pass">{acc.password ? "●".repeat(Math.min(acc.password.length,8)) : "Google Account"}</div>
                    </div>
                    <div className="saved-arrow">→</div>
                  </button>
                ))}
                <div className="divider"><div className="divider-line"/><div className="divider-txt">OR SIGN IN MANUALLY</div><div className="divider-line"/></div>
              </div>
            )}

            <div className="auth-tabs-neu">
              {["login","signup"].map(m=>(
                <button key={m} className={"auth-tab-neu"+(authMode===m?" active":"")} onClick={()=>{setAuthMode(m);setError("");}}>
                  {m==="login"?"Login":"Sign Up"}
                </button>
              ))}
            </div>

            {/* Google Button - REAL */}
            <button className="neu-google-btn" onClick={handleGoogleLogin} disabled={googleLoading}>
              {googleLoading ? (
                <div className="spinner" style={{width:18,height:18,border:"2px solid rgba(99,102,241,0.2)",borderTop:"2px solid #6366f1"}}/>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <div className="divider"><div className="divider-line"/><div className="divider-txt">OR CONTINUE WITH EMAIL</div><div className="divider-line"/></div>

            {authMode==="signup" && (
              <div className="neu-inp-wrap">
                <span className="neu-inp-icon">👤</span>
                <input className="neu-inp" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
            )}
            <div className="neu-inp-wrap">
              <span className="neu-inp-icon">✉️</span>
              <input className="neu-inp" placeholder="Email address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            </div>
            <div className="neu-inp-wrap">
              <span className="neu-inp-icon">🔒</span>
              <input className="neu-inp" placeholder="Password" type={showPass?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
              <button className="neu-eye" onClick={()=>setShowPass(!showPass)}>{showPass?"🙈":"👁️"}</button>
            </div>

            {error && <p className="err-text">⚠️ {error}</p>}

            {authMode==="login" && (
              <div className="remember">
                <input type="checkbox" id="rem" defaultChecked/>
                <label htmlFor="rem">Remember me</label>
                <span className="forgot">Forgot password?</span>
              </div>
            )}

            <button className="neu-btn" onClick={handleAuth}>
              {authMode==="login"?"Sign In →":"Create Account →"}
            </button>
            <p className="auth-switch">
              {authMode==="login"?"Don't have an account? ":"Already have an account? "}
              <span className="auth-lnk" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setError("");}}>
                {authMode==="login"?"Sign Up Free":"Sign In"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {screen==="dashboard" && (
        <div className="dashboard">
          <nav className="navbar">
            <div className="nav-logo">🧠 YesYouPro</div>
            {usageInfo && (
              <div className="usage-pill">
                <span style={{color:currentPlan==="premium"?"#f59e0b":"#94a3b8",fontWeight:700}}>{currentPlan==="premium"?"💎 Premium":"🆓 Free"}</span>
                <span className="pill-div">|</span>
                <span style={{color:usageInfo.remaining>0?"#10b981":"#ef4444",fontWeight:700}}>{usageInfo.remaining} left</span>
              </div>
            )}
            <div className="nav-right">
              {currentPlan==="free" && <button className="upgrade-btn" onClick={()=>setShowPremium(true)}>💎 Upgrade</button>}
              <div className="avatar">
                {user?.photoURL ? <img src={user.photoURL} alt=""/> : user?.name?.[0]?.toUpperCase()||"U"}
              </div>
              <button className="logout-btn" onClick={handleLogout}>Exit</button>
            </div>
          </nav>

          <div className="dash-content">
            <div className="hero">
              <div className="hero-badge">✨ YYP AI — Product Intelligence</div>
              <h1 className="hero-title">Product Intelligence<br/><span className="grad-text">Powered by YesYouPro</span></h1>
              <p className="hero-sub">Enter any product and get deep market analysis, viral hooks, keywords and complete platform ad strategies.</p>
            </div>

            <div className="input-card">
              <h3 className="card-title">🎯 Analyze a Product</h3>
              <div className="input-grid">
                <div className="inp-group">
                  <label className="inp-label">Product Name *</label>
                  <input className="inp" placeholder="e.g. Portable Blender" value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})}/>
                </div>
                <div className="inp-group">
                  <label className="inp-label">Category *</label>
                  <select className="inp sel" value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}>
                    <option value="">Select category</option>
                    {["Electronics","Beauty & Skincare","Home & Kitchen","Fitness","Fashion","Pet Supplies","Toys & Games","Health & Wellness","Outdoor & Sports"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="inp-group">
                  <label className="inp-label">Platform *</label>
                  <select className="inp sel" value={productForm.platform} onChange={e=>setProductForm({...productForm,platform:e.target.value})}>
                    <option value="">Select platform</option>
                    {["Amazon","Shopify","Meesho","Flipkart","Instagram","TikTok Shop","Etsy","Facebook Marketplace","WooCommerce"].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {error && <div className="error-banner">{error}{error.includes("Upgrade")&&<span className="upg-link" onClick={()=>setShowPremium(true)}> → Upgrade Now</span>}</div>}
              <button className="analyze-btn" onClick={runAnalysis} disabled={loading}>
                🚀 Get AI Analysis {currentPlan==="free"&&<span className="ad-note">· Ad plays first</span>}
              </button>
              {currentPlan==="free"&&(
                <p className="free-note">Free: {usageInfo?.remaining??FREE_DAILY_LIMIT}/{FREE_DAILY_LIMIT} today · <span className="upg-link" onClick={()=>setShowPremium(true)}>Upgrade — no ads + 30 analyses →</span></p>
              )}
            </div>

            {analysis && (
              <div className="fade-in">
                <h2 className="results-title">📊 Results — <span className="grad-text">{productForm.name}</span></h2>
                <div className="metrics-row">
                  {[{label:"🔥 Viral Score",val:analysis.viral_score,color:"#f59e0b"},{label:"📈 Demand",val:analysis.demand_level,color:"#10b981"},{label:"⚔️ Competition",val:analysis.competition_level,color:"#ef4444"},{label:"💰 Price Range",val:analysis.price_range,color:"#6366f1"}].map(m=>(
                    <div key={m.label} className="metric-card">
                      <div className="metric-label">{m.label}</div>
                      <div className="metric-val" style={{color:m.color}}>{m.val}</div>
                    </div>
                  ))}
                </div>
                <div className="two-col">
                  <div className="glass-card"><h4 className="gc-title">📝 Description</h4><p className="gc-text">{analysis.description}</p></div>
                  <div className="glass-card"><h4 className="gc-title">🎯 Target Audience</h4><p className="gc-text">{analysis.target_audience}</p></div>
                </div>
                <div className="glass-card">
                  <h4 className="gc-title">🪝 Viral Hooks</h4>
                  {analysis.hooks?.map((h,i)=><div key={i} className="hook-item"><span className="hook-num">{i+1}</span><span>{h}</span></div>)}
                </div>
                <div className="glass-card">
                  <h4 className="gc-title">🔑 SEO Keywords</h4>
                  <div className="kw-grid">{analysis.keywords?.map((k,i)=><div key={i} className="kw-chip">{k}</div>)}</div>
                </div>
                <div className="platforms-section">
                  <div className="ps-header">
                    <div className="ps-title">📺 Run Ads + Publish Content</div>
                    {currentPlan==="free"&&<div className="ps-badge">🔒 PREMIUM</div>}
                  </div>
                  <p className="ps-sub">Complete ad strategy + video publishing guide for every platform</p>
                  <div className="platforms-grid">
                    {PLATFORMS.map(p=>(
                      <div key={p.id} className={"platform-btn"+(selectedPlatform===p.id?" active":"")} onClick={()=>fetchPlatformData(p.id)} style={{borderColor:selectedPlatform===p.id?p.color:undefined}}>
                        {currentPlan==="free"&&<div className="lock-badge">🔒</div>}
                        <div className="platform-logo" dangerouslySetInnerHTML={{__html:p.logo}}/>
                        <div className="platform-name">{p.name}</div>
                      </div>
                    ))}
                  </div>
                  {selectedPlatform && currentPlan==="premium" && (
                    <div className="platform-detail">
                      {platformLoading ? (
                        <div style={{textAlign:"center",padding:24}}><div className="spinner" style={{margin:"0 auto 10px"}}/><p style={{color:"#64748b",fontSize:13}}>Generating strategy...</p></div>
                      ) : platformData[selectedPlatform] ? (()=>{
                        const d = platformData[selectedPlatform];
                        return (<>
                          {d.account_setup&&<div className="pd-block"><div className="pd-title">🏗️ Account Setup</div><div className="pd-steps">{d.account_setup.split("\n").filter(Boolean).map((s,i)=><div key={i} className="pd-step"><span className="pd-step-num">{i+1}</span><span>{s.replace(/^\d+[\.\)]\s*/,"")}</span></div>)}</div></div>}
                          {d.targeting&&<div className="pd-block"><div className="pd-title">🎯 Targeting</div><div className="pd-text">{d.targeting}</div></div>}
                          {d.ad_keywords?.length>0&&<div className="pd-block"><div className="pd-title">🔑 Keywords</div><div className="pd-chips">{d.ad_keywords.map((k,i)=><div key={i} className="pd-chip">{k}</div>)}</div></div>}
                          {d.script&&<div className="pd-block"><div className="pd-title">📝 Script</div><div className="pd-text" style={{background:"rgba(99,102,241,0.06)",padding:14,borderRadius:10,border:"1px solid rgba(99,102,241,0.15)",lineHeight:1.75}}>{d.script}</div></div>}
                          {d.video_steps&&<div className="pd-block"><div className="pd-title">🎬 Video Publishing</div><div className="pd-steps">{d.video_steps.split("\n").filter(Boolean).map((s,i)=><div key={i} className="pd-step"><span className="pd-step-num">{i+1}</span><span>{s.replace(/^\d+[\.\)]\s*/,"")}</span></div>)}</div></div>}
                          {d.title&&<div className="pd-block"><div className="pd-title">📌 Best Title</div><div className="pd-text" style={{fontWeight:700,color:"#e2e8f0",fontSize:15}}>{d.title}</div></div>}
                          {d.budget&&<div className="pd-block"><div className="pd-title">💰 Budget</div><div className="pd-text">{d.budget}</div></div>}
                        </>);
                      })():null}
                    </div>
                  )}
                  {currentPlan==="free"&&(
                    <div className="lock-box">
                      <div className="lock-emoji">🔒</div>
                      <div className="lock-title">Premium Feature</div>
                      <div className="lock-sub">Unlock complete ad strategies + video guides for all 8 platforms</div>
                      <button className="unlock-btn" onClick={()=>setShowPremium(true)}>💎 Unlock for ₹149</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <footer className="footer">🧠 Product Analyzer · Built with AI · © YesYouPro</footer>
        </div>
      )}
    </>
  );
}
