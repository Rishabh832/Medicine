import { useState, useEffect, useCallback, useRef } from "react";

/* ── API helpers ── */
// ✅ FIX 1 — API URL relative rakha (localhost hardcode production mein kaam nahi karta)
const API   = "/api";
const get   = (u)    => fetch(API+u).then(r=>r.json());
const post  = (u,b)  => fetch(API+u,{method:"POST",  headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}).then(r=>r.json());
const patch = (u,b)  => fetch(API+u,{method:"PATCH", headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}).then(r=>r.json());

// ✅ FIX 2 — Image URL helper (localhost:8000 hardcode hataya)
function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return path; // Django already returns relative media URLs
}

/* ── Breakpoint hook ── */
function useBreakpoint() {
  const [w, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024));
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

/* ── Icon ── */
const ICONS = {
  dashboard: <><rect x="3"  y="3"  width="7" height="7"/><rect x="14" y="3"  width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3"  y="14" width="7" height="7"/></>,
  pill:      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Zm-7-7 7-7"/>,
  orders:    <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  rx:        <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  steth:     <><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></>,
  category:  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>,
  tag:       <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
  check:     <polyline points="20 6 9 17 4 12"/>,
  x:         <><line x1="18" y1="6" x2="6"  y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  refresh:   <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
  search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  warn:      <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  save:      <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
  menu:      <><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  chevron:   <polyline points="15 18 9 12 15 6"/>,
};
function Icon({ n, s=18, c="currentColor" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[n]}
    </svg>
  );
}

/* ── Toast ── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type="info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, toast };
}
function Toasts({ toasts }) {
  return (
    <div style={{ position:"fixed", top:16, right:16, zIndex:99999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type==="error"?"#ff4757":t.type==="success"?"#00b894":"#2d3436",
          color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:600,
          boxShadow:"0 4px 20px rgba(0,0,0,.4)", display:"flex", alignItems:"center", gap:8,
          animation:"toastIn .25s ease", minWidth:220, maxWidth:300
        }}>
          <Icon n={t.type==="error"?"warn":"check"} s={14} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── Login ── */
function LoginPage({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  function submit() {
    if (pw === "medirun@admin123") { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  }
  return (
    <div style={{ minHeight:"100vh", background:"#0f1117", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:380, padding:"40px 32px", background:"#1a1d27", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,.5)", border:"1px solid #2a2d3a" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:56, height:56, background:"linear-gradient(135deg,#00b894,#00cec9)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
            <Icon n="pill" s={26} c="#fff" />
          </div>
          <h1 style={{ color:"#fff", fontSize:22, fontWeight:800, margin:0 }}>MediRun Admin</h1>
          <p style={{ color:"#636e72", fontSize:12, marginTop:6, marginBottom:0 }}>Secure admin dashboard</p>
        </div>
        <label style={{ color:"#a0a8b8", fontSize:11, fontWeight:700, letterSpacing:1, display:"block", marginBottom:8 }}>ADMIN PASSWORD</label>
        <input
          type="password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key==="Enter" && submit()}
          placeholder="Enter password..."
          style={{ width:"100%", padding:"13px 14px", background:"#0f1117", border:`2px solid ${err?"#ff4757":"#2a2d3a"}`, borderRadius:12, color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }}
        />
        {err && <p style={{ color:"#ff4757", fontSize:12, marginTop:6 }}>Wrong password</p>}
        <button onClick={submit} style={{ width:"100%", marginTop:18, padding:13, background:"linear-gradient(135deg,#00b894,#00cec9)", border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
          Login →
        </button>
        <p style={{ color:"#3a3a3a", fontSize:11, textAlign:"center", marginTop:14, marginBottom:0 }}>Default: medirun@admin123</p>
      </div>
    </div>
  );
}

/* ── Shared UI Components ── */
const STATUS_COLORS = {
  pending:"#fdcb6e", verified:"#00b894", rejected:"#ff4757",
  requested:"#fdcb6e", confirmed:"#00b894", completed:"#0984e3", cancelled:"#ff4757",
  placed:"#fdcb6e", packed:"#6c5ce7", dispatched:"#0984e3", delivered:"#00b894",
};

function Badge({ status }) {
  const col = STATUS_COLORS[status] || "#636e72";
  return (
    <span style={{ background:col+"22", color:col, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, textTransform:"uppercase", letterSpacing:.5, whiteSpace:"nowrap" }}>
      {status}
    </span>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background:"#1a1d27", borderRadius:14, padding:"18px 14px", border:"1px solid #2a2d3a", display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:46, height:46, borderRadius:13, background:color+"22", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon n={icon} s={20} c={color} />
      </div>
      <div>
        <div style={{ fontSize:24, fontWeight:800, color:"#fff", lineHeight:1 }}>{value ?? "-"}</div>
        <div style={{ fontSize:12, color:"#636e72", marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:"#00b894", marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function DataTable({ cols, rows }) {
  return (
    <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:520 }}>
        <thead>
          <tr style={{ borderBottom:"2px solid #2a2d3a" }}>
            {cols.map(c => (
              <th key={c} style={{ padding:"11px 14px", textAlign:"left", color:"#636e72", fontWeight:700, fontSize:10, letterSpacing:.8, textTransform:"uppercase", whiteSpace:"nowrap" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length} style={{ padding:40, textAlign:"center", color:"#444" }}>No data</td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom:"1px solid #2a2d3a" }}
              onMouseEnter={e => e.currentTarget.style.background="#1e2130"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding:"12px 14px", color:"#d0d8e8", verticalAlign:"middle" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusSelect({ value, options, onChange }) {
  const col = STATUS_COLORS[value] || "#d0d8e8";
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ background:"#0f1117", border:"1px solid #2a2d3a", color:col, borderRadius:8, padding:"4px 8px", fontSize:11, fontWeight:700, cursor:"pointer", outline:"none" }}>
      {options.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
    </select>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:16 }}>
      <div style={{ background:"#1a1d27", borderRadius:18, padding:28, width:"100%", maxWidth:540, border:"1px solid #2a2d3a", maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h2 style={{ color:"#fff", fontSize:17, fontWeight:700, margin:0 }}>{title}</h2>
          <button onClick={onClose} style={{ background:"#2a2d3a", border:"none", borderRadius:8, padding:"5px 7px", cursor:"pointer", color:"#fff", display:"flex" }}>
            <Icon n="x" s={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, type="text", placeholder, required }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ color:"#a0a8b8", fontSize:11, fontWeight:700, display:"block", marginBottom:5, letterSpacing:.5 }}>
        {label}{required && <span style={{ color:"#ff4757" }}> *</span>}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        style={{ width:"100%", padding:"10px 13px", background:"#0f1117", border:"1px solid #2a2d3a", borderRadius:10, color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" }}
        onFocus={e  => e.target.style.borderColor="#00b894"}
        onBlur={e   => e.target.style.borderColor="#2a2d3a"}
      />
    </div>
  );
}

function PageHeader({ title, sub, onRefresh, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
      <div>
        <h1 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>{title}</h1>
        {sub && <p style={{ color:"#636e72", fontSize:12, marginTop:3, marginBottom:0 }}>{sub}</p>}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {onRefresh && (
          <button onClick={onRefresh} style={{ background:"#2a2d3a", border:"none", borderRadius:9, padding:"8px 13px", color:"#a0a8b8", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600 }}>
            <Icon n="refresh" s={13} /> Refresh
          </button>
        )}
        {action}
      </div>
    </div>
  );
}

function FilterBar({ options, active, onChange, countFn, activeColor="#0984e3" }) {
  return (
    <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
      {options.map(s => (
        <button key={s} onClick={() => onChange(s)}
          style={{ padding:"6px 12px", borderRadius:7, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, whiteSpace:"nowrap",
            background: active===s ? activeColor : "#2a2d3a",
            color:       active===s ? "#fff"       : "#a0a8b8" }}>
          {s.toUpperCase()}{s !== "all" && countFn ? ` (${countFn(s)})` : ""}
        </button>
      ))}
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard({ toast }) {
  const [stats,   setStats]   = useState({});
  const [recent,  setRecent]  = useState([]);
  const [pendRx,  setPendRx]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useBreakpoint();

  // ✅ FIX 3 — Dashboard orders: admin mein sabhi orders chahiye
  // Backend mein phone filter hai, isliye admin ke liye alag approach
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [meds, rxs, consults] = await Promise.all([
        get("/medicines/"),
        get("/prescriptions/"),
        get("/consultations/"),
      ]);
      const m = Array.isArray(meds)     ? meds     : meds.results     || [];
      const r = Array.isArray(rxs)      ? rxs      : rxs.results      || [];
      const c = Array.isArray(consults) ? consults : consults.results  || [];
      setStats({
        medicines: m.length,
        prescriptions: r.length,
        consultations: c.length,
        pendingRx: r.filter(x => x.status==="pending").length,
        pendingConsults: c.filter(x => x.status==="requested").length,
      });
      setPendRx(r.filter(x => x.status==="pending").slice(0,4));
    } catch(e) { toast("API se connect nahi ho paya","error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={{ color:"#636e72", padding:40, textAlign:"center" }}>Loading dashboard...</div>;

  return (
    <div>
      <PageHeader title="📊 Dashboard" sub="MediRun overview" onRefresh={load} />
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Medicines"     value={stats.medicines}     icon="pill"    color="#00b894" />
        <StatCard label="Prescriptions" value={stats.prescriptions} icon="rx"      color="#6c5ce7" sub={stats.pendingRx+" pending"} />
        <StatCard label="Consultations" value={stats.consultations} icon="steth"   color="#e17055" sub={stats.pendingConsults+" requested"} />
        <StatCard label="Pending Rx"    value={stats.pendingRx}     icon="warn"    color="#fdcb6e" />
      </div>
      <div style={{ background:"#1a1d27", borderRadius:14, padding:20, border:"1px solid #2a2d3a" }}>
        <h3 style={{ color:"#fff", fontSize:14, fontWeight:700, marginBottom:14, marginTop:0 }}>📋 Pending Prescriptions</h3>
        {pendRx.length === 0 ? (
          <p style={{ color:"#00b894", textAlign:"center", padding:16, fontSize:12 }}>✅ Koi pending nahi!</p>
        ) : pendRx.map(rx => (
          <div key={rx.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #2a2d3a" }}>
            <div>
              <div style={{ color:"#d0d8e8", fontWeight:600, fontSize:13 }}>{rx.customer_name}</div>
              <div style={{ color:"#636e72", fontSize:11, marginTop:1 }}>{rx.customer_phone}</div>
            </div>
            <Badge status="pending" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Orders ── */
function Orders({ toast }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const S = ["placed","confirmed","packed","dispatched","delivered","cancelled"];

  // ✅ FIX 3 — Orders: backend phone filter bypass karne ke liye Django admin API use karo
  // Ya backend mein admin access add karo. Abhi ke liye note karo:
  // views.py mein OrderViewSet.get_queryset() mein phone=None hone par qs.none() return hota hai
  // Admin ke liye backend mein ek alag endpoint banana hoga ya JWT auth add karna hoga
  const load = useCallback(async () => {
    setLoading(true);
    const d = await get("/orders/?admin=1");  // backend mein admin param support karo
    setOrders(Array.isArray(d)?d:d.results||[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    const d = await patch("/orders/"+id+"/", { status });
    if (d.id) { setOrders(o => o.map(x => x.id===id ? {...x,status} : x)); toast("Order #"+id+" → "+status,"success"); }
    else toast("Update failed","error");
  }

  const filtered = orders.filter(o => filter==="all" || o.status===filter);
  return (
    <div>
      <PageHeader title="📦 Orders" sub={orders.length+" total orders"} onRefresh={load} />
      <FilterBar options={["all",...S]} active={filter} onChange={setFilter} countFn={s=>orders.filter(o=>o.status===s).length} activeColor="#0984e3" />
      <div style={{ background:"#1a1d27", borderRadius:14, border:"1px solid #2a2d3a", overflow:"hidden" }}>
        {loading ? <div style={{ padding:40, textAlign:"center", color:"#636e72" }}>Loading...</div> : (
          <DataTable
            cols={["ID","Items","Amount","Saved","Address","Status","Update"]}
            rows={filtered.map(o => [
              <span style={{ color:"#00b894", fontWeight:700 }}>#{o.id}</span>,
              (o.items?.length||0)+" items",
              <span style={{ color:"#ffeaa7", fontWeight:700 }}>₹{o.net_amount}</span>,
              o.discount_amount>0 ? <span style={{ color:"#00b894" }}>-₹{o.discount_amount}</span> : <span style={{ color:"#444" }}>—</span>,
              <span style={{ maxWidth:130, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#a0a8b8" }}>{o.delivery_address}</span>,
              <Badge status={o.status} />,
              <StatusSelect value={o.status} options={S} onChange={v=>updateStatus(o.id,v)} />
            ])}
          />
        )}
      </div>
    </div>
  );
}

/* ── Image Upload Modal ── */
function RxImageModal({ rx, onClose, onSaved, toast }) {
  const [imgFile, setImgFile] = useState(null);
  // ✅ FIX 2 — mediaUrl helper use kiya
  const [imgPrev, setImgPrev] = useState(() => mediaUrl(rx.image));
  const [saving,  setSaving]  = useState(false);
  const fileRef = useRef(null);

  function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImgPrev(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function saveImage() {
    if (!imgFile) { toast("Pehle image choose karo","error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("image", imgFile);
      const res = await fetch(API+"/prescriptions/"+rx.id+"/", { method:"PATCH", body:fd });
      const d   = await res.json();
      if (d.id) { toast("Image update ho gayi!","success"); onSaved(d); onClose(); }
      else        toast("Failed: "+JSON.stringify(d),"error");
    } catch(err) { toast("Error: "+err.message,"error"); }
    setSaving(false);
  }

  return (
    <Modal title={"Image Update — Rx #"+rx.id} onClose={onClose}>
      <div style={{ marginBottom:14 }}>
        <p style={{ color:"#a0a8b8", fontSize:13, margin:"0 0 3px" }}>Patient: <strong style={{color:"#fff"}}>{rx.customer_name}</strong></p>
        <p style={{ color:"#a0a8b8", fontSize:13, margin:0 }}>Phone: <strong style={{color:"#fff"}}>{rx.customer_phone}</strong></p>
      </div>
      <div
        onClick={() => fileRef.current && fileRef.current.click()}
        style={{ background:"#0f1117", border:"2px dashed "+(imgFile?"#00b894":"#2a2d3a"), borderRadius:12,
          cursor:"pointer", textAlign:"center", marginBottom:14, overflow:"hidden",
          padding: imgPrev ? 0 : 36 }}
        onMouseEnter={e => e.currentTarget.style.borderColor="#6c5ce7"}
        onMouseLeave={e => e.currentTarget.style.borderColor=(imgFile?"#00b894":"#2a2d3a")}
      >
        {imgPrev ? (
          <img src={imgPrev} alt="preview"
            style={{ width:"100%", maxHeight:260, objectFit:"contain", display:"block", borderRadius:10 }} />
        ) : (
          <>
            <div style={{ fontSize:36, marginBottom:8 }}>📤</div>
            <div style={{ color:"#a0a8b8", fontSize:13, fontWeight:600 }}>Click to choose image</div>
            <div style={{ color:"#636e72", fontSize:11, marginTop:3 }}>JPG, PNG, WEBP</div>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display:"none" }} />
      {imgFile && (
        <div style={{ background:"#00b89422", border:"1px solid #00b89444", borderRadius:8, padding:"7px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <span>✅</span>
          <div>
            <div style={{ color:"#00b894", fontSize:12, fontWeight:700 }}>{imgFile.name}</div>
            <div style={{ color:"#636e72", fontSize:11 }}>{(imgFile.size/1024).toFixed(1)} KB</div>
          </div>
        </div>
      )}
      <div style={{ display:"flex", gap:10 }}>
        <button
          onClick={() => fileRef.current && fileRef.current.click()}
          style={{ flex:1, padding:11, background:"#2a2d3a", border:"none", borderRadius:10, color:"#d0d8e8", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          📁 Browse
        </button>
        <button
          onClick={saveImage}
          disabled={!imgFile || saving}
          style={{ flex:2, padding:11, border:"none", borderRadius:10, fontSize:13, fontWeight:700,
            background: (!imgFile||saving) ? "#2a2d3a" : "linear-gradient(135deg,#6c5ce7,#a29bfe)",
            color:      (!imgFile||saving) ? "#636e72" : "#fff",
            cursor:     (!imgFile||saving) ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          {saving ? "Uploading…" : <><Icon n="save" s={14} /> Save Image</>}
        </button>
      </div>
    </Modal>
  );
}

/* ── Prescriptions ── */
function Prescriptions({ toast }) {
  const [rxs,     setRxs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("pending");
  const [viewImg, setViewImg] = useState(null);
  const [editRx,  setEditRx]  = useState(null);
  const S = ["pending","verified","rejected"];

  // ✅ FIX 4 — useCallback with no deps (stable load function)
  const load = useCallback(async () => {
    setLoading(true);
    const d = await get("/prescriptions/");
    setRxs(Array.isArray(d) ? d : d.results || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  async function updateStatus(id, status) {
    const d = await patch("/prescriptions/"+id+"/", { status });
    if (d.id) { setRxs(r => r.map(x => x.id===id ? {...x,status} : x)); toast("Rx #"+id+" → "+status,"success"); }
    else toast("Update failed","error");
  }

  const filtered = rxs.filter(r => filter==="all" || r.status===filter);

  return (
    <div>
      <PageHeader title="📋 Prescriptions" sub={rxs.filter(r=>r.status==="pending").length+" pending · Auto-refresh 30s"} onRefresh={load} />
      <FilterBar options={["all",...S]} active={filter} onChange={setFilter} countFn={s=>rxs.filter(r=>r.status===s).length} activeColor="#6c5ce7" />
      <div style={{ background:"#1a1d27", borderRadius:14, border:"1px solid #2a2d3a", overflow:"hidden" }}>
        {loading ? (
          <div style={{ padding:40, textAlign:"center", color:"#636e72" }}>Loading...</div>
        ) : (
          <DataTable
            cols={["ID","Patient","Phone","Date","Notes","Image","Status","Action"]}
            rows={filtered.map(rx => [
              <span style={{ color:"#6c5ce7", fontWeight:700 }}>#{rx.id}</span>,
              <span style={{ fontWeight:600 }}>{rx.customer_name}</span>,
              rx.customer_phone,
              new Date(rx.uploaded_at).toLocaleDateString(),
              <span style={{ maxWidth:110, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#a0a8b8" }}>{rx.notes||"—"}</span>,
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {rx.image && (
                  <button onClick={() => setViewImg(mediaUrl(rx.image))}
                    style={{ background:"#6c5ce722", border:"none", borderRadius:6, padding:"4px 8px", color:"#a29bfe", cursor:"pointer", fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:3 }}>
                    <Icon n="eye" s={11} c="#a29bfe" /> View
                  </button>
                )}
                <button onClick={() => setEditRx(rx)}
                  style={{ background:"#fdcb6e22", border:"none", borderRadius:6, padding:"4px 8px", color:"#fdcb6e", cursor:"pointer", fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:3 }}>
                  <Icon n="edit" s={11} c="#fdcb6e" /> {rx.image ? "Change" : "Upload"}
                </button>
              </div>,
              <Badge status={rx.status} />,
              <StatusSelect value={rx.status} options={S} onChange={v=>updateStatus(rx.id,v)} />
            ])}
          />
        )}
      </div>
      {viewImg && (
        <Modal title="Prescription Image" onClose={() => setViewImg(null)}>
          <img src={viewImg} alt="rx" style={{ width:"100%", borderRadius:10, maxHeight:480, objectFit:"contain" }} />
        </Modal>
      )}
      {editRx && (
        <RxImageModal
          rx={editRx} toast={toast}
          onClose={() => setEditRx(null)}
          onSaved={updated => setRxs(r => r.map(x => x.id===updated.id ? updated : x))}
        />
      )}
    </div>
  );
}

/* ── Consultations ── */
function Consultations({ toast }) {
  const [consults, setConsults] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("requested");
  const S    = ["requested","confirmed","completed","cancelled"];
  const DOCS = { general:"👨‍⚕️ General", cardiology:"❤️ Cardiology", neurology:"🧠 Neurology", dentist:"🦷 Dentist", dermatology:"🌿 Derma" };

  const load = useCallback(async () => {
    setLoading(true);
    const d = await get("/consultations/");
    setConsults(Array.isArray(d)?d:d.results||[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  async function updateStatus(id, status) {
    const d = await patch("/consultations/"+id+"/", { status });
    if (d.id) { setConsults(c => c.map(x => x.id===id ? {...x,status} : x)); toast("Consultation #"+id+" → "+status,"success"); }
    else toast("Update failed","error");
  }

  const filtered = consults.filter(c => filter==="all" || c.status===filter);
  return (
    <div>
      <PageHeader title="🩺 Consultations" sub={consults.filter(c=>c.status==="requested").length+" requested · Auto-refresh 30s"} onRefresh={load} />
      <FilterBar options={["all",...S]} active={filter} onChange={setFilter} countFn={s=>consults.filter(c=>c.status===s).length} activeColor="#e17055" />
      <div style={{ background:"#1a1d27", borderRadius:14, border:"1px solid #2a2d3a", overflow:"hidden" }}>
        {loading ? <div style={{ padding:40, textAlign:"center", color:"#636e72" }}>Loading...</div> : (
          <DataTable
            cols={["ID","Patient","Phone","Specialty","Appointment","Symptoms","Status","Action"]}
            rows={filtered.map(c => [
              <span style={{ color:"#e17055", fontWeight:700 }}>#{c.id}</span>,
              <span style={{ fontWeight:600 }}>{c.customer_name}</span>,
              c.customer_phone,
              DOCS[c.specialty] || c.specialty,
              <span style={{ fontSize:11, color:"#636e72", whiteSpace:"nowrap" }}>{new Date(c.appointment_date).toLocaleString()}</span>,
              <span style={{ maxWidth:120, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#a0a8b8" }}>{c.symptoms}</span>,
              <Badge status={c.status} />,
              <StatusSelect value={c.status} options={S} onChange={v=>updateStatus(c.id,v)} />
            ])}
          />
        )}
      </div>
    </div>
  );
}

/* ── Medicines ── */
const MED_EMPTY = { name:"", brand:"", category:"", price:"", mrp:"", stock:"", description:"", requires_prescription:false, discount_percent:0 };
function Medicines({ toast }) {
  const [meds,    setMeds]    = useState([]);
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [form,    setForm]    = useState(MED_EMPTY);
  const [imgFile, setImgFile] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const medFileRef = useRef(null);
  const f = (k, v) => setForm(p => ({...p, [k]:v}));

  function onMedImgChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImgPrev(ev.target.result);
    reader.readAsDataURL(file);
  }

  const load = useCallback(async () => {
    setLoading(true);
    const [d,c] = await Promise.all([get("/medicines/?admin=1"), get("/categories/")]);
    setMeds(Array.isArray(d)?d:d.results||[]);
    setCats(Array.isArray(c)?c:c.results||[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openEdit(m) {
    setForm({ name:m.name, brand:m.brand||"", category:m.category||"", price:m.price, mrp:m.mrp||"", stock:m.stock, description:m.description||"", requires_prescription:m.requires_prescription||false, discount_percent:m.discount_percent||0 });
    setImgFile(null);
    // ✅ FIX 2 — mediaUrl helper use kiya
    setImgPrev(mediaUrl(m.image));
    setEditMed(m); setShowAdd(true);
  }

  function openAdd() {
    setForm(MED_EMPTY); setEditMed(null);
    setImgFile(null); setImgPrev(null);
    setShowAdd(true);
  }

  async function save() {
    if (!form.name || !form.price || form.stock==="") return toast("Name, price, stock required","error");
    try {
      const fd = new FormData();
      Object.entries({...form, price:parseFloat(form.price), mrp:parseFloat(form.mrp)||parseFloat(form.price), stock:parseInt(form.stock), discount_percent:parseInt(form.discount_percent)||0})
        .forEach(([k,v]) => fd.append(k, v));
      if (imgFile) fd.append("image", imgFile);
      const url = API+"/medicines/"+(editMed ? editMed.id+"/" : "");
      const res = await fetch(url, { method: editMed?"PATCH":"POST", body:fd });
      const d   = await res.json();
      if (d.id) { toast(editMed?"Updated!":"Added!","success"); setShowAdd(false); setEditMed(null); setForm(MED_EMPTY); setImgFile(null); setImgPrev(null); load(); }
      else toast("Failed: "+JSON.stringify(d),"error");
    } catch(err) { toast("Error: "+err.message,"error"); }
  }

  const filtered = meds.filter(m => !search || (m.name||"").toLowerCase().includes(search.toLowerCase()) || (m.brand||"").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="💊 Medicines" sub={meds.length+" medicines"} onRefresh={load}
        action={
          <button onClick={openAdd}
            style={{ background:"linear-gradient(135deg,#00b894,#00cec9)", border:"none", borderRadius:9, padding:"8px 14px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700 }}>
            <Icon n="plus" s={13} /> Add Medicine
          </button>
        }
      />
      <div style={{ position:"relative", marginBottom:16 }}>
        <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }}>
          <Icon n="search" s={13} c="#636e72" />
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search medicines..."
          style={{ paddingLeft:33, width:"100%", maxWidth:320, padding:"9px 12px 9px 33px", background:"#1a1d27", border:"1px solid #2a2d3a", borderRadius:9, color:"#d0d8e8", fontSize:13, outline:"none", boxSizing:"border-box" }} />
      </div>
      <div style={{ background:"#1a1d27", borderRadius:14, border:"1px solid #2a2d3a", overflow:"hidden" }}>
        {loading ? <div style={{ padding:40, textAlign:"center", color:"#636e72" }}>Loading...</div> : (
          <DataTable
            cols={["ID","Name","Brand","Price","MRP","Stock","Rx","Disc","Edit"]}
            rows={filtered.map(m => [
              <span style={{ color:"#00b894", fontWeight:700 }}>#{m.id}</span>,
              <span style={{ fontWeight:600 }}>{m.name}</span>,
              <span style={{ color:"#a0a8b8" }}>{m.brand||"—"}</span>,
              <span style={{ color:"#ffeaa7", fontWeight:700 }}>₹{m.price}</span>,
              <span style={{ color:"#636e72", textDecoration:"line-through" }}>₹{m.mrp||m.price}</span>,
              <span style={{ color:m.stock>0?"#00b894":"#ff4757", fontWeight:700 }}>{m.stock}</span>,
              m.requires_prescription ? <span style={{ color:"#e17055", fontSize:10, fontWeight:700 }}>YES</span> : <span style={{ color:"#444" }}>No</span>,
              m.discount_percent>0 ? <span style={{ color:"#00b894", fontSize:10, fontWeight:700 }}>{m.discount_percent}%</span> : <span style={{ color:"#444" }}>—</span>,
              <button onClick={() => openEdit(m)} style={{ background:"#2a2d3a", border:"none", borderRadius:6, padding:"4px 7px", cursor:"pointer", color:"#a0a8b8", display:"flex" }}>
                <Icon n="edit" s={12} />
              </button>
            ])}
          />
        )}
      </div>

      {showAdd && (
        <Modal title={editMed?"Edit Medicine":"Add Medicine"} onClose={() => { setShowAdd(false); setEditMed(null); setImgFile(null); setImgPrev(null); }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
            <Inp label="Name"       value={form.name}             onChange={v=>f("name",v)}             required />
            <Inp label="Brand"      value={form.brand}            onChange={v=>f("brand",v)} />
            <Inp label="Price (₹)"  value={form.price}            onChange={v=>f("price",v)}            type="number" required />
            <Inp label="MRP (₹)"    value={form.mrp}              onChange={v=>f("mrp",v)}              type="number" />
            <Inp label="Stock"      value={form.stock}            onChange={v=>f("stock",v)}            type="number" required />
            <Inp label="Discount %" value={form.discount_percent} onChange={v=>f("discount_percent",v)} type="number" />
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ color:"#a0a8b8", fontSize:11, fontWeight:700, display:"block", marginBottom:5 }}>CATEGORY</label>
            <select value={form.category} onChange={e=>f("category",e.target.value)}
              style={{ width:"100%", padding:"10px 13px", background:"#0f1117", border:"1px solid #2a2d3a", borderRadius:10, color:"#fff", fontSize:13, outline:"none" }}>
              <option value="">Select Category</option>
              {cats.map(c => <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ color:"#a0a8b8", fontSize:11, fontWeight:700, display:"block", marginBottom:5 }}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e=>f("description",e.target.value)} rows={3}
              style={{ width:"100%", padding:"10px 13px", background:"#0f1117", border:"1px solid #2a2d3a", borderRadius:10, color:"#fff", fontSize:13, outline:"none", resize:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
            <input type="checkbox" id="rxchk" checked={form.requires_prescription} onChange={e=>f("requires_prescription",e.target.checked)} style={{ width:16, height:16, cursor:"pointer" }} />
            <label htmlFor="rxchk" style={{ color:"#d0d8e8", fontSize:13, cursor:"pointer" }}>Requires Prescription (Rx)</label>
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ color:"#a0a8b8", fontSize:11, fontWeight:700, display:"block", marginBottom:6, letterSpacing:.5 }}>MEDICINE IMAGE</label>
            <div
              onClick={() => medFileRef.current && medFileRef.current.click()}
              style={{ background:"#0f1117", border:"2px dashed "+(imgFile?"#00b894":"#2a2d3a"), borderRadius:11, cursor:"pointer", textAlign:"center", overflow:"hidden", padding:imgPrev?0:28, transition:"border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#00b894"}
              onMouseLeave={e => e.currentTarget.style.borderColor=(imgFile?"#00b894":"#2a2d3a")}
            >
              {imgPrev ? (
                <div style={{ position:"relative" }}>
                  <img src={imgPrev} alt="preview" style={{ width:"100%", maxHeight:180, objectFit:"contain", display:"block", borderRadius:9 }} />
                  <div style={{ position:"absolute", bottom:6, right:8, background:"rgba(0,0,0,.65)", borderRadius:7, padding:"3px 10px", color:"#fff", fontSize:11, fontWeight:600 }}>🔄 Click to change</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:28, marginBottom:6 }}>🖼️</div>
                  <div style={{ color:"#a0a8b8", fontSize:12, fontWeight:600 }}>Click to upload image</div>
                  <div style={{ color:"#636e72", fontSize:11, marginTop:3 }}>JPG, PNG, WEBP</div>
                </>
              )}
            </div>
            <input ref={medFileRef} type="file" accept="image/*" onChange={onMedImgChange} style={{ display:"none" }} />
            {imgFile && (
              <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:8, background:"#00b89422", border:"1px solid #00b89444", borderRadius:8, padding:"6px 11px" }}>
                <span>✅</span>
                <span style={{ color:"#00b894", fontSize:12, fontWeight:600 }}>{imgFile.name}</span>
                <span style={{ color:"#636e72", fontSize:11, marginLeft:"auto" }}>{(imgFile.size/1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
          <button onClick={save} style={{ width:"100%", padding:13, background:"linear-gradient(135deg,#00b894,#00cec9)", border:"none", borderRadius:11, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <Icon n="save" s={15} /> {editMed?"Update Medicine":"Add Medicine"}
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ── Categories ── */
function Categories({ toast }) {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState({ name:"", slug:"", icon:"💊", description:"" });
  const f = (k, v) => setForm(p => ({...p, [k]:v}));

  const load = useCallback(async () => {
    setLoading(true);
    const d = await get("/categories/");
    setCats(Array.isArray(d)?d:d.results||[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!form.name || !form.slug) return toast("Name and slug required","error");
    const d = await post("/categories/", form);
    if (d.id) { toast("Category added!","success"); setShowAdd(false); setForm({name:"",slug:"",icon:"💊",description:""}); load(); }
    else toast("Failed: "+JSON.stringify(d),"error");
  }

  return (
    <div>
      <PageHeader title="📂 Categories" sub={cats.length+" categories"}
        action={
          <button onClick={() => setShowAdd(true)}
            style={{ background:"linear-gradient(135deg,#6c5ce7,#a29bfe)", border:"none", borderRadius:9, padding:"8px 14px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700 }}>
            <Icon n="plus" s={13} /> Add Category
          </button>
        }
      />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:14 }}>
        {loading ? <div style={{ color:"#636e72" }}>Loading...</div> : cats.map(c => (
          <div key={c.id} style={{ background:"#1a1d27", borderRadius:13, padding:18, border:"1px solid #2a2d3a" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>{c.icon}</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{c.name}</div>
            <div style={{ color:"#636e72", fontSize:11, marginTop:3 }}>/{c.slug}</div>
            {c.description && <div style={{ color:"#a0a8b8", fontSize:11, marginTop:5 }}>{c.description}</div>}
          </div>
        ))}
      </div>
      {showAdd && (
        <Modal title="Add Category" onClose={() => setShowAdd(false)}>
          <Inp label="Name"        value={form.name}        onChange={v=>f("name",v)} required />
          <Inp label="Slug"        value={form.slug}        onChange={v=>f("slug",v.toLowerCase().replace(/\s+/g,"-"))} placeholder="pain-relief" required />
          <Inp label="Icon Emoji"  value={form.icon}        onChange={v=>f("icon",v)} />
          <Inp label="Description" value={form.description} onChange={v=>f("description",v)} />
          <button onClick={save} style={{ width:"100%", padding:13, background:"linear-gradient(135deg,#6c5ce7,#a29bfe)", border:"none", borderRadius:11, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
            Add Category
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ── Offers ── */
function Offers({ toast }) {
  const [offers,  setOffers]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState({ title:"", subtitle:"", code:"", discount_percent:0, emoji:"🎉", color:"#00b894" });
  const f = (k, v) => setForm(p => ({...p, [k]:v}));

  const load = useCallback(async () => {
    setLoading(true);
    const d = await get("/offers/");
    setOffers(Array.isArray(d)?d:d.results||[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!form.title) return toast("Title required","error");
    const d = await post("/offers/", {...form, discount_percent:parseInt(form.discount_percent)||0});
    if (d.id) { toast("Offer added!","success"); setShowAdd(false); setForm({title:"",subtitle:"",code:"",discount_percent:0,emoji:"🎉",color:"#00b894"}); load(); }
    else toast("Failed: "+JSON.stringify(d),"error");
  }

  return (
    <div>
      <PageHeader title="🏷️ Offers" sub={offers.length+" offers"}
        action={
          <button onClick={() => setShowAdd(true)}
            style={{ background:"linear-gradient(135deg,#fdcb6e,#e17055)", border:"none", borderRadius:9, padding:"8px 14px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700 }}>
            <Icon n="plus" s={13} /> Add Offer
          </button>
        }
      />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:14 }}>
        {loading ? <div style={{ color:"#636e72" }}>Loading...</div> : offers.map(o => {
          const col = o.color || "#00b894";
          return (
            <div key={o.id} style={{ background:"linear-gradient(135deg,"+col+"22,"+col+"44)", borderRadius:14, padding:18, border:"1px solid "+col+"33" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:28 }}>{o.emoji}</span>
                {o.discount_percent>0 && <span style={{ background:col, color:"#fff", fontWeight:800, fontSize:16, padding:"3px 10px", borderRadius:9 }}>{o.discount_percent}% OFF</span>}
              </div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{o.title}</div>
              <div style={{ color:"#d0d8e8", fontSize:12, marginTop:3 }}>{o.subtitle}</div>
              {o.code && <div style={{ background:"rgba(0,0,0,.3)", borderRadius:7, padding:"4px 10px", display:"inline-block", marginTop:8, fontFamily:"monospace", color:"#ffeaa7", fontWeight:700, letterSpacing:1, fontSize:12 }}>CODE: {o.code}</div>}
            </div>
          );
        })}
      </div>
      {showAdd && (
        <Modal title="Add Offer" onClose={() => setShowAdd(false)}>
          <Inp label="Title"    value={form.title}    onChange={v=>f("title",v)} required />
          <Inp label="Subtitle" value={form.subtitle} onChange={v=>f("subtitle",v)} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
            <Inp label="Coupon Code" value={form.code}             onChange={v=>f("code",v.toUpperCase())} placeholder="SAVE20" />
            <Inp label="Discount %"  value={form.discount_percent} onChange={v=>f("discount_percent",v)} type="number" />
            <Inp label="Emoji"       value={form.emoji}            onChange={v=>f("emoji",v)} />
            <div style={{ marginBottom:14 }}>
              <label style={{ color:"#a0a8b8", fontSize:11, fontWeight:700, display:"block", marginBottom:5 }}>COLOR</label>
              <input type="color" value={form.color} onChange={e=>f("color",e.target.value)}
                style={{ width:"100%", height:40, padding:2, background:"#0f1117", border:"1px solid #2a2d3a", borderRadius:9, cursor:"pointer" }} />
            </div>
          </div>
          <button onClick={save} style={{ width:"100%", padding:13, background:"linear-gradient(135deg,#fdcb6e,#e17055)", border:"none", borderRadius:11, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
            Add Offer
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ── Nav Pages Config ── */
const PAGES = [
  { id:"dashboard",  label:"Dashboard",     icon:"dashboard", color:"#00b894" },
  { id:"orders",     label:"Orders",        icon:"orders",    color:"#0984e3" },
  { id:"rx",         label:"Prescriptions", icon:"rx",        color:"#6c5ce7" },
  { id:"consults",   label:"Consultations", icon:"steth",     color:"#e17055" },
  { id:"medicines",  label:"Medicines",     icon:"pill",      color:"#00cec9" },
  { id:"categories", label:"Categories",    icon:"category",  color:"#a29bfe" },
  { id:"offers",     label:"Offers",        icon:"tag",       color:"#fdcb6e" },
];

function NavItem({ p, activePage, setPage, showLabels, onNavigate, stats }) {
  const active = activePage === p.id;
  const badge  = p.id==="rx" ? stats?.pendingRx : p.id==="consults" ? stats?.pendingConsults : null;
  return (
    <button
      onClick={() => { setPage(p.id); onNavigate && onNavigate(); }}
      title={!showLabels ? p.label : undefined}
      style={{
        width:"100%", display:"flex", alignItems:"center",
        gap:showLabels?10:0, justifyContent:showLabels?"flex-start":"center",
        padding:showLabels?"10px 12px":"10px",
        borderRadius:10, border:"none", cursor:"pointer", marginBottom:3,
        background:active ? p.color+"22" : "transparent",
        position:"relative", transition:"background .15s"
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background="#1e2130"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background=active?p.color+"22":"transparent"; }}
    >
      <Icon n={p.icon} s={17} c={active ? p.color : "#636e72"} />
      {showLabels && (
        <span style={{ color:active?p.color:"#a0a8b8", fontWeight:active?700:500, fontSize:13, flex:1, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
          {p.label}
        </span>
      )}
      {badge > 0 && (
        <span style={{
          background:"#ff4757", color:"#fff", fontSize:9, fontWeight:800, borderRadius:20,
          padding:"1px 5px", minWidth:16, textAlign:"center",
          position: showLabels ? "relative" : "absolute",
          top: showLabels ? "auto" : 4, right: showLabels ? "auto" : 4
        }}>{badge}</span>
      )}
    </button>
  );
}

function Sidebar({ page, setPage, onLogout, stats, collapsed, onToggle }) {
  const w = collapsed ? 56 : 220;
  const showLabels = !collapsed;
  return (
    <aside style={{ width:w, minHeight:"100vh", background:"#13151e", borderRight:"1px solid #2a2d3a", flexShrink:0, transition:"width .22s ease", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:showLabels?"20px 16px 14px":"14px 8px", borderBottom:"1px solid #2a2d3a", display:"flex", alignItems:"center", justifyContent:showLabels?"space-between":"center", flexShrink:0 }}>
        {showLabels && (
          <div style={{ display:"flex", alignItems:"center", gap:9, minWidth:0 }}>
            <div style={{ width:33, height:33, background:"linear-gradient(135deg,#00b894,#00cec9)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon n="pill" s={15} c="#fff" />
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>MediRun</div>
              <div style={{ color:"#636e72", fontSize:9, fontWeight:600, letterSpacing:.5 }}>ADMIN PANEL</div>
            </div>
          </div>
        )}
        <button onClick={onToggle}
          style={{ background:"#2a2d3a", border:"none", borderRadius:7, padding:"5px 6px", cursor:"pointer", color:"#a0a8b8", display:"flex", flexShrink:0, transform:collapsed?"rotate(180deg)":"none", transition:"transform .2s" }}>
          <Icon n="chevron" s={14} />
        </button>
      </div>
      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        {PAGES.map(p => <NavItem key={p.id} p={p} activePage={page} setPage={setPage} showLabels={showLabels} stats={stats} />)}
      </nav>
      <div style={{ padding:"10px 8px", borderTop:"1px solid #2a2d3a", flexShrink:0 }}>
        <button onClick={onLogout} title={!showLabels?"Logout":undefined}
          style={{ width:"100%", display:"flex", alignItems:"center", gap:showLabels?10:0, justifyContent:showLabels?"flex-start":"center", padding:showLabels?"9px 12px":"10px", borderRadius:10, border:"none", cursor:"pointer", background:"transparent" }}
          onMouseEnter={e => e.currentTarget.style.background="#ff475722"}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          <Icon n="logout" s={16} c="#ff4757" />
          {showLabels && <span style={{ color:"#ff4757", fontSize:13, fontWeight:600 }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

function MobileDrawer({ page, setPage, onLogout, stats, open, onClose }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.65)", zIndex:9990 }} />}
      <aside style={{
        position:"fixed", top:0, left:0, bottom:0, width:240,
        background:"#13151e", borderRight:"1px solid #2a2d3a",
        zIndex:9991, transform:open?"translateX(0)":"translateX(-100%)",
        transition:"transform .25s ease", display:"flex", flexDirection:"column"
      }}>
        <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid #2a2d3a", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:32, height:32, background:"linear-gradient(135deg,#00b894,#00cec9)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon n="pill" s={14} c="#fff" />
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>MediRun</div>
              <div style={{ color:"#636e72", fontSize:9, fontWeight:600, letterSpacing:.5 }}>ADMIN PANEL</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"#2a2d3a", border:"none", borderRadius:7, padding:"5px 6px", cursor:"pointer", color:"#fff", display:"flex" }}>
            <Icon n="x" s={15} />
          </button>
        </div>
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {PAGES.map(p => <NavItem key={p.id} p={p} activePage={page} setPage={setPage} showLabels={true} onNavigate={onClose} stats={stats} />)}
        </nav>
        <div style={{ padding:"10px 8px", borderTop:"1px solid #2a2d3a", flexShrink:0 }}>
          <button onClick={() => { onLogout(); onClose(); }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer", background:"transparent" }}
            onMouseEnter={e=>e.currentTarget.style.background="#ff475722"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Icon n="logout" s={16} c="#ff4757" />
            <span style={{ color:"#ff4757", fontSize:13, fontWeight:600 }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ page, onMenu, stats }) {
  const p = PAGES.find(x => x.id===page) || PAGES[0];
  const total = (stats?.pendingRx||0) + (stats?.pendingConsults||0);
  return (
    <div style={{ position:"sticky", top:0, zIndex:100, background:"#13151e", borderBottom:"1px solid #2a2d3a", padding:"11px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={onMenu} style={{ background:"#2a2d3a", border:"none", borderRadius:8, padding:"7px 8px", cursor:"pointer", color:"#fff", display:"flex", position:"relative" }}>
          <Icon n="menu" s={17} />
          {total > 0 && <span style={{ position:"absolute", top:-3, right:-3, background:"#ff4757", color:"#fff", fontSize:9, fontWeight:800, borderRadius:20, padding:"0 4px", minWidth:14, textAlign:"center" }}>{total}</span>}
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ width:27, height:27, background:"linear-gradient(135deg,#00b894,#00cec9)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon n="pill" s={12} c="#fff" />
          </div>
          <span style={{ color:"#fff", fontWeight:800, fontSize:14 }}>MediRun</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <Icon n={p.icon} s={14} c={p.color} />
        <span style={{ color:p.color, fontSize:12, fontWeight:700 }}>{p.label}</span>
      </div>
    </div>
  );
}

function BottomNav({ page, setPage, stats }) {
  const main = PAGES.slice(0, 5);
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"#13151e", borderTop:"1px solid #2a2d3a", display:"flex", zIndex:200 }}>
      {main.map(p => {
        const active = page === p.id;
        const badge  = p.id==="rx" ? stats?.pendingRx : p.id==="consults" ? stats?.pendingConsults : null;
        return (
          <button key={p.id} onClick={() => setPage(p.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"9px 4px 7px", background:"transparent", border:"none", cursor:"pointer", position:"relative", gap:3 }}>
            <div style={{ position:"relative" }}>
              <Icon n={p.icon} s={19} c={active ? p.color : "#444"} />
              {badge > 0 && <span style={{ position:"absolute", top:-4, right:-5, background:"#ff4757", color:"#fff", fontSize:8, fontWeight:800, borderRadius:20, padding:"0 3px", minWidth:12, textAlign:"center" }}>{badge}</span>}
            </div>
            <span style={{ fontSize:9, fontWeight:active?700:400, color:active?p.color:"#444", lineHeight:1 }}>{p.label.split(" ")[0]}</span>
            {active && <div style={{ position:"absolute", bottom:0, left:"25%", right:"25%", height:2, background:p.color, borderRadius:2 }} />}
          </button>
        );
      })}
    </nav>
  );
}

const COMP_MAP = {
  dashboard:  Dashboard,
  orders:     Orders,
  rx:         Prescriptions,
  consults:   Consultations,
  medicines:  Medicines,
  categories: Categories,
  offers:     Offers,
};

export default function AdminApp() {
  const [authed,     setAuthed]     = useState(() => localStorage.getItem("medi_admin") === "1");
  const [page,       setPage]       = useState("dashboard");
  const [stats,      setStats]      = useState({});
  const [collapsed,  setCollapsed]  = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toasts, toast } = useToast();
  const { isMobile, isTablet } = useBreakpoint();

  useEffect(() => { if (isTablet) setCollapsed(true); }, [isTablet]);

  // ✅ FIX 4 — useCallback with authed dep
  const loadStats = useCallback(async () => {
    if (!authed) return;
    try {
      const [rxs, consults] = await Promise.all([get("/prescriptions/"), get("/consultations/")]);
      const r = Array.isArray(rxs)     ? rxs     : rxs.results     || [];
      const c = Array.isArray(consults) ? consults : consults.results || [];
      setStats({ pendingRx: r.filter(x=>x.status==="pending").length, pendingConsults: c.filter(x=>x.status==="requested").length });
    } catch(e) {}
  }, [authed]);

  useEffect(() => {
    loadStats();
    const t = setInterval(loadStats, 30000);
    return () => clearInterval(t);
  }, [loadStats]);

  const login  = () => { localStorage.setItem("medi_admin","1"); setAuthed(true); };
  const logout = () => { localStorage.removeItem("medi_admin");  setAuthed(false); };

  const CSS = `
    *, *::before, *::after { box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
    html, body { margin:0; padding:0; background:#0f1117; -webkit-tap-highlight-color:transparent; overflow-x:hidden; max-width:100vw; }
    #root, [data-reactroot] { overflow-x:hidden; max-width:100vw; }
    @keyframes toastIn { from { transform:translateX(60px); opacity:0 } to { transform:translateX(0); opacity:1 } }
    ::-webkit-scrollbar { width:4px; height:4px }
    ::-webkit-scrollbar-track { background:#0f1117 }
    ::-webkit-scrollbar-thumb { background:#2a2d3a; border-radius:3px }
    select option { background:#1a1d27; color:#d0d8e8 }
    button, input, select, textarea { font-family:inherit; }
  `;

  if (!authed) {
    return (
      <>
        <style>{CSS}</style>
        <LoginPage onLogin={login} />
        <Toasts toasts={toasts} />
      </>
    );
  }

  const PageComp = COMP_MAP[page] || Dashboard;

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display:"flex", height:"100vh", background:"#0f1117", overflow:"hidden", maxWidth:"100vw", position:"relative" }}>
        {!isMobile && (
          <Sidebar page={page} setPage={setPage} onLogout={logout} stats={stats}
            collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        )}
        {isMobile && (
          <MobileDrawer page={page} setPage={setPage} onLogout={logout} stats={stats}
            open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        )}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
          {isMobile && <TopBar page={page} onMenu={() => setDrawerOpen(true)} stats={stats} />}
          <main style={{ flex:1, overflowY:"auto", padding:isMobile?"16px 14px 80px":"24px 28px", WebkitOverflowScrolling:"touch" }}>
            <PageComp toast={toast} />
          </main>
          {isMobile && <BottomNav page={page} setPage={setPage} stats={stats} />}
        </div>
      </div>
      <Toasts toasts={toasts} />
    </>
  );
}