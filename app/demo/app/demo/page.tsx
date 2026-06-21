
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type DemoProperty = {
  id: string;
  name: string;
  address: string;
  owner: string;
  tenant: string;
  leaseEnds: string;
  monthDue: string;
  status: "Paid in full" | "Partial" | "Due";
  ytd: number;
  balance: number;
};

type DemoExpense = {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  note: string;
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

const demoProperties: DemoProperty[] = [
  {
    id: "1",
    name: "220 Elmwood Unit A",
    address: "220 Elmwood Ave Unit A, Elmira Heights, NY",
    owner: "MCMC Properties LLC",
    tenant: "Tenant A",
    leaseEnds: "2026-12-31",
    monthDue: "June 2026",
    status: "Partial",
    ytd: 8400,
    balance: 200,
  },
  {
    id: "2",
    name: "220 Elmwood Unit B",
    address: "220 Elmwood Ave Unit B, Elmira Heights, NY",
    owner: "MCMC Properties LLC",
    tenant: "Tenant B",
    leaseEnds: "2026-11-30",
    monthDue: "June 2026",
    status: "Due",
    ytd: 7200,
    balance: 1100,
  },
  {
    id: "3",
    name: "114 Orchard Street",
    address: "114 Orchard St, Horseheads, NY",
    owner: "MCMC Properties LLC",
    tenant: "Arbor Housing",
    leaseEnds: "2026-12-31",
    monthDue: "June 2026",
    status: "Paid in full",
    ytd: 16920,
    balance: 0,
  },
];

const demoExpenses: DemoExpense[] = [
  {
    id: "1",
    vendor: "Louie Parmalee",
    date: "2026-06-20",
    amount: 400,
    note: "Repaired foundation in back corner of Unit B, split evenly between Unit A and Unit B.",
  },
  {
    id: "2",
    vendor: "Louie Parmalee",
    date: "2026-06-01",
    amount: 1295,
    note: "Repairs split between Unit A and Unit B.",
  },
  {
    id: "3",
    vendor: "Lowe's",
    date: "2026-05-18",
    amount: 275,
    note: "Supplies and materials.",
  },
];

export default function DemoPage() {
  const [selected, setSelected] = useState<string | null>("1");

  const selectedProperty = useMemo(
    () => demoProperties.find((p) => p.id === selected) || null,
    [selected]
  );

  const totalYtd = useMemo(
    () => demoProperties.reduce((sum, p) => sum + p.ytd, 0),
    []
  );

  const totalBalance = useMemo(
    () => demoProperties.reduce((sum, p) => sum + p.balance, 0),
    []
  );

  const totalExpenses = useMemo(
    () => demoExpenses.reduce((sum, e) => sum + e.amount, 0),
    []
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fb", color: "#111827" }}>
      <div
        style={{
          background: "#1f3153",
          color: "#fff",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>TaxSavvy Demo</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Sample data only. This does not affect your live app.
          </div>
        </div>
        <Link
          href="/"
          style={{
            background: "#39ff14",
            color: "#1f3153",
            padding: "10px 14px",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Back to Main App
        </Link>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 16 }}>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            marginBottom: 16,
          }}
        >
          <div style={cardStyle("#1f3153", "#fff")}>
            <div style={{ opacity: 0.8 }}>Sample YTD Rent</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{money(totalYtd)}</div>
          </div>
          <div style={cardStyle("#1f3153", "#fff")}>
            <div style={{ opacity: 0.8 }}>Sample Balance</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{money(totalBalance)}</div>
          </div>
          <div style={cardStyle("#1f3153", "#fff")}>
            <div style={{ opacity: 0.8 }}>Demo Expenses</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{money(totalExpenses)}</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "320px 1fr" }}>
          <div style={panelStyle}>
            <div style={sectionTitle}>Demo Properties</div>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {demoProperties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{
                    ...propertyButtonStyle,
                    borderColor: selected === p.id ? "#39ff14" : "#dbe2ea",
                    boxShadow:
                      selected === p.id
                        ? "0 0 0 2px rgba(57,255,20,0.25)"
                        : "none",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>{p.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{p.monthDue}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {selectedProperty && (
              <div style={demoCardStyle}>
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    gridTemplateColumns: "1fr auto",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div style={{ color: "#39ff14", fontSize: 22, fontWeight: 900 }}>
                      {selectedProperty.address}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 15, fontWeight: 800 }}>
                      {selectedProperty.name}
                    </div>
                    <div style={{ marginTop: 8, opacity: 0.9 }}>
                      Owner: {selectedProperty.owner}
                    </div>
                    <div style={{ opacity: 0.9 }}>
                      Tenant: {selectedProperty.tenant}
                    </div>
                    <div style={{ opacity: 0.9 }}>
                      Lease ends: {selectedProperty.leaseEnds}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>Month Due</div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>
                      {selectedProperty.monthDue}
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        background: "rgba(255,255,255,0.08)",
                        padding: "10px 12px",
                        borderRadius: 14,
                      }}
                    >
                      <div style={{ fontSize: 13, opacity: 0.8 }}>YTD</div>
                      <div style={{ fontSize: 24, fontWeight: 900 }}>
                        {money(selectedProperty.ytd)}
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 15, fontWeight: 800 }}>
                      Balance: {money(selectedProperty.balance)}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: 999,
                        background:
                          selectedProperty.status === "Paid in full"
                            ? "#39ff14"
                            : selectedProperty.status === "Partial"
                            ? "#ffd54d"
                            : "#ff2d2d",
                        color: "#1f3153",
                        fontWeight: 900,
                      }}
                    >
                      {selectedProperty.status}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={panelStyle}>
              <div style={sectionTitle}>Demo Expenses</div>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {demoExpenses.map((e) => (
                  <div key={e.id} style={expenseRowStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>{e.vendor}</div>
                        <div style={{ fontSize: 12, opacity: 0.75 }}>
                          {e.date} · {money(e.amount)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 900 }}>{money(e.amount)}</div>
                    </div>
                    <div style={{ marginTop: 8 }}>{e.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <div style={sectionTitle}>How Demo Mode Works</div>
              <div style={{ marginTop: 10, lineHeight: 1.6 }}>
                This page is separate from your live app. You can use it to show sample
                properties, sample expenses, and the overall layout without changing your
                real data. When you are ready, the main app can keep linking here with
                <strong> /demo</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cardStyle(bg: string, color: string): React.CSSProperties {
  return {
    background: bg,
    color,
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  };
}

const panelStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #dbe2ea",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const demoCardStyle: React.CSSProperties = {
  background: "#1f3153",
  color: "#fff",
  borderRadius: 22,
  padding: 18,
};

const propertyButtonStyle: React.CSSProperties = {
  textAlign: "left",
  border: "1px solid #dbe2ea",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
  cursor: "pointer",
};

const expenseRowStyle: React.CSSProperties = {
  border: "1px solid #dbe2ea",
  borderRadius: 14,
  padding: 14,
  background: "#fafcff",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
};
