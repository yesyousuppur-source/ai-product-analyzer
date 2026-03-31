import { useState, useEffect, useRef } from "react";

const FREE_DAILY_LIMIT = 3;
const PREMIUM_TOTAL_LIMIT = 30;
const PREMIUM_DAYS = 7;

const ADS = [
  { headline: "Scale Your Business Fast", sub: "Find winning products 10x faster with AI", cta: "Try Now Free", color: "#f59e0b" },
  { headline: "AI Marketing Suite", sub: "Auto-generate ads, copy and creatives", cta: "Start Free Trial", color: "#8b5cf6" },
  { headline: "Shopify Store Experts", sub: "Build your store in 48 hours", cta: "Book a Call", color: "#06b6d4" },
];

const PLATFORMS = [
  { id: "google_ads", name: "Google Ads", icon: "🔍", color: "#4285f4" },
  { id: "facebook", name: "Facebook Ads", icon: "📘", color: "#1877f2" },
  { id: "instagram", name: "Instagram Ads", icon: "📸", color: "#e1306c" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "#ff0000" },
  { id: "tiktok", name: "TikTok Ads", icon: "🎵", color: "#010101" },
  { id: "amazon", name: "Amazon PPC", icon: "📦", color: "#ff9900" },
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
  const [error, setError] = useState("");
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [adIdx, setAdIdx] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form");
  const [usageInfo, setUsageInfo] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedAdPlatform, setSelectedAdPlatform] = useState(null);
  const [adPlatformData, setAdPlatformData] = useState({});
  const [adPlatformLoading, setAdPlatformLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const adIntervalRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    const saved = store.get("apa_user");
    const accounts = store.get("apa_saved_accounts") || [];
    setSavedAccounts(accounts);
    if (saved) { setUser(saved); setUsageInfo(getUsageInfo(saved)); setScreen("dashboard"); }
    else setScreen("auth");
  }, []);

  useEffect(() => {
    if (loading) {
      dotsRef.current = setInterval(() => {
        setLoadingDots(d => d.length >= 3 ? "" : d + ".");
      }, 400);
    } else {
      clearInterval(dotsRef.current);
      setLoadingDots("");
    }
    return () => clearInterval(dotsRef.current);
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
    if (info.remaining <= 0) return {
      allowed: false,
      reason: info.plan === "free" ? "Daily limit reached (3/day). Upgrade to Premium!" : "Premium limit reached (30/7 days). Please recharge."
    };
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
      // Save account for quick login
      const accounts = store.get("apa_saved_accounts") || [];
      if (!accounts.find(a => a.email === form.email)) {
        accounts.push({ email: form.email, name: form.name, password: form.password });
        store.set("apa_saved_accounts", accounts);
        setSavedAccounts(accounts);
      }
      setUser(newUser); setUsageInfo(getUsageInfo(newUser)); setScreen("dashboard");
    } else {
      const found = users[form.email];
      if (!found || found.password !== form.password) { setError("Invalid email or password"); return; }
      const u = { email: found.email, name: found.name, plan: found.plan || "free" };
      // Save/update account
      const accounts = store.get("apa_saved_accounts") || [];
      const idx = accounts.findIndex(a => a.email === form.email);
      if (idx >= 0) accounts[idx] = { email: found.email, name: found.name, password: form.password };
      else accounts.push({ email: found.email, name: found.name, password: form.password });
      store.set("apa_saved_accounts", accounts);
      setSavedAccounts(accounts);
      store.set("apa_user", u);
      setUser(u); setUsageInfo(getUsageInfo(u)); setScreen("dashboard");
    }
  };

  const quickLogin = (account) => {
    const users = store.get("apa_users") || {};
    const found = users[account.email];
    if (!found) { setError("Account not found"); return; }
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
    if (!productForm.name || !productForm.category || !productForm.platform) {
      setError("Please fill all product fields"); return;
    }
    setError("");
    const check = checkLimit(user);
    if (!check.allowed) { setError(check.reason); return; }
    // Always show ad for free users
    if ((user?.plan || "free") === "free") await showInterstitialAd();
    setLoading(true); setAnalysis(null); setSelectedAdPlatform(null); setAdPlatformData({});
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
      showToast("Analysis complete!");
    } catch (e) {
      setError("Analysis failed: " + e.message);
    }
    setLoading(false);
  };

  const fetchAdPlatformData = async (platformId) => {
    if ((user?.plan || "free") !== "premium") { setShowPremium(true); return; }
    if (adPlatformData[platformId]) { setSelectedAdPlatform(platformId); return; }
    setSelectedAdPlatform(platformId);
    setAdPlatformLoading(true);
    try {
      const platform = PLATFORMS.find(p => p.id === platformId);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productForm.name,
          category: productForm.category,
          platform: platform.name,
          mode: "ads_platform",
          platformId
        }),
      });
      const data = await res.json();
      setAdPlatformData(prev => ({ ...prev, [platformId]: data }));
    } catch (e) {
      showToast("Failed to fetch platform data");
    }
    setAdPlatformLoading(false);
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
    showToast("Premium activated!");
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const logout = () => { store.set("apa_user", null); setUser(null); setAnalysis(null); setUsageInfo(null); setScreen("auth"); };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #020817; font-family: 'Inter', sans-serif; color: #f8fafc; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes scaleIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }
    .fade-in { animation: fadeIn 0.5s ease; }
    .scale-in { animation: scaleIn 0.3s ease; }
    .loading-screen { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:radial-gradient(ellipse at center, #1e1b4b 0%, #020817 70%); }
    .spinner { width:40px; height:40px; border:3px solid rgba(99,102,241,0.2); border-top:3px solid #6366f1; border-radius:50%; animation:spin 0.8s linear infinite; }
    .toast { position:fixed; top:24px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#10b981,#059669); color:#fff; padding:12px 28px; border-radius:100px; font-size:14px; font-weight:500; z-index:9999; box-shadow:0 8px 32px rgba(16,185,129,0.4); animation:fadeIn 0.3s ease; }

    /* AUTH */
    .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; background:radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.15) 0%, transparent 50%), #020817; }
    .auth-card { background:rgba(15,23,42,0.95); border:1px solid rgba(99,102,241,0.2); border-radius:24px; padding:40px 36px; width:100%; max-width:440px; backdrop-filter:blur(20px); box-shadow:0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05); }
    .auth-brand { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:8px; }
    .auth-brand-icon { width:44px; height:44px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; }
    .auth-brand-name { font-size:20px; font-weight:800; background:linear-gradient(135deg,#6366f1,#a855f7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .auth-tagline { color:#64748b; font-size:14px; text-align:center; margin-bottom:28px; }
    .auth-tabs { display:flex; background:#0f172a; border-radius:14px; padding:4px; margin-bottom:24px; border:1px solid #1e293b; }
    .auth-tab { flex:1; padding:10px 0; background:none; border:none; color:#64748b; font-size:14px; font-weight:500; cursor:pointer; border-radius:11px; transition:all 0.2s; font-family:'Inter',sans-serif; }
    .auth-tab.active { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; box-shadow:0 4px 12px rgba(99,102,241,0.4); }
    .inp { width:100%; background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:13px 16px; color:#f8fafc; font-size:14px; font-family:'Inter',sans-serif; margin-bottom:12px; outline:none; transition:all 0.2s; }
    .inp:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
    .sel { cursor:pointer; }
    .err-text { color:#ef4444; font-size:13px; text-align:center; margin-bottom:10px; padding:8px 12px; background:rgba(239,68,68,0.1); border-radius:8px; border:1px solid rgba(239,68,68,0.2); }
    .primary-btn { width:100%; background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; border-radius:12px; padding:14px 0; color:#fff; font-weight:700; font-size:15px; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 20px rgba(99,102,241,0.4); font-family:'Inter',sans-serif; letter-spacing:0.3px; }
    .primary-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(99,102,241,0.5); }
    .google-btn { width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:13px 0; color:#1e293b; font-weight:600; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:12px; transition:all 0.2s; font-family:'Inter',sans-serif; }
    .google-btn:hover { background:#f8fafc; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
    .divider { display:flex; align-items:center; gap:12px; margin:16px 0; }
    .divider-line { flex:1; height:1px; background:#1e293b; }
    .divider-text { color:#475569; font-size:12px; }
    .auth-switch { color:#475569; font-size:13px; text-align:center; margin-top:16px; }
    .auth-link { color:#6366f1; cursor:pointer; font-weight:600; }

    /* SAVED ACCOUNTS */
    .saved-accounts { margin-bottom:16px; }
    .saved-label { color:#64748b; font-size:12px; margin-bottom:8px; font-weight:500; text-transform:uppercase; letter-spacing:0.5px; }
    .account-chip { display:flex; align-items:center; gap:10px; background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:10px 14px; margin-bottom:8px; cursor:pointer; transition:all 0.2s; }
    .account-chip:hover { border-color:#6366f1; background:#1e293b; }
    .account-avatar { width:32px; height:32px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; flex-shrink:0; }
    .account-info { flex:1; }
    .account-name { font-size:13px; font-weight:600; color:#e2e8f0; }
    .account-email { font-size:11px; color:#64748b; }
    .account-pass { font-size:11px; color:#475569; }

    /* DASHBOARD */
    .dashboard { min-height:100vh; }
    .navbar { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-bottom:1px solid rgba(255,255,255,0.05); background:rgba(2,8,23,0.9); backdrop-filter:blur(20px); position:sticky; top:0; z-index:100; }
    .nav-logo { font-weight:900; font-size:18px; background:linear-gradient(135deg,#6366f1,#a855f7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .usage-pill { background:rgba(15,23,42,0.9); border:1px solid #1e293b; border-radius:100px; padding:7px 16px; font-size:13px; display:flex; align-items:center; gap:8px; }
    .pill-divider { color:#334155; }
    .nav-right { display:flex; align-items:center; gap:8px; }
    .upgrade-btn { background:linear-gradient(135deg,#f59e0b,#ef4444); border:none; border-radius:100px; padding:8px 16px; color:#fff; font-weight:700; font-size:13px; cursor:pointer; font-family:'Inter',sans-serif; box-shadow:0 4px 12px rgba(245,158,11,0.3); }
    .avatar { width:36px; height:36px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; box-shadow:0 4px 12px rgba(99,102,241,0.3); }
    .logout-btn { background:none; border:1px solid #1e293b; border-radius:8px; padding:7px 12px; color:#475569; font-size:12px; cursor:pointer; font-family:'Inter',sans-serif; }
    .dash-content { max-width:880px; margin:0 auto; padding:44px 20px 100px; }
    .hero { text-align:center; margin-bottom:48px; }
    .hero-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.3); border-radius:100px; padding:6px 16px; font-size:12px; color:#a5b4fc; font-weight:600; margin-bottom:20px; }
    .hero-title { font-weight:900; font-size:clamp(28px,5vw,52px); line-height:1.1; margin-bottom:16px; letter-spacing:-1px; }
    .grad-text { background:linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .hero-sub { color:#64748b; font-size:16px; max-width:540px; margin:0 auto; line-height:1.6; }

    /* INPUT CARD */
    .input-card { background:rgba(15,23,42,0.8); border:1px solid rgba(99,102,241,0.15); border-radius:24px; padding:32px 28px; margin-bottom:40px; backdrop-filter:blur(12px); box-shadow:0 8px 32px rgba(0,0,0,0.3); }
    .card-title { font-weight:700; font-size:18px; margin-bottom:24px; color:#e2e8f0; }
    .input-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-bottom:20px; }
    .inp-group { display:flex; flex-direction:column; }
    .inp-label { font-size:11px; color:#64748b; margin-bottom:7px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px; }
    .error-banner { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:12px; padding:12px 16px; color:#ef4444; font-size:13px; margin-bottom:16px; }
    .upg-link { color:#f59e0b; cursor:pointer; font-weight:700; }

    /* ANALYZE BUTTON */
    .analyze-btn { width:100%; background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%); border:none; border-radius:16px; padding:17px 0; color:#fff; font-weight:800; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow:0 8px 32px rgba(99,102,241,0.4); transition:all 0.2s; font-family:'Inter',sans-serif; letter-spacing:0.3px; position:relative; overflow:hidden; }
    .analyze-btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent); transition:left 0.5s; }
    .analyze-btn:hover::before { left:100%; }
    .analyze-btn:hover:not(.loading) { transform:translateY(-2px); box-shadow:0 12px 40px rgba(99,102,241,0.5); }
    .analyze-btn.loading { opacity:0.8; cursor:not-allowed; }
    .btn-spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.3); border-top:2px solid #fff; border-radius:50%; display:inline-block; animation:spin 0.7s linear infinite; }
    .ad-note { font-size:12px; opacity:0.65; font-weight:400; }
    .free-note { font-size:12px; color:#475569; text-align:center; margin-top:12px; }

    /* LOADING OVERLAY */
    .loading-overlay { position:fixed; inset:0; background:rgba(2,8,23,0.95); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:7000; backdrop-filter:blur(8px); }
    .loading-card { background:rgba(15,23,42,0.9); border:1px solid rgba(99,102,241,0.3); border-radius:24px; padding:48px 40px; text-align:center; max-width:380px; width:90%; box-shadow:0 32px 64px rgba(0,0,0,0.5); }
    .loading-icon { font-size:56px; margin-bottom:20px; animation:pulse 1.5s ease infinite; }
    .loading-title { font-weight:800; font-size:22px; margin-bottom:8px; }
    .loading-sub { color:#64748b; font-size:14px; margin-bottom:28px; }
    .loading-steps { display:flex; flex-direction:column; gap:10px; text-align:left; }
    .loading-step { display:flex; align-items:center; gap:12px; color:#94a3b8; font-size:13px; padding:8px 12px; background:rgba(99,102,241,0.05); border-radius:8px; border:1px solid rgba(99,102,241,0.1); }
    .step-active { color:#a5b4fc; border-color:rgba(99,102,241,0.3); background:rgba(99,102,241,0.1); }
    .step-done { color:#10b981; border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.05); }
    .step-icon { font-size:16px; }

    /* RESULTS */
    .results-title { font-weight:800; font-size:24px; margin-bottom:28px; }
    .metrics-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:14px; margin-bottom:20px; }
    .metric-card { background:rgba(15,23,42,0.8); border:1px solid #1e293b; border-radius:18px; padding:22px 18px; position:relative; overflow:hidden; transition:transform 0.2s; }
    .metric-card:hover { transform:translateY(-2px); }
    .metric-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#6366f1,#a855f7); }
    .metric-label { font-size:12px; color:#64748b; margin-bottom:10px; font-weight:600; }
    .metric-val { font-weight:900; font-size:22px; }
    .two-col { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; margin-bottom:14px; }
    .glass-card { background:rgba(15,23,42,0.7); border:1px solid #1e293b; border-radius:18px; padding:24px 22px; margin-bottom:14px; transition:border-color 0.2s; }
    .glass-card:hover { border-color:rgba(99,102,241,0.3); }
    .gc-title { font-weight:700; font-size:15px; margin-bottom:14px; color:#e2e8f0; display:flex; align-items:center; gap:8px; }
    .gc-text { color:#94a3b8; line-height:1.75; font-size:14px; }
    .hook-item { display:flex; align-items:flex-start; gap:12px; color:#cbd5e1; font-size:14px; margin-bottom:12px; line-height:1.55; }
    .hook-num { min-width:28px; height:28px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; box-shadow:0 4px 8px rgba(99,102,241,0.3); }
    .kw-grid { display:flex; flex-wrap:wrap; gap:8px; }
    .kw-chip { background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.25); color:#a5b4fc; border-radius:100px; padding:6px 14px; font-size:13px; font-weight:500; transition:all 0.2s; cursor:default; }
    .kw-chip:hover { background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.5); }

    /* RUN ADS SECTION */
    .ads-section { background:rgba(15,23,42,0.8); border:1px solid rgba(245,158,11,0.2); border-radius:20px; padding:28px 24px; margin-bottom:14px; }
    .ads-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
    .ads-title { font-weight:700; font-size:16px; color:#e2e8f0; display:flex; align-items:center; gap:8px; }
    .ads-badge { background:linear-gradient(135deg,#f59e0b,#ef4444); border-radius:100px; padding:3px 10px; font-size:11px; font-weight:700; color:#fff; }
    .ads-sub { color:#64748b; font-size:13px; margin-bottom:20px; }
    .platforms-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
    .platform-btn { background:rgba(15,23,42,0.9); border:1px solid #1e293b; border-radius:14px; padding:14px 10px; text-align:center; cursor:pointer; transition:all 0.2s; position:relative; }
    .platform-btn:hover { border-color:rgba(99,102,241,0.4); transform:translateY(-1px); }
    .platform-btn.active { border-color:#6366f1; background:rgba(99,102,241,0.1); }
    .platform-btn.locked { opacity:0.6; }
    .platform-icon { font-size:24px; margin-bottom:6px; }
    .platform-name { font-size:12px; font-weight:600; color:#cbd5e1; }
    .lock-icon { position:absolute; top:6px; right:6px; font-size:11px; }
    .platform-data { background:rgba(2,8,23,0.6); border:1px solid rgba(99,102,241,0.2); border-radius:14px; padding:20px; margin-top:14px; animation:fadeIn 0.4s ease; }
    .pd-section { margin-bottom:16px; }
    .pd-title { font-size:13px; font-weight:700; color:#a5b4fc; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
    .pd-content { color:#94a3b8; font-size:13px; line-height:1.7; }
    .pd-chips { display:flex; flex-wrap:wrap; gap:6px; }
    .pd-chip { background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); color:#a5b4fc; border-radius:8px; padding:4px 10px; font-size:12px; }
    .premium-lock-box { text-align:center; padding:24px; }
    .lock-big { font-size:40px; margin-bottom:12px; }
    .lock-title { font-weight:700; font-size:16px; margin-bottom:6px; }
    .lock-sub { color:#64748b; font-size:13px; margin-bottom:16px; }

    /* AD OVERLAY */
    .ad-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.95); display:flex; align-items:center; justify-content:center; z-index:9000; backdrop-filter:blur(10px); }
    .ad-box { background:linear-gradient(180deg,#0f172a,#020817); border:1px solid #1e293b; border-radius:24px; padding:44px 36px; max-width:420px; width:90%; text-align:center; position:relative; box-shadow:0 32px 64px rgba(0,0,0,0.6); animation:scaleIn 0.3s ease; }
    .ad-badge { position:absolute; top:-13px; left:50%; transform:translateX(-50%); padding:5px 18px; border-radius:100px; font-size:11px; font-weight:800; color:#fff; letter-spacing:1px; }
    .ad-headline { font-weight:900; font-size:24px; margin:16px 0 10px; letter-spacing:-0.5px; }
    .ad-sub { color:#94a3b8; margin-bottom:24px; font-size:15px; line-height:1.5; }
    .ad-cta { border:none; border-radius:100px; padding:13px 32px; color:#fff; font-weight:700; font-size:15px; cursor:pointer; font-family:'Inter',sans-serif; }
    .ad-timer-bar { height:3px; background:#1e293b; border-radius:100px; margin:20px 0 0; overflow:hidden; }
    .ad-timer-fill { height:100%; background:linear-gradient(90deg,#6366f1,#a855f7); border-radius:100px; transition:width 1s linear; }
    .ad-close { display:block; margin:14px auto 0; background:none; border:1px solid #334155; border-radius:100px; padding:9px 24px; color:#94a3b8; cursor:pointer; font-size:13px; font-family:'Inter',sans-serif; transition:all 0.2s; }
    .ad-close.disabled { opacity:0.35; cursor:not-allowed; }

    /* PREMIUM MODAL */
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.88); display:flex; align-items:center; justify-content:center; z-index:8000; backdrop-filter:blur(10px); }
    .premium-modal { background:linear-gradient(180deg,#0f172a 0%,#020817 100%); border:1px solid rgba(245,158,11,0.2); border-radius:28px; padding:44px 36px; max-width:460px; width:92%; text-align:center; box-shadow:0 32px 64px rgba(0,0,0,0.6); animation:scaleIn 0.3s ease; }
    .premium-badge { display:inline-block; background:linear-gradient(135deg,#f59e0b,#ef4444); border-radius:100px; padding:6px 20px; font-size:12px; font-weight:800; color:#fff; margin-bottom:16px; letter-spacing:1px; }
    .modal-title { font-weight:900; font-size:28px; margin-bottom:8px; letter-spacing:-0.5px; }
    .premium-price { font-weight:900; font-size:44px; background:linear-gradient(135deg,#f59e0b,#ef4444); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:28px; }
    .premium-price span { font-size:16px; color:#94a3b8; -webkit-text-fill-color:#94a3b8; }
    .features-list { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; text-align:left; }
    .feature-item { color:#cbd5e1; font-size:14px; padding:10px 16px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid rgba(255,255,255,0.05); }
    .premium-btn { width:100%; background:linear-gradient(135deg,#f59e0b,#ef4444); border:none; border-radius:14px; padding:16px 0; color:#fff; font-weight:800; font-size:16px; cursor:pointer; margin-bottom:12px; font-family:'Inter',sans-serif; box-shadow:0 8px 32px rgba(245,158,11,0.35); transition:all 0.2s; }
    .premium-btn:hover { transform:translateY(-1px); box-shadow:0 12px 40px rgba(245,158,11,0.45); }
    .modal-cancel { background:none; border:none; color:#475569; font-family:'Inter',sans-serif; font-size:14px; cursor:pointer; padding:8px 0; width:100%; }
    .payment-box { background:#020817; border:1px solid #1e293b; border-radius:14px; padding:18px 20px; margin-bottom:16px; text-align:left; }
    .pay-row { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); color:#94a3b8; font-size:14px; }
    .pay-row:last-child { border-bottom:none; }
    .pay-note { color:#475569; font-size:12px; margin-bottom:16px; line-height:1.5; }
    .footer { text-align:center; padding:24px 20px; color:#334155; font-size:12px; border-top:1px solid rgba(255,255,255,0.04); }
    @media (max-width:600px) {
      .navbar { padding:12px 16px; }
      .auth-card { padding:28px 20px; }
      .input-card { padding:22px 16px; }
      .dash-content { padding:28px 14px 60px; }
      .usage-pill { display:none; }
      .platforms-grid { grid-template-columns:repeat(2,1fr); }
    }
  `;

  // Loading screen
  if (screen === "loading") return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{color:"#64748b",marginTop:16,fontSize:14}}>Loading YesYouPro...</p>
      </div>
    </>
  );

  // Calculate ad timer width
  const adTimerWidth = ((5 - adTimer) / 5) * 100;

  return (
    <>
      <style>{css}</style>

      {toast && <div className="toast">{toast}</div>}

      {/* LOADING OVERLAY - Premium Design */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-card scale-in">
            <div className="loading-icon">🧠</div>
            <h2 className="loading-title">Analyzing Product{loadingDots}</h2>
            <p className="loading-sub">ChatGPT is processing your request</p>
            <div className="loading-steps">
              <div className="loading-step step-done"><span className="step-icon">✅</span> Product data received</div>
              <div className="loading-step step-active"><span className="step-icon"><span style={{display:'inline-block',animation:'spin 0.8s linear infinite'}}>⚙️</span></span> AI analyzing market trends{loadingDots}</div>
              <div className="loading-step"><span className="step-icon">📊</span> Generating insights</div>
              <div className="loading-step"><span className="step-icon">🎯</span> Creating viral hooks</div>
            </div>
          </div>
        </div>
      )}

      {/* INTERSTITIAL AD */}
      {showAd && (
        <div className="ad-overlay">
          <div className="ad-box">
            <div className="ad-badge" style={{ background: ADS[adIdx].color }}>ADVERTISEMENT</div>
            <div style={{ paddingTop: 8 }}>
              <div style={{ fontSize: 52, marginBottom: 4 }}>📢</div>
              <h2 className="ad-headline">{ADS[adIdx].headline}</h2>
              <p className="ad-sub">{ADS[adIdx].sub}</p>
              <button className="ad-cta" style={{ background: ADS[adIdx].color, boxShadow: `0 8px 24px ${ADS[adIdx].color}66` }}>{ADS[adIdx].cta}</button>
            </div>
            <div className="ad-timer-bar">
              <div className="ad-timer-fill" style={{ width: adTimerWidth + "%" }} />
            </div>
            <button onClick={closeAd} className={"ad-close" + (adTimer > 0 ? " disabled" : "")}>
              {adTimer > 0 ? "⏳ Skip in " + adTimer + "s" : "✕ Close & Continue"}
            </button>
          </div>
        </div>
      )}

      {/* PREMIUM MODAL */}
      {showPremium && (
        <div className="modal-overlay" onClick={() => { if (paymentStep === "form") { setShowPremium(false); setShowPayment(false); setPaymentStep("form"); } }}>
          <div className="premium-modal" onClick={e => e.stopPropagation()}>
            {!showPayment ? (
              <>
                <div className="premium-badge">💎 PREMIUM PLAN</div>
                <h2 className="modal-title">Unlock Everything</h2>
                <div className="premium-price">₹149 <span>/ 7 days</span></div>
                <div className="features-list">
                  {["✅ 30 analyses in 7 days","✅ Zero ads — ever","✅ Full Platform Ad Strategy (locked for free)","✅ Google, Meta, YouTube, TikTok guides","✅ Priority AI processing","✅ All future features"].map(f => (
                    <div key={f} className="feature-item">{f}</div>
                  ))}
                </div>
                <button className="premium-btn" onClick={() => setShowPayment(true)}>🔓 Unlock Premium — ₹149</button>
                <button className="modal-cancel" onClick={() => setShowPremium(false)}>Maybe later</button>
              </>
            ) : paymentStep === "form" ? (
              <>
                <h2 className="modal-title">Complete Payment</h2>
                <div className="payment-box">
                  <div className="pay-row"><span>Plan</span><span>Premium 7-day</span></div>
                  <div className="pay-row"><span>Amount</span><span style={{color:"#f59e0b",fontWeight:700}}>₹149</span></div>
                  <div className="pay-row"><span>Analyses</span><span>30 total</span></div>
                  <div className="pay-row"><span>Platform Guides</span><span style={{color:"#10b981"}}>All Unlocked</span></div>
                </div>
                <p className="pay-note">⚠️ Integrate Razorpay for real payments.<br/>This demo simulates payment success.</p>
                <button className="premium-btn" onClick={activatePremium}>💳 Pay ₹149 (Demo)</button>
                <button className="modal-cancel" onClick={() => setShowPayment(false)}>← Back</button>
              </>
            ) : paymentStep === "processing" ? (
              <div style={{textAlign:"center",padding:48}}>
                <div className="spinner" style={{margin:"0 auto"}} />
                <p style={{color:"#94a3b8",marginTop:20,fontSize:15}}>Processing payment...</p>
              </div>
            ) : (
              <div style={{textAlign:"center",padding:32}}>
                <div style={{fontSize:64,marginBottom:16}}>🎉</div>
                <h2 className="modal-title">Premium Activated!</h2>
                <p style={{color:"#10b981",margin:"10px 0 24px",fontSize:15}}>30 analyses · 7 days · No ads · All platforms unlocked</p>
                <button className="premium-btn" onClick={() => { setShowPremium(false); setShowPayment(false); setPaymentStep("form"); }}>🚀 Start Analyzing →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTH SCREEN */}
      {screen === "auth" && (
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-brand">
              <div className="auth-brand-icon">🧠</div>
              <div className="auth-brand-name">YesYouPro</div>
            </div>
            <p className="auth-tagline">AI-powered product intelligence platform</p>

            {/* SAVED ACCOUNTS - Quick Login */}
            {savedAccounts.length > 0 && authMode === "login" && (
              <div className="saved-accounts">
                <div className="saved-label">Quick Login</div>
                {savedAccounts.map(acc => (
                  <div key={acc.email} className="account-chip" onClick={() => quickLogin(acc)}>
                    <div className="account-avatar">{acc.name?.[0]?.toUpperCase() || "U"}</div>
                    <div className="account-info">
                      <div className="account-name">{acc.name}</div>
                      <div className="account-email">{acc.email}</div>
                      <div className="account-pass">{"●".repeat(Math.min(acc.password?.length || 6, 8))}</div>
                    </div>
                    <div style={{color:"#6366f1",fontSize:18}}>→</div>
                  </div>
                ))}
                <div className="divider">
                  <div className="divider-line" />
                  <div className="divider-text">or login manually</div>
                  <div className="divider-line" />
                </div>
              </div>
            )}

            <div className="auth-tabs">
              {["login","signup"].map(m => (
                <button key={m} className={"auth-tab"+(authMode===m?" active":"")} onClick={() => { setAuthMode(m); setError(""); }}>
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Google Button (UI only) */}
            <button className="google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.14z"/><path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.46 3.44 1.35l2.56-2.56A8 8 0 0 0 1.83 5.44L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92z"/></svg>
              Continue with Google
            </button>

            <div className="divider">
              <div className="divider-line" />
              <div className="divider-text">or use email</div>
              <div className="divider-line" />
            </div>

            {authMode === "signup" && <input className="inp" placeholder="Full Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />}
            <input className="inp" placeholder="Email Address" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
            <input className="inp" placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
            {error && <p className="err-text">{error}</p>}
            <button className="primary-btn" onClick={handleAuth}>
              {authMode === "login" ? "🚀 Login to YesYouPro" : "✨ Create Free Account"}
            </button>
            <p className="auth-switch">
              {authMode === "login" ? "No account? " : "Have account? "}
              <span className="auth-link" onClick={() => { setAuthMode(authMode==="login"?"signup":"login"); setError(""); }}>
                {authMode === "login" ? "Sign up free" : "Login"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {screen === "dashboard" && (
        <div className="dashboard">
          <nav className="navbar">
            <div className="nav-logo">🧠 YesYouPro</div>
            {usageInfo && (
              <div className="usage-pill">
                <span style={{color:usageInfo.plan==="premium"?"#f59e0b":"#94a3b8",fontWeight:600}}>{usageInfo.plan==="premium"?"💎 Premium":"🆓 Free"}</span>
                <span className="pill-divider">|</span>
                <span style={{color:usageInfo.remaining>0?"#10b981":"#ef4444",fontWeight:600}}>{usageInfo.remaining} left</span>
              </div>
            )}
            <div className="nav-right">
              {(user?.plan||"free")==="free" && <button className="upgrade-btn" onClick={() => setShowPremium(true)}>💎 Upgrade</button>}
              <div className="avatar" title={user?.email}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
              <button className="logout-btn" onClick={logout}>Exit</button>
            </div>
          </nav>

          <div className="dash-content">
            <div className="hero">
              <div className="hero-badge">✨ Powered by ChatGPT AI</div>
              <h1 className="hero-title">Product Intelligence<br /><span className="grad-text">Powered by YesYouPro</span></h1>
              <p className="hero-sub">Enter any product and get deep market analysis, viral hooks, keywords and platform-specific ad strategies in seconds.</p>
            </div>

            <div className="input-card">
              <h3 className="card-title">🎯 Analyze a Product</h3>
              <div className="input-grid">
                <div className="inp-group">
                  <label className="inp-label">Product Name *</label>
                  <input className="inp" placeholder="e.g. Portable Blender" value={productForm.name} onChange={e => setProductForm({...productForm,name:e.target.value})} />
                </div>
                <div className="inp-group">
                  <label className="inp-label">Category *</label>
                  <select className="inp sel" value={productForm.category} onChange={e => setProductForm({...productForm,category:e.target.value})}>
                    <option value="">Select category</option>
                    {["Electronics","Beauty & Skincare","Home & Kitchen","Fitness","Fashion","Pet Supplies","Toys & Games","Health & Wellness","Outdoor & Sports"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="inp-group">
                  <label className="inp-label">Platform *</label>
                  <select className="inp sel" value={productForm.platform} onChange={e => setProductForm({...productForm,platform:e.target.value})}>
                    <option value="">Select platform</option>
                    {["Amazon","Shopify","Meesho","Flipkart","Instagram","TikTok Shop","Etsy","Facebook Marketplace","WooCommerce"].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="error-banner">
                  {error}
                  {error.includes("Upgrade") && <span className="upg-link" onClick={() => setShowPremium(true)}> → Upgrade Now</span>}
                </div>
              )}

              <button className={"analyze-btn"+(loading?" loading":"")} onClick={runAnalysis} disabled={loading}>
                <>🚀 Get AI Analysis {(user?.plan||"free")==="free" && <span className="ad-note">· Ad plays first</span>}</>
              </button>

              {(user?.plan||"free")==="free" && (
                <p className="free-note">Free: {usageInfo?.remaining??FREE_DAILY_LIMIT}/{FREE_DAILY_LIMIT} today · <span className="upg-link" onClick={() => setShowPremium(true)}>Upgrade for 30 analyses, no ads & platform guides →</span></p>
              )}
            </div>

            {analysis && (
              <div className="fade-in">
                <h2 className="results-title">📊 Results — <span className="grad-text">{productForm.name}</span></h2>

                <div className="metrics-row">
                  {[
                    {label:"🔥 Viral Score",val:analysis.viral_score,color:"#f59e0b"},
                    {label:"📈 Demand Level",val:analysis.demand_level,color:"#10b981"},
                    {label:"⚔️ Competition",val:analysis.competition_level,color:"#ef4444"},
                    {label:"💰 Price Range",val:analysis.price_range,color:"#6366f1"},
                  ].map(m=>(
                    <div key={m.label} className="metric-card">
                      <div className="metric-label">{m.label}</div>
                      <div className="metric-val" style={{color:m.color}}>{m.val}</div>
                    </div>
                  ))}
                </div>

                <div className="two-col">
                  <div className="glass-card">
                    <h4 className="gc-title">📝 Description</h4>
                    <p className="gc-text">{analysis.description}</p>
                  </div>
                  <div className="glass-card">
                    <h4 className="gc-title">🎯 Target Audience</h4>
                    <p className="gc-text">{analysis.target_audience}</p>
                  </div>
                </div>

                <div className="glass-card">
                  <h4 className="gc-title">🪝 Viral Hooks</h4>
                  {analysis.hooks?.map((h,i)=>(
                    <div key={i} className="hook-item">
                      <span className="hook-num">{i+1}</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="glass-card">
                  <h4 className="gc-title">🔑 SEO Keywords</h4>
                  <div className="kw-grid">{analysis.keywords?.map((k,i)=><div key={i} className="kw-chip">{k}</div>)}</div>
                </div>

                {/* RUN ADS ON ALL PLATFORMS - PREMIUM FEATURE */}
                <div className="ads-section">
                  <div className="ads-header">
                    <div className="ads-title">📺 Run Ads on All Platforms</div>
                    {(user?.plan||"free")==="free" && <div className="ads-badge">🔒 PREMIUM</div>}
                  </div>
                  <p className="ads-sub">Click any platform to get complete ad strategy — account setup, targeting, budget, keywords, script & more</p>
                  <div className="platforms-grid">
                    {PLATFORMS.map(p => (
                      <div
                        key={p.id}
                        className={"platform-btn" + (selectedAdPlatform===p.id?" active":"") + ((user?.plan||"free")==="free"?" locked":"")}
                        onClick={() => fetchAdPlatformData(p.id)}
                        style={{ borderColor: selectedAdPlatform===p.id ? p.color : undefined }}
                      >
                        {(user?.plan||"free")==="free" && <div className="lock-icon">🔒</div>}
                        <div className="platform-icon">{p.icon}</div>
                        <div className="platform-name">{p.name}</div>
                      </div>
                    ))}
                  </div>

                  {/* Platform Data */}
                  {selectedAdPlatform && (user?.plan||"free")==="premium" && (
                    <div className="platform-data">
                      {adPlatformLoading ? (
                        <div style={{textAlign:"center",padding:24}}>
                          <div className="spinner" style={{margin:"0 auto 12px"}}/>
                          <p style={{color:"#64748b",fontSize:13}}>Generating strategy...</p>
                        </div>
                      ) : adPlatformData[selectedAdPlatform] ? (
                        <>
                          {adPlatformData[selectedAdPlatform].account_setup && (
                            <div className="pd-section">
                              <div className="pd-title">🏗️ Account Setup</div>
                              <div className="pd-content">{adPlatformData[selectedAdPlatform].account_setup}</div>
                            </div>
                          )}
                          {adPlatformData[selectedAdPlatform].targeting && (
                            <div className="pd-section">
                              <div className="pd-title">🎯 Targeting Strategy</div>
                              <div className="pd-content">{adPlatformData[selectedAdPlatform].targeting}</div>
                            </div>
                          )}
                          {adPlatformData[selectedAdPlatform].ad_keywords && (
                            <div className="pd-section">
                              <div className="pd-title">🔑 Ad Keywords</div>
                              <div className="pd-chips">{(adPlatformData[selectedAdPlatform].ad_keywords||[]).map((k,i)=><div key={i} className="pd-chip">{k}</div>)}</div>
                            </div>
                          )}
                          {adPlatformData[selectedAdPlatform].script && (
                            <div className="pd-section">
                              <div className="pd-title">📝 Ad Script</div>
                              <div className="pd-content" style={{background:"rgba(99,102,241,0.05)",padding:14,borderRadius:10,border:"1px solid rgba(99,102,241,0.15)"}}>{adPlatformData[selectedAdPlatform].script}</div>
                            </div>
                          )}
                          {adPlatformData[selectedAdPlatform].budget && (
                            <div className="pd-section">
                              <div className="pd-title">💰 Budget Recommendation</div>
                              <div className="pd-content">{adPlatformData[selectedAdPlatform].budget}</div>
                            </div>
                          )}
                          {adPlatformData[selectedAdPlatform].title && (
                            <div className="pd-section">
                              <div className="pd-title">📌 Title / Headline</div>
                              <div className="pd-content" style={{fontWeight:600,color:"#e2e8f0"}}>{adPlatformData[selectedAdPlatform].title}</div>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}

                  {(user?.plan||"free")==="free" && (
                    <div className="premium-lock-box">
                      <div className="lock-big">🔒</div>
                      <div className="lock-title">Premium Feature</div>
                      <div className="lock-sub">Unlock complete ad strategies for Google, Facebook, Instagram, YouTube, TikTok & Amazon</div>
                      <button className="premium-btn" style={{maxWidth:280,margin:"0 auto"}} onClick={() => setShowPremium(true)}>💎 Unlock for ₹149</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <footer className="footer">🧠 Product Analyzer · Built with AI · YesYouPro</footer>
        </div>
      )}
    </>
  );
}
