import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const FREE_LIMIT = 2;
const PREM_LIMIT = 30;
const PREM_DAYS = 7;

const FB_CFG = {
  apiKey:"AIzaSyDww7gi4QRRNm4t3PFQ9ny8a2WLV-V9OFU",
  authDomain:"mood2meet-85866.firebaseapp.com",
  projectId:"mood2meet-85866",
  storageBucket:"mood2meet-85866.firebasestorage.app",
  messagingSenderId:"455406578867",
  appId:"1:455406578867:web:fc5a2b6a00af996bc114c6"
};

const CATS = [
  {id:"Electronics",icon:"💻",type:"p"},{id:"Beauty & Skincare",icon:"💄",type:"p"},
  {id:"Home & Kitchen",icon:"🏠",type:"p"},{id:"Fitness",icon:"💪",type:"p"},
  {id:"Fashion",icon:"👗",type:"p"},{id:"Pet Supplies",icon:"🐾",type:"p"},
  {id:"Toys & Games",icon:"🎮",type:"p"},{id:"Health & Wellness",icon:"❤️",type:"p"},
  {id:"Outdoor & Sports",icon:"⛺",type:"p"},{id:"Food & Beverages",icon:"🍔",type:"p"},
  {id:"Automotive",icon:"🚗",type:"p"},{id:"Books & Education",icon:"📚",type:"p"},
  {id:"Music & Audio",icon:"🎵",type:"p"},{id:"Art & Crafts",icon:"🎨",type:"p"},
  {id:"Jewelry",icon:"💍",type:"p"},{id:"Baby & Kids",icon:"👶",type:"p"},
  {id:"Office Supplies",icon:"🗂️",type:"p"},{id:"Tools & Hardware",icon:"🔧",type:"p"},
  {id:"Garden & Plants",icon:"🌱",type:"p"},{id:"Travel & Luggage",icon:"✈️",type:"p"},
  {id:"Digital Products",icon:"📦",type:"d"},{id:"Mobile Apps",icon:"📱",type:"d"},
  {id:"PC / Console Games",icon:"🕹️",type:"d"},{id:"Online Courses",icon:"🎓",type:"d"},
  {id:"Software & SaaS",icon:"💿",type:"d"},{id:"Website / Blog",icon:"🌐",type:"d"},
  {id:"YouTube Channel",icon:"📺",type:"d"},{id:"Instagram Page",icon:"📸",type:"d"},
  {id:"Podcast",icon:"🎙️",type:"d"},{id:"NFT & Crypto",icon:"🖼️",type:"d"},
  {id:"Ebooks & Templates",icon:"📄",type:"d"},{id:"Freelance Services",icon:"🛠️",type:"d"},
  {id:"Social Media Account",icon:"👥",type:"d"},{id:"Print on Demand",icon:"🖨️",type:"d"},
  {id:"Dropshipping",icon:"🚚",type:"d"},{id:"Affiliate Marketing",icon:"🔗",type:"d"},
  {id:"Any Other",icon:"✨",type:"d"},
];

const PLATS = [
  {id:"Amazon",icon:"📦",color:"#f59e0b",g:"🛒 Ecommerce"},
  {id:"Flipkart",icon:"⚡",color:"#2874f0",g:"🛒 Ecommerce"},
  {id:"Meesho",icon:"🌸",color:"#e91e8c",g:"🛒 Ecommerce"},
  {id:"Shopify",icon:"🛒",color:"#96bf48",g:"🛒 Ecommerce"},
  {id:"WooCommerce",icon:"🌐",color:"#7f54b3",g:"🛒 Ecommerce"},
  {id:"Etsy",icon:"🎨",color:"#f56400",g:"🛒 Ecommerce"},
  {id:"Nykaa",icon:"💄",color:"#fc2779",g:"🛒 Ecommerce"},
  {id:"Myntra",icon:"👗",color:"#ff3f6c",g:"🛒 Ecommerce"},
  {id:"IndiaMART",icon:"🏭",color:"#0077b5",g:"🛒 Ecommerce"},
  {id:"JioMart",icon:"🛍️",color:"#003087",g:"🛒 Ecommerce"},
  {id:"Instagram",icon:"📸",color:"#e1306c",g:"📱 Social Media"},
  {id:"Facebook",icon:"👤",color:"#1877f2",g:"📱 Social Media"},
  {id:"YouTube",icon:"📺",color:"#ff0000",g:"📱 Social Media"},
  {id:"TikTok",icon:"🎵",color:"#010101",g:"📱 Social Media"},
  {id:"Pinterest",icon:"📌",color:"#e60023",g:"📱 Social Media"},
  {id:"Snapchat",icon:"👻",color:"#f5c518",g:"📱 Social Media"},
  {id:"X (Twitter)",icon:"🐦",color:"#14171a",g:"📱 Social Media"},
  {id:"LinkedIn",icon:"💼",color:"#0077b5",g:"📱 Social Media"},
  {id:"Telegram",icon:"✈️",color:"#0088cc",g:"📱 Social Media"},
  {id:"WhatsApp Business",icon:"💬",color:"#25d366",g:"📱 Social Media"},
  {id:"Discord",icon:"🎮",color:"#5865f2",g:"📱 Social Media"},
  {id:"Reddit",icon:"🔴",color:"#ff4500",g:"📱 Social Media"},
  {id:"Quora",icon:"❓",color:"#a82400",g:"📱 Social Media"},
  {id:"Google Play Store",icon:"▶️",color:"#01875f",g:"📲 App Stores"},
  {id:"Apple App Store",icon:"🍎",color:"#0071e3",g:"📲 App Stores"},
  {id:"Steam",icon:"🎮",color:"#1b2838",g:"📲 App Stores"},
  {id:"PlayStation Store",icon:"🎯",color:"#003087",g:"📲 App Stores"},
  {id:"Xbox Store",icon:"🟢",color:"#107c10",g:"📲 App Stores"},
  {id:"Udemy",icon:"📖",color:"#a435f0",g:"🎓 Courses"},
  {id:"Skillshare",icon:"✏️",color:"#00ccb1",g:"🎓 Courses"},
  {id:"Gumroad",icon:"💰",color:"#ff90e8",g:"🎓 Courses"},
  {id:"Patreon",icon:"🎁",color:"#ff424d",g:"🎓 Courses"},
  {id:"Substack",icon:"📧",color:"#ff6719",g:"🎓 Courses"},
  {id:"Fiverr",icon:"💚",color:"#1dbf73",g:"💼 Freelance"},
  {id:"Upwork",icon:"🔵",color:"#14a800",g:"💼 Freelance"},
  {id:"Zomato",icon:"🍕",color:"#e23744",g:"🍔 Food"},
  {id:"Swiggy",icon:"🛵",color:"#fc8019",g:"🍔 Food"},
  {id:"BigBasket",icon:"🛒",color:"#84c225",g:"🍔 Food"},
  {id:"Own Website",icon:"🌐",color:"#6366f1",g:"🌐 Other"},
  {id:"Any Other",icon:"✨",color:"#94a3b8",g:"🌐 Other"},
];

const ADS_DATA = [
  {h:"Scale Your Business Fast",s:"Find winning products 10x faster",c:"#f59e0b"},
  {h:"AI Marketing Suite",s:"Auto-generate ads, copy and creatives",c:"#8b5cf6"},
  {h:"Build Your Online Store",s:"Start selling in 48 hours",c:"#06b6d4"},
];

const AD_PLATS = [
  {id:"gads",n:"Google Ads",c:"#4285f4",svg:`<svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`},
  {id:"fb",n:"Facebook Ads",c:"#1877f2",svg:`<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>`},
  {id:"ig",n:"Instagram",c:"#e1306c",svg:`<svg viewBox="0 0 24 24"><defs><radialGradient id="ig2" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#ig2)"/></svg>`},
  {id:"yt",n:"YouTube",c:"#ff0000",svg:`<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/></svg>`},
  {id:"tt",n:"TikTok",c:"#010101",svg:`<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#000"/></svg>`},
  {id:"pin",n:"Pinterest",c:"#e60023",svg:`<svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#E60023"/></svg>`},
  {id:"sc",n:"Snapchat",c:"#f5c518",svg:`<svg viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.354 4.408-.074 1.86 1.498 2.127 2.404 1.544.48-.316 1.02-.536 1.46-.536.45 0 .763.159.858.417.099.267-.124.643-.898 1.054-.241.127-.55.273-.88.425-1.07.497-2.538 1.093-2.538 2.272 0 .176.029.35.089.518.33.93 1.14 1.643 1.975 2.375.413.36.85.748 1.254 1.195.36.41.574.856.574 1.27 0 .51-.314.927-.885 1.156-.434.173-1.017.267-1.602.267-.43 0-.86-.05-1.252-.15-.622-.16-1.252-.5-1.814-.83-.386-.23-.696-.42-.966-.42-.27 0-.648.185-.998.37-.58.31-1.165.621-1.814.81-.507.145-1.13.236-1.759.236-1.25 0-2.433-.407-3.112-.963-.338-.271-.604-.566-.741-.898-.14-.333-.14-.674.014-1.02.234-.542.858-1.062 1.56-1.643.456-.376.974-.808 1.384-1.295.256-.31.42-.592.42-.863 0-.543-.72-1.091-1.736-1.572-.396-.183-.806-.339-1.152-.464-.414-.146-.712-.268-.834-.41-.17-.199-.211-.452-.106-.71.113-.274.4-.46.766-.47.305-.008.61.068.886.224.298.167.557.41.791.64.154.152.29.284.408.375.136.104.28.16.406.16.256 0 .39-.2.39-.583V7.84c0-1.19-.122-3.228.354-4.408C7.855 1.069 11.21.793 12.206.793z" fill="#FFFC00"/></svg>`},
  {id:"tw",n:"X (Twitter)",c:"#14171a",svg:`<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="#000"/></svg>`},
];

const S={
  get:(k)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

let _auth=null;
async function getFireAuth(){
  if(_auth)return _auth;
  const {initializeApp,getApps}=await import("firebase/app");
  const {getAuth}=await import("firebase/auth");
  const app=getApps().length?getApps()[0]:initializeApp(FB_CFG);
  _auth=getAuth(app);
  return _auth;
}

export default function App(){
  const[screen,setScreen]=useState("home");
  const[user,setUser]=useState(null);
  const[authMode,setAuthMode]=useState("login");
  const[form,setForm]=useState({email:"",password:"",name:""});
  const[saved,setSaved]=useState([]);
  const[showPw,setShowPw]=useState(false);
  const[gLoad,setGLoad]=useState(false);
  const[authErr,setAuthErr]=useState("");
  const[usage,setUsage]=useState(null);
  const[timer,setTimer]=useState(null);
  const timerRef=useRef(null);
  const[pf,setPf]=useState({name:"",category:"",platform:""});
  const[result,setResult]=useState(null);
  const[loading,setLoading]=useState(false);
  const[loadStep,setLoadStep]=useState(0);
  const[err,setErr]=useState("");
  const[showAd,setShowAd]=useState(false);
  const[adTimer,setAdTimer]=useState(5);
  const[adIdx,setAdIdx]=useState(0);
  const adRef=useRef(null);
  const[showPrem,setShowPrem]=useState(false);
  const[showPay,setShowPay]=useState(false);
  const[payStep,setPayStep]=useState("form");
  const[selPlat,setSelPlat]=useState(null);
  const[platD,setPlatD]=useState({});
  const[platLoad,setPlatLoad]=useState(false);
  const[tab,setTab]=useState("profit");
  const[showCats,setShowCats]=useState(false);
  const[showProfile,setShowProfile]=useState(false);
  const[profileTab,setProfileTab]=useState("main"); // main | terms | questions
  const[question,setQuestion]=useState("");
  const[qSent,setQSent]=useState(false);
  const[qLoading,setQLoading]=useState(false);
  const[showPlats,setShowPlats]=useState(false);
  const[toast,setToast]=useState(null);
  // feature states
  const[profF,setProfF]=useState({buy:"",sell:"",units:"1",fee:"10",ship:"60",ads:"200"});
  const[profR,setProfR]=useState(null);
  const[descD,setDescD]=useState(null);const[descL,setDescL]=useState(false);
  const[trendD,setTrendD]=useState(null);const[trendL,setTrendL]=useState(false);const[trendCat,setTrendCat]=useState("Fashion");
  const[compD,setCompD]=useState(null);const[compL,setCompL]=useState(false);
  const[suppD,setSuppD]=useState(null);const[suppL,setSuppL]=useState(false);
  const[starF,setStarF]=useState({budget:"5000",exp:"beginner"});
  const[starD,setStarD]=useState(null);const[starL,setStarL]=useState(false);
  const[begF,setBegF]=useState({budget:"5000",category:"Fashion"});
  const[begD,setBegD]=useState(null);const[begL,setBegL]=useState(false);
  const[invF,setInvF]=useState({buy:"",sell:"",units:"10",fee:"10",ship:"60",ads:"200"});
  const[invR,setInvR]=useState(null);
  const[salesD,setSalesD]=useState(null);const[salesL,setSalesL]=useState(false);
  const[priceD,setPriceD]=useState(null);const[priceL,setPriceL]=useState(false);
  const[invtF,setInvtF]=useState({units:"50"});
  const[invtD,setInvtD]=useState(null);const[invtL,setInvtL]=useState(false);
  const[revD,setRevD]=useState(null);const[revL,setRevL]=useState(false);
  const[nicheD,setNicheD]=useState(null);const[nicheL,setNicheL]=useState(false);

  const sendQuestion=async()=>{
    if(!question.trim()){showToast("Please write your question first");return;}
    setQLoading(true);
    try{
      await fetch("https://formspree.io/f/YOUR_FORM_ID",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:user?.name||"User",
          email:user?.email||"",
          message:question,
          _subject:"YesYouPro User Question from "+user?.email
        })
      });
      setQSent(true);
      setQuestion("");
      showToast("✅ Question sent! We will reply soon.");
    }catch{
      showToast("Failed to send. Try again.");
    }
    setQLoading(false);
  };

  // ── SEND QUESTION TO EMAIL ─────────────────────────────────────────────────
  const sendQuestion=async()=>{
    if(!question.trim()){showToast("Please type your question first");return;}
    setQSending(true);
    try{
      const res=await fetch("/api/contact",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          email:user?.email||"unknown",
          name:user?.name||"User",
          message:question,
          plan:curPlan
        })
      });
      if(res.ok){
        setQSent(true);
        setQuestion("");
        showToast("✅ Question sent! We'll reply soon.");
        setTimeout(()=>setQSent(false),4000);
      }else{
        showToast("Failed to send. Try again.");
      }
    }catch{
      showToast("Network error. Try again.");
    }
    setQSending(false);
  };

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(null),3500);};
  const curPlan=user?(S.get("yyp_plan_"+user.email)||"free"):"free";
  const guestLimitHit=!user&&parseInt(S.get("yyp_guest_count")||"0")>=FREE_LIMIT;
  const isLocked=(curPlan!=="premium"&&(!usage||usage.remaining<=0||!!timer))||guestLimitHit;

  const todayK=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};

  const calcUsage=(u)=>{
    if(!u?.email)return{plan:"free",remaining:FREE_LIMIT,total:FREE_LIMIT,used:0};
    const plan=S.get("yyp_plan_"+u.email)||"free";
    if(plan==="premium"){
      const pd=S.get("yyp_prem_"+u.email);
      if(!pd){S.set("yyp_plan_"+u.email,"free");return{plan:"free",remaining:FREE_LIMIT,total:FREE_LIMIT,used:0};}
      if(new Date()>new Date(pd.expiry)){S.set("yyp_plan_"+u.email,"free");return{plan:"free",remaining:FREE_LIMIT,total:FREE_LIMIT,expired:true};}
      const used=pd.used||0;
      return{plan,remaining:Math.max(0,PREM_LIMIT-used),total:PREM_LIMIT,used,expiry:pd.expiry};
    }
    const used=parseInt(S.get("yyp_daily_"+u.email+"_"+todayK())||"0");
    return{plan:"free",remaining:Math.max(0,FREE_LIMIT-used),total:FREE_LIMIT,used};
  };

  const addUsage=(u)=>{
    if(!u?.email)return;
    const plan=S.get("yyp_plan_"+u.email)||"free";
    if(plan==="premium"){const pd=S.get("yyp_prem_"+u.email);if(pd)S.set("yyp_prem_"+u.email,{...pd,used:(pd.used||0)+1});}
    else{const k="yyp_daily_"+u.email+"_"+todayK();S.set(k,String(parseInt(S.get(k)||"0")+1));}
  };

  const startTimer=(u)=>{
    if(!u)return;
    if((S.get("yyp_plan_"+u.email)||"free")==="premium"){setTimer(null);return;}
    const used=parseInt(S.get("yyp_daily_"+u.email+"_"+todayK())||"0");
    if(used<FREE_LIMIT){setTimer(null);return;}
    const hit=S.get("yyp_hit_"+u.email);
    if(!hit)return;
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      const rem=hit+86400000-Date.now();
      if(rem<=0){
        clearInterval(timerRef.current);
        S.set("yyp_daily_"+u.email+"_"+todayK(),"0");
        S.set("yyp_hit_"+u.email,null);
        setTimer(null);
        showToast("✅ 2 free analyses reset!");
      }else{
        setTimer({h:Math.floor(rem/3600000),m:Math.floor((rem%3600000)/60000),s:Math.floor((rem%60000)/1000),total:rem});
      }
    },1000);
  };

  const startGuestTimer=()=>{
    const hit=S.get("yyp_guest_hit");
    if(!hit)return;
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      const rem=hit+86400000-Date.now();
      if(rem<=0){
        clearInterval(timerRef.current);
        S.set("yyp_guest_count","0");
        S.set("yyp_guest_hit",null);
        setTimer(null);
        showToast("✅ 2 free analyses reset!");
      }else{
        setTimer({h:Math.floor(rem/3600000),m:Math.floor((rem%3600000)/60000),s:Math.floor((rem%60000)/1000),total:rem});
      }
    },1000);
  };

  useEffect(()=>{
    const accounts=S.get("yyp_accounts")||[];
    setSaved(accounts);

    // Always show homepage first - no login required
    if(typeof window==="undefined"){setScreen("home");return;}

    // Check if already logged in (background check)
    const sv=S.get("yyp_current");
    if(sv?.email){
      const u={...sv,plan:S.get("yyp_plan_"+sv.email)||"free"};
      setUser(u);setUsage(calcUsage(u));startTimer(u);
    }

    // Fire Firebase listener silently
    (async()=>{
      try{
        const auth=await getFireAuth();
        const{onAuthStateChanged}=await import("firebase/auth");
        onAuthStateChanged(auth,(fbU)=>{
          if(fbU){
            const u={email:fbU.email,name:fbU.displayName||fbU.email.split("@")[0],photo:fbU.photoURL||null,plan:S.get("yyp_plan_"+fbU.email)||"free"};
            S.set("yyp_current",u);
            setUser(u);setUsage(calcUsage(u));startTimer(u);
          }
        });
      }catch{}
    })();

    setScreen("home"); // Always go to home

    // Check if guest timer should be running
    const gHit=S.get("yyp_guest_hit");
    const gCount=parseInt(S.get("yyp_guest_count")||"0");
    if(!sv?.email&&gCount>=2&&gHit&&(Date.now()-gHit)<86400000){
      // Guest timer still active
      setTimeout(()=>startGuestTimer(),500);
    }
  },[]);

  useEffect(()=>{if(!user)return;startTimer(user);return()=>clearInterval(timerRef.current);},[user]);
  useEffect(()=>{if(loading){setLoadStep(0);[1,2,3].forEach((s,i)=>setTimeout(()=>setLoadStep(s),(i+1)*1200));}},[loading]);

  const saveAcc=(email,name,pw,photo)=>{
    const list=S.get("yyp_accounts")||[];
    const i=list.findIndex(a=>a.email===email);
    const acc={email,name,password:pw||"",photo:photo||null};
    if(i>=0)list[i]=acc;else list.push(acc);
    S.set("yyp_accounts",list);setSaved([...list]);
  };

  const handleGoogle=async()=>{
    setGLoad(true);setAuthErr("");
    try{
      const auth=await getFireAuth();
      const{signInWithPopup,GoogleAuthProvider}=await import("firebase/auth");
      const r=await signInWithPopup(auth,new GoogleAuthProvider());
      const u={email:r.user.email,name:r.user.displayName,photo:r.user.photoURL,plan:S.get("yyp_plan_"+r.user.email)||"free"};
      S.set("yyp_current",u);saveAcc(r.user.email,r.user.displayName,"",r.user.photoURL);
      setUser(u);setUsage(calcUsage(u));startTimer(u);setScreen("home");showToast("✅ Signed in with Google!");
    }catch(e){
      if(e.code==="auth/popup-closed-by-user")setAuthErr("Sign-in cancelled.");
      else if(e.code==="auth/unauthorized-domain")setAuthErr("Domain not authorized in Firebase Console.");
      else setAuthErr("Google sign-in failed. Try email login.");
    }
    setGLoad(false);
  };

  const handleAuth=async()=>{
    if(!form.email||!form.password){setAuthErr("Please fill all fields");return;}
    if(authMode==="signup"&&!form.name){setAuthErr("Name is required");return;}
    if(form.password.length<6){setAuthErr("Password must be 6+ characters");return;}
    setAuthErr("");
    try{
      const auth=await getFireAuth();
      if(authMode==="signup"){
        const{createUserWithEmailAndPassword,updateProfile}=await import("firebase/auth");
        const r=await createUserWithEmailAndPassword(auth,form.email,form.password);
        await updateProfile(r.user,{displayName:form.name});
        const u={email:form.email,name:form.name,photo:null,plan:"free"};
        S.set("yyp_current",u);saveAcc(form.email,form.name,form.password,null);
        setUser(u);setUsage(calcUsage(u));setScreen("home");showToast("✅ Welcome to YesYouPro!");
      }else{
        const{signInWithEmailAndPassword}=await import("firebase/auth");
        const r=await signInWithEmailAndPassword(auth,form.email,form.password);
        const u={email:r.user.email,name:r.user.displayName||form.email.split("@")[0],photo:null,plan:S.get("yyp_plan_"+r.user.email)||"free"};
        S.set("yyp_current",u);saveAcc(form.email,u.name,form.password,null);
        setUser(u);setUsage(calcUsage(u));startTimer(u);setScreen("home");showToast("✅ Welcome back, "+u.name+"!");
      }
    }catch(e){
      const allU=S.get("yyp_users")||{};
      if(authMode==="signup"){
        if(allU[form.email]){setAuthErr("Email already registered. Please login.");return;}
        allU[form.email]={email:form.email,name:form.name,password:form.password};
        S.set("yyp_users",allU);
        const u={email:form.email,name:form.name,photo:null,plan:"free"};
        S.set("yyp_current",u);saveAcc(form.email,form.name,form.password,null);
        setUser(u);setUsage(calcUsage(u));setScreen("home");showToast("✅ Account created!");
      }else{
        const found=allU[form.email];
        if(!found){setAuthErr("No account found. Please Sign Up.");return;}
        if(found.password!==form.password){setAuthErr("Wrong password. Try Forgot Password?");return;}
        const u={email:found.email,name:found.name,photo:null,plan:S.get("yyp_plan_"+found.email)||"free"};
        S.set("yyp_current",u);saveAcc(form.email,found.name,form.password,null);
        setUser(u);setUsage(calcUsage(u));startTimer(u);setScreen("home");showToast("✅ Welcome back!");
      }
    }
  };

  const quickLogin=async(acc)=>{
    setAuthErr("");
    if(!acc.password){handleGoogle();return;}
    try{
      const auth=await getFireAuth();
      const{signInWithEmailAndPassword}=await import("firebase/auth");
      await signInWithEmailAndPassword(auth,acc.email,acc.password);
    }catch{
      const allU=S.get("yyp_users")||{};
      const found=allU[acc.email];
      if(found&&found.password===acc.password){
        const u={email:found.email,name:found.name,photo:acc.photo||null,plan:S.get("yyp_plan_"+found.email)||"free"};
        S.set("yyp_current",u);setUser(u);setUsage(calcUsage(u));startTimer(u);setScreen("home");showToast("✅ Welcome back!");
      }else{setAuthErr("Login failed. Enter password manually.");}
    }
  };

  const handleForgotPw=async()=>{
    if(!form.email){setAuthErr("Enter your email first");return;}
    try{
      const auth=await getFireAuth();
      const{sendPasswordResetEmail}=await import("firebase/auth");
      await sendPasswordResetEmail(auth,form.email);
      showToast("✅ Reset email sent! Check inbox.");setAuthErr("");
    }catch{setAuthErr("Could not send reset email. Try again.");}
  };

  const handleLogout=async()=>{
    try{const auth=await getFireAuth();const{signOut}=await import("firebase/auth");await signOut(auth);}catch{}
    S.set("yyp_current",null);clearInterval(timerRef.current);
    setUser(null);setResult(null);setUsage(null);setTimer(null);setScreen("home");
  };

  const showInterAd=()=>new Promise(resolve=>{
    setAdIdx(Math.floor(Math.random()*ADS_DATA.length));
    setAdTimer(5);setShowAd(true);let t=5;
    adRef.current=setInterval(()=>{t--;setAdTimer(t);if(t<=0)clearInterval(adRef.current);},1000);
    window._adRes=resolve;
  });
  const closeAd=()=>{
    if(adTimer>0)return;
    clearInterval(adRef.current);setShowAd(false);
    if(window._adRes){window._adRes();window._adRes=null;}
  };

  const runAnalysis=async()=>{
    if(!pf.name||!pf.category||!pf.platform){setErr("Please fill all fields");return;}
    setErr("");

    // Guest user (not logged in) - track via localStorage
    if(!user){
      const gKey="yyp_guest_count";
      const gCount=parseInt(S.get(gKey)||"0");
      if(gCount>=FREE_LIMIT){
        // Check if timer is active
        const gHit=S.get("yyp_guest_hit");
        if(gHit&&(Date.now()-gHit)<86400000){
          // Timer still running - show login popup with timer
          setShowLoginPop(true);
          return;
        } else {
          // Reset guest count after 24hrs
          S.set(gKey,"0");
          S.set("yyp_guest_hit",null);
        }
      }
    }

    const info=calcUsage(user);
    if(info.remaining<=0){setShowPrem(true);return;}
    if(curPlan==="free")await showInterAd();
    setLoading(true);setResult(null);setSelPlat(null);setPlatD({});
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(pf)});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Failed");
      addUsage(user);
      const newInfo=calcUsage(user);
      setUsage(newInfo);
      if(newInfo.remaining<=0&&curPlan==="free"&&!S.get("yyp_hit_"+user.email)){
        S.set("yyp_hit_"+user.email,Date.now());
        setTimeout(()=>startTimer(user),300);
      }
      // Increment guest count if not logged in
      if(!user){
        const gKey="yyp_guest_count";
        const gCount=parseInt(S.get(gKey)||"0");
        const newGCount=gCount+1;
        S.set(gKey,String(newGCount));
        // Start guest timer after limit hit
        if(newGCount>=FREE_LIMIT&&!S.get("yyp_guest_hit")){
          S.set("yyp_guest_hit",Date.now());
          startGuestTimer();
        }
      }
      setResult(data);showToast("✅ Analysis complete!");
    }catch(e){setErr("Analysis failed: "+e.message);}
    setLoading(false);
  };

  const fetchPlat=async(pid)=>{
    if(isLocked){setShowPrem(true);return;}
    setSelPlat(pid);
    if(platD[pid])return;
    setPlatLoad(true);
    try{
      const pl=AD_PLATS.find(p=>p.id===pid);
      const ctrl=new AbortController();
      const to=setTimeout(()=>ctrl.abort(),25000);
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:pf.name,category:pf.category,platform:pl.n,mode:"ads_platform"}),signal:ctrl.signal});
      clearTimeout(to);
      if(!res.ok)throw new Error("error");
      const data=await res.json();
      if(data.error)throw new Error(data.error);
      setPlatD(prev=>({...prev,[pid]:data}));
    }catch(e){
      showToast(e.name==="AbortError"?"Timed out. Try again.":"Failed. Try again.");
      setSelPlat(null);
    }
    setPlatLoad(false);
  };

  const api=async(mode,extra={})=>{
    if(isLocked){setShowPrem(true);throw new Error("locked");}
    const body={name:pf.name||"general",category:pf.category||"Fashion",platform:pf.platform||"Amazon",mode,...extra};
    const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok)throw new Error("API error");
    return res.json();
  };

  const calcProf=()=>{
    const buy=parseFloat(profF.buy)||0,sell=parseFloat(profF.sell)||0,units=parseInt(profF.units)||1;
    const fee=parseFloat(profF.fee)||0,ship=parseFloat(profF.ship)||0,ads=parseFloat(profF.ads)||0;
    const cut=sell*(fee/100),netPer=sell-buy-cut-ship;
    const profit=(netPer*units)-ads,cost=(buy*units)+ads;
    const roi=cost>0?((profit/cost)*100).toFixed(1):0,margin=sell>0?((netPer/sell)*100).toFixed(1):0;
    setProfR({profit:profit.toFixed(0),netPer:netPer.toFixed(0),roi,margin,cost:cost.toFixed(0),revenue:(sell*units).toFixed(0),be:netPer>0?Math.ceil(ads/netPer):0});
  };

  const calcInvest=()=>{
    const buy=parseFloat(invF.buy)||0,sell=parseFloat(invF.sell)||0,units=parseInt(invF.units)||1;
    const fee=parseFloat(invF.fee)||0,ship=parseFloat(invF.ship)||0,ads=parseFloat(invF.ads)||0;
    const cut=sell*(fee/100),netPer=sell-buy-cut-ship;
    const profit=(netPer*units)-ads,cost=(buy*units)+ads;
    const roi=cost>0?((profit/cost)*100).toFixed(1):0,margin=sell>0?((netPer/sell)*100).toFixed(1):0;
    setInvR({profit:profit.toFixed(0),netPer:netPer.toFixed(0),roi,margin,cost:cost.toFixed(0),revenue:(sell*units).toFixed(0),be:netPer>0?Math.ceil(ads/netPer):0});
  };

  const copyText=(text,label)=>{
    if(curPlan!=="premium"){setShowPrem(true);return;}
    try{
      navigator.clipboard.writeText(text).then(()=>showToast("📋 Copied: "+label));
    }catch{
      const el=document.createElement("textarea");
      el.value=text;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);
      showToast("📋 Copied: "+label);
    }
  };

  const activatePrem=()=>{
    const expiry=new Date(Date.now()+PREM_DAYS*86400000).toISOString();
    S.set("yyp_prem_"+user.email,{expiry,used:0});
    S.set("yyp_plan_"+user.email,"premium");
    S.set("yyp_hit_"+user.email,null);
    clearInterval(timerRef.current);setTimer(null);
    const u={...user,plan:"premium"};
    setUser(u);setUsage(calcUsage(u));
    setPayStep("success");showToast("🎉 Premium activated!");
  };

  const loadRzp=()=>new Promise(resolve=>{
    if(window.Razorpay){resolve(true);return;}
    const s=document.createElement("script");
    s.src="https://checkout.razorpay.com/v1/checkout.js";
    s.onload=()=>resolve(true);s.onerror=()=>resolve(false);
    document.body.appendChild(s);
  });

  const handlePayment=async()=>{
    setPayStep("processing");
    try{
      const kr=await fetch("/api/payment");
      const kd=await kr.json();
      if(!kd.key){await new Promise(r=>setTimeout(r,1500));activatePrem();return;}
      const loaded=await loadRzp();
      if(!loaded){showToast("Payment failed to load");setPayStep("form");return;}
      const opts={
        key:kd.key,amount:24900,currency:"INR",
        name:"YesYouPro",description:"Premium 7 Days / 30 Analyses",
        handler:(r)=>{if(r.razorpay_payment_id)activatePrem();},
        prefill:{name:user?.name||"",email:user?.email||""},
        theme:{color:"#6366f1"},
        modal:{ondismiss:()=>{setPayStep("form");showToast("Payment cancelled.");}}
      };
      setPayStep("form");
      const rzp=new window.Razorpay(opts);
      rzp.on("payment.failed",()=>{setPayStep("form");showToast("Payment failed. Try again.");});
      rzp.open();
    }catch{await new Promise(r=>setTimeout(r,1000));activatePrem();}
  };

  const LockOv=({name})=>(
    <div onClick={()=>setShowPrem(true)} style={{position:"absolute",inset:0,background:"rgba(2,8,23,.88)",borderRadius:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(6px)"}}>
      <div style={{fontSize:48,marginBottom:12}}>🔒</div>
      <div style={{fontWeight:800,fontSize:17,color:"#f8fafc",marginBottom:6}}>{name}</div>
      <div style={{color:"#94a3b8",fontSize:13,marginBottom:18,textAlign:"center",padding:"0 24px"}}>{timer?"Daily limit reached. Buy Premium or wait 24hrs.":"Unlock with Premium ₹249"}</div>
      <button onClick={(e)=>{e.stopPropagation();setShowPrem(true);}} style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:12,padding:"11px 28px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>💎 Unlock ₹249</button>
    </div>
  );

  const STEPS=["Product data received","Analyzing market trends","Generating AI insights","Creating viral hooks"];

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#e8ecf1;font-family:'Inter',sans-serif;color:#1a1a2e;}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes scaleIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
    .fade-in{animation:fadeIn .5s ease}
    .sp{width:36px;height:36px;border:3px solid rgba(99,102,241,.2);border-top:3px solid #6366f1;border-radius:50%;animation:spin .8s linear infinite}
    .sm-sp{width:22px;height:22px;border:2px solid rgba(99,102,241,.2);border-top:2px solid #6366f1;border-radius:50%;animation:spin .8s linear infinite;margin:20px auto}
    .toast{position:fixed;top:24px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 32px rgba(16,185,129,.4);animation:fadeIn .3s ease;white-space:nowrap}
    .neu{min-height:100vh;background:#e8ecf1;display:flex;align-items:center;justify-content:center;padding:20px}
    .nc{background:#e8ecf1;border-radius:30px;padding:36px 28px;width:100%;max-width:420px;box-shadow:8px 8px 20px #c8cdd5,-8px -8px 20px #fff}
    .navt{width:80px;height:80px;background:#e8ecf1;border-radius:50%;margin:0 auto 18px;display:flex;align-items:center;justify-content:center;box-shadow:6px 6px 14px #c8cdd5,-6px -6px 14px #fff;overflow:hidden}
    .navt img{width:100%;height:100%;object-fit:cover;border-radius:50%}
    .ntitle{font-size:22px;font-weight:800;text-align:center;color:#1a1a2e;margin-bottom:4px}
    .nsub{color:#8b8fa8;font-size:13px;text-align:center;margin-bottom:20px}
    .ntabs{display:flex;background:#e8ecf1;border-radius:13px;padding:4px;margin-bottom:16px;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #fff}
    .ntab{flex:1;padding:9px 0;background:none;border:none;color:#8b8fa8;font-size:13px;font-weight:600;cursor:pointer;border-radius:10px;font-family:'Inter',sans-serif;transition:all .25s}
    .ntab.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:4px 4px 10px rgba(99,102,241,.4)}
    .niw{position:relative;margin-bottom:11px}
    .nii{position:absolute;left:15px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none}
    .ni{width:100%;background:#e8ecf1;border:none;border-radius:13px;padding:12px 15px 12px 42px;color:#1a1a2e;font-size:14px;font-family:'Inter',sans-serif;outline:none;box-shadow:inset 4px 4px 10px #c8cdd5,inset -4px -4px 10px #fff}
    .ni:focus{box-shadow:inset 5px 5px 12px #bec3cb,inset -5px -5px 12px #f2f6fc}
    .ni::placeholder{color:#adb5bd}
    .eye-btn{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:17px}
    .nerr{color:#e53e3e;font-size:12px;margin:-4px 0 9px 4px}
    .nbtn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:13px;padding:13px 0;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:4px 4px 12px rgba(99,102,241,.5);transition:all .2s;margin-bottom:11px}
    .gbtn{width:100%;background:#e8ecf1;border:none;border-radius:13px;padding:11px 0;color:#4a5568;font-weight:700;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;font-family:'Inter',sans-serif;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #fff;transition:all .2s;margin-bottom:11px}
    .divline{display:flex;align-items:center;gap:11px;margin:11px 0}
    .dl{flex:1;height:1px;background:linear-gradient(90deg,transparent,#c8cdd5,transparent)}
    .dt{color:#adb5bd;font-size:10px;font-weight:600}
    .sw{margin-bottom:15px}
    .slbl{color:#8b8fa8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:7px}
    .sacc{display:flex;align-items:center;gap:9px;background:#e8ecf1;border:none;border-radius:13px;padding:9px 11px;margin-bottom:6px;cursor:pointer;width:100%;text-align:left;box-shadow:4px 4px 10px #c8cdd5,-4px -4px 10px #fff}
    .savt{width:34px;height:34px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;flex-shrink:0;overflow:hidden}
    .savt img{width:100%;height:100%;object-fit:cover}
    .si{flex:1;min-width:0}
    .sn{font-size:12px;font-weight:700;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .se{font-size:10px;color:#8b8fa8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .sd{font-size:10px;color:#adb5bd;letter-spacing:2px}
    .rem{display:flex;align-items:center;gap:7px;margin-bottom:11px}
    .rem input{width:16px;height:16px;accent-color:#6366f1}
    .rem label{color:#8b8fa8;font-size:12px;flex:1}
    .fgot{color:#6366f1;font-size:12px;font-weight:600;cursor:pointer}
    .swtxt{color:#8b8fa8;font-size:12px;text-align:center;margin-top:11px}
    .swlnk{color:#6366f1;cursor:pointer;font-weight:700}
    .dash{min-height:100vh;background:#020817;color:#f8fafc}
    .nav{display:flex;align-items:center;justify-content:space-between;padding:13px 20px;border-bottom:1px solid rgba(255,255,255,.04);background:rgba(2,8,23,.95);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100}
    .logo{font-weight:900;font-size:17px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .upill{background:rgba(15,23,42,.9);border:1px solid #1e293b;border-radius:100px;padding:5px 13px;font-size:12px;display:flex;align-items:center;gap:7px}
    .navr{display:flex;align-items:center;gap:7px}
    .upbtn{background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:100px;padding:7px 15px;color:#fff;font-weight:800;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif}
    .avt{width:34px;height:34px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;overflow:hidden}
    .avt img{width:100%;height:100%;object-fit:cover}
    .xbtn{background:none;border:1px solid #1e293b;border-radius:7px;padding:6px 11px;color:#475569;font-size:11px;cursor:pointer;font-family:'Inter',sans-serif}
    .dc{max-width:880px;margin:0 auto;padding:30px 16px 80px}
    .hero{text-align:center;margin-bottom:36px}
    .hbadge{display:inline-flex;align-items:center;gap:5px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.3);border-radius:100px;padding:5px 15px;font-size:11px;color:#a5b4fc;font-weight:700;margin-bottom:14px}
    .htitle{font-weight:900;font-size:clamp(22px,5vw,44px);line-height:1.1;margin-bottom:10px;letter-spacing:-1px}
    .grad{background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hsub{color:#64748b;font-size:13px;max-width:480px;margin:0 auto;line-height:1.65}
    .tbox{background:linear-gradient(135deg,rgba(239,68,68,.1),rgba(245,158,11,.06));border:1px solid rgba(239,68,68,.3);border-radius:18px;padding:20px;margin-bottom:20px;text-align:center;animation:fadeIn .4s ease}
    .ttitle{font-size:15px;font-weight:800;color:#ef4444;margin-bottom:4px}
    .tsub{font-size:12px;color:#64748b;margin-bottom:16px}
    .trow{display:flex;align-items:center;justify-content:center;gap:8px}
    .tunit{background:rgba(15,23,42,.8);border:1px solid rgba(239,68,68,.2);border-radius:11px;padding:10px 14px;min-width:58px}
    .tnum{font-size:26px;font-weight:900;color:#ef4444;font-variant-numeric:tabular-nums;line-height:1}
    .tlbl{font-size:9px;color:#64748b;font-weight:600;margin-top:2px;text-transform:uppercase}
    .tsep{font-size:22px;font-weight:900;color:#ef4444;margin-bottom:8px}
    .tprog{height:3px;background:#1e293b;border-radius:100px;overflow:hidden;margin-top:12px}
    .tpf{height:100%;background:linear-gradient(90deg,#ef4444,#f59e0b);transition:width 1s linear}
    .bnr-g{background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.2);border-radius:12px;padding:10px 15px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:8px}
    .bnr-r{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:10px 15px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:8px}
    .icard{background:rgba(15,23,42,.8);border:1px solid rgba(99,102,241,.15);border-radius:20px;padding:24px 20px;margin-bottom:32px}
    .ict{font-weight:800;font-size:16px;margin-bottom:18px;color:#f8fafc}
    .ilbl{font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    .di{width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:11px;padding:11px 13px;color:#f8fafc;font-size:13px;font-family:'Inter',sans-serif;outline:none;transition:all .2s}
    .di:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}
    .errbanner{background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.25);border-radius:11px;padding:10px 13px;color:#ef4444;font-size:12px;margin-bottom:13px}
    .abtn{width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border:none;border-radius:13px;padding:14px 0;color:#fff;font-weight:800;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 8px 32px rgba(99,102,241,.35);transition:all .2s;font-family:'Inter',sans-serif;margin-top:16px}
    .anote{font-size:11px;opacity:.6}
    .loverlay{position:fixed;inset:0;background:rgba(2,8,23,.97);display:flex;align-items:center;justify-content:center;z-index:7000}
    .lcard{background:rgba(15,23,42,.95);border:1px solid rgba(99,102,241,.25);border-radius:20px;padding:40px 32px;text-align:center;max-width:340px;width:90%}
    .lbrain{font-size:52px;margin-bottom:16px;animation:pulse 1.2s ease infinite}
    .lt1{font-weight:900;font-size:19px;margin-bottom:5px;color:#f8fafc}
    .lt2{color:#64748b;font-size:12px;margin-bottom:22px}
    .lsteps{display:flex;flex-direction:column;gap:6px;text-align:left}
    .lstep{display:flex;align-items:center;gap:9px;padding:7px 11px;border-radius:9px;border:1px solid transparent;font-size:12px;color:#475569;transition:all .4s}
    .lstep.done{color:#10b981;border-color:rgba(16,185,129,.25);background:rgba(16,185,129,.06)}
    .lstep.act{color:#a5b4fc;border-color:rgba(99,102,241,.3);background:rgba(99,102,241,.08)}
    .gcard{background:rgba(15,23,42,.75);border:1px solid #1e293b;border-radius:15px;padding:18px;margin-bottom:10px}
    .gct{font-weight:800;font-size:13px;color:#e2e8f0}
    .gctx{color:#94a3b8;line-height:1.75;font-size:13px}
    .mrow{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:9px;margin-bottom:14px}
    .mcard{background:rgba(15,23,42,.85);border:1px solid #1e293b;border-radius:14px;padding:16px 12px;position:relative;overflow:hidden}
    .mcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6366f1,#a855f7)}
    .mlbl{font-size:10px;color:#64748b;margin-bottom:6px;font-weight:600;text-transform:uppercase}
    .mval{font-weight:900;font-size:17px}
    .tcol{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px;margin-bottom:9px}
    .hitem{display:flex;align-items:flex-start;gap:9px;color:#cbd5e1;font-size:13px;margin-bottom:9px}
    .hnum{min-width:24px;height:24px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex-shrink:0}
    .kwg{display:flex;flex-wrap:wrap;gap:6px}
    .kwc{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.22);color:#a5b4fc;border-radius:100px;padding:4px 11px;font-size:12px;cursor:pointer}
    .cpybtn{background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.25);border-radius:6px;padding:3px 9px;cursor:pointer;color:#a5b4fc;font-size:10px;font-weight:600;font-family:Inter,sans-serif;margin-left:7px}
    .psec{background:rgba(15,23,42,.8);border:1px solid rgba(245,158,11,.2);border-radius:18px;padding:22px 18px;margin-bottom:10px;position:relative}
    .psh{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
    .pst{font-weight:800;font-size:14px;color:#e2e8f0}
    .pbadge{background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:2px 9px;font-size:10px;font-weight:800;color:#fff}
    .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:12px}
    .pplatbtn{background:rgba(2,8,23,.7);border:1.5px solid #1e293b;border-radius:11px;padding:11px 5px 9px;text-align:center;cursor:pointer;transition:all .2s;position:relative}
    .pplatbtn:hover{transform:translateY(-2px)}
    .pplatbtn.on{background:rgba(99,102,241,.1)}
    .plgo{width:26px;height:26px;margin:0 auto 5px}
    .pnm{font-size:8px;font-weight:700;color:#94a3b8}
    .plk{position:absolute;top:3px;right:4px;font-size:9px}
    .pdet{background:rgba(2,8,23,.7);border:1px solid rgba(99,102,241,.2);border-radius:13px;padding:18px 15px;margin-top:11px;animation:fadeIn .4s ease}
    .pdb{margin-bottom:14px}
    .pdt{font-size:10px;font-weight:800;color:#a5b4fc;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
    .pdtx{color:#94a3b8;font-size:12px;line-height:1.75}
    .pdstps{display:flex;flex-direction:column;gap:4px}
    .pdstep{display:flex;align-items:flex-start;gap:7px;background:rgba(99,102,241,.05);border:1px solid rgba(99,102,241,.12);border-radius:7px;padding:6px 9px;color:#cbd5e1;font-size:12px}
    .pdsn{min-width:16px;height:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff;flex-shrink:0}
    .pdch{display:flex;flex-wrap:wrap;gap:4px}
    .pdchip{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:#a5b4fc;border-radius:6px;padding:3px 8px;font-size:11px}
    .ftabs-w{margin-bottom:20px}
    .fgrplbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:7px;margin-top:14px}
    .ftabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:3px}
    .ftabs::-webkit-scrollbar{height:2px}
    .ftabs::-webkit-scrollbar-thumb{background:#1e293b;border-radius:10px}
    .ftab{flex-shrink:0;padding:7px 13px;background:rgba(15,23,42,.7);border:1px solid #1e293b;border-radius:100px;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s;white-space:nowrap}
    .ftab.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(99,102,241,.3)}
    .ftab:hover:not(.on){border-color:rgba(99,102,241,.4);color:#a5b4fc}
    .fbox{background:rgba(15,23,42,.8);border:1px solid rgba(99,102,241,.15);border-radius:18px;padding:22px 18px;margin-bottom:12px;position:relative}
    .prow{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:9px;margin-bottom:12px}
    .pfield{display:flex;flex-direction:column;gap:4px}
    .pfield label{font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase}
    .pfield input,.pfield select{background:#0f172a;border:1px solid #1e293b;border-radius:9px;padding:9px 11px;color:#f8fafc;font-size:12px;font-family:'Inter',sans-serif;outline:none}
    .pfield input:focus,.pfield select:focus{border-color:#6366f1}
    .presult{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:9px;margin-top:12px;animation:fadeIn .4s ease}
    .prc{background:rgba(2,8,23,.6);border:1px solid #1e293b;border-radius:11px;padding:12px;text-align:center}
    .prl{font-size:9px;color:#64748b;margin-bottom:4px;font-weight:600;text-transform:uppercase}
    .prv{font-size:17px;font-weight:900}
    .cbtn{background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:10px;padding:10px 20px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s}
    .gbtn2{width:100%;border:none;border-radius:10px;padding:11px 0;color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif;margin-top:11px}
    .cc{background:rgba(15,23,42,.8);border:1px solid #1e293b;border-radius:13px;padding:15px;margin-bottom:9px}
    .ccrow{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}
    .ccbox{background:rgba(2,8,23,.5);border-radius:8px;padding:9px}
    .ccbt{font-size:9px;color:#64748b;margin-bottom:4px;font-weight:700;text-transform:uppercase}
    .cpt{font-size:11px;color:#94a3b8;padding:2px 0;display:flex;gap:5px}
    .tgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:9px;margin-top:12px}
    .tcard{background:rgba(15,23,42,.8);border:1px solid #1e293b;border-radius:12px;padding:14px}
    .trnk{width:24px;height:24px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;margin-bottom:7px}
    .tc{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);color:#10b981;border-radius:100px;padding:2px 6px;font-size:9px}
    .sc{background:rgba(15,23,42,.8);border:1px solid rgba(16,185,129,.15);border-radius:12px;padding:15px;margin-bottom:9px}
    .schip{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);color:#10b981;border-radius:6px;padding:3px 9px;font-size:11px;font-weight:600}
    .slink{display:inline-block;margin-top:7px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:7px;padding:5px 12px;font-size:11px;font-weight:600;text-decoration:none}
    .moverlay{position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:8000;backdrop-filter:blur(8px)}
    .pmodal{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid rgba(245,158,11,.25);border-radius:24px;padding:32px 24px;max-width:440px;width:92%;text-align:center;animation:scaleIn .3s ease;max-height:90vh;overflow-y:auto}
    .pb2{display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:100px;padding:5px 16px;font-size:11px;font-weight:800;color:#fff;margin-bottom:10px}
    .ptitle{font-weight:900;font-size:22px;margin-bottom:4px;color:#f8fafc}
    .ppr{font-weight:900;font-size:36px;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px}
    .ppr span{font-size:13px;-webkit-text-fill-color:#94a3b8}
    .phigh{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.25);border-radius:11px;padding:11px;margin-bottom:14px;color:#10b981;font-size:12px;font-weight:600;line-height:1.6;text-align:left}
    .pflist{display:flex;flex-direction:column;gap:5px;margin-bottom:18px;text-align:left}
    .pfi{color:#cbd5e1;font-size:12px;padding:7px 11px;background:rgba(255,255,255,.02);border-radius:8px;border:1px solid rgba(255,255,255,.04)}
    .pbtn2{width:100%;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:12px;padding:13px 0;color:#fff;font-weight:800;font-size:14px;cursor:pointer;margin-bottom:7px;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;gap:7px}
    .mcan{background:none;border:none;color:#475569;font-family:'Inter',sans-serif;font-size:12px;cursor:pointer;padding:5px 0;width:100%}
    .paybox{background:#020817;border:1px solid #1e293b;border-radius:11px;padding:13px;margin-bottom:11px;text-align:left}
    .pr2{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);color:#94a3b8;font-size:12px}
    .pr2:last-child{border-bottom:none}
    .sfeat{background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.2);border-radius:11px;padding:12px;margin:11px 0 16px;text-align:left}
    .sfi2{color:#10b981;font-size:12px;padding:2px 0;font-weight:500}
    .adov{position:fixed;inset:0;background:rgba(0,0,0,.97);display:flex;align-items:center;justify-content:center;z-index:9000}
    .adbox{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid #1e293b;border-radius:20px;padding:32px 24px;max-width:360px;width:92%;text-align:center;position:relative;animation:scaleIn .3s ease}
    .adtop{position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:3px 14px;border-radius:100px;font-size:9px;font-weight:800;color:#fff;letter-spacing:1.5px}
    .adh{font-weight:900;font-size:19px;margin:11px 0 5px;color:#f8fafc}
    .ads{color:#94a3b8;margin-bottom:16px;font-size:12px}
    .adcta{border:none;border-radius:100px;padding:9px 22px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif}
    .adprog{height:3px;background:#1e293b;border-radius:100px;margin:14px 0 0;overflow:hidden}
    .adpf{height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width 1s linear}
    .adcl{display:block;margin:9px auto 0;background:none;border:1px solid #2d3748;border-radius:100px;padding:6px 18px;color:#94a3b8;cursor:pointer;font-size:11px;font-family:'Inter',sans-serif}
    footer{text-align:center;padding:18px;color:#334155;font-size:11px;border-top:1px solid rgba(255,255,255,.03)}
    /* PROFILE MODAL */
    .prof-ov{position:fixed;inset:0;background:rgba(0,0,0,.92);display:flex;align-items:flex-end;justify-content:center;z-index:8500;backdrop-filter:blur(8px)}
    .prof-modal{background:linear-gradient(180deg,#0f172a,#020817);border:1px solid rgba(99,102,241,.2);border-radius:24px 24px 0 0;padding:28px 22px 40px;width:100%;max-width:480px;animation:slideUp .3s ease}
    @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
    .prof-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
    .prof-user{display:flex;align-items:center;gap:12px}
    .prof-avt{width:48px;height:48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;color:#fff;overflow:hidden;flex-shrink:0}
    .prof-avt img{width:100%;height:100%;object-fit:cover}
    .prof-name{font-weight:800;font-size:16px;color:#f8fafc}
    .prof-email{font-size:12px;color:#64748b;margin-top:2px}
    .prof-plan{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;margin-top:4px}
    .prof-close{background:rgba(255,255,255,.06);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;color:#94a3b8;font-size:18px;display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif}
    .prof-menu{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
    .pmenu-btn{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:13px;padding:13px 16px;cursor:pointer;width:100%;text-align:left;color:#e2e8f0;font-size:14px;font-weight:600;font-family:Inter,sans-serif;transition:all .2s}
    .pmenu-btn:hover{background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.3)}
    .pmenu-btn.logout{color:#ef4444;border-color:rgba(239,68,68,.2)}
    .pmenu-btn.logout:hover{background:rgba(239,68,68,.08)}
    .pmenu-icon{font-size:20px;width:28px;text-align:center}
    .pmenu-arr{margin-left:auto;color:#475569;font-size:14px}
    /* TERMS */
    .terms-box{background:rgba(2,8,23,.5);border:1px solid #1e293b;border-radius:13px;padding:16px;max-height:320px;overflow-y:auto;margin-bottom:14px}
    .terms-box::-webkit-scrollbar{width:4px}
    .terms-box::-webkit-scrollbar-thumb{background:#1e293b;border-radius:10px}
    .terms-h{font-weight:700;font-size:13px;color:#a5b4fc;margin-bottom:5px;margin-top:12px}
    .terms-h:first-child{margin-top:0}
    .terms-p{font-size:12px;color:#94a3b8;line-height:1.7}
    /* QUESTION */
    .q-box{background:rgba(2,8,23,.5);border:1px solid #1e293b;border-radius:12px;padding:4px}
    .q-inp{width:100%;background:none;border:none;color:#f8fafc;font-size:13px;font-family:Inter,sans-serif;padding:12px;outline:none;resize:none;min-height:100px;line-height:1.6}
    .q-inp::placeholder{color:#475569}
    /* PICKER */
    .picker-grp-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;margin-top:12px;color:#64748b}
    .picker-chips{display:flex;flex-wrap:wrap;gap:5px}
    .pchip{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:9px;border:1.5px solid #1e293b;background:rgba(15,23,42,.7);cursor:pointer;font-size:11px;font-weight:600;color:#94a3b8;font-family:Inter,sans-serif;transition:all .15s}
    .pchip:hover{border-color:rgba(99,102,241,.5);color:#a5b4fc}
    .pchip.on{color:#fff;border-color:transparent;box-shadow:0 2px 10px rgba(99,102,241,.35)}
    @media(max-width:600px){
      .nav{padding:10px 11px} .dc{padding:20px 10px 60px}
      .upill{display:none} .pgrid{gap:5px} .pplatbtn{padding:9px 3px 7px}
      .nc{padding:26px 16px} .icard{padding:18px 13px}
    }
  `;

  const platGroups=[...new Set(PLATS.map(p=>p.g))];



  return(<>
    <Head>
      <title>YesYouPro — AI Product Analyzer for Indian Sellers</title>
      <meta name="description" content="YesYouPro — AI-powered product analyzer for Indian ecommerce sellers. Analyze any product, app, game or service. Get viral hooks, keywords, competitor analysis, profit calculator & 13 premium tools. Free to try!" />
      <meta property="og:title" content="YesYouPro — AI Product Analyzer" />
      <meta property="og:description" content="Analyze any product in 30 seconds! Viral hooks, keywords, competitor analysis & more for Indian sellers." />
      <meta property="og:image" content="https://yesyoupro.com/og-image.png" />
      <meta property="og:url" content="https://yesyoupro.com" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="shortcut icon" href="/favicon.svg" />
    </Head>
    <style>{css}</style>
    {toast&&<div className="toast">{toast}</div>}

    {loading&&<div className="loverlay">
      <div className="lcard">
        <div className="lbrain">🧠</div>
        <h2 className="lt1">Analyzing...</h2>
        <p className="lt2">YYP AI is processing your request</p>
        <div className="lsteps">
          {STEPS.map((s,i)=>(
            <div key={i} className={"lstep"+(loadStep>i?" done":loadStep===i?" act":"")}>
              <span>{loadStep>i?"✅":loadStep===i?"⚙️":"○"}</span><span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>}

    {showAd&&<div className="adov">
      <div className="adbox">
        <div className="adtop" style={{background:ADS_DATA[adIdx].c}}>ADVERTISEMENT</div>
        <div style={{fontSize:42,marginTop:7}}>📢</div>
        <h2 className="adh">{ADS_DATA[adIdx].h}</h2>
        <p className="ads">{ADS_DATA[adIdx].s}</p>
        <button className="adcta" style={{background:ADS_DATA[adIdx].c}}>Try Now</button>
        <div className="adprog"><div className="adpf" style={{width:((5-adTimer)/5*100)+"%"}}/></div>
        <button onClick={closeAd} className="adcl" style={{opacity:adTimer>0?.3:1,cursor:adTimer>0?"not-allowed":"pointer"}}>
          {adTimer>0?"⏳ Skip in "+adTimer+"s":"✕ Close & Continue"}
        </button>
      </div>
    </div>}

    {/* LOGIN POPUP - after 2 guest analyses */}
    {showLoginPop&&<div className="moverlay" onClick={()=>setShowLoginPop(false)}>
      <div className="pmodal" onClick={e=>e.stopPropagation()} style={{textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:12}}>🔐</div>
        <h2 className="ptitle" style={{marginBottom:6}}>Login to Continue</h2>
        <p style={{color:"#64748b",fontSize:13,marginBottom:20,lineHeight:1.6}}>
          Aapne 2 free analyses use kar li hain!<br/>
          Login karke aur 2 analyses/day pao.<br/>
          Ya Premium buy karo — 30 analyses/7 days!
        </p>
        <button className="pbtn2" onClick={()=>{setShowLoginPop(false);setScreen("auth");setAuthMode("signup");}} style={{marginBottom:8}}>
          🆓 Free Mein Sign Up Karo
        </button>
        <button onClick={()=>{setShowLoginPop(false);setScreen("auth");setAuthMode("login");}} style={{width:"100%",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.3)",borderRadius:12,padding:"11px 0",color:"#a5b4fc",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif",marginBottom:10}}>
          🔑 Login Karo
        </button>
        <div style={{color:"#475569",fontSize:12,margin:"8px 0"}}>ya</div>
        <button onClick={()=>{setShowLoginPop(false);setShowPrem(true);}} style={{width:"100%",background:"linear-gradient(135deg,#f59e0b22,#ef444411)",border:"1px solid rgba(245,158,11,.3)",borderRadius:12,padding:"11px 0",color:"#f59e0b",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
          💎 Premium Buy Karo — ₹249
        </button>
        <button onClick={()=>setShowLoginPop(false)} style={{background:"none",border:"none",color:"#334155",fontSize:12,cursor:"pointer",marginTop:12,fontFamily:"Inter,sans-serif"}}>
          Cancel
        </button>
      </div>
    </div>}

        {showPrem&&<div className="moverlay" onClick={()=>{if(payStep==="form"||payStep==="success"){setShowPrem(false);setShowPay(false);setPayStep("form");}}}>
      <div className="pmodal" onClick={e=>e.stopPropagation()}>
        {!showPay?(
          <>
            <div className="pb2">💎 PREMIUM</div>
            <h2 className="ptitle">Unlock Everything</h2>
            <div className="ppr">₹249 <span>/ 7 days</span></div>
            <div className="phigh">📊 30 analyses / 7 days (Free: 2/day only)<br/>⏰ No 24hr lockout — analyze anytime<br/>🚫 Zero ads — completely clean<br/>📋 Copy any AI result instantly<br/>🔓 All 13 tools unlocked</div>
            <div className="pflist">
              {["✅ 30 analyses / 7 days","✅ Zero ads","✅ No 24hr wait","📋 Copy full reports & results","🎓 Starter Guide","🔰 Beginner Product Finder","🧮 Investment Calculator","📊 Sales Estimator","🏷️ Price Optimizer","📦 Inventory Calculator","⭐ Review Analyzer","🎯 Niche Finder","📺 Ads on 8+ platforms"].map(f=>(
                <div key={f} className="pfi">{f}</div>
              ))}
            </div>
            <button className="pbtn2" onClick={()=>setShowPay(true)}>🔓 Unlock Premium — ₹249</button>
            <button className="mcan" onClick={()=>setShowPrem(false)}>Maybe later</button>
          </>
        ):payStep==="form"?(
          <>
            <h2 className="ptitle">Complete Payment</h2>
            <div className="paybox">
              <div className="pr2"><span>Plan</span><span>Premium 7-day</span></div>
              <div className="pr2"><span>Amount</span><span style={{color:"#f59e0b",fontWeight:700}}>₹249</span></div>
              <div className="pr2"><span>Analyses</span><span style={{color:"#10b981"}}>30 in 7 days</span></div>
              <div className="pr2"><span>Tools</span><span style={{color:"#10b981"}}>All 13 unlocked</span></div>
              <div className="pr2"><span>Copy Results</span><span style={{color:"#a5b4fc"}}>✅ Enabled</span></div>
            </div>
            <button className="pbtn2" onClick={handlePayment}>
              <svg width="16" height="16" viewBox="0 0 30 30" fill="none"><path d="M14.396 0L0 19.578h9.979L7.242 30l22.758-19.56H19.5L22.25 0z" fill="#528FF0"/></svg>
              Pay ₹249 via Razorpay
            </button>
            <button className="mcan" onClick={()=>setShowPay(false)}>← Back</button>
          </>
        ):payStep==="processing"?(
          <div style={{textAlign:"center",padding:36}}><div className="sp" style={{margin:"0 auto"}}/><p style={{color:"#94a3b8",marginTop:14}}>Processing...</p></div>
        ):(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:10}}>🎉</div>
            <h2 className="ptitle">Premium Activated!</h2>
            <div className="sfeat">
              <div className="sfi2">✅ 30 analyses / 7 days</div>
              <div className="sfi2">✅ Zero ads</div>
              <div className="sfi2">✅ Copy results enabled</div>
              <div className="sfi2">✅ All 13 tools unlocked</div>
            </div>
            <button className="pbtn2" onClick={()=>{setShowPrem(false);setShowPay(false);setPayStep("form");}}>🚀 Start Analyzing →</button>
          </div>
        )}
      </div>
    </div>}

    {/* PROFILE MODAL */}
    {showProfile&&<div className="moverlay" onClick={()=>{setShowProfile(false);setProfileTab("main");setQSent(false);}}>
      <div className="pmodal" style={{maxWidth:420,padding:"28px 22px"}} onClick={e=>e.stopPropagation()}>

        {profileTab==="main"&&(
          <>
            {/* User Info */}
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:"14px 16px",background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:14}}>
              <div style={{width:50,height:50,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:20,color:"#fff",overflow:"hidden",flexShrink:0}}>
                {user?.photo?<img src={user.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:user?.name?.[0]?.toUpperCase()||"U"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,color:"#f8fafc",marginBottom:2}}>{user?.name}</div>
                <div style={{fontSize:12,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
                <div style={{marginTop:5,display:"inline-block",background:curPlan==="premium"?"linear-gradient(135deg,#f59e0b,#ef4444)":"rgba(99,102,241,.15)",border:curPlan==="premium"?"none":"1px solid rgba(99,102,241,.3)",borderRadius:100,padding:"2px 10px",fontSize:11,fontWeight:700,color:curPlan==="premium"?"#fff":"#a5b4fc"}}>
                  {curPlan==="premium"?"💎 Premium":"🆓 Free Plan"}
                </div>
              </div>
            </div>

            {/* Usage Info */}
            {usage&&<div style={{background:"rgba(15,23,42,.6)",border:"1px solid #1e293b",borderRadius:12,padding:"12px 14px",marginBottom:18}}>
              <div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Usage</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:"#94a3b8"}}>Analyses Left</span>
                <span style={{color:usage.remaining>0?"#10b981":"#ef4444",fontWeight:700}}>{usage.remaining} / {usage.total}</span>
              </div>
              {curPlan==="premium"&&usage.expiry&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:5}}>
                <span style={{color:"#94a3b8"}}>Expires</span>
                <span style={{color:"#f59e0b",fontWeight:600}}>{new Date(usage.expiry).toLocaleDateString("en-IN")}</span>
              </div>}
            </div>}

            {/* Menu Options */}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
              {curPlan==="free"&&<button onClick={()=>{setShowProfile(false);setShowPrem(true);}} style={{background:"linear-gradient(135deg,#f59e0b22,#ef444411)",border:"1px solid rgba(245,158,11,.3)",borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:"#f59e0b",fontWeight:700,fontSize:14,fontFamily:"Inter,sans-serif",transition:"all .2s"}}>
                <span style={{fontSize:20}}>💎</span>
                <div style={{textAlign:"left"}}>
                  <div>Upgrade to Premium</div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:400}}>30 analyses, all tools, no ads</div>
                </div>
                <span style={{marginLeft:"auto",color:"#f59e0b"}}>→</span>
              </button>}

              <button onClick={()=>setProfileTab("questions")} style={{background:"rgba(15,23,42,.6)",border:"1px solid #1e293b",borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:"#e2e8f0",fontWeight:600,fontSize:14,fontFamily:"Inter,sans-serif",transition:"all .2s"}}>
                <span style={{fontSize:20}}>❓</span>
                <div style={{textAlign:"left"}}>
                  <div>Any Questions?</div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:400}}>Contact us directly</div>
                </div>
                <span style={{marginLeft:"auto",color:"#475569"}}>→</span>
              </button>

              <button onClick={()=>setProfileTab("terms")} style={{background:"rgba(15,23,42,.6)",border:"1px solid #1e293b",borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:"#e2e8f0",fontWeight:600,fontSize:14,fontFamily:"Inter,sans-serif",transition:"all .2s"}}>
                <span style={{fontSize:20}}>📄</span>
                <div style={{textAlign:"left"}}>
                  <div>Terms & Conditions</div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:400}}>Privacy policy & usage terms</div>
                </div>
                <span style={{marginLeft:"auto",color:"#475569"}}>→</span>
              </button>

              <button onClick={()=>{setShowProfile(false);handleLogout();}} style={{background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)",borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:"#ef4444",fontWeight:600,fontSize:14,fontFamily:"Inter,sans-serif",transition:"all .2s"}}>
                <span style={{fontSize:20}}>🚪</span>
                <div style={{textAlign:"left"}}>
                  <div>Log Out</div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:400}}>Sign out of your account</div>
                </div>
              </button>
            </div>

            <button className="mcan" onClick={()=>setShowProfile(false)}>Close</button>
          </>
        )}

        {/* QUESTIONS TAB */}
        {profileTab==="questions"&&(
          <>
            <button onClick={()=>{setProfileTab("main");setQSent(false);}} style={{background:"none",border:"none",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif",marginBottom:16,display:"flex",alignItems:"center",gap:5}}>← Back</button>
            <h3 style={{fontWeight:800,fontSize:18,color:"#f8fafc",marginBottom:4}}>❓ Any Questions?</h3>
            <p style={{color:"#64748b",fontSize:12,marginBottom:18,lineHeight:1.6}}>Kuch bhi poochho — hum directly reply karenge aapke email pe!</p>

            {qSent?(
              <div style={{textAlign:"center",padding:"30px 20px"}}>
                <div style={{fontSize:56,marginBottom:12}}>✅</div>
                <div style={{fontWeight:800,fontSize:16,color:"#10b981",marginBottom:8}}>Question Sent!</div>
                <div style={{color:"#64748b",fontSize:13,marginBottom:20}}>Hum jald hi reply karenge {user?.email} pe</div>
                <button onClick={()=>setQSent(false)} style={{background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",borderRadius:10,padding:"10px 24px",color:"#a5b4fc",cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"Inter,sans-serif"}}>Aur Poochho</button>
              </div>
            ):(
              <>
                <textarea value={question} onChange={e=>setQuestion(e.target.value)}
                  placeholder="Apna question yahan likho... jaise ki payment issue, koi feature request, koi problem, kuch bhi!"
                  style={{width:"100%",background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:"13px 14px",color:"#f8fafc",fontSize:13,fontFamily:"Inter,sans-serif",outline:"none",resize:"vertical",minHeight:120,lineHeight:1.7,marginBottom:12}}
                />
                <button onClick={sendQuestion} disabled={qLoading||!question.trim()} style={{width:"100%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:"13px 0",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"Inter,sans-serif",opacity:(!question.trim()||qLoading)?.6:1}}>
                  {qLoading?"⏳ Sending...":"📨 Send Question"}
                </button>
                <p style={{color:"#475569",fontSize:11,textAlign:"center",marginTop:10}}>Reply aayegi: {user?.email}</p>
              </>
            )}
          </>
        )}

        {/* TERMS TAB */}
        {profileTab==="terms"&&(
          <>
            <button onClick={()=>setProfileTab("main")} style={{background:"none",border:"none",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif",marginBottom:16,display:"flex",alignItems:"center",gap:5}}>← Back</button>
            <h3 style={{fontWeight:800,fontSize:18,color:"#f8fafc",marginBottom:16}}>📄 Terms & Conditions</h3>
            <div style={{background:"rgba(15,23,42,.6)",border:"1px solid #1e293b",borderRadius:12,padding:"16px",maxHeight:400,overflowY:"auto"}}>
              {[
                {title:"1. Service Use",text:"YesYouPro AI-powered product analysis service hai jo Indian ecommerce sellers ke liye banaya gaya hai. Aap is service ka use legal business activities ke liye kar sakte hain."},
                {title:"2. Free Plan",text:"Free users ko 2 analyses per day milte hain. 24 ghante baad automatically reset hota hai. Free plan mein ads show hongi."},
                {title:"3. Premium Plan",text:"Premium plan ₹249 mein 7 days ke liye valid hai jisme 30 analyses milte hain. Plan expire hone ke baad dobara purchase karna hoga. Refund policy: payment ke 24 ghante ke andar contact karo."},
                {title:"4. Data Privacy",text:"Hum aapka email aur usage data store karte hain service improve karne ke liye. Aapka data kisi third party ko nahi becha jaata. Hum Google Firebase authentication use karte hain."},
                {title:"5. AI Results",text:"YesYouPro ke AI results informational hain. Hum guarantee nahi dete ki ye results aapke business mein profit guarantee karenge. Business decisions apni research ke saath lein."},
                {title:"6. Prohibited Use",text:"Spam, illegal activities, ya service abuse ke liye use karna mana hai. Violation pe account suspend kiya ja sakta hai."},
                {title:"7. Contact Us",text:"Koi bhi problem ya question ke liye 'Any Questions?' section use karein. Hum 24-48 ghante mein reply karte hain."},
              ].map((t,i)=>(
                <div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<6?"1px solid rgba(255,255,255,.05)":"none"}}>
                  <div style={{fontWeight:700,fontSize:12,color:"#a5b4fc",marginBottom:5}}>{t.title}</div>
                  <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.7}}>{t.text}</div>
                </div>
              ))}
            </div>
            <p style={{color:"#475569",fontSize:11,textAlign:"center",marginTop:12}}>Last updated: April 2025</p>
          </>
        )}

      </div>
    </div>}

    {/* PROFILE MODAL */}
    {showProfile&&<div className="prof-ov" onClick={()=>setShowProfile(false)}>
      <div className="prof-modal" onClick={e=>e.stopPropagation()}>

        {profileTab==="main"&&<>
          <div className="prof-header">
            <div className="prof-user">
              <div className="prof-avt" style={{background:user?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(30,41,59,.8)"}}>
                {user?.photo?<img src={user.photo} alt=""/>:user?user.name?.[0]?.toUpperCase()||"U":"👤"}
              </div>
              <div>
                <div className="prof-name">{user?user.name:"Guest User"}</div>
                <div className="prof-email">{user?user.email:"Not logged in"}</div>
                <div className="prof-plan" style={{background:!user?"rgba(100,116,139,.1)":curPlan==="premium"?"rgba(245,158,11,.15)":"rgba(99,102,241,.1)",color:!user?"#64748b":curPlan==="premium"?"#f59e0b":"#a5b4fc",border:!user?"1px solid rgba(100,116,139,.2)":curPlan==="premium"?"1px solid rgba(245,158,11,.3)":"1px solid rgba(99,102,241,.2)"}}>
                  {!user?"👤 Guest":curPlan==="premium"?"💎 Premium Plan":"🆓 Free Plan"}
                </div>
              </div>
            </div>
            <button className="prof-close" onClick={()=>setShowProfile(false)}>✕</button>
          </div>

          {curPlan==="premium"&&usage&&(
            <div style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.2)",borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,color:"#f59e0b",fontWeight:600}}>💎 Premium Active</div>
              <div style={{fontSize:12,color:"#94a3b8"}}>{usage.remaining} analyses left</div>
            </div>
          )}

          <div className="prof-menu">
            {!user&&(
              <>
                <button className="pmenu-btn" style={{borderColor:"rgba(99,102,241,.3)",color:"#a5b4fc"}} onClick={()=>{setShowProfile(false);setScreen("auth");setAuthMode("login");}}>
                  <span className="pmenu-icon">🔑</span>
                  <span>Login Karo</span>
                  <span className="pmenu-arr">›</span>
                </button>
                <button className="pmenu-btn" style={{borderColor:"rgba(16,185,129,.3)",color:"#10b981"}} onClick={()=>{setShowProfile(false);setScreen("auth");setAuthMode("signup");}}>
                  <span className="pmenu-icon">✨</span>
                  <span>Sign Up — Free</span>
                  <span className="pmenu-arr">›</span>
                </button>
              </>
            )}
            <button className="pmenu-btn" onClick={()=>setProfileTab("terms")}>
              <span className="pmenu-icon">📋</span>
              <span>Terms & Conditions</span>
              <span className="pmenu-arr">›</span>
            </button>
            <button className="pmenu-btn" onClick={()=>setProfileTab("question")}>
              <span className="pmenu-icon">❓</span>
              <span>Any Questions?</span>
              <span className="pmenu-arr">›</span>
            </button>
            {(user&&curPlan==="free")&&(
              <button className="pmenu-btn" onClick={()=>{setShowProfile(false);setShowPrem(true);}}>
                <span className="pmenu-icon">💎</span>
                <span>Upgrade to Premium — ₹249</span>
                <span className="pmenu-arr">›</span>
              </button>
            )}
            {user&&<button className="pmenu-btn logout" onClick={()=>{setShowProfile(false);handleLogout();}}>
              <span className="pmenu-icon">🚪</span>
              <span>Logout</span>
            </button>}
          </div>
          <div style={{textAlign:"center",fontSize:11,color:"#475569",lineHeight:2}}>
            <a href="/privacy" style={{color:"#6366f1",textDecoration:"none",marginRight:12}}>Privacy Policy</a>
            <a href="https://instagram.com/yesyoupro" target="_blank" rel="noreferrer" style={{color:"#e1306c",textDecoration:"none"}}>📸 @yesyoupro</a>
            <div style={{color:"#334155",marginTop:4}}>YesYouPro v1.0</div>
          </div>
        </>}

        {profileTab==="terms"&&<>
          <div className="prof-header">
            <button className="prof-close" style={{background:"none",fontSize:22}} onClick={()=>setProfileTab("main")}>←</button>
            <div style={{fontWeight:800,fontSize:16,color:"#f8fafc"}}>Terms & Conditions</div>
            <div style={{width:32}}/>
          </div>
          <div className="terms-box">
            <div className="terms-h">1. Acceptance of Terms</div>
            <p className="terms-p">By using YesYouPro, you agree to these terms. If you do not agree, please do not use our service.</p>

            <div className="terms-h">2. Free Plan</div>
            <p className="terms-p">Free users get 2 analyses per day. After the daily limit is reached, a 24-hour timer starts. All tools are available during active analyses. No refund for unused free analyses.</p>

            <div className="terms-h">3. Premium Plan</div>
            <p className="terms-p">Premium plan costs ₹249 for 7 days with 30 analyses. After 7 days OR 30 analyses (whichever comes first), the plan expires. No automatic renewal. User must manually repurchase.</p>

            <div className="terms-h">4. Refund Policy</div>
            <p className="terms-p">No refunds once Premium is activated. If you face technical issues, contact us at support@yesyoupro.com within 24 hours of purchase.</p>

            <div className="terms-h">5. AI Data Accuracy</div>
            <p className="terms-p">YesYouPro uses AI to generate analysis. Results are suggestions only — not guaranteed business advice. Always do your own research before making business decisions.</p>

            <div className="terms-h">6. Account Responsibility</div>
            <p className="terms-p">Keep your login credentials safe. You are responsible for all activity under your account. Do not share your account with others.</p>

            <div className="terms-h">7. Prohibited Use</div>
            <p className="terms-p">Do not use YesYouPro for illegal activities, spamming, or reselling our AI results as your own service without permission.</p>

            <div className="terms-h">8. Data Privacy</div>
            <p className="terms-p">We store your email and usage data securely. We do not sell your personal data to third parties. Payment data is processed securely by Razorpay.</p>

            <div className="terms-h">9. Changes to Service</div>
            <p className="terms-p">YesYouPro reserves the right to modify features, pricing, or these terms at any time. Continued use means acceptance of changes.</p>

            <div className="terms-h">10. Contact</div>
            <p className="terms-p">For any queries: support@yesyoupro.com</p>
          </div>
          <button className="pmenu-btn" onClick={()=>setProfileTab("main")} style={{justifyContent:"center"}}>← Back to Profile</button>
        </>}

        {profileTab==="question"&&<>
          <div className="prof-header">
            <button className="prof-close" style={{background:"none",fontSize:22}} onClick={()=>setProfileTab("main")}>←</button>
            <div style={{fontWeight:800,fontSize:16,color:"#f8fafc"}}>Any Questions?</div>
            <div style={{width:32}}/>
          </div>

          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,color:"#64748b",marginBottom:12,lineHeight:1.6}}>
              Koi bhi problem ya question hai? Hume likho — hum jaldi reply karenge! 📩
            </div>
            {qSent?(
              <div style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.3)",borderRadius:12,padding:20,textAlign:"center"}}>
                <div style={{fontSize:36,marginBottom:8}}>✅</div>
                <div style={{fontWeight:700,color:"#10b981",fontSize:15,marginBottom:4}}>Message Sent!</div>
                <div style={{color:"#64748b",fontSize:12}}>Hum 24 ghante mein reply karenge.</div>
              </div>
            ):(
              <>
                <div style={{marginBottom:8}}>
                  <div className="q-box">
                    <textarea
                      className="q-inp"
                      placeholder="Apna question ya problem yahan likho... jaise: Premium kab active hoga? Analysis kaam nahi kar raha. Refund chahiye. Koi bhi sawal..."
                      value={question}
                      onChange={e=>setQuestion(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <div style={{fontSize:11,color:"#475569",marginBottom:12}}>
                  📧 From: {user?.email} · Plan: {curPlan}
                </div>
                <button
                  onClick={sendQuestion}
                  disabled={qSending||!question.trim()}
                  style={{width:"100%",background:question.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(30,41,59,.5)",border:"none",borderRadius:12,padding:"13px 0",color:question.trim()?"#fff":"#475569",fontWeight:800,fontSize:14,cursor:question.trim()?"pointer":"not-allowed",fontFamily:"Inter,sans-serif",transition:"all .2s"}}>
                  {qSending?"📤 Sending...":"📤 Send Message"}
                </button>
              </>
            )}
          </div>
          <div style={{textAlign:"center",fontSize:11,color:"#334155",marginTop:8}}>
            ya email karo: support@yesyoupro.com
          </div>
        </>}

      </div>
    </div>}

    {screen==="auth"&&<div className="neu">
      <div className="nc">
        <div className="navt">
          <svg viewBox="0 0 24 24" fill="none" stroke="#8b8fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="38" height="38">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",color:"#6366f1",fontSize:13,fontWeight:600,fontFamily:"Inter,sans-serif",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
          ← Back to Home
        </button>
        <h1 className="ntitle">{authMode==="login"?"Welcome back":"Create account"}</h1>
        <p className="nsub">{authMode==="login"?"Sign in to continue":"Join YesYouPro for free"}</p>

        {authMode==="login"&&saved.length>0&&(
          <div className="sw">
            <div className="slbl">Quick Login</div>
            {saved.map(a=>(
              <button key={a.email} className="sacc" onClick={()=>quickLogin(a)}>
                <div className="savt">{a.photo?<img src={a.photo} alt=""/>:a.name?.[0]?.toUpperCase()||"U"}</div>
                <div className="si">
                  <div className="sn">{a.name}</div>
                  <div className="se">{a.email}</div>
                  <div className="sd">{a.password?"●".repeat(Math.min(a.password.length,8)):"Google Account"}</div>
                </div>
                <div style={{color:"#6366f1",fontSize:16,fontWeight:700}}>→</div>
              </button>
            ))}
            <div className="divline"><div className="dl"/><div className="dt">OR SIGN IN MANUALLY</div><div className="dl"/></div>
          </div>
        )}

        <div className="ntabs">
          {["login","signup"].map(m=>(
            <button key={m} className={"ntab"+(authMode===m?" on":"")} onClick={()=>{setAuthMode(m);setAuthErr("");setForm({email:"",password:"",name:""});}}>
              {m==="login"?"Login":"Sign Up"}
            </button>
          ))}
        </div>

        <button className="gbtn" onClick={handleGoogle} disabled={gLoad}>
          {gLoad?<div className="sp" style={{width:16,height:16,border:"2px solid rgba(99,102,241,.2)",borderTop:"2px solid #6366f1"}}/>:(
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {gLoad?"Signing in...":"Continue with Google"}
        </button>

        <div className="divline"><div className="dl"/><div className="dt">OR CONTINUE WITH EMAIL</div><div className="dl"/></div>

        {authMode==="signup"&&<div className="niw"><span className="nii">👤</span><input className="ni" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>}
        <div className="niw"><span className="nii">✉️</span><input className="ni" placeholder="Email address" type="email" autoComplete="off" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div className="niw">
          <span className="nii">🔒</span>
          <input className="ni" placeholder="Password" type={showPw?"text":"password"} autoComplete="new-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <button className="eye-btn" onClick={()=>setShowPw(!showPw)}>{showPw?"🙈":"👁️"}</button>
        </div>
        {authErr&&<p className="nerr">⚠️ {authErr}</p>}
        {authMode==="login"&&(
          <div className="rem">
            <input type="checkbox" id="rem" defaultChecked/>
            <label htmlFor="rem">Remember me</label>
            <span className="fgot" onClick={handleForgotPw}>Forgot password?</span>
          </div>
        )}
        <button className="nbtn" onClick={handleAuth}>{authMode==="login"?"Sign In →":"Create Account →"}</button>
        <p className="swtxt">{authMode==="login"?"Don't have an account? ":"Already have an account? "}
          <span className="swlnk" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("");setForm({email:"",password:"",name:""});}}>{authMode==="login"?"Sign Up Free":"Sign In"}</span>
        </p>
      </div>
    </div>}

    {screen==="home"&&<div className="dash">
      <nav className="nav">
        <div className="logo" style={{cursor:"pointer"}} onClick={()=>setScreen("home")}>🧠 YesYouPro</div>
        {!user&&<div className="upill">
          <span style={{color:"#94a3b8",fontWeight:700}}>👤 Guest</span>
          <span style={{color:"#334155"}}>|</span>
          <span style={{color:parseInt(S.get("yyp_guest_count")||"0")>=FREE_LIMIT?"#ef4444":"#10b981",fontWeight:700}}>{Math.max(0,FREE_LIMIT-parseInt(S.get("yyp_guest_count")||"0"))}/{FREE_LIMIT}</span>
        </div>}
        {user&&usage&&<div className="upill">
          <span style={{color:curPlan==="premium"?"#f59e0b":"#94a3b8",fontWeight:700}}>{curPlan==="premium"?"💎 Premium":"🆓 Free"}</span>
          <span style={{color:"#334155"}}>|</span>
          <span style={{color:usage.remaining>0?"#10b981":"#ef4444",fontWeight:700}}>{curPlan==="premium"?usage.remaining+" left":usage.remaining+"/"+FREE_LIMIT+" today"}</span>
        </div>}
        <div className="navr">
          {curPlan==="free"&&<button className="upbtn" onClick={()=>setShowPrem(true)}>💎 ₹249</button>}
          <div className="avt" onClick={()=>setShowProfile(true)} style={{cursor:"pointer",boxShadow:"0 0 0 2px rgba(99,102,241,.5)"}} title="Profile">{user?.photo?<img src={user.photo} alt=""/>:user?.name?.[0]?.toUpperCase()||"U"}</div>
          <button className="xbtn" onClick={()=>setShowProfile(true)} style={{borderColor:"rgba(99,102,241,.3)",color:"#6366f1"}}>👤 Profile</button>
        </div>
      </nav>

      <div className="dc">
        <div className="hero">
          <div className="hbadge">✨ YYP AI — Universal Analyzer</div>
          <h1 className="htitle">Analyze Anything<br/><span className="grad">Powered by YesYouPro</span></h1>
          <p className="hsub">Products, apps, games, websites, channels, services — get deep AI insights for anything!</p>
        </div>

        {timer&&(curPlan==="free"||!user)&&<div className="tbox">
          <div className="ttitle">⏳ Daily Limit Reached</div>
          <div className="tsub">{user?"2 free analyses used. Reset in:":"2 guest analyses used. Login for more or wait:"}</div>
          <div className="trow">
            {[{v:String(timer.h).padStart(2,"0"),l:"Hours"},{sep:true},{v:String(timer.m).padStart(2,"0"),l:"Min"},{sep:true},{v:String(timer.s).padStart(2,"0"),l:"Sec"}].map((t,i)=>
              t.sep?<div key={i} className="tsep">:</div>:
              <div key={i} className="tunit"><div className="tnum">{t.v}</div><div className="tlbl">{t.l}</div></div>
            )}
          </div>
          <div className="tprog"><div className="tpf" style={{width:Math.max(0,100-(timer.total/86400000)*100)+"%"}}/></div>
          <div style={{marginTop:12,display:"flex",alignItems:"center",justifyContent:"center",gap:9,flexWrap:"wrap"}}>
            <span style={{color:"#64748b",fontSize:12}}>Don&apos;t want to wait?</span>
            {user?(
              <button onClick={()=>setShowPrem(true)} style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:100,padding:"7px 16px",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>💎 Get Premium ₹249</button>
            ):(
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>{setScreen("auth");setAuthMode("login");}} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:100,padding:"7px 14px",color:"#fff",fontWeight:800,fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>🔑 Login</button>
                <button onClick={()=>setShowPrem(true)} style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:100,padding:"7px 14px",color:"#fff",fontWeight:800,fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>💎 ₹249</button>
              </div>
            )}
          </div>
        </div>}

        {!user&&!timer&&(
          <div className="bnr-g" style={{background:"rgba(99,102,241,.06)",borderColor:"rgba(99,102,241,.2)"}}>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:"#a5b4fc"}}>👤 Guest Mode — {Math.max(0,FREE_LIMIT-parseInt(S.get("yyp_guest_count")||"0"))}/{FREE_LIMIT} Free Analyses</div>
              <div style={{fontSize:11,color:"#475569"}}>Login karo aur 2 analyses/day pao. Ya Premium buy karo!</div>
            </div>
            <button onClick={()=>{setScreen("auth");setAuthMode("signup");}} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:9,padding:"7px 12px",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"Inter,sans-serif"}}>🔑 Login</button>
          </div>
        )}
        {user&&curPlan==="free"&&!timer&&usage&&(
          usage.remaining>0?(
            <div className="bnr-g">
              <div>
                <div style={{fontWeight:700,fontSize:12,color:"#10b981"}}>✅ All Tools Unlocked — {usage.remaining} Analyses Remaining</div>
                <div style={{fontSize:11,color:"#475569"}}>All features available. Resets in 24hrs after limit.</div>
              </div>
            </div>
          ):(
            <div className="bnr-r">
              <div>
                <div style={{fontWeight:700,fontSize:12,color:"#ef4444"}}>🔒 Daily Limit Reached</div>
                <div style={{fontSize:11,color:"#64748b"}}>Upgrade for 30 analyses, no lockout & copy feature.</div>
              </div>
              <button onClick={()=>setShowPrem(true)} style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:9,padding:"7px 12px",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"Inter,sans-serif"}}>💎 ₹249</button>
            </div>
          )
        )}

        {/* INPUT */}
        <div className="icard">
          <h3 className="ict">🎯 Analyze Anything</h3>
          <div style={{marginBottom:16}}>
            <label className="ilbl" style={{display:"block",marginBottom:7}}>Name *</label>
            <input className="di" placeholder="e.g. Portable Blender, BGMI, YouTube Channel, SaaS Tool..." value={pf.name} onChange={e=>setPf({...pf,name:e.target.value})}/>
          </div>

          {/* CATEGORY PICKER */}
          <div style={{marginBottom:18}}>
            <label className="ilbl" style={{display:"block",marginBottom:8}}>Category *</label>
            <button onClick={()=>setShowCats(!showCats)} style={{
              width:"100%",background:pf.category?"linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))":"rgba(15,23,42,.7)",
              border:pf.category?"1px solid rgba(99,102,241,.4)":"1px solid #1e293b",
              borderRadius:11,padding:"11px 14px",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"space-between",
              color:pf.category?"#f8fafc":"#64748b",fontSize:13,fontWeight:600,
              fontFamily:"Inter,sans-serif",transition:"all .2s"
            }}>
              <span>{pf.category?CATS.find(c=>c.id===pf.category)?.icon+" "+pf.category:"Select Category"}</span>
              <span style={{fontSize:12,color:"#6366f1"}}>{showCats?"▲":"▼"}</span>
            </button>
            {showCats&&(
              <div style={{background:"rgba(10,18,40,.97)",border:"1px solid rgba(99,102,241,.2)",borderRadius:12,padding:"14px 12px",marginTop:6,animation:"fadeIn .2s ease"}}>
                {[{type:"p",label:"📦 Physical Products",color:"#10b981"},{type:"d",label:"💻 Digital & Virtual",color:"#a855f7"}].map(grp=>(
                  <div key={grp.type} style={{marginBottom:12}}>
                    <div style={{fontSize:10,color:grp.color,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>{grp.label}</div>
                    <div className="picker-chips">
                      {CATS.filter(c=>c.type===grp.type).map(c=>(
                        <button key={c.id} className={"pchip"+(pf.category===c.id?" on":"")}
                          style={pf.category===c.id?{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderColor:"#6366f1"}:{}}
                          onClick={()=>{setPf({...pf,category:c.id});setShowCats(false);}}>
                          <span>{c.icon}</span>{c.id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PLATFORM PICKER */}
          <div style={{marginBottom:6}}>
            <label className="ilbl" style={{display:"block",marginBottom:8}}>Platform *</label>
            <button onClick={()=>setShowPlats(!showPlats)} style={{
              width:"100%",background:pf.platform?(()=>{const pl=PLATS.find(p=>p.id===pf.platform);return pl?`linear-gradient(135deg,${pl.color}22,${pl.color}11)`:""})():"rgba(15,23,42,.7)",
              border:pf.platform?(()=>{const pl=PLATS.find(p=>p.id===pf.platform);return pl?`1px solid ${pl.color}66`:"1px solid #1e293b"})():"1px solid #1e293b",
              borderRadius:11,padding:"11px 14px",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"space-between",
              color:pf.platform?"#f8fafc":"#64748b",fontSize:13,fontWeight:600,
              fontFamily:"Inter,sans-serif",transition:"all .2s"
            }}>
              <span>{pf.platform?PLATS.find(p=>p.id===pf.platform)?.icon+" "+pf.platform:"Select Platform"}</span>
              <span style={{fontSize:12,color:"#6366f1"}}>{showPlats?"▲":"▼"}</span>
            </button>
            {showPlats&&(
              <div style={{background:"rgba(10,18,40,.97)",border:"1px solid rgba(99,102,241,.2)",borderRadius:12,padding:"14px 12px",marginTop:6,animation:"fadeIn .2s ease",maxHeight:380,overflowY:"auto"}}>
                {platGroups.map(grp=>{
                  const platsInGrp=PLATS.filter(p=>p.g===grp);
                  return(
                    <div key={grp} style={{marginBottom:12}}>
                      <div style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>{grp}</div>
                      <div className="picker-chips">
                        {platsInGrp.map(p=>(
                          <button key={p.id} className={"pchip"+(pf.platform===p.id?" on":"")}
                            style={pf.platform===p.id?{background:p.color,borderColor:p.color}:{}}
                            onClick={()=>{setPf({...pf,platform:p.id});setShowPlats(false);}}>
                            <span>{p.icon}</span>{p.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {err&&<div className="errbanner">{err}</div>}
          <button className="abtn" onClick={runAnalysis} disabled={loading||(!user&&!!timer)||(!!timer&&curPlan==="free")}>
            🚀 Get AI Analysis {(curPlan==="free"||!user)&&!timer&&<span className="anote">· Ad plays first</span>}
          </button>
        </div>

        {/* RESULTS */}
        {result&&<div className="fade-in" style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:9}}>
            <h2 style={{fontWeight:900,fontSize:19,color:"#f8fafc",margin:0}}>📊 <span className="grad">{pf.name}</span></h2>
            {curPlan==="premium"?(
              <button className="cpybtn" onClick={()=>{
                const rpt=["=== YESYOUPRO ANALYSIS ===","Product: "+pf.name,"Category: "+pf.category,"Platform: "+pf.platform,"","Viral Score: "+result.viral_score,"Demand: "+result.demand_level,"Competition: "+result.competition_level,"Price Range: "+result.price_range,"","Description:",""+result.description,"","Viral Hooks:",  ...(result.hooks||[]).map((h,i)=>(i+1)+". "+h),"","Keywords:",(result.keywords||[]).join(", "),"","Target Audience:",...(Array.isArray(result.target_audience)?result.target_audience:[result.target_audience||""]).map((a,i)=>(i+1)+". "+a),(result.monetization?"\nMonetization:\n"+result.monetization:""),"=== yesyoupro.com ==="].join("\n");
                copyText(rpt,"Full Report");
              }}>📋 Copy Full Report</button>
            ):(
              <div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)",borderRadius:8,padding:"5px 11px",fontSize:11,color:"#f59e0b",cursor:"pointer"}} onClick={()=>setShowPrem(true)}>🔒 Copy Report (Premium)</div>
            )}
          </div>

          {result.item_type&&<div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.3)",borderRadius:100,padding:"3px 12px",fontSize:11,color:"#a5b4fc",fontWeight:600,marginBottom:12}}>🏷️ {result.item_type}</div>}

          <div className="mrow">
            {[{l:"🔥 Viral Score",v:result.viral_score,c:"#f59e0b"},{l:"📈 Demand",v:result.demand_level,c:"#10b981"},{l:"⚔️ Competition",v:result.competition_level,c:"#ef4444"},{l:"💰 Price",v:result.price_range,c:"#6366f1"}].map(m=>(
              <div key={m.l} className="mcard"><div className="mlbl">{m.l}</div><div className="mval" style={{color:m.c,fontSize:m.v?.length>8?13:17}}>{m.v}</div></div>
            ))}
          </div>

          <div className="tcol">
            <div className="gcard">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                <h4 className="gct">📝 Description</h4>
                {curPlan==="premium"&&<button className="cpybtn" onClick={()=>copyText(result.description,"Description")}>📋</button>}
              </div>
              <p className="gctx">{result.description}</p>
            </div>
            <div className="gcard"><h4 className="gct" style={{marginBottom:9}}>🎯 Target Audience</h4>
              {Array.isArray(result.target_audience)?result.target_audience.map((a,i)=>(
                <div key={i} className="hitem"><span className="hnum">{i+1}</span><span style={{color:"#94a3b8",fontSize:12,lineHeight:1.6}}>{a}</span></div>
              )):<p className="gctx">{result.target_audience}</p>}
            </div>
          </div>

          <div className="gcard">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
              <h4 className="gct">🪝 Viral Hooks</h4>
              {curPlan==="premium"&&<button className="cpybtn" onClick={()=>copyText((result.hooks||[]).join("\n"),"All Hooks")}>📋 Copy All</button>}
            </div>
            {result.hooks?.map((h,i)=>(
              <div key={i} className="hitem" style={{justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:9,flex:1}}><span className="hnum">{i+1}</span><span>{h}</span></div>
                {curPlan==="premium"&&<button className="cpybtn" onClick={()=>copyText(h,"Hook "+(i+1))}>📋</button>}
              </div>
            ))}
          </div>

          <div className="gcard">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
              <h4 className="gct">🔑 Keywords</h4>
              {curPlan==="premium"&&<button className="cpybtn" onClick={()=>copyText((result.keywords||[]).join(", "),"Keywords")}>📋 Copy All</button>}
            </div>
            <div className="kwg">{result.keywords?.map((k,i)=>(
              <div key={i} className="kwc" onClick={()=>curPlan==="premium"&&copyText(k,k)} style={{cursor:curPlan==="premium"?"pointer":"default",display:"flex",gap:4,alignItems:"center"}}>
                {k}{curPlan==="premium"&&<span style={{fontSize:9,opacity:.6}}>📋</span>}
              </div>
            ))}</div>
          </div>

          {Array.isArray(result.best_platforms)&&result.best_platforms.length>0&&(
            <div className="gcard"><h4 className="gct" style={{marginBottom:9}}>🚀 Best Platforms</h4>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {result.best_platforms.map((p,i)=>(
                  <div key={i} style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",color:"#10b981",borderRadius:9,padding:"5px 12px",fontSize:12,fontWeight:600}}>✅ {p}</div>
                ))}
              </div>
            </div>
          )}

          {result.monetization&&(
            <div className="gcard">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                <h4 className="gct">💰 Monetization</h4>
                {curPlan==="premium"&&<button className="cpybtn" onClick={()=>copyText(result.monetization,"Monetization")}>📋</button>}
              </div>
              <p className="gctx">{result.monetization}</p>
            </div>
          )}

          {/* AD PLATFORMS */}
          <div className="psec">
            {isLocked&&<LockOv name="Run Ads + Publish Content"/>}
            <div className="psh">
              <div className="pst">📺 Run Ads + Publish Content</div>
              {isLocked&&<div className="pbadge">🔒</div>}
            </div>
            <p style={{color:"#64748b",fontSize:11,marginBottom:16}}>Complete ad strategy for every platform</p>
            <div className="pgrid">
              {AD_PLATS.map(p=>(
                <div key={p.id} className={"pplatbtn"+(selPlat===p.id?" on":"")} onClick={()=>fetchPlat(p.id)} style={{borderColor:selPlat===p.id?p.c:undefined}}>
                  {isLocked&&<div className="plk">🔒</div>}
                  <div className="plgo" dangerouslySetInnerHTML={{__html:p.svg}}/>
                  <div className="pnm">{p.n}</div>
                </div>
              ))}
            </div>
            {selPlat&&!isLocked&&<div className="pdet">
              {platLoad?<div style={{textAlign:"center",padding:18}}><div className="sp" style={{margin:"0 auto 9px"}}/><p style={{color:"#64748b",fontSize:12}}>Generating...</p></div>
              :platD[selPlat]?(()=>{
                try{
                  const d=platD[selPlat];
                  return(<>
                    {d.account_setup&&<div className="pdb"><div className="pdt">🏗️ Account Setup</div><div className="pdstps">{String(d.account_setup).split("\n").filter(s=>s.trim()).map((s,i)=><div key={i} className="pdstep"><span className="pdsn">{i+1}</span><span style={{flex:1}}>{s.replace(/^Step\s*\d+[:\s]*/i,"").trim()}</span></div>)}</div></div>}
                    {d.targeting&&<div className="pdb"><div className="pdt">🎯 Targeting</div><div className="pdtx">{d.targeting}</div></div>}
                    {Array.isArray(d.ad_keywords)&&d.ad_keywords.length>0&&<div className="pdb"><div className="pdt">🔑 Keywords</div><div className="pdch">{d.ad_keywords.map((k,i)=><div key={i} className="pdchip">{k}</div>)}</div></div>}
                    {d.script&&<div className="pdb">
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                        <div className="pdt" style={{margin:0}}>📝 Script</div>
                        {curPlan==="premium"&&<button className="cpybtn" onClick={()=>copyText(d.script,"Ad Script")}>📋</button>}
                      </div>
                      <div className="pdtx" style={{background:"rgba(99,102,241,.06)",padding:12,borderRadius:9,border:"1px solid rgba(99,102,241,.15)",lineHeight:1.75}}>{d.script}</div>
                    </div>}
                    {d.video_steps&&<div className="pdb"><div className="pdt">🎬 Video Steps</div><div className="pdstps">{String(d.video_steps).split("\n").filter(s=>s.trim()).map((s,i)=><div key={i} className="pdstep"><span className="pdsn">{i+1}</span><span style={{flex:1}}>{s.replace(/^Step\s*\d+[:\s]*/i,"").trim()}</span></div>)}</div></div>}
                    {(Array.isArray(d.titles)?d.titles:d.title?[d.title]:[]).length>0&&<div className="pdb"><div className="pdt">📌 Titles</div>{(Array.isArray(d.titles)?d.titles:[d.title]).map((t,i)=><div key={i} style={{background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.15)",borderRadius:8,padding:"8px 11px",marginBottom:5,color:"#e2e8f0",fontSize:12,fontWeight:600}}><span style={{color:"#6366f1",marginRight:7}}>#{i+1}</span>{t}</div>)}</div>}
                    {d.budget&&<div className="pdb"><div className="pdt">💰 Budget</div><div className="pdtx">{d.budget}</div></div>}
                  </>);
                }catch{return<div style={{color:"#ef4444",textAlign:"center",padding:14,fontSize:12}}>Display error. Try again.</div>;}
              })():null}
            </div>}
          </div>
        </div>}

        {/* FEATURE TABS */}
        <div className="ftabs-w">
          <div className="fgrplbl" style={{color:"#64748b"}}>🆓 Free Tools</div>
          <div className="ftabs"><button className={"ftab"+(tab==="profit"?" on":"")} onClick={()=>setTab("profit")}>💰 Profit Calculator</button></div>
          <div className="fgrplbl" style={{color:isLocked?"#ef4444":"#10b981"}}>{isLocked?"🔒 Locked (Limit Reached)":"✅ All Tools (Unlocked)"}</div>
          <div className="ftabs">
            {[{id:"starter",l:"🎓 Starter Guide"},{id:"beginner",l:"🔰 Beginner Products"},{id:"investment",l:"🧮 Investment Calc"},{id:"description",l:"📝 Description"},{id:"trending",l:"🔥 Trending"},{id:"competitor",l:"⚔️ Competitor"},{id:"supplier",l:"📦 Supplier"},{id:"sales",l:"📊 Sales Estimator"},{id:"price",l:"🏷️ Price Optimizer"},{id:"inventory",l:"📦 Inventory"},{id:"review",l:"⭐ Reviews"},{id:"niche",l:"🎯 Niche Finder"}].map(t=>(
              <button key={t.id} className={"ftab"+(tab===t.id?" on":"")} onClick={()=>{if(isLocked){setShowPrem(true);return;}setTab(t.id);}}>
                {t.l}{isLocked&&" 🔒"}
              </button>
            ))}
          </div>
        </div>

        {/* PROFIT CALC - FREE */}
        {tab==="profit"&&<div className="fbox fade-in">
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>💰 Profit Calculator</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Calculate exact profit, margin & ROI</p>
          <div className="prow">
            {[{l:"Buy Price (₹)",k:"buy"},{l:"Sell Price (₹)",k:"sell"},{l:"Units",k:"units"},{l:"Platform Fee %",k:"fee"},{l:"Shipping (₹)",k:"ship"},{l:"Ad Budget (₹)",k:"ads"}].map(f=>(
              <div key={f.k} className="pfield"><label>{f.l}</label><input type="number" placeholder="0" value={profF[f.k]} onChange={e=>setProfF({...profF,[f.k]:e.target.value})}/></div>
            ))}
          </div>
          <button className="cbtn" onClick={calcProf}>📊 Calculate</button>
          {profR&&<div className="presult">
            {[{l:"Net Profit",v:"₹"+profR.profit,c:parseFloat(profR.profit)>0?"#10b981":"#ef4444"},{l:"Per Unit",v:"₹"+profR.netPer,c:"#a5b4fc"},{l:"ROI",v:profR.roi+"%",c:"#f59e0b"},{l:"Margin",v:profR.margin+"%",c:"#6366f1"},{l:"Revenue",v:"₹"+profR.revenue,c:"#10b981"},{l:"Break Even",v:profR.be+" units",c:"#94a3b8"}].map(r=>(
              <div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c}}>{r.v}</div></div>
            ))}
          </div>}
        </div>}

        {/* STARTER GUIDE */}
        {tab==="starter"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Starter Guide"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>🎓 Ecommerce Starter Guide</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Personalized step-by-step plan for your budget</p>
          <div className="prow">
            <div className="pfield"><label>Budget (₹)</label><input type="number" placeholder="5000" value={starF.budget} onChange={e=>setStarF({...starF,budget:e.target.value})}/></div>
            <div className="pfield"><label>Experience</label>
              <select value={starF.exp} onChange={e=>setStarF({...starF,exp:e.target.value})}>
                <option value="beginner">Beginner</option><option value="some">Some Exp</option><option value="intermediate">Intermediate</option>
              </select>
            </div>
          </div>
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}} onClick={async()=>{setStarL(true);try{const d=await api("starter_guide",{budget:starF.budget,experience:starF.exp});setStarD(d);}catch{}setStarL(false);}} disabled={starL}>{starL?"⏳ Generating...":"🎓 Generate Guide"}</button>
          {starL&&<div className="sm-sp"/>}
          {starD&&!starL&&<div style={{marginTop:16}} className="fade-in">
            {starD.platform_recommendation&&<div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:11,padding:13,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:13,color:"#10b981",marginBottom:3}}>✅ Best Platform: {starD.platform_recommendation.name}</div>
              <div style={{color:"#94a3b8",fontSize:12,marginBottom:2}}>{starD.platform_recommendation.why}</div>
              <div style={{color:"#f59e0b",fontSize:11,fontWeight:600}}>Commission: {starD.platform_recommendation.commission} · {starD.platform_recommendation.difficulty}</div>
            </div>}
            {starD.steps?.map((s,i)=>(
              <div key={i} className="cc" style={{marginBottom:9}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:6}}>
                  <div style={{width:28,height:28,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#fff",flexShrink:0}}>{s.step}</div>
                  <div style={{fontWeight:700,fontSize:13,color:"#e2e8f0"}}>{s.title}</div>
                </div>
                <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.6,marginBottom:6}}>{s.description}</div>
                <div style={{display:"flex",gap:6}}><span style={{background:"rgba(99,102,241,.1)",color:"#a5b4fc",borderRadius:6,padding:"2px 8px",fontSize:10}}>⏱ {s.time}</span><span style={{background:"rgba(16,185,129,.1)",color:"#10b981",borderRadius:6,padding:"2px 8px",fontSize:10}}>💰 {s.cost}</span></div>
              </div>
            ))}
            {starD.mistakes?.length>0&&<div style={{background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)",borderRadius:11,padding:12}}>
              <div style={{fontWeight:700,color:"#ef4444",marginBottom:6,fontSize:12}}>⚠️ Avoid These Mistakes:</div>
              {starD.mistakes.map((m,i)=><div key={i} style={{color:"#94a3b8",fontSize:12,padding:"2px 0",display:"flex",gap:6}}><span>❌</span><span>{m}</span></div>)}
            </div>}
          </div>}
        </div>}

        {/* BEGINNER PRODUCTS */}
        {tab==="beginner"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Beginner Product Finder"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>🔰 Beginner Product Finder</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Low risk, high profit products for beginners</p>
          <div className="prow">
            <div className="pfield"><label>Budget (₹)</label><input type="number" placeholder="5000" value={begF.budget} onChange={e=>setBegF({...begF,budget:e.target.value})}/></div>
            <div className="pfield"><label>Category</label>
              <select value={begF.category} onChange={e=>setBegF({...begF,category:e.target.value})}>
                {["Fashion","Electronics","Beauty & Skincare","Home & Kitchen","Fitness","Digital Products","Online Courses","Any Other"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#10b981,#059669)"}} onClick={async()=>{setBegL(true);try{const d=await api("beginner_product",begF);setBegD(d);}catch{}setBegL(false);}} disabled={begL}>{begL?"⏳ Finding...":"🔰 Find Products"}</button>
          {begL&&<div className="sm-sp"/>}
          {begD&&!begL&&<div style={{marginTop:16}} className="fade-in">
            {begD.products?.map((p,i)=>(
              <div key={i} className="cc" style={{marginBottom:9}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:5}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#e2e8f0"}}>#{i+1} {p.name}</div>
                  <div style={{display:"flex",gap:4}}>
                    <span style={{background:p.risk==="Low"?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)",color:p.risk==="Low"?"#10b981":"#f59e0b",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:600}}>Risk: {p.risk}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:7}}>
                  <span style={{color:"#ef4444",fontSize:12,fontWeight:600}}>Buy: {p.buy_price}</span>
                  <span style={{color:"#94a3b8"}}>→</span>
                  <span style={{color:"#10b981",fontSize:12,fontWeight:600}}>Sell: {p.sell_price}</span>
                  <span style={{color:"#f59e0b",fontSize:12,fontWeight:700}}>💰 {p.profit_per_unit}</span>
                </div>
                <div style={{color:"#94a3b8",fontSize:11,marginBottom:6}}>{p.why_good}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  <span style={{background:"rgba(99,102,241,.1)",color:"#a5b4fc",borderRadius:6,padding:"2px 8px",fontSize:10}}>📦 {p.platform}</span>
                  <span style={{background:"rgba(16,185,129,.1)",color:"#10b981",borderRadius:6,padding:"2px 8px",fontSize:10}}>🏭 {p.suppliers}</span>
                </div>
              </div>
            ))}
          </div>}
        </div>}

        {/* INVESTMENT CALC */}
        {tab==="investment"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Investment Calculator"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>🧮 Investment Calculator</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Full ROI with platform fees & shipping</p>
          <div className="prow">
            {[{l:"Buy Price (₹)",k:"buy"},{l:"Sell Price (₹)",k:"sell"},{l:"Units",k:"units"},{l:"Platform Fee %",k:"fee"},{l:"Shipping (₹)",k:"ship"},{l:"Ad Budget (₹)",k:"ads"}].map(f=>(
              <div key={f.k} className="pfield"><label>{f.l}</label><input type="number" placeholder="0" value={invF[f.k]} onChange={e=>setInvF({...invF,[f.k]:e.target.value})}/></div>
            ))}
          </div>
          <button className="cbtn" style={{width:"100%"}} onClick={calcInvest}>🧮 Calculate</button>
          {invR&&<div className="presult">
            {[{l:"Total Profit",v:"₹"+invR.profit,c:parseFloat(invR.profit)>0?"#10b981":"#ef4444"},{l:"Per Unit",v:"₹"+invR.netPer,c:"#a5b4fc"},{l:"ROI",v:invR.roi+"%",c:"#f59e0b"},{l:"Margin",v:invR.margin+"%",c:"#6366f1"},{l:"Investment",v:"₹"+invR.cost,c:"#94a3b8"},{l:"Break Even",v:invR.be+" units",c:"#94a3b8"}].map(r=>(
              <div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c}}>{r.v}</div></div>
            ))}
          </div>}
        </div>}

        {/* DESCRIPTION */}
        {tab==="description"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Description Generator"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>📝 Description Generator</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>SEO listings for Amazon, Meesho, Flipkart & Instagram</p>
          {!pf.name&&<div className="errbanner">⚠️ Run product analysis first</div>}
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#6366f1,#a855f7)"}} onClick={async()=>{setDescL(true);try{const d=await api("description");setDescD(d);}catch{}setDescL(false);}} disabled={descL||!pf.name}>{descL?"⏳ Generating...":"✨ Generate Descriptions"}</button>
          {descL&&<div className="sm-sp"/>}
          {descD&&!descL&&<div style={{marginTop:16}} className="fade-in">
            {descD.listings?.map((l,i)=>(
              <div key={i} style={{background:"rgba(2,8,23,.5)",border:"1px solid #1e293b",borderRadius:11,padding:14,marginBottom:9}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"inline-block",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:100}}>{l.platform}</div>
                  {curPlan==="premium"&&<button className="cpybtn" onClick={()=>copyText([l.title,l.description,...(l.bullets||[])].join("\n"),l.platform+" Listing")}>📋 Copy</button>}
                </div>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>📌 {l.title}</div>
                <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.7,marginBottom:6}}>{l.description}</div>
                {l.bullets&&<div>{l.bullets.map((b,j)=><div key={j} style={{color:"#a5b4fc",fontSize:11,display:"flex",gap:6,marginBottom:3}}><span>✅</span><span>{b}</span></div>)}</div>}
              </div>
            ))}
          </div>}
        </div>}

        {/* TRENDING */}
        {tab==="trending"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Trending Products"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>🔥 Trending Products</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Top trending in Indian market right now</p>
          <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:12}}>
            <select className="di" style={{flex:1,minWidth:140}} value={trendCat} onChange={e=>setTrendCat(e.target.value)}>
              {CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.id}</option>)}
            </select>
            <button className="cbtn" onClick={async()=>{setTrendL(true);try{const d=await api("trending",{category:trendCat});setTrendD(d);}catch{}setTrendL(false);}} disabled={trendL}>{trendL?"⏳":"🔥 Get Trending"}</button>
          </div>
          {trendL&&<div className="sm-sp"/>}
          {trendD&&!trendL&&<div className="tgrid fade-in">
            {trendD.products?.map((p,i)=>(
              <div key={i} className="tcard">
                <div className="trnk">{i+1}</div>
                <div style={{fontWeight:700,fontSize:12,color:"#e2e8f0",marginBottom:4}}>{p.name}</div>
                <div style={{color:"#64748b",fontSize:11,marginBottom:7,lineHeight:1.5}}>{p.why_trending}</div>
                <div style={{color:"#f59e0b",fontSize:11,fontWeight:600,marginBottom:6}}>💰 {p.price_range}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{p.tags?.map((t,j)=><span key={j} className="tc">{t}</span>)}</div>
              </div>
            ))}
          </div>}
        </div>}

        {/* COMPETITOR */}
        {tab==="competitor"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Competitor Analysis"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>⚔️ Competitor Analysis</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Top 4 competitors — prices, strengths & weaknesses</p>
          {!pf.name&&<div className="errbanner">⚠️ Run product analysis first</div>}
          <button className="cbtn" onClick={async()=>{setCompL(true);try{const d=await api("competitor");setCompD(d);}catch{}setCompL(false);}} disabled={compL||!pf.name}>{compL?"⏳ Analyzing...":"🔍 Analyze Competitors"}</button>
          {compL&&<div className="sm-sp"/>}
          {compD&&!compL&&<div style={{marginTop:16}} className="fade-in">
            {compD.competitors?.map((c,i)=>(
              <div key={i} className="cc">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#e2e8f0"}}>🏪 {c.name}</div>
                  <div style={{display:"flex",gap:5}}>
                    <span style={{background:"rgba(245,158,11,.1)",color:"#f59e0b",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>{c.price}</span>
                    <span style={{color:"#64748b",fontSize:11}}>⭐ {c.rating}</span>
                  </div>
                </div>
                <div className="ccrow">
                  <div className="ccbox"><div className="ccbt" style={{color:"#10b981"}}>✅ Strengths</div>{c.strengths?.map((s,j)=><div key={j} className="cpt"><span style={{color:"#10b981"}}>+</span><span>{s}</span></div>)}</div>
                  <div className="ccbox"><div className="ccbt" style={{color:"#ef4444"}}>❌ Weaknesses</div>{c.weaknesses?.map((w,j)=><div key={j} className="cpt"><span style={{color:"#ef4444"}}>-</span><span>{w}</span></div>)}</div>
                </div>
                {c.opportunity&&<div style={{marginTop:9,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:8,padding:"8px 11px",color:"#a5b4fc",fontSize:11}}>💡 {c.opportunity}</div>}
              </div>
            ))}
          </div>}
        </div>}

        {/* SUPPLIER */}
        {tab==="supplier"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Supplier Finder"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>📦 Supplier Finder</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Best suppliers with price, MOQ & tips</p>
          {!pf.name&&<div className="errbanner">⚠️ Run product analysis first</div>}
          <button className="cbtn" style={{background:"linear-gradient(135deg,#10b981,#059669)"}} onClick={async()=>{setSuppL(true);try{const d=await api("supplier");setSuppD(d);}catch{}setSuppL(false);}} disabled={suppL||!pf.name}>{suppL?"⏳ Finding...":"🔍 Find Suppliers"}</button>
          {suppL&&<div className="sm-sp"/>}
          {suppD&&!suppL&&<div style={{marginTop:16}} className="fade-in">
            {suppD.suppliers?.map((s,i)=>(
              <div key={i} className="sc">
                <div style={{fontWeight:700,fontSize:13,color:"#e2e8f0",marginBottom:6}}>🏭 {s.name}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
                  <span className="schip">💰 {s.price_range}</span>
                  <span className="schip">📦 MOQ: {s.moq}</span>
                  <span className="schip">⭐ {s.rating}</span>
                  <span className="schip">🚚 {s.delivery}</span>
                </div>
                <div style={{color:"#94a3b8",fontSize:11,marginBottom:6}}>{s.description}</div>
                {s.tip&&<div style={{background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.2)",borderRadius:8,padding:"6px 10px",color:"#f59e0b",fontSize:11,marginBottom:6}}>💡 {s.tip}</div>}
                <a className="slink" href={s.search_url||"#"} target="_blank" rel="noreferrer">🔗 Search on {s.platform}</a>
              </div>
            ))}
          </div>}
        </div>}

        {/* SALES ESTIMATOR */}
        {tab==="sales"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Sales Estimator"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>📊 Sales Estimator</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Monthly sales & revenue forecast</p>
          {!pf.name&&<div className="errbanner">⚠️ Run product analysis first</div>}
          <button className="cbtn" onClick={async()=>{setSalesL(true);try{const d=await api("sales_estimator");setSalesD(d);}catch{}setSalesL(false);}} disabled={salesL||!pf.name}>{salesL?"⏳ Estimating...":"📊 Estimate Sales"}</button>
          {salesL&&<div className="sm-sp"/>}
          {salesD&&!salesL&&<div style={{marginTop:16}} className="fade-in">
            <div className="presult" style={{marginBottom:12}}>
              {[{l:"Low Units",v:(salesD.monthly_units?.low||0)+" units",c:"#ef4444"},{l:"Avg Units",v:(salesD.monthly_units?.medium||0)+" units",c:"#f59e0b"},{l:"High Units",v:(salesD.monthly_units?.high||0)+" units",c:"#10b981"}].map(r=><div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c,fontSize:16}}>{r.v}</div></div>)}
            </div>
            <div className="presult" style={{marginBottom:12}}>
              {[{l:"Low Revenue",v:salesD.monthly_revenue?.low,c:"#ef4444"},{l:"Avg Revenue",v:salesD.monthly_revenue?.medium,c:"#f59e0b"},{l:"High Revenue",v:salesD.monthly_revenue?.high,c:"#10b981"}].map(r=><div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c,fontSize:14}}>{r.v}</div></div>)}
            </div>
            {salesD.best_months?.length>0&&<div className="gcard" style={{marginBottom:9}}><div className="gct" style={{marginBottom:7}}>🌟 Best Months</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{salesD.best_months.map((m,i)=><span key={i} className="tc">{m}</span>)}</div></div>}
            {salesD.tips?.length>0&&<div className="gcard"><div className="gct" style={{marginBottom:7}}>💡 Tips</div>{salesD.tips.map((t,i)=><div key={i} style={{color:"#94a3b8",fontSize:11,padding:"3px 0",display:"flex",gap:6}}><span style={{color:"#10b981"}}>✓</span><span>{t}</span></div>)}</div>}
          </div>}
        </div>}

        {/* PRICE OPTIMIZER */}
        {tab==="price"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Price Optimizer"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>🏷️ Price Optimizer</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Find the perfect price to maximize profit</p>
          {!pf.name&&<div className="errbanner">⚠️ Run product analysis first</div>}
          <button className="cbtn" style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)"}} onClick={async()=>{setPriceL(true);try{const d=await api("price_optimizer");setPriceD(d);}catch{}setPriceL(false);}} disabled={priceL||!pf.name}>{priceL?"⏳ Optimizing...":"🏷️ Optimize Price"}</button>
          {priceL&&<div className="sm-sp"/>}
          {priceD&&!priceL&&<div style={{marginTop:16}} className="fade-in">
            <div style={{background:"linear-gradient(135deg,rgba(16,185,129,.1),rgba(6,95,70,.1))",border:"1px solid rgba(16,185,129,.3)",borderRadius:13,padding:16,textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:11,color:"#64748b",marginBottom:2}}>Recommended Price</div>
              <div style={{fontSize:30,fontWeight:900,color:"#10b981"}}>{priceD.recommended_price}</div>
              <div style={{fontSize:10,color:"#475569",marginTop:2}}>Sweet spot: {priceD.price_range?.sweet_spot}</div>
            </div>
            {priceD.competitor_prices?.length>0&&<div className="gcard" style={{marginBottom:9}}>
              <div className="gct" style={{marginBottom:7}}>⚔️ Competitor Prices</div>
              {priceD.competitor_prices.map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.05)",color:"#94a3b8",fontSize:12}}><span>{c.seller}</span><span style={{color:"#f59e0b",fontWeight:600}}>{c.price}</span></div>)}
            </div>}
            {priceD.psychological_tricks?.length>0&&<div className="gcard">
              <div className="gct" style={{marginBottom:7}}>🧠 Pricing Tips</div>
              {priceD.psychological_tricks.map((t,i)=><div key={i} style={{color:"#94a3b8",fontSize:11,padding:"2px 0",display:"flex",gap:6}}><span style={{color:"#a5b4fc"}}>→</span><span>{t}</span></div>)}
            </div>}
          </div>}
        </div>}

        {/* INVENTORY */}
        {tab==="inventory"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Inventory Calculator"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>📦 Inventory Calculator</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>Plan stock to never overstock or run out</p>
          {!pf.name&&<div className="errbanner">⚠️ Run product analysis first</div>}
          <div className="prow"><div className="pfield"><label>Starting Units</label><input type="number" placeholder="50" value={invtF.units} onChange={e=>setInvtF({units:e.target.value})}/></div></div>
          <button className="gbtn2" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}} onClick={async()=>{setInvtL(true);try{const d=await api("inventory",{units:invtF.units});setInvtD(d);}catch{}setInvtL(false);}} disabled={invtL||!pf.name}>{invtL?"⏳ Calculating...":"📦 Calculate Inventory"}</button>
          {invtL&&<div className="sm-sp"/>}
          {invtD&&!invtL&&<div style={{marginTop:16}} className="fade-in">
            <div className="presult" style={{marginBottom:12}}>
              {[{l:"Starter Stock",v:invtD.recommended_stock?.starter,c:"#10b981"},{l:"Safe Stock",v:invtD.recommended_stock?.safe,c:"#f59e0b"},{l:"Reorder At",v:invtD.reorder_point,c:"#ef4444"}].map(r=><div key={r.l} className="prc"><div className="prl">{r.l}</div><div className="prv" style={{color:r.c,fontSize:13}}>{r.v}</div></div>)}
            </div>
            <div className="gcard" style={{marginBottom:9}}><div className="gct" style={{marginBottom:7}}>📋 Info</div>
              <div style={{color:"#94a3b8",fontSize:12}}><span style={{color:"#f59e0b"}}>Cost: </span>{invtD.storage_cost}</div>
              <div style={{color:"#94a3b8",fontSize:12,marginTop:3}}><span style={{color:"#a5b4fc"}}>Duration: </span>{invtD.turnover_days}</div>
              <div style={{color:"#94a3b8",fontSize:12,marginTop:3}}><span style={{color:"#ef4444"}}>Risk: </span>{invtD.risk}</div>
            </div>
            {invtD.tips?.length>0&&<div className="gcard"><div className="gct" style={{marginBottom:7}}>💡 Tips</div>{invtD.tips.map((t,i)=><div key={i} style={{color:"#94a3b8",fontSize:11,padding:"2px 0",display:"flex",gap:6}}><span style={{color:"#10b981"}}>✓</span><span>{t}</span></div>)}</div>}
          </div>}
        </div>}

        {/* REVIEW ANALYZER */}
        {tab==="review"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Review Analyzer"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>⭐ Review Analyzer</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>What customers love & hate about similar products</p>
          {!pf.name&&<div className="errbanner">⚠️ Run product analysis first</div>}
          <button className="cbtn" style={{background:"linear-gradient(135deg,#f59e0b,#f97316)"}} onClick={async()=>{setRevL(true);try{const d=await api("review_analyzer");setRevD(d);}catch{}setRevL(false);}} disabled={revL||!pf.name}>{revL?"⏳ Analyzing...":"⭐ Analyze Reviews"}</button>
          {revL&&<div className="sm-sp"/>}
          {revD&&!revL&&<div style={{marginTop:16}} className="fade-in">
            <div style={{background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:11,padding:13,textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:11,color:"#64748b"}}>Sentiment Score</div>
              <div style={{fontSize:26,fontWeight:900,color:"#6366f1"}}>{revD.sentiment_score}</div>
            </div>
            <div className="ccrow" style={{marginBottom:9}}>
              <div className="ccbox"><div className="ccbt" style={{color:"#10b981"}}>❤️ Love</div>{revD.what_customers_love?.map((l,i)=><div key={i} className="cpt"><span style={{color:"#10b981"}}>+</span><span>{l}</span></div>)}</div>
              <div className="ccbox"><div className="ccbt" style={{color:"#ef4444"}}>😠 Hate</div>{revD.common_complaints?.map((c,i)=><div key={i} className="cpt"><span style={{color:"#ef4444"}}>-</span><span>{c}</span></div>)}</div>
            </div>
            {revD.opportunities?.length>0&&<div className="gcard" style={{marginBottom:9}}><div className="gct" style={{marginBottom:7}}>💡 Opportunities</div>{revD.opportunities.map((o,i)=><div key={i} style={{color:"#94a3b8",fontSize:11,padding:"2px 0",display:"flex",gap:6}}><span style={{color:"#a5b4fc"}}>→</span><span>{o}</span></div>)}</div>}
            {revD.product_improvements?.length>0&&<div className="gcard"><div className="gct" style={{marginBottom:7}}>🔧 Improvements</div>{revD.product_improvements.map((p,i)=><div key={i} style={{color:"#94a3b8",fontSize:11,padding:"2px 0",display:"flex",gap:6}}><span style={{color:"#f59e0b"}}>✦</span><span>{p}</span></div>)}</div>}
          </div>}
        </div>}

        {/* NICHE FINDER */}
        {tab==="niche"&&<div className="fbox fade-in">
          {isLocked&&<LockOv name="Niche Finder"/>}
          <h3 style={{fontWeight:800,fontSize:16,marginBottom:4,color:"#f8fafc"}}>🎯 Niche Finder</h3>
          <p style={{color:"#64748b",fontSize:11,marginBottom:14}}>6 untapped profitable niches in Indian market</p>
          <button className="cbtn" style={{background:"linear-gradient(135deg,#a855f7,#7c3aed)"}} onClick={async()=>{setNicheL(true);try{const d=await api("niche_finder");setNicheD(d);}catch{}setNicheL(false);}} disabled={nicheL}>{nicheL?"⏳ Finding...":"🎯 Find Niches"}</button>
          {nicheL&&<div className="sm-sp"/>}
          {nicheD&&!nicheL&&<div className="tgrid fade-in" style={{marginTop:16}}>
            {nicheD.niches?.map((n,i)=>(
              <div key={i} className="tcard">
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <div className="trnk">{i+1}</div>
                  <div style={{fontWeight:700,fontSize:12,color:"#e2e8f0"}}>{n.name}</div>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                  <span style={{background:"rgba(16,185,129,.1)",color:"#10b981",borderRadius:5,padding:"1px 6px",fontSize:9,fontWeight:600}}>Comp: {n.competition}</span>
                  <span style={{background:"rgba(245,158,11,.1)",color:"#f59e0b",borderRadius:5,padding:"1px 6px",fontSize:9,fontWeight:600}}>Margin: {n.profit_margin}</span>
                </div>
                <div style={{color:"#64748b",fontSize:11,marginBottom:6,lineHeight:1.5}}>{n.why_untapped}</div>
                <div style={{color:"#a5b4fc",fontSize:10,marginBottom:5}}>💰 {n.investment}</div>
                <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{n.example_products?.map((p,j)=><span key={j} className="tc">{p}</span>)}</div>
                <div style={{marginTop:6,fontSize:10,color:n.trend==="Growing"?"#10b981":"#f59e0b",fontWeight:600}}>📈 {n.trend}</div>
              </div>
            ))}
          </div>}
        </div>}

      </div>
      <footer>
        <div style={{marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
          <a href="/privacy" style={{color:"#475569",fontSize:12,textDecoration:"none"}}>Privacy Policy</a>
          <span style={{color:"#1e293b"}}>·</span>
          <a href="https://instagram.com/yesyoupro" target="_blank" rel="noreferrer" style={{color:"#475569",fontSize:12,textDecoration:"none"}}>📸 Instagram</a>
          <span style={{color:"#1e293b"}}>·</span>
          <span style={{color:"#475569",fontSize:12}}>support@yesyoupro.com</span>
        </div>
        <div style={{color:"#334155",fontSize:11}}>🧠 YesYouPro · AI Product Analyzer · © 2025</div>
      </footer>
    </div>}
  </>);
}
