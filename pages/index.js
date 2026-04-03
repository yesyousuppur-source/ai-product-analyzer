import { useState, useEffect, useRef } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const FREE_DAILY_LIMIT = 2;
const PREMIUM_TOTAL_LIMIT = 30;
const PREMIUM_DAYS = 7;

const FB = {
  apiKey: "AIzaSyDww7gi4QRRNm4t3PFQ9ny8a2WLV-V9OFU",
  authDomain: "mood2meet-85866.firebaseapp.com",
  projectId: "mood2meet-85866",
  storageBucket: "mood2meet-85866.firebasestorage.app",
  messagingSenderId: "455406578867",
  appId: "1:455406578867:web:fc5a2b6a00af996bc114c6"
};

// ALL CATEGORIES WITH ICONS
const CATEGORIES = [
  // Physical
  { id:"Electronics", label:"Electronics", icon:"💻", type:"physical" },
  { id:"Beauty & Skincare", label:"Beauty", icon:"💄", type:"physical" },
  { id:"Home & Kitchen", label:"Home & Kitchen", icon:"🏠", type:"physical" },
  { id:"Fitness", label:"Fitness", icon:"💪", type:"physical" },
  { id:"Fashion", label:"Fashion", icon:"👗", type:"physical" },
  { id:"Pet Supplies", label:"Pet Supplies", icon:"🐾", type:"physical" },
  { id:"Toys & Games", label:"Toys & Games", icon:"🎮", type:"physical" },
  { id:"Health & Wellness", label:"Health", icon:"❤️", type:"physical" },
  { id:"Outdoor & Sports", label:"Outdoor", icon:"⛺", type:"physical" },
  { id:"Food & Beverages", label:"Food & Drinks", icon:"🍔", type:"physical" },
  { id:"Automotive", label:"Automotive", icon:"🚗", type:"physical" },
  { id:"Books & Education", label:"Books", icon:"📚", type:"physical" },
  { id:"Music & Audio", label:"Music", icon:"🎵", type:"physical" },
  { id:"Art & Crafts", label:"Art & Crafts", icon:"🎨", type:"physical" },
  { id:"Jewelry & Accessories", label:"Jewelry", icon:"💍", type:"physical" },
  { id:"Baby & Kids", label:"Baby & Kids", icon:"👶", type:"physical" },
  { id:"Office Supplies", label:"Office", icon:"🗂️", type:"physical" },
  { id:"Tools & Hardware", label:"Tools", icon:"🔧", type:"physical" },
  { id:"Garden & Plants", label:"Garden", icon:"🌱", type:"physical" },
  { id:"Travel & Luggage", label:"Travel", icon:"✈️", type:"physical" },
  // Digital / Virtual
  { id:"Digital Products", label:"Digital Products", icon:"📦", type:"digital" },
  { id:"Mobile Apps", label:"Mobile Apps", icon:"📱", type:"digital" },
  { id:"PC / Console Games", label:"Games", icon:"🕹️", type:"digital" },
  { id:"Online Courses", label:"Courses", icon:"🎓", type:"digital" },
  { id:"Software & SaaS", label:"Software/SaaS", icon:"💿", type:"digital" },
  { id:"Website / Blog", label:"Website/Blog", icon:"🌐", type:"digital" },
  { id:"YouTube Channel", label:"YouTube", icon:"📺", type:"digital" },
  { id:"Instagram Page", label:"Instagram Page", icon:"📸", type:"digital" },
  { id:"Podcast", label:"Podcast", icon:"🎙️", type:"digital" },
  { id:"NFT & Crypto", label:"NFT & Crypto", icon:"🖼️", type:"digital" },
  { id:"Ebooks & Templates", label:"Ebooks", icon:"📄", type:"digital" },
  { id:"Freelance Services", label:"Freelancing", icon:"🛠️", type:"digital" },
  { id:"Social Media Account", label:"Social Media", icon:"👥", type:"digital" },
  { id:"Subscription Box", label:"Subscription", icon:"📬", type:"digital" },
  { id:"Print on Demand", label:"Print on Demand", icon:"🖨️", type:"digital" },
  { id:"Dropshipping", label:"Dropshipping", icon:"🚚", type:"digital" },
  { id:"Affiliate Marketing", label:"Affiliate", icon:"🔗", type:"digital" },
  { id:"Online Community", label:"Community", icon:"💬", type:"digital" },
  { id:"Any Other", label:"Other", icon:"✨", type:"other" },
];

// ALL PLATFORMS WITH ICONS
const ALL_PLATFORMS = [
  // Ecommerce
  { id:"Amazon", label:"Amazon", icon:"📦", color:"#f59e0b", group:"🛒 Ecommerce" },
  { id:"Flipkart", label:"Flipkart", icon:"⚡", color:"#2874f0", group:"🛒 Ecommerce" },
  { id:"Meesho", label:"Meesho", icon:"🌸", color:"#e91e8c", group:"🛒 Ecommerce" },
  { id:"Shopify", label:"Shopify", icon:"🛒", color:"#96bf48", group:"🛒 Ecommerce" },
  { id:"WooCommerce", label:"WooCommerce", icon:"🌐", color:"#7f54b3", group:"🛒 Ecommerce" },
  { id:"Etsy", label:"Etsy", icon:"🎨", color:"#f56400", group:"🛒 Ecommerce" },
  { id:"Nykaa", label:"Nykaa", icon:"💄", color:"#fc2779", group:"🛒 Ecommerce" },
  { id:"Myntra", label:"Myntra", icon:"👗", color:"#ff3f6c", group:"🛒 Ecommerce" },
  { id:"Ajio", label:"Ajio", icon:"👠", color:"#ed1c24", group:"🛒 Ecommerce" },
  { id:"Snapdeal", label:"Snapdeal", icon:"🏷️", color:"#e40000", group:"🛒 Ecommerce" },
  { id:"JioMart", label:"JioMart", icon:"🛍️", color:"#003087", group:"🛒 Ecommerce" },
  { id:"IndiaMART", label:"IndiaMART", icon:"🏭", color:"#0077b5", group:"🛒 Ecommerce" },
  // Social Media
  { id:"Instagram", label:"Instagram", icon:"📸", color:"#e1306c", group:"📱 Social Media" },
  { id:"TikTok Shop", label:"TikTok", icon:"🎵", color:"#010101", group:"📱 Social Media" },
  { id:"Facebook", label:"Facebook", icon:"👤", color:"#1877f2", group:"📱 Social Media" },
  { id:"YouTube", label:"YouTube", icon:"📺", color:"#ff0000", group:"📱 Social Media" },
  { id:"Pinterest", label:"Pinterest", icon:"📌", color:"#e60023", group:"📱 Social Media" },
  { id:"Snapchat", label:"Snapchat", icon:"👻", color:"#fffc00", group:"📱 Social Media" },
  { id:"X (Twitter)", label:"X/Twitter", icon:"🐦", color:"#000000", group:"📱 Social Media" },
  { id:"LinkedIn", label:"LinkedIn", icon:"💼", color:"#0077b5", group:"📱 Social Media" },
  { id:"Telegram", label:"Telegram", icon:"✈️", color:"#0088cc", group:"📱 Social Media" },
  { id:"WhatsApp Business", label:"WhatsApp", icon:"💬", color:"#25d366", group:"📱 Social Media" },
  { id:"Discord", label:"Discord", icon:"🎮", color:"#5865f2", group:"📱 Social Media" },
  { id:"Reddit", label:"Reddit", icon:"🔴", color:"#ff4500", group:"📱 Social Media" },
  { id:"Quora", label:"Quora", icon:"❓", color:"#a82400", group:"📱 Social Media" },
  // App Stores
  { id:"Google Play Store", label:"Play Store", icon:"▶️", color:"#01875f", group:"📲 App Stores" },
  { id:"Apple App Store", label:"App Store", icon:"🍎", color:"#0071e3", group:"📲 App Stores" },
  { id:"Steam", label:"Steam", icon:"🎮", color:"#1b2838", group:"📲 App Stores" },
  { id:"PlayStation Store", label:"PlayStation", icon:"🎮", color:"#003087", group:"📲 App Stores" },
  { id:"Xbox Store", label:"Xbox", icon:"🟢", color:"#107c10", group:"📲 App Stores" },
  // Learning
  { id:"Udemy", label:"Udemy", icon:"📖", color:"#a435f0", group:"🎓 Courses" },
  { id:"Skillshare", label:"Skillshare", icon:"✏️", color:"#00ccb1", group:"🎓 Courses" },
  { id:"Gumroad", label:"Gumroad", icon:"💰", color:"#ff90e8", group:"🎓 Courses" },
  { id:"Patreon", label:"Patreon", icon:"🎁", color:"#ff424d", group:"🎓 Courses" },
  { id:"Substack", label:"Substack", icon:"📧", color:"#ff6719", group:"🎓 Courses" },
  // Freelance
  { id:"Fiverr", label:"Fiverr", icon:"💚", color:"#1dbf73", group:"💼 Freelance" },
  { id:"Upwork", label:"Upwork", icon:"🔵", color:"#14a800", group:"💼 Freelance" },
  // Food
  { id:"Zomato", label:"Zomato", icon:"🍕", color:"#e23744", group:"🍔 Food & Delivery" },
  { id:"Swiggy", label:"Swiggy", icon:"🛵", color:"#fc8019", group:"🍔 Food & Delivery" },
  { id:"BigBasket", label:"BigBasket", icon:"🛒", color:"#84c225", group:"🍔 Food & Delivery" },
  { id:"Own Website", label:"Own Website", icon:"🌐", color:"#6366f1", group:"🌐 Other" },
  { id:"Any Other Platform", label:"Other", icon:"✨", color:"#94a3b8", group:"🌐 Other" },
];
const PLATFORMS = [
  { id:"google_ads", name:"Google Ads", color:"#4285f4", svg:`<svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>` },
  { id:"facebook", name:"Facebook", color:"#1877f2", svg:`<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>` },
  { id:"instagram", name:"Instagram", color:"#e1306c", svg:`<svg viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#ig)"/></svg>` },
  { id:"youtube", name:"YouTube", color:"#ff0000", svg:`<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/></svg>` },
  { id:"tiktok", name:"TikTok", color:"#010101", svg:`<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#000"/></svg>` },
  { id:"pinterest", name:"Pinterest", color:"#e60023", svg:`<svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#E60023"/></svg>` },
  { id:"snapchat", name:"Snapchat", color:"#FFFC00", svg:`<svg viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.354 4.408-.074 1.86 1.498 2.127 2.404 1.544.48-.316 1.02-.536 1.46-.536.45 0 .763.159.858.417.099.267-.124.643-.898 1.054-.241.127-.55.273-.88.425-1.07.497-2.538 1.093-2.538 2.272 0 .176.029.35.089.518.33.93 1.14 1.643 1.975 2.375.413.36.85.748 1.254 1.195.36.41.574.856.574 1.27 0 .51-.314.927-.885 1.156-.434.173-1.017.267-1.602.267-.43 0-.86-.05-1.252-.15-.622-.16-1.252-.5-1.814-.83-.386-.23-.696-.42-.966-.42-.27 0-.648.185-.998.37-.58.31-1.165.621-1.814.81-.507.145-1.13.236-1.759.236-1.25 0-2.433-.407-3.112-.963-.338-.271-.604-.566-.741-.898-.14-.333-.14-.674.014-1.02.234-.542.858-1.062 1.56-1.643.456-.376.974-.808 1.384-1.295.256-.31.42-.592.42-.863 0-.543-.72-1.091-1.736-1.572-.396-.183-.806-.339-1.152-.464-.414-.146-.712-.268-.834-.41-.17-.199-.211-.452-.106-.71.113-.274.4-.46.766-.47.305-.008.61.068.886.224.298.167.557.41.791.64.154.152.29.284.408.375.136.104.28.16.406.16.256 0 .39-.2.39-.583V7.84c0-1.19-.122-3.228.354-4.408C7.855 1.069 11.21.793 12.206.793z" fill="#FFFC00"/></svg>` },
  { id:"twitter", name:"X (Twitter)", color:"#000000", svg:`<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="#000"/></svg>` },
];

const ADS = [
  { headline:"Scale Your Business Fast", sub:"Find winning products 10x faster", cta:"Try Now Free", color:"#f59e0b" },
  { headline:"AI Marketing Suite", sub:"Auto-generate ads, copy and creatives", cta:"Start Free Trial", color:"#8b5cf6" },
  { headline:"Shopify Store Experts", sub:"Build your store in 48 hours", cta:"Book a Call", color:"#06b6d4" },
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const S = {
  get:(k)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch{ return null; } },
  set:(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
};

// ─── FIREBASE ────────────────────────────────────────────────────────────────
let _auth=null;
async function getFireAuth(){
  if(_auth) return _auth;
  const {initializeApp,getApps}=await import("firebase/app");
  const {getAuth}=await import("firebase/auth");
  const app=getApps().length?getApps()[0]:initializeApp(FB);
  _auth=getAuth(app);
  return _auth;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  // Screen
  const [screen,setScreen]=useState("loading");
  const [user,setUser]=useState(null);

  // Auth
  const [authMode,setAuthMode]=useState("login");
  const [form,setForm]=useState({email:"",password:"",name:""});
  const [savedAccounts,setSavedAccounts]=useState([]);
  const [showPass,setShowPass]=useState(false);
  const [gLoading,setGLoading]=useState(false);
  const [authErr,setAuthErr]=useState("");

  // Usage & Timer
  const [usageInfo,setUsageInfo]=useState(null);
  const [timer,setTimer]=useState(null);
  const timerRef=useRef(null);

  // Analysis
  const [pForm,setPForm]=useState({name:"",category:"",platform:""});
  const [analysis,setAnalysis]=useState(null);
  const [loading,setLoading]=useState(false);
  const [loadStep,setLoadStep]=useState(0);
  const [err,setErr]=useState("");

  // Ad
  const [showAd,setShowAd]=useState(false);
  const [adTimer,setAdTimer]=useState(5);
  const [adIdx,setAdIdx]=useState(0);
  const adRef=useRef(null);

  // Premium
  const [showPrem,setShowPrem]=useState(false);
  const [showPay,setShowPay]=useState(false);
  const [payStep,setPayStep]=useState("form");

  // Platform
  const [selPlat,setSelPlat]=useState(null);
  const [platData,setPlatData]=useState({});
  const [platLoading,setPlatLoading]=useState(false);

  // Feature tabs
  const [tab,setTab]=useState("profit");

  // Profit
  const [profitForm,setProfitForm]=useState({buy:"",sell:"",units:"1",fee:"10",ship:"60",ads:"200"});
  const [profitResult,setProfitResult]=useState(null);

  // Description
  const [descData,setDescData]=useState(null);
  const [descLoading,setDescLoading]=useState(false);

  // Trending
  const [trendData,setTrendData]=useState(null);
  const [trendLoading,setTrendLoading]=useState(false);
  const [trendCat,setTrendCat]=useState("Fashion");

  // Competitor
  const [compData,setCompData]=useState(null);
  const [compLoading,setCompLoading]=useState(false);

  // Supplier
  const [suppData,setSuppData]=useState(null);
  const [suppLoading,setSuppLoading]=useState(false);

  // Starter
  const [starterForm,setStarterForm]=useState({budget:"5000",exp:"beginner"});
  const [starterData,setStarterData]=useState(null);
  const [starterLoading,setStarterLoading]=useState(false);

  // Beginner Products
  const [beginForm,setBeginForm]=useState({budget:"5000",category:"Fashion"});
  const [beginData,setBeginData]=useState(null);
  const [beginLoading,setBeginLoading]=useState(false);

  // Investment
  const [invForm,setInvForm]=useState({buy:"",sell:"",units:"10",fee:"10",ship:"60",ads:"200"});
  const [invResult,setInvResult]=useState(null);

  // Sales
  const [salesData,setSalesData]=useState(null);
  const [salesLoading,setSalesLoading]=useState(false);

  // Price
  const [priceData,setPriceData]=useState(null);
  const [priceLoading,setPriceLoading]=useState(false);

  // Inventory
  const [invtForm,setInvtForm]=useState({units:"50"});
  const [invtData,setInvtData]=useState(null);
  const [invtLoading,setInvtLoading]=useState(false);

  // Review
  const [revData,setRevData]=useState(null);
  const [revLoading,setRevLoading]=useState(false);

  // Niche
  const [nicheData,setNicheData]=useState(null);
  const [nicheLoading,setNicheLoading]=useState(false);

  const [toast,setToast]=useState(null);

  // ─── HELPERS ───────────────────────────────────────────────────────────────
  const today=()=>{ const d=new Date(); return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}`; };
  const showToast=(m)=>{ setToast(m); setTimeout(()=>setToast(null),3500); };

  // ── COPY FUNCTION (Premium) ─────────────────────────────────────────────────
  const copyText=(text,label)=>{
    if(curPlan!=="premium"){ setShowPrem(true); return; }
    try{
      navigator.clipboard.writeText(text).then(()=>showToast("✅ Copied: "+label));
    } catch{
      const el=document.createElement("textarea");
      el.value=text; document.body.appendChild(el);
      el.select(); document.execCommand("copy");
      document.body.removeChild(el);
      showToast("✅ Copied: "+label);
    }
  };

  const CopyBtn=({text,label})=>(
    curPlan==="premium"?(
      <button onClick={()=>copyText(text,label)} style={{
        background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",
        borderRadius:7,padding:"3px 10px",cursor:"pointer",
        color:"#a5b4fc",fontSize:11,fontWeight:600,
        fontFamily:"Inter,sans-serif",marginLeft:8,transition:"all .2s"
      }}>📋 Copy</button>
    ):null
  );
  const curPlan=user?(S.get("yyp_plan_"+user.email)||"free"):"free";
  const isLocked=curPlan!=="premium"&&(!usageInfo||usageInfo.remaining<=0||timer);

  // ─── USAGE ─────────────────────────────────────────────────────────────────
  const calcUsage=(u)=>{
    if(!u?.email) return {plan:"free",remaining:FREE_DAILY_LIMIT,total:FREE_DAILY_LIMIT,used:0};
    const plan=S.get("yyp_plan_"+u.email)||"free";
    if(plan==="premium"){
      const pd=S.get("yyp_prem_"+u.email);
      if(!pd){ S.set("yyp_plan_"+u.email,"free"); return {plan:"free",remaining:FREE_DAILY_LIMIT,total:FREE_DAILY_LIMIT,used:0}; }
      if(new Date()>new Date(pd.expiry)){ S.set("yyp_plan_"+u.email,"free"); return {plan:"free",remaining:FREE_DAILY_LIMIT,total:FREE_DAILY_LIMIT,expired:true}; }
      const used=pd.used||0;
      return {plan,remaining:Math.max(0,PREMIUM_TOTAL_LIMIT-used),total:PREMIUM_TOTAL_LIMIT,used,expiry:pd.expiry};
    }
    const used=parseInt(S.get("yyp_daily_"+u.email+"_"+today())||"0");
    return {plan:"free",remaining:Math.max(0,FREE_DAILY_LIMIT-used),total:FREE_DAILY_LIMIT,used};
  };

  const addUsage=(u)=>{
    if(!u?.email) return;
    const plan=S.get("yyp_plan_"+u.email)||"free";
    if(plan==="premium"){
      const pd=S.get("yyp_prem_"+u.email);
      if(pd) S.set("yyp_prem_"+u.email,{...pd,used:(pd.used||0)+1});
    } else {
      const k="yyp_daily_"+u.email+"_"+today();
      S.set(k,String(parseInt(S.get(k)||"0")+1));
    }
  };

  // ─── TIMER ─────────────────────────────────────────────────────────────────
  const startTimer=(u)=>{
    if(!u) return;
    if((S.get("yyp_plan_"+u.email)||"free")==="premium"){ setTimer(null); return; }
    const used=parseInt(S.get("yyp_daily_"+u.email+"_"+today())||"0");
    if(used<FREE_DAILY_LIMIT){ setTimer(null); return; }
    const hitTime=S.get("yyp_limit_hit_"+u.email);
    if(!hitTime) return;
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      const remaining=hitTime+86400000-Date.now();
      if(remaining<=0){
        clearInterval(timerRef.current);
        S.set("yyp_daily_"+u.email+"_"+today(),"0");
        S.set("yyp_limit_hit_"+u.email,null);
        setTimer(null);
        showToast("✅ 2 free analyses reset! Start analyzing.");
      } else {
        setTimer({
          h:Math.floor(remaining/3600000),
          m:Math.floor((remaining%3600000)/60000),
          s:Math.floor((remaining%60000)/1000),
          total:remaining
        });
      }
    },1000);
  };

  // ─── INIT ───────────────────────────────────────────────────────────────────
  useEffect(()=>{
    const accounts=S.get("yyp_accounts")||[];
    setSavedAccounts(accounts);

    const saved=S.get("yyp_current");
    if(saved?.email){
      const u={...saved,plan:S.get("yyp_plan_"+saved.email)||"free"};
      setUser(u); setUsageInfo(calcUsage(u));
      startTimer(u); setScreen("dashboard"); return;
    }

    if(typeof window==="undefined"){ setScreen("auth"); return; }
    let unsub=null;
    (async()=>{
      try{
        const auth=await getFireAuth();
        const {onAuthStateChanged}=await import("firebase/auth");
        unsub=onAuthStateChanged(auth,(fbU)=>{
          if(fbU){
            const u={email:fbU.email,name:fbU.displayName||fbU.email.split("@")[0],photo:fbU.photoURL||null,plan:S.get("yyp_plan_"+fbU.email)||"free"};
            S.set("yyp_current",u);
            setUser(u); setUsageInfo(calcUsage(u));
            startTimer(u); setScreen("dashboard");
          } else { setScreen("auth"); }
        });
      } catch{ setScreen("auth"); }
    })();
    return()=>{ if(unsub)unsub(); };
  },[]);

  useEffect(()=>{ if(!user) return; startTimer(user); return()=>clearInterval(timerRef.current); },[user]);

  useEffect(()=>{ if(loading){ setLoadStep(0); [1,2,3].forEach((s,i)=>setTimeout(()=>setLoadStep(s),(i+1)*1200)); } },[loading]);

  // ─── SAVE ACCOUNT ──────────────────────────────────────────────────────────
  const saveAccount=(email,name,password,photo)=>{
    const list=S.get("yyp_accounts")||[];
    const i=list.findIndex(a=>a.email===email);
    const acc={email,name,password:password||"",photo:photo||null};
    if(i>=0) list[i]=acc; else list.push(acc);
    S.set("yyp_accounts",list);
    setSavedAccounts([...list]);
  };

  // ─── GOOGLE LOGIN ──────────────────────────────────────────────────────────
  const handleGoogle=async()=>{
    setGLoading(true); setAuthErr("");
    try{
      const auth=await getFireAuth();
      const {signInWithPopup,GoogleAuthProvider}=await import("firebase/auth");
      const r=await signInWithPopup(auth,new GoogleAuthProvider());
      const u={email:r.user.email,name:r.user.displayName,photo:r.user.photoURL,plan:S.get("yyp_plan_"+r.user.email)||"free"};
      S.set("yyp_current",u);
      saveAccount(r.user.email,r.user.displayName,"",r.user.photoURL);
      setUser(u); setUsageInfo(calcUsage(u)); startTimer(u); setScreen("dashboard");
      showToast("✅ Signed in with Google!");
    } catch(e){
      if(e.code==="auth/popup-closed-by-user") setAuthErr("Sign-in cancelled.");
      else if(e.code==="auth/unauthorized-domain") setAuthErr("Domain not authorized in Firebase Console.");
      else setAuthErr("Google sign-in failed. Try email login.");
    }
    setGLoading(false);
  };

  // ─── EMAIL AUTH ─────────────────────────────────────────────────────────────
  const handleAuth=async()=>{
    if(!form.email||!form.password){ setAuthErr("Please fill all fields"); return; }
    if(authMode==="signup"&&!form.name){ setAuthErr("Name is required"); return; }
    if(form.password.length<6){ setAuthErr("Password must be 6+ characters"); return; }
    setAuthErr("");
    try{
      const auth=await getFireAuth();
      if(authMode==="signup"){
        const {createUserWithEmailAndPassword,updateProfile}=await import("firebase/auth");
        const r=await createUserWithEmailAndPassword(auth,form.email,form.password);
        await updateProfile(r.user,{displayName:form.name});
        const u={email:form.email,name:form.name,photo:null,plan:"free"};
        S.set("yyp_current",u);
        saveAccount(form.email,form.name,form.password,null);
        setUser(u); setUsageInfo(calcUsage(u)); setScreen("dashboard");
        showToast("✅ Account created! Welcome to YesYouPro");
      } else {
        const {signInWithEmailAndPassword}=await import("firebase/auth");
        const r=await signInWithEmailAndPassword(auth,form.email,form.password);
        const u={email:r.user.email,name:r.user.displayName||form.email.split("@")[0],photo:null,plan:S.get("yyp_plan_"+r.user.email)||"free"};
        S.set("yyp_current",u);
        saveAccount(form.email,u.name,form.password,null);
        setUser(u); setUsageInfo(calcUsage(u)); startTimer(u); setScreen("dashboard");
        showToast("✅ Welcome back, "+u.name+"!");
      }
    } catch(e){
      // Fallback to localStorage
      const allU=S.get("yyp_users")||{};
      if(authMode==="signup"){
        if(["auth/email-already-in-use"].includes(e.code)||allU[form.email]){ setAuthErr("Email already registered. Please login."); return; }
        allU[form.email]={email:form.email,name:form.name,password:form.password};
        S.set("yyp_users",allU);
        const u={email:form.email,name:form.name,photo:null,plan:"free"};
        S.set("yyp_current",u);
        saveAccount(form.email,form.name,form.password,null);
        setUser(u); setUsageInfo(calcUsage(u)); setScreen("dashboard");
        showToast("✅ Account created!");
      } else {
        const found=allU[form.email];
        if(!found){ setAuthErr("No account found. Please Sign Up."); return; }
        if(found.password!==form.password){ setAuthErr("Wrong password. Try Forgot Password?"); return; }
        const u={email:found.email,name:found.name,photo:null,plan:S.get("yyp_plan_"+found.email)||"free"};
        S.set("yyp_current",u);
        saveAccount(form.email,found.name,form.password,null);
        setUser(u); setUsageInfo(calcUsage(u)); startTimer(u); setScreen("dashboard");
        showToast("✅ Welcome back!");
      }
    }
  };

  const quickLogin=async(acc)=>{
    setAuthErr("");
    if(!acc.password){ handleGoogle(); return; }
    try{
      const auth=await getFireAuth();
      const {signInWithEmailAndPassword}=await import("firebase/auth");
      await signInWithEmailAndPassword(auth,acc.email,acc.password);
    } catch{
      const allU=S.get("yyp_users")||{};
      const found=allU[acc.email];
      if(found&&found.password===acc.password){
        const u={email:found.email,name:found.name,photo:acc.photo||null,plan:S.get("yyp_plan_"+found.email)||"free"};
        S.set("yyp_current",u);
        setUser(u); setUsageInfo(calcUsage(u)); startTimer(u); setScreen("dashboard");
        showToast("✅ Welcome back!");
      } else { setAuthErr("Login failed. Enter password manually."); }
    }
  };

  const handleForgotPassword=async()=>{
    if(!form.email){ setAuthErr("Enter your email first"); return; }
    try{
      const auth=await getFireAuth();
      const {sendPasswordResetEmail}=await import("firebase/auth");
      await sendPasswordResetEmail(auth,form.email);
      showToast("✅ Reset email sent! Check inbox.");
      setAuthErr("");
    } catch{ setAuthErr("Could not send reset email. Try again."); }
  };

  const handleLogout=async()=>{
    try{ const auth=await getFireAuth(); const {signOut}=await import("firebase/auth"); await signOut(auth); }catch{}
    S.set("yyp_current",null);
    clearInterval(timerRef.current);
    setUser(null); setAnalysis(null); setUsageInfo(null); setTimer(null); setScreen("auth");
  };

  // ─── AD ─────────────────────────────────────────────────────────────────────
  const showInterAd=()=>new Promise(resolve=>{
    setAdIdx(Math.floor(Math.random()*ADS.length));
    setAdTimer(5); setShowAd(true);
    let t=5;
    adRef.current=setInterval(()=>{ t--; setAdTimer(t); if(t<=0)clearInterval(adRef.current); },1000);
    window._adRes=resolve;
  });
  const closeAd=()=>{
    if(adTimer>0) return;
    clearInterval(adRef.current); setShowAd(false);
    if(window._adRes){ window._adRes(); window._adRes=null; }
  };

  // ─── ANALYSIS ───────────────────────────────────────────────────────────────
  const runAnalysis=async()=>{
    if(!pForm.name||!pForm.category||!pForm.platform){ setErr("Please fill all fields"); return; }
    setErr("");
    const info=calcUsage(user);
    if(info.remaining<=0){ setShowPrem(true); return; }
    if(curPlan==="free") await showInterAd();
    setLoading(true); setAnalysis(null); setSelPlat(null); setPlatData({});
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(pForm)});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Failed");
      addUsage(user);
      const newInfo=calcUsage(user);
      setUsageInfo(newInfo);
      if(newInfo.remaining<=0&&curPlan==="free"&&!S.get("yyp_limit_hit_"+user.email)){
        S.set("yyp_limit_hit_"+user.email,Date.now());
        setTimeout(()=>startTimer(user),300);
      }
      setAnalysis(data);
      showToast("✅ Analysis complete!");
    } catch(e){ setErr("Analysis failed: "+e.message); }
    setLoading(false);
  };

  // ─── PLATFORM ADS ──────────────────────────────────────────────────────────
  const fetchPlat=async(pid)=>{
    if(isLocked){ setShowPrem(true); return; }
    setSelPlat(pid);
    if(platData[pid]) return;
    setPlatLoading(true);
    try{
      const pl=PLATFORMS.find(p=>p.id===pid);
      const ctrl=new AbortController();
      const to=setTimeout(()=>ctrl.abort(),25000);
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:pForm.name,category:pForm.category,platform:pl.name,mode:"ads_platform"}),signal:ctrl.signal});
      clearTimeout(to);
      if(!res.ok) throw new Error("API error");
      const data=await res.json();
      if(data.error) throw new Error(data.error);
      setPlatData(prev=>({...prev,[pid]:data}));
    } catch(e){
      showToast(e.name==="AbortError"?"Request timed out. Try again.":"Failed to load. Try again.");
      setSelPlat(null);
    }
    setPlatLoading(false);
  };

  // ─── API HELPER ────────────────────────────────────────────────────────────
  const apiCall=async(mode,extra={})=>{
    if(isLocked){ setShowPrem(true); throw new Error("locked"); }
    const body={name:pForm.name||"general",category:pForm.category||"Fashion",platform:pForm.platform||"Amazon",mode,...extra};
    const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok) throw new Error("API error");
    return res.json();
  };

  // ─── PROFIT CALC ───────────────────────────────────────────────────────────
  const calcProfit=()=>{
    const buy=parseFloat(profitForm.buy)||0;
    const sell=parseFloat(profitForm.sell)||0;
    const units=parseInt(profitForm.units)||1;
    const fee=parseFloat(profitForm.fee)||0;
    const ship=parseFloat(profitForm.ship)||0;
    const ads=parseFloat(profitForm.ads)||0;
    const platCut=sell*(fee/100);
    const netPer=sell-buy-platCut-ship;
    const totalProfit=(netPer*units)-ads;
    const totalCost=(buy*units)+ads;
    const roi=totalCost>0?((totalProfit/totalCost)*100).toFixed(1):0;
    const margin=sell>0?((netPer/sell)*100).toFixed(1):0;
    setProfitResult({profit:totalProfit.toFixed(0),netPer:netPer.toFixed(0),roi,margin,cost:totalCost.toFixed(0),revenue:(sell*units).toFixed(0),breakEven:netPer>0?Math.ceil(ads/netPer):0});
  };

  const calcInv=()=>{
    const buy=parseFloat(invForm.buy)||0, sell=parseFloat(invForm.sell)||0, units=parseInt(invForm.units)||1;
    const fee=parseFloat(invForm.fee)||0, ship=parseFloat(invForm.ship)||0, ads=parseFloat(invForm.ads)||0;
    const platCut=sell*(fee/100), netPer=sell-buy-platCut-ship;
    const totalProfit=(netPer*units)-ads, totalCost=(buy*units)+ads;
    const roi=totalCost>0?((totalProfit/totalCost)*100).toFixed(1):0;
    const margin=sell>0?((netPer/sell)*100).toFixed(1):0;
    setInvResult({profit:totalProfit.toFixed(0),netPer:netPer.toFixed(0),roi,margin,cost:totalCost.toFixed(0),revenue:(sell*units).toFixed(0),breakEven:netPer>0?Math.ceil(ads/netPer):0});
  };

  // ─── PREMIUM ───────────────────────────────────────────────────────────────
  const activatePremium=()=>{
    const expiry=new Date(Date.now()+PREMIUM_DAYS*86400000).toISOString();
    S.set("yyp_prem_"+user.email,{expiry,used:0});
    S.set("yyp_plan_"+user.email,"premium");
    S.set("yyp_limit_hit_"+user.email,null);
    clearInterval(timerRef.current); setTimer(null);
    const u={...user,plan:"premium"};
    setUser(u); setUsageInfo(calcUsage(u));
    setPayStep("success"); showToast("🎉 Premium activated!");
  };

  const loadRzp=()=>new Promise(resolve=>{
    if(window.Razorpay){resolve(true);return;}
    const s=document.createElement("script");
    s.src="https://checkout.razorpay.com/v1/checkout.js";
    s.onload=()=>resolve(true); s.onerror=()=>resolve(false);
    document.body.appendChild(s);
  });

  const handlePayment=async()=>{
    setPayStep("processing");
    try{
      const kr=await fetch("/api/payment");
      const kd=await kr.json();
      if(!kd.key){ await new Promise(r=>setTimeout(r,1500)); activatePremium(); return; }
      const loaded=await loadRzp();
      if(!loaded){ showToast("Payment failed to load"); setPayStep("form"); return; }
      const opts={
        key:kd.key, amount:24900, currency:"INR",
        name:"YesYouPro", description:"Premium 7 Days / 30 Analyses",
        handler:(r)=>{ if(r.razorpay_payment_id) activatePremium(); },
        prefill:{name:user?.name||"",email:user?.email||""},
        theme:{color:"#6366f1"},
        modal:{ondismiss:()=>{ setPayStep("form"); showToast("Payment cancelled."); }}
      };
      setPayStep("form");
      const rzp=new window.Razorpay(opts);
      rzp.on("payment.failed",()=>{ setPayStep("form"); showToast("Payment failed. Try again."); });
      rzp.open();
    } catch{ await new Promise(r=>setTimeout(r,1000)); activatePremium(); }
  };

  // ─── LOCK OVERLAY ──────────────────────────────────────────────────────────
  const LockOverlay=({name})=>(
    <div onClick={()=>setShowPrem(true)} style={{position:"absolute",inset:0,background:"rgba(2,8,23,0.88)",borderRadius:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(6px)"}}>
      <div style={{fontSize:48,marginBottom:12}}>🔒</div>
      <div style={{fontWeight:800,fontSize:17,color:"#f8fafc",marginBottom:6}}>{name}</div>
      <div style={{color:"#94a3b8",fontSize:13,marginBottom:18,textAlign:"center",padding:"0 24px"}}>
        {timer?"Daily limit reached. Buy Premium or wait 24hrs.":"Unlock with Premium ₹249"}
      </div>
      <button onClick={(e)=>{e.stopPropagation();setShowPrem(true);}} style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:12,padding:"12px 32px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>💎 Unlock ₹249</button>
    </div>
  );

  // ─── CSS ────────────────────────────────────────────────────────────────────
  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#e8ecf1;font-family:'Inter',sans-serif;color:#1a1a2e;}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes scaleIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
    .fade-in{animation:fadeIn .5s ease}
    .spinner{width:36px;height:36px;border:3px solid rgba(99,102,241,.2);border-top:3px solid #6366f1;border-radius:50%;animation:spin .8s linear infinite}
    .sm-spin{width:22px;height:22px;border:2px solid rgba(99,102,241,.2);border-top:2px solid #6366f1;border-radius:50%;animation:spin .8s linear infinite;margin:20px auto}
    .toast{position:fixed;top:24px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 32px rgba(16,185,129,.4);animation:fadeIn .3s ease;white-space:nowrap}
    /* AUTH */
    .neu{min-height:100vh;background:#e8ecf1;display:flex;align-items:center;justify-content:center;padding:20px}
    .ncard{background:#e8ecf1;border-radius:30px;padding:36px 28px;width:100%;max-width:420px;box-shadow:8px 8px 20px #c8cdd5,-8px -8px 20px #fff}
    .navt{width:88px;height:88px;background:#e8ecf1;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:6px 6px 14px #c8cdd5,-6px -6px 14px #fff;overflow:hidden}
    .navt img{width:100%;height:100%;object-fit:cover;border-radius:50%}
    .ntitle{font-size:22px;font-weight:800;text-align:center;color:#1a1a2e;margin-bottom:4px}
    .nsub{color:#8b8fa8;font-size:13px;text-align:center;margin-bottom:22px}
    .ntabs{display:flex;background:#e8ecf1;border-radius:14px;padding:4px;margin-bottom:18px;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #fff}
    .ntab{flex:1;padding:10px 0;background:none;border:none;color:#8b8fa8;font-size:14px;font-weight:600;cursor:pointer;border-radius:11px;font-family:'Inter',sans-serif;transition:all .25s}
    .ntab.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:4px 4px 10px rgba(99,102,241,.4)}
    .niw{position:relative;margin-bottom:12px}
    .nii{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none}
    .ni{width:100%;background:#e8ecf1;border:none;border-radius:14px;padding:13px 16px 13px 44px;color:#1a1a2e;font-size:14px;font-family:'Inter',sans-serif;outline:none;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #fff}
    .ni:focus{box-shadow:inset 5px 5px 12px #bec3cb,inset -5px -5px 12px #f2f6fc}
    .ni::placeholder{color:#adb5bd}
    .eye-btn{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:18px}
    .nerr{color:#e53e3e;font-size:12px;margin:-4px 0 10px 4px}
    .nbtn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:14px;padding:14px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:4px 4px 12px rgba(99,102,241,.5);transition:all .2s;margin-bottom:12px}
    .gbtn{width:100%;background:#e8ecf1;border:none;border-radius:14px;padding:12px 0;color:#4a5568;font-weight:700;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font-family:'Inter',sans-serif;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #fff;transition:all .2s;margin-bottom:12px}
    .div-line{display:flex;align-items:center;gap:12px;margin:12px 0}
    .dl{flex:1;height:1px;background:linear-gradient(90deg,transparent,#c8cdd5,transparent)}
    .dt{color:#adb5bd;font-size:11px;font-weight:600}
    .saved-wrap{margin-bottom:16px}
    .slbl{color:#8b8fa8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
    .sacc{display:flex;align-items:center;gap:10px;background:#e8ecf1;border:none;border-radius:14px;padding:10px 12px;margin-bottom:7px;cursor:pointer;width:100%;text-align:left;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #fff}
    .savt{width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;flex-shrink:0;overflow:hidden}
    .savt img{width:100%;height:100%;object-fit:cover}
    .sinfo{flex:1;min-width:0}
    .sname{font-size:13px;font-weight:700;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .semail{font-size:11px;color:#8b8fa8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .sdots{font-size:11px;color:#adb5bd;letter-spacing:2px}
    .rem-row{display:flex;align-items:center;gap:8px;margin-bottom:12px}
    .rem-row input{width:18px;height:18px;accent-color:#6366f1}
    .rem-row label{color:#8b8fa8;font-size:13px;flex:1}
    .forgot{color:#6366f1;font-size:13px;font-weight:600;cursor:pointer}
    .sw-txt{color:#8b8fa8;font-size:13px;text-align:center;margin-top:12px}
    .sw-lnk{color:#6366f1;cursor:pointer;font-weight:700}
    /* DASHBOARD */
    .dash{min-height:100vh;background:#020817;color:#f8fafc}
    .nav{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid rgba(255,255,255,.04);background:rgba(2,8,23,.95);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100}
    .logo{font-weight:900;font-size:18px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .upill{background:rgba(15,23,42,.9);border:1px solid #1e293b;border-radius:100px;padding:6px 14px;font-size:13px;display:flex;align-items:center;gap:8px}
    .nav-r{display:flex;align-items:center;gap:8px}
    .upg-btn{background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:100px;padding:7px 16px;color:#fff;font-weight:800;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif}
    .avt{width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;overflow:hidden}
    .avt img{width:100%;height:100%;object-fit:cover}
    .exit-btn{background:none;border:1px solid #1e293b;border-radius:8px;padding:6px 12px;color:#475569;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif}
    .dcontent{max-width:880px;margin:0 auto;padding:36px 18px 80px}
    .hero{text-align:center;margin-bottom:40px}
    .hbadge{display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.3);border-radius:100px;padding:5px 16px;font-size:12px;color:#a5b4fc;font-weight:700;margin-bottom:16px}
    .htitle{font-weight:900;font-size:clamp(24px,5vw,46px);line-height:1.1;margin-bottom:12px;letter-spacing:-1px}
    .grad{background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hsub{color:#64748b;font-size:14px;max-width:500px;margin:0 auto;line-height:1.65}
    /* TIMER */
    .timer-box{background:linear-gradient(135deg,rgba(239,68,68,.1),rgba(245,158,11,.06));border:1px solid rgba(239,68,68,.3);border-radius:20px;padding:22px;margin-bottom:22px;text-align:center;animation:fadeIn .4s ease}
    .timer-title{font-size:16px;font-weight:800;color:#ef4444;margin-bottom:4px}
    .timer-sub{font-size:13px;color:#64748b;margin-bottom:18px}
    .timer-row{display:flex;align-items:center;justify-content:center;gap:10px}
    .tunit{background:rgba(15,23,42,.8);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:12px 16px;min-width:64px}
    .tnum{font-size:28px;font-weight:900;color:#ef4444;font-variant-numeric:tabular-nums;line-height:1}
    .tlbl{font-size:10px;color:#64748b;font-weight:600;margin-top:3px;text-transform:uppercase}
    .tsep{font-size:24px;font-weight:900;color:#ef4444;margin-bottom:8px}
    .tprog{height:4px;background:#1e293b;border-radius:100px;overflow:hidden;margin-top:14px}
    .tprog-fill{height:100%;background:linear-gradient(90deg,#ef4444,#f59e0b);transition:width 1s linear}
    /* STATUS BANNERS */
    .banner-green{background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.2);border-radius:14px;padding:11px 16px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:8px}
    .banner-red{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);border-radius:14px;padding:11px 16px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:8px}
    /* INPUT CARD */
    .icard{background:rgba(15,23,42,.8);border:1px solid rgba(99,102,241,.15);border-radius:22px;padding:28px 24px;margin-bottom:36px}
    .ictitle{font-weight:800;font-size:17px;margin-bottom:20px;color:#f8fafc}
    .igrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px}
    .igrp{display:flex;flex-direction:column;gap:6px}
    .ilbl{font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    .di{width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:12px 14px;color:#f8fafc;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:all .2s;appearance:none;-webkit-appearance:none}
    .di:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}
    .dsel-wrap{position:relative}
    .dsel-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#6366f1;pointer-events:none;font-size:14px}
    .errbanner{background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.25);border-radius:12px;padding:11px 14px;color:#ef4444;font-size:13px;margin-bottom:14px}
    .abtn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border:none;border-radius:14px;padding:15px 0;color:#fff;font-weight:800;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 8px 32px rgba(99,102,241,.35);transition:all .2s;font-family:'Inter',sans-serif}
    .anote{font-size:12px;opacity:.6}
    /* LOADING */
    .loverlay{position:fixed;inset:0;background:rgba(2,8,23,.97);display:flex;align-items:center;justify-content:center;z-index:7000}
    .lcard{background:rgba(15,23,42,.95);border:1px solid rgba(99,102,241,.25);border-radius:22px;padding:44px 36px;text-align:center;max-width:360px;width:90%}
    .lbrain{font-size:56px;margin-bottom:18px;animation:pulse 1.2s ease infinite}
    .lt1{font-weight:900;font-size:20px;margin-bottom:6px;color:#f8fafc}
    .lt2{color:#64748b;font-size:13px;margin-bottom:24px}
    .lsteps{display:flex;flex-direction:column;gap:7px;text-align:left}
    .lstep{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;border:1px solid transparent;font-size:13px;color:#475569;transition:all .4s}
    .lstep.done{color:#10b981;border-color:rgba(16,185,129,.25);background:rgba(16,185,129,.06)}
    .lstep.act{color:#a5b4fc;border-color:rgba(99,102,241,.3);background:rgba(99,102,241,.08)}
    /* RESULTS */
    .rtitle{font-weight:900;font-size:20px;margin-bottom:22px;color:#f8fafc}
    .mrow{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:16px}
    .mcard{background:rgba(15,23,42,.85);border:1px solid #1e293b;border-radius:16px;padding:18px 14px;position:relative;overflow:hidden}
    .mcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6366f1,#a855f7)}
    .mlbl{font-size:11px;color:#64748b;margin-bottom:7px;font-weight:600;text-transform:uppercase}
    .mval{font-weight:900;font-size:19px}
    .tcol{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin-bottom:10px}
    .gcard{background:rgba(15,23,42,.75);border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:10px}
    .gct{font-weight:800;font-size:14px;margin-bottom:11px;color:#e2e8f0}
    .gctx{color:#94a3b8;line-height:1.75;font-size:13px}
    .hitem{display:flex;align-items:flex-start;gap:10px;color:#cbd5e1;font-size:14px;margin-bottom:10px}
    .hnum{min-width:26px;height:26px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0}
    .kwg{display:flex;flex-wrap:wrap;gap:6px}
    .kwc{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.22);color:#a5b4fc;border-radius:100px;padding:4px 12px;font-size:12px}
    /* PLATFORMS */
    .psec{background:rgba(15,23,42,.8);border:1px solid rgba(245,158,11,.2);border-radius:20px;padding:24px 20px;margin-bottom:10px;position:relative}
    .psh{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
    .pst{font-weight:800;font-size:15px;color:#e2e8f0}
    .pbadge{background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:2px 10px;font-size:11px;font-weight:800;color:#fff}
    .pss{color:#64748b;font-size:12px;margin-bottom:18px}
    .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
    .pbtn{background:rgba(2,8,23,.7);border:1.5px solid #1e293b;border-radius:12px;padding:12px 6px 10px;text-align:center;cursor:pointer;transition:all .2s;position:relative}
    .pbtn:hover{border-color:rgba(99,102,241,.5);transform:translateY(-2px)}
    .pbtn.on{border-color:#6366f1;background:rgba(99,102,241,.1)}
    .plogo{width:28px;height:28px;margin:0 auto 6px}
    .pname{font-size:9px;font-weight:700;color:#94a3b8}
    .plk{position:absolute;top:4px;right:5px;font-size:10px}
    .pdet{background:rgba(2,8,23,.7);border:1px solid rgba(99,102,241,.2);border-radius:14px;padding:20px 16px;margin-top:12px;animation:fadeIn .4s ease}
    .pdb{margin-bottom:16px}
    .pdt{font-size:11px;font-weight:800;color:#a5b4fc;margin-bottom:7px;text-transform:uppercase;letter-spacing:.5px}
    .pdtx{color:#94a3b8;font-size:13px;line-height:1.75}
    .pdsteps{display:flex;flex-direction:column;gap:5px}
    .pdstep{display:flex;align-items:flex-start;gap:8px;background:rgba(99,102,241,.05);border:1px solid rgba(99,102,241,.12);border-radius:8px;padding:7px 10px;color:#cbd5e1;font-size:13px}
    .pdsn{min-width:18px;height:18px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff;flex-shrink:0}
    .pdch{display:flex;flex-wrap:wrap;gap:5px}
    .pdchip{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:#a5b4fc;border-radius:7px;padding:3px 9px;font-size:11px}
    /* FEATURE TABS */
    .ftabs-wrap{margin-top:8px;margin-bottom:24px}
    .fgrp-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;margin-top:16px}
    .ftabs{display:flex;gap:7px;overflow-x:auto;padding-bottom:3px;margin-bottom:4px}
    .ftabs::-webkit-scrollbar{height:2px}
    .ftabs::-webkit-scrollbar-thumb{background:#1e293b;border-radius:10px}
    .ftab{flex-shrink:0;padding:8px 14px;background:rgba(15,23,42,.7);border:1px solid #1e293b;border-radius:100px;color:#64748b;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s;white-space:nowrap}
    .ftab.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(99,102,241,.3)}
    .ftab:hover:not(.on){border-color:rgba(99,102,241,.4);color:#a5b4fc}
    .fbox{background:rgba(15,23,42,.8);border:1px solid rgba(99,102,241,.15);border-radius:20px;padding:26px 22px;margin-bottom:14px;position:relative}
    /* PROFIT */
    .prow{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:14px}
    .pfield{display:flex;flex-direction:column;gap:5px}
    .pfield label{font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase}
    .pfield input,.pfield select{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:10px 12px;color:#f8fafc;font-size:13px;font-family:'Inter',sans-serif;outline:none}
    .pfield input:focus,.pfield select:focus{border-color:#6366f1}
    .presult{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-top:14px;animation:fadeIn .4s ease}
    .prc{background:rgba(2,8,23,.6);border:1px solid #1e293b;border-radius:12px;padding:14px;text-align:center}
    .prl{font-size:10px;color:#64748b;margin-bottom:5px;font-weight:600;text-transform:uppercase}
    .prv{font-size:18px;font-weight:900}
    /* COMMON */
    .cbtn{background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:11px;padding:11px 24px;color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s}
    .cbtn:hover{transform:translateY(-1px)}
    .gbtn2{width:100%;border:none;border-radius:11px;padding:12px 0;color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:'Inter',sans-serif;margin-top:12px}
    .comp-card{background:rgba(15,23,42,.8);border:1px solid #1e293b;border-radius:14px;padding:18px;margin-bottom:10px}
    .comp-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
    .comp-box{background:rgba(2,8,23,.5);border-radius:9px;padding:10px}
    .comp-box-t{font-size:10px;color:#64748b;margin-bottom:5px;font-weight:700;text-transform:uppercase}
    .cpoint{font-size:12px;color:#94a3b8;padding:2px 0;display:flex;gap:6px}
    .trend-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:14px}
    .trend-card{background:rgba(15,23,42,.8);border:1px solid #1e293b;border-radius:14px;padding:16px}
    .trank{width:26px;height:26px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;margin-bottom:8px}
    .tc{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);color:#10b981;border-radius:100px;padding:2px 7px;font-size:10px}
    .supp-card{background:rgba(15,23,42,.8);border:1px solid rgba(16,185,129,.15);border-radius:14px;padding:18px;margin-bottom:10px}
    .schip{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);color:#10b981;border-radius:7px;padding:3px 10px;font-size:12px;font-weight:600}
    .slink{display:inline-block;margin-top:8px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:8px;padding:5px 14px;font-size:12px;font-weight:600;text-decoration:none}
    /* MODAL */
    .moverlay{position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:8000;backdrop-filter:blur(8px)}
    .pmodal{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid rgba(245,158,11,.25);border-radius:26px;padding:36px 28px;max-width:450px;width:92%;text-align:center;animation:scaleIn .3s ease;max-height:90vh;overflow-y:auto}
    .pbadge2{display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:5px 18px;font-size:12px;font-weight:800;color:#fff;margin-bottom:12px}
    .ptitle{font-weight:900;font-size:24px;margin-bottom:5px;color:#f8fafc}
    .pprice{font-weight:900;font-size:38px;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:5px}
    .pprice span{font-size:14px;-webkit-text-fill-color:#94a3b8}
    .phigh{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.25);border-radius:12px;padding:12px;margin-bottom:16px;color:#10b981;font-size:13px;font-weight:600;line-height:1.6;text-align:left}
    .pflist{display:flex;flex-direction:column;gap:6px;margin-bottom:20px;text-align:left}
    .pfi{color:#cbd5e1;font-size:13px;padding:8px 12px;background:rgba(255,255,255,.02);border-radius:9px;border:1px solid rgba(255,255,255,.04)}
    .pbtn2{width:100%;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:13px;padding:14px 0;color:#fff;font-weight:800;font-size:14px;cursor:pointer;margin-bottom:8px;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px}
    .mcancel{background:none;border:none;color:#475569;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;padding:6px 0;width:100%}
    .paybox{background:#020817;border:1px solid #1e293b;border-radius:12px;padding:14px;margin-bottom:12px;text-align:left}
    .prow2{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);color:#94a3b8;font-size:13px}
    .prow2:last-child{border-bottom:none}
    .sfeat{background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.2);border-radius:12px;padding:14px;margin:12px 0 18px;text-align:left}
    .sfi2{color:#10b981;font-size:13px;padding:3px 0;font-weight:500}
    /* AD */
    .adoverlay{position:fixed;inset:0;background:rgba(0,0,0,.97);display:flex;align-items:center;justify-content:center;z-index:9000}
    .adbox{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid #1e293b;border-radius:22px;padding:36px 28px;max-width:380px;width:92%;text-align:center;position:relative;animation:scaleIn .3s ease}
    .adtop{position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;border-radius:100px;font-size:9px;font-weight:800;color:#fff;letter-spacing:1.5px}
    .adh{font-weight:900;font-size:20px;margin:12px 0 6px;color:#f8fafc}
    .ads{color:#94a3b8;margin-bottom:18px;font-size:13px}
    .adcta{border:none;border-radius:100px;padding:10px 26px;color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif}
    .adprog{height:3px;background:#1e293b;border-radius:100px;margin:16px 0 0;overflow:hidden}
    .adpf{height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width 1s linear}
    .adclose{display:block;margin:10px auto 0;background:none;border:1px solid #2d3748;border-radius:100px;padding:7px 20px;color:#94a3b8;cursor:pointer;font-size:12px;font-family:'Inter',sans-serif}
    footer{text-align:center;padding:20px;color:#334155;font-size:12px;border-top:1px solid rgba(255,255,255,.03)}
    /* COPY BTN HOVER */
    .copy-hover:hover{background:rgba(99,102,241,.25)!important;transform:scale(1.05)}
    /* PICKER SEARCH */
    .picker-search{width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:9px 14px;color:#f8fafc;font-size:13px;font-family:'Inter',sans-serif;outline:none;margin-bottom:10px}
    .picker-search:focus{border-color:#6366f1}
    @media(max-width:600px){
      .nav{padding:11px 12px} .dcontent{padding:24px 12px 60px}
      .upill{display:none} .pgrid{gap:5px} .pbtn{padding:10px 3px 8px}
      .ncard{padding:28px 18px} .icard{padding:20px 14px}
    }
  `;

  const STEPS=["Product data received","Analyzing market trends","Generating AI insights","Creating viral hooks"];

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  if(screen==="loading") return (
    <><style>{css}</style>
    <div style={{minHeight:"100vh",background:"#e8ecf1",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div className="spinner"/><p style={{color:"#8b8fa8",marginTop:16,fontSize:14,fontWeight:500}}>Loading YesYouPro...</p>
    </div></>
  );

  return (<>
    <style>{css}</style>
    {toast&&<div className="toast">{toast}</div>}

    {/* LOADING OVERLAY */}
    {loading&&<div className="loverlay">
      <div className="lcard">
        <div className="lbrain">🧠</div>
        <h2 className="lt1">Analyzing Product</h2>
        <p className="lt2">YYP AI is processing...</p>
        <div className="lsteps">
          {STEPS.map((s,i)=>(
            <div key={i} className={"lstep"+(loadStep>i?" done":loadStep===i?" act":"")}>
              <span>{loadStep>i?"✅":loadStep===i?"⚙️":"○"}</span><span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>}

    {/* AD OVERLAY */}
    {showAd&&<div className="adoverlay">
      <div className="adbox">
        <div className="adtop" style={{background:ADS[adIdx].color}}>ADVERTISEMENT</div>
        <div style={{fontSize:46,marginTop:8}}>📢</div>
        <h2 className="adh">{ADS[adIdx].headline}</h2>
        <p className="ads">{ADS[adIdx].sub}</p>
        <button className="adcta" style={{background:ADS[adIdx].color}}>{ADS[adIdx].cta}</button>
        <div className="adprog"><div className="adpf" style={{width:((5-adTimer)/5*100)+"%"}}/></div>
        <button onClick={closeAd} className="adclose" style={{opacity:adTimer>0?.3:1,cursor:adTimer>0?"not-allowed":"pointer"}}>
          {adTimer>0?"⏳ Skip in "+adTimer+"s":"✕ Close & Continue"}
        </button>
      </div>
    </div>}

    {/* PREMIUM MODAL */}
    {showPrem&&<div className="moverlay" onClick={()=>{if(payStep==="form"||payStep==="success"){setShowPrem(false);setShowPay(false);setPayStep("form");}}}>
      <div className="pmodal" onClick={e=>e.stopPropagation()}>
        {!showPay?(
          <>
            <div className="pbadge2">💎 PREMIUM PLAN</div>
            <h2 className="ptitle">Unlock Everything</h2>
            <div className="pprice">₹249 <span>/ 7 days</span></div>
            <div className="phigh">📊 30 analyses in 7 days (Free: 2/day only)<br/>⏰ No 24hr lockout — analyze anytime<br/>🚫 Zero ads — completely clean<br/>🔓 All 13 tools unlocked instantly</div>
            <div className="pflist">
              {["✅ 30 analyses / 7 days","✅ Zero ads forever","✅ No 24hr wait","🎓 Starter Guide","🔰 Beginner Product Finder","🧮 Investment Calculator","📊 Sales Estimator","🏷️ Price Optimizer","📦 Inventory Calculator","⭐ Review Analyzer","🎯 Niche Finder","📺 Ads on 8 platforms","🎬 Video Publishing Guide"].map(f=>(
                <div key={f} className="pfi">{f}</div>
              ))}
            </div>
            <button className="pbtn2" onClick={()=>setShowPay(true)}>🔓 Unlock Premium — ₹249</button>
            <button className="mcancel" onClick={()=>setShowPrem(false)}>Maybe later</button>
          </>
        ):payStep==="form"?(
          <>
            <h2 className="ptitle">Complete Payment</h2>
            <div className="paybox">
              <div className="prow2"><span>Plan</span><span>Premium 7-day</span></div>
              <div className="prow2"><span>Amount</span><span style={{color:"#f59e0b",fontWeight:700}}>₹249</span></div>
              <div className="prow2"><span>Analyses</span><span style={{color:"#10b981"}}>30 in 7 days</span></div>
              <div className="prow2"><span>All Tools</span><span style={{color:"#10b981"}}>13 unlocked</span></div>
              <div className="prow2"><span>Validity</span><span style={{color:"#a5b4fc"}}>7 days from purchase</span></div>
            </div>
            <button className="pbtn2" onClick={handlePayment}>
              <svg width="18" height="18" viewBox="0 0 30 30" fill="none"><path d="M14.396 0L0 19.578h9.979L7.242 30l22.758-19.56H19.5L22.25 0z" fill="#528FF0"/></svg>
              Pay ₹249 via Razorpay
            </button>
            <button className="mcancel" onClick={()=>setShowPay(false)}>← Back</button>
          </>
        ):payStep==="processing"?(
          <div style={{textAlign:"center",padding:40}}><div className="spinner" style={{margin:"0 auto"}}/><p style={{color:"#94a3b8",marginTop:16}}>Processing payment...</p></div>
        ):(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:12}}>🎉</div>
            <h2 className="ptitle">Premium Activated!</h2>
            <div className="sfeat">
              <div className="sfi2">✅ 30 analyses / 7 days active</div>
              <div className="sfi2">✅ Zero ads</div>
              <div className="sfi2">✅ All 13 tools unlocked</div>
              <div className="sfi2">✅ No 24hr lockout</div>
            </div>
            <button className="pbtn2" onClick={()=>{setShowPrem(false);setShowPay(false);setPayStep("form");}}>🚀 Start Analyzing →</button>
          </div>
        )}
      </div>
    </div>}

    {/* AUTH PAGE */}
    {screen==="auth"&&<div className="neu">
      <div className="ncard">
        <div className="navt">
          <svg viewBox="0 0 24 24" fill="none" stroke="#8b8fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="42" height="42">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h1 className="ntitle">{authMode==="login"?"Welcome back":"Create account"}</h1>
        <p className="nsub">{authMode==="login"?"Sign in to continue":"Join YesYouPro for free"}</p>

        {authMode==="login"&&savedAccounts.length>0&&(
          <div className="saved-wrap">
            <div className="slbl">Quick Login</div>
            {savedAccounts.map(a=>(
              <button key={a.email} className="sacc" onClick={()=>quickLogin(a)}>
                <div className="savt">{a.photo?<img src={a.photo} alt=""/>:a.name?.[0]?.toUpperCase()||"U"}</div>
                <div className="sinfo">
                  <div className="sname">{a.name}</div>
                  <div className="semail">{a.email}</div>
                  <div className="sdots">{a.password?"●".repeat(Math.min(a.password.length,8)):"Google Account"}</div>
                </div>
                <div style={{color:"#6366f1",fontSize:18,fontWeight:700}}>→</div>
              </button>
            ))}
            <div className="div-line"><div className="dl"/><div className="dt">OR SIGN IN MANUALLY</div><div className="dl"/></div>
          </div>
        )}

        <div className="ntabs">
          {["login","signup"].map(m=>(
            <button key={m} className={"ntab"+(authMode===m?" on":"")} onClick={()=>{setAuthMode(m);setAuthErr("");setForm({email:"",password:"",name:""});}}>
              {m==="login"?"Login":"Sign Up"}
            </button>
          ))}
        </div>

        <button className="gbtn" onClick={handleGoogle} disabled={gLoading}>
          {gLoading?<div className="spinner" style={{width:18,height:18,border:"2px solid rgba(99,102,241,.2)",borderTop:"2px solid #6366f1"}}/>:(
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {gLoading?"Signing in...":"Continue with Google"}
        </button>

        <div className="div-line"><div className="dl"/><div className="dt">OR CONTINUE WITH EMAIL</div><div className="dl"/></div>

        {authMode==="signup"&&<div className="niw"><span className="nii">👤</span><input className="ni" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>}
        <div className="niw"><span className="nii">✉️</span><input className="ni" placeholder="Email address" type="email" autoComplete="off" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div className="niw">
          <span className="nii">🔒</span>
          <input className="ni" placeholder="Password" type={showPass?"text":"password"} autoComplete="new-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <button className="eye-btn" onClick={()=>setShowPass(!showPass)}>{showPass?"🙈":"👁️"}</button>
        </div>
        {authErr&&<p className="nerr">⚠️ {authErr}</p>}
        {authMode==="login"&&(
          <div className="rem-row">
            <input type="checkbox" id="rem" defaultChecked/>
            <label htmlFor="rem">Remember me</label>
            <span className="forgot" onClick={handleForgotPassword}>Forgot password?</span>
          </div>
        )}
        <button className="nbtn" onClick={handleAuth}>{authMode==="login"?"Sign In →":"Create Account →"}</button>
        <p className="sw-txt">{authMode==="login"?"Don't have an account? ":"Already have an account? "}
          <span className="sw-lnk" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("");setForm({email:"",password:"",name:""});}}>{authMode==="login"?"Sign Up Free":"Sign In"}</span>
        </p>
      </div>
    </div>}

    {/* DASHBOARD */}
    {screen==="dashboard"&&<div className="dash">
      <nav className="nav">
        <div className="logo">🧠 YesYouPro</div>
        {usageInfo&&<div className="upill">
          <span style={{color:curPlan==="premium"?"#f59e0b":"#94a3b8",fontWeight:700}}>{curPlan==="premium"?"💎 Premium":"🆓 Free"}</span>
          <span style={{color:"#334155"}}>|</span>
          <span style={{color:usageInfo.remaining>0?"#10b981":"#ef4444",fontWeight:700}}>
            {curPlan==="premium"?`${usageInfo.remaining} left`:`${usageInfo.remaining}/${FREE_DAILY_LIMIT} today`}
          </span>
        </div>}
        <div className="nav-r">
          {curPlan==="free"&&<button className="upg-btn" onClick={()=>setShowPrem(true)}>💎 ₹249</button>}
          <div className="avt">{user?.photo?<img src={user.photo} alt=""/>:user?.name?.[0]?.toUpperCase()||"U"}</div>
          <button className="exit-btn" onClick={handleLogout}>Exit</button>
        </div>
      </nav>

      <div className="dcontent">
        {/* HERO */}
        <div className="hero">
          <div className="hbadge">✨ YYP AI — Product Intelligence</div>
          <h1 className="htitle">Product Intelligence<br/><span className="grad">Powered by YesYouPro</span></h1>
          <p className="hsub">Analyze ANYTHING — physical products, digital items, apps, games, websites, social media, services, courses & more!</p>
        </div>

        {/* 24HR TIMER */}
        {timer&&curPlan==="free"&&<div className="timer-box">
          <div className="timer-title">⏳ Daily Limit Reached</div>
          <div className="timer-sub">You used your 2 free analyses. Next reset in:</div>
          <div className="timer-row">
            {[{v:String(timer.h).padStart(2,"0"),l:"Hours"},{sep:true},{v:String(timer.m).padStart(2,"0"),l:"Minutes"},{sep:true},{v:String(timer.s).padStart(2,"0"),l:"Seconds"}].map((t,i)=>
              t.sep?<div key={i} className="tsep">:</div>:
              <div key={i} className="tunit"><div className="tnum">{t.v}</div><div className="tlbl">{t.l}</div></div>
            )}
          </div>
          <div className="tprog"><div className="tprog-fill" style={{width:Math.max(0,100-(timer.total/86400000)*100)+"%"}}/></div>
          <div style={{marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{color:"#64748b",fontSize:13}}>Don&apos;t want to wait?</span>
            <button onClick={()=>setShowPrem(true)} style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:100,padding:"8px 18px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>💎 Get Premium ₹249</button>
          </div>
        </div>}

        {/* STATUS BANNER */}
        {curPlan==="free"&&!timer&&usageInfo&&(
          usageInfo.remaining>0?(
            <div className="banner-green">
              <div>
                <div style={{fontWeight:700,fontSize:13,color:"#10b981"}}>✅ All Tools Unlocked — {usageInfo.remaining} Analyses Remaining</div>
                <div style={{fontSize:12,color:"#475569"}}>Use all tools freely. Resets after 24hrs.</div>
              </div>
            </div>
          ):(
            <div className="banner-red">
              <div>
                <div style={{fontWeight:700,fontSize:13,color:"#ef4444"}}>🔒 Daily Limit Reached</div>
                <div style={{fontSize:12,color:"#64748b"}}>All tools locked for 24hrs. Buy Premium for unlimited access.</div>
              </div>
              <button onClick={()=>setShowPrem(true)} style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"Inter,sans-serif"}}>💎 ₹249</button>
            </div>
          )
        )}

        {/* ANALYSIS INPUT */}
        <div className="icard">
          <h3 className="ictitle">🎯 Analyze Anything</h3>
          <div className="igrp" style={{marginBottom:16}}>
            <label className="ilbl">Product / Item / Service Name *</label>
            <input className="di" placeholder="e.g. Portable Blender, BGMI, YouTube Channel, Dropshipping Store..." value={pForm.name} onChange={e=>setPForm({...pForm,name:e.target.value})}/>
          </div>

          {/* CATEGORY VISUAL PICKER */}
          <div style={{marginBottom:18}}>
            <label className="ilbl" style={{marginBottom:10,display:"block"}}>Category * {pForm.category&&<span style={{color:"#10b981",marginLeft:6}}>✅ {pForm.category}</span>}</label>
            {["physical","digital","other"].map(type=>(
              <div key={type} style={{marginBottom:10}}>
                <div style={{fontSize:11,color:type==="digital"?"#a855f7":type==="physical"?"#10b981":"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
                  {type==="physical"?"📦 Physical Products":type==="digital"?"💻 Digital & Virtual":"✨ Other"}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {CATEGORIES.filter(c=>c.type===type).map(c=>(
                    <button key={c.id} onClick={()=>setPForm({...pForm,category:c.id})} style={{
                      background:pForm.category===c.id?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(15,23,42,0.7)",
                      border:pForm.category===c.id?"1px solid #6366f1":"1px solid #1e293b",
                      borderRadius:10, padding:"6px 12px", cursor:"pointer",
                      display:"flex", alignItems:"center", gap:5,
                      color:pForm.category===c.id?"#fff":"#94a3b8",
                      fontSize:12, fontWeight:600, fontFamily:"Inter,sans-serif",
                      transition:"all .2s",
                      boxShadow:pForm.category===c.id?"0 2px 12px rgba(99,102,241,.4)":"none"
                    }}>
                      <span style={{fontSize:14}}>{c.icon}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* PLATFORM VISUAL PICKER */}
          <div style={{marginBottom:18}}>
            <label className="ilbl" style={{marginBottom:10,display:"block"}}>Platform * {pForm.platform&&<span style={{color:"#10b981",marginLeft:6}}>✅ {pForm.platform}</span>}</label>
            {[...new Set(ALL_PLATFORMS.map(p=>p.group))].map(grp=>(
              <div key={grp} style={{marginBottom:10}}>
                <div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{grp}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {ALL_PLATFORMS.filter(p=>p.group===grp).map(p=>(
                    <button key={p.id} onClick={()=>setPForm({...pForm,platform:p.id})} style={{
                      background:pForm.platform===p.id?p.color:"rgba(15,23,42,0.7)",
                      border:pForm.platform===p.id?`1px solid ${p.color}`:"1px solid #1e293b",
                      borderRadius:10, padding:"6px 12px", cursor:"pointer",
                      display:"flex", alignItems:"center", gap:5,
                      color:pForm.platform===p.id?"#fff":"#94a3b8",
                      fontSize:12, fontWeight:600, fontFamily:"Inter,sans-serif",
                      transition:"all .2s",
                      boxShadow:pForm.platform===p.id?`0 2px 12px ${p.color}60`:"none"
                    }}>
                      <span style={{fontSize:14}}>{p.icon}</span>{p.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {err&&<div className="errbanner">{err}</div>}
          <button className="abtn" onClick={runAnalysis} disabled={loading||(!!(timer&&curPlan==="free"))}>
            🚀 Get AI Analysis {curPlan==="free"&&!timer&&<span className="anote">· Ad plays first</span>}
          </button>
        </div>

                {/* ANALYSIS RESULTS */}
        {analysis&&<div className="fade-in" style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
            <h2 style={{fontWeight:900,fontSize:20,color:"#f8fafc",margin:0}}>📊 Results — <span className="grad">{pForm.name}</span></h2>
            {curPlan==="premium"?(
              <button onClick={()=>{
                const report = [
                  "=== YESYOUPRO ANALYSIS REPORT ===",
                  "Product: "+pForm.name,
                  "Category: "+pForm.category,
                  "Platform: "+pForm.platform,
                  "",
                  "📊 METRICS",
                  "Viral Score: "+analysis.viral_score,
                  "Demand: "+analysis.demand_level,
                  "Competition: "+analysis.competition_level,
                  "Price Range: "+analysis.price_range,
                  "",
                  "📝 DESCRIPTION",
                  analysis.description,
                  "",
                  "🪝 VIRAL HOOKS",
                  ...(analysis.hooks||[]).map((h,i)=>(i+1)+". "+h),
                  "",
                  "🔑 KEYWORDS",
                  (analysis.keywords||[]).join(", "),
                  "",
                  "🎯 TARGET AUDIENCE",
                  ...(Array.isArray(analysis.target_audience)?analysis.target_audience:[analysis.target_audience||""]).map((a,i)=>(i+1)+". "+a),
                  "",
                  analysis.monetization?"💰 MONETIZATION
"+analysis.monetization:"",
                  "=== Generated by YesYouPro.com ==="
                ].filter(Boolean).join("\n");
                copyText(report,"Full Report");
              }} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,padding:"9px 18px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",gap:6}}>
                📋 Copy Full Report
              </button>
            ):(
              <div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)",borderRadius:10,padding:"7px 14px",fontSize:12,color:"#f59e0b",cursor:"pointer"}} onClick={()=>setShowPrem(true)}>
                🔒 Copy Report (Premium)
              </div>
            )}
          </div>
          <div className="mrow">
            {[{l:"🔥 Viral Score",v:analysis.viral_score,c:"#f59e0b"},{l:"📈 Demand",v:analysis.demand_level,c:"#10b981"},{l:"⚔️ Competition",v:analysis.competition_level,c:"#ef4444"},{l:"💰 Price Range",v:analysis.price_range,c:"#6366f1"}].map(m=>(
              <div key={m.l} className="mcard"><div className="mlbl">{m.l}</div><div className="mval" style={{color:m.c}}>{m.v}</div></div>
            ))}
          </div>
          <div className="tcol">
            <div className="gcard">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
                <h4 className="gct" style={{margin:0}}>📝 Description</h4>
                {curPlan==="premium"&&<button onClick={()=>copyText(analysis.description,"Description")} style={{background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",borderRadius:7,padding:"4px 12px",cursor:"pointer",color:"#a5b4fc",fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif"}}>📋 Copy</button>}
              </div>
              <p className="gctx">{analysis.description}</p>
            </div>
            <div className="gcard"><h4 className="gct">🎯 Target Audience</h4>
              {Array.isArray(analysis.target_audience)?analysis.target_audience.map((a,i)=><div key={i} className="hitem"><span className="hnum">{i+1}</span><span style={{color:"#94a3b8",fontSize:13,lineHeight:1.6}}>{a}</span></div>):<p className="gctx">{analysis.target_audience}</p>}
            </div>
          </div>
          <div className="gcard">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
              <h4 className="gct" style={{margin:0}}>🪝 Viral Hooks</h4>
              {curPlan==="premium"&&<button onClick={()=>copyText(analysis.hooks?.join("\n"),"Viral Hooks")} style={{background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",borderRadius:7,padding:"4px 12px",cursor:"pointer",color:"#a5b4fc",fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif"}}>📋 Copy All</button>}
            </div>
            {analysis.hooks?.map((h,i)=>(
              <div key={i} className="hitem" style={{justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10,flex:1}}><span className="hnum">{i+1}</span><span>{h}</span></div>
                {curPlan==="premium"&&<button onClick={()=>copyText(h,"Hook "+(i+1))} style={{background:"none",border:"1px solid rgba(99,102,241,.2)",borderRadius:6,padding:"2px 8px",cursor:"pointer",color:"#6366f1",fontSize:10,fontWeight:600,fontFamily:"Inter,sans-serif",flexShrink:0,marginLeft:6}}>📋</button>}
              </div>
            ))}
          </div>
          <div className="gcard">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
              <h4 className="gct" style={{margin:0}}>🔑 Keywords</h4>
              {curPlan==="premium"&&<button onClick={()=>copyText(analysis.keywords?.join(", "),"Keywords")} style={{background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",borderRadius:7,padding:"4px 12px",cursor:"pointer",color:"#a5b4fc",fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif"}}>📋 Copy All</button>}
            </div>
            <div className="kwg">{analysis.keywords?.map((k,i)=>(
              <div key={i} className="kwc" style={{cursor:curPlan==="premium"?"pointer":"default",display:"flex",alignItems:"center",gap:4}} onClick={()=>curPlan==="premium"&&copyText(k,k)}>
                {k}{curPlan==="premium"&&<span style={{fontSize:9,opacity:.7}}>📋</span>}
              </div>
            ))}</div>
          </div>
          {Array.isArray(analysis.best_platforms)&&analysis.best_platforms.length>0&&(
            <div className="gcard"><h4 className="gct">🚀 Best Platforms to Sell/Launch</h4>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {analysis.best_platforms.map((p,i)=>(
                  <div key={i} style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",color:"#10b981",borderRadius:10,padding:"6px 14px",fontSize:13,fontWeight:600}}>✅ {p}</div>
                ))}
              </div>
            </div>
          )}
          {analysis.monetization&&(
            <div className="gcard"><h4 className="gct">💰 Monetization Strategy</h4><p className="gctx">{analysis.monetization}</p></div>
          )}

          {/* PLATFORMS */}
          <div className="psec">
            {isLocked&&<LockOverlay name="Run Ads + Publish Content"/>}
            <div className="psh"><div className="pst">📺 Run Ads + Publish Content</div>{isLocked&&<div className="pbadge">🔒 LOCKED</div>}</div>
            <p className="pss">Complete ad strategy + video guide for every platform</p>
            <div className="pgrid">
              {PLATFORMS.map(p=>(
                <div key={p.id} className={"pbtn"+(selPlat===p.id?" on":"")} onClick={()=>fetchPlat(p.id)} style={{borderColor:selPlat===p.id?p.color:undefined}}>
                  {isLocked&&<div className="plk">🔒</div>}
                  <div className="plogo" dangerouslySetInnerHTML={{__html:p.svg}}/>
                  <div className="pname">{p.name}</div>
                </div>
              ))}
            </div>
            {selPlat&&!isLocked&&<div className="pdet">
              {platLoading?<div style={{textAlign:"center",padding:20}}><div className="spinner" style={{margin:"0 auto 10px"}}/><p style={{color:"#64748b",fontSize:13}}>Generating strategy...</p></div>
              :platData[selPlat]?(()=>{
                try{
                  const d=platData[selPlat];
                  return(<>
                    {d.account_setup&&<div className="pdb"><div className="pdt">🏗️ Account Setup</div><div className="pdsteps">{String(d.account_setup).split("\n").filter(s=>s.trim()).map((s,i)=><div key={i} className="pdstep"><span className="pdsn">{i+1}</span><span style={{flex:1}}>{s.replace(/^Step\s*\d+[:\s]*/i,"").trim()}</span></div>)}</div></div>}
                    {d.targeting&&<div className="pdb"><div className="pdt">🎯 Targeting</div><div className="pdtx">{d.targeting}</div></div>}
                    {Array.isArray(d.ad_keywords)&&d.ad_keywords.length>0&&<div className="pdb"><div className="pdt">🔑 Keywords</div><div className="pdch">{d.ad_keywords.map((k,i)=><div key={i} className="pdchip">{k}</div>)}</div></div>}
                    {d.script&&<div className="pdb"><div className="pdt">📝 Ad Script</div><div className="pdtx" style={{background:"rgba(99,102,241,.06)",padding:14,borderRadius:10,border:"1px solid rgba(99,102,241,.15)",lineHeight:1.75}}>{d.script}</div></div>}
                    {d.video_steps&&<div className="pdb"><div className="pdt">🎬 Video Steps</div><div className="pdsteps">{String(d.video_steps).split("\n").filter(s=>s.trim()).map((s,i)=><div key={i} className="pdstep"><span className="pdsn">{i+1}</span><span style={{flex:1}}>{s.replace(/^Step\s*\d+[:\s]*/i,"").trim()}</span></div>)}</div></div>}
                    {(Array.isArray(d.titles)?d.titles:d.title?[d.title]:[]).length>0&&<div className="pdb"><div className="pdt">📌 Best Titles</div>{(Array.isArray(d.titles)?d.titles:[d.title]).map((t,i)=><div key={i} style={{background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.15)",borderRadius:9,padding:"9px 12px",marginBottom:6,color:"#e2e8f0",fontSize:13,fontWeight:600}}><span style={{color:"#6366f1",marginRight:8}}>#{i+1}</span>{t}</div>)}</div>}
                    {d.budget&&<div className="pdb"><div className="pdt">💰 Budget & ROI</div><div className="pdtx">{d.budget}</div></div>}
                  </>);
                }catch{ return <div style={{color:"#ef4444",textAlign:"center",padding:16}}>Display error. Try again.</div>; }
              })():null}
            </div>}
          </div>
        </div>}

        {/* FEATURE TABS */}
        <div className="ftabs-wrap">
          <div className="fgrp-lbl" style={{color:"#64748b"}}>🆓 Free Tools</div>
          <div className="ftabs">
            <button className={"ftab"+(tab==="profit"?" on":"")} onClick={()=>setTab("profit")}>💰 Profit Calculator</button>
          </div>
          <div className="fgrp-lbl" style={{color:isLocked?"#ef4444":"#10b981"}}>{isLocked?"🔒":"✅"} {isLocked?"Locked — Daily Limit Reached":"Premium Tools (Unlocked)"}</div>
          <div className="ftabs">
            {[
              {id:"starter",icon:"🎓",label:"Starter Guide"},
              {id:"beginner",icon:"🔰",label:"Beginner Products"},
              {id:"investment",icon:"🧮",label:"Investment Calc"},
              {id:"description",icon:"📝",label:"Description"},
              {id:"trending",icon:"🔥",label:"Trending"},
              {id:"competitor",icon:"⚔️",label:"Competitor"},
              {id:"supplier",icon:"📦",label:"Supplier"},
              {id:"sales",icon:"📊",label:"Sales Estimator"},
              {id:"price",icon:"🏷️",label:"Price Optimizer"},
              {id:"inventory",icon:"📦",label:"Inventory"},
              {id:"review",icon:"⭐",label:"Review Analyzer"},
              {id:"niche",icon:"🎯",label:"Niche Finder"},
            ].map(t=>(
              <button key={t.id} className={"ftab"+(tab===t.id?" on":"")} onClick={()=>{ if(isLocked){setShowPrem(true);return;} setTab(t.id); }}>
                {t.icon} {t.label} {isLocked&&"🔒"}
              </button>
            ))}
          </div>
        </div>

        {/* ── PROFIT CALCULATOR (FREE) ── */}
        {tab==="profit"&&<div className="fbox fade-in">
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>💰 Profit Calculator</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Calculate your exact profit, margin & ROI</p>
          <div className="prow">
            {[{l:"Buying Price (₹)",k:"buy"},{l:"Selling Price (₹)",k:"sell"},{l:"Units",k:"units"},{l:"Platform Fee (%)",k:"fee"},{l:"Shipping (₹)",k:"ship"},{l:"Ad Budget (₹)",k:"ads"}].map(f=>(
              <div key={f.k} className="pfield"><label>{f.l}</label><input type="number" placeholder={f.k==="units"?"1":f.k==="fee"?"10":f.k==="ship"?"60":f.k==="ads"?"200":"0"} value={profitForm[f.k]} onChange={e=>setProfitForm({...profitForm,[f.k]:e.target.value})}/></div>
            ))}
          </div>
          <button className="cbtn" onClick={calcProfit}>📊 Calculate Profit</button>
          {profitResult&&<div className="presult">
            {[{l:"Net Profit",v:"₹"+profitResult.profit,c:parseFloat(profitResult.profit)>0?"#10b981":"#ef4444"},{l:"Per Unit",v:"₹"+profitResult.netPer,c:"#a5b4fc"},{l:"ROI",v:profitResult.roi+"%",c:"#f59e0b"},{l:"Margin",v:profitResult.margin+"%",c:"#6366f1"},{l:"Revenue",v:"₹"+profitResult.revenue,c:"#10b981"},{l:"Break Even",v:profitResult.breakEven+" units",c:"#94a3b8"}].map(r=>(
              <div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c}}>{r.v}</div></div>
            ))}
          </div>}
        </div>}

        {/* ── STARTER GUIDE ── */}
        {tab==="starter"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Starter Guide"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>🎓 Ecommerce Starter Guide</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Personalized step-by-step guide based on your budget</p>
          <div className="prow">
            <div className="pfield"><label>Your Budget (₹)</label><input type="number" placeholder="5000" value={starterForm.budget} onChange={e=>setStarterForm({...starterForm,budget:e.target.value})}/></div>
            <div className="pfield"><label>Experience</label>
              <select value={starterForm.exp} onChange={e=>setStarterForm({...starterForm,exp:e.target.value})}>
                <option value="beginner">Complete Beginner</option>
                <option value="some">Some Experience</option>
                <option value="intermediate">Intermediate</option>
              </select>
            </div>
          </div>
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}} onClick={async()=>{setStarterLoading(true);try{const d=await apiCall("starter_guide",{budget:starterForm.budget,experience:starterForm.exp});setStarterData(d);}catch{}setStarterLoading(false);}} disabled={starterLoading}>
            {starterLoading?"⏳ Generating...":"🎓 Generate My Starter Guide"}
          </button>
          {starterLoading&&<div className="sm-spin"/>}
          {starterData&&!starterLoading&&<div style={{marginTop:18}} className="fade-in">
            {starterData.platform_recommendation&&<div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:12,padding:14,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:14,color:"#10b981",marginBottom:4}}>✅ Best Platform: {starterData.platform_recommendation.name}</div>
              <div style={{color:"#94a3b8",fontSize:13,marginBottom:3}}>{starterData.platform_recommendation.why}</div>
              <div style={{color:"#f59e0b",fontSize:12,fontWeight:600}}>Commission: {starterData.platform_recommendation.commission} · Difficulty: {starterData.platform_recommendation.difficulty}</div>
            </div>}
            {starterData.steps?.map((s,i)=>(
              <div key={i} className="comp-card" style={{marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
                  <div style={{width:30,height:30,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff",flexShrink:0}}>{s.step}</div>
                  <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>{s.title}</div>
                </div>
                <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.6,marginBottom:7}}>{s.description}</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <span style={{background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",color:"#a5b4fc",borderRadius:7,padding:"2px 9px",fontSize:11}}>⏱ {s.time}</span>
                  <span style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.2)",color:"#10b981",borderRadius:7,padding:"2px 9px",fontSize:11}}>💰 {s.cost}</span>
                </div>
              </div>
            ))}
            {starterData.first_product&&<div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)",borderRadius:12,padding:14,marginBottom:10}}>
              <div style={{fontWeight:700,color:"#f59e0b",marginBottom:3}}>🌟 First Product: {starterData.first_product.name}</div>
              <div style={{color:"#94a3b8",fontSize:13}}>{starterData.first_product.reason}</div>
              <div style={{color:"#10b981",fontSize:13,fontWeight:600,marginTop:3}}>Expected: {starterData.first_product.expected_profit}</div>
            </div>}
            {starterData.mistakes?.length>0&&<div style={{background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)",borderRadius:12,padding:14}}>
              <div style={{fontWeight:700,color:"#ef4444",marginBottom:7}}>⚠️ Avoid These Mistakes:</div>
              {starterData.mistakes.map((m,i)=><div key={i} style={{color:"#94a3b8",fontSize:13,padding:"3px 0",display:"flex",gap:7}}><span>❌</span><span>{m}</span></div>)}
            </div>}
          </div>}
        </div>}

        {/* ── BEGINNER PRODUCTS ── */}
        {tab==="beginner"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Beginner Product Finder"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>🔰 Beginner Product Finder</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Low risk, high profit products for beginners</p>
          <div className="prow">
            <div className="pfield"><label>Budget (₹)</label><input type="number" placeholder="5000" value={beginForm.budget} onChange={e=>setBeginForm({...beginForm,budget:e.target.value})}/></div>
            <div className="pfield"><label>Category</label>
              <select value={beginForm.category} onChange={e=>setBeginForm({...beginForm,category:e.target.value})}>
                {["Fashion","Electronics","Beauty & Skincare","Home & Kitchen","Fitness","Pet Supplies","Digital Products","Mobile Apps","Online Courses","Any Other"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#10b981,#059669)"}} onClick={async()=>{setBeginLoading(true);try{const d=await apiCall("beginner_product",beginForm);setBeginData(d);}catch{}setBeginLoading(false);}} disabled={beginLoading}>
            {beginLoading?"⏳ Finding...":"🔰 Find Beginner Products"}
          </button>
          {beginLoading&&<div className="sm-spin"/>}
          {beginData&&!beginLoading&&<div style={{marginTop:18}} className="fade-in">
            {beginData.products?.map((p,i)=>(
              <div key={i} className="comp-card" style={{marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7,flexWrap:"wrap",gap:6}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>#{i+1} {p.name}</div>
                  <div style={{display:"flex",gap:5}}>
                    <span style={{background:p.risk==="Low"?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)",color:p.risk==="Low"?"#10b981":"#f59e0b",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600}}>Risk: {p.risk}</span>
                    <span style={{background:"rgba(99,102,241,.1)",color:"#a5b4fc",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600}}>Demand: {p.demand}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:8}}>
                  <span style={{color:"#ef4444",fontSize:13,fontWeight:600}}>Buy: {p.buy_price}</span>
                  <span style={{color:"#94a3b8"}}>→</span>
                  <span style={{color:"#10b981",fontSize:13,fontWeight:600}}>Sell: {p.sell_price}</span>
                  <span style={{color:"#f59e0b",fontSize:13,fontWeight:700}}>💰 {p.profit_per_unit}/unit</span>
                </div>
                <div style={{color:"#94a3b8",fontSize:12,marginBottom:7}}>{p.why_good}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{background:"rgba(99,102,241,.1)",color:"#a5b4fc",borderRadius:7,padding:"2px 9px",fontSize:11}}>📦 {p.platform}</span>
                  <span style={{background:"rgba(16,185,129,.1)",color:"#10b981",borderRadius:7,padding:"2px 9px",fontSize:11}}>🏭 {p.suppliers}</span>
                </div>
              </div>
            ))}
          </div>}
        </div>}

        {/* ── INVESTMENT CALCULATOR ── */}
        {tab==="investment"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Investment Calculator"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>🧮 Investment Calculator</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Full calculation including platform fees, shipping & ROI</p>
          <div className="prow">
            {[{l:"Buying Price (₹)",k:"buy"},{l:"Selling Price (₹)",k:"sell"},{l:"Units",k:"units"},{l:"Platform Fee (%)",k:"fee"},{l:"Shipping (₹)",k:"ship"},{l:"Ad Budget (₹)",k:"ads"}].map(f=>(
              <div key={f.k} className="pfield"><label>{f.l}</label><input type="number" placeholder="0" value={invForm[f.k]} onChange={e=>setInvForm({...invForm,[f.k]:e.target.value})}/></div>
            ))}
          </div>
          <button className="cbtn" style={{width:"100%"}} onClick={calcInv}>🧮 Calculate Investment</button>
          {invResult&&<div className="presult">
            {[{l:"Total Profit",v:"₹"+invResult.profit,c:parseFloat(invResult.profit)>0?"#10b981":"#ef4444"},{l:"Per Unit",v:"₹"+invResult.netPer,c:"#a5b4fc"},{l:"ROI",v:invResult.roi+"%",c:"#f59e0b"},{l:"Margin",v:invResult.margin+"%",c:"#6366f1"},{l:"Investment",v:"₹"+invResult.cost,c:"#94a3b8"},{l:"Break Even",v:invResult.breakEven+" units",c:"#94a3b8"}].map(r=>(
              <div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c}}>{r.v}</div></div>
            ))}
          </div>}
        </div>}

        {/* ── DESCRIPTION GENERATOR ── */}
        {tab==="description"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Description Generator"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>📝 Description Generator</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>SEO-optimized listings for Amazon, Meesho, Flipkart & Instagram</p>
          {!pForm.name&&<div className="errbanner">⚠️ Run product analysis first above</div>}
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#6366f1,#a855f7)"}} onClick={async()=>{setDescLoading(true);try{const d=await apiCall("description");setDescData(d);}catch{}setDescLoading(false);}} disabled={descLoading||!pForm.name}>
            {descLoading?"⏳ Generating...":"✨ Generate Descriptions"}
          </button>
          {descLoading&&<div className="sm-spin"/>}
          {descData&&!descLoading&&<div style={{marginTop:18}} className="fade-in">
            {descData.listings?.map((l,i)=>(
              <div key={i} style={{background:"rgba(2,8,23,.5)",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:"inline-block",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,marginBottom:9}}>{l.platform}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:7}}>📌 {l.title}</div>
                <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:7}}>{l.description}</div>
                {l.bullets&&<div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {l.bullets.map((b,j)=><div key={j} style={{color:"#a5b4fc",fontSize:12,display:"flex",gap:7}}><span>✅</span><span>{b}</span></div>)}
                </div>}
              </div>
            ))}
          </div>}
        </div>}

        {/* ── TRENDING ── */}
        {tab==="trending"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Trending Products"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>🔥 Trending Products</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Top trending products in Indian market right now</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
            <div className="dsel-wrap" style={{flex:1,minWidth:160}}>
              <select className="di" style={{paddingRight:32}} value={trendCat} onChange={e=>setTrendCat(e.target.value)}>
                {["Electronics","Beauty & Skincare","Home & Kitchen","Fitness","Fashion","Pet Supplies","Toys & Games","Health & Wellness","Outdoor & Sports","Food & Beverages","Digital Products","Mobile Apps","PC / Console Games","Online Courses","Software & SaaS","YouTube Channel","Instagram Page","Any Other"].map(c=><option key={c}>{c}</option>)}
              </select>
              <span className="dsel-arrow">▾</span>
            </div>
            <button className="cbtn" onClick={async()=>{setTrendLoading(true);try{const d=await apiCall("trending",{category:trendCat});setTrendData(d);}catch{}setTrendLoading(false);}} disabled={trendLoading}>
              {trendLoading?"⏳":"🔥 Get Trending"}
            </button>
          </div>
          {trendLoading&&<div className="sm-spin"/>}
          {trendData&&!trendLoading&&<div className="trend-grid fade-in">
            {trendData.products?.map((p,i)=>(
              <div key={i} className="trend-card">
                <div className="trank">{i+1}</div>
                <div style={{fontWeight:700,fontSize:13,color:"#e2e8f0",marginBottom:5}}>{p.name}</div>
                <div style={{color:"#64748b",fontSize:12,marginBottom:8,lineHeight:1.5}}>{p.why_trending}</div>
                <div style={{color:"#f59e0b",fontSize:12,fontWeight:600,marginBottom:7}}>💰 {p.price_range}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{p.tags?.map((t,j)=><span key={j} className="tc">{t}</span>)}</div>
              </div>
            ))}
          </div>}
        </div>}

        {/* ── COMPETITOR ── */}
        {tab==="competitor"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Competitor Analysis"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>⚔️ Competitor Analysis</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Top 4 competitors — pricing, strengths & weaknesses</p>
          {!pForm.name&&<div className="errbanner">⚠️ Run product analysis first above</div>}
          <button className="cbtn" onClick={async()=>{setCompLoading(true);try{const d=await apiCall("competitor");setCompData(d);}catch{}setCompLoading(false);}} disabled={compLoading||!pForm.name}>
            {compLoading?"⏳ Analyzing...":"🔍 Analyze Competitors"}
          </button>
          {compLoading&&<div className="sm-spin"/>}
          {compData&&!compLoading&&<div style={{marginTop:18}} className="fade-in">
            {compData.competitors?.map((c,i)=>(
              <div key={i} className="comp-card">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7,flexWrap:"wrap",gap:7}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>🏪 {c.name}</div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{background:"rgba(245,158,11,.1)",color:"#f59e0b",borderRadius:7,padding:"2px 9px",fontSize:12,fontWeight:700}}>{c.price}</span>
                    <span style={{color:"#64748b",fontSize:12}}>⭐ {c.rating}</span>
                  </div>
                </div>
                <div className="comp-row">
                  <div className="comp-box"><div className="comp-box-t" style={{color:"#10b981"}}>✅ Strengths</div>{c.strengths?.map((s,j)=><div key={j} className="cpoint"><span style={{color:"#10b981"}}>+</span><span>{s}</span></div>)}</div>
                  <div className="comp-box"><div className="comp-box-t" style={{color:"#ef4444"}}>❌ Weaknesses</div>{c.weaknesses?.map((w,j)=><div key={j} className="cpoint"><span style={{color:"#ef4444"}}>-</span><span>{w}</span></div>)}</div>
                </div>
                {c.opportunity&&<div style={{marginTop:10,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:9,padding:"9px 12px",color:"#a5b4fc",fontSize:12}}>💡 {c.opportunity}</div>}
              </div>
            ))}
          </div>}
        </div>}

        {/* ── SUPPLIER ── */}
        {tab==="supplier"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Supplier Finder"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>📦 Supplier Finder</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Best suppliers with price, MOQ & sourcing tips</p>
          {!pForm.name&&<div className="errbanner">⚠️ Run product analysis first above</div>}
          <button className="cbtn" style={{background:"linear-gradient(135deg,#10b981,#059669)"}} onClick={async()=>{setSuppLoading(true);try{const d=await apiCall("supplier");setSuppData(d);}catch{}setSuppLoading(false);}} disabled={suppLoading||!pForm.name}>
            {suppLoading?"⏳ Finding...":"🔍 Find Suppliers"}
          </button>
          {suppLoading&&<div className="sm-spin"/>}
          {suppData&&!suppLoading&&<div style={{marginTop:18}} className="fade-in">
            {suppData.suppliers?.map((s,i)=>(
              <div key={i} className="supp-card">
                <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:7}}>🏭 {s.name}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  <span className="schip">💰 {s.price_range}</span>
                  <span className="schip">📦 MOQ: {s.moq}</span>
                  <span className="schip">⭐ {s.rating}</span>
                  <span className="schip">🚚 {s.delivery}</span>
                </div>
                <div style={{color:"#94a3b8",fontSize:12,marginBottom:7}}>{s.description}</div>
                {s.tip&&<div style={{background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.2)",borderRadius:9,padding:"7px 11px",color:"#f59e0b",fontSize:12,marginBottom:7}}>💡 {s.tip}</div>}
                <a className="slink" href={s.search_url||"#"} target="_blank" rel="noreferrer">🔗 Search on {s.platform}</a>
              </div>
            ))}
          </div>}
        </div>}

        {/* ── SALES ESTIMATOR ── */}
        {tab==="sales"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Sales Estimator"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>📊 Sales Estimator</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Estimate monthly sales & revenue forecast</p>
          {!pForm.name&&<div className="errbanner">⚠️ Run product analysis first above</div>}
          <button className="cbtn" onClick={async()=>{setSalesLoading(true);try{const d=await apiCall("sales_estimator");setSalesData(d);}catch{}setSalesLoading(false);}} disabled={salesLoading||!pForm.name}>
            {salesLoading?"⏳ Estimating...":"📊 Estimate Sales"}
          </button>
          {salesLoading&&<div className="sm-spin"/>}
          {salesData&&!salesLoading&&<div style={{marginTop:18}} className="fade-in">
            <div className="presult" style={{marginBottom:14}}>
              {[{l:"Low Units",v:salesData.monthly_units?.low+" units",c:"#ef4444"},{l:"Avg Units",v:salesData.monthly_units?.medium+" units",c:"#f59e0b"},{l:"High Units",v:salesData.monthly_units?.high+" units",c:"#10b981"}].map(r=><div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c,fontSize:18}}>{r.v}</div></div>)}
            </div>
            <div className="presult" style={{marginBottom:14}}>
              {[{l:"Low Revenue",v:salesData.monthly_revenue?.low,c:"#ef4444"},{l:"Avg Revenue",v:salesData.monthly_revenue?.medium,c:"#f59e0b"},{l:"High Revenue",v:salesData.monthly_revenue?.high,c:"#10b981"}].map(r=><div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c,fontSize:15}}>{r.v}</div></div>)}
            </div>
            {salesData.best_months?.length>0&&<div className="gcard" style={{marginBottom:10}}><div className="gct">🌟 Best Months</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{salesData.best_months.map((m,i)=><span key={i} className="tc">{m}</span>)}</div></div>}
            {salesData.tips?.length>0&&<div className="gcard"><div className="gct">💡 Tips</div>{salesData.tips.map((t,i)=><div key={i} style={{color:"#94a3b8",fontSize:12,padding:"4px 0",display:"flex",gap:7}}><span style={{color:"#10b981"}}>✓</span><span>{t}</span></div>)}</div>}
          </div>}
        </div>}

        {/* ── PRICE OPTIMIZER ── */}
        {tab==="price"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Price Optimizer"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>🏷️ Price Optimizer</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Find the perfect price to maximize your profit</p>
          {!pForm.name&&<div className="errbanner">⚠️ Run product analysis first above</div>}
          <button className="cbtn" style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)"}} onClick={async()=>{setPriceLoading(true);try{const d=await apiCall("price_optimizer");setPriceData(d);}catch{}setPriceLoading(false);}} disabled={priceLoading||!pForm.name}>
            {priceLoading?"⏳ Optimizing...":"🏷️ Optimize Price"}
          </button>
          {priceLoading&&<div className="sm-spin"/>}
          {priceData&&!priceLoading&&<div style={{marginTop:18}} className="fade-in">
            <div style={{background:"linear-gradient(135deg,rgba(16,185,129,.1),rgba(6,95,70,.1))",border:"1px solid rgba(16,185,129,.3)",borderRadius:14,padding:18,textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:12,color:"#64748b",marginBottom:3}}>Recommended Price</div>
              <div style={{fontSize:32,fontWeight:900,color:"#10b981"}}>{priceData.recommended_price}</div>
              <div style={{fontSize:11,color:"#475569",marginTop:3}}>Sweet spot: {priceData.price_range?.sweet_spot}</div>
            </div>
            {priceData.competitor_prices?.length>0&&<div className="gcard" style={{marginBottom:10}}>
              <div className="gct">⚔️ Competitor Prices</div>
              {priceData.competitor_prices.map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.05)",color:"#94a3b8",fontSize:13}}><span>{c.seller}</span><span style={{color:"#f59e0b",fontWeight:600}}>{c.price}</span></div>)}
            </div>}
            {priceData.psychological_tricks?.length>0&&<div className="gcard">
              <div className="gct">🧠 Pricing Tips</div>
              {priceData.psychological_tricks.map((t,i)=><div key={i} style={{color:"#94a3b8",fontSize:12,padding:"3px 0",display:"flex",gap:7}}><span style={{color:"#a5b4fc"}}>→</span><span>{t}</span></div>)}
            </div>}
          </div>}
        </div>}

        {/* ── INVENTORY ── */}
        {tab==="inventory"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Inventory Calculator"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>📦 Inventory Calculator</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Plan your stock to never overstock or run out</p>
          {!pForm.name&&<div className="errbanner">⚠️ Run product analysis first above</div>}
          <div className="prow"><div className="pfield"><label>Starting Units</label><input type="number" placeholder="50" value={invtForm.units} onChange={e=>setInvtForm({units:e.target.value})}/></div></div>
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}} onClick={async()=>{setInvtLoading(true);try{const d=await apiCall("inventory",{units:invtForm.units});setInvtData(d);}catch{}setInvtLoading(false);}} disabled={invtLoading||!pForm.name}>
            {invtLoading?"⏳ Calculating...":"📦 Calculate Inventory"}
          </button>
          {invtLoading&&<div className="sm-spin"/>}
          {invtData&&!invtLoading&&<div style={{marginTop:18}} className="fade-in">
            <div className="presult" style={{marginBottom:14}}>
              {[{l:"Starter Stock",v:invtData.recommended_stock?.starter,c:"#10b981"},{l:"Safe Stock",v:invtData.recommended_stock?.safe,c:"#f59e0b"},{l:"Reorder At",v:invtData.reorder_point,c:"#ef4444"}].map(r=><div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c,fontSize:15}}>{r.v}</div></div>)}
            </div>
            <div className="gcard" style={{marginBottom:10}}><div className="gct">📋 Storage Info</div>
              <div style={{color:"#94a3b8",fontSize:13}}><span style={{color:"#f59e0b"}}>Cost: </span>{invtData.storage_cost}</div>
              <div style={{color:"#94a3b8",fontSize:13,marginTop:4}}><span style={{color:"#a5b4fc"}}>Duration: </span>{invtData.turnover_days}</div>
              <div style={{color:"#94a3b8",fontSize:13,marginTop:4}}><span style={{color:"#ef4444"}}>Risk: </span>{invtData.risk}</div>
            </div>
            {invtData.tips?.length>0&&<div className="gcard"><div className="gct">💡 Tips</div>{invtData.tips.map((t,i)=><div key={i} style={{color:"#94a3b8",fontSize:12,padding:"3px 0",display:"flex",gap:7}}><span style={{color:"#10b981"}}>✓</span><span>{t}</span></div>)}</div>}
          </div>}
        </div>}

        {/* ── REVIEW ANALYZER ── */}
        {tab==="review"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Review Analyzer"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>⭐ Review Analyzer</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>What customers love & hate about similar products</p>
          {!pForm.name&&<div className="errbanner">⚠️ Run product analysis first above</div>}
          <button className="cbtn" style={{background:"linear-gradient(135deg,#f59e0b,#f97316)"}} onClick={async()=>{setRevLoading(true);try{const d=await apiCall("review_analyzer");setRevData(d);}catch{}setRevLoading(false);}} disabled={revLoading||!pForm.name}>
            {revLoading?"⏳ Analyzing...":"⭐ Analyze Reviews"}
          </button>
          {revLoading&&<div className="sm-spin"/>}
          {revData&&!revLoading&&<div style={{marginTop:18}} className="fade-in">
            <div style={{background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:12,padding:14,textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:12,color:"#64748b"}}>Sentiment Score</div>
              <div style={{fontSize:28,fontWeight:900,color:"#6366f1"}}>{revData.sentiment_score}</div>
            </div>
            <div className="comp-row" style={{marginBottom:10}}>
              <div className="comp-box"><div className="comp-box-t" style={{color:"#10b981"}}>❤️ Love</div>{revData.what_customers_love?.map((l,i)=><div key={i} className="cpoint"><span style={{color:"#10b981"}}>+</span><span>{l}</span></div>)}</div>
              <div className="comp-box"><div className="comp-box-t" style={{color:"#ef4444"}}>😠 Hate</div>{revData.common_complaints?.map((c,i)=><div key={i} className="cpoint"><span style={{color:"#ef4444"}}>-</span><span>{c}</span></div>)}</div>
            </div>
            {revData.opportunities?.length>0&&<div className="gcard" style={{marginBottom:10}}><div className="gct">💡 Your Opportunities</div>{revData.opportunities.map((o,i)=><div key={i} style={{color:"#94a3b8",fontSize:12,padding:"3px 0",display:"flex",gap:7}}><span style={{color:"#a5b4fc"}}>→</span><span>{o}</span></div>)}</div>}
            {revData.product_improvements?.length>0&&<div className="gcard"><div className="gct">🔧 Improve Your Product</div>{revData.product_improvements.map((p,i)=><div key={i} style={{color:"#94a3b8",fontSize:12,padding:"3px 0",display:"flex",gap:7}}><span style={{color:"#f59e0b"}}>✦</span><span>{p}</span></div>)}</div>}
          </div>}
        </div>}

        {/* ── NICHE FINDER ── */}
        {tab==="niche"&&<div className="fbox fade-in">
          {isLocked&&<LockOverlay name="Niche Finder"/>}
          <h3 style={{fontWeight:800,fontSize:17,marginBottom:4,color:"#f8fafc"}}>🎯 Niche Finder</h3>
          <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>6 untapped profitable niches in Indian market</p>
          <button className="cbtn" style={{background:"linear-gradient(135deg,#a855f7,#7c3aed)"}} onClick={async()=>{setNicheLoading(true);try{const d=await apiCall("niche_finder");setNicheData(d);}catch{}setNicheLoading(false);}} disabled={nicheLoading}>
            {nicheLoading?"⏳ Finding...":"🎯 Find Untapped Niches"}
          </button>
          {nicheLoading&&<div className="sm-spin"/>}
          {nicheData&&!nicheLoading&&<div className="trend-grid fade-in" style={{marginTop:18}}>
            {nicheData.niches?.map((n,i)=>(
              <div key={i} className="trend-card">
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                  <div className="trank">{i+1}</div>
                  <div style={{fontWeight:700,fontSize:13,color:"#e2e8f0"}}>{n.name}</div>
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
                  <span style={{background:"rgba(16,185,129,.1)",color:"#10b981",borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:600}}>Competition: {n.competition}</span>
                  <span style={{background:"rgba(245,158,11,.1)",color:"#f59e0b",borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:600}}>Margin: {n.profit_margin}</span>
                </div>
                <div style={{color:"#64748b",fontSize:12,marginBottom:7,lineHeight:1.5}}>{n.why_untapped}</div>
                <div style={{color:"#a5b4fc",fontSize:11,marginBottom:6}}>💰 {n.investment}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{n.example_products?.map((p,j)=><span key={j} className="tc">{p}</span>)}</div>
                <div style={{marginTop:7,fontSize:11,color:n.trend==="Growing"?"#10b981":"#f59e0b",fontWeight:600}}>📈 {n.trend}</div>
              </div>
            ))}
          </div>}
        </div>}

      </div>
      <footer>🧠 Product Analyzer · Built with AI · © YesYouPro</footer>
    </div>}
  </>);
}
