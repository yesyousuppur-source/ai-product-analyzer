import { useState, useEffect, useRef } from "react";

const FREE_DAILY_LIMIT = 3;
const PREMIUM_TOTAL_LIMIT = 30;
const PREMIUM_DAYS = 7;

const ADS = [
  { headline: "Scale Your Business Fast", sub: "Find winning products 10x faster", cta: "Try Now Free", color: "#f59e0b" },
  { headline: "AI Marketing Suite", sub: "Auto-generate ads, copy and creatives", cta: "Start Free Trial", color: "#8b5cf6" },
  { headline: "Shopify Store Experts", sub: "Build your store in 48 hours", cta: "Book a Call", color: "#06b6d4" },
];

const PLATFORMS = [
  { id: "google_ads", name: "Google Ads", color: "#4285f4", logo: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>` },
  { id: "facebook", name: "Facebook Ads", color: "#1877f2", logo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>` },
  { id: "instagram", name: "Instagram", color: "#e1306c", logo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="ig" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#ig)"/></svg>` },
  { id: "youtube", name: "YouTube", color: "#ff0000", logo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/></svg>` },
  { id: "tiktok", name: "TikTok", color: "#010101", logo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#000"/></svg>` },
  { id: "pinterest", name: "Pinterest", color: "#e60023", logo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#E60023"/></svg>` },
  { id: "snapchat", name: "Snapchat", color: "#FFFC00", logo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.354 4.408-.074 1.86 1.498 2.127 2.404 1.544.48-.316 1.02-.536 1.46-.536.45 0 .763.159.858.417.099.267-.124.643-.898 1.054-.241.127-.55.273-.88.425-1.07.497-2.538 1.093-2.538 2.272 0 .176.029.35.089.518.33.93 1.14 1.643 1.975 2.375.413.36.85.748 1.254 1.195.36.41.574.856.574 1.27 0 .51-.314.927-.885 1.156-.434.173-1.017.267-1.602.267-.43 0-.86-.05-1.252-.15-.622-.16-1.252-.5-1.814-.83-.386-.23-.696-.42-.966-.42-.27 0-.648.185-.998.37-.58.31-1.165.621-1.814.81-.507.145-1.13.236-1.759.236-1.25 0-2.433-.407-3.112-.963-.338-.271-.604-.566-.741-.898-.14-.333-.14-.674.014-1.02.234-.542.858-1.062 1.56-1.643.456-.376.974-.808 1.384-1.295.256-.31.42-.592.42-.863 0-.543-.72-1.091-1.736-1.572-.396-.183-.806-.339-1.152-.464-.414-.146-.712-.268-.834-.41-.17-.199-.211-.452-.106-.71.113-.274.4-.46.766-.47.305-.008.61.068.886.224.298.167.557.41.791.64.154.152.29.284.408.375.136.104.28.16.406.16.256 0 .39-.2.39-.583V7.84c0-1.19-.122-3.228.354-4.408C7.855 1.069 11.21.793 12.206.793z" fill="#FFFC00"/></svg>` },
  { id: "twitter", name: "X (Twitter)", color: "#000000", logo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="#000"/></svg>` },
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
  const loadingRef = useRef(null);

  useEffect(() => {
    const saved = store.get("apa_user");
    const accounts = store.get("apa_saved_accounts") || [];
    setSavedAccounts(accounts);
    if (saved) { setUser(saved); setUsageInfo(getUsageInfo(saved)); setScreen("dashboard"); }
    else setScreen("auth");
  }, []);

  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      const steps = [1, 2, 3];
      steps.forEach((s, i) => {
        setTimeout(() => setLoadingStep(s), (i + 1) * 1200);
      });
    }
  }, [loading]);

  const getTodayKey = () => new Date().toISOString().split("T")[0];

  const getUsageInfo = (u) => {
    const plan = u?.plan || "free";
    if (plan === "premium") {
      const pd = store.get("apa_premium_" + u.email);
      if (!pd) return { plan: "free", remaining: FREE_DAILY_LIMIT, total: FREE_DAILY_LIMIT };
      const expired = new Date() > new Date(pd.expiry);
      if (expired) return { plan: "free", remaining: FREE_DAILY_LIMIT, total: FREE_DAILY_LIMIT, expired: true };
      const used = pd.used || 0;
      return { plan, remaining: Math.max(0, PREMIUM_TOTAL_LIMIT - used), total: PREMIUM_TOTAL_LIMIT, used, expiry: pd.expiry };
    }
    const used = store.get("apa_usage_" + u.email + "_" + getTodayKey()) || 0;
    return { plan, remaining: Math.max(0, FREE_DAILY_LIMIT - used), total: FREE_DAILY_LIMIT, used };
  };

  const incrementUsage = (u) => {
    if ((u?.plan || "free") === "premium") {
      const pd = store.get("apa_premium_" + u.email);
      if (pd) store.set("apa_premium_" + u.email, { ...pd, used: (pd.used || 0) + 1 });
    } else {
      const key = "apa_usage_" + u.email + "_" + getTodayKey();
      store.set(key, (store.get(key) || 0) + 1);
    }
  };

  const checkLimit = (u) => {
    const info = getUsageInfo(u);
    if (info.expired) return { allowed: false, reason: "Premium expired! Please recharge." };
    if (info.remaining <= 0) return { allowed: false, reason: info.plan === "free" ? "Daily limit reached (3/day). Upgrade to Premium!" : "Premium limit reached. Please recharge." };
    return { allowed: true };
  };

  const handleAuth = () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    if (authMode === "signup" && !form.name) { setError("Name is required"); return; }
    setError("");
    const users = store.get("apa_users") || {};
    if (authMode === "signup") {
      if (users[form.email]) { setError("Email already registered"); return; }
      const newUser = { email: form.email, name: form.name, plan: "free" };
      users[form.email] = { ...newUser, password: form.password };
      store.set("apa_users", users);
      store.set("apa_user", newUser);
      const accounts = store.get("apa_saved_accounts") || [];
      if (!accounts.find(a => a.email === form.email)) {
        accounts.push({ email: form.email, name: form.name, password: form.password });
        store.set("apa_saved_accounts", accounts);
        setSavedAccounts([...accounts]);
      }
      setUser(newUser); setUsageInfo(getUsageInfo(newUser)); setScreen("dashboard");
    } else {
      const found = users[form.email];
      if (!found || found.password !== form.password) { setError("Invalid email or password"); return; }
      const u = { email: found.email, name: found.name, plan: found.plan || "free" };
      const accounts = store.get("apa_saved_accounts") || [];
      const idx = accounts.findIndex(a => a.email === form.email);
      const acc = { email: found.email, name: found.name, password: form.password };
      if (idx >= 0) accounts[idx] = acc; else accounts.push(acc);
      store.set("apa_saved_accounts", accounts);
      setSavedAccounts([...accounts]);
      store.set("apa_user", u);
      setUser(u); setUsageInfo(getUsageInfo(u)); setScreen("dashboard");
    }
  };

  const quickLogin = (account) => {
    const users = store.get("apa_users") || {};
    const found = users[account.email];
    if (!found) { setError("Account not found. Please login manually."); return; }
    const u = { email: found.email, name: found.name, plan: found.plan || "free" };
    store.set("apa_user", u);
    setUser(u); setUsageInfo(getUsageInfo(u)); setScreen("dashboard");
  };

  const showInterstitialAd = () => new Promise((resolve) => {
    setAdIdx(Math.floor(Math.random() * ADS.length));
    setAdTimer(5); setShowAd(true);
    let t = 5;
    adIntervalRef.current = setInterval(() => {
      t--; setAdTimer(t);
      if (t <= 0) clearInterval(adIntervalRef.current);
    }, 1000);
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
    if ((user?.plan || "free") === "free") await showInterstitialAd();
    setLoading(true); setAnalysis(null); setSelectedPlatform(null); setPlatformData({});
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      incrementUsage(user);
      setUsageInfo(getUsageInfo(user));
      setAnalysis(data);
      showToast("✅ Analysis complete!");
    } catch (e) {
      setError("Analysis failed: " + e.message);
    }
    setLoading(false);
  };

  const fetchPlatformData = async (platformId) => {
    if ((user?.plan || "free") !== "premium") { setShowPremium(true); return; }
    setSelectedPlatform(platformId);
    if (platformData[platformId]) return;
    setPlatformLoading(true);
    try {
      const platform = PLATFORMS.find(p => p.id === platformId);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: productForm.name, category: productForm.category, platform: platform.name, mode: "ads_platform", platformId }),
      });
      const data = await res.json();
      setPlatformData(prev => ({ ...prev, [platformId]: data }));
    } catch (e) { showToast("Failed to fetch platform data"); }
    setPlatformLoading(false);
  };

  const activatePremium = async () => {
    setPaymentStep("processing");
    await new Promise(r => setTimeout(r, 2000));
    const expiry = new Date(Date.now() + PREMIUM_DAYS * 86400000).toISOString();
    store.set("apa_premium_" + user.email, { expiry, used: 0 });
    const updated = { ...user, plan: "premium" };
    store.set("apa_user", updated);
    const users = store.get("apa_users") || {};
    if (users[user.email]) { users[user.email].plan = "premium"; store.set("apa_users", users); }
    setUser(updated); setUsageInfo(getUsageInfo(updated));
    setPaymentStep("success");
    showToast("🎉 Premium activated!");
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const logout = () => { store.set("apa_user", null); setUser(null); setAnalysis(null); setUsageInfo(null); setScreen("auth"); };

  const adTimerWidth = ((5 - adTimer) / 5) * 100;

  const STEPS = ["Product data received", "Analyzing market trends", "Generating AI insights", "Creating viral hooks"];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#020817; font-family:'Inter',sans-serif; color:#f8fafc; }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes scaleIn { from{transform:scale(0.93);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes progressBar { from{width:0%} to{width:100%} }
    .fade-in { animation:fadeIn 0.5s ease; }
    .scale-in { animation:scaleIn 0.3s ease; }

    .loading-screen { display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:radial-gradient(ellipse at center,#1e1b4b 0%,#020817 70%); }
    .spinner { width:40px;height:40px;border:3px solid rgba(99,102,241,0.2);border-top:3px solid #6366f1;border-radius:50%;animation:spin 0.8s linear infinite; }
    .toast { position:fixed;top:24px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 32px rgba(16,185,129,0.4);animation:fadeIn 0.3s ease;white-space:nowrap; }

    /* AUTH */
    .auth-page { min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(ellipse at 30% 20%,rgba(99,102,241,0.2) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(168,85,247,0.15) 0%,transparent 50%),#020817; }
    .auth-card { background:rgba(15,23,42,0.97);border:1px solid rgba(99,102,241,0.2);border-radius:24px;padding:36px 32px;width:100%;max-width:440px;backdrop-filter:blur(20px);box-shadow:0 32px 64px rgba(0,0,0,0.6); }
    .auth-brand { display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:6px; }
    .auth-brand-icon { width:46px;height:46px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 8px 20px rgba(99,102,241,0.4); }
    .auth-brand-name { font-size:22px;font-weight:900;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
    .auth-tagline { color:#64748b;font-size:13px;text-align:center;margin-bottom:24px; }
    .saved-section { margin-bottom:16px; }
    .saved-label { color:#64748b;font-size:11px;margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px; }
    .account-chip { display:flex;align-items:center;gap:12px;background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:11px 14px;margin-bottom:8px;cursor:pointer;transition:all 0.2s; }
    .account-chip:hover { border-color:#6366f1;background:rgba(99,102,241,0.08);transform:translateX(2px); }
    .account-avatar { width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0; }
    .account-info { flex:1;min-width:0; }
    .account-name { font-size:13px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .account-email { font-size:11px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .account-pass { font-size:11px;color:#334155;letter-spacing:2px;margin-top:2px; }
    .divider { display:flex;align-items:center;gap:10px;margin:14px 0; }
    .divider-line { flex:1;height:1px;background:#1e293b; }
    .divider-text { color:#475569;font-size:11px;white-space:nowrap; }
    .auth-tabs { display:flex;background:#0f172a;border-radius:14px;padding:4px;margin-bottom:20px;border:1px solid #1e293b; }
    .auth-tab { flex:1;padding:10px 0;background:none;border:none;color:#64748b;font-size:14px;font-weight:600;cursor:pointer;border-radius:11px;transition:all 0.2s;font-family:'Inter',sans-serif; }
    .auth-tab.active { background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 4px 12px rgba(99,102,241,0.4); }
    .inp { width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:13px 16px;color:#f8fafc;font-size:14px;font-family:'Inter',sans-serif;margin-bottom:12px;outline:none;transition:all 0.2s; }
    .inp:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
    .sel { cursor:pointer; }
    .err-text { color:#ef4444;font-size:13px;text-align:center;margin-bottom:10px;padding:8px 12px;background:rgba(239,68,68,0.08);border-radius:8px;border:1px solid rgba(239,68,68,0.2); }
    .primary-btn { width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:12px;padding:14px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 4px 20px rgba(99,102,241,0.4);font-family:'Inter',sans-serif;transition:all 0.2s;letter-spacing:0.3px; }
    .primary-btn:hover { transform:translateY(-1px);box-shadow:0 8px 28px rgba(99,102,241,0.5); }
    .google-btn { width:100%;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:13px 0;color:#1e293b;font-weight:600;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;transition:all 0.2s;font-family:'Inter',sans-serif; }
    .google-btn:hover { background:#f8fafc;box-shadow:0 4px 16px rgba(0,0,0,0.1);transform:translateY(-1px); }
    .auth-switch { color:#475569;font-size:13px;text-align:center;margin-top:14px; }
    .auth-link { color:#6366f1;cursor:pointer;font-weight:700; }

    /* NAVBAR */
    .navbar { display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(2,8,23,0.92);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100; }
    .nav-logo { font-weight:900;font-size:18px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:flex;align-items:center;gap:6px; }
    .usage-pill { background:rgba(15,23,42,0.9);border:1px solid #1e293b;border-radius:100px;padding:7px 16px;font-size:13px;display:flex;align-items:center;gap:8px; }
    .pill-divider { color:#334155; }
    .nav-right { display:flex;align-items:center;gap:8px; }
    .upgrade-btn { background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:100px;padding:8px 18px;color:#fff;font-weight:800;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 4px 14px rgba(245,158,11,0.35);transition:all 0.2s; }
    .upgrade-btn:hover { transform:translateY(-1px); }
    .avatar { width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px; }
    .logout-btn { background:none;border:1px solid #1e293b;border-radius:8px;padding:7px 12px;color:#475569;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif; }

    /* DASH */
    .dash-content { max-width:880px;margin:0 auto;padding:44px 20px 100px; }
    .hero { text-align:center;margin-bottom:48px; }
    .hero-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:100px;padding:6px 18px;font-size:12px;color:#a5b4fc;font-weight:700;margin-bottom:18px;letter-spacing:0.5px; }
    .hero-title { font-weight:900;font-size:clamp(28px,5vw,50px);line-height:1.1;margin-bottom:14px;letter-spacing:-1px; }
    .grad-text { background:linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
    .hero-sub { color:#64748b;font-size:15px;max-width:520px;margin:0 auto;line-height:1.65; }

    /* INPUT CARD */
    .input-card { background:rgba(15,23,42,0.8);border:1px solid rgba(99,102,241,0.15);border-radius:24px;padding:32px 28px;margin-bottom:40px;box-shadow:0 8px 32px rgba(0,0,0,0.3); }
    .card-title { font-weight:800;font-size:18px;margin-bottom:22px; }
    .input-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:18px; }
    .inp-group { display:flex;flex-direction:column; }
    .inp-label { font-size:11px;color:#64748b;margin-bottom:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px; }
    .error-banner { background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:12px;padding:12px 16px;color:#ef4444;font-size:13px;margin-bottom:16px; }
    .upg-link { color:#f59e0b;cursor:pointer;font-weight:700; }
    .analyze-btn { width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border:none;border-radius:16px;padding:17px 0;color:#fff;font-weight:800;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 32px rgba(99,102,241,0.4);transition:all 0.2s;font-family:'Inter',sans-serif;position:relative;overflow:hidden; }
    .analyze-btn:hover { transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,0.55); }
    .ad-note { font-size:12px;opacity:0.65;font-weight:400; }
    .free-note { font-size:12px;color:#475569;text-align:center;margin-top:12px; }

    /* LOADING OVERLAY */
    .loading-overlay { position:fixed;inset:0;background:rgba(2,8,23,0.97);display:flex;align-items:center;justify-content:center;z-index:7000;backdrop-filter:blur(10px); }
    .loading-card { background:rgba(15,23,42,0.95);border:1px solid rgba(99,102,241,0.25);border-radius:24px;padding:48px 40px;text-align:center;max-width:380px;width:90%;box-shadow:0 32px 64px rgba(0,0,0,0.5); }
    .loading-brain { font-size:60px;margin-bottom:20px;animation:pulse 1.2s ease infinite; }
    .loading-title { font-weight:900;font-size:22px;margin-bottom:8px; }
    .loading-sub { color:#64748b;font-size:14px;margin-bottom:28px; }
    .loading-steps { display:flex;flex-direction:column;gap:8px;text-align:left; }
    .ls { display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;border:1px solid transparent;font-size:13px;color:#475569;transition:all 0.4s; }
    .ls.done { color:#10b981;border-color:rgba(16,185,129,0.25);background:rgba(16,185,129,0.06); }
    .ls.active { color:#a5b4fc;border-color:rgba(99,102,241,0.3);background:rgba(99,102,241,0.08); }

    /* RESULTS */
    .results-title { font-weight:900;font-size:22px;margin-bottom:24px; }
    .metrics-row { display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;margin-bottom:18px; }
    .metric-card { background:rgba(15,23,42,0.85);border:1px solid #1e293b;border-radius:18px;padding:20px 16px;position:relative;overflow:hidden;transition:transform 0.2s; }
    .metric-card:hover { transform:translateY(-2px); }
    .metric-card::after { content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6366f1,#a855f7); }
    .metric-label { font-size:11px;color:#64748b;margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px; }
    .metric-val { font-weight:900;font-size:20px; }
    .two-col { display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:12px; }
    .glass-card { background:rgba(15,23,42,0.75);border:1px solid #1e293b;border-radius:18px;padding:22px 20px;margin-bottom:12px;transition:border-color 0.2s; }
    .glass-card:hover { border-color:rgba(99,102,241,0.3); }
    .gc-title { font-weight:800;font-size:15px;margin-bottom:13px;color:#e2e8f0; }
    .gc-text { color:#94a3b8;line-height:1.75;font-size:14px; }
    .hook-item { display:flex;align-items:flex-start;gap:12px;color:#cbd5e1;font-size:14px;margin-bottom:12px;line-height:1.55; }
    .hook-num { min-width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0; }
    .kw-grid { display:flex;flex-wrap:wrap;gap:7px; }
    .kw-chip { background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.22);color:#a5b4fc;border-radius:100px;padding:5px 13px;font-size:13px;font-weight:500; }

    /* PLATFORMS SECTION */
    .platforms-section { background:rgba(15,23,42,0.8);border:1px solid rgba(245,158,11,0.2);border-radius:22px;padding:28px 22px;margin-bottom:12px; }
    .ps-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:6px; }
    .ps-title { font-weight:800;font-size:16px;color:#e2e8f0;display:flex;align-items:center;gap:8px; }
    .ps-badge { background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:3px 12px;font-size:11px;font-weight:800;color:#fff; }
    .ps-sub { color:#64748b;font-size:13px;margin-bottom:20px;line-height:1.5; }
    .platforms-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px; }
    .platform-btn { background:rgba(2,8,23,0.7);border:1.5px solid #1e293b;border-radius:14px;padding:14px 8px 12px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative; }
    .platform-btn:hover { border-color:rgba(99,102,241,0.5);transform:translateY(-2px);background:rgba(99,102,241,0.06); }
    .platform-btn.active { border-color:#6366f1;background:rgba(99,102,241,0.1); }
    .platform-btn.locked { filter:brightness(0.7); }
    .platform-logo { width:32px;height:32px;margin:0 auto 7px; }
    .platform-name { font-size:11px;font-weight:700;color:#94a3b8; }
    .lock-badge { position:absolute;top:5px;right:6px;font-size:12px; }
    .platform-detail { background:rgba(2,8,23,0.7);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:22px 18px;margin-top:14px;animation:fadeIn 0.4s ease; }
    .pd-block { margin-bottom:18px; }
    .pd-title { font-size:11px;font-weight:800;color:#a5b4fc;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.8px;display:flex;align-items:center;gap:6px; }
    .pd-text { color:#94a3b8;font-size:13px;line-height:1.75; }
    .pd-steps { display:flex;flex-direction:column;gap:6px; }
    .pd-step { display:flex;align-items:flex-start;gap:10px;background:rgba(99,102,241,0.05);border:1px solid rgba(99,102,241,0.12);border-radius:9px;padding:8px 12px;color:#cbd5e1;font-size:13px;line-height:1.5; }
    .pd-step-num { min-width:20px;height:20px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex-shrink:0;margin-top:1px; }
    .pd-chips { display:flex;flex-wrap:wrap;gap:6px; }
    .pd-chip { background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);color:#a5b4fc;border-radius:8px;padding:4px 10px;font-size:12px;font-weight:500; }
    .lock-box { text-align:center;padding:20px 16px; }
    .lock-emoji { font-size:44px;margin-bottom:12px; }
    .lock-title { font-weight:800;font-size:17px;margin-bottom:6px; }
    .lock-sub { color:#64748b;font-size:13px;margin-bottom:18px;line-height:1.6; }
    .unlock-btn { background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:12px;padding:13px 28px;color:#fff;font-weight:800;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 6px 20px rgba(245,158,11,0.3);transition:all 0.2s; }
    .unlock-btn:hover { transform:translateY(-1px); }

    /* AD OVERLAY */
    .ad-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:9000; }
    .ad-box { background:linear-gradient(180deg,#0f172a,#020817);border:1px solid #1e293b;border-radius:24px;padding:40px 32px;max-width:400px;width:92%;text-align:center;position:relative;animation:scaleIn 0.3s ease; }
    .ad-badge-top { position:absolute;top:-13px;left:50%;transform:translateX(-50%);padding:5px 18px;border-radius:100px;font-size:10px;font-weight:800;color:#fff;letter-spacing:1.5px; }
    .ad-headline { font-weight:900;font-size:22px;margin:14px 0 8px;letter-spacing:-0.3px; }
    .ad-sub { color:#94a3b8;margin-bottom:22px;font-size:14px;line-height:1.5; }
    .ad-cta { border:none;border-radius:100px;padding:12px 30px;color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:'Inter',sans-serif; }
    .ad-prog { height:3px;background:#1e293b;border-radius:100px;margin:18px 0 0;overflow:hidden; }
    .ad-prog-fill { height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);border-radius:100px;transition:width 1s linear; }
    .ad-close-btn { display:block;margin:12px auto 0;background:none;border:1px solid #2d3748;border-radius:100px;padding:8px 22px;color:#94a3b8;cursor:pointer;font-size:13px;font-family:'Inter',sans-serif;transition:all 0.2s; }
    .ad-close-btn.disabled { opacity:0.3;cursor:not-allowed; }

    /* PREMIUM MODAL */
    .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:8000;backdrop-filter:blur(8px); }
    .premium-modal { background:linear-gradient(180deg,#0f172a,#020817);border:1px solid rgba(245,158,11,0.25);border-radius:28px;padding:40px 32px;max-width:460px;width:92%;text-align:center;animation:scaleIn 0.3s ease; }
    .prem-badge { display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:6px 20px;font-size:12px;font-weight:800;color:#fff;margin-bottom:14px;letter-spacing:1px; }
    .prem-title { font-weight:900;font-size:26px;margin-bottom:6px;letter-spacing:-0.5px; }
    .prem-price { font-weight:900;font-size:42px;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px; }
    .prem-price span { font-size:15px;-webkit-text-fill-color:#94a3b8;color:#94a3b8; }
    .prem-highlight { background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:12px 16px;margin-bottom:20px;color:#10b981;font-size:13px;font-weight:600;line-height:1.6; }
    .prem-features { display:flex;flex-direction:column;gap:8px;margin-bottom:24px;text-align:left; }
    .prem-feature { color:#cbd5e1;font-size:14px;padding:9px 14px;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid rgba(255,255,255,0.05); }
    .prem-btn { width:100%;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:14px;padding:15px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;margin-bottom:10px;font-family:'Inter',sans-serif;box-shadow:0 8px 28px rgba(245,158,11,0.35);transition:all 0.2s; }
    .prem-btn:hover { transform:translateY(-1px); }
    .modal-cancel { background:none;border:none;color:#475569;font-family:'Inter',sans-serif;font-size:14px;cursor:pointer;padding:8px 0;width:100%; }
    .pay-box { background:#020817;border:1px solid #1e293b;border-radius:14px;padding:16px 18px;margin-bottom:14px;text-align:left; }
    .pay-row { display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:#94a3b8;font-size:14px; }
    .pay-row:last-child { border-bottom:none; }
    .pay-note { color:#475569;font-size:12px;margin-bottom:14px;line-height:1.6; }
    .success-box { text-align:center;padding:20px 0; }
    .success-features { background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:14px;padding:16px;margin:14px 0 22px;text-align:left; }
    .sf-item { color:#10b981;font-size:13px;padding:4px 0;font-weight:500; }
    .footer { text-align:center;padding:22px 20px;color:#334155;font-size:12px;border-top:1px solid rgba(255,255,255,0.03); }
    @media(max-width:600px){
      .navbar{padding:12px 14px;}
      .auth-card{padding:24px 18px;}
      .input-card{padding:22px 16px;}
      .dash-content{padding:28px 14px 60px;}
      .usage-pill{display:none;}
      .platforms-grid{grid-template-columns:repeat(3,1fr);gap:8px;}
      .platform-btn{padding:10px 6px 8px;}
    }
  `;

  if (screen === "loading") return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{color:"#64748b",marginTop:16,fontSize:14,fontWeight:500}}>Loading YesYouPro...</p>
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
              {STEPS.map((s, i) => (
                <div key={i} className={"ls" + (loadingStep > i ? " done" : loadingStep === i ? " active" : "")}>
                  <span>{loadingStep > i ? "✅" : loadingStep === i ? "⚙️" : "○"}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INTERSTITIAL AD */}
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
                <div className="prem-highlight">
                  🎉 After purchase you get:<br/>
                  ✅ <b>Zero ads</b> — completely ad-free experience<br/>
                  ✅ <b>30 analyses</b> valid for 7 days (recharge type)<br/>
                  ✅ <b>All platform strategies</b> unlocked
                </div>
                <div className="prem-features">
                  {["📺 Run Ads on 8+ platforms (Google, Meta, YouTube, TikTok...)", "🎬 Step-by-step Video Publishing Guide", "🔑 Platform-specific keywords & scripts", "💰 Budget recommendations & ROI tips", "🚫 No interstitial ads ever"].map(f=>(
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
                  <div className="pay-row"><span>Ads</span><span style={{color:"#10b981"}}>Zero ads</span></div>
                  <div className="pay-row"><span>Platforms</span><span style={{color:"#10b981"}}>All 8 unlocked</span></div>
                </div>
                <p className="pay-note">⚠️ Integrate Razorpay SDK for real payments.<br/>This demo simulates payment success.</p>
                <button className="prem-btn" onClick={activatePremium}>💳 Pay ₹149 (Demo)</button>
                <button className="modal-cancel" onClick={()=>setShowPayment(false)}>← Back</button>
              </>
            ) : paymentStep==="processing" ? (
              <div style={{textAlign:"center",padding:48}}>
                <div className="spinner" style={{margin:"0 auto"}}/>
                <p style={{color:"#94a3b8",marginTop:20}}>Processing payment...</p>
              </div>
            ) : (
              <div className="success-box">
                <div style={{fontSize:64,marginBottom:12}}>🎉</div>
                <h2 className="prem-title">Premium Activated!</h2>
                <div className="success-features">
                  <div className="sf-item">✅ 0 ads — completely ad-free</div>
                  <div className="sf-item">✅ 30 analyses available (7 days)</div>
                  <div className="sf-item">✅ All 8 platform strategies unlocked</div>
                  <div className="sf-item">✅ Video publishing guides included</div>
                </div>
                <button className="prem-btn" onClick={()=>{setShowPremium(false);setShowPayment(false);setPaymentStep("form");}}>🚀 Start Analyzing →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTH */}
      {screen === "auth" && (
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-brand">
              <div className="auth-brand-icon">🧠</div>
              <div className="auth-brand-name">YesYouPro</div>
            </div>
            <p className="auth-tagline">AI-powered product intelligence platform</p>

            {savedAccounts.length>0 && authMode==="login" && (
              <div className="saved-section">
                <div className="saved-label">Quick Login</div>
                {savedAccounts.map(acc=>(
                  <div key={acc.email} className="account-chip" onClick={()=>quickLogin(acc)}>
                    <div className="account-avatar">{acc.name?.[0]?.toUpperCase()||"U"}</div>
                    <div className="account-info">
                      <div className="account-name">{acc.name}</div>
                      <div className="account-email">{acc.email}</div>
                      <div className="account-pass">{"●".repeat(Math.min(acc.password?.length||6,8))}</div>
                    </div>
                    <div style={{color:"#6366f1",fontSize:20,fontWeight:700}}>→</div>
                  </div>
                ))}
                <div className="divider"><div className="divider-line"/><div className="divider-text">or login manually</div><div className="divider-line"/></div>
              </div>
            )}

            <div className="auth-tabs">
              {["login","signup"].map(m=>(
                <button key={m} className={"auth-tab"+(authMode===m?" active":"")} onClick={()=>{setAuthMode(m);setError("");}}>
                  {m==="login"?"Login":"Sign Up"}
                </button>
              ))}
            </div>

            <button className="google-btn" onClick={()=>showToast("Google Sign-in: Add Firebase Auth to enable")}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div className="divider"><div className="divider-line"/><div className="divider-text">or use email</div><div className="divider-line"/></div>

            {authMode==="signup" && <input className="inp" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}
            <input className="inp" placeholder="Email Address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <input className="inp" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
            {error && <p className="err-text">{error}</p>}
            <button className="primary-btn" onClick={handleAuth}>{authMode==="login"?"🚀 Login to YesYouPro":"✨ Create Free Account"}</button>
            <p className="auth-switch">
              {authMode==="login"?"No account? ":"Have account? "}
              <span className="auth-link" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setError("");}}>{authMode==="login"?"Sign up free":"Login"}</span>
            </p>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {screen==="dashboard" && (
        <div>
          <nav className="navbar">
            <div className="nav-logo">🧠 YesYouPro</div>
            {usageInfo && (
              <div className="usage-pill">
                <span style={{color:usageInfo.plan==="premium"?"#f59e0b":"#94a3b8",fontWeight:700}}>{usageInfo.plan==="premium"?"💎 Premium":"🆓 Free"}</span>
                <span className="pill-divider">|</span>
                <span style={{color:usageInfo.remaining>0?"#10b981":"#ef4444",fontWeight:700}}>{usageInfo.remaining} left</span>
              </div>
            )}
            <div className="nav-right">
              {(user?.plan||"free")==="free" && <button className="upgrade-btn" onClick={()=>setShowPremium(true)}>💎 Upgrade</button>}
              <div className="avatar" title={user?.email}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
              <button className="logout-btn" onClick={logout}>Exit</button>
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
                🚀 Get AI Analysis {(user?.plan||"free")==="free"&&<span className="ad-note">· Ad plays first</span>}
              </button>
              {(user?.plan||"free")==="free"&&(
                <p className="free-note">Free: {usageInfo?.remaining??FREE_DAILY_LIMIT}/{FREE_DAILY_LIMIT} today · <span className="upg-link" onClick={()=>setShowPremium(true)}>Upgrade — no ads + 30 analyses + all platforms →</span></p>
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
                  {analysis.hooks?.map((h,i)=>(
                    <div key={i} className="hook-item"><span className="hook-num">{i+1}</span><span>{h}</span></div>
                  ))}
                </div>

                <div className="glass-card">
                  <h4 className="gc-title">🔑 SEO Keywords</h4>
                  <div className="kw-grid">{analysis.keywords?.map((k,i)=><div key={i} className="kw-chip">{k}</div>)}</div>
                </div>

                {/* RUN ADS ON ALL PLATFORMS */}
                <div className="platforms-section">
                  <div className="ps-header">
                    <div className="ps-title">📺 Run Ads + Publish Content</div>
                    {(user?.plan||"free")==="free"&&<div className="ps-badge">🔒 PREMIUM</div>}
                  </div>
                  <p className="ps-sub">Complete ad strategy + step-by-step video publishing guide for every platform — account setup to going live</p>

                  <div className="platforms-grid">
                    {PLATFORMS.map(p=>(
                      <div key={p.id} className={"platform-btn"+(selectedPlatform===p.id?" active":"")+((user?.plan||"free")==="free"?" locked":"")} onClick={()=>fetchPlatformData(p.id)} style={{borderColor:selectedPlatform===p.id?p.color:undefined}}>
                        {(user?.plan||"free")==="free"&&<div className="lock-badge">🔒</div>}
                        <div className="platform-logo" dangerouslySetInnerHTML={{__html:p.logo}}/>
                        <div className="platform-name">{p.name}</div>
                      </div>
                    ))}
                  </div>

                  {selectedPlatform && (user?.plan||"free")==="premium" && (
                    <div className="platform-detail">
                      {platformLoading ? (
                        <div style={{textAlign:"center",padding:24}}>
                          <div className="spinner" style={{margin:"0 auto 10px"}}/>
                          <p style={{color:"#64748b",fontSize:13}}>Generating complete strategy...</p>
                        </div>
                      ) : platformData[selectedPlatform] ? (() => {
                        const d = platformData[selectedPlatform];
                        return (
                          <>
                            {d.account_setup && (
                              <div className="pd-block">
                                <div className="pd-title">🏗️ Account Setup Steps</div>
                                <div className="pd-steps">{d.account_setup.split("\n").filter(Boolean).map((s,i)=>(
                                  <div key={i} className="pd-step"><span className="pd-step-num">{i+1}</span><span>{s.replace(/^\d+[\.\)]\s*/,"")}</span></div>
                                ))}</div>
                              </div>
                            )}
                            {d.targeting && (
                              <div className="pd-block">
                                <div className="pd-title">🎯 Targeting Strategy</div>
                                <div className="pd-text">{d.targeting}</div>
                              </div>
                            )}
                            {d.ad_keywords?.length>0 && (
                              <div className="pd-block">
                                <div className="pd-title">🔑 Keywords</div>
                                <div className="pd-chips">{d.ad_keywords.map((k,i)=><div key={i} className="pd-chip">{k}</div>)}</div>
                              </div>
                            )}
                            {d.script && (
                              <div className="pd-block">
                                <div className="pd-title">📝 Ad Script / Caption</div>
                                <div className="pd-text" style={{background:"rgba(99,102,241,0.06)",padding:14,borderRadius:10,border:"1px solid rgba(99,102,241,0.15)",lineHeight:1.75}}>{d.script}</div>
                              </div>
                            )}
                            {d.video_steps && (
                              <div className="pd-block">
                                <div className="pd-title">🎬 Video Publishing Steps</div>
                                <div className="pd-steps">{d.video_steps.split("\n").filter(Boolean).map((s,i)=>(
                                  <div key={i} className="pd-step"><span className="pd-step-num">{i+1}</span><span>{s.replace(/^\d+[\.\)]\s*/,"")}</span></div>
                                ))}</div>
                              </div>
                            )}
                            {d.title && (
                              <div className="pd-block">
                                <div className="pd-title">📌 Best Title / Headline</div>
                                <div className="pd-text" style={{fontWeight:700,color:"#e2e8f0",fontSize:15}}>{d.title}</div>
                              </div>
                            )}
                            {d.budget && (
                              <div className="pd-block">
                                <div className="pd-title">💰 Budget & ROI</div>
                                <div className="pd-text">{d.budget}</div>
                              </div>
                            )}
                          </>
                        );
                      })() : null}
                    </div>
                  )}

                  {(user?.plan||"free")==="free" && (
                    <div className="lock-box">
                      <div className="lock-emoji">🔒</div>
                      <div className="lock-title">Premium Feature</div>
                      <div className="lock-sub">Unlock complete ad strategies + video publishing guides for Google, Facebook, Instagram, YouTube, TikTok, Pinterest, Snapchat & X</div>
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
