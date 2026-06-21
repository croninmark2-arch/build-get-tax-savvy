"use client";

import { useEffect, useMemo, useState } from "react";

type Tab =
  | "dashboard"
  | "properties"
  | "expenses"
  | "reports"
  | "homeoffice"
  | "settings"
  | "upgrade"
  | "demo";

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

const DEMO_SEED: AppState = {
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
    { id: 2, name: "Rental A", address: "114 Orchard St, Horseheads, NY", owner: "Cronin NY Property Management LLC", rent: 1405, tenant: "Tenant A", isPersonal: false, leaseName: "Lease - Rental A", leaseUrl: "", yearPurchased: "", monthPurchased: "" },
    { id: 3, name: "Duplex Unit A", address: "220 Elmwood Ave Unit A, Elmira Heights, NY", owner: "Cronin NY Property Management LLC", rent: 1400, tenant: "Tenant B", isPersonal: false, yearPurchased: "", monthPurchased: "" },
    { id: 4, name: "Duplex Unit B", address: "220 Elmwood Ave Unit B, Elmira Heights, NY", owner: "Cronin NY Property Management LLC", rent: 1100, tenant: "Tenant C", isPersonal: false, yearPurchased: "", monthPurchased: "" },
  ],
  expenses: [
    { id: 101, date: "2026-01-05", vendor: "Lowe's", amount: 245, category: "Repairs", propertyIds: [2], splitType: "single", notes: "Kitchen faucet" },
    { id: 102, date: "2026-01-12", vendor: "NYSEG", amount: 132.4, category: "Utilities", propertyIds: [3, 4], splitType: "even", notes: "Shared utility" },
  ],
  accountants: [
    { id: 1, name: "CPA Office", title: "CPA", email: "cpa@example.com", primary: true },
    { id: 2, name: "Tax Helper", title: "Assistant", email: "helper@example.com" },
  ],
  homeOffices: [
    { id: 1, label: "Main Office", sqft: "180", notes: "Primary office" },
    { id: 2, label: "Garage Storage Area", sqft: "120", notes: "Tools, ladders, supplies" },
  ],
  trial: { email: "", name: "", company: "", startAt: null, trialDays: 14 },
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
        setState(savedMode === "demo" ? DEMO_SEED : LIVE_SEED);
      }
    } else {
      setState(savedMode === "demo" ? DEMO_SEED : LIVE_SEED);
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
      trial: { email: trialEmail.trim(), name: trialName.trim(), company: trialCompany.trim(), startAt: p.trial.startAt || Date.now(), trialDays: 14 },
    }));
    notify("Trial saved");
    setShowTrialPopup(false);
  };

  const setTrialStartNow = () => {
    if (!trialEmail.trim()) return notify("Email is required");
    setState((p) => ({
      ...p,
      trial: { email: trialEmail.trim(), name: trialName.trim(), company: trialCompany.trim(), startAt: Date.now(), trialDays: 14 },
    }));
    notify("14-day trial started");
  };

  const addExpense = () => {
    const amount = Number(expenseAmount || 0);
    if (!expenseVendor.trim() || !amount || !expensePropertyIds.length) return notify("Fill vendor, amount, and property");
    setState((p) => ({
      ...p,
      expenses: [
        { id: Date.now(), date: new Date().toISOString().slice(0, 10), vendor: expenseVendor.trim(), amount, category: expenseCategory, propertyIds: expensePropertyIds, splitType: expensePropertyIds.length > 1 ? "even" : "single", notes: expenseNotes.trim() },
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
    setState((p) => ({ ...p, properties: [...p.properties, { id, name: "New Property", address: "New Address", owner: "", rent: 0, tenant: "", isPersonal: false, yearPurchased: "", monthPurchased: "" }] }));
    notify("Property added");
  };

  const addAccountant = () => {
    setState((p) => {
      const nextId = Math.max(0, ...p.accountants.map((a) => a.id)) + 1;
      return { ...p, accountants: [...p.accountants, { id: nextId, name: "New Contact", title: "CPA", email: "", primary: p.accountants.length === 0 }] };
    });
  };

  const runReport = (type: string) => {
    const totalIncome = state.properties.reduce((s, p) => s + Number(p.rent || 0), 0);
    const totalExpenses = state.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const totalRental = totalIncome - totalExpenses;
    const officeSqft = state.homeOffices.reduce((s, o) => s + Number(o.sqft || 0), 0);

    if (type === "pl") setReportText(`P&L Report
Income: ${fmt(totalIncome)}
Expenses: ${fmt(totalExpenses)}
Net: ${fmt(totalRental)}`);
    else if (type === "schedulee") setReportText(`Schedule E
Rental income: ${fmt(totalIncome)}
Rental expenses: ${fmt(totalExpenses)}
Net: ${fmt(totalRental)}`);
    else if (type === "schedulea") setReportText("Schedule A
Personal deductions and itemized items can be summarized here.");
    else if (type === "homeoffice") setReportText(`Home Office Summary
Areas: ${state.homeOffices.length}
Total office sqft: ${officeSqft}`);
    else if (type === "mileage") setReportText("Mileage Report
Add mileage tracking here for property visits and business travel.");
    notify("Report generated");
  };

  const sendReportToAccountant = () => {
    const selected = state.accountants.find((a) => a.email === emailTarget) || state.accountants.find((a) => a.primary) || state.accountants[0];
    if (!selected) return notify("Add an accountant contact first");
    notify(`Prepared to send to ${selected.name}`);
  };

  const shareDemo = () => {
    setMode("demo");
    setTab("demo");
    notify("Demo mode opened");
  };

  const updateBrand = (field: keyof AppState, value: string | boolean) => {
    setState((p) => ({ ...p, [field]: value } as AppState));
  };

  const startOrExpired = state.trial.startAt ? activeTrialDaysLeft <= 0 : false;
