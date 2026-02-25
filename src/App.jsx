import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useCallback, useRef } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, ReferenceLine
} from "recharts";
import {
  Zap, AlertTriangle, Battery, TrendingUp, Sun, Wind,
  Droplets, Activity, CheckCircle, RefreshCw,
  Cpu, Radio, Thermometer,
  Shield, BarChart2, Layers, Eye, Filter, Plus, Trash2,
  DollarSign, Leaf,
  X, Save, Wrench, FileWarning, ClipboardList,
  CheckSquare, Square, ChevronDown, Hammer,
  Lock, LogIn, UserPlus, Users, UserCheck, UserX,
  Crown, LogOut, UserCog, ShieldCheck, ShieldOff,
  Star, MapPinned, History, Edit3, Database, Send,
  MessageSquare, Bell, BellRing, Inbox, MessageCircle, ArrowLeft, AtSign, Reply,
  PenLine, Settings2, Circle, CheckCheck
} from "lucide-react";

// ============================================================
// SUPABASE CLIENT
// ============================================================
const SUPABASE_URL = "https://psvobvcuczallzmyqnjm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdm9idmN1Y3phbGx6bXlxbmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTEwNzAsImV4cCI6MjA4NzMyNzA3MH0.94u6a0xpU3mNei4BsBxzWYIP2TDmHfP6TaXmETgp3zY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// CONSTANTS
// ============================================================
const NODES = [
  { id:"naxModul",     label:"Naxçıvan Modul Elektrik Stansiyası",  region:"Naxçıvan Şəhər",  type:"thermal",  icon:Zap,         color:"#f97316", sensors:{boilerTemp:420,steamPressure:14.2,output:82.1},     deltas:{boilerTemp:[2,0.5],steamPressure:[0.2,0.5],output:[0.8,0.5]} },
  { id:"arazHydro",    label:"Araz Su Elektrik Stansiyası",          region:"Ordubad Rayonu",  type:"hydro",    icon:Droplets,    color:"#0ea5e9", sensors:{waterLevel:22.4,turbineRpm:980,output:19.8},         deltas:{waterLevel:[0.1,0.5],turbineRpm:[15,0.5],output:[0.4,0.5]} },
  { id:"bilavHydro",   label:"Biləv Su Elektrik Stansiyası",         region:"Ordubad Rayonu",  type:"hydro",    icon:Droplets,    color:"#38bdf8", sensors:{waterLevel:18.1,turbineRpm:920,output:17.6},         deltas:{waterLevel:[0.1,0.5],turbineRpm:[12,0.5],output:[0.3,0.5]} },
  { id:"arpachay1",    label:"Arpaçay-1 Su Elektrik Stansiyası",     region:"Sədərək Rayonu",  type:"hydro",    icon:Droplets,    color:"#06b6d4", sensors:{waterLevel:16.5,turbineRpm:870,output:18.2},         deltas:{waterLevel:[0.1,0.5],turbineRpm:[10,0.5],output:[0.3,0.5]} },
  { id:"naxSolar",     label:"Naxçıvan Günəş Elektrik Stansiyası",   region:"Naxçıvan Şəhər",  type:"solar",    icon:Sun,         color:"#eab308", sensors:{panelTemp:52,output:19.4,efficiency:88},             deltas:{panelTemp:[0.4,0.5],output:[0.4,0.5],efficiency:[0.1,0.5]} },
  { id:"sherurSolar",  label:"Şərur Günəş Elektrik Stansiyası",      region:"Şərur Rayonu",    type:"solar",    icon:Sun,         color:"#f59e0b", sensors:{panelTemp:50,output:9.7,efficiency:88},              deltas:{panelTemp:[0.3,0.5],output:[0.2,0.5],efficiency:[0.1,0.5]} },
  { id:"kengerliSolar",label:"Kəngərli Günəş Elektrik Stansiyası",   region:"Kəngərli Rayonu", type:"solar",    icon:Sun,         color:"#fbbf24", sensors:{panelTemp:48,output:4.3,efficiency:86},              deltas:{panelTemp:[0.3,0.5],output:[0.15,0.5],efficiency:[0.1,0.5]} },
  { id:"arpachay2",    label:"Arpaçay-2 Su Elektrik Stansiyası",     region:"Sədərək Rayonu",  type:"hydro",    icon:Droplets,    color:"#67e8f9", sensors:{waterLevel:8.2,turbineRpm:620,output:1.1},           deltas:{waterLevel:[0.05,0.5],turbineRpm:[8,0.5],output:[0.05,0.5]} },
  { id:"culfaHybrid",  label:"Culfa Külək-Günəş Hibrid Stansiyası",  region:"Culfa Rayonu",    type:"wind",     icon:Wind,        color:"#10b981", sensors:{rpm:1120,bearingTemp:64,vibration:1.1,output:0.95},  deltas:{rpm:[18,0.5],bearingTemp:[0.4,0.45],vibration:[0.08,0.4],output:[0.04,0.5]} },
  { id:"culfaWind",    label:"Culfa Külək Elektrik Stansiyası",       region:"Culfa Rayonu",    type:"wind",     icon:Wind,        color:"#34d399", sensors:{rpm:980,bearingTemp:58,vibration:0.9,output:0.26},   deltas:{rpm:[15,0.5],bearingTemp:[0.3,0.45],vibration:[0.05,0.4],output:[0.02,0.5]} }
];

const REGIONS = [...new Set(NODES.map(n => n.region))];

const SERVICE_AREAS = {
  "Rayonlar": [
    "Naxçıvan Şəhər","Sədərək Rayonu","Şərur Rayonu","Kəngərli Rayonu",
    "Babək Rayonu","Şahbuz Rayonu","Culfa Rayonu","Ordubad Rayonu"
  ],
  "Stansiyalar": NODES.map(n => n.label)
};

const SEVERITY_MAP = {
  yüksək:{ color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.35)",  label:"KRİTİK" },
  orta:  { color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.3)",  label:"DİQQƏT" },
  aşağı: { color:"#10b981", bg:"rgba(16,185,129,0.08)", border:"rgba(16,185,129,0.25)", label:"NORMAL" }
};

const DIST_ZONES = [
  { name:"Naxçıvan Şəhər", load:98, capacity:124, health:95 },
  { name:"Sədərək",        load:52, capacity:60,  health:88 },
  { name:"Şərur",          load:28, capacity:35,  health:92 },
  { name:"Kəngərli",       load:22, capacity:30,  health:97 },
  { name:"Babək",          load:26, capacity:80,  health:97 },
  { name:"Şahbuz",         load:56, capacity:67,  health:97 },
  { name:"Culfa",          load:48, capacity:80,  health:97 },
  { name:"Ordubad",        load:49, capacity:70,  health:97 }
];

const CONS_HISTORY = [
  {t:"00:00",i:45,p:44},{t:"04:00",i:38,p:39},{t:"08:00",i:62,p:61},
  {t:"12:00",i:78,p:76},{t:"16:00",i:72,p:74},{t:"20:00",i:85,p:83},{t:"İndi",i:67,p:69}
];

const ENERGY_SOURCES = [
  { name:"Modul (İstilik)",  cap:87,   cur:82.1,  eff:94, icon:Zap,      color:"#f97316" },
  { name:"Araz SES",         cap:22,   cur:19.8,  eff:90, icon:Droplets, color:"#0ea5e9" },
  { name:"Biləv SES",        cap:20,   cur:17.6,  eff:88, icon:Droplets, color:"#38bdf8" },
  { name:"Arpaçay-1 SES",    cap:20.5, cur:18.2,  eff:89, icon:Droplets, color:"#67e8f9" },
  { name:"Naxçıvan GES",     cap:22,   cur:19.4,  eff:88, icon:Sun,      color:"#eab308" },
  { name:"Şərur GES",        cap:11,   cur:9.7,   eff:88, icon:Sun,      color:"#f59e0b" },
  { name:"Kəngərli GES",     cap:5,    cur:4.3,   eff:86, icon:Sun,      color:"#fbbf24" },
  { name:"Arpaçay-2 + Culfa",cap:2.8,  cur:2.37,  eff:85, icon:Wind,     color:"#10b981" },
];

const TOTAL_CAPACITY = ENERGY_SOURCES.reduce((s,e) => s + e.cap, 0);

function normalizeRole(role) {
  if (!role) return "viewer";
  const map = { observer:"viewer", viewer:"viewer", operator:"operator", admin:"admin", vice_admin:"vice_admin" };
  return map[role] || "viewer";
}

const ROLES_DEF = [
  { id:"admin",       label:"Administrator",  color:"#ef4444", icon:Crown,   desc:"Tam idarəetmə hüququ" },
  { id:"vice_admin",  label:"Baş Müavin",    color:"#f97316", icon:Star,    desc:"Operator və müşahidəçilərə nəzarət" },
  { id:"operator",    label:"Operator",       color:"#f59e0b", icon:UserCog, desc:"Stansiyalar üzrə əməliyyat hüququ" },
  { id:"viewer",      label:"Müşahidəçi",     color:"#10b981", icon:Eye,     desc:"Yalnız baxış hüququ" }
];

function getPerms(user) {
  if (!user) return {};
  const r = user.role;
  return {
    isAdmin:           r === "admin",
    isViceAdmin:       r === "vice_admin",
    isOperator:        r === "operator",
    isViewer:          r === "viewer",
    canSeeAdminTab:    r === "admin" || r === "vice_admin",
    canManageOps:      r === "admin" || r === "vice_admin",
    canManageAdmins:   r === "admin",
    canEditStations:   r === "admin" || r === "vice_admin" || r === "operator",
    canEditStrategies: r === "admin" || r === "vice_admin" || r === "operator",
    canAddIncidents:   r === "admin" || r === "vice_admin" || r === "operator",
    canEnterData:      r === "admin" || r === "vice_admin" || r === "operator",
    readOnly:          r === "viewer",
    canSeeActivityLog: r === "admin",
    canBroadcast:      r === "admin",
    canDeleteEntries:  r === "admin"
  };
}

function useSensors() {
  const [data, setData] = useState(() => Object.fromEntries(NODES.map(n => [n.id, { ...n.sensors }])));
  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => {
        const next = { ...prev };
        NODES.forEach(node => {
          const s = { ...prev[node.id] };
          Object.keys(s).forEach(k => {
            const [range, bias] = node.deltas[k] || [0, 0.5];
            if (typeof s[k] === "number") s[k] = parseFloat((s[k] + (Math.random() - bias) * range).toFixed(3));
          });
          next[node.id] = s;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(iv);
  }, []);
  return data;
}

function RoleBadge({ role, size="sm" }) {
  const rd = ROLES_DEF.find(r=>r.id===role)||ROLES_DEF[3];
  const Icon = rd.icon;
  const fs = size==="xs"?"0.52rem":size==="sm"?"0.58rem":"0.65rem";
  return (
    <span style={{fontSize:fs,color:rd.color,background:`${rd.color}12`,border:`1px solid ${rd.color}25`,borderRadius:4,padding:"1px 6px",display:"inline-flex",alignItems:"center",gap:3,fontWeight:800}}>
      <Icon size={size==="xs"?8:10}/> {rd.label}
    </span>
  );
}

function PermissionBanner({ message }) {
  return (
    <div style={{background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
      <Lock size={13} style={{color:"#f97316",flexShrink:0}}/>
      <span style={{fontSize:"0.72rem",color:"#fdba74"}}>{message}</span>
    </div>
  );
}

function relTime(iso) {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d/60000);
  if (m < 1) return "İndicə";
  if (m < 60) return `${m} dəq`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h} saat`;
  return `${Math.floor(h/24)} gün`;
}

function DropdownOption({ opt, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onSelect} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,
        background:selected?"rgba(56,189,248,0.1)":hov?"rgba(255,255,255,0.03)":"transparent",
        borderLeft:`2px solid ${selected?"#38bdf8":"transparent"}`,transition:"all 0.15s"}}>
      {opt.colorDot&&<div style={{width:8,height:8,borderRadius:"50%",background:opt.colorDot,flexShrink:0,boxShadow:selected?`0 0 6px ${opt.colorDot}`:"none"}}/>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:"0.73rem",color:selected?"#f1f5f9":hov?"#cbd5e1":"#94a3b8",fontWeight:selected?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{opt.label}</div>
        {opt.sub&&<div style={{fontSize:"0.58rem",color:"#334155",marginTop:1}}>{opt.sub}</div>}
      </div>
      {selected&&<div style={{width:16,height:16,borderRadius:"50%",background:"rgba(56,189,248,0.15)",border:"1px solid rgba(56,189,248,0.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#38bdf8"}}/>
      </div>}
    </div>
  );
}

function DarkSelect({ value, onChange, options, placeholder, style, grouped, accentColor="#38bdf8" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const allOptions = grouped ? grouped.reduce((acc,g)=>[...acc,...g.options.map(o=>({...o,group:g.label}))],[]) : (options||[]);
  const selected = allOptions.find(o => o.value === value);
  return (
    <div ref={ref} style={{position:"relative",width:"100%",boxSizing:"border-box",...style}}>
      <button type="button" onClick={()=>setOpen(o=>!o)} style={{
        width:"100%",boxSizing:"border-box",
        background:open?"linear-gradient(135deg,rgba(8,16,30,0.99),rgba(4,10,22,0.99))":"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",
        border:`1px solid ${open?`${accentColor}60`:`${accentColor}20`}`,
        borderRadius:9,padding:"9px 36px 9px 12px",color:selected?"#e2e8f0":"#334155",
        fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",gap:8,
        transition:"all 0.2s",outline:"none",fontFamily:"inherit",
        position:"relative"
      }}>
        {selected?.colorDot&&<div style={{width:8,height:8,borderRadius:"50%",background:selected.colorDot,flexShrink:0}}/>}
        <span style={{flex:1,textAlign:"left",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {selected?selected.label:(placeholder||"— Seçin —")}
        </span>
        <ChevronDown size={13} style={{color:accentColor,flexShrink:0,position:"absolute",right:12,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}/>
      </button>
      {open&&(
        <div style={{
          position:"absolute",top:"calc(100% + 4px)",left:0,right:0,
          background:"linear-gradient(160deg,rgba(6,12,28,0.99),rgba(4,8,20,0.99))",
          border:`1px solid ${accentColor}30`,borderRadius:10,zIndex:9999,maxHeight:280,overflowY:"auto",
          boxShadow:`0 16px 40px rgba(0,0,0,0.6),0 0 0 1px ${accentColor}10`,backdropFilter:"blur(20px)",
        }}>
          {grouped?grouped.map((group,gi)=>(
            <div key={gi}>
              <div style={{padding:"8px 14px 4px",fontSize:"0.55rem",color:accentColor,letterSpacing:"0.14em",fontWeight:800,borderBottom:`1px solid ${accentColor}12`,background:`${accentColor}04`}}>{group.label}</div>
              {group.options.map((opt,oi)=><DropdownOption key={oi} opt={opt} selected={value===opt.value} onSelect={()=>{onChange(opt.value);setOpen(false);}}/>)}
            </div>
          )):(options||[]).map((opt,i)=>(
            <DropdownOption key={i} opt={opt} selected={value===opt.value} onSelect={()=>{onChange(opt.value);setOpen(false);}}/>
          ))}
        </div>
      )}
    </div>
  );
}

function EnergyChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{background:"rgba(4,8,20,0.97)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:10,padding:"10px 14px",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"}}>
          <div style={{fontSize:"0.65rem",color:"#64748b",marginBottom:6,fontWeight:600}}>{label}</div>
          {payload.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
              <div style={{width:8,height:8,borderRadius:2,background:p.color}}/>
              <span style={{fontSize:"0.68rem",color:"#94a3b8"}}>{p.name}:</span>
              <span style={{fontSize:"0.72rem",fontWeight:800,color:p.color}}>{p.value} MW</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div style={{position:"relative"}}>
      <div style={{display:"flex",gap:16,marginBottom:14}}>
        {[["#38bdf8","İstehsal"],["#f59e0b","İstehlak"]].map(([col,lbl])=>(
          <div key={lbl} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:24,height:2,background:col,borderRadius:99}}/>
            <span style={{fontSize:"0.62rem",color:"#64748b"}}>{lbl}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{top:8,right:8,bottom:0,left:0}}>
          <defs>
            <linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02}/>
            </linearGradient>
            <linearGradient id="gradP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" stroke="rgba(148,163,184,0.06)" horizontal={true} vertical={false}/>
          <XAxis dataKey="t" tick={{fontSize:10,fill:"#475569"}} axisLine={{stroke:"rgba(255,255,255,0.06)"}} tickLine={false} dy={6}/>
          <YAxis tick={{fontSize:10,fill:"#475569"}} axisLine={false} tickLine={false} width={32}/>
          <Tooltip content={<CustomTooltip/>}/>
          <Area type="monotoneX" dataKey="i" stroke="#38bdf8" strokeWidth={2} fill="url(#gradI)" name="İstehsal" activeDot={{r:5,fill:"#38bdf8",stroke:"rgba(4,8,20,0.8)",strokeWidth:2}}/>
          <Area type="monotoneX" dataKey="p" stroke="#f59e0b" strokeWidth={2} fill="url(#gradP)" name="İstehlak" activeDot={{r:5,fill:"#f59e0b",stroke:"rgba(4,8,20,0.8)",strokeWidth:2}}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================================
// ✅ SUPABASE MESSAGES HOOK — tam inteqrasiyalı
// ============================================================
function useSupabaseMessages(currentUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // DB sətirini app-modelinə çevir
  const mapRow = (r) => ({
    id:         r.id,
    fromId:     r.from_id,
    fromName:   r.from_name,
    fromAvatar: r.from_avatar || "??",
    fromRole:   r.from_role   || "viewer",
    toId:       r.to_id,
    toName:     r.to_name     || "Hamı",
    subject:    r.subject,
    body:       r.body,
    timestamp:  r.created_at,
    readBy:     Array.isArray(r.read_by) ? r.read_by : [],
    priority:   r.priority    || "normal",
    type:       r.type        || "direct",
  });

  // İlk yükləmə
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setMessages(data.map(mapRow));
      setLoading(false);
    };
    load();
  }, []);

  // Real-time: INSERT + UPDATE
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages(prev => {
            // Duplikat yoxlaması
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [mapRow(payload.new), ...prev];
          });
        }
      )
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          setMessages(prev =>
            prev.map(m => m.id === payload.new.id ? mapRow(payload.new) : m)
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Mesajı oxunmuş say — read_by array-ni Supabase-də yenilə
  const markAsRead = useCallback(async (messageId, userId) => {
    if (!userId) return;
    // Lokal state-i dərhal yenilə (optimistic update)
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== messageId) return m;
        if (m.readBy.includes(userId)) return m;
        return { ...m, readBy: [...m.readBy, userId] };
      })
    );
    // DB-ni yenilə — mövcud read_by array-inə əlavə et
    const { data: current } = await supabase
      .from("messages")
      .select("read_by")
      .eq("id", messageId)
      .single();

    if (!current) return;
    const existing = Array.isArray(current.read_by) ? current.read_by : [];
    if (existing.includes(userId)) return;
    await supabase
      .from("messages")
      .update({ read_by: [...existing, userId] })
      .eq("id", messageId);
  }, []);

  // Yeni mesaj göndər
  const sendMessage = useCallback(async ({ currentUser, recipientId, recipientName, subject, body, priority, isBroadcast }) => {
    const payload = {
      from_id:     currentUser.id,
      from_name:   currentUser.name,
      from_avatar: currentUser.avatar,
      from_role:   currentUser.role,
      to_id:       isBroadcast ? null : (recipientId || null),
      to_name:     isBroadcast ? "Hamı" : (recipientName || ""),
      subject,
      body,
      priority:    priority || "normal",
      type:        isBroadcast ? "broadcast" : "direct",
      read_by:     [currentUser.id],  // göndərən artıq oxuyub
    };
    const { error } = await supabase.from("messages").insert([payload]);
    return { error };
  }, []);

  // Mesajı sil (yalnız admin)
  const deleteMessage = useCallback(async (messageId) => {
    const { error } = await supabase.from("messages").delete().eq("id", messageId);
    if (!error) setMessages(prev => prev.filter(m => m.id !== messageId));
    return { error };
  }, []);

  return { messages, loading, markAsRead, sendMessage, deleteMessage };
}

// ============================================================
// ✅ MESSAGING PANEL — tam yenidən yazılmış
// ============================================================
function MessagingPanel({ currentUser, users, messages, loading, markAsRead, sendMessage, deleteMessage, perms }) {
  const [tab, setTab] = useState("inbox");
  const [compose, setCompose] = useState(false);
  const [recipientId, setRecipientId] = useState("broadcast");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("normal");
  const [viewingId, setViewingId] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const inp = {
    width:"100%",boxSizing:"border-box",
    background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",
    border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,
    padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",
    fontFamily:"inherit",outline:"none"
  };

  // Bu istifadəçiyə aid mesajları filtrləmək
  const isMyMessage = (msg) => {
    if (tab === "inbox") {
      return msg.toId === currentUser.id ||
             (msg.type === "broadcast" && msg.fromId !== currentUser.id);
    }
    if (tab === "sent") return msg.fromId === currentUser.id;
    return false;
  };

  const filteredMessages = messages
    .filter(isMyMessage)
    .filter(m => !searchQ || 
      m.subject?.toLowerCase().includes(searchQ.toLowerCase()) ||
      m.fromName?.toLowerCase().includes(searchQ.toLowerCase()) ||
      m.body?.toLowerCase().includes(searchQ.toLowerCase())
    );

  const unreadCount = messages.filter(m =>
    (m.toId === currentUser.id || (m.type === "broadcast" && m.fromId !== currentUser.id)) &&
    !m.readBy.includes(currentUser.id)
  ).length;

  // Recipient seçenekler
  const recipientOptions = [
    ...(perms.canBroadcast
      ? [{ value:"broadcast", label:"📢 Hər Kəs (Broadcast)", colorDot:"#f97316" }]
      : []
    ),
    ...users
      .filter(u => String(u.id) !== String(currentUser.id))
      .map(u => ({
        value: String(u.id),
        label: u.name,
        sub: ROLES_DEF.find(r => r.id === u.role)?.label || "",
        colorDot: ROLES_DEF.find(r => r.id === u.role)?.color || "#64748b"
      }))
  ];

  // Mesaj göndər
  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setSendError("Mövzu və mətn doldurulmalıdır.");
      return;
    }
    setSending(true);
    setSendError("");
    const isBroadcast = recipientId === "broadcast";
    const toUser = isBroadcast ? null : users.find(u => String(u.id) === recipientId);
    const { error } = await sendMessage({
      currentUser,
      recipientId: toUser?.id ?? null,
      recipientName: toUser?.name ?? "",
      subject: subject.trim(),
      body: body.trim(),
      priority,
      isBroadcast,
    });
    setSending(false);
    if (error) {
      setSendError("Göndərmə xətası: " + error.message);
    } else {
      setCompose(false);
      setSubject("");
      setBody("");
      setRecipientId("broadcast");
      setPriority("normal");
      setTab("sent");
    }
  };

  // Mesajı aç — oxunmuş işarələ
  const openMessage = async (msg) => {
    setViewingId(msg.id);
    if (!msg.readBy.includes(currentUser.id)) {
      await markAsRead(msg.id, currentUser.id);
    }
  };

  // ── MESAJ GÖRÜNTÜLƏMƏ ──
  if (viewingId !== null) {
    const msg = messages.find(m => m.id === viewingId);
    if (!msg) { setViewingId(null); return null; }

    const senderRole = ROLES_DEF.find(r => r.id === msg.fromRole);
    const isOwn = msg.fromId === currentUser.id;

    return (
      <div style={{animation:"fadeIn 0.2s ease"}}>
        {/* Başlıq */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button
            onClick={() => setViewingId(null)}
            style={{display:"flex",alignItems:"center",gap:5,background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.15)",borderRadius:8,padding:"6px 12px",color:"#38bdf8",cursor:"pointer",fontSize:"0.7rem",fontWeight:700}}
          >
            <ArrowLeft size={12}/> Geri
          </button>
          <span style={{fontSize:"0.65rem",color:"#334155"}}>{relTime(msg.timestamp)}</span>
          {msg.priority === "high" && (
            <span style={{fontSize:"0.58rem",color:"#ef4444",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:4,padding:"2px 8px",fontWeight:800,marginLeft:"auto"}}>
              🔴 TƏCİLİ
            </span>
          )}
          {perms.isAdmin && !isOwn && (
            <button
              onClick={async () => { await deleteMessage(msg.id); setViewingId(null); }}
              style={{padding:"5px 10px",borderRadius:7,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.62rem",display:"flex",alignItems:"center",gap:4}}
            >
              <Trash2 size={10}/> Sil
            </button>
          )}
        </div>

        {/* Mesaj kartı */}
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(56,189,248,0.12)",borderRadius:14,overflow:"hidden"}}>
          {/* Meta */}
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(56,189,248,0.08)",background:"rgba(56,189,248,0.03)"}}>
            <h2 style={{color:"#f1f5f9",fontSize:"0.95rem",fontWeight:900,margin:"0 0 12px"}}>{msg.subject}</h2>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"center"}}>
              {/* Göndərən */}
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${senderRole?.color||"#64748b"}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.58rem",fontWeight:900,color:senderRole?.color||"#64748b"}}>
                  {msg.fromAvatar || "??"}
                </div>
                <div>
                  <div style={{fontSize:"0.68rem",color:"#e2e8f0",fontWeight:700}}>{msg.fromName}</div>
                  <RoleBadge role={msg.fromRole} size="xs"/>
                </div>
              </div>
              <div style={{color:"#334155",fontSize:"0.7rem"}}>→</div>
              {/* Alıcı */}
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {msg.type === "broadcast"
                  ? <span style={{fontSize:"0.68rem",color:"#f97316",fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Radio size={11}/>Hamıya göndərilib</span>
                  : <span style={{fontSize:"0.68rem",color:"#94a3b8"}}>{msg.toName || "—"}</span>
                }
              </div>
              {/* Oxuyanlar */}
              <div style={{marginLeft:"auto",fontSize:"0.6rem",color:"#334155",display:"flex",alignItems:"center",gap:4}}>
                <CheckCheck size={11} style={{color:"#10b981"}}/>
                {msg.readBy.length} nəfər oxuyub
              </div>
            </div>
          </div>
          {/* Mətn */}
          <div style={{padding:"20px"}}>
            <p style={{fontSize:"0.8rem",lineHeight:1.75,color:"#cbd5e1",whiteSpace:"pre-wrap",margin:0}}>{msg.body}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── YENİ MESAJ ──
  if (compose) {
    return (
      <div style={{animation:"fadeIn 0.2s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button
            onClick={() => { setCompose(false); setSendError(""); }}
            style={{display:"flex",alignItems:"center",gap:5,background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.15)",borderRadius:8,padding:"6px 12px",color:"#38bdf8",cursor:"pointer",fontSize:"0.7rem",fontWeight:700}}
          >
            <ArrowLeft size={12}/> Geri
          </button>
          <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Yeni Mesaj</h3>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <DarkSelect value={recipientId} onChange={setRecipientId} options={recipientOptions} placeholder="Alıcı seçin"/>
          <input
            placeholder="Mövzu"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={inp}
          />
          <textarea
            placeholder="Mesaj mətni..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={7}
            style={{...inp, resize:"vertical", lineHeight:1.6}}
          />
          <DarkSelect
            value={priority}
            onChange={setPriority}
            options={[
              {value:"normal", label:"Normal Prioritet", colorDot:"#10b981"},
              {value:"high",   label:"Təcili",           colorDot:"#ef4444"}
            ]}
          />
          {sendError && (
            <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"8px 12px",fontSize:"0.7rem",color:"#fca5a5"}}>
              {sendError}
            </div>
          )}
          <button
            onClick={handleSend}
            disabled={sending}
            style={{padding:"11px",borderRadius:10,background:sending?"rgba(56,189,248,0.05)":"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontWeight:800,fontSize:"0.78rem",cursor:sending?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:sending?0.6:1,transition:"all 0.2s"}}
          >
            {sending
              ? <><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/> Göndərilir...</>
              : <><Send size={13}/> Göndər</>
            }
          </button>
        </div>
      </div>
    );
  }

  // ── MESAJ SİYAHISI ──
  return (
    <div>
      {/* Başlıq */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <MessageSquare size={15} style={{color:"#38bdf8"}}/>
          <h3 style={{color:"#f1f5f9",fontSize:"0.88rem",fontWeight:900,margin:0}}>Mesajlar</h3>
          {unreadCount > 0 && (
            <span style={{background:"#ef4444",color:"#fff",fontSize:"0.55rem",borderRadius:10,padding:"2px 7px",fontWeight:900,animation:"pulse 2s infinite"}}>
              {unreadCount} yeni
            </span>
          )}
        </div>
        <button
          onClick={() => { setCompose(true); setSendError(""); }}
          style={{padding:"7px 14px",borderRadius:9,background:"linear-gradient(135deg,rgba(56,189,248,0.15),rgba(14,165,233,0.08))",border:"1px solid rgba(56,189,248,0.3)",color:"#38bdf8",fontSize:"0.68rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}
        >
          <Plus size={12}/> Yeni Mesaj
        </button>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[
          { k:"inbox", l:"Gələnlər",       Icon:Inbox, count: unreadCount },
          { k:"sent",  l:"Göndərilənlər", Icon:Send,  count: 0           }
        ].map(({ k, l, Icon, count }) => (
          <button
            key={k}
            onClick={() => { setTab(k); setSearchQ(""); }}
            style={{flex:1,padding:"8px",borderRadius:9,border:`1px solid ${tab===k?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:tab===k?"rgba(56,189,248,0.1)":"transparent",color:tab===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s"}}
          >
            <Icon size={12}/>{l}
            {count > 0 && tab !== k && (
              <span style={{background:"#ef4444",color:"#fff",fontSize:"0.5rem",borderRadius:"50%",width:15,height:15,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Axtarış */}
      <div style={{position:"relative",marginBottom:12}}>
        <input
          placeholder="Axtarış..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          style={{...inp, paddingLeft:32, fontSize:"0.72rem"}}
        />
        <Activity size={12} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#334155"}}/>
        {searchQ && (
          <button onClick={() => setSearchQ("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#475569",cursor:"pointer",display:"flex",alignItems:"center"}}>
            <X size={12}/>
          </button>
        )}
      </div>

      {/* Mesaj Listesi */}
      {loading ? (
        <div style={{textAlign:"center",padding:"32px 0",color:"#334155",fontSize:"0.72rem",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <RefreshCw size={14} style={{animation:"spin 1s linear infinite",color:"#38bdf8"}}/> Yüklənir...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <Inbox size={28} style={{color:"#1e293b",marginBottom:10}}/>
          <div style={{color:"#334155",fontSize:"0.72rem"}}>
            {searchQ ? "Axtarışa uyğun mesaj tapılmadı" : "Mesaj yoxdur"}
          </div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {filteredMessages.map(msg => {
            const isUnread = tab === "inbox" && !msg.readBy.includes(currentUser.id);
            const isBroadcast = msg.type === "broadcast";
            const senderRoleDef = ROLES_DEF.find(r => r.id === msg.fromRole);

            return (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                style={{
                  background: isUnread
                    ? "linear-gradient(135deg,rgba(56,189,248,0.07),rgba(14,165,233,0.03))"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isUnread ? "rgba(56,189,248,0.22)" : "rgba(56,189,248,0.08)"}`,
                  borderRadius:11,padding:"11px 14px",cursor:"pointer",
                  transition:"all 0.18s",position:"relative",overflow:"hidden"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = isUnread ? "rgba(56,189,248,0.22)" : "rgba(56,189,248,0.08)"}
              >
                {/* Oxunmamış indicator */}
                {isUnread && (
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:"linear-gradient(to bottom,#38bdf8,#0ea5e9)",borderRadius:"11px 0 0 11px"}}/>
                )}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}>
                    {/* Avatar */}
                    <div style={{width:24,height:24,borderRadius:7,background:`${senderRoleDef?.color||"#64748b"}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.55rem",fontWeight:900,color:senderRoleDef?.color||"#64748b",flexShrink:0}}>
                      {msg.fromAvatar || "??"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontSize:"0.72rem",fontWeight:isUnread?800:600,color:isUnread?"#f1f5f9":"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {msg.subject}
                        </span>
                        {msg.priority === "high" && (
                          <span style={{fontSize:"0.52rem",color:"#ef4444",background:"rgba(239,68,68,0.12)",borderRadius:3,padding:"1px 5px",fontWeight:800,flexShrink:0}}>TƏCİLİ</span>
                        )}
                        {isBroadcast && (
                          <span style={{fontSize:"0.52rem",color:"#f97316",background:"rgba(249,115,22,0.1)",borderRadius:3,padding:"1px 5px",fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",gap:3}}>
                            <Radio size={8}/> BROADCAST
                          </span>
                        )}
                      </div>
                      <div style={{fontSize:"0.62rem",color:"#475569",display:"flex",alignItems:"center",gap:5}}>
                        {tab === "inbox"
                          ? <><span style={{color:senderRoleDef?.color||"#64748b",fontWeight:600}}>{msg.fromName}</span><span>→</span><span>{msg.toName || "Hamı"}</span></>
                          : <><span>→</span><span style={{color:"#94a3b8"}}>{msg.toName || "Hamı"}</span></>
                        }
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{fontSize:"0.6rem",color:"#334155"}}>{relTime(msg.timestamp)}</span>
                    {msg.readBy.length > 1 && (
                      <span style={{fontSize:"0.55rem",color:"#10b981",display:"flex",alignItems:"center",gap:3}}>
                        <CheckCheck size={9}/>{msg.readBy.length}
                      </span>
                    )}
                    {isUnread && (
                      <div style={{width:7,height:7,borderRadius:"50%",background:"#38bdf8",boxShadow:"0 0 6px #38bdf880"}}/>
                    )}
                  </div>
                </div>
                {/* Önizleme */}
                <div style={{fontSize:"0.64rem",color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginLeft:31}}>
                  {msg.body}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// OTHER SUPABASE HOOKS (dəyişməyib)
// ============================================================
function useSupabaseAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
      if (!error && data) setAlerts(data.map(a => ({
        id: a.id, node: a.station_name, component: a.component,
        severity: a.severity, message: a.message,
        time: a.created_at ? new Date(a.created_at).toLocaleTimeString('az-AZ') : new Date().toLocaleTimeString('az-AZ'),
        note: a.note || ""
      })));
      setLoading(false);
    };
    load();
    const ch = supabase.channel('alerts-sync')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'alerts' }, (p) => {
        setAlerts(prev => [{
          id:p.new.id, node:p.new.station_name, component:p.new.component,
          severity:p.new.severity, message:p.new.message,
          time:new Date(p.new.created_at).toLocaleTimeString('az-AZ'), note:p.new.note||""
        }, ...prev]);
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);
  return { alerts, setAlerts, loading };
}

function useSupabaseDataEntries() {
  const [dataEntries, setDataEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('data_entries').select('*').order('created_at', { ascending: false });
      if (!error && data) setDataEntries(data.map(e => ({
        id:e.id, timestamp:e.created_at, actor:e.actor_name, actorRole:e.actor_role,
        targetType:e.target_type, target:e.target_name, field:e.field_name,
        value:e.value, note:e.note||"", color:e.color||"#38bdf8"
      })));
      setLoading(false);
    };
    load();
    const ch = supabase.channel('data-entries-sync')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'data_entries' }, (p) => {
        setDataEntries(prev => [{
          id:p.new.id, timestamp:p.new.created_at, actor:p.new.actor_name, actorRole:p.new.actor_role,
          targetType:p.new.target_type, target:p.new.target_name, field:p.new.field_name,
          value:p.new.value, note:p.new.note||"", color:p.new.color||"#38bdf8"
        }, ...prev]);
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);
  return { dataEntries, setDataEntries, loading };
}

function useSupabaseStrategies() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('strategies').select('*').order('created_at', { ascending: false });
      if (!error && data) setStrategies(data.map(s => ({
        id:s.id, title:s.title, category:s.category, categoryColor:s.category_color||"#3b82f6",
        desc:s.description, roi:s.roi, duration:s.duration, annualSavings:s.annual_savings||"",
        impact:s.impact||"", priority:s.priority||"Orta", priorityColor:s.priority_color||"#f59e0b",
        status:s.status||"Planlaşdırılıb", statusColor:s.status_color||"#f59e0b",
        energySaved:s.energy_saved||"", co2Reduction:s.co2_reduction||"",
        progress:s.progress||0, completed:s.completed||false
      })));
      setLoading(false);
    };
    load();
    const ch = supabase.channel('strategies-sync')
      .on('postgres_changes', { event:'*', schema:'public', table:'strategies' }, () => load())
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);
  return { strategies, setStrategies, loading };
}

// ============================================================
// ✅ SUPABASE ACTIVITY LOG HOOK
// ============================================================
function useSupabaseActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) setLogs(data);
      setLoading(false);
    };
    load();

    const ch = supabase
      .channel("activity-log-sync")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log" },
        (payload) => {
          setLogs(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  const addLog = useCallback(async ({ userId, userName, userRole, action, target, detail, category }) => {
    await supabase.from("activity_log").insert([{
      user_id:   userId,
      user_name: userName,
      user_role: userRole,
      action,
      target:    target  || "",
      detail:    detail  || "",
      category:  category|| "general",
    }]);
  }, []);

  return { logs, loading, addLog };
}

// ============================================================
// MANUAL DATA ENTRY PANEL
// ============================================================
function ManualDataEntryPanel({ currentUser, perms, sensors, setSensorOverrides, dataEntries, setDataEntries, addLog }) {
  const [targetType, setTargetType] = useState("station");
  const [selectedStation, setStation] = useState("");
  const [selectedZone, setZone] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const userArea = currentUser?.serviceArea || "";
  const isAllAccess = userArea === "Bütün Ərazilər" || perms.isAdmin || perms.isViceAdmin;
  const accessibleStations = NODES.filter(n => isAllAccess ? true : (n.label === userArea || n.region === userArea));
  const accessibleZones = DIST_ZONES.filter(z => isAllAccess ? true : (z.name === userArea || userArea.includes(z.name) || z.name.includes(userArea.replace(" Rayonu","").replace(" Şəhər",""))));
  const stationOpts = accessibleStations.map(n=>({value:n.id, label:n.label, colorDot:n.color}));
  const zoneOpts = accessibleZones.map(z=>({value:z.name, label:z.name, colorDot:"#38bdf8"}));
  const selectedNode = NODES.find(n=>n.id===selectedStation);
  const sensorLabels = {boilerTemp:"Qazan Temp (°C)",steamPressure:"Buxar Təzyiqi (MPa)",output:"Çıxış Gücü (MW)",waterLevel:"Su Səviyyəsi (m)",turbineRpm:"Türbin RPM",panelTemp:"Panel Temp (°C)",efficiency:"Səmərəlilik (%)",rpm:"Fırlanma (RPM)",bearingTemp:"Yataq Temp (°C)",vibration:"Vibrasiya (mm/s)"};
  const zoneFieldLabels = { load:"Yük (MW)", capacity:"Güc (MW)", health:"Sağlamlıq (%)" };
  const stationFieldOpts = selectedNode ? Object.keys(selectedNode.sensors).map(k=>({value:k, label:sensorLabels[k]||k})) : [];
  const zoneFieldOpts = Object.entries(zoneFieldLabels).map(([k,v])=>({value:k, label:v}));
  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};

  const handleSubmit = async () => {
    setError("");
    if (targetType==="station" && (!selectedStation || !fieldKey || fieldValue==="")) { setError("Stansiyanı, sahəni və dəyəri doldurun."); return; }
    if (targetType==="grid" && (!selectedZone || !fieldKey || fieldValue==="")) { setError("Zonu, sahəni və dəyəri doldurun."); return; }
    const numVal = parseFloat(fieldValue);
    if (isNaN(numVal)) { setError("Dəyər rəqəm olmalıdır."); return; }
    if (targetType==="station") setSensorOverrides(prev => ({...prev,[selectedStation]:{...(prev[selectedStation]||{}),[fieldKey]:numVal}}));
    const label = targetType==="station" ? NODES.find(n=>n.id===selectedStation)?.label : selectedZone;
    const fLabel = targetType==="station" ? (sensorLabels[fieldKey]||fieldKey) : (zoneFieldLabels[fieldKey]||fieldKey);
    const { error: insertError } = await supabase.from('data_entries').insert([{
      actor_name:currentUser.name, actor_role:currentUser.role, target_type:targetType,
      target_name:label, field_name:fLabel, value:numVal, note:note,
      color:targetType==="station"?(NODES.find(n=>n.id===selectedStation)?.color||"#38bdf8"):"#38bdf8"
    }]);
    if (insertError) { setError("Məlumat qeydə alınmadı: " + insertError.message); return; }
    addLog && addLog({ userId:currentUser.id, userName:currentUser.name, userRole:currentUser.role,
      action:"Məlumat daxil etdi", target:label, detail:`${fLabel}: ${numVal}`, category:"data" });
    setFieldValue(""); setNote(""); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };

  if (!perms.canEnterData) return <PermissionBanner message="Məlumat daxil etmək üçün Operator və ya yuxarı hüquq lazımdır."/>;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <PenLine size={16} style={{color:"#38bdf8"}}/>
        <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Manuel Məlumat Daxiletmə</h3>
      </div>
      {saved&&<div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:"0.72rem",color:"#34d399",display:"flex",alignItems:"center",gap:6}}><CheckCircle size={12}/> Məlumat uğurla qeydə alındı</div>}
      {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:"0.7rem",color:"#fca5a5"}}>{error}</div>}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[{k:"station",l:"Stansiya",Icon:Cpu},{k:"grid",l:"Şəbəkə Zonu",Icon:Activity}].map(({k,l,Icon})=>(
          <button key={k} onClick={()=>{setTargetType(k);setFieldKey("");setStation("");setZone("");}} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${targetType===k?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:targetType===k?"rgba(56,189,248,0.12)":"transparent",color:targetType===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <Icon size={12}/>{l}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {targetType==="station"?(
          <><DarkSelect value={selectedStation} onChange={(v)=>{setStation(v);setFieldKey("");}} options={stationOpts} placeholder="Stansiyanı seçin"/>
          {selectedStation&&<DarkSelect value={fieldKey} onChange={setFieldKey} options={stationFieldOpts} placeholder="Sensor sahəsini seçin"/>}</>
        ):(
          <><DarkSelect value={selectedZone} onChange={(v)=>{setZone(v);setFieldKey("");}} options={zoneOpts} placeholder="Zonu seçin"/>
          {selectedZone&&<DarkSelect value={fieldKey} onChange={setFieldKey} options={zoneFieldOpts} placeholder="Sahəni seçin"/>}</>
        )}
        {fieldKey&&(<>
          <input type="number" step="0.01" placeholder="Yeni dəyər" value={fieldValue} onChange={e=>setFieldValue(e.target.value)} style={inp}/>
          <textarea placeholder="Qeyd (ixtiyari)" value={note} onChange={e=>setNote(e.target.value)} rows={2} style={{...inp,resize:"none"}}/>
          <button onClick={handleSubmit} style={{padding:"10px",borderRadius:9,background:"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontWeight:800,fontSize:"0.76rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Save size={13}/> Yadda Saxla
          </button>
        </>)}
      </div>
    </div>
  );
}

// ============================================================
// AUTH SCREEN
// ============================================================
function AuthScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestedRole, setRole] = useState("viewer");
  const [serviceArea, setArea] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const groupedAreas = [
    { label:"RAYONLAR",   options: SERVICE_AREAS["Rayonlar"].map(v=>({value:v,label:v,colorDot:"#3b82f6"})) },
    { label:"STANSIYALAR",options: SERVICE_AREAS["Stansiyalar"].map(v=>({value:v,label:v,colorDot:"#10b981"})) }
  ];
  const roleOpts = ROLES_DEF.filter(r=>r.id!=="admin"&&r.id!=="vice_admin").map(r=>({value:r.id,label:r.label,colorDot:r.color,sub:r.desc}));
  const inp = {width:"100%",boxSizing:"border-box",background:"linear-gradient(135deg,rgba(6,12,28,0.95),rgba(4,8,20,0.98))",border:"1px solid rgba(56,189,248,0.18)",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:"0.76rem",fontFamily:"inherit",outline:"none"};

  const submit = async () => {
    setError(""); setLoading(true);
    if (mode==="login") {
      const res = await onLogin(username, password);
      if (!res.ok) setError(res.msg);
    } else {
      if (!username||!password||!name||!email||!serviceArea) { setError("Bütün sahələri doldurun."); setLoading(false); return; }
      const res = await onRegister({ username,password,name,email,requestedRole,serviceArea,note });
      if (res && res.error) { setError(res.error); setLoading(false); return; }
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020610,#030915)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",padding:40}}>
        <CheckCircle size={52} style={{color:"#10b981",marginBottom:16}}/>
        <h2 style={{color:"#f1f5f9",fontWeight:800,marginBottom:8}}>Müraciətiniz Qeydə Alındı</h2>
        <p style={{color:"#64748b",fontSize:"0.8rem",maxWidth:300,margin:"0 auto 24px"}}>Administrator hesabınızı yoxlayıb icazə verdikdən sonra daxil ola biləcəksiniz.</p>
        <button onClick={()=>{setMode("login");setSuccess(false);}} style={{background:"linear-gradient(135deg,rgba(56,189,248,0.15),rgba(14,165,233,0.08))",border:"1px solid rgba(56,189,248,0.3)",borderRadius:8,padding:"9px 22px",color:"#38bdf8",cursor:"pointer",fontSize:"0.76rem"}}>Giriş Səhifəsinə Qayıt</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020610,#030915)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:420,background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",border:"1px solid rgba(56,189,248,0.15)",borderRadius:18,padding:36,backdropFilter:"blur(20px)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Zap size={26} style={{color:"#38bdf8"}}/></div>
          <h1 style={{color:"#f1f5f9",fontSize:"1.1rem",fontWeight:900,marginBottom:4}}>Naxçıvan Enerji İdarəetmə Sistemi</h1>
          <p style={{color:"#334155",fontSize:"0.7rem"}}>{mode==="login"?"Hesabınıza daxil olun":"Yeni hesab tələb edin"}</p>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:22}}>
          {[{k:"login",l:"Giriş",Icon:LogIn},{k:"register",l:"Qeydiyyat",Icon:UserPlus}].map(({k,l,Icon})=>(
            <button key={k} onClick={()=>{setMode(k);setError("");}} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${mode===k?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:mode===k?"rgba(56,189,248,0.12)":"transparent",color:mode===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.72rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Icon size={13}/>{l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="register"&&<input placeholder="Ad Soyad" value={name} onChange={e=>setName(e.target.value)} style={inp}/>}
          <input placeholder="İstifadəçi adı" value={username} onChange={e=>setUsername(e.target.value)} style={inp}/>
          {mode==="register"&&<input placeholder="E-poçt" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp}/>}
          <input placeholder="Şifrə" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          {mode==="register"&&<>
            <DarkSelect value={requestedRole} onChange={setRole} options={roleOpts} placeholder="Rol seçin"/>
            <DarkSelect value={serviceArea} onChange={setArea} placeholder="Xidmət sahəsi seçin" grouped={groupedAreas}/>
            <textarea placeholder="Qeyd (ixtiyari)" value={note} onChange={e=>setNote(e.target.value)} rows={2} style={{...inp,resize:"none"}}/>
          </>}
          {error&&<div style={{color:"#ef4444",fontSize:"0.7rem",textAlign:"center",background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"8px 12px"}}>{error}</div>}
          <button onClick={submit} disabled={loading} style={{width:"100%",padding:"11px",borderRadius:10,background:"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontWeight:800,fontSize:"0.8rem",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:loading?0.6:1}}>
            {loading?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:mode==="login"?<><LogIn size={14}/>Daxil Ol</>:<><UserPlus size={14}/>Müraciət Et</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ANA KOMPONENT
// ============================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [sensorOverrides, setSensorOverrides] = useState({});
  const [activeTab, setTab] = useState("overview");
  const [selNodeIds, setSelNodeIds] = useState([NODES[0].id, NODES[1].id]);
  const [chartHistory, setChartHist] = useState(CONS_HISTORY);
  const [filterSev, setFilterSev] = useState("all");

  // ✅ Mərkəzi mesajlaşma hook — currentUser.id ilə
  const { messages, loading: msgLoading, markAsRead, sendMessage, deleteMessage } = useSupabaseMessages(currentUser?.id);
  const { alerts, setAlerts } = useSupabaseAlerts();
  const { dataEntries, setDataEntries } = useSupabaseDataEntries();
  const { strategies, setStrategies } = useSupabaseStrategies();
  const { logs, loading: logsLoading, addLog } = useSupabaseActivityLog();

  const rawSensors = useSensors();
  const sensors = Object.fromEntries(NODES.map(n => [n.id, { ...rawSensors[n.id], ...(sensorOverrides[n.id]||{}) }]));

  // Users yüklə
  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase.from('users').select('*').eq('status','approved');
      if (data) setUsers(data.map(u=>({
        ...u, name:u.full_name||u.name||u.username, role:normalizeRole(u.role),
        serviceArea:u.service_region||"Bütün Ərazilər",
        avatar:(u.full_name||u.name||u.username||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
        status:u.status||"active"
      })));
    };
    loadUsers();
    const ch = supabase.channel('approved-users')
      .on('postgres_changes',{event:'*',schema:'public',table:'users'},()=>loadUsers())
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);

  useEffect(() => {
    const loadPending = async () => {
      const { data } = await supabase.from('users').select('*').eq('status','pending');
      if (data) setPending(data);
    };
    loadPending();
    const ch = supabase.channel('pending-users')
      .on('postgres_changes',{event:'*',schema:'public',table:'users'},()=>loadPending())
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      const label = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
      const totalOutput = ENERGY_SOURCES.reduce((s,e)=>s+e.cur,0);
      const noise = (Math.random()-0.5)*4;
      setChartHist(prev=>[...prev.slice(-23),{t:label,i:+(totalOutput+noise).toFixed(1),p:+(totalOutput-1+noise).toFixed(1)}]);
    }, 8000);
    return ()=>clearInterval(iv);
  }, []);

  const handleLogin = async (username, password) => {
    if (!username||!password) return {ok:false,msg:"İstifadəçi adı və şifrəni daxil edin."};
    const {data,error} = await supabase.from('users').select('*').eq('username',username).eq('password',password).single();
    if (error||!data) return {ok:false,msg:"İstifadəçi adı və ya şifrə yanlışdır."};
    if (data.status==='pending') return {ok:false,msg:"Hesabınız hələ təsdiqlənməyib."};
    if (data.status==='rejected') return {ok:false,msg:"Hesab müraciətiniz rədd edilib."};
    if (data.status==='blocked') return {ok:false,msg:"Hesabınız bloklanıb."};
    const normalizedRole = normalizeRole(data.role);
    const userName = data.full_name||data.name||data.username;
    const userObj = {
      ...data, id:data.id, name:userName, role:normalizedRole,
      serviceArea:data.service_region||"Bütün Ərazilər",
      avatar:userName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
    };
    setCurrentUser(userObj);
    // Giriş logu
    await supabase.from("activity_log").insert([{
      user_id:   data.id,
      user_name: userName,
      user_role: normalizedRole,
      action:    "Sistemə daxil oldu",
      target:    "",
      detail:    "",
      category:  "auth",
    }]);
    return {ok:true};
  };

  const handleRegister = async (formData) => {
    try {
      const {data:existing} = await supabase.from('users').select('id').eq('username',formData.username).maybeSingle();
      if (existing) return {error:"Bu istifadəçi adı artıq mövcuddur."};
      const {error} = await supabase.from('users').insert([{
        username:formData.username, password:formData.password, full_name:formData.name,
        email:formData.email, role:formData.requestedRole||'viewer', status:'pending',
        service_region:formData.serviceArea, note:formData.note||""
      }]).select();
      if (error) return {error:`Xəta: ${error.message}`};
      return {ok:true};
    } catch(err) { return {error:"Gözlənilməz xəta baş verdi."}; }
  };

  // Mesaj göndərərkən loga yaz
  const sendMessageWithLog = useCallback(async (params) => {
    const result = await sendMessage(params);
    if (!result.error) {
      addLog({
        userId:   params.currentUser.id,
        userName: params.currentUser.name,
        userRole: params.currentUser.role,
        action:   params.isBroadcast ? "Broadcast mesaj göndərdi" : "Mesaj göndərdi",
        target:   params.isBroadcast ? "Hamı" : (params.recipientName || ""),
        detail:   params.subject,
        category: "message",
      });
    }
    return result;
  }, [sendMessage, addLog]);

  const handleLogout = async () => {
    if (currentUser) {
      await supabase.from("activity_log").insert([{
        user_id:   currentUser.id,
        user_name: currentUser.name,
        user_role: currentUser.role,
        action:    "Sistemdən çıxdı",
        target:    "",
        detail:    "",
        category:  "auth",
      }]);
    }
    setCurrentUser(null); setTab("overview");
  };

  const removeAlert = async (id) => {
    const alert = alerts.find(a=>a.id===id);
    await supabase.from('alerts').delete().eq('id',id);
    setAlerts(prev=>prev.filter(a=>a.id!==id));
    if (currentUser && alert) {
      addLog({ userId:currentUser.id, userName:currentUser.name, userRole:currentUser.role,
        action:"Hadisəni sildi", target:alert.node, detail:`${alert.component}: ${alert.message}`, category:"incident" });
    }
  };

  const toggleNode = (id) => setSelNodeIds(prev=>prev.includes(id)?(prev.length>1?prev.filter(x=>x!==id):prev):[...prev,id]);

  const filteredAlerts = alerts.filter(a=>filterSev==="all"||a.severity===filterSev);

  // ✅ Unread count — hook-dan alınır
  const unreadMsgs = currentUser
    ? messages.filter(m =>
        (m.toId === currentUser.id || (m.type==="broadcast" && m.fromId!==currentUser.id)) &&
        !m.readBy.includes(currentUser.id)
      ).length
    : 0;

  const perms = getPerms(currentUser);

  if (!currentUser) return <AuthScreen onLogin={handleLogin} onRegister={handleRegister}/>;

  const TABS = [
    { k:"overview",   l:"Ümumi Baxış",    Icon:BarChart2 },
    { k:"stations",   l:"Stansiyalar",    Icon:Cpu },
    { k:"grid",       l:"Şəbəkə",         Icon:Activity },
    { k:"dataentry",  l:"Məlumat Daxilet",Icon:PenLine },
    { k:"strategies", l:"Strategiyalar",  Icon:Leaf },
    { k:"incidents",  l:"Hadisələr",      Icon:AlertTriangle },
    { k:"messages",   l:"Mesajlar",       Icon:MessageSquare, badge:unreadMsgs },
    ...(perms.canSeeAdminTab?[{k:"admin",l:"Admin",Icon:Crown,badge:pending.length}]:[]),
    ...(perms.isAdmin?[{k:"activity",l:"Fəaliyyət",Icon:History}]:[])
  ];

  const card = (extra={}) => ({
    background:"linear-gradient(135deg,rgba(6,12,28,0.9),rgba(4,8,20,0.95))",
    border:"1px solid rgba(56,189,248,0.12)",borderRadius:14,padding:18,
    backdropFilter:"blur(10px)",...extra
  });

  const totalOutput = ENERGY_SOURCES.reduce((s,e)=>s+e.cur,0);
  const totalCapacity = TOTAL_CAPACITY;
  const gridEfficiency = +((totalOutput/totalCapacity)*100).toFixed(1);

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020610 0%,#030915 50%,#020710 100%)",fontFamily:"'Inter',system-ui,sans-serif",color:"#e2e8f0",fontSize:"0.8rem"}}>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.2);border-radius:2px;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* HEADER */}
      <header style={{background:"linear-gradient(90deg,rgba(2,6,16,0.95),rgba(4,8,22,0.95))",borderBottom:"1px solid rgba(56,189,248,0.1)",padding:"12px 20px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(14,165,233,0.1))",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Zap size={20} style={{color:"#38bdf8"}}/>
          </div>
          <div>
            <div style={{fontSize:"0.85rem",fontWeight:900,color:"#f1f5f9",lineHeight:1}}>Naxçıvan Enerji</div>
            <div style={{fontSize:"0.58rem",color:"#334155",marginTop:2}}>Digital Twin İdarəetmə Sistemi</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#10b981",animation:"pulse 2s infinite",boxShadow:"0 0 8px #10b98160"}}/>
          <span style={{fontSize:"0.65rem",color:"#10b981",fontWeight:700}}>Aktiv</span>
          <span style={{fontSize:"0.65rem",color:"#334155",marginLeft:6}}>{totalOutput.toFixed(1)} MW / {totalCapacity} MW</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:`${ROLES_DEF.find(r=>r.id===currentUser.role)?.color||"#64748b"}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontWeight:900,color:ROLES_DEF.find(r=>r.id===currentUser.role)?.color||"#64748b"}}>{currentUser.avatar}</div>
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:"0.68rem",color:"#e2e8f0",fontWeight:700}}>{currentUser.name}</span>
            <RoleBadge role={currentUser.role} size="xs"/>
          </div>
          <button onClick={handleLogout} style={{padding:"5px 10px",borderRadius:7,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.62rem",display:"flex",alignItems:"center",gap:4}}>
            <LogOut size={10}/>Çıx
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav style={{background:"linear-gradient(90deg,rgba(2,6,14,0.9),rgba(3,8,20,0.9))",borderBottom:"1px solid rgba(56,189,248,0.08)",padding:"0 20px",display:"flex",gap:2,overflowX:"auto"}}>
        {TABS.map(({k,l,Icon,badge})=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"10px 14px",border:"none",borderBottom:`2px solid ${activeTab===k?"#38bdf8":"transparent"}`,background:"transparent",color:activeTab===k?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.68rem",fontWeight:700,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s",position:"relative"}}>
            <Icon size={13}/>{l}
            {badge>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:"0.5rem",borderRadius:"50%",width:14,height:14,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>{badge}</span>}
          </button>
        ))}
      </nav>

      <main style={{padding:20,maxWidth:1400,margin:"0 auto"}}>

        {/* OVERVIEW */}
        {activeTab==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20}}>
              {[
                {label:"Ümumi İstehsal",value:`${totalOutput.toFixed(1)} MW`,sub:`Gücün ${gridEfficiency}%-i`,color:"#38bdf8",Icon:Zap},
                {label:"Sistem Gücü",value:`${totalCapacity} MW`,sub:`${ENERGY_SOURCES.length} mənbə`,color:"#10b981",Icon:Battery},
                {label:"Şəbəkə Fəallığı",value:`${gridEfficiency}%`,sub:"Real vaxt",color:"#eab308",Icon:TrendingUp},
                {label:"Aktiv Hadisələr",value:filteredAlerts.filter(a=>a.severity==="yüksək").length,sub:`${filteredAlerts.length} ümumilikdə`,color:"#ef4444",Icon:AlertTriangle},
              ].map(({label,value,sub,color,Icon})=>(
                <div key={label} style={{...card(),display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,borderRadius:12,background:`${color}15`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={20} style={{color}}/></div>
                  <div>
                    <div style={{fontSize:"0.65rem",color:"#475569",marginBottom:3}}>{label}</div>
                    <div style={{fontSize:"1.2rem",fontWeight:900,color:"#f1f5f9",lineHeight:1}}>{value}</div>
                    <div style={{fontSize:"0.6rem",color:"#334155",marginTop:3}}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
              <div style={card()}>
                <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:4}}>ENERJİ İSTEHSALI / İSTEHLAKI</div>
                <EnergyChart data={chartHistory}/>
              </div>
              <div style={card()}>
                <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:12}}>ENERJİ MƏNBƏLƏRİ</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={ENERGY_SOURCES.slice(0,6)} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="cur" nameKey="name" paddingAngle={2}>
                      {ENERGY_SOURCES.slice(0,6).map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:"rgba(6,12,28,0.95)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,fontSize:11}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* STATIONS */}
        {activeTab==="stations"&&(
          <div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {NODES.map(n=>{
                const sel=selNodeIds.includes(n.id);
                return(
                  <button key={n.id} onClick={()=>toggleNode(n.id)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${sel?n.color+"60":n.color+"20"}`,background:sel?`${n.color}15`:"transparent",color:sel?n.color:"#475569",cursor:"pointer",fontSize:"0.65rem",fontWeight:sel?700:500,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
                    <n.icon size={12}/>{n.label.split(" ").slice(0,2).join(" ")}
                  </button>
                );
              })}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
              {NODES.filter(n=>selNodeIds.includes(n.id)).map(n=>{
                const s=sensors[n.id]||{};
                return(
                  <div key={n.id} style={{...card(),borderColor:`${n.color}25`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:32,height:32,borderRadius:9,background:`${n.color}15`,border:`1px solid ${n.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><n.icon size={16} style={{color:n.color}}/></div>
                        <div>
                          <div style={{fontSize:"0.75rem",fontWeight:800,color:"#f1f5f9",lineHeight:1.2}}>{n.label}</div>
                          <div style={{fontSize:"0.6rem",color:"#334155",marginTop:2}}>{n.region}</div>
                        </div>
                      </div>
                      <div style={{width:7,height:7,borderRadius:"50%",background:"#10b981",animation:"pulse 2s infinite",marginTop:4}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {Object.entries(s).map(([k,v])=>{
                        const labels={boilerTemp:"Qazan Temp",steamPressure:"Buxar Təzyiqi",output:"Çıxış Gücü",waterLevel:"Su Səviyyəsi",turbineRpm:"Türbin RPM",panelTemp:"Panel Temp",efficiency:"Səmərəlilik",rpm:"Fırlanma",bearingTemp:"Yataq Temp",vibration:"Vibrasiya"};
                        const units={boilerTemp:"°C",steamPressure:"MPa",output:"MW",waterLevel:"m",turbineRpm:"RPM",panelTemp:"°C",efficiency:"%",rpm:"RPM",bearingTemp:"°C",vibration:"mm/s"};
                        const isOverridden=sensorOverrides[n.id]?.[k]!==undefined;
                        return(
                          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.03)",paddingBottom:6}}>
                            <span style={{fontSize:"0.65rem",color:"#64748b",display:"flex",alignItems:"center",gap:4}}>
                              {labels[k]||k}
                              {isOverridden&&<span style={{fontSize:"0.52rem",color:"#f59e0b",background:"rgba(245,158,11,0.1)",borderRadius:3,padding:"1px 4px"}}>Manuel</span>}
                            </span>
                            <span style={{fontSize:"0.72rem",fontWeight:800,color:isOverridden?"#f59e0b":n.color}}>{typeof v==="number"?v.toFixed(2):v} {units[k]||""}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DATA ENTRY */}
        {activeTab==="dataentry"&&(
          <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:14}}>
            <div style={card()}>
              <ManualDataEntryPanel currentUser={currentUser} perms={perms} sensors={sensors} setSensorOverrides={setSensorOverrides} dataEntries={dataEntries} setDataEntries={setDataEntries} addLog={addLog}/>
            </div>
            <div style={card()}>
              <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Database size={13}/> MƏLUMAT GİRİŞ TARİXÇƏSİ</div>
              {dataEntries.length===0?(
                <div style={{textAlign:"center",padding:"32px 0",color:"#334155",fontSize:"0.72rem"}}>Hələ heç bir məlumat daxil edilməyib</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {dataEntries.slice(0,15).map(e=>(
                    <div key={e.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto",gap:12,alignItems:"center",padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:9,border:`1px solid ${e.color}18`}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:e.color,boxShadow:`0 0 6px ${e.color}60`}}/>
                      <div>
                        <div style={{fontSize:"0.7rem",color:"#e2e8f0",fontWeight:700}}>{e.target}</div>
                        <div style={{fontSize:"0.62rem",color:"#475569",marginTop:1}}>{e.field}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"0.75rem",fontWeight:800,color:e.color}}>{e.value}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"0.65rem",color:"#64748b"}}>{e.actor}</div>
                      </div>
                      <RoleBadge role={e.actorRole} size="xs"/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INCIDENTS */}
        {activeTab==="incidents"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <Filter size={13} style={{color:"#64748b"}}/>
              {["all","yüksək","orta","aşağı"].map(s=>(
                <button key={s} onClick={()=>setFilterSev(s)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${filterSev===s?"rgba(56,189,248,0.4)":"rgba(56,189,248,0.1)"}`,background:filterSev===s?"rgba(56,189,248,0.1)":"transparent",color:filterSev===s?"#38bdf8":"#475569",cursor:"pointer",fontSize:"0.62rem",fontWeight:700}}>
                  {s==="all"?"Hamısı":SEVERITY_MAP[s].label}
                </button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filteredAlerts.length===0&&<div style={{...card(),textAlign:"center",padding:40,color:"#334155"}}>Hadisə tapılmadı</div>}
              {filteredAlerts.map(a=>{
                const sv=SEVERITY_MAP[a.severity]||SEVERITY_MAP["aşağı"];
                return(
                  <div key={a.id} style={{...card(),borderColor:sv.border,background:`linear-gradient(135deg,${sv.bg},rgba(4,8,20,0.97))`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                          <span style={{fontSize:"0.56rem",color:sv.color,background:sv.bg,border:`1px solid ${sv.border}`,borderRadius:4,padding:"2px 8px",fontWeight:800,flexShrink:0}}>{sv.label}</span>
                          <span style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.node}</span>
                        </div>
                        <div style={{fontSize:"0.72rem",color:"#f1f5f9",fontWeight:700,marginBottom:3}}>{a.component}</div>
                        <div style={{fontSize:"0.68rem",color:"#94a3b8"}}>{a.message}</div>
                        {a.note&&<div style={{fontSize:"0.62rem",color:"#475569",marginTop:4,fontStyle:"italic"}}>Not: {a.note}</div>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                        <span style={{fontSize:"0.6rem",color:"#334155"}}>{a.time}</span>
                        {perms.canDeleteEntries&&<button onClick={()=>removeAlert(a.id)} style={{padding:"4px 8px",borderRadius:6,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.58rem",display:"flex",alignItems:"center",gap:4}}><Trash2 size={9}/>Sil</button>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADMIN PANEL */}
        {activeTab==="admin"&&(
          <div>
            {!perms.canSeeAdminTab ? (
              <PermissionBanner message="Bu bölməyə giriş üçün Administrator və ya Baş Müavin hüququ lazımdır."/>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {/* Gözləyən müraciətlər */}
                <div style={card()}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"#f59e0b",boxShadow:"0 0 8px #f59e0b80"}}/>
                    <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Gözləyən Müraciətlər</h3>
                    {pending.length>0&&<span style={{background:"#f59e0b",color:"#000",fontSize:"0.55rem",borderRadius:10,padding:"2px 7px",fontWeight:900,marginLeft:"auto"}}>{pending.length}</span>}
                  </div>
                  {pending.length===0?(
                    <div style={{textAlign:"center",padding:"28px 0",color:"#334155",fontSize:"0.72rem"}}>
                      <UserCheck size={24} style={{color:"#1e293b",marginBottom:8}}/>
                      <div>Gözləyən müraciət yoxdur</div>
                    </div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {pending.map(u=>{
                        return (
                          <div key={u.id} style={{background:"rgba(245,158,11,0.04)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:10,padding:"12px 14px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                              <div>
                                <div style={{fontSize:"0.75rem",color:"#f1f5f9",fontWeight:800}}>{u.full_name||u.username}</div>
                                <div style={{fontSize:"0.62rem",color:"#64748b",marginTop:2}}>{u.username} · {u.email}</div>
                                <div style={{fontSize:"0.62rem",color:"#475569",marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                                  <RoleBadge role={normalizeRole(u.role)} size="xs"/>
                                  <span>·</span>
                                  <span>{u.service_region||"—"}</span>
                                </div>
                                {u.note&&<div style={{fontSize:"0.6rem",color:"#475569",marginTop:4,fontStyle:"italic",background:"rgba(255,255,255,0.03)",borderRadius:5,padding:"4px 8px"}}>"{u.note}"</div>}
                              </div>
                              <span style={{fontSize:"0.58rem",color:"#334155"}}>{relTime(u.created_at)}</span>
                            </div>
                            <div style={{display:"flex",gap:6}}>
                              <button
                                onClick={async()=>{
                                  await supabase.from('users').update({status:'approved'}).eq('id',u.id);
                                  setPending(prev=>prev.filter(p=>p.id!==u.id));
                                  addLog({ userId:currentUser.id, userName:currentUser.name, userRole:currentUser.role,
                                    action:"İstifadəçini təsdiqledi", target:u.full_name||u.username,
                                    detail:`Rol: ${normalizeRole(u.role)} · ${u.service_region||""}`, category:"admin" });
                                }}
                                style={{flex:1,padding:"7px",borderRadius:8,background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.3)",color:"#10b981",cursor:"pointer",fontSize:"0.65rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}
                              >
                                <UserCheck size={11}/>Təsdiqlə
                              </button>
                              <button
                                onClick={async()=>{
                                  await supabase.from('users').update({status:'rejected'}).eq('id',u.id);
                                  setPending(prev=>prev.filter(p=>p.id!==u.id));
                                  addLog({ userId:currentUser.id, userName:currentUser.name, userRole:currentUser.role,
                                    action:"İstifadəçini rədd etdi", target:u.full_name||u.username,
                                    detail:`Rol: ${normalizeRole(u.role)} · ${u.service_region||""}`, category:"admin" });
                                }}
                                style={{flex:1,padding:"7px",borderRadius:8,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",cursor:"pointer",fontSize:"0.65rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}
                              >
                                <UserX size={11}/>Rədd Et
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Mövcud istifadəçilər */}
                <div style={card()}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <Users size={14} style={{color:"#38bdf8"}}/>
                    <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>İstifadəçilər</h3>
                    <span style={{fontSize:"0.6rem",color:"#334155",marginLeft:"auto"}}>{users.length} aktiv</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:480,overflowY:"auto"}}>
                    {users.map(u=>{
                      const rd = ROLES_DEF.find(r=>r.id===u.role)||ROLES_DEF[3];
                      const isSelf = u.id === currentUser.id;
                      return (
                        <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:9,border:`1px solid ${rd.color}15`}}>
                          <div style={{width:30,height:30,borderRadius:8,background:`${rd.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontWeight:900,color:rd.color,flexShrink:0}}>
                            {u.avatar}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:"0.7rem",color:"#e2e8f0",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                              {u.name}
                              {isSelf&&<span style={{fontSize:"0.52rem",color:"#38bdf8",background:"rgba(56,189,248,0.1)",borderRadius:3,padding:"1px 5px"}}>Siz</span>}
                            </div>
                            <div style={{fontSize:"0.6rem",color:"#334155",marginTop:1,display:"flex",alignItems:"center",gap:6}}>
                              <RoleBadge role={u.role} size="xs"/>
                              <span>·</span>
                              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.serviceArea||"—"}</span>
                            </div>
                          </div>
                          {!isSelf && perms.canManageOps && (
                            <div style={{display:"flex",gap:4,flexShrink:0}}>
                              {perms.canManageAdmins && (
                                <select
                                  value={u.role}
                                  onChange={async(e)=>{
                                    const newRole = e.target.value;
                                    await supabase.from('users').update({role:newRole}).eq('id',u.id);
                                    setUsers(prev=>prev.map(x=>x.id===u.id?{...x,role:newRole}:x));
                                    addLog({ userId:currentUser.id, userName:currentUser.name, userRole:currentUser.role,
                                      action:"Rolu dəyişdi", target:u.name,
                                      detail:`${u.role} → ${newRole}`, category:"admin" });
                                  }}
                                  style={{background:"rgba(6,12,28,0.95)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:6,color:"#94a3b8",fontSize:"0.58rem",padding:"3px 5px",cursor:"pointer",outline:"none",fontFamily:"inherit"}}
                                >
                                  {ROLES_DEF.map(r=>(
                                    <option key={r.id} value={r.id} style={{background:"#020610"}}>{r.label}</option>
                                  ))}
                                </select>
                              )}
                              <button
                                onClick={async()=>{
                                  const newStatus = u.status==='blocked'?'approved':'blocked';
                                  await supabase.from('users').update({status:newStatus}).eq('id',u.id);
                                  setUsers(prev=>prev.map(x=>x.id===u.id?{...x,status:newStatus}:x));
                                  addLog({ userId:currentUser.id, userName:currentUser.name, userRole:currentUser.role,
                                    action: newStatus==='blocked'?"İstifadəçini blokladı":"İstifadəçinin blokunu açdı",
                                    target:u.name, detail:"", category:"admin" });
                                }}
                                title={u.status==='blocked'?"Aktiv et":"Blokla"}
                                style={{width:26,height:26,borderRadius:6,background:u.status==='blocked'?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.06)",border:`1px solid ${u.status==='blocked'?"rgba(16,185,129,0.25)":"rgba(239,68,68,0.15)"}`,color:u.status==='blocked'?"#10b981":"#ef4444",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
                              >
                                {u.status==='blocked'?<ShieldCheck size={10}/>:<ShieldOff size={10}/>}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ FƏALİYYƏT JURNALI — yalnız admin */}
        {activeTab==="activity"&&(
          <div>
            {!perms.isAdmin ? (
              <PermissionBanner message="Bu bölməyə yalnız Administrator daxil ola bilər."/>
            ) : (
              <div>
                {/* Başlıq + statistika */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:18}}>
                  {[
                    { label:"Ümumi Qeyd",    value:logs.length,                                                  color:"#38bdf8", Icon:ClipboardList },
                    { label:"Giriş/Çıxış",   value:logs.filter(l=>l.category==="auth").length,                  color:"#10b981", Icon:LogIn        },
                    { label:"Məlumat Girişi", value:logs.filter(l=>l.category==="data").length,                  color:"#f59e0b", Icon:PenLine       },
                    { label:"Admin Əməliyyat",value:logs.filter(l=>l.category==="admin").length,                 color:"#ef4444", Icon:Crown         },
                    { label:"Mesaj",          value:logs.filter(l=>l.category==="message").length,               color:"#a78bfa", Icon:MessageSquare },
                    { label:"Hadisə",         value:logs.filter(l=>l.category==="incident").length,              color:"#f97316", Icon:AlertTriangle },
                  ].map(({label,value,color,Icon})=>(
                    <div key={label} style={{...card(),display:"flex",gap:12,alignItems:"center",padding:14}}>
                      <div style={{width:36,height:36,borderRadius:10,background:`${color}15`,border:`1px solid ${color}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Icon size={16} style={{color}}/>
                      </div>
                      <div>
                        <div style={{fontSize:"0.62rem",color:"#475569"}}>{label}</div>
                        <div style={{fontSize:"1.1rem",fontWeight:900,color:"#f1f5f9",lineHeight:1.1}}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Log cədvəli */}
                <div style={card()}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <History size={14} style={{color:"#38bdf8"}}/>
                    <h3 style={{color:"#f1f5f9",fontSize:"0.85rem",fontWeight:800,margin:0}}>Fəaliyyət Jurnalı</h3>
                    <span style={{fontSize:"0.6rem",color:"#334155",marginLeft:"auto"}}>Son {logs.length} qeyd</span>
                  </div>

                  {logsLoading ? (
                    <div style={{textAlign:"center",padding:"32px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:"#334155",fontSize:"0.72rem"}}>
                      <RefreshCw size={14} style={{animation:"spin 1s linear infinite",color:"#38bdf8"}}/> Yüklənir...
                    </div>
                  ) : logs.length === 0 ? (
                    <div style={{textAlign:"center",padding:"40px 0",color:"#334155",fontSize:"0.72rem"}}>
                      <History size={28} style={{color:"#1e293b",marginBottom:10}}/>
                      <div>Hələ heç bir fəaliyyət qeydə alınmayıb</div>
                    </div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:0,maxHeight:600,overflowY:"auto"}}>
                      {/* Cədvəl başlığı */}
                      <div style={{display:"grid",gridTemplateColumns:"140px 130px 100px 1fr 1fr",gap:12,padding:"8px 14px",borderBottom:"1px solid rgba(56,189,248,0.1)",marginBottom:4}}>
                        {["Tarix & Saat","İstifadəçi","Rol","Əməliyyat","Hədəf / Təfərrüat"].map(h=>(
                          <div key={h} style={{fontSize:"0.58rem",color:"#334155",fontWeight:700,letterSpacing:"0.08em"}}>{h}</div>
                        ))}
                      </div>

                      {logs.map((log, idx) => {
                        const catColors = {
                          auth:     "#10b981",
                          data:     "#f59e0b",
                          admin:    "#ef4444",
                          message:  "#a78bfa",
                          incident: "#f97316",
                          general:  "#38bdf8",
                        };
                        const catColor = catColors[log.category] || "#38bdf8";
                        const rd = ROLES_DEF.find(r=>r.id===normalizeRole(log.user_role)) || ROLES_DEF[3];
                        const dt = new Date(log.created_at);
                        const dateStr = dt.toLocaleDateString("az-AZ",{day:"2-digit",month:"2-digit",year:"numeric"});
                        const timeStr = dt.toLocaleTimeString("az-AZ",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
                        const isEven = idx % 2 === 0;

                        return (
                          <div
                            key={log.id}
                            style={{
                              display:"grid",
                              gridTemplateColumns:"140px 130px 100px 1fr 1fr",
                              gap:12,
                              padding:"10px 14px",
                              background: isEven ? "rgba(255,255,255,0.015)" : "transparent",
                              borderBottom:"1px solid rgba(56,189,248,0.04)",
                              alignItems:"center",
                              transition:"background 0.15s",
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(56,189,248,0.04)"}
                            onMouseLeave={e=>e.currentTarget.style.background=isEven?"rgba(255,255,255,0.015)":"transparent"}
                          >
                            {/* Tarix */}
                            <div>
                              <div style={{fontSize:"0.68rem",color:"#94a3b8",fontWeight:600}}>{dateStr}</div>
                              <div style={{fontSize:"0.62rem",color:"#475569",marginTop:1,fontVariantNumeric:"tabular-nums"}}>{timeStr}</div>
                            </div>

                            {/* İstifadəçi */}
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{width:22,height:22,borderRadius:6,background:`${rd.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.52rem",fontWeight:900,color:rd.color,flexShrink:0}}>
                                {(log.user_name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                              </div>
                              <span style={{fontSize:"0.68rem",color:"#e2e8f0",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                {log.user_name||"—"}
                              </span>
                            </div>

                            {/* Rol */}
                            <div>
                              <RoleBadge role={normalizeRole(log.user_role)} size="xs"/>
                            </div>

                            {/* Əməliyyat */}
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{width:6,height:6,borderRadius:"50%",background:catColor,flexShrink:0,boxShadow:`0 0 5px ${catColor}80`}}/>
                              <span style={{fontSize:"0.7rem",color:"#f1f5f9",fontWeight:700}}>{log.action}</span>
                            </div>

                            {/* Hədəf / Təfərrüat */}
                            <div>
                              {log.target && (
                                <div style={{fontSize:"0.68rem",color:"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{log.target}</div>
                              )}
                              {log.detail && (
                                <div style={{fontSize:"0.62rem",color:"#475569",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontStyle:"italic"}}>{log.detail}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ MESSAGES — hook prop-ları birbaşa ötürülür */}
        {activeTab==="messages"&&(
          <div style={card()}>
            <MessagingPanel
              currentUser={currentUser}
              users={users}
              messages={messages}
              loading={msgLoading}
              markAsRead={markAsRead}
              sendMessage={sendMessageWithLog}
              deleteMessage={deleteMessage}
              perms={perms}
            />
          </div>
        )}

      </main>
    </div>
  );
}
