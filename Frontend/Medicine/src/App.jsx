import { useState, useEffect, useCallback } from "react";
import logo from "/src/assets/logo.png";

const API = "http://localhost:8000/api";
const get = (url) => fetch(API + url).then(r => r.json());
const post = (url, body) =>
  fetch(API + url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const postForm = (url, fd) =>
  fetch(API + url, { method: "POST", body: fd }).then(r => r.json());

// ── Responsive hook ───────────────────────────────────────────────────────────
const useResponsive = () => {
  const mobileQ = window.matchMedia("(max-width: 767px)");
  const tabletQ = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");

  const [isMobile, setIsMobile] = useState(mobileQ.matches);
  const [isTablet, setIsTablet] = useState(tabletQ.matches);

  useEffect(() => {
    // force sync on mount
    setIsMobile(mobileQ.matches);
    setIsTablet(tabletQ.matches);

    const onMobile = (e) => setIsMobile(e.matches);
    const onTablet = (e) => setIsTablet(e.matches);

    mobileQ.addEventListener("change", onMobile);
    tabletQ.addEventListener("change", onTablet);
    return () => {
      mobileQ.removeEventListener("change", onMobile);
      tabletQ.removeEventListener("change", onTablet);
    };
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home:    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    cart:    <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
    pill:    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Zm-7-7 7-7"/>,
    doc:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    steth:   <><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></>,
    truck:   <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    search:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus:   <line x1="5" y1="12" x2="19" y2="12"/>,
    trash:   <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    check:   <polyline points="20 6 9 17 4 12"/>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    upload:  <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    star:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    back:    <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    rx:      <><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    order:   <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    logout:  <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    menu:    <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    chevron: <polyline points="9 18 15 12 9 6"/>,
    bell:    <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    heart:   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ toasts, remove }) => {
  const { isMobile } = useResponsive();
  return (
    <div style={{ position:"fixed", bottom: isMobile ? 90 : 24, right:16, left: isMobile ? 16 : "auto", zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type==="error"?"#ff4757":t.type==="success"?"#00b894":"#2d3436",
          color:"#fff", padding:"14px 16px", borderRadius:14,
          boxShadow:"0 8px 32px rgba(0,0,0,.2)", display:"flex", alignItems:"center", gap:10,
          animation:"slideIn .3s ease", backdropFilter:"blur(10px)"
        }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name={t.type==="error"?"x":"check"} size={14}/>
          </div>
          <span style={{ flex:1, fontSize:14, fontWeight:500 }}>{t.msg}</span>
          <button onClick={()=>remove(t.id)} style={{ background:"rgba(255,255,255,.2)",border:"none",color:"#fff",cursor:"pointer", borderRadius:6, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={12}/>
          </button>
        </div>
      ))}
    </div>
  );
};

// ── User Setup Modal ──────────────────────────────────────────────────────────
const UserModal = ({ onSave }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const inp = { width:"100%", padding:"13px 16px", border:"2px solid #e8ecf0", borderRadius:12, fontSize:15, outline:"none", boxSizing:"border-box", transition:"border-color .2s", background:"#f8fafc" };
  return (
    <div style={{ position:"fixed", inset:0, background:"linear-gradient(135deg,#00b894cc,#0984e3cc)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10000, padding:20 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:36, width:"100%", maxWidth:400, boxShadow:"0 32px 80px rgba(0,0,0,.25)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ margin:"0 auto 16px", width:90, height:90 }}>
            <img src={logo} alt="Mediova" style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
          </div>
          <h2 style={{ fontSize:26, fontWeight:800, color:"#1a1a2e", margin:"0 0 8px" }}>Welcome to Mediova</h2>
          <p style={{ color:"#8892a4", fontSize:14, margin:0 }}>Medicines delivered at your doorstep 💊</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#4a5568", display:"block", marginBottom:6, letterSpacing:.3 }}>FULL NAME</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name"
              style={inp} onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#4a5568", display:"block", marginBottom:6, letterSpacing:.3 }}>PHONE NUMBER</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="10-digit mobile number" type="tel"
              style={inp} onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
          </div>
          <button onClick={()=>name&&phone&&onSave(name,phone)}
            style={{ background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", border:"none", borderRadius:14, padding:16, fontSize:16, fontWeight:700, cursor:"pointer", marginTop:8, boxShadow:"0 6px 20px #00b89440", transition:"transform .15s, box-shadow .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 28px #00b89450"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 6px 20px #00b89440"}}>
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Mobile Side Drawer ────────────────────────────────────────────────────────
const MobileDrawer = ({ open, onClose, page, setPage, userName, userPhone, cartCount, onLogout }) => {
  const nav = [
    { id:"home",         label:"Home",         icon:"home",  desc:"Dashboard & Offers" },
    { id:"medicines",    label:"Medicines",     icon:"pill",  desc:"Buy medicines online" },
    { id:"prescription", label:"Prescription",  icon:"rx",    desc:"Upload & track Rx" },
    { id:"consult",      label:"Consult Doctor",icon:"steth", desc:"Book appointments" },
    { id:"orders",       label:"My Orders",     icon:"truck", desc:"Track deliveries" },
    { id:"cart",         label:"My Cart",       icon:"cart",  desc:"View cart items" },
  ];

  const goto = (id) => { setPage(id); onClose(); };
  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:2000,
        opacity: open?1:0, pointerEvents: open?"all":"none",
        transition:"opacity .3s ease", backdropFilter:"blur(4px)"
      }}/>
      {/* Drawer */}
      <div style={{
        position:"fixed", top:0, left:0, bottom:0, width:300, background:"#fff",
        zIndex:2001, transform: open?"translateX(0)":"translateX(-100%)",
        transition:"transform .32s cubic-bezier(.4,0,.2,1)",
        display:"flex", flexDirection:"column", overflow:"hidden",
        boxShadow: open?"8px 0 40px rgba(0,0,0,.18)":"none"
      }}>
        {/* Header / User Profile */}
        <div style={{ background:"linear-gradient(135deg,#00b894,#0984e3)", padding:"48px 24px 28px", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,.2)", border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
            <Icon name="x" size={18} color="#fff"/>
          </button>
          {/* Avatar */}
          <div style={{ margin:"0 auto 14px", width:72, height:72 }}>
            <img src={logo} alt="Mediova" style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
          </div>
          <h3 style={{ margin:"0 0 4px", fontSize:18, fontWeight:800, color:"#fff" }}>Mediova</h3>
          <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,.75)", display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="bell" size={12} color="rgba(255,255,255,.75)"/> {userPhone}
          </p>
          {/* Cart badge in header */}
          {cartCount > 0 && (
            <div onClick={()=>goto("cart")} style={{ marginTop:14, display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", borderRadius:10, padding:"8px 14px", cursor:"pointer" }}>
              <Icon name="cart" size={16} color="#fff"/>
              <span style={{ fontSize:13, color:"#fff", fontWeight:700 }}>{cartCount} item{cartCount>1?"s":""} in cart</span>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 12px" }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#b2bec3", letterSpacing:1.2, padding:"0 12px", marginBottom:8 }}>NAVIGATION</p>
          {nav.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={()=>goto(n.id)} style={{
                display:"flex", alignItems:"center", gap:14, width:"100%", padding:"13px 14px",
                borderRadius:14, border:"none", cursor:"pointer", marginBottom:4,
                background: active ? "linear-gradient(135deg,#00b89415,#0984e315)" : "transparent",
                transition:"background .2s", textAlign:"left"
              }}
              onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#f8f9fa"; }}
              onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
                <div style={{
                  width:42, height:42, borderRadius:12, flexShrink:0,
                  background: active ? "linear-gradient(135deg,#00b894,#00cec9)" : "#f0f4f8",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow: active ? "0 4px 12px #00b89440" : "none",
                  transition:"all .2s"
                }}>
                  <Icon name={n.icon} size={18} color={active?"#fff":"#636e72"}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color: active?"#00b894":"#2d3436", marginBottom:1 }}>{n.label}</div>
                  <div style={{ fontSize:12, color:"#b2bec3", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{n.desc}</div>
                </div>
                {active && <Icon name="chevron" size={16} color="#00b894"/>}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 16px 28px", borderTop:"1px solid #f0f0f0" }}>
          <button onClick={onLogout} style={{
            display:"flex", alignItems:"center", gap:12, width:"100%", padding:"13px 14px",
            borderRadius:14, border:"none", cursor:"pointer", background:"#fff5f5"
          }}>
            <div style={{ width:42, height:42, borderRadius:12, background:"#ffe4e4", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="logout" size={18} color="#ff4757"/>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#ff4757" }}>Logout</div>
              <div style={{ fontSize:12, color:"#ffb3b3" }}>Sign out of your account</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, cartCount, userName, userPhone, onLogout }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const nav = [
    { id:"home",         label:"Home",        icon:"home"  },
    { id:"medicines",    label:"Medicines",   icon:"pill"  },
    { id:"prescription", label:"Prescription",icon:"rx"    },
    { id:"consult",      label:"Consult",     icon:"steth" },
    { id:"orders",       label:"Orders",      icon:"truck" },
  ];

  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* Mobile Side Drawer */}
      {isMobile && (
        <MobileDrawer
          open={drawerOpen} onClose={()=>setDrawerOpen(false)}
          page={page} setPage={setPage}
          userName={userName} userPhone={userPhone}
          cartCount={cartCount} onLogout={onLogout}
        />
      )}

      <nav style={{ background:"#fff", boxShadow:"0 1px 0 #e8ecf0, 0 4px 20px rgba(0,0,0,.04)", position:"sticky", top:0, zIndex:1000 }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: isMobile?"0 16px":"0 24px", display:"flex", alignItems:"center", height: isMobile?60:68, gap:8 }}>

          {/* Hamburger — Mobile only */}
          {isMobile && (
            <button onClick={()=>setDrawerOpen(true)} style={{ background:"#f4f6f8", border:"none", borderRadius:10, width:40, height:40, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", marginRight:8, flexShrink:0 }}>
              <Icon name="menu" size={20} color="#2d3436"/>
            </button>
          )}

          {/* Logo */}
          <div onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", marginRight: isDesktop?40:16, flexShrink:0 }}>
            <img src={logo} alt="Mediova" style={{ height: isMobile?70:90, width:"auto", objectFit:"contain", filter:"drop-shadow(0 2px 6px rgba(0,180,216,.25))" }}/>
          </div>

          {/* Desktop + Tablet nav links */}
          {!isMobile && (
            <div style={{ display:"flex", gap:4, flex:1 }}>
              {nav.map(n => {
                const active = page === n.id;
                return (
                  <button key={n.id} onClick={()=>setPage(n.id)} style={{
                    display:"flex", alignItems:"center", gap:7,
                    padding: isTablet ? "8px 10px" : "9px 16px",
                    borderRadius:12, border:"none", cursor:"pointer",
                    fontSize: isTablet?12:13, fontWeight:600,
                    background: active ? "linear-gradient(135deg,#00b894,#00cec9)" : "transparent",
                    color: active ? "#fff" : "#636e72",
                    boxShadow: active ? "0 4px 12px #00b89440" : "none",
                    transition:"all .2s", whiteSpace:"nowrap"
                  }}
                  onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="#f4f6f8"; e.currentTarget.style.color="#2d3436"; }}}
                  onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#636e72"; }}}>
                    <Icon name={n.icon} size={15} color={active?"#fff":"currentColor"}/>
                    {isDesktop ? n.label : (n.label.length > 8 ? n.label.slice(0,7)+"…" : n.label)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile: flex spacer */}
          {isMobile && <div style={{ flex:1 }}/>}

          {/* Right actions */}
          <div style={{ display:"flex", alignItems:"center", gap: isMobile?8:12, flexShrink:0 }}>
            {/* User chip — desktop only */}
            {isDesktop && (
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f4f6f8", borderRadius:12, padding:"8px 14px" }}>
                <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#00b894,#00cec9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff" }}>{initial}</div>
                <span style={{ fontSize:13, fontWeight:600, color:"#2d3436" }}>{userName}</span>
              </div>
            )}
            {/* Tablet avatar */}
            {isTablet && (
              <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#00b894,#00cec9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"#fff" }}>{initial}</div>
            )}

            {/* Cart */}
            <button onClick={()=>setPage("cart")} style={{ position:"relative", background:"linear-gradient(135deg,#00b894,#00cec9)", border:"none", borderRadius:12, padding: isMobile?"9px":"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 12px #00b89440" }}>
              <Icon name="cart" size={isMobile?18:17} color="#fff"/>
              {!isMobile && <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>Cart</span>}
              {cartCount>0 && <span style={{ position:"absolute", top:-7, right:-7, background:"#ff4757", color:"#fff", borderRadius:"50%", width:20, height:20, fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>{cartCount}</span>}
            </button>

            {/* Logout — desktop/tablet */}
            {!isMobile && (
              <button onClick={onLogout} title="Logout" style={{ background:"#fff5f5", border:"none", borderRadius:12, padding:"10px 12px", cursor:"pointer", display:"flex", alignItems:"center" }}>
                <Icon name="logout" size={17} color="#ff4757"/>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1px solid #e8ecf0", display:"flex", zIndex:999, paddingBottom:"env(safe-area-inset-bottom,0px)", boxShadow:"0 -4px 20px rgba(0,0,0,.08)" }}>
          {[...nav.slice(0,4), { id:"orders", label:"Orders", icon:"truck" }].map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={()=>setPage(n.id)} style={{
                flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                padding:"10px 4px 8px", border:"none", background:"transparent", cursor:"pointer", gap:3, position:"relative"
              }}>
                {active && <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:32, height:3, borderRadius:"0 0 4px 4px", background:"linear-gradient(135deg,#00b894,#00cec9)" }}/>}
                <div style={{
                  width:36, height:28, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                  background: active ? "linear-gradient(135deg,#00b89420,#00cec920)" : "transparent",
                  transition:"background .2s"
                }}>
                  <Icon name={n.icon} size={18} color={active?"#00b894":"#9aa5b4"}/>
                </div>
                <span style={{ fontSize:10, fontWeight: active?700:500, color: active?"#00b894":"#9aa5b4", letterSpacing:.2 }}>{n.label.slice(0,7)}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

// ── Medicine Card ─────────────────────────────────────────────────────────────
const MedCard = ({ m, onAdd }) => {
  const img = m.image ? (m.image.startsWith("http") ? m.image : `http://localhost:8000${m.image}`) : null;
  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f0f0f0", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.05)", transition:"transform .2s,box-shadow .2s" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,.1)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.05)"}}>
      <div style={{ background:img?`url(${img}) center/cover`:"linear-gradient(135deg,#e8f8f5,#e3f6ff)", height:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {!img&&<Icon name="pill" size={34} color="#00b894"/>}
      </div>
      <div style={{ padding:12 }}>
        {m.requires_prescription&&<span style={{ background:"#fff0ec", color:"#e17055", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:6, display:"inline-block", marginBottom:5, letterSpacing:.3 }}>Rx REQUIRED</span>}
        <h3 style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#1a1a2e", lineHeight:1.3 }}>{m.name}</h3>
        <p style={{ margin:"0 0 7px", fontSize:11, color:"#b2bec3" }}>{m.brand}</p>
        <div style={{ display:"flex", alignItems:"center", gap:3, marginBottom:9 }}>
          <Icon name="star" size={11} color="#f9ca24"/>
          <span style={{ fontSize:11, color:"#636e72" }}>{m.rating}</span>
          {m.discount_percent>0&&<span style={{ marginLeft:"auto", background:"#e8f8f5", color:"#00b894", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:6 }}>{m.discount_percent}% OFF</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <span style={{ fontSize:15, fontWeight:800, color:"#1a1a2e" }}>₹{m.price}</span>
            {m.mrp>m.price&&<span style={{ fontSize:11, color:"#c4c9d4", textDecoration:"line-through", marginLeft:5 }}>₹{m.mrp}</span>}
          </div>
          {onAdd&&m.stock>0&&(
            <button onClick={()=>onAdd(m)} style={{ background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", border:"none", borderRadius:9, padding:"6px 11px", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:3, boxShadow:"0 3px 8px #00b89430" }}>
              <Icon name="plus" size={11} color="#fff"/> Add
            </button>
          )}
          {m.stock===0&&<span style={{ background:"#fff0f0", color:"#ff4757", fontSize:9, fontWeight:700, padding:"3px 7px", borderRadius:6 }}>OUT OF STOCK</span>}
        </div>
      </div>
    </div>
  );
};

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
const HomePage = ({ setPage, setSearch }) => {
  const { isMobile, isTablet } = useResponsive();
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [sq, setSq] = useState("");

  useEffect(() => {
    get("/offers/").then(d=>setOffers(Array.isArray(d)?d:d.results||[]));
    get("/categories/").then(d=>setCategories(Array.isArray(d)?d:d.results||[]));
    get("/medicines/").then(d=>setFeatured((Array.isArray(d)?d:d.results||[]).slice(0,4)));
  }, []);

  const actions = [
    { icon:"pill",  label:"Buy Medicines", color:"#00b894", bg:"linear-gradient(135deg,#e8f8f5,#d1f2eb)", page:"medicines" },
    { icon:"rx",    label:"Upload Rx",     color:"#6c5ce7", bg:"linear-gradient(135deg,#f0eeff,#e8e0ff)", page:"prescription" },
    { icon:"steth", label:"Consult Doc",   color:"#e17055", bg:"linear-gradient(135deg,#fff0ec,#ffe5dd)", page:"consult" },
    { icon:"truck", label:"My Orders",     color:"#0984e3", bg:"linear-gradient(135deg,#e8f4fd,#d6eaf8)", page:"orders" },
  ];

  const pad = isMobile ? "0 16px 90px" : "0 24px 32px";

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:pad }}>
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#00b894 0%,#00cec9 50%,#0984e3 100%)", borderRadius: isMobile?"0 0 28px 28px":24, padding: isMobile?"28px 22px 32px":"52px 56px", marginBottom:24, position:"relative", overflow:"hidden", marginLeft: isMobile?-16:0, marginRight: isMobile?-16:0 }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:220, height:220, background:"rgba(255,255,255,.08)", borderRadius:"50%" }}/>
        <div style={{ position:"absolute", right:60, bottom:-60, width:160, height:160, background:"rgba(255,255,255,.05)", borderRadius:"50%" }}/>
        <h1 style={{ fontSize: isMobile?26:isTablet?34:44, fontWeight:900, color:"#fff", margin:"0 0 10px", lineHeight:1.15, position:"relative", zIndex:1 }}>
          Medicines at your<br/><span style={{ color:"#ffeaa7" }}>doorstep 🚀</span>
        </h1>
        <p style={{ color:"rgba(255,255,255,.85)", margin:"0 0 24px", fontSize: isMobile?14:16, position:"relative", zIndex:1 }}>
          Order medicines, upload prescriptions & consult doctors.
        </p>
        <div style={{ display:"flex", gap:10, maxWidth:520, position:"relative", zIndex:1 }}>
          <input value={sq} onChange={e=>setSq(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"){ setSearch(sq); setPage("medicines"); }}}
            placeholder="Search medicines, brands..."
            style={{ flex:1, padding: isMobile?"13px 16px":"15px 20px", borderRadius:14, border:"none", fontSize: isMobile?14:15, outline:"none", boxShadow:"0 4px 20px rgba(0,0,0,.15)", minWidth:0 }}/>
          <button onClick={()=>{setSearch(sq);setPage("medicines");}}
            style={{ background:"rgba(255,255,255,.95)", color:"#00b894", border:"none", borderRadius:14, padding: isMobile?"13px 14px":"15px 22px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 20px rgba(0,0,0,.15)", flexShrink:0 }}>
            <Icon name="search" size={16} color="#00b894"/>
            {!isMobile && "Search"}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap: isMobile?10:16, marginBottom:28 }}>
        {actions.map(a=>(
          <button key={a.label} onClick={()=>setPage(a.page)} style={{ background:a.bg, border:"none", borderRadius: isMobile?14:18, padding: isMobile?"16px 8px":"24px 12px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap: isMobile?8:10, transition:"transform .2s, box-shadow .2s", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,.1)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.05)"}}>
            <div style={{ background:a.color, borderRadius:12, width: isMobile?40:50, height: isMobile?40:50, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 6px 16px ${a.color}40` }}>
              <Icon name={a.icon} size={isMobile?19:23} color="#fff"/>
            </div>
            <span style={{ fontSize: isMobile?10:13, fontWeight:700, color:"#2d3436", textAlign:"center", lineHeight:1.3 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Offers */}
      {offers.length>0&&(
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontSize: isMobile?17:22, fontWeight:800, color:"#1a1a2e", marginBottom:14 }}>🏷️ Today's Offers</h2>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":isTablet?"repeat(2,1fr)":"repeat(3,1fr)", gap:14, overflowX: isMobile?"auto":"visible" }}>
            {offers.map(o=>(
              <div key={o.id} style={{ background:`linear-gradient(135deg,${o.color}18,${o.color}35)`, borderRadius:16, padding:18, border:`1.5px solid ${o.color}30` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ fontSize:28 }}>{o.emoji}</span>
                  {o.discount_percent>0&&<span style={{ background:o.color, color:"#fff", fontWeight:800, fontSize:14, padding:"4px 10px", borderRadius:10 }}>{o.discount_percent}% OFF</span>}
                </div>
                <h3 style={{ margin:"0 0 4px", fontSize:15, fontWeight:700, color:"#1a1a2e" }}>{o.title}</h3>
                <p style={{ margin:"0 0 10px", fontSize:13, color:"#636e72" }}>{o.subtitle}</p>
                {o.code&&<span style={{ background:"rgba(255,255,255,.85)", borderRadius:8, padding:"5px 12px", fontSize:13, fontWeight:700, letterSpacing:1, display:"inline-block" }}>CODE: {o.code}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length>0&&(
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontSize: isMobile?17:22, fontWeight:800, color:"#1a1a2e", marginBottom:14 }}>📂 Categories</h2>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {categories.map(c=>(
              <button key={c.id} onClick={()=>setPage("medicines")} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", background:"#fff", border:"1.5px solid #e8ecf0", borderRadius:12, cursor:"pointer", fontWeight:600, fontSize:13, color:"#2d3436", transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#00b894";e.currentTarget.style.color="#00b894";e.currentTarget.style.background="#f0fdf9"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e8ecf0";e.currentTarget.style.color="#2d3436";e.currentTarget.style.background="#fff"}}>
                <span style={{ fontSize:17 }}>{c.icon}</span>{c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      {featured.length>0&&(
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize: isMobile?17:22, fontWeight:800, color:"#1a1a2e", margin:0 }}>⭐ Featured</h2>
            <button onClick={()=>setPage("medicines")} style={{ background:"none", border:"none", color:"#00b894", fontWeight:700, cursor:"pointer", fontSize:14 }}>View All →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:14 }}>
            {featured.map(m=><MedCard key={m.id} m={m}/>)}
          </div>
        </div>
      )}
    </div>
  );
};

// ── MEDICINES PAGE ────────────────────────────────────────────────────────────
const MedicinesPage = ({ cartData, setCartData, cartId, toast, searchInit }) => {
  const { isMobile } = useResponsive();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchInit||"");
  const [selCat, setSelCat] = useState("");
  const [rx, setRx] = useState("");
  const [loading, setLoading] = useState(false);
  const [pg, setPg] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async()=>{
    setLoading(true);
    let url=`/medicines/?page=${pg}`;
    if(search) url+=`&q=${encodeURIComponent(search)}`;
    if(selCat) url+=`&category=${selCat}`;
    if(rx)     url+=`&rx=${rx}`;
    const d=await get(url);
    setMedicines(Array.isArray(d)?d:d.results||[]);
    setTotal(d.count||0);
    setLoading(false);
  },[search,selCat,rx,pg]);

  useEffect(()=>{get("/categories/").then(d=>setCategories(Array.isArray(d)?d:d.results||[]));},[]);
  useEffect(()=>{load();},[load]);

  const addToCart = async(m)=>{
    if(!cartId) return toast("Cart not ready","error");
    if(m.stock===0) return toast("Out of stock","error");
    const existing=cartData?.items?.find(i=>i.medicine?.id===m.id);
    const qty=(existing?.quantity||0)+1;
    const data=await post("/cart/add/",{cart_id:cartId,medicine_id:m.id,quantity:qty});
    if(data.id){ setCartData(data); toast(`${m.name} added! 🛒`,"success"); }
    else toast("Failed to add","error");
  };

  const sel={ padding:"11px 14px", border:"1.5px solid #e8ecf0", borderRadius:11, fontSize:14, outline:"none", background:"#fff", width:"100%", boxSizing:"border-box", color:"#2d3436" };

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding: isMobile?"16px 16px 90px":"32px 24px" }}>
      <h1 style={{ fontSize: isMobile?22:28, fontWeight:800, color:"#1a1a2e", marginBottom:20 }}>💊 Buy Medicines</h1>
      {/* Filter bar */}
      <div style={{ background:"#fff", borderRadius:16, padding:16, marginBottom:20, boxShadow:"0 2px 12px rgba(0,0,0,.05)", border:"1px solid #f0f0f0" }}>
        <div style={{ position:"relative", marginBottom:12 }}>
          <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="search" size={16} color="#b2bec3"/></div>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPg(1);}} placeholder="Search medicines, brands, salts..."
            style={{ ...sel, paddingLeft:40, fontSize:15 }}
            onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <select value={selCat} onChange={e=>{setSelCat(e.target.value);setPg(1);}} style={sel}>
            <option value="">All Categories</option>
            {categories.map(c=><option key={c.id} value={c.slug}>{c.icon} {c.name}</option>)}
          </select>
          <select value={rx} onChange={e=>{setRx(e.target.value);setPg(1);}} style={sel}>
            <option value="">All Types</option>
            <option value="false">OTC (No Rx)</option>
            <option value="true">Prescription Only</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign:"center", padding:80, color:"#b2bec3" }}>
          <div style={{ fontSize:40, marginBottom:16 }}>💊</div>
          <p style={{ fontSize:15 }}>Loading medicines...</p>
        </div>
      ) : (
        <>
          <p style={{ color:"#8892a4", marginBottom:16, fontSize:13, fontWeight:600 }}>{total||medicines.length} medicines found</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))", gap:14 }}>
            {medicines.map(m=><MedCard key={m.id} m={m} onAdd={addToCart}/>)}
          </div>
          {medicines.length===0&&(
            <div style={{ textAlign:"center", padding:80, color:"#b2bec3" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
              <p style={{ fontSize:16 }}>No medicines found</p>
            </div>
          )}
          {total>20&&(
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:10, marginTop:32 }}>
              <button onClick={()=>setPg(p=>Math.max(1,p-1))} disabled={pg===1} style={{ padding:"10px 20px", borderRadius:10, border:"1.5px solid #e8ecf0", background:"#fff", cursor:"pointer", fontWeight:600, color:"#636e72" }}>← Prev</button>
              <span style={{ padding:"10px 20px", background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", borderRadius:10, fontWeight:700 }}>Page {pg}</span>
              <button onClick={()=>setPg(p=>p+1)} disabled={medicines.length<20} style={{ padding:"10px 20px", borderRadius:10, border:"1.5px solid #e8ecf0", background:"#fff", cursor:"pointer", fontWeight:600, color:"#636e72" }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── CART PAGE ─────────────────────────────────────────────────────────────────
const CartPage = ({ cartData, setCartData, cartId, toast, setPage }) => {
  const { isMobile } = useResponsive();
  const [offerCode, setOfferCode] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(null);

  const items = cartData?.items||[];
  const total = cartData?.total||0;

  const updateQty = async(mid,qty)=>{
    const data=await post("/cart/add/",{cart_id:cartId,medicine_id:mid,quantity:qty});
    if(data.id) setCartData(data);
  };

  const placeOrder = async()=>{
    if(!address.trim()) return toast("Enter delivery address","error");
    setPlacing(true);
    const body={cart_id:cartId,delivery_address:address};
    if(offerCode) body.offer_code=offerCode;
    const data=await post("/orders/",body);
    setPlacing(false);
    if(data.id){ setOrdered(data); setCartData({...cartData,items:[],total:0}); toast("Order placed! 🎉","success"); }
    else toast(data.detail||"Order failed","error");
  };

  if(ordered) return(
    <div style={{ maxWidth:500, margin:"40px auto", padding:"0 16px", textAlign:"center" }}>
      <div style={{ background:"#fff", borderRadius:24, padding: isMobile?28:48, boxShadow:"0 8px 40px rgba(0,0,0,.1)" }}>
        <div style={{ width:80, height:80, background:"linear-gradient(135deg,#00b894,#00cec9)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px #00b89440" }}>
          <Icon name="check" size={36} color="#fff"/>
        </div>
        <h2 style={{ fontSize:26, fontWeight:800, color:"#1a1a2e", marginBottom:8 }}>Order Placed! 🎉</h2>
        <p style={{ color:"#8892a4", marginBottom:24 }}>Order #{ordered.id} is confirmed</p>
        <div style={{ background:"#f8fafc", borderRadius:16, padding:20, marginBottom:24, textAlign:"left" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ color:"#8892a4" }}>Total</span><span style={{ fontWeight:700 }}>₹{ordered.total_amount}</span></div>
          {ordered.discount_amount>0&&<div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ color:"#8892a4" }}>Discount</span><span style={{ fontWeight:700, color:"#00b894" }}>-₹{ordered.discount_amount}</span></div>}
          <div style={{ display:"flex", justifyContent:"space-between", borderTop:"1px solid #e8ecf0", paddingTop:10, marginTop:8 }}><span style={{ fontWeight:700 }}>Net Amount</span><span style={{ fontWeight:800, fontSize:18, color:"#00b894" }}>₹{ordered.net_amount}</span></div>
        </div>
        <button onClick={()=>{setOrdered(null);setPage("medicines");}} style={{ background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", border:"none", borderRadius:14, padding:"14px 32px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 6px 20px #00b89440" }}>Continue Shopping</button>
      </div>
    </div>
  );

  return(
    <div style={{ maxWidth:960, margin:"0 auto", padding: isMobile?"16px 16px 100px":"32px 24px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={()=>setPage("medicines")} style={{ background:"#f4f6f8", border:"none", borderRadius:10, padding:"9px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontWeight:600, color:"#636e72" }}>
          <Icon name="back" size={16}/> Back
        </button>
        <h1 style={{ fontSize: isMobile?20:26, fontWeight:800, color:"#1a1a2e", margin:0 }}>🛒 My Cart</h1>
        <span style={{ background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13 }}>{items.length}</span>
      </div>

      {items.length===0?(
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
          <h3 style={{ color:"#b2bec3", fontSize:18, fontWeight:600, marginBottom:8 }}>Your cart is empty</h3>
          <p style={{ color:"#c4c9d4", marginBottom:24, fontSize:14 }}>Add some medicines to get started</p>
          <button onClick={()=>setPage("medicines")} style={{ background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", border:"none", borderRadius:14, padding:"14px 28px", fontWeight:700, cursor:"pointer", fontSize:15, boxShadow:"0 6px 20px #00b89440" }}>Browse Medicines</button>
        </div>
      ):(
        <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 340px", gap:20, alignItems:"start" }}>
          {/* Items */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {items.map(item=>{
              const med=item.medicine;
              const img=med?.image?(med.image.startsWith("http")?med.image:`http://localhost:8000${med.image}`):null;
              return(
                <div key={item.id} style={{ background:"#fff", borderRadius:16, padding:14, border:"1px solid #f0f0f0", display:"flex", gap:12, alignItems:"center", boxShadow:"0 2px 10px rgba(0,0,0,.04)" }}>
                  <div style={{ width:56, height:56, background:img?`url(${img}) center/cover`:"linear-gradient(135deg,#e8f8f5,#e3f6ff)", borderRadius:12, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {!img&&<Icon name="pill" size={22} color="#00b894"/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 style={{ margin:"0 0 2px", fontSize:14, fontWeight:700, color:"#1a1a2e", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{med?.name}</h3>
                    <p style={{ margin:"0 0 4px", fontSize:12, color:"#b2bec3" }}>{med?.brand}</p>
                    <span style={{ fontSize:15, fontWeight:800, color:"#00b894" }}>₹{med?.price}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f4f6f8", borderRadius:10, padding:"4px 6px" }}>
                      <button onClick={()=>updateQty(med?.id,item.quantity-1)} style={{ width:28, height:28, borderRadius:7, border:"none", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 4px rgba(0,0,0,.1)" }}><Icon name="minus" size={13}/></button>
                      <span style={{ fontWeight:800, fontSize:15, minWidth:22, textAlign:"center", color:"#1a1a2e" }}>{item.quantity}</span>
                      <button onClick={()=>updateQty(med?.id,item.quantity+1)} style={{ width:28, height:28, borderRadius:7, border:"none", background:"#00b894", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="plus" size={13} color="#fff"/></button>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontWeight:800, color:"#1a1a2e", fontSize:14 }}>₹{typeof item.subtotal==="number"?item.subtotal.toFixed(2):item.subtotal}</span>
                      <button onClick={()=>updateQty(med?.id,0)} style={{ background:"#fff0f0", border:"none", color:"#ff4757", cursor:"pointer", borderRadius:7, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="trash" size={13} color="#ff4757"/>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={{ background:"#fff", borderRadius:20, padding:22, border:"1px solid #f0f0f0", boxShadow:"0 4px 20px rgba(0,0,0,.06)", position: isMobile?"static":"sticky", top:88 }}>
            <h3 style={{ margin:"0 0 18px", fontSize:17, fontWeight:800, color:"#1a1a2e" }}>Order Summary</h3>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14 }}>
              <span style={{ color:"#8892a4" }}>Subtotal ({items.length} items)</span>
              <span style={{ fontWeight:700 }}>₹{typeof total==="number"?total.toFixed(2):total}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14 }}>
              <span style={{ color:"#8892a4" }}>Delivery</span>
              <span style={{ fontWeight:700, color:"#00b894" }}>FREE</span>
            </div>
            <div style={{ borderTop:"1px dashed #e8ecf0", paddingTop:12, marginBottom:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontWeight:800, fontSize:16 }}>Total</span>
                <span style={{ fontWeight:900, fontSize:20, color:"#00b894" }}>₹{typeof total==="number"?total.toFixed(2):total}</span>
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:6, color:"#4a5568", letterSpacing:.3 }}>OFFER CODE</label>
              <input value={offerCode} onChange={e=>setOfferCode(e.target.value.toUpperCase())} placeholder="Enter coupon code"
                style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e8ecf0", borderRadius:11, fontSize:14, outline:"none", fontFamily:"monospace", boxSizing:"border-box", letterSpacing:1 }}
                onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:6, color:"#4a5568", letterSpacing:.3 }}>DELIVERY ADDRESS *</label>
              <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Enter your full delivery address..." rows={3}
                style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e8ecf0", borderRadius:11, fontSize:14, outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.5 }}
                onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
            </div>
            <button onClick={placeOrder} disabled={placing}
              style={{ width:"100%", background: placing?"#b2bec3":"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", border:"none", borderRadius:14, padding:15, fontSize:16, fontWeight:700, cursor: placing?"not-allowed":"pointer", boxShadow: placing?"none":"0 6px 20px #00b89440", transition:"all .2s" }}>
              {placing?"Placing Order...":"Place Order →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── PRESCRIPTION PAGE ─────────────────────────────────────────────────────────
const PrescriptionPage = ({ userName, userPhone, toast }) => {
  const { isMobile } = useResponsive();
  const [prescriptions, setPrescriptions] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState("");

  const load = ()=>get(`/prescriptions/?customer_phone=${userPhone}`).then(d=>setPrescriptions(Array.isArray(d)?d:d.results||[]));
  useEffect(()=>{load();},[]);

  const handleFile=(e)=>{
    const f=e.target.files[0]; if(!f) return;
    setFile(f);
    const r=new FileReader(); r.onload=ev=>setPreview(ev.target.result); r.readAsDataURL(f);
  };

  const upload=async()=>{
    if(!file) return toast("Select a file first","error");
    setUploading(true);
    const fd=new FormData();
    fd.append("customer_name",userName); fd.append("customer_phone",userPhone);
    fd.append("image",file); if(notes) fd.append("notes",notes);
    const data=await postForm("/prescriptions/",fd);
    setUploading(false);
    if(data.id){ toast("Uploaded! ✅","success"); setFile(null); setPreview(null); setNotes(""); load(); }
    else toast("Upload failed","error");
  };

  const sColor={pending:"#f9ca24",verified:"#00b894",rejected:"#ff4757"};
  const sBg   ={pending:"#fffbf0",verified:"#e8f8f5",rejected:"#fff0f0"};

  return(
    <div style={{ maxWidth:920, margin:"0 auto", padding: isMobile?"16px 16px 90px":"32px 24px" }}>
      <h1 style={{ fontSize: isMobile?22:28, fontWeight:800, color:"#1a1a2e", marginBottom:6 }}>📋 Prescription</h1>
      <p style={{ color:"#8892a4", marginBottom:24, fontSize:14 }}>Upload your prescription and our pharmacist will verify it within 2 hours.</p>
      <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:20 }}>
        {/* Upload */}
        <div style={{ background:"#fff", borderRadius:20, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,.05)", border:"1px solid #f0f0f0" }}>
          <h2 style={{ fontSize:17, fontWeight:800, marginBottom:20, color:"#1a1a2e" }}>Upload New</h2>
          <div onClick={()=>document.getElementById("rx-inp").click()}
            style={{ border:"2px dashed #00b894", borderRadius:16, padding:"28px 20px", textAlign:"center", cursor:"pointer", marginBottom:16, background:preview?"transparent":"#f0fdf9", transition:"background .2s" }}>
            {preview?<img src={preview} alt="preview" style={{ maxWidth:"100%", maxHeight:190, borderRadius:10 }}/>:(
              <>
                <div style={{ width:56, height:56, borderRadius:16, background:"#00b89420", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                  <Icon name="upload" size={26} color="#00b894"/>
                </div>
                <p style={{ margin:"0 0 4px", fontWeight:700, color:"#1a1a2e", fontSize:15 }}>Tap to upload</p>
                <p style={{ margin:0, fontSize:13, color:"#b2bec3" }}>JPG, PNG, PDF supported</p>
              </>
            )}
          </div>
          <input id="rx-inp" type="file" accept="image/*,.pdf" style={{ display:"none" }} onChange={handleFile}/>
          {file&&<p style={{ fontSize:13, color:"#00b894", marginBottom:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>📎 {file.name}</p>}
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes for pharmacist (optional)..." rows={3}
            style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e8ecf0", borderRadius:11, fontSize:14, outline:"none", resize:"none", marginBottom:14, boxSizing:"border-box" }}
            onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
          <button onClick={upload} disabled={uploading||!file}
            style={{ width:"100%", background:file?"linear-gradient(135deg,#6c5ce7,#a29bfe)":"#e8ecf0", color:"#fff", border:"none", borderRadius:13, padding:14, fontSize:15, fontWeight:700, cursor:file?"pointer":"not-allowed", boxShadow:file?"0 6px 20px #6c5ce740":"none" }}>
            {uploading?"Uploading...":"Upload Prescription"}
          </button>
        </div>
        {/* List */}
        <div style={{ background:"#fff", borderRadius:20, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,.05)", border:"1px solid #f0f0f0" }}>
          <h2 style={{ fontSize:17, fontWeight:800, marginBottom:20, color:"#1a1a2e" }}>My Prescriptions</h2>
          {prescriptions.length===0?(
            <div style={{ textAlign:"center", padding:"50px 0", color:"#b2bec3" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
              <p style={{ fontSize:14, margin:0 }}>No prescriptions uploaded yet</p>
            </div>
          ):(
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:420, overflowY:"auto" }}>
              {prescriptions.map(rx=>(
                <div key={rx.id} style={{ border:"1.5px solid #f0f0f0", borderRadius:14, padding:14, display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:44, height:44, background:"#f0eeff", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="doc" size={20} color="#6c5ce7"/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#1a1a2e" }}>Prescription #{rx.id}</p>
                    <p style={{ margin:"2px 0 0", fontSize:12, color:"#b2bec3" }}>{new Date(rx.uploaded_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
                    {rx.notes&&<p style={{ margin:"4px 0 0", fontSize:12, color:"#636e72", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{rx.notes}</p>}
                  </div>
                  <span style={{ background:sBg[rx.status], color:sColor[rx.status], fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:8, flexShrink:0 }}>{rx.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── CONSULTATION PAGE ─────────────────────────────────────────────────────────
const ConsultPage = ({ userName, userPhone, toast }) => {
  const { isMobile, isTablet } = useResponsive();
  const [form, setForm] = useState({ specialty:"general", symptoms:"", appointment_date:"" });
  const [consultations, setConsultations] = useState([]);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(null);

  const load=()=>get("/consultations/").then(d=>setConsultations(Array.isArray(d)?d:d.results||[]));
  useEffect(()=>{load();},[]);

  const doctors=[
    { key:"general",    name:"General Physician",emoji:"👨‍⚕️",fee:299, color:"#00b894",bg:"#e8f8f5" },
    { key:"cardiology", name:"Cardiologist",      emoji:"❤️",  fee:799, color:"#e17055",bg:"#fff0ec" },
    { key:"neurology",  name:"Neurologist",       emoji:"🧠",  fee:999, color:"#6c5ce7",bg:"#f0eeff" },
    { key:"dentist",    name:"Dentist",           emoji:"🦷",  fee:499, color:"#0984e3",bg:"#e8f4fd" },
    { key:"dermatology",name:"Dermatologist",     emoji:"🌿",  fee:599, color:"#00cec9",bg:"#e3faf9" },
  ];

  const book=async()=>{
    if(!form.symptoms.trim()) return toast("Describe your symptoms","error");
    if(!form.appointment_date) return toast("Select appointment date","error");
    setBooking(true);
    const data=await post("/consultations/",{ customer_name:userName, customer_phone:userPhone, ...form });
    setBooking(false);
    if(data.id){ setBooked(data); toast("Booked! ✅","success"); load(); }
    else toast(data.detail||"Booking failed","error");
  };

  const sel=doctors.find(d=>d.key===form.specialty);
  const sc={ requested:"#f9ca24", confirmed:"#00b894", completed:"#0984e3", cancelled:"#ff4757" };

  if(booked) return(
    <div style={{ maxWidth:500, margin:"40px auto", padding:"0 16px", textAlign:"center" }}>
      <div style={{ background:"#fff", borderRadius:24, padding: isMobile?28:48, boxShadow:"0 8px 40px rgba(0,0,0,.1)" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>{doctors.find(d=>d.key===booked.specialty)?.emoji}</div>
        <h2 style={{ fontSize:26, fontWeight:800, color:"#1a1a2e", marginBottom:8 }}>Consultation Booked! 🎉</h2>
        <p style={{ color:"#8892a4", marginBottom:24 }}>Your appointment with {doctors.find(d=>d.key===booked.specialty)?.name} is requested.</p>
        <button onClick={()=>setBooked(null)} style={{ background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", border:"none", borderRadius:14, padding:"14px 32px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 6px 20px #00b89440" }}>Book Another</button>
      </div>
    </div>
  );

  return(
    <div style={{ maxWidth:1100, margin:"0 auto", padding: isMobile?"16px 16px 90px":"32px 24px" }}>
      <h1 style={{ fontSize: isMobile?22:28, fontWeight:800, color:"#1a1a2e", marginBottom:6 }}>🩺 Consult a Doctor</h1>
      <p style={{ color:"#8892a4", marginBottom:24, fontSize:14 }}>Book online consultations with verified specialists.</p>
      <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":isTablet?"1fr":"1fr 320px", gap:24 }}>
        <div>
          <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14, color:"#4a5568", letterSpacing:.3 }}>SELECT SPECIALIST</h2>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:12, marginBottom:24 }}>
            {doctors.map(d=>{
              const active = form.specialty===d.key;
              return(
                <button key={d.key} onClick={()=>setForm(f=>({...f,specialty:d.key}))}
                  style={{ background: active?d.color:d.bg, border: active?"none":`1.5px solid ${d.color}30`, borderRadius:16, padding:"16px 10px", cursor:"pointer", textAlign:"center", transition:"all .2s", boxShadow: active?`0 6px 20px ${d.color}40`:"0 2px 8px rgba(0,0,0,.05)" }}>
                  <div style={{ fontSize: isMobile?24:28, marginBottom:6 }}>{d.emoji}</div>
                  <div style={{ fontSize:11, fontWeight:700, color: active?"#fff":d.color, lineHeight:1.3, marginBottom:4 }}>{d.name}</div>
                  <div style={{ fontSize:13, fontWeight:800, color: active?"rgba(255,255,255,.9)":"#1a1a2e" }}>₹{d.fee}</div>
                </button>
              );
            })}
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:8, color:"#4a5568", letterSpacing:.3 }}>SYMPTOMS *</label>
            <textarea value={form.symptoms} onChange={e=>setForm(f=>({...f,symptoms:e.target.value}))} placeholder="e.g. Fever for 2 days, headache, body ache..." rows={4}
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #e8ecf0", borderRadius:13, fontSize:14, outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.5 }}
              onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:8, color:"#4a5568", letterSpacing:.3 }}>APPOINTMENT DATE & TIME *</label>
            <input type="datetime-local" value={form.appointment_date} onChange={e=>setForm(f=>({...f,appointment_date:e.target.value}))}
              min={new Date().toISOString().slice(0,16)}
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #e8ecf0", borderRadius:13, fontSize:14, outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor="#00b894"} onBlur={e=>e.target.style.borderColor="#e8ecf0"}/>
          </div>
          <button onClick={book} disabled={booking}
            style={{ width:"100%", background:"linear-gradient(135deg,#00b894,#00cec9)", color:"#fff", border:"none", borderRadius:14, padding:16, fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 6px 20px #00b89440" }}>
            {booking?"Booking...": `Book — ${sel?.name} • ₹${sel?.fee}`}
          </button>
        </div>

        <div style={{ background:"#fff", borderRadius:20, padding:20, boxShadow:"0 4px 20px rgba(0,0,0,.05)", border:"1px solid #f0f0f0", height:"fit-content" }}>
          <h3 style={{ fontSize:16, fontWeight:800, marginBottom:16, color:"#1a1a2e" }}>My Consultations</h3>
          {consultations.filter(c=>c.customer_phone===userPhone).length===0?(
            <div style={{ textAlign:"center", padding:"32px 0", color:"#b2bec3" }}>
              <div style={{ fontSize:40, marginBottom:8 }}>🩺</div>
              <p style={{ fontSize:13, margin:0 }}>No consultations yet</p>
            </div>
          ):(
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
              {consultations.filter(c=>c.customer_phone===userPhone).map(c=>{
                const doc=doctors.find(d=>d.key===c.specialty);
                return(
                  <div key={c.id} style={{ border:"1.5px solid #f0f0f0", borderRadius:13, padding:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:18 }}>{doc?.emoji}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:"#1a1a2e", flex:1 }}>{doc?.name}</span>
                      <span style={{ background:`${sc[c.status]}18`, color:sc[c.status], fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>{c.status.toUpperCase()}</span>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#8892a4" }}>{new Date(c.appointment_date).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
const OrdersPage = ({ userPhone }) => {
  const { isMobile } = useResponsive();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(()=>{
    get(`/orders/?phone=${userPhone}`).then(d=>{ setOrders(Array.isArray(d)?d:d.results||[]); setLoading(false); });
  },[userPhone]);

  const steps=["placed","confirmed","packed","dispatched","delivered"];
  const sc={ placed:"#f9ca24", confirmed:"#00cec9", packed:"#6c5ce7", dispatched:"#0984e3", delivered:"#00b894", cancelled:"#ff4757" };

  return(
    <div style={{ maxWidth:900, margin:"0 auto", padding: isMobile?"16px 16px 90px":"32px 24px" }}>
      <h1 style={{ fontSize: isMobile?22:28, fontWeight:800, color:"#1a1a2e", marginBottom:6 }}>📦 My Orders</h1>
      <p style={{ color:"#8892a4", marginBottom:24, fontSize:14 }}>Track all your medicine deliveries.</p>
      {loading?(
        <div style={{ textAlign:"center", padding:80, color:"#b2bec3" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
          <p>Loading orders...</p>
        </div>
      ):orders.length===0?(
        <div style={{ textAlign:"center", padding:80 }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🛍️</div>
          <h3 style={{ color:"#b2bec3", fontSize:18, fontWeight:600 }}>No orders yet</h3>
          <p style={{ color:"#c4c9d4", fontSize:14 }}>Your order history will appear here</p>
        </div>
      ):(
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {orders.map(o=>{
            const step=steps.indexOf(o.status);
            const exp=expanded===o.id;
            return(
              <div key={o.id} style={{ background:"#fff", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,.05)", overflow:"hidden", border:"1px solid #f0f0f0" }}>
                <div style={{ padding: isMobile?"14px 16px":"18px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }} onClick={()=>setExpanded(exp?null:o.id)}>
                  <div style={{ width:46, height:46, background:`${sc[o.status]}18`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="truck" size={20} color={sc[o.status]}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontSize: isMobile?14:16, fontWeight:800, color:"#1a1a2e" }}>Order #{o.id}</span>
                      <span style={{ background:`${sc[o.status]}18`, color:sc[o.status], fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:8 }}>{o.status.toUpperCase()}</span>
                    </div>
                    <p style={{ margin:"3px 0 0", fontSize:12, color:"#b2bec3" }}>{new Date(o.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})} · {o.items?.length||0} item{o.items?.length!==1?"s":""}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize: isMobile?16:18, fontWeight:900, color:"#1a1a2e" }}>₹{o.net_amount}</div>
                    {o.discount_amount>0&&<div style={{ fontSize:11, color:"#00b894", fontWeight:600 }}>Saved ₹{o.discount_amount}</div>}
                  </div>
                </div>
                {o.status!=="cancelled"&&(
                  <div style={{ padding: isMobile?"0 16px 16px":"0 22px 18px" }}>
                    <div style={{ display:"flex", gap:3 }}>
                      {steps.map((s,i)=><div key={s} style={{ flex:1, height:5, borderRadius:10, background: i<=step?sc[o.status]:"#f0f0f0", transition:"background .3s" }}/>)}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                      {steps.map((s,i)=><span key={s} style={{ fontSize: isMobile?8:10, color:i<=step?sc[o.status]:"#c4c9d4", fontWeight:i===step?700:400, textTransform:"capitalize" }}>{s}</span>)}
                    </div>
                  </div>
                )}
                {exp&&(
                  <div style={{ borderTop:"1px solid #f4f6f8", padding: isMobile?"14px 16px":"16px 22px" }}>
                    <p style={{ fontSize:11, color:"#b2bec3", margin:"0 0 4px", fontWeight:600, letterSpacing:.3 }}>DELIVERY ADDRESS</p>
                    <p style={{ fontSize:14, color:"#2d3436", margin:"0 0 16px", lineHeight:1.5 }}>{o.delivery_address}</p>
                    <p style={{ fontSize:11, color:"#b2bec3", margin:"0 0 10px", fontWeight:600, letterSpacing:.3 }}>ORDER ITEMS</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {o.items?.map(item=>(
                        <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f8f9fa" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#e8f8f5,#e3f6ff)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <Icon name="pill" size={15} color="#00b894"/>
                            </div>
                            <div style={{ minWidth:0 }}>
                              <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#1a1a2e", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth: isMobile?150:260 }}>{item.medicine?.name||`Medicine #${item.medicine}`}</p>
                              <p style={{ margin:0, fontSize:12, color:"#b2bec3" }}>Qty: {item.quantity} × ₹{item.unit_price}</p>
                            </div>
                          </div>
                          <span style={{ fontWeight:800, color:"#1a1a2e", flexShrink:0 }}>₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
import AdminApp from "./Admin";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function MainApp() {
  const [page, setPage]           = useState("home");
  const [userName, setUserName]   = useState(() => localStorage.getItem("medi_name") || "");
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem("medi_phone") || "");
  const [cartId, setCartId]       = useState(() => { const id=localStorage.getItem("medi_cart_id"); return id?Number(id):null; });
  const [cartData, setCartData]   = useState(null);
  const [toasts, setToasts]       = useState([]);
  const [searchInit, setSearchInit] = useState("");

  const toast = useCallback((msg, type="info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const removeToast = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  useEffect(() => {
    if (cartId && !cartData) {
      get(`/cart/${cartId}/`).then(d => { if (d?.id) setCartData(d); }).catch(()=>{});
    }
  }, [cartId]);

  const handleUserSave = async (name, phone) => {
    setUserName(name); setUserPhone(phone);
    localStorage.setItem("medi_name", name);
    localStorage.setItem("medi_phone", phone);
    const data = await post("/cart/create/", { customer_name: name, customer_phone: phone });
    if (data.id) {
      setCartId(data.id); setCartData(data);
      localStorage.setItem("medi_cart_id", String(data.id));
      toast(`Welcome, ${name}! 👋`, "success");
    }
  };

  const handleLogout = () => {
    ["medi_name","medi_phone","medi_cart_id"].forEach(k=>localStorage.removeItem(k));
    setUserName(""); setUserPhone(""); setCartId(null); setCartData(null); setPage("home");
  };

  const cartCount = cartData?.items?.length || 0;

  const CSS = `
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    @keyframes slideIn { from { transform: translateX(110px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #00b89460; border-radius: 10px; }
    input, button, select, textarea { font-family: inherit; }
    button { -webkit-tap-highlight-color: transparent; }
    @media (max-width: 767px) {
      input[type="datetime-local"] { font-size: 13px; }
    }
  `;

  if (!userName) return (<><style>{CSS}</style><UserModal onSave={handleUserSave}/></>);

  return (
    <>
      <style>{CSS}</style>
      <Navbar page={page} setPage={setPage} cartCount={cartCount} userName={userName} userPhone={userPhone} onLogout={handleLogout}/>
      <div style={{ minHeight:"calc(100vh - 60px)", animation:"fadeIn .25s ease" }}>
        {page==="home"         && <HomePage        setPage={setPage} setSearch={setSearchInit}/>}
        {page==="medicines"    && <MedicinesPage   cartData={cartData} setCartData={setCartData} cartId={cartId} toast={toast} searchInit={searchInit}/>}
        {page==="cart"         && <CartPage        cartData={cartData} setCartData={setCartData} cartId={cartId} toast={toast} setPage={setPage}/>}
        {page==="prescription" && <PrescriptionPage userName={userName} userPhone={userPhone} toast={toast}/>}
        {page==="consult"      && <ConsultPage     userName={userName} userPhone={userPhone} toast={toast}/>}
        {page==="orders"       && <OrdersPage      userPhone={userPhone}/>}
      </div>
      <Toast toasts={toasts} remove={removeToast}/>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}