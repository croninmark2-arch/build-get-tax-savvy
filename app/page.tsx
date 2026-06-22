"use client"; 

import { useEffect, useMemo, useState } from "react";

type Tab =
  | "dashboard"
  | "properties"
  | "expenses"
  | "reports"
  | "homeoffice"
  | "settings"
  | "upgrade";

type Mode = "live" | "demo";

type Property = {
  id: number;
  name: string;
  address: string;
  owner: string;
  rent: number;
  tenant: string;
  isPersonal: boolean;
  leaseName?: string;
  leaseUrl?: string;
  yearPurchased?: string;
  monthPurchased?: string;
};

type Expense = {
  id: number;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  propertyIds: number[];
  splitType: "even" | "units" | "custom" | "single";
  notes: string;
};

type Accountant = {
  id: number;
  name: string;
  title: string;
  email: string;
  primary?: boolean;
};

type HomeOfficeArea = {
  id: number;
  label: string;
  sqft: string;
  notes: string;
};

type TrialProfile = {
  email: string;
  name: string;
  company: string;
  startAt: number | null;
  trialDays: number;
};

type AppState = {
  appName: string;
  tagline: string;
  supportEmail: string;
  brandNavy: string;
  brandBlue: string;
  brandGreen: string;
  showTerms: boolean;
  showCancelPolicy: boolean;
  showPayments: boolean;
  properties: Property[];
  expenses: Expense[];
  accountants: Accountant[];
  homeOffices: HomeOfficeArea[];
  trial: TrialProfile;
};

const LIVE_SEED: AppState = {
  appName: "TaxSavvy",
  tagline: "Tax Manager",
  supportEmail: "help@taxsavvy.app",
  brandNavy: "#1b2a4a",
  brandBlue: "#2f6fed",
  brandGreen: "#4cff34",
  showTerms: false,
  showCancelPolicy: false,
  showPayments: false,
  properties: [
    { id: 1, name: "Personal Home", address: "118 Daffodil Drive, Horseheads, NY", owner: "Mark Cronin", rent: 0, tenant: "", isPersonal: true, yearPurchased: "", monthPurchased: "" },
    { id: 2, name: "Orchard Street", address: "114 Orchard St, Horseheads, NY", owner: "Cronin NY Property Management LLC", rent: 1405, tenant: "", isPersonal: false, leaseName: "Lease - Orchard Street", leaseUrl: "", yearPurchased: "", monthPurchased: "" },
    { id: 3, name: "Elmwood Unit A", address: "220 Elmwood Ave Unit A, Elmira Heights, NY", owner: "Cronin NY Property Management LLC", rent: 1400, tenant: "", isPersonal: false, yearPurchased: "", monthPurchased: "" },
    { id: 4, name: "Elmwood Unit B", address: "220 Elmwood Ave Unit B, Elmira Heights, NY", owner: "Cronin NY Property Management LLC", rent: 1100, tenant: "", isPersonal: false, yearPurchased: "", monthPurchased: "" },
    { id: 5, name: "Corning Building", address: "146 W. Fourth Street, Corning, NY", owner: "Mark & Tammi Cronin", rent: 1700, tenant: "", isPersonal: false, yearPurchased: "", monthPurchased: "" },
  ],
  expenses: [],
  accountants: [],
  homeOffices: [],
  trial: { email: "", name: "", company: "", startAt: null, trialDays: 14 },
};

const fmt = (n: number | string | undefined | null) =>
  "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("live");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [state, setState] = useState<AppState>(LIVE_SEED);
  const [trialEmail, setTrialEmail] = useState("");
  const [trialName, setTrialName] = useState("");
  const [trialCompany, setTrialCompany] = useState("");
  const [toast, setToast] = useState("");
  const [reportText, setReportText] = useState("Choose a report to generate.");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Repairs");
  const [expenseNotes, setExpenseNotes] = useState("");
  const [expensePropertyIds, setExpensePropertyIds] = useState<number[]>([]);
  const [emailTarget, setEmailTarget] = useState("");
  const [showTrialPopup, setShowTrialPopup] = useState(false);

  const storageKey = useMemo(() => (mode === "demo" ? "taxsavvy_demo_v1" : "taxsavvy_live_v1"), [mode]);
  const darkNavy = state.brandNavy || "#1b2a4a";
  const blue = state.brandBlue || "#2f6fed";
  const green = state.brandGreen || "#4cff34";

  const properties = state.properties;

  const activeTrialDaysLeft = useMemo(() => {
    if (!state.trial.startAt) return state.trial.trialDays;
    const elapsed = Date.now() - state.trial.startAt;
    const total = state.trial.trialDays * 24 * 60 * 60 * 1000;
    return Math.max(0, Math.ceil((total - elapsed) / (24 * 60 * 60 * 1000)));
  }, [state.trial.startAt, state.trial.trialDays]);

  const activeTrialTimeLeft = useMemo(() => {
    if (!state.trial.startAt) return "";
    const total = state.trial.trialDays * 24 * 60 * 60 * 1000;
    const remaining = Math.max(0, total - (Date.now() - state.trial.startAt));
    const d = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const h = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const s = Math.floor((remaining % (60 * 1000)) / 1000);
    return `${d} days, ${h} hours, ${m} minutes, ${s} seconds`;
  }, [state.trial.startAt, state.trial.trialDays]);

  useEffect(() => {
    const savedMode = (localStorage.getItem("taxsavvy_mode") as Mode | null) || "live";
    setMode(savedMode);
    const key = savedMode === "demo" ? "taxsavvy_demo_v1" : "taxsavvy_live_v1";
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppState;
        setState(parsed);
        setTrialEmail(parsed.trial.email || "");
        setTrialName(parsed.trial.name || "");
        setTrialCompany(parsed.trial.company || "");
      } catch {
        setState(LIVE_SEED);
      }
    } else {
      setState(LIVE_SEED);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("taxsavvy_mode", mode);
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [mounted, mode, storageKey, state]);

  useEffect(() => {
    if (!mounted || !state.trial.startAt) return;
    const t = setInterval(() => {
      const elapsed = Date.now() - state.trial.startAt!;
      const total = state.trial.trialDays * 24 * 60 * 60 * 1000;
      const remaining = total - elapsed;
      if (remaining <= 3 * 24 * 60 * 60 * 1000 && remaining > 0) setShowTrialPopup(true);
      if (remaining <= 0) setShowTrialPopup(true);
      setState((p) => ({ ...p }));
    }, 1000);
    return () => clearInterval(t);
  }, [mounted, state.trial.startAt, state.trial.trialDays]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1800);
  };

  const saveNow = () => {
    localStorage.setItem(storageKey, JSON.stringify(state));
    notify("Saved");
  };

  const toggleMode = () => {
    const next = mode === "live" ? "demo" : "live";
    setMode(next);
    setTab("dashboard");
  };

  const updateTrial = () => {
    if (!trialEmail.trim()) return notify("Email is required");
    setState((p) => ({
      ...p,
      trial: {
        email: trialEmail.trim(),
        name: trialName.trim(),
        company: trialCompany.trim(),
        startAt: p.trial.startAt || Date.now(),
        trialDays: 14,
      },
    }));
    notify("Trial saved");
    setShowTrialPopup(false);
  };

  const setTrialStartNow = () => {
    if (!trialEmail.trim()) return notify("Email is required");
    setState((p) => ({
      ...p,
      trial: {
        email: trialEmail.trim(),
        name: trialName.trim(),
        company: trialCompany.trim(),
        startAt: Date.now(),
        trialDays: 14,
      },
    }));
    notify("14-day trial started");
  };

  const addExpense = () => {
    const amount = Number(expenseAmount || 0);
    if (!expenseVendor.trim() || !amount || !expensePropertyIds.length) return notify("Fill vendor, amount, and property");
    setState((p) => ({
      ...p,
      expenses: [
        {
          id: Date.now(),
          date: new Date().toISOString().slice(0, 10),
          vendor: expenseVendor.trim(),
          amount,
          category: expenseCategory,
          propertyIds: expensePropertyIds,
          splitType: expensePropertyIds.length > 1 ? "even" : "single",
          notes: expenseNotes.trim(),
        },
        ...p.expenses,
      ],
    }));
    setExpenseVendor("");
    setExpenseAmount("");
    setExpenseNotes("");
    setExpensePropertyIds([]);
    notify("Expense added");
  };

  const addProperty = () => {
    const id = Math.max(0, ...state.properties.map((p) => p.id)) + 1;
    setState((p) => ({
      ...p,
      properties: [...p.properties, { id, name: "New Property", address: "New Address", owner: "", rent: 0, tenant: "", isPersonal: false, yearPurchased: "", monthPurchased: "" }],
    }));
    notify("Property added");
  };

  const addAccountant = () => {
    setState((p) => {
      const nextId = Math.max(0, ...p.accountants.map((a) => a.id)) + 1;
      return {
        ...p,
        accountants: [...p.accountants, { id: nextId, name: "New Contact", title: "CPA", email: "", primary: p.accountants.length === 0 }],
      };
    });
  };

  const runReport = (type: string) => {
    const totalIncome = state.properties.reduce((s, p) => s + Number(p.rent || 0), 0);
    const totalExpenses = state.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const totalRental = totalIncome - totalExpenses;
    const officeSqft = state.homeOffices.reduce((s, o) => s + Number(o.sqft || 0), 0);

    if (type === "pl") {
      setReportText(`P&L Report
Income: ${fmt(totalIncome)}
Expenses: ${fmt(totalExpenses)}
Net: ${fmt(totalRental)}`);
    } else if (type === "schedulee") {
      setReportText(`Schedule E
Rental income: ${fmt(totalIncome)}
Rental expenses: ${fmt(totalExpenses)}
Net: ${fmt(totalRental)}`);
    } else if (type === "schedulea") {
setReportText("Schedule A Personal deductions and itemized items can be summarized here.");
    } else if (type === "homeoffice") {
      setReportText(`Home Office Summary
Areas: ${state.homeOffices.length}
Total office sqft: ${officeSqft}`);
    } else if (type === "mileage") {
      setReportText("Mileage Report
Add mileage tracking here for property visits and business travel.");
    }
    notify("Report generated");
  };

  const sendReportToAccountant = () => {
    const selected = state.accountants.find((a) => a.email === emailTarget) || state.accountants.find((a) => a.primary) || state.accountants[0];
    if (!selected) return notify("Add an accountant contact first");
    notify(`Prepared to send to ${selected.name}`);
  };

  const updateBrand = (field: keyof AppState, value: string | boolean) => {
    setState((p) => ({ ...p, [field]: value } as AppState));
  };

  const startOrExpired = state.trial.startAt ? activeTrialDaysLeft <= 0 : false;

  if (!mounted) {
    return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f2ec" }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ec", color: "#0f1629", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", paddingBottom: 84 }}>
      <style>{`
        *{box-sizing:border-box}
        input,select,textarea,button{font:inherit}
        .app-shell{max-width:1200px;margin:0 auto;padding:0 16px 24px}
        .topbar{position:sticky;top:0;z-index:1000;background:${darkNavy};color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;box-shadow:0 2px 18px rgba(0,0,0,.18)}
        .brand{display:flex;align-items:center;gap:10px;min-width:0}
        .brand h1{margin:0;font-size:20px;font-weight:800}
        .menu{position:sticky;top:64px;z-index:999;background:#f5f2ec;border-bottom:1px solid #dde3ea;padding:10px 16px;overflow-x:auto;white-space:nowrap}
        .navbtn{border:1px solid #cbd5e1;background:${blue};color:#fff;border-radius:999px;padding:10px 16px;margin-right:8px;font-weight:700;cursor:pointer}
        .navbtn.active{background:${green};color:${darkNavy};border-color:${green}}
        .card{background:#fff;border:1px solid #dde3ea;border-radius:18px;padding:18px;box-shadow:0 8px 30px rgba(15,22,41,.08)}
        .grid{display:grid;gap:16px}
        .grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
        .grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
        .grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}
        .kpi{background:${darkNavy};color:#fff;border-radius:20px;padding:22px 20px;min-height:118px}
        .kpi .k{color:${green};font-size:12.5px;font-weight:800;letter-spacing:.04em}
        .kpi .v{font-size:30px;font-weight:800;margin-top:10px}
        .kpi .sub{color:#8aa0b8;font-size:12.5px;margin-top:4px}
        .title{font-size:28px;font-weight:800;margin:4px 0 16px;letter-spacing:-.015em}
        .muted{color:#64748b}
        .btn{border:none;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
        .btn-green{background:${green};color:${darkNavy}}
        .btn-white{background:#fff;color:${darkNavy};border:1px solid #cbd5e1}
        .btn-navy{background:${darkNavy};color:#fff}
        .chip{display:inline-block;background:#eef2f6;border-radius:999px;padding:4px 10px;font-size:12px}
        .field{width:100%;background:#fff;border:1.5px solid #cbd5e1;border-radius:12px;padding:12px 13px;color:${darkNavy};outline:none}
        .small{font-size:13px}
        .bottomnav{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #dde3ea;z-index:1000;display:flex;justify-content:space-around;padding:7px 4px 9px}
        .bottomnav button{color:${darkNavy};background:transparent;border:none;padding:8px 10px;font-size:11.5px;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:64px;border-radius:10px;cursor:pointer}
        .bottomnav button.active{background:${green};font-weight:700}
        .toast{position:fixed;right:16px;bottom:84px;background:${darkNavy};color:#fff;padding:11px 14px;border-radius:12px;font-weight:700;box-shadow:0 12px 30px rgba(0,0,0,.22);z-index:2000}
        .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
        .sidewrap{display:grid;grid-template-columns:1fr;gap:16px}
        @media(min-width:900px){.sidewrap{grid-template-columns:320px 1fr}.bottomnav{display:none}.app-shell{padding-bottom:24px}}
        @media(max-width:768px){.grid-2,.grid-3,.grid-4{grid-template-columns:1fr}.title{font-size:24px}.topbar{align-items:flex-start}}
      `}</style>

      <header className="topbar">
        <div className="brand">
          <div style={{ width: 42, height: 42, borderRadius: 999, background: darkNavy, display: "grid", placeItems: "center", overflow: "hidden", border: `2px solid ${green}` }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: "linear-gradient(135deg, #4cff34 0%, #4cff34 50%, #e53935 50%, #e53935 100%)" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1>{state.appName}</h1>
            <div style={{ color: "#8aa0b8", fontSize: 13 }}>{state.tagline}</div>
          </div>
        </div>

        <div className="row">
          <span className="chip">{mode === "demo" ? "DEMO" : "LIVE – Private"}</span>
          <button className="btn btn-white" onClick={toggleMode}>{mode === "live" ? "Demo Mode" : "Live Mode"}</button>
          <button className="btn btn-green" onClick={saveNow}>Save</button>
        </div>
      </header>

      <nav className="menu">
        {(["dashboard", "properties", "expenses", "reports", "homeoffice", "settings", "upgrade"] as Tab[]).map((t) => (
          <button key={t} className={`navbtn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "homeoffice" ? "Home Office" : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <main className="app-shell">
        {showTrialPopup && (
          <div className="card" style={{ marginTop: 16, border: `2px solid ${green}` }}>
            <div style={{ fontWeight: 800 }}>Trial reminder</div>
            <div className="small muted">{startOrExpired ? "Your trial has ended." : `Your trial has ${activeTrialDaysLeft} day(s) left. Time remaining: ${activeTrialTimeLeft}.`}</div>
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn btn-green" onClick={() => setShowTrialPopup(false)}>Got it</button>
            </div>
          </div>
        )}

        <section hidden={tab !== "dashboard"}>
          <h2 className="title">Dashboard</h2>
          <div className="grid grid-4">
            <div className="kpi"><div className="k">TOTAL MONTHLY RENT</div><div className="v">{fmt(properties.filter((p) => !p.isPersonal).reduce((s, p) => s + Number(p.rent || 0), 0))}</div><div className="sub">{properties.filter((p) => !p.isPersonal).length} rental units</div></div>
            <div className="kpi"><div className="k">YTD COLLECTED</div><div className="v">{fmt(state.expenses.reduce((s, e) => s + Number(e.amount || 0), 0))}</div><div className="sub">Expenses saved</div></div>
            <div className="kpi"><div className="k">TRIAL</div><div className="v">{state.trial.startAt ? `${activeTrialDaysLeft}` : "14"}</div><div className="sub">{state.trial.startAt ? `${activeTrialTimeLeft}` : "Days available"}</div></div>
            <div className="kpi"><div className="k">EXPENSES</div><div className="v">{state.expenses.length}</div><div className="sub">Saved items</div></div>
          </div>
        </section>

        <section hidden={tab !== "properties"}>
          <div className="row" style={{ alignItems: "flex-end", marginBottom: 12, gap: 14 }}>
            <h2 className="title" style={{ margin: 0 }}>Properties</h2>
            <button className="btn btn-green" onClick={addProperty}>+ Add Property</button>
          </div>

          <div className="sidewrap">
            <div className="card" style={{ background: darkNavy, color: "#fff", border: `1px solid ${green}` }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Property Setup</div>
              <div className="small" style={{ color: "#cfe0ff" }}>You can edit every property, owner, rent amount, and lease link here.</div>
              <div style={{ marginTop: 12 }} className="small">
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={state.showTerms} onChange={(e) => updateBrand("showTerms", e.target.checked)} />
                  Show Terms in menu
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <input type="checkbox" checked={state.showCancelPolicy} onChange={(e) => updateBrand("showCancelPolicy", e.target.checked)} />
                  Show cancellation policy
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <input type="checkbox" checked={state.showPayments} onChange={(e) => updateBrand("showPayments", e.target.checked)} />
                  Show payments section
                </label>
              </div>
            </div>

            <div className="card" style={{ background: darkNavy, color: "#fff" }}>
              <div className="grid grid-2">
                {properties.map((p) => (
                  <div key={p.id} className="card" style={{ background: darkNavy, color: "#fff", boxShadow: "none", borderRadius: 16, border: `1px solid ${green}` }}>
                    <input className="field" value={p.name} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)) }))} />
                    <input className="field" style={{ marginTop: 8 }} value={p.address} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, address: e.target.value } : x)) }))} />
                    <input className="field" style={{ marginTop: 8 }} value={p.owner} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, owner: e.target.value } : x)) }))} placeholder="Owner" />
                    <input className="field" style={{ marginTop: 8 }} value={String(p.rent)} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, rent: Number(e.target.value) || 0 } : x)) }))} placeholder="Rent" />
                    <input className="field" style={{ marginTop: 8 }} value={p.tenant} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, tenant: e.target.value } : x)) }))} placeholder="Tenant" />
                    <input className="field" style={{ marginTop: 8 }} value={p.yearPurchased || ""} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, yearPurchased: e.target.value } : x)) }))} placeholder="Year purchased" />
                    <input className="field" style={{ marginTop: 8 }} value={p.monthPurchased || ""} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, monthPurchased: e.target.value } : x)) }))} placeholder="Month purchased" />
                    <input className="field" style={{ marginTop: 8 }} value={p.leaseName || ""} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, leaseName: e.target.value } : x)) }))} placeholder="Lease name" />
                    <input className="field" style={{ marginTop: 8 }} value={p.leaseUrl || ""} onChange={(e) => setState((prev) => ({ ...prev, properties: prev.properties.map((x) => (x.id === p.id ? { ...x, leaseUrl: e.target.value } : x)) }))} placeholder="Lease URL or file link" />
                    <div className="row" style={{ marginTop: 10 }}>
                      <button className="btn btn-white" onClick={() => setState((prev) => ({ ...prev, properties: prev.properties.filter((x) => x.id !== p.id) }))}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section hidden={tab !== "expenses"}>
          <h2 className="title">Expenses</h2>
          <div className="card">
            <div className="grid grid-2">
              <div><div className="small muted">Vendor</div><input className="field" value={expenseVendor} onChange={(e) => setExpenseVendor(e.target.value)} /></div>
              <div><div className="small muted">Amount</div><input className="field" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} /></div>
              <div>
                <div className="small muted">Category</div>
                <select className="field" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)}>
                  <option>Repairs</option><option>Maintenance</option><option>Utilities</option><option>Insurance</option><option>Supplies</option><option>Landscaping</option><option>Management</option><option>Other</option>
                </select>
              </div>
              <div><div className="small muted">Notes</div><input className="field" value={expenseNotes} onChange={(e) => setExpenseNotes(e.target.value)} /></div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="small muted">Select property or properties</div>
              <div className="row" style={{ marginTop: 8 }}>
                {properties.map((p) => (
                  <label key={p.id} className="chip" style={{ cursor: "pointer", display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <input type="checkbox" checked={expensePropertyIds.includes(p.id)} onChange={(e) => setExpensePropertyIds((prev) => e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id))} />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn btn-green" onClick={addExpense}>Save Expense</button>
              <button className="btn btn-white" onClick={() => setTab("reports")}>Go to Reports</button>
            </div>
          </div>
        </section>

        <section hidden={tab !== "homeoffice"}>
          <h2 className="title">Home Office</h2>
          <div className="card">
            <div className="grid grid-2">
              {state.homeOffices.map((o) => (
                <div key={o.id} className="card" style={{ boxShadow: "none", borderColor: "#e5e7eb" }}>
                  <input className="field" value={o.label} onChange={(e) => setState((prev) => ({ ...prev, homeOffices: prev.homeOffices.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)) }))} />
                  <input className="field" style={{ marginTop: 8 }} value={o.sqft} onChange={(e) => setState((prev) => ({ ...prev, homeOffices: prev.homeOffices.map((x) => (x.id === o.id ? { ...x, sqft: e.target.value } : x)) }))} placeholder="Sq ft" />
                  <input className="field" style={{ marginTop: 8 }} value={o.notes} onChange={(e) => setState((prev) => ({ ...prev, homeOffices: prev.homeOffices.map((x) => (x.id === o.id ? { ...x, notes: e.target.value } : x)) }))} placeholder="Notes" />
                </div>
              ))}
            </div>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn btn-green" onClick={() => setState((p) => ({ ...p, homeOffices: [...p.homeOffices, { id: Date.now(), label: "New Area", sqft: "", notes: "" }] }))}>
                Add Home Office Area
              </button>
            </div>
          </div>
        </section>

        <section hidden={tab !== "reports"}>
          <h2 className="title">Reports</h2>
          <div className="card">
            <div className="row">
              <button className="btn btn-white" onClick={() => runReport("pl")}>P&amp;L</button>
              <button className="btn btn-white" onClick={() => runReport("schedulee")}>Schedule E</button>
              <button className="btn btn-white" onClick={() => runReport("schedulea")}>Schedule A</button>
              <button className="btn btn-white" onClick={() => runReport("homeoffice")}>Home Office</button>
              <button className="btn btn-white" onClick={() => runReport("mileage")}>Mileage</button>
            </div>
            <div style={{ marginTop: 16, background: "#f6f4ef", borderRadius: 12, padding: 14, minHeight: 120, whiteSpace: "pre-wrap" }}>{reportText}</div>
            <div style={{ marginTop: 16 }} className="grid grid-2">
              <div>
                <div className="small muted">Send to accountant</div>
                <select className="field" value={emailTarget} onChange={(e) => setEmailTarget(e.target.value)}>
                  <option value="">Choose saved contact</option>
                  {state.accountants.map((a) => <option key={a.id} value={a.email}>{a.name} — {a.title} — {a.email}</option>)}
                </select>
              </div>
              <div className="row" style={{ alignItems: "end" }}>
                <button className="btn btn-green" onClick={sendReportToAccountant}>One-Touch Send</button>
                <button className="btn btn-white" onClick={() => setTab("settings")}>Edit Contacts</button>
              </div>
            </div>
          </div>
        </section>

        <section hidden={tab !== "settings"}>
          <h2 className="title">Settings</h2>
          <div className="sidewrap">
            <div className="card">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Branding</div>
              <div className="small muted">You can change these anytime.</div>
              <div style={{ marginTop: 12 }}><div className="small muted">App name</div><input className="field" value={state.appName} onChange={(e) => updateBrand("appName", e.target.value)} /></div>
              <div style={{ marginTop: 12 }}><div className="small muted">Tagline</div><input className="field" value={state.tagline} onChange={(e) => updateBrand("tagline", e.target.value)} /></div>
              <div style={{ marginTop: 12 }}><div className="small muted">Support email</div><input className="field" value={state.supportEmail} onChange={(e) => updateBrand("supportEmail", e.target.value)} /></div>
              <div style={{ marginTop: 12 }}><div className="small muted">Navy</div><input className="field" value={state.brandNavy} onChange={(e) => updateBrand("brandNavy", e.target.value)} /></div>
              <div style={{ marginTop: 12 }}><div className="small muted">Blue</div><input className="field" value={state.brandBlue} onChange={(e) => updateBrand("brandBlue", e.target.value)} /></div>
              <div style={{ marginTop: 12 }}><div className="small muted">Green</div><input className="field" value={state.brandGreen} onChange={(e) => updateBrand("brandGreen", e.target.value)} /></div>
              <div className="row" style={{ marginTop: 14 }}><button className="btn btn-green" onClick={saveNow}>Save Branding</button></div>

              <hr style={{ border: "none", borderTop: "1px solid #dde3ea", margin: "14px 0" }} />

              <div style={{ fontWeight: 800, marginBottom: 8 }}>Trial Signup</div>
              <div className="small muted">Email required. Name and company optional.</div>
              <div style={{ marginTop: 12 }}><input className="field" placeholder="Email *" value={trialEmail} onChange={(e) => setTrialEmail(e.target.value)} /></div>
              <div style={{ marginTop: 8 }}><input className="field" placeholder="Name" value={trialName} onChange={(e) => setTrialName(e.target.value)} /></div>
              <div style={{ marginTop: 8 }}><input className="field" placeholder="Company" value={trialCompany} onChange={(e) => setTrialCompany(e.target.value)} /></div>
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn btn-green" onClick={setTrialStartNow}>Start 14-Day Trial</button>
                <button className="btn btn-white" onClick={updateTrial}>Save Trial Info</button>
              </div>
              <div className="small muted" style={{ marginTop: 8 }}>Trial status: {state.trial.startAt ? `${activeTrialDaysLeft} day(s) left` : "Not started"}</div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Accountant Contacts</div>
              <div className="small muted">Store CPA, assistant, or helper emails so you do not have to type them every time.</div>
              <div style={{ marginTop: 12 }} className="grid">
                {state.accountants.map((a) => (
                  <div key={a.id} className="card" style={{ boxShadow: "none", borderColor: "#e5e7eb" }}>
                    <input className="field" value={a.name} onChange={(e) => setState((p) => ({ ...p, accountants: p.accountants.map((x) => (x.id === a.id ? { ...x, name: e.target.value } : x)) }))} />
                    <input className="field" style={{ marginTop: 8 }} value={a.title} onChange={(e) => setState((p) => ({ ...p, accountants: p.accountants.map((x) => (x.id === a.id ? { ...x, title: e.target.value } : x)) }))} />
                    <input className="field" style={{ marginTop: 8 }} value={a.email} onChange={(e) => setState((p) => ({ ...p, accountants: p.accountants.map((x) => (x.id === a.id ? { ...x, email: e.target.value } : x)) }))} />
                    <div className="row" style={{ marginTop: 8 }}>
                      <label className="small">
                        <input type="checkbox" checked={!!a.primary} onChange={(e) => setState((p) => ({ ...p, accountants: p.accountants.map((x) => ({ ...x, primary: x.id === a.id ? e.target.checked : false })) }))} /> Primary
                      </label>
                      <button className="btn btn-white" onClick={() => setState((p) => ({ ...p, accountants: p.accountants.filter((x) => x.id !== a.id) }))}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn btn-green" onClick={addAccountant}>Add Accountant</button>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #dde3ea", margin: "14px 0" }} />
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Legal & Menu</div>
              <div className="small muted">You can keep Terms hidden until launch.</div>
              <label className="small" style={{ display: "block", marginTop: 10 }}><input type="checkbox" checked={state.showTerms} onChange={(e) => updateBrand("showTerms", e.target.checked)} /> Show Terms in menu</label>
              <label className="small" style={{ display: "block", marginTop: 8 }}><input type="checkbox" checked={state.showCancelPolicy} onChange={(e) => updateBrand("showCancelPolicy", e.target.checked)} /> Show cancellation policy</label>
              <label className="small" style={{ display: "block", marginTop: 8 }}><input type="checkbox" checked={state.showPayments} onChange={(e) => updateBrand("showPayments", e.target.checked)} /> Show payments section</label>
              <div className="small muted" style={{ marginTop: 10 }}>Not legal advice. Not accounting advice.</div>
            </div>
          </div>
        </section>

        <section hidden={tab !== "upgrade"}>
          <h2 className="title">Upgrade – TaxSavvy Pro</h2>
          <div className="card">
            <p className="muted">Unlock unlimited properties, automated bank import, CPA-ready exports, and priority support.</p>
            <div className="grid grid-3">
              {["Stripe", "PayPal", "Venmo", "Cash App", "Zelle", "ACH"].map((p) => <button key={p} className={`btn ${p === "Stripe" ? "btn-navy" : "btn-white"}`}>{p}</button>)}
            </div>
            <p className="small muted" style={{ marginTop: 14 }}>14-day trial, no credit card required. Users can upgrade later.</p>
          </div>
        </section>

        {toast && <div className="toast">{toast}</div>}
      </main>

      <nav className="bottomnav">
        {["dashboard", "properties", "expenses", "reports", "settings"].map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t as Tab)}>{t}</button>
        ))}
      </nav>
    </div>
  );
}
