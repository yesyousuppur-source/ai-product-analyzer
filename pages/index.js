import { useState, useEffect, useRef } from "react";

const FREE_DAILY_LIMIT = 3;
const PREMIUM_TOTAL_LIMIT = 30;
const PREMIUM_DAYS = 7;

const ADS = [
  { headline: "Scale Your Dropshipping", sub: "Find winning products 10x faster", cta: "Try ProFinder Free", color: "#f59e0b" },
  { headline: "AI Marketing Suite", sub: "Auto-generate ads, copy & creatives", cta: "Start Free Trial", color: "#8b5cf6" },
  { headline: "Shopify Experts", sub: "Build your store in 48 hours", cta: "Book a Call", color: "#06b6d4" },
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
  const adIntervalRef = useRef(null);

  useEffect(() => {
    const saved = store.get("apa_user");
    if (saved) { setUser(saved); setUsageInfo(getUsageInfo(saved)); setScreen("dashboard"); }
    else setScreen("auth");
  }, []);

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
      setUser(newUser); setUsageInfo(getUsageInfo(newUser)); setScreen("dashboard");
    } else {
      const found = users[form.email];
      if (!found || found.password !== form.password) { setError("Invalid email or password"); return; }
      const u = { email: found.email, name: found.name, plan: found.plan || "free" };
      store.set("apa_user", u);
      setUser(u); setUsageInfo(getUsageInfo(u)); setScreen("dashboard");
    }
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
    if ((user?.plan || "free") === "free") await showInterstitialAd();
    setLoading(true); setAnalysis(null);
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
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #020817; font-family: sans-serif; color: #f8fafc; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeIn 0.5s ease; }
    .loading-screen { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; }
    .spinner { width:36px; height:36px; border:3px solid #1e293b; border-top:3px solid #6366f1; border-radius:50%; animation:spin 0.8s linear infinite; }
    .toast { position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#10b981; color:#fff; padding:10px 24px; border-radius:100px; font-size:14px; z-index:9999; }
    .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; background:#020817; }
    .auth-card { background:rgba(15,23,42,0.9); border:1px solid #1e293b; border-radius:20px; padding:36px; width:100%; max-width:420px; }
    .auth-logo { font-weight:800; font-size:20px; text-align:center; margin-bottom:8px; }
    .auth-tagline { color:#64748b; font-size:14px; text-align:center; margin-bottom:24px; }
    .auth-tabs { display:flex; background:#0f172a; border-radius:12px; padding:4px; margin-bottom:20px; }
    .auth-tab { flex:1; padding:9px 0; background:none; border:none; color:#64748b; font-size:14px; cursor:pointer; border-radius:9px; }
    .auth-tab.active { background:#1e293b; color:#f8fafc; font-weight:500; }
    .inp { width:100%; background:#0f172a; border:1px solid #1e293b; border-radius:10px; padding:12px 14px; color:#f8fafc; font-size:14px; margin-bottom:12px; outline:none; }
    .inp:focus { border-color:#6366f1; }
    .sel { cursor:pointer; }
    .err-text { color:#ef4444; font-size:13px; text-align:center; margin-bottom:8px; }
    .primary-btn { width:100%; background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; border-radius:12px; padding:13px 0; color:#fff; font-weight:700; font-size:15px; cursor:pointer; }
    .auth-switch { color:#475569; font-size:13px; text-align:center; margin-top:14px; }
    .auth-link { color:#6366f1; cursor:pointer; font-weight:500; }
    .dashboard { min-height:100vh; }
    .navbar { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-bottom:1px solid #0f172a; background:rgba(2,8,23,0.9); position:sticky; top:0; z-index:100; }
    .nav-logo { font-weight:800; font-size:18px; }
    .usage-pill { background:#0f172a; border:1px solid #1e293b; border-radius:100px; padding:6px 14px; font-size:13px; display:flex; align-items:center; gap:6px; }
    .pill-divider { color:#334155; }
    .nav-right { display:flex; align-items:center; gap:8px; }
    .upgrade-btn { background:linear-gradient(135deg,#f59e0b,#ef4444); border:none; border-radius:100px; padding:7px 14px; color:#fff; font-weight:700; font-size:13px; cursor:pointer; }
    .avatar { width:34px; height:34px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; }
    .logout-btn { background:none; border:1px solid #1e293b; border-radius:8px; padding:6px 12px; color:#475569; font-size:12px; cursor:pointer; }
    .dash-content { max-width:860px; margin:0 auto; padding:36px 16px 80px; }
    .hero { text-align:center; margin-bottom:40px; }
    .hero-title { font-weight:800; font-size:clamp(26px,5vw,46px); line-height:1.2; margin-bottom:12px; }
    .grad-text { background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .hero-sub { color:#64748b; font-size:15px; }
    .input-card { background:rgba(15,23,42,0.7); border:1px solid #1e293b; border-radius:20px; padding:28px 22px; margin-bottom:32px; }
    .card-title { font-weight:700; font-size:18px; margin-bottom:20px; }
    .input-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; margin-bottom:16px; }
    .inp-group { display:flex; flex-direction:column; }
    .inp-label { font-size:11px; color:#64748b; margin-bottom:5px; font-weight:500; text-transform:uppercase; letter-spacing:0.5px; }
    .error-banner { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:10px; padding:10px 14px; color:#ef4444; font-size:13px; margin-bottom:12px; }
    .upg-link { color:#f59e0b; cursor:pointer; font-weight:600; }
    .analyze-btn { width:100%; background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7); border:none; border-radius:14px; padding:15px 0; color:#fff; font-weight:700; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
    .analyze-btn.loading { opacity:0.7; cursor:not-allowed; }
    .btn-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top:2px solid #fff; border-radius:50%; display:inline-block; animation:spin 0.7s linear infinite; }
    .ad-note { font-size:12px; opacity:0.6; font-weight:400; }
    .free-note { font-size:12px; color:#475569; text-align:center; margin-top:10px; }
    .results-title { font-weight:700; font-size:20px; margin-bottom:20px; }
    .metrics-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-bottom:16px; }
    .metric-card { background:rgba(15,23,42,0.8); border:1px solid #1e293b; border-radius:16px; padding:18px; }
    .metric-label { font-size:12px; color:#64748b; margin-bottom:8px; }
    .metric-val { font-weight:800; font-size:20px; }
    .two-col { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:12px; margin-bottom:12px; }
    .glass-card { background:rgba(15,23,42,0.7); border:1px solid #1e293b; border-radius:16px; padding:20px; margin-bottom:12px; }
    .gc-title { font-weight:700; font-size:15px; margin-bottom:12px; color:#e2e8f0; }
    .gc-text { color:#94a3b8; line-height:1.7; font-size:14px; }
    .hook-item { display:flex; align-items:flex-start; gap:10px; color:#cbd5e1; font-size:14px; margin-bottom:10px; }
    .hook-num { min-width:24px; height:24px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; flex-shrink:0; }
    .kw-grid { display:flex; flex-wrap:wrap; gap:8px; }
    .kw-chip { background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); color:#a5b4fc; border-radius:100px; padding:5px 12px; font-size:13px; }
    .ad-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.92); display:flex; align-items:center; justify-content:center; z-index:9000; }
    .ad-box { background:#0f172a; border:1px solid #1e293b; border-radius:20px; padding:36px; max-width:400px; width:90%; text-align:center; position:relative; }
    .ad-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); padding:4px 16px; border-radius:100px; font-size:11px; font-weight:700; color:#fff; }
    .ad-headline { font-weight:800; font-size:22px; margin:12px 0 8px; }
    .ad-sub { color:#94a3b8; margin-bottom:20px; }
    .ad-cta { border:none; border-radius:100px; padding:11px 28px; color:#fff; font-weight:700; cursor:pointer; }
    .ad-close { display:block; margin:18px auto 0; background:none; border:1px solid #334155; border-radius:100px; padding:8px 22px; color:#94a3b8; cursor:pointer; font-size:13px; }
    .ad-close.disabled { opacity:0.4; cursor:not-allowed; }
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:8000; }
    .premium-modal { background:#0f172a; border:1px solid #1e293b; border-radius:24px; padding:36px; max-width:420px; width:90%; text-align:center; }
    .premium-badge { display:inline-block; background:linear-gradient(135deg,#f59e0b,#ef4444); border-radius:100px; padding:5px 18px; font-size:12px; font-weight:700; color:#fff; margin-bottom:14px; }
    .modal-title { font-weight:800; font-size:24px; margin-bottom:8px; }
    .premium-price { font-weight:800; font-size:36px; color:#f59e0b; margin-bottom:20px; }
    .premium-price span { font-size:15px; color:#94a3b8; }
    .features-list { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; text-align:left; }
    .feature-item { color:#cbd5e1; font-size:14px; padding:8px 12px; background:rgba(255,255,255,0.03); border-radius:8px; }
    .premium-btn { width:100%; background:linear-gradient(135deg,#f59e0b,#ef4444); border:none; border-radius:12px; padding:13px 0; color:#fff; font-weight:700; font-size:15px; cursor:pointer; margin-bottom:10px; }
    .modal-cancel { background:none; border:none; color:#475569; font-size:14px; cursor:pointer; padding:8px 0; width:100%; }
    .payment-box { background:#020817; border:1px solid #1e293b; border-radius:12px; padding:14px 18px; margin-bottom:14px; text-align:left; }
    .pay-row { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid #1e293b; color:#94a3b8; font-size:14px; }
    .pay-row:last-child { border-bottom:none; }
    .pay-note { color:#475569; font-size:12px; margin-bottom:14px; }
    .footer { text-align:center; padding:20px; color:#334155; font-size:12px; border-top:1px solid #0f172a; }
  `;

  if (screen === "loading") return (
    <>
      <style>{css}</style>
      <div className="loading-screen"><div className="spinner" /><p style={{color:"#64748b",marginTop:14}}>Loading...</p></div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {toast && <div className="toast">{toast}</div>}

      {showAd && (
        <div className="ad-overlay">
          <div className="ad-box">
            <div className="ad-badge" style={{ background: ADS[adIdx].color }}>SPONSORED</div>
            <div style={{ paddingTop: 16 }}>
              <div style={{ fontSize: 48 }}>📢</div>
              <h2 className="ad-headline">{ADS[adIdx].headline}</h2>
              <p className="ad-sub">{ADS[adIdx].sub}</p>
              <button className="ad-cta" style={{ background: ADS[adIdx].color }}>{ADS[adIdx].cta}</button>
            </div>
            <button onClick={closeAd} className={"ad-close" + (adTimer > 0 ? " disabled" : "")}>
              {adTimer > 0 ? "Skip in " + adTimer + "s" : "✕ Close Ad"}
            </button>
          </div>
        </div>
      )}

      {showPremium && (
        <div className="modal-overlay" onClick={() => { if (paymentStep === "form") { setShowPremium(false); setShowPayment(false); setPaymentStep("form"); } }}>
          <div className="premium-modal" onClick={e => e.stopPropagation()}>
            {!showPayment ? (
              <>
                <div className="premium-badge">💎 PREMIUM</div>
                <h2 className="modal-title">Unlock Full Power</h2>
                <div className="premium-price">Rs.149 <span>/ 7 days</span></div>
                <div className="features-list">
                  {["30 analyses in 7 days","Zero ads ever","Priority AI processing","Deeper market insights","All future features"].map(f => (
                    <div key={f} className="feature-item">✅ {f}</div>
                  ))}
                </div>
                <button className="premium-btn" onClick={() => setShowPayment(true)}>🔓 Unlock Premium - Rs.149</button>
                <button className="modal-cancel" onClick={() => setShowPremium(false)}>Maybe later</button>
              </>
            ) : paymentStep === "form" ? (
              <>
                <h2 className="modal-title">Complete Payment</h2>
                <div className="payment-box">
                  <div className="pay-row"><span>Plan</span><span>Premium 7-day</span></div>
                  <div className="pay-row"><span>Amount</span><span style={{color:"#f59e0b"}}>Rs.149</span></div>
                  <div className="pay-row"><span>Analyses</span><span>30 total</span></div>
                </div>
                <p className="pay-note">⚠️ Add Razorpay here for real payments</p>
                <button className="premium-btn" onClick={activatePremium}>💳 Pay Rs.149 (Demo)</button>
                <button className="modal-cancel" onClick={() => setShowPayment(false)}>← Back</button>
              </>
            ) : paymentStep === "processing" ? (
              <div style={{textAlign:"center",padding:40}}>
                <div className="spinner" />
                <p style={{color:"#94a3b8",marginTop:14}}>Processing...</p>
              </div>
            ) : (
              <div style={{textAlign:"center",padding:32}}>
                <div style={{fontSize:60}}>🎉</div>
                <h2 className="modal-title">Premium Activated!</h2>
                <p style={{color:"#10b981",margin:"10px 0 20px"}}>30 analyses · 7 days · No ads</p>
                <button className="premium-btn" onClick={() => { setShowPremium(false); setShowPayment(false); setPaymentStep("form"); }}>Start Analyzing →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "auth" && (
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-logo">🧠 AI Product Analyzer</div>
            <p className="auth-tagline">Uncover winning products with real AI insights</p>
            <div className="auth-tabs">
              {["login","signup"].map(m => (
                <button key={m} className={"auth-tab"+(authMode===m?" active":"")} onClick={() => { setAuthMode(m); setError(""); }}>
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>
            {authMode === "signup" && <input className="inp" placeholder="Full Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />}
            <input className="inp" placeholder="Email Address" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
            <input className="inp" placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
            {error && <p className="err-text">{error}</p>}
            <button className="primary-btn" onClick={handleAuth}>{authMode === "login" ? "🚀 Login" : "✨ Create Account"}</button>
            <p className="auth-switch">
              {authMode === "login" ? "No account? " : "Have account? "}
              <span className="auth-link" onClick={() => { setAuthMode(authMode==="login"?"signup":"login"); setError(""); }}>
                {authMode === "login" ? "Sign up free" : "Login"}
              </span>
            </p>
          </div>
        </div>
      )}

      {screen === "dashboard" && (
        <div className="dashboard">
          <nav className="navbar">
            <div className="nav-logo">🧠 APA</div>
            {usageInfo && (
              <div className="usage-pill">
                <span style={{color:usageInfo.plan==="premium"?"#f59e0b":"#94a3b8"}}>{usageInfo.plan==="premium"?"💎 Premium":"Free"}</span>
                <span className="pill-divider">|</span>
                <span style={{color:usageInfo.remaining>0?"#10b981":"#ef4444"}}>{usageInfo.remaining} left</span>
              </div>
            )}
            <div className="nav-right">
              {(user?.plan||"free")==="free" && <button className="upgrade-btn" onClick={() => setShowPremium(true)}>💎 Upgrade</button>}
              <div className="avatar">{user?.name?.[0]?.toUpperCase()||"U"}</div>
              <button className="logout-btn" onClick={logout}>Exit</button>
            </div>
          </nav>

          <div className="dash-content">
            <div className="hero">
              <h1 className="hero-title">Product Intelligence<br /><span className="grad-text">Powered by ChatGPT</span></h1>
              <p className="hero-sub">Enter any product and get deep market analysis, hooks, keywords and more in seconds.</p>
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
                {loading ? <><span className="btn-spinner" /> Analyzing with ChatGPT...</> : <>🚀 Get AI Analysis {(user?.plan||"free")==="free" && <span className="ad-note">· Ad plays first</span>}</>}
              </button>

              {(user?.plan||"free")==="free" && (
                <p className="free-note">Free: {usageInfo?.remaining??FREE_DAILY_LIMIT}/{FREE_DAILY_LIMIT} today · <span className="upg-link" onClick={() => setShowPremium(true)}>Upgrade for 30 analyses and no ads</span></p>
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
                  {analysis.hooks?.map((h,i) => (
                    <div key={i} className="hook-item"><span className="hook-num">{i+1}</span><span>{h}</span></div>
                  ))}
                </div>
                <div className="glass-card">
                  <h4 className="gc-title">🔑 Keywords</h4>
                  <div className="kw-grid">{analysis.keywords?.map((k,i) => <div key={i} className="kw-chip">{k}</div>)}</div>
                </div>
              </div>
            )}
          </div>
          <footer className="footer">🧠 AI Product Analyzer · Built with ChatGPT AI</footer>
        </div>
      )}
    </>
  );
}
