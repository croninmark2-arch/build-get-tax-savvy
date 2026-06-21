"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EntityType = "personal" | "llc" | "corporation" | "demo" | "trial";
type TabKey =
  | "dashboard"
  | "properties"
  | "expenses"
  | "reports"
  | "settings"
  | "demo"
  | "trial"
  | "corporate"
  | "personal"
  | "rentals";

type ToggleFlags = {
  emailCapture: boolean;
  phoneCapture: boolean;
  creditCardCapture: boolean;
  stripeEnabled: boolean;
  termsEnabled: boolean;
  cancellationEnabled: boolean;
};

type Property = {
  id: string;
  entity: EntityType;
  name: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  ownerName: string;
  ownershipGroup: string;
  rentDue: number;
  currentBalance: number;
  ytdCollected: number;
  paymentMethod: string;
  leaseType: "month-to-month" | "fixed";
  leaseStart: string;
  leaseEnd: string;
  leaseNoticeDays: number;
  tenantName: string;
  tenantPhone: string;
  tenantEmployer: string;
  additionalFamilyMembers: string;
  yearPurchased: string;
  monthPurchased: string;
  notes: string;
  monthStatus: string;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  paymentHistory: { date: string; amount: number; method: string; note: string }[];
  taxData: {
    homeownersInsurance: number;
    villageTax: number;
    townCountyTax: number;
    schoolTax: number;
    totalPropertyTax: number;
    utilitiesGas: number;
    utilitiesElectric: number;
    utilitiesWaterSewer: number;
    utilitiesTrash: number;
  };
};

type ExpenseSplit = {
  propertyId: string;
  amount: number;
  note: string;
};

type Expense = {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes: string;
  splits: ExpenseSplit[];
};

type Accountant = {
  id: string;
  name: string;
  title: string;
  email: string;
  primary: boolean;
};

type HomeOfficeArea = {
  id: string;
  label: string;
  sqft: number;
  notes: string;
};

type CompanyProfile = {
  displayName: string;
  legalName: string;
  address: string;
  supportEmail: string;
  reportEmail: string;
  phone: string;
};

type TrialInfo = {
  email: string;
  phone: string;
  name: string;
  startedAt: number | null;
  days: number;
};

type AppState = {
  profile: CompanyProfile;
  toggles: ToggleFlags;
  trial: TrialInfo;
  properties: Property[];
  expenses: Expense[];
  accountants: Accountant[];
  homeOffices: HomeOfficeArea[];
  activeEntity: EntityType | "all";
  activeTab: TabKey;
};

const STORAGE_KEY = "taxsavvy_master_v1";

const navItems: { key: TabKey; label: string }[] = [
  { key: "dashboard", label: "Home" },
  { key: "properties", label: "Properties" },
  { key: "expenses", label: "Expenses" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
  { key: "demo", label: "Invite / Demo" },
  { key: "trial", label: "Trial" },
  { key: "corporate", label: "Corporate" },
  { key: "personal", label: "Personal" },
  { key: "rentals", label: "Rentals" },
];

const defaultFlags: ToggleFlags = {
  emailCapture: false,
  phoneCapture: false,
  creditCardCapture: false,
  stripeEnabled: false,
  termsEnabled: false,
  cancellationEnabled: false,
};

const defaultProfile: CompanyProfile = {
  displayName: "TaxSavvy",
  legalName: "TaxSavvy",
  address: "118 Daffodil Dr, Horseheads, NY 14845",
  supportEmail: "help@taxsavvy.app",
  reportEmail: "cronin.mark2@gmail.com",
  phone: "",
};

const defaultTrial: TrialInfo = {
  email: "",
  phone: "",
  name: "",
  startedAt: null,
  days: 14,
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

const id = () => Math.random().toString(36).slice(2, 11);

const makeProperty = (overrides: Partial<Property> = {}): Property => ({
  id: id(),
  entity: "llc",
  name: "New Property",
  address1: "",
  city: "",
  state: "NY",
  zip: "",
  ownerName: "",
  ownershipGroup: "LLC",
  rentDue: 0,
  currentBalance: 0,
  ytdCollected: 0,
  paymentMethod: "ACH",
  leaseType: "month-to-month",
  leaseStart: "",
  leaseEnd: "",
  leaseNoticeDays: 60,
  tenantName: "",
  tenantPhone: "",
  tenantEmployer: "",
  additionalFamilyMembers: "",
  yearPurchased: "",
  monthPurchased: "",
  notes: "",
  monthStatus: "Due",
  lastPaymentDate: "",
  lastPaymentAmount: 0,
  paymentHistory: [],
  taxData: {
    homeownersInsurance: 0,
    villageTax: 0,
    townCountyTax: 0,
    schoolTax: 0,
    totalPropertyTax: 0,
    utilitiesGas: 0,
    utilitiesElectric: 0,
    utilitiesWaterSewer: 0,
    utilitiesTrash: 0,
  },
  ...overrides,
});

const defaultProperties: Property[] = [
  makeProperty({
    entity: "personal",
    name: "118 Daffodil Dr",
    address1: "118 Daffodil Dr",
    city: "Horseheads",
    state: "NY",
    zip: "14845",
    ownerName: "Private",
    ownershipGroup: "Personal",
    rentDue: 0,
  }),
  makeProperty({
    entity: "llc",
    name: "114 Orchard Street",
    address1: "114 Orchard St",
    city: "Horseheads",
    state: "NY",
    zip: "14845",
    ownerName: "MCMC Properties LLC",
    ownershipGroup: "LLC",
    rentDue: 1405,
    paymentMethod: "ACH",
    leaseType: "fixed",
    leaseStart: "2025-01-01",
    leaseEnd: "2026-12-31",
    leaseNoticeDays: 60,
    tenantName: "Arbor Housing",
    monthStatus: "Partial",
    currentBalance: 10,
    ytdCollected: 1395,
  }),
  makeProperty({
    entity: "llc",
    name: "220 Elmwood Unit A",
    address1: "220 Elmwood Ave Unit A",
    city: "Elmira Heights",
    state: "NY",
    zip: "14903",
    ownerName: "MCMC Properties LLC",
    ownershipGroup: "LLC",
    rentDue: 1400,
    tenantName: "Tenant A",
  }),
  makeProperty({
    entity: "llc",
    name: "220 Elmwood Unit B",
    address1: "220 Elmwood Ave Unit B",
    city: "Elmira Heights",
    state: "NY",
    zip: "14903",
    ownerName: "MCMC Properties LLC",
    ownershipGroup: "LLC",
    rentDue: 1100,
    tenantName: "Tenant B",
    leaseType: "month-to-month",
    leaseNoticeDays: 30,
  }),
  makeProperty({
    entity: "corporation",
    name: "MCMC Properties Inc",
    address1: "118 Daffodil Dr",
    city: "Horseheads",
    state: "NY",
    zip: "14845",
    ownerName: "MCMC Properties Inc",
    ownershipGroup: "Corporation",
    rentDue: 0,
  }),
];

const defaultExpenses: Expense[] = [
  {
    id: id(),
    date: "2026-06-01",
    vendor: "Lowe's",
    category: "Repairs",
    amount: 1275,
    paymentMethod: "Card",
    notes: "Painting garage for Unit A and Unit B",
    splits: [
      { propertyId: defaultProperties[2].id, amount: 637.5, note: "Half" },
      { propertyId: defaultProperties[3].id, amount: 637.5, note: "Half" },
    ],
  },
];

const defaultAccountants: Accountant[] = [
  { id: id(), name: "CPA Office", title: "CPA", email: "cpa@example.com", primary: true },
  { id: id(), name: "Helper", title: "Assistant", email: "helper@example.com", primary: false },
];

const defaultHomeOffices: HomeOfficeArea[] = [
  { id: id(), label: "Main Office", sqft: 180, notes: "Used for rental management" },
  { id: id(), label: "Garage Storage", sqft: 120, notes: "Tools, ladders, supplies" },
];

const initialState: AppState = {
  profile: defaultProfile,
  toggles: defaultFlags,
  trial: defaultTrial,
  properties: defaultProperties,
  expenses: defaultExpenses,
  accountants: defaultAccountants,
  homeOffices: defaultHomeOffices,
  activeEntity: "all",
  activeTab: "dashboard",
};

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AppState>(initialState);
  const [toast, setToast] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showCancellation, setShowCancellation] = useState(false);
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const [newExpense, setNewExpense] = useState({
    vendor: "",
    category: "Repairs",
    amount: "",
    method: "ACH",
    notes: "",
    propertyIdA: "",
    propertyIdB: "",
    splitA: "",
    splitB: "",
    splitMode: "single",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, mounted]);

  const activeProperties = useMemo(() => {
    if (state.activeEntity === "all") return state.properties;
    return state.properties.filter((p) => p.entity === state.activeEntity);
  }, [state.activeEntity, state.properties]);

  const ytdTotalRent = useMemo(
    () => activeProperties.reduce((sum, p) => sum + (p.ytdCollected || 0), 0),
    [activeProperties]
  );

  const totalBalance = useMemo(
    () => activeProperties.reduce((sum, p) => sum + (p.currentBalance || 0), 0),
    [activeProperties]
  );

  const totalTaxes = useMemo(
    () =>
      activeProperties.reduce(
        (sum, p) => sum + (p.taxData.totalPropertyTax || 0),
        0
      ),
    [activeProperties]
  );

  const totalInsurance = useMemo(
    () =>
      activeProperties.reduce(
        (sum, p) => sum + (p.taxData.homeownersInsurance || 0),
        0
      ),
    [activeProperties]
  );

  const trialRemaining = useMemo(() => {
    if (!state.trial.startedAt) return state.trial.days;
    const elapsed = Date.now() - state.trial.startedAt;
    const left = state.trial.days * 24 * 60 * 60 * 1000 - elapsed;
    return Math.max(0, Math.ceil(left / (24 * 60 * 60 * 1000)));
  }, [state.trial.startedAt, state.trial.days]);

  const trialCountdown = useMemo(() => {
    if (!state.trial.startedAt) return "14 days, 0 hours, 0 minutes, 0 seconds";
    const total = state.trial.days * 24 * 60 * 60 * 1000;
    const left = Math.max(0, total - (Date.now() - state.trial.startedAt));
    const d = Math.floor(left / (24 * 60 * 60 * 1000));
    const h = Math.floor((left % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const m = Math.floor((left % (60 * 60 * 1000)) / (60 * 1000));
    const s = Math.floor((left % (60 * 1000)) / 1000);
    return `${d} days, ${h} hours, ${m} minutes, ${s} seconds`;
  }, [state.trial.startedAt, state.trial.days]);

  useEffect(() => {
    const t = setInterval(() => {
      setState((p) => ({ ...p }));
      if (state.trial.startedAt && trialRemaining <= 3) setShowTrialBanner(true);
    }, 1000);
    return () => clearInterval(t);
  }, [state.trial.startedAt, trialRemaining]);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setToast("Saved");
    setTimeout(() => setToast(""), 1600);
  };

  const addProperty = (entity: EntityType) => {
    const p = makeProperty({ entity, ownershipGroup: entity.toUpperCase() });
    setState((prev) => ({ ...prev, properties: [p, ...prev.properties] }));
  };

  const updateProperty = (propertyId: string, updater: (p: Property) => Property) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.map((p) => (p.id === propertyId ? updater(p) : p)),
    }));
  };

  const deleteProperty = (propertyId: string) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.filter((p) => p.id !== propertyId),
    }));
  };

  const addHomeOfficeArea = () => {
    setState((prev) => ({
      ...prev,
      homeOffices: [
        { id: id(), label: "New Area", sqft: 0, notes: "" },
        ...prev.homeOffices,
      ],
    }));
  };

  const addAccountant = () => {
    setState((prev) => ({
      ...prev,
      accountants: [
        { id: id(), name: "New Contact", title: "CPA", email: "", primary: false },
        ...prev.accountants,
      ],
    }));
  };

  const updateExpenseField = (field: string, value: string) => {
    setNewExpense((prev) => ({ ...prev, [field]: value }));
  };

  const addExpense = () => {
    const amount = Number(newExpense.amount || 0);
    const splitA = Number(newExpense.splitA || 0);
    const splitB = Number(newExpense.splitB || 0);

    let splits: ExpenseSplit[] = [];
    if (newExpense.splitMode === "double" && newExpense.propertyIdA && newExpense.propertyIdB) {
      const totalSplit = splitA + splitB || amount;
      const a = splitA || amount / 2;
      const b = splitB || amount / 2;
      splits = [
        { propertyId: newExpense.propertyIdA, amount: a, note: "Split A" },
        { propertyId: newExpense.propertyIdB, amount: b, note: "Split B" },
      ];
      if (Math.abs(totalSplit - amount) > 0.01) {
        setToast("Split total should match amount");
        setTimeout(() => setToast(""), 1800);
        return;
      }
    } else if (newExpense.propertyIdA) {
      splits = [{ propertyId: newExpense.propertyIdA, amount, note: "Single" }];
    }

    const expense: Expense = {
      id: id(),
      date: new Date().toISOString().slice(0, 10),
      vendor: newExpense.vendor,
      category: newExpense.category,
      amount,
      paymentMethod: newExpense.method,
      notes: newExpense.notes,
      splits,
    };

    setState((prev) => ({
      ...prev,
      expenses: [expense, ...prev.expenses],
    }));

    setNewExpense({
      vendor: "",
      category: "Repairs",
      amount: "",
      method: "ACH",
      notes: "",
      propertyIdA: "",
      propertyIdB: "",
      splitA: "",
      splitB: "",
      splitMode: "single",
    });

    setToast("Expense added");
    setTimeout(() => setToast(""), 1600);
  };

  const startTrial = () => {
    if (state.toggles.emailCapture && !state.trial.email) return;
    if (state.toggles.phoneCapture && !state.trial.phone) return;
    setState((prev) => ({
      ...prev,
      trial: { ...prev.trial, startedAt: Date.now() },
    }));
    setToast("Trial started");
    setTimeout(() => setToast(""), 1600);
  };

  const currentTheme = {
    navy: "#1f3153",
    green: "#48ff3d",
    white: "#ffffff",
    bg: "#f4f7fb",
    text: "#111827",
  };

  const cardStyle = {
    background: currentTheme.navy,
    color: currentTheme.white,
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: `1px solid rgba(255,255,255,0.08)`,
  } as React.CSSProperties;

  const boxStyle = {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    border: "1px solid #dbe2ea",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  } as React.CSSProperties;

  const inputStyle = {
    width: "100%",
    border: "1px solid #cfd8e3",
    borderRadius: 10,
    padding: "10px 12px",
    background: "#fff",
    color: currentTheme.text,
    outline: "none",
  } as React.CSSProperties;

  const buttonStyle = (active = false): React.CSSProperties => ({
    background: active ? currentTheme.green : currentTheme.navy,
    color: active ? currentTheme.navy : "#fff",
    border: `1px solid ${active ? currentTheme.green : currentTheme.navy}`,
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  });

  const bottomButtonStyle = (active = false): React.CSSProperties => ({
    flex: 1,
    background: active ? currentTheme.green : currentTheme.navy,
    color: active ? currentTheme.navy : "#fff",
    border: "none",
    padding: "10px 6px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
  });

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: currentTheme.bg }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: currentTheme.bg, color: currentTheme.text, paddingBottom: 90 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: currentTheme.navy, color: "#fff", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: currentTheme.green, color: currentTheme.navy, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 24 }}>
            $
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{state.profile.displayName}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{state.profile.legalName}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button style={buttonStyle(demoMode)} onClick={() => { setDemoMode(true); setLiveMode(false); setState((p) => ({ ...p, activeEntity: "all" })); }}>Demo</button>
          <button style={buttonStyle(liveMode)} onClick={() => { setLiveMode(true); setDemoMode(false); setState((p) => ({ ...p, activeEntity: "all" })); }}>Live</button>
          <button style={buttonStyle(false)} onClick={save}>Save</button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 16 }}>
        {showTrialBanner && (
          <div style={{ ...boxStyle, marginBottom: 16, borderLeft: `6px solid ${currentTheme.green}` }}>
            <div style={{ fontWeight: 800 }}>14-Day Trial</div>
            <div style={{ marginTop: 6 }}>
              Any information entered during trial mode is stored for a short recovery period if you return within 7 days.
            </div>
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.75 }}>Time left: {trialCountdown}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <button style={buttonStyle(false)} onClick={startTrial}>Start Trial</button>
              <button style={buttonStyle(false)} onClick={() => setShowTrialBanner(false)}>Hide</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginBottom: 16 }}>
          <div style={cardStyle}><div style={{ opacity: 0.8 }}>YTD Rent</div><div style={{ fontSize: 28, fontWeight: 900 }}>{money(ytdTotalRent)}</div></div>
          <div style={cardStyle}><div style={{ opacity: 0.8 }}>Outstanding</div><div style={{ fontSize: 28, fontWeight: 900 }}>{money(totalBalance)}</div></div>
          <div style={cardStyle}><div style={{ opacity: 0.8 }}>Property Taxes</div><div style={{ fontSize: 28, fontWeight: 900 }}>{money(totalTaxes)}</div></div>
          <div style={cardStyle}><div style={{ opacity: 0.8 }}>Insurance</div><div style={{ fontSize: 28, fontWeight: 900 }}>{money(totalInsurance)}</div></div>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "280px 1fr" }}>
          <div style={{ ...boxStyle, position: "sticky", top: 82, alignSelf: "start" }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Menu</div>
            <div style={{ display: "grid", gap: 8 }}>
              {navItems.map((n) => (
                <button
                  key={n.key}
                  style={buttonStyle(state.activeTab === n.key)}
                  onClick={() => setState((p) => ({ ...p, activeTab: n.key }))}
                >
                  {n.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 16, fontWeight: 900 }}>Entity</div>
            <select
              style={{ ...inputStyle, marginTop: 8 }}
              value={state.activeEntity}
              onChange={(e) => setState((p) => ({ ...p, activeEntity: e.target.value as any }))}
            >
              <option value="all">All</option>
              <option value="personal">Personal</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="trial">Trial</option>
              <option value="demo">Demo</option>
            </select>

            <div style={{ marginTop: 16, fontWeight: 900 }}>Quick Toggles</div>
            <label style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input type="checkbox" checked={state.toggles.emailCapture} onChange={(e) => setState((p) => ({ ...p, toggles: { ...p.toggles, emailCapture: e.target.checked } }))} />
              Email capture
            </label>
            <label style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input type="checkbox" checked={state.toggles.phoneCapture} onChange={(e) => setState((p) => ({ ...p, toggles: { ...p.toggles, phoneCapture: e.target.checked } }))} />
              Phone capture
            </label>
            <label style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input type="checkbox" checked={state.toggles.creditCardCapture} onChange={(e) => setState((p) => ({ ...p, toggles: { ...p.toggles, creditCardCapture: e.target.checked } }))} />
              Credit card capture
            </label>
            <label style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input type="checkbox" checked={state.toggles.stripeEnabled} onChange={(e) => setState((p) => ({ ...p, toggles: { ...p.toggles, stripeEnabled: e.target.checked } }))} />
              Stripe enabled
            </label>
            <label style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input type="checkbox" checked={state.toggles.termsEnabled} onChange={(e) => setState((p) => ({ ...p, toggles: { ...p.toggles, termsEnabled: e.target.checked } }))} />
              Terms enabled
            </label>
            <label style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <input type="checkbox" checked={state.toggles.cancellationEnabled} onChange={(e) => setState((p) => ({ ...p, toggles: { ...p.toggles, cancellationEnabled: e.target.checked } }))} />
              Cancellation enabled
            </label>

            <div style={{ marginTop: 16, fontWeight: 900 }}>Invite / Demo</div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
              <Link href="/demo">Click here to see how it works</Link>
            </div>

            <div style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
              Not legal advice. Not accounting advice. Users are responsible for the data they enter.
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {state.activeTab === "dashboard" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={boxStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900 }}>Dashboard</div>
                      <div style={{ opacity: 0.7 }}>YTD totals, balances, and quick property status.</div>
                    </div>
                    <button style={buttonStyle(false)} onClick={() => addProperty(state.activeEntity === "all" ? "llc" : state.activeEntity as EntityType)}>
                      Add Property
                    </button>
                  </div>
                </div>

                {activeProperties.map((p) => (
                  <div key={p.id} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 900 }}>{p.name}</div>
                        <div style={{ opacity: 0.9 }}>{p.address1}, {p.city}, {p.state} {p.zip}</div>
                        <div style={{ marginTop: 6, opacity: 0.8 }}>
                          {p.tenantName || "No tenant"} · {p.ownershipGroup} · {p.leaseType} · Notice {p.leaseNoticeDays} days
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, opacity: 0.8 }}>Monthly Rent</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>{money(p.rentDue)}</div>
                        <div style={{ marginTop: 6, fontWeight: 800 }}>
                          Balance: {money(p.currentBalance)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 16 }}>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>YTD Collected</div>
                        <div style={{ fontSize: 22, fontWeight: 900 }}>{money(p.ytdCollected)}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Payment Method</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{p.paymentMethod}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Last Payment</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{p.lastPaymentDate || "—"}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 12 }}>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Status</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{p.monthStatus}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {state.activeTab === "properties" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={boxStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900 }}>Properties</div>
                      <div style={{ opacity: 0.7 }}>All fields are editable. Add, change, or remove anything.</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button style={buttonStyle(false)} onClick={() => addProperty("personal")}>Add Personal</button>
                      <button style={buttonStyle(false)} onClick={() => addProperty("llc")}>Add LLC</button>
                      <button style={buttonStyle(false)} onClick={() => addProperty("corporation")}>Add Corporation</button>
                    </div>
                  </div>
                </div>

                {activeProperties.map((p) => (
                  <div key={p.id} style={boxStyle}>
                    <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
                      <input style={inputStyle} value={p.name} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, name: e.target.value }))} placeholder="Property name" />
                      <input style={inputStyle} value={p.address1} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, address1: e.target.value }))} placeholder="Address 1" />
                      <input style={inputStyle} value={p.city} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, city: e.target.value }))} placeholder="City" />
                      <input style={inputStyle} value={p.state} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, state: e.target.value }))} placeholder="State" />
                      <input style={inputStyle} value={p.zip} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, zip: e.target.value }))} placeholder="ZIP" />
                      <input style={inputStyle} value={p.ownerName} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, ownerName: e.target.value }))} placeholder="Owner name" />
                      <input style={inputStyle} value={p.ownershipGroup} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, ownershipGroup: e.target.value }))} placeholder="Ownership group" />
                      <select style={inputStyle} value={p.entity} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, entity: e.target.value as EntityType }))}>
                        <option value="personal">Personal</option>
                        <option value="llc">LLC</option>
                        <option value="corporation">Corporation</option>
                        <option value="trial">Trial</option>
                        <option value="demo">Demo</option>
                      </select>
                      <input style={inputStyle} value={String(p.rentDue)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, rentDue: Number(e.target.value || 0) }))} placeholder="Rent due" />
                      <input style={inputStyle} value={String(p.currentBalance)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, currentBalance: Number(e.target.value || 0) }))} placeholder="Outstanding balance" />
                      <input style={inputStyle} value={String(p.ytdCollected)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, ytdCollected: Number(e.target.value || 0) }))} placeholder="YTD collected" />
                      <select style={inputStyle} value={p.paymentMethod} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, paymentMethod: e.target.value }))}>
                        <option>ACH</option>
                        <option>Cash App</option>
                        <option>Zelle</option>
                        <option>Venmo</option>
                        <option>PayPal</option>
                        <option>Cash</option>
                        <option>Arbor Housing</option>
                        <option>Catholic Charities</option>
                        <option>County DSS</option>
                        <option>Other</option>
                      </select>
                      <select style={inputStyle} value={p.leaseType} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, leaseType: e.target.value as any }))}>
                        <option value="month-to-month">Month-to-month</option>
                        <option value="fixed">Fixed lease</option>
                      </select>
                      <input style={inputStyle} value={p.leaseStart} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, leaseStart: e.target.value }))} placeholder="Lease start" />
                      <input style={inputStyle} value={p.leaseEnd} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, leaseEnd: e.target.value }))} placeholder="Lease end" />
                      <input style={inputStyle} value={String(p.leaseNoticeDays)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, leaseNoticeDays: Number(e.target.value || 0) }))} placeholder="Notice days" />
                      <input style={inputStyle} value={p.tenantName} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, tenantName: e.target.value }))} placeholder="Tenant name" />
                      <input style={inputStyle} value={p.tenantPhone} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, tenantPhone: e.target.value }))} placeholder="Tenant phone" />
                      <input style={inputStyle} value={p.tenantEmployer} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, tenantEmployer: e.target.value }))} placeholder="Tenant employer" />
                      <input style={inputStyle} value={p.additionalFamilyMembers} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, additionalFamilyMembers: e.target.value }))} placeholder="Additional family members" />
                      <input style={inputStyle} value={p.yearPurchased} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, yearPurchased: e.target.value }))} placeholder="Year purchased" />
                      <input style={inputStyle} value={p.monthPurchased} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, monthPurchased: e.target.value }))} placeholder="Month purchased" />
                      <input style={inputStyle} value={p.notes} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, notes: e.target.value }))} placeholder="Notes" />
                    </div>

                    <div style={{ marginTop: 16, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
                      <input style={inputStyle} value={String(p.taxData.homeownersInsurance)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, homeownersInsurance: Number(e.target.value || 0) } }))} placeholder="Homeowners insurance" />
                      <input style={inputStyle} value={String(p.taxData.villageTax)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, villageTax: Number(e.target.value || 0) } }))} placeholder="Village tax" />
                      <input style={inputStyle} value={String(p.taxData.townCountyTax)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, townCountyTax: Number(e.target.value || 0) } }))} placeholder="Town/County tax" />
                      <input style={inputStyle} value={String(p.taxData.schoolTax)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, schoolTax: Number(e.target.value || 0) } }))} placeholder="School tax" />
                      <input style={inputStyle} value={String(p.taxData.totalPropertyTax)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, totalPropertyTax: Number(e.target.value || 0) } }))} placeholder="Total property tax" />
                      <input style={inputStyle} value={String(p.taxData.utilitiesGas)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, utilitiesGas: Number(e.target.value || 0) } }))} placeholder="Gas" />
                      <input style={inputStyle} value={String(p.taxData.utilitiesElectric)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, utilitiesElectric: Number(e.target.value || 0) } }))} placeholder="Electric" />
                      <input style={inputStyle} value={String(p.taxData.utilitiesWaterSewer)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, utilitiesWaterSewer: Number(e.target.value || 0) } }))} placeholder="Water / sewer" />
                      <input style={inputStyle} value={String(p.taxData.utilitiesTrash)} onChange={(e) => updateProperty(p.id, (x) => ({ ...x, taxData: { ...x.taxData, utilitiesTrash: Number(e.target.value || 0) } }))} placeholder="Trash / disposal" />
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                      <button style={buttonStyle(false)} onClick={() => updateProperty(p.id, (x) => ({ ...x, currentBalance: 0, monthStatus: "Paid" }))}>Paid in Full</button>
                      <button style={buttonStyle(false)} onClick={() => updateProperty(p.id, (x) => ({ ...x, monthStatus: "Partial" }))}>Partial Payment</button>
                      <button style={buttonStyle(false)} onClick={() => deleteProperty(p.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {state.activeTab === "expenses" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={boxStyle}>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>Expenses</div>
                  <div style={{ opacity: 0.7 }}>Add one expense and split it across one or two properties.</div>

                  <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: 12 }}>
                    <input style={inputStyle} value={newExpense.vendor} onChange={(e) => updateExpenseField("vendor", e.target.value)} placeholder="Vendor" />
                    <select style={inputStyle} value={newExpense.category} onChange={(e) => updateExpenseField("category", e.target.value)}>
                      <option>Repairs</option>
                      <option>Maintenance</option>
                      <option>Capital Improvements</option>
                      <option>Energy Star</option>
                      <option>Mortgage Interest</option>
                      <option>HELOC Interest</option>
                      <option>Home Equity Interest</option>
                      <option>Home Office</option>
                      <option>Mileage</option>
                      <option>Utilities</option>
                      <option>Insurance</option>
                      <option>Professional Fees</option>
                      <option>Legal Fees</option>
                      <option>Cell Phone</option>
                      <option>Other</option>
                    </select>
                    <input style={inputStyle} value={newExpense.amount} onChange={(e) => updateExpenseField("amount", e.target.value)} placeholder="Amount" />
                    <select style={inputStyle} value={newExpense.method} onChange={(e) => updateExpenseField("method", e.target.value)}>
                      <option>ACH</option>
                      <option>Cash</option>
                      <option>Card</option>
                      <option>Zelle</option>
                      <option>Venmo</option>
                      <option>PayPal</option>
                      <option>Cash App</option>
                      <option>Other</option>
                    </select>
                    <input style={inputStyle} value={newExpense.notes} onChange={(e) => updateExpenseField("notes", e.target.value)} placeholder="Notes" />
                    <select style={inputStyle} value={newExpense.splitMode} onChange={(e) => updateExpenseField("splitMode", e.target.value)}>
                      <option value="single">Single property</option>
                      <option value="double">Split two properties</option>
                    </select>
                    <select style={inputStyle} value={newExpense.propertyIdA} onChange={(e) => updateExpenseField("propertyIdA", e.target.value)}>
                      <option value="">Select property A</option>
                      {state.properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select style={inputStyle} value={newExpense.propertyIdB} onChange={(e) => updateExpenseField("propertyIdB", e.target.value)}>
                      <option value="">Select property B</option>
                      {state.properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input style={inputStyle} value={newExpense.splitA} onChange={(e) => updateExpenseField("splitA", e.target.value)} placeholder="Split A amount" />
                    <input style={inputStyle} value={newExpense.splitB} onChange={(e) => updateExpenseField("splitB", e.target.value)} placeholder="Split B amount" />
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    <button style={buttonStyle(false)} onClick={addExpense}>Save Expense</button>
                  </div>
                </div>

                <div style={boxStyle}>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>Saved Expenses</div>
                  <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                    {state.expenses.map((e) => (
                      <div key={e.id} style={{ padding: 14, borderRadius: 14, border: "1px solid #dbe2ea" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: 900 }}>{e.vendor}</div>
                            <div style={{ opacity: 0.7 }}>{e.date} · {e.category} · {e.paymentMethod}</div>
                          </div>
                          <div style={{ fontWeight: 900 }}>{money(e.amount)}</div>
                        </div>
                        <div style={{ marginTop: 8 }}>{e.notes}</div>
                        {e.splits.length > 0 && (
                          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
                            Split: {e.splits.map((s) => {
                              const p = state.properties.find((x) => x.id === s.propertyId);
                              return `${p?.name || "Property"} ${money(s.amount)}`;
                            }).join(" | ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {state.activeTab === "reports" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={boxStyle}>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>Reports</div>
                  <div style={{ opacity: 0.7 }}>P&L, Schedule E, Schedule A, home office, mileage, and more.</div>
                  <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", marginTop: 14 }}>
                    <button style={buttonStyle(false)}>P&L</button>
                    <button style={buttonStyle(false)}>Schedule E</button>
                    <button style={buttonStyle(false)}>Schedule A</button>
                    <button style={buttonStyle(false)}>Home Office</button>
                    <button style={buttonStyle(false)}>Mileage</button>
                    <button style={buttonStyle(false)}>Email Accountant</button>
                  </div>

                  <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                    <div>Total property taxes: {money(totalTaxes)}</div>
                    <div>Total homeowners insurance: {money(totalInsurance)}</div>
                    <div>Total outstanding balance: {money(totalBalance)}</div>
                    <div>Total YTD rent: {money(ytdTotalRent)}</div>
                  </div>
                </div>
              </div>
            )}

            {state.activeTab === "settings" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={boxStyle}>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>Settings</div>
                  <div style={{ opacity: 0.7 }}>Everything is editable.</div>
                  <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginTop: 12 }}>
                    <input style={inputStyle} value={state.profile.displayName} onChange={(e) => setState((p) => ({ ...p, profile: { ...p.profile, displayName: e.target.value } }))} placeholder="App display name" />
                    <input style={inputStyle} value={state.profile.legalName} onChange={(e) => setState((p) => ({ ...p, profile: { ...p.profile, legalName: e.target.value } }))} placeholder="Legal name" />
                    <input style={inputStyle} value={state.profile.address} onChange={(e) => setState((p) => ({ ...p, profile: { ...p.profile, address: e.target.value } }))} placeholder="Address" />
                    <input style={inputStyle} value={state.profile.supportEmail} onChange={(e) => setState((p) => ({ ...p, profile: { ...p.profile, supportEmail: e.target.value } }))} placeholder="Support email" />
                    <input style={inputStyle} value={state.profile.reportEmail} onChange={(e) => setState((p) => ({ ...p, profile: { ...p.profile, reportEmail: e.target.value } }))} placeholder="Report email" />
                    <input style={inputStyle} value={state.profile.phone} onChange={(e) => setState((p) => ({ ...p, profile: { ...p.profile, phone: e.target.value } }))} placeholder="Phone" />
                  </div>
                </div>

                <div style={boxStyle}>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>Toggles</div>
                  <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {[
                      ["Email capture", "emailCapture"],
                      ["Phone capture", "phoneCapture"],
                      ["Credit card capture", "creditCardCapture"],
                      ["Stripe enabled", "stripeEnabled"],
                      ["Terms enabled", "termsEnabled"],
                      ["Cancellation enabled", "cancellationEnabled"],
                    ].map(([label, key]) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input
                          type="checkbox"
                          checked={(state.toggles as any)[key]}
                          onChange={(e) => setState((p) => ({ ...p, toggles: { ...p.toggles, [key]: e.target.checked } }))}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={boxStyle}>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>Trial / Signup</div>
                  <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginTop: 12 }}>
                    <input style={inputStyle} value={state.trial.name} onChange={(e) => setState((p) => ({ ...p, trial: { ...p.trial, name: e.target.value } }))} placeholder="Name" />
                    <input style={inputStyle} value={state.trial.email} onChange={(e) => setState((p) => ({ ...p, trial: { ...p.trial, email: e.target.value } }))} placeholder="Email" />
                    <input style={inputStyle} value={state.trial.phone} onChange={(e) => setState((p) => ({ ...p, trial: { ...p.trial, phone: e.target.value } }))} placeholder="Phone" />
                  </div>
                </div>

                <div style={boxStyle}>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>Terms & Cancellation</div>
                  <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                    Not legal advice. Not accounting advice. Users are responsible for reviewing their own information. To cancel, click here.
                  </div>
                </div>
              </div>
            )}

            {state.activeTab === "demo" && (
              <div style={boxStyle}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>Demo / Invite</div>
                <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                  This is the demo view. It can show sample LLCs, corporations, personal homes, rentals, and tax reports without showing your private information.
                </div>
              </div>
            )}

            {state.activeTab === "trial" && (
              <div style={boxStyle}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>Trial</div>
                <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                  Trial data is stored for a short recovery period if the user returns within 7 days. Countdown: {trialCountdown}
                </div>
              </div>
            )}

            {state.activeTab === "corporate" && (
              <div style={boxStyle}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>Corporate</div>
                <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                  MCMC Properties Inc. is a separate entity. Corporate expenses can include cell phone, legal fees, CPA fees, and dividends tracking.
                </div>
              </div>
            )}

            {state.activeTab === "personal" && (
              <div style={boxStyle}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>Personal</div>
                <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                  Track personal home, qualified dividends, home office, insurance, and personal tax information here.
                </div>
              </div>
            )}

            {state.activeTab === "rentals" && (
              <div style={boxStyle}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>Rentals</div>
                <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                  Rental properties, partial payments, lease dates, month-to-month labels, and full payment history are all editable here.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: currentTheme.navy, padding: 8, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
        {navItems.slice(0, 5).map((n) => (
          <button
            key={n.key}
            style={bottomButtonStyle(state.activeTab === n.key)}
            onClick={() => setState((p) => ({ ...p, activeTab: n.key }))}
          >
            {n.label}
          </button>
        ))}
      </div>

      {toast && (
        <div style={{ position: "fixed", right: 16, bottom: 100, background: currentTheme.green, color: currentTheme.navy, padding: "10px 14px", borderRadius: 999, fontWeight: 900 }}>
          {toast}
        </div>
      )}
    </div>
  );
      }
