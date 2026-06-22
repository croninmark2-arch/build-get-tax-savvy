"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";

// ---------- THEME ----------

const NAVY = "#001233";
const NAVY_SECONDARY = "#021A3A";
const NEON_GREEN = "#39FF14";
const WHITE = "#FFFFFF";

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: NAVY,
  color: WHITE,
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  display: "flex",
  flexDirection: "column",
};

// ---------- TYPES ----------

type LateFeeType = "flat" | "percentage";
type LateFeeMode = "track" | "charge";
type LeaseType = "monthtomonth" | "fixed";

interface Payment {
  id: string;
  amount: number;
  date: string; // ISO string
  method: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  entity: "Personal" | "Corporate" | "MCMC";
  monthlyRent: number;
  leaseType: LeaseType;
  leaseEndDate?: string; // ISO
  noticeDays: number;
  rentIncreaseNoticeDays: number;
  lateFeeType: LateFeeType;
  lateFeeValue: number;
  lateFeeTriggerDay: number; // 1-31
  lateFeeMode: LateFeeMode;
  payments: Payment[];
  savedLateFeesForgiven: number;
}

type TabKey =
  | "home"
  | "properties"
  | "ledger"
  | "expenses"
  | "reports"
  | "settings";

// ---------- UTIL ----------

const todayISO = () => new Date().toISOString().slice(0, 10);

const getMonthKey = (date: string) => date.slice(0, 7); // YYYY-MM

const daysBetween = (fromISO: string, toISO: string) => {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  const daysBetween = (fromISO: string, toISO: string) => {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
};

const isPaidInFullForMonth = (property: Property, monthKey: string) => {
  const total = property.payments
    .filter((p) => getMonthKey(p.date) === monthKey)
    .reduce((sum, p) => sum + p.amount, 0);
  return total >= property.monthlyRent;
};

const getTotalPaidForMonth = (property: Property, monthKey: string) => {
  return property.payments
    .filter((p) => getMonthKey(p.date) === monthKey)
    .reduce((sum, p) => sum + p.amount, 0);
};

const getLastPaymentDateForMonth = (property: Property, monthKey: string) => {
  const payments = property.payments
    .filter((p) => getMonthKey(p.date) === monthKey)
    .sort((a, b) => a.date.localeCompare(b.date));
  return payments.length ? payments[payments.length - 1].date : null;
};

const calculateLateFee = (property: Property) => {
  if (property.lateFeeType === "flat") {
    return property.lateFeeValue;
  }
  return property.monthlyRent * (property.lateFeeValue / 100);
};

const getLateStatusForMonth = (property: Property, monthKey: string) => {
  const totalPaid = getTotalPaidForMonth(property, monthKey);
  const paidInFull = totalPaid >= property.monthlyRent;
  const lastPaymentDate = getLastPaymentDateForMonth(property, monthKey);
  if (!lastPaymentDate) {
    return { status: "Not Paid", lateFee: 0, isLate: false };
  }

  const paymentDay = new Date(lastPaymentDate).getDate();
  const isLate =
    !paidInFull && paymentDay > property.lateFeeTriggerDay
      ? true
      : paidInFull && paymentDay > property.lateFeeTriggerDay
      ? true
      : false;

  const lateFee = isLate ? calculateLateFee(property) : 0;

  let status: string;
  if (!paidInFull && isLate) status = "Late";
  else if (paidInFull && isLate) status = "Paid Late";
  else if (paidInFull && !isLate) status = "Paid On Time";
  else status = "Not Paid";

  return { status, lateFee, isLate };
};

const getLeaseCountdown = (property: Property) => {
  if (property.leaseType !== "fixed" || !property.leaseEndDate) {
    return null;
  }
  const noticeDeadlineISO = new Date(
  new Date(property.leaseEndDate).getTime() -
  property.noticeDays * 24 * 60 * 60 * 1000
)
  .toISOString()
  .slice(0, 10);
  const daysUntilNoticeDeadline = daysBetween(today, noticeDeadlineISO);
  
  const increaseNoticeISO = new Date(
    new Date(property.leaseEndDate).getTime() -
    property.rentIncreaseNoticeDays * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 10);
  const daysUntilIncreaseWindow = daysBetween(today, increaseNoticeISO);

  return {
    daysUntilEnd,
    daysUntilNoticeDeadline,
    daysUntilIncreaseWindow,
  };
};

// ---------- COMPONENTS ----------

const Header: React.FC<{
  appName: string;
  subtitle: string;
  logoUrl: string | null;
  onEditBranding: () => void;
}> = ({ appName, subtitle, logoUrl, onEditBranding }) => {
  return (
    <header
      style={{
        backgroundColor: NAVY_SECONDARY,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        borderBottom: `4px solid ${NEON_GREEN}`,
      }}
    >
      <button
        onClick={onEditBranding}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `4px solid ${NEON_GREEN}`,
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={40}
              height={40}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                color: NEON_GREEN,
                fontWeight: 800,
                fontSize: 24,
              }}
            >
              $
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: NEON_GREEN,
            }}
          >
            {appName}
          </span>
          <span
            style={{
              fontSize: 12,
              color: WHITE,
              opacity: 0.8,
            }}
          >
            {subtitle}
          </span>
        </div>
      </button>
    </header>
  );
};

const BottomNav: React.FC<{
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
}> = ({ activeTab, onChangeTab }) => {
  const items: { key: TabKey; label: string; icon: string }[] = [
    { key: "home", label: "Home", icon: "🏠" },
    { key: "properties", label: "Properties", icon: "🏢" },
    { key: "ledger", label: "Ledger", icon: "💵" },
    { key: "expenses", label: "Expenses", icon: "🧾" },
    { key: "reports", label: "Reports", icon: "📊" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav
      style={{
        backgroundColor: NAVY_SECONDARY,
        borderTop: `4px solid ${NEON_GREEN}`,
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 0",
      }}
    >
      {items.map((item) => {
        const isActive = item.key === activeTab;
        return (
          <button
            key={item.key}
            onClick={() => onChangeTab(item.key)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "6px 4px",
        backgroundColor: isActive ? NEONGREEN : NAVYSECONDARY,
border: `4px solid ${NEON_GREEN}`,
color: isActive ? NAVY : WHITE,
fontSize: 11,
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: isActive ? NAVY : WHITE,
              }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const StatusBadge: React.FC<{ label: string; type: "good" | "warn" | "bad" }> =
  ({ label, type }) => {
    let bg = NEON_GREEN;
    let color = NAVY;
    if (type === "warn") {
      bg = "#FFD700";
      color = NAVY;
    }
    if (type === "bad") {
      bg = "#FF0000";
      color = WHITE;
    }
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 8px",
          borderRadius: 999,
          backgroundColor: bg,
          color,
          fontSize: 11,
          fontWeight: 700,
          marginRight: 6,
        }}
      >
        {label}
      </span>
    );
  };

const PropertyCard: React.FC<{
  property: Property;
  currentMonthKey: string;
  onAddPayment: (propertyId: string, payment: Payment) => void;
}> = ({ property, currentMonthKey, onAddPayment }) => {
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(todayISO());
  const [method, setMethod] = useState<string>("Cash");
  const [mode, setMode] = useState<"full" | "partial">("full");

  const totalPaid = getTotalPaidForMonth(property, currentMonthKey);
  const remaining = Math.max(property.monthlyRent - totalPaid, 0);
  const lateInfo = getLateStatusForMonth(property, currentMonthKey);
  const leaseCountdown = getLeaseCountdown(property);

  const paymentsThisMonth = property.payments.filter(
    (p) => getMonthKey(p.date) === currentMonthKey
  );

  const handleSavePayment = () => {
    const parsed = parseFloat(amount || "0");
  const newPayment: Payment = {
  id: `${property.id}-${Date.now()}`,
  amount: parsed,
  date,
  method,
}
    onAddPayment(property.id, newPayment);
    setAmount("");
    setDate(todayISO());
  };

  const lateBadgeType =
    lateInfo.status === "Late"
      ? "bad"
      : lateInfo.status === "Paid Late"
      ? "warn"
      : lateInfo.status === "Paid On Time"
      ? "good"
      : "warn";

  const leaseBadges = leaseCountdown
    ? [
        leaseCountdown.daysUntilEnd <= 30
          ? "Lease ending soon"
          : Lease ends in ${leaseCountdown.daysUntilEnd} days,
        leaseCountdown.daysUntilNoticeDeadline <= 0
          ? "Notice deadline passed"
          : Notice deadline in ${leaseCountdown.daysUntilNoticeDeadline} days,
        leaseCountdown.daysUntilIncreaseWindow <= 0
          ? "Increase window open"
          : Increase window in ${leaseCountdown.daysUntilIncreaseWindow} days,
      ]
    : [];

  const lateFeeDisplay =
    lateInfo.lateFee > 0
      ? `${lateInfo.lateFee.toFixed(2)} ${
          property.lateFeeMode === "charge" ? "(owed)" : "(forgiven)"
        }`
      : "0.00";

  return (
    <div
      style={{
        backgroundColor: NAVY_SECONDARY,
        borderRadius: 12,
        border: 4px solid ${NEON_GREEN},
        padding: 12,
        marginBottom: 12,
        boxShadow: "0 0 12px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          borderBottom: 4px solid ${NEON_GREEN},
          paddingBottom: 8,
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: NEON_GREEN,
            }}
          >
            {property.address}
          </div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            Entity: {property.entity}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <StatusBadge
            label={
              isPaidInFullForMonth(property, currentMonthKey)
                ? "PAID IN FULL"
                : remaining > 0
                ? "BALANCE DUE"
                : "NO RENT DUE"
            }
            type={
              isPaidInFullForMonth(property, currentMonthKey)
                ? "good"
                : remaining > 
                ? "warn"
                : "good"
            }
          />
          <StatusBadge label={lateInfo.status} type={lateBadgeType} />
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
          Payments This Month
        </div>
        {paymentsThisMonth.length === 0 ? (
          <div style={{ fontSize: 12, opacity: 0.7 }}>No payments yet.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {paymentsThisMonth.map((p) => (
              <li
                key={p.id}
                style={{
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span>
                  ${p.amount.toFixed(2)} — {p.date}
                </span>
                <span style={{ opacity: 0.7 }}>{p.method}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 12,
        }}
      >
        <div>
          <div>Total Paid: ${totalPaid.toFixed(2)}</div>
          <div>Remaining: ${remaining.toFixed(2)}</div>
        </div>
        <div>
          <div>Late Fee (this month): ${lateFeeDisplay}</div>
          <div>
            Late Mode:{" "}
            {property.lateFeeMode === "charge" ? "Charge" : "Track Only"}
          </div>
        </div>
      </div>

      {leaseCountdown && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Lease Info
          </div>
          <div style={{ fontSize: 12 }}>
            Lease Ends: {property.leaseEndDate}
          </div>
          <div style={{ fontSize: 12 }}>
            Notice Period: {property.noticeDays} days
          </div>
          <div style={{ fontSize: 12 }}>
            Rent Increase Notice: {property.rentIncreaseNoticeDays} days
          </div>
          <div style={{ marginTop: 4 }}>
            {leaseBadges.map((b, idx) => (
              <StatusBadge
                key={idx}
                label={b}
                type={idx === 0 ? "warn" : "good"}
              />
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: 2px solid ${NEON_GREEN},
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <button
            onClick={() => setMode("full")}
            style={{
              flex: 1,
              padding: "6px 8px",
              backgroundColor: mode === "full" ? NEONGREEN : NAVYSECONDARY,
              border: 4px solid ${NEON_GREEN},
              color: mode === "full" ? NAVY : NEON_GREEN,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Paid in Full
          </button>
          <button
            onClick={() => setMode("partial")}
            style={{
              flex: 1,
              padding: "6px 8px",
              backgroundColor: mode === "partial" ? NEONGREEN : NAVYSECONDARY,
              border: 4px solid ${NEON_GREEN},
              color: mode === "partial" ? NAVY : NEON_GREEN,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Partial Payment
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 12,
          }}
        >
          <label>
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: 6,
                marginTop: 2,
                borderRadius: 6,
                border: 2px solid ${NEON_GREEN},
                backgroundColor: NAVY,
                color: WHITE,
              }}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: 6,
                marginTop: 2,
                borderRadius: 6,
                border: 2px solid ${NEON_GREEN},
                backgroundColor: NAVY,
                color: WHITE,
              }}
            />
          </label>
          <label>
            Method
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{
                width: "100%",
                padding: 6,
                marginTop: 2,
                borderRadius: 6,
                border: 2px solid ${NEON_GREEN},
                backgroundColor: NAVY,
                color: WHITE,
              }}
            >
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="PayPal">PayPal</option>
              <option value="Zelle">Zelle</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <button
            onClick={handleSavePayment}
            style={{
              marginTop: 4,
              width: "100%",
              padding: 8,
              backgroundColor: NEON_GREEN,
              borderRadius: 8,
              border: 4px solid ${NEON_GREEN},
              color: NAVY,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- MAIN PAGE ----------

const Page: React.FC = () => {
  const [appName, setAppName] = useState<string>("TaxSavvy");
  const [subtitle, setSubtitle] = useState<string>("Landlord Ledger & Lease Manager");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("properties");
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(
    todayISO().slice(0, 7)
  );

  const [properties, setProperties] = useState<Property[]>([
    {
      id: "p-114",
      name: "114 Example",
      address: "114 Sample Street",
      entity: "Personal",
      monthlyRent: 700,
      leaseType: "fixed",
      leaseEndDate: "2027-12-31",
      noticeDays: 60,
      rentIncreaseNoticeDays: 90,
      lateFeeType: "flat",
      lateFeeValue: 50,
      lateFeeTriggerDay: 8,
      lateFeeMode: "track",
      payments: [],
      savedLateFeesForgiven: 0,
    },
    {
      id: "p-118",
      name: "118 Example",
      address: "118 Daffodil Drive",
      entity: "Personal",
      monthlyRent: 700,
      leaseType: "fixed",
      leaseEndDate: "2026-12-31",
      noticeDays: 60,
      rentIncreaseNoticeDays: 90,
      lateFeeType: "flat",
      lateFeeValue: 50,
      lateFeeTriggerDay: 8,
      lateFeeMode: "track",
      payments: [],
      savedLateFeesForgiven: 0,
    },
    {
      id: "p-mcmc",
      name: "MCMC",
      address: "MCMC Property",
      entity: "MCMC",
      monthlyRent: 900,
      leaseType: "monthtomonth",
      noticeDays: 60,
      rentIncreaseNoticeDays: 90,
      lateFeeType: "percentage",
      lateFeeValue: 5,
      lateFeeTriggerDay: 15,
      lateFeeMode: "charge",
      payments: [],
      savedLateFeesForgiven: 0,
    },
  ]);

  const [brandingEditOpen, setBrandingEditOpen] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(appName);
  const [tempSubtitle, setTempSubtitle] = useState<string>(subtitle);
  const [savedLogos, setSavedLogos] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([appName]);
  const [savedSubtitles, setSavedSubtitles] = useState<string[]>([subtitle]);

  const handleAddPayment = (propertyId: string, payment: Payment) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== propertyId) return p;
        const monthKey = getMonthKey(payment.date);
        const before = getLateStatusForMonth(p, monthKey);
        const updatedPayments = [...p.payments, payment];
        const updatedProperty: Property = { ...p, payments: updatedPayments };
        const after = getLateStatusForMonth(updatedProperty, monthKey);

        let savedLateFeesForgiven = p.savedLateFeesForgiven;
        if (
          p.lateFeeMode === "track" &&
          after.lateFee > 0 &&
          after.status === "Late"
        ) {
          savedLateFeesForgiven += after.lateFee;
        }

        return { ...updatedProperty, savedLateFeesForgiven };
      })
    );
  };

  const handleEditBrandingClick = () => {
    setTempName(appName);
    setTempSubtitle(subtitle);
    setBrandingEditOpen(true);
  };

  const handleSaveBranding = () => {
    setAppName(tempName);
    setSubtitle(tempSubtitle);
    if (!savedNames.includes(tempName)) {
      setSavedNames((prev) => [...prev, tempName]);
    }
    if (!savedSubtitles.includes(tempSubtitle)) {
      setSavedSubtitles((prev) => [...prev, tempSubtitle]);
    }
    setBrandingEditOpen(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
    setSavedLogos((prev) => [...prev, url]);
  };

  const monthLabel = useMemo(() => {
    const [year, month] = currentMonthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  }, [currentMonthKey]);

  const changeMonth = (delta: number) => {
    const [year, month] = currentMonthKey.split("-");
    const d = new Date(parseInt(year), parseInt(month) - 1 + delta, 1);
    const newKey = d.toISOString().slice(0, 7);
    setCurrentMonthKey(newKey);
  };

  return (
    <div style={containerStyle}>
      <Header
        appName={appName}
        subtitle={subtitle}
        logoUrl={logoUrl}
        onEditBranding={handleEditBrandingClick}
      />

      <main
        style={{
          flex: 1,
          padding: "12px 12px 64px",
          overflowY: "auto",
        }}
      >
        {activeTab === "home" && (
          <div>
            <h2 style={{ color: NEON_GREEN, fontSize: 18, marginBottom: 8 }}>
              Home
            </h2>
            <p style={{ fontSize: 13 }}>
              Overview of your properties, payments, and upcoming lease events.
            </p>
          </div>
        )}

        {activeTab === "properties" && (
          <div>
            <h2 style={{ color: NEON_GREEN, fontSize: 18, marginBottom: 8 }}>
              Properties
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13 }}>Month: {monthLabel}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => changeMonth(-1)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: NAVY_SECONDARY,
                    border: 4px solid ${NEON_GREEN},
                    color: NEON_GREEN,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ◀
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: NAVY_SECONDARY,
                    border: 4px solid ${NEON_GREEN},
                    color: NEON_GREEN,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ▶
                </button>
              </div>
            </div>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                currentMonthKey={currentMonthKey}
                onAddPayment={handleAddPayment}
              />
            ))}
          </div>
        )}

        {activeTab === "ledger" && (
          <div>
            <h2 style={{ color: NEON_GREEN, fontSize: 18, marginBottom: 8 }}>
              Rent Ledger
            </h2>
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              Full breakdown of payments by property and month.
            </p>
            {properties.map((property) => {
              const totalPaid = getTotalPaidForMonth(
                property,
                currentMonthKey
              );
              const lateInfo = getLateStatusForMonth(
                property,
                currentMonthKey
              );
              return (
                <div
                  key={property.id}
                  style={{
                    marginBottom: 10,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: NAVY_SECONDARY,
                    border: 3px solid ${NEON_GREEN},
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontSize: 13,
                    }}
                  >
                    <span>{property.address}</span>
                    <span>${totalPaid.toFixed(2)} paid</span>
                  </div>
                  <div style={{ fontSize: 12 }}>
                    Status: {lateInfo.status} | Late Fee (tracked): $
                    {lateInfo.lateFee.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "expenses" && (
          <div>
            <h2 style={{ color: NEON_GREEN, fontSize: 18, marginBottom: 8 }}>
              Expenses
            </h2>
            <p style={{ fontSize: 13 }}>
              Future section for tracking repairs, utilities, and other
              landlord expenses.
            </p>
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <h2 style={{ color: NEON_GREEN, fontSize: 18, marginBottom: 8 }}>
              Reports
            </h2>
            <p style={{ fontSize: 13 }}>
              Summary views for income, forgiven late fees, and lease timelines.
            </p>
            <div
              style={{
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                backgroundColor: NAVY_SECONDARY,
                border: 3px solid ${NEON_GREEN},
              }}
            >
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                Forgiven Late Fees (Tracked Only)
              </div>
              {properties.map((p) => (
                <div
                  key={p.id}
                  style={{
                    fontSize: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <span>{p.address}</span>
                  <span>${p.savedLateFeesForgiven.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 style={{ color: NEON_GREEN, fontSize: 18, marginBottom: 8 }}>
              Settings
            </h2>
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              This is where your private controls live. Live users won&apos;t
              see branding options.
            </p>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: NAVY_SECONDARY,
                border: 3px solid ${NEON_GREEN},
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 13, marginBottom: 4 }}>Branding</div>
              <button
                onClick={handleEditBrandingClick}
                style={{
                  padding: 6,
                  backgroundColor: NEON_GREEN,
                  borderRadius: 8,
                  border: 4px solid ${NEON_GREEN},
                  color: NAVY,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Edit Logo, Name & Subtitle
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {brandingEditOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 420,
              backgroundColor: NAVY_SECONDARY,
              borderRadius: 12,
              border: 4px solid ${NEON_GREEN},
              padding: 12,
              boxShadow: "0 0 16px rgba(0,0,0,0.8)",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                color: NEON_GREEN,
                marginBottom: 8,
              }}
            >
              Edit Branding (Your Version Only)
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 12,
              }}
            >
              <label>
                App Name
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 6,
                    marginTop: 2,
                    borderRadius: 6,
                    border: 2px solid ${NEON_GREEN},
                    backgroundColor: NAVY,
                    color: WHITE,
                  }}
                />
              </label>
              <label>
                Subtitle
                <input
                  type="text"
                  value={tempSubtitle}
                  onChange={(e) => setTempSubtitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 6,
                    marginTop: 2,
                    borderRadius: 6,
                    border: 2px solid ${NEON_GREEN},
                    backgroundColor: NAVY,
                    color: WHITE,
                  }}
                />
              </label>
              <label>
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{
                    width: "100%",
                    marginTop: 2,
                    fontSize: 11,
                  }}
                />
              </label>
              {savedLogos.length > 0 && (
                <div>
                  <div style={{ marginBottom: 4 }}>Saved Logos</div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {savedLogos.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLogoUrl(url)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          overflow: "hidden",
                          border: 3px solid ${NEON_GREEN},
                          padding: 0,
                          backgroundColor: "#000",
                          cursor: "pointer",
                        }}
                      >
                        <Image
                          src={url}
                          alt={Logo ${idx + 1}}
                          width={40}
                          height={40}
                          style={{ objectFit: "cover" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {savedNames.length > 1 && (
                <div>
                  <div style={{ marginBottom: 4 }}>Saved Names</div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {savedNames.map((n, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTempName(n)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 999,
                          border: 2px solid ${NEON_GREEN},
                          backgroundColor: NAVY,
                          color: NEON_GREEN,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {savedSubtitles.length > 1 && (
                <div>
                  <div style={{ marginBottom: 4 }}>Saved Subtitles</div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {savedSubtitles.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTempSubtitle(s)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 999,
                          border: 2px solid ${NEON_GREEN},
                          backgroundColor: NAVY,
                          color: NEON_GREEN,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 12,
              }}
            >
              <button
                onClick={() => setBrandingEditOpen(false)}
                style={{
                  padding: "6px 10px",
                  backgroundColor: NAVY_SECONDARY,
                  borderRadius: 8,
                  border: 3px solid ${NEON_GREEN},
                  color: NEON_GREEN,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBranding}
                style={{
                  padding: "6px 10px",
                  backgroundColor: NEON_GREEN,
                  borderRadius: 8,
                  border: 3px solid ${NEON_GREEN},
                  color: NAVY,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
`
