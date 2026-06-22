`tsx
"use client";

import React, { useState, useEffect } from "react";

/* ---------------------------------------------------------
   TYPES
--------------------------------------------------------- */

type PaymentMethod =
  | "Cash"
  | "Check"
  | "Zelle"
  | "Venmo"
  | "ACH"
  | "Card"
  | "PayPal"
  | "Other";

type EntityType = "LLC" | "Corp" | "Personal" | "Other";

type Entity = {
  id: string;
  name: string;
  type: EntityType;
};

type PropertyType = "Rental" | "Personal" | "Corporate";

type Property = {
  id: string;
  name: string;
  address: string;
  zip: string;
  entityId: string;
  type: PropertyType;
  monthlyRent: number;
};

type Payment = {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  customMethod?: string;
  notes?: string;
  isPartial: boolean;
};

type ExpenseCategory =
  | "Repairs"
  | "Utilities"
  | "Insurance"
  | "Mortgage Interest"
  | "Depreciation"
  | "Supplies"
  | "Professional Fees"
  | "Mileage"
  | "Home Office"
  | "Other";

type Expense = {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  notes?: string;
};

type Accountant = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type Theme = {
  primary: string;
  secondary: string;
  accent: string;
  corporateHeader: string;
  corporateBody: string;
};

type AccessibilitySettings = {
  highContrast: boolean;
  largeText: boolean;
  colorBlindSafe: boolean;
};

/* ---------------------------------------------------------
   DEFAULTS
--------------------------------------------------------- */

const DEFAULT_THEME: Theme = {
  primary: "#0F2C5C",
  secondary: "#1A3F7A",
  accent: "#39FF14",
  corporateHeader: "#39FF14",
  corporateBody: "#0F2C5C",
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  colorBlindSafe: false,
};

const initialEntities: Entity[] = [
  {
    id: "personal-mark",
    name: "Personal (Mark Cronin)",
    type: "Personal",
  },
  {
    id: "mcmc-corp",
    name: "MCMC Properties Inc",
    type: "Corp",
  },
];

const initialProperties: Property[] = [
  {
    id: "prop-118-daffodil",
    name: "118 Daffodil Drive",
    address: "118 Daffodil Drive",
    zip: "00000",
    entityId: "personal-mark",
    type: "Personal",
    monthlyRent: 0,
  },
  {
    id: "prop-mcmc",
    name: "Corporate HQ",
    address: "118 Daffodil Drive",
    zip: "00000",
    entityId: "mcmc-corp",
    type: "Corporate",
    monthlyRent: 2000,
  },
];

const paymentMethods: PaymentMethod[] = [
  "Cash",
  "Check",
  "Zelle",
  "Venmo",
  "ACH",
  "Card",
  "PayPal",
  "Other",
];

const expenseCategories: ExpenseCategory[] = [
  "Repairs",
  "Utilities",
  "Insurance",
  "Mortgage Interest",
  "Depreciation",
  "Supplies",
  "Professional Fees",
  "Mileage",
  "Home Office",
  "Other",
];

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function uuid(prefix: string) {
  return ${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)};
}

/* ---------------------------------------------------------
   MAIN PAGE
--------------------------------------------------------- */

export default function Page() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(
    DEFAULT_ACCESSIBILITY
  );

  const [entities, setEntities] = useState<Entity[]>(initialEntities);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );

  const [partialOpen, setPartialOpen] = useState(false);
  const [partialPayment, setPartialPayment] = useState<Payment | null>(null);

  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null
  );
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editingAccountantId, setEditingAccountantId] = useState<
    string | null
  >(null);

  const [backupText, setBackupText] = useState("");

  /* ---------------------------------------------------------
     LOAD FROM LOCALSTORAGE
  --------------------------------------------------------- */

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("taxsavvy_theme");
      const storedAccessibility = localStorage.getItem(
        "taxsavvy_accessibility"
      );
      const storedProps = localStorage.getItem("taxsavvy_properties");
      const storedEntities = localStorage.getItem("taxsavvy_entities");
      const storedPayments = localStorage.getItem("taxsavvy_payments");
      const storedExpenses = localStorage.getItem("taxsavvy_expenses");
      const storedAccountants = localStorage.getItem("taxsavvy_accountants");

      if (storedTheme) setTheme(JSON.parse(storedTheme));
      if (storedAccessibility)
        setAccessibility(JSON.parse(storedAccessibility));
      if (storedProps) setProperties(JSON.parse(storedProps));
      if (storedEntities) setEntities(JSON.parse(storedEntities));
      if (storedPayments) setPayments(JSON.parse(storedPayments));
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      if (storedAccountants) setAccountants(JSON.parse(storedAccountants));
    } catch {
      // ignore
    }
  }, []);

  /* ---------------------------------------------------------
     SAVE TO LOCALSTORAGE
  --------------------------------------------------------- */

  useEffect(() => {
    localStorage.setItem("taxsavvy_theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "taxsavvy_accessibility",
      JSON.stringify(accessibility)
    );
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem("taxsavvy_properties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("taxsavvy_entities", JSON.stringify(entities));
  }, [entities]);

  useEffect(() => {
    localStorage.setItem("taxsavvy_payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("taxsavvy_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(
      "taxsavvy_accountants",
      JSON.stringify(accountants)
    );
  }, [accountants]);

  /* ---------------------------------------------------------
     PARTIAL PAYMENT PANEL
  --------------------------------------------------------- */

  const openPartialPaymentPanel = (propertyId: string) => {
    const newPayment: Payment = {
      id: uuid("pay"),
      propertyId,
      amount: 0,
      date: todayString(),
      method: "Cash",
      isPartial: true,
    };
    setSelectedPropertyId(propertyId);
    setPartialPayment(newPayment);
    setPartialOpen(true);
  };

  const updatePartialField = (field: keyof Payment, value: any) => {
    setPartialPayment((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const savePartialPayment = () => {
    if (!partialPayment) return;
    setPayments((prev) => [...prev, partialPayment]);
    setPartialOpen(false);
    setPartialPayment(null);
    setSelectedPropertyId(null);
  };

  /* ---------------------------------------------------------
     PROPERTY EDITING
  --------------------------------------------------------- */

  const startEditProperty = (id: string) => {
    setEditingPropertyId(id);
  };

  const updatePropertyField = (
    id: string,
    field: keyof Property,
    value: any
  ) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setPayments((prev) => prev.filter((p) => p.propertyId !== id));
    setExpenses((prev) => prev.filter((e) => e.propertyId !== id));
    if (editingPropertyId === id) setEditingPropertyId(null);
  };

  const addProperty = () => {
    const newProp: Property = {
      id: uuid("prop"),
      name: "New Property",
      address: "",
      zip: "",
      entityId: entities[0]?.id || "",
      type: "Rental",
      monthlyRent: 0,
    };
    setProperties((prev) => [...prev, newProp]);
    setEditingPropertyId(newProp.id);
  };

  /* ---------------------------------------------------------
     ENTITY MANAGER
  --------------------------------------------------------- */

  const addEntity = () => {
    const newEntity: Entity = {
      id: uuid("ent"),
      name: "New Entity",
      type: "LLC",
    };
    setEntities((prev) => [...prev, newEntity]);
    setEditingEntityId(newEntity.id);
  };

  const updateEntityField = (
    id: string,
    field: keyof Entity,
    value: any
  ) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const deleteEntity = (id: string) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));
    setProperties((prev) =>
      prev.map((p) =>
        p.entityId === id ? { ...p, entityId: "" } : p
      )
    );
    if (editingEntityId === id) setEditingEntityId(null);
  };

  /* ---------------------------------------------------------
     PAYMENT EDITOR
  --------------------------------------------------------- */

  const startEditPayment = (id: string) => {
    setEditingPaymentId(id);
  };

  const updatePaymentField = (
    id: string,
    field: keyof Payment,
    value: any
  ) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    if (editingPaymentId === id) setEditingPaymentId(null);
  };

  const addFullPayment = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    const amount = prop?.monthlyRent || 0;
    const newPayment: Payment = {
      id: uuid("pay"),
      propertyId,
      amount,
      date: todayString(),
      method: "Cash",
      isPartial: false,
    };
    setPayments((prev) => [...prev, newPayment]);
  };

  /* ---------------------------------------------------------
     EXPENSES
  --------------------------------------------------------- */

  const addExpense = (propertyId: string) => {
    const newExpense: Expense = {
      id: uuid("exp"),
      propertyId,
      amount: 0,
      date: todayString(),
      category: "Repairs",
    };
    setExpenses((prev) => [...prev, newExpense]);
    setEditingExpenseId(newExpense.id);
  };

  const updateExpenseField = (
    id: string,
    field: keyof Expense,
    value: any
  ) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (editingExpenseId === id) setEditingExpenseId(null);
  };

  /* ---------------------------------------------------------
     ACCOUNTANTS
  --------------------------------------------------------- */

  const addAccountant = () => {
    const newAcc: Accountant = {
      id: uuid("acc"),
      name: "New Accountant",
      email: "",
    };
    setAccountants((prev) => [...prev, newAcc]);
    setEditingAccountantId(newAcc.id);
  };

  const updateAccountantField = (
    id: string,
    field: keyof Accountant,
    value: any
  ) => {
    setAccountants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const deleteAccountant = (id: string) => {
    setAccountants((prev) => prev.filter((a) => a.id !== id));
    if (editingAccountantId === id) setEditingAccountantId(null);
  };

  /* ---------------------------------------------------------
     REPORTS
  --------------------------------------------------------- */

  const totalIncome = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const profit = totalIncome - totalExpenses;

  const incomeByEntity = entities.map((entity) => {
    const entityProps = properties.filter(
      (p) => p.entityId === entity.id
    );
    const entityPropIds = entityProps.map((p) => p.id);
    const entityIncome = payments
      .filter((p) => entityPropIds.includes(p.propertyId))
      .reduce((sum, p) => sum + p.amount, 0);
    const entityExpenses = expenses
      .filter((e) => entityPropIds.includes(e.propertyId))
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      entity,
      income: entityIncome,
      expenses: entityExpenses,
      profit: entityIncome - entityExpenses,
    };
  });

  /* ---------------------------------------------------------
     THEME & ACCESSIBILITY
  --------------------------------------------------------- */

  const updateThemeField = (field: keyof Theme, value: string) => {
    setTheme((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAccessibility = (field: keyof AccessibilitySettings) => {
    setAccessibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ---------------------------------------------------------
     BACKUP / RESTORE
  --------------------------------------------------------- */

  const createBackup = () => {
    const backup = {
      theme,
      accessibility,
      entities,
      properties,
      payments,
      expenses,
      accountants,
    };
    setBackupText(JSON.stringify(backup, null, 2));
  };

  const restoreBackup = () => {
    try {
      const parsed = JSON.parse(backupText);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.accessibility) setAccessibility(parsed.accessibility);
      if (parsed.entities) setEntities(parsed.entities);
      if (parsed.properties) setProperties(parsed.properties);
      if (parsed.payments) setPayments(parsed.payments);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.accountants) setAccountants(parsed.accountants);
    } catch {
      alert("Invalid backup JSON");
    }
  };

  /* ---------------------------------------------------------
     STYLES
  --------------------------------------------------------- */

  const baseFontSize = accessibility.largeText ? 16 : 13;

  const appStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: accessibility.highContrast ? "#000000" : theme.primary,
    padding: 16,
    color: "#FFFFFF",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: baseFontSize,
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 12,
    border: 2px solid ${theme.accent},
    overflow: "hidden",
    marginBottom: 16,
  };

  const headerStyle = (property?: Property): React.CSSProperties => {
    if (property && property.type === "Corporate") {
      return {
        backgroundColor: theme.corporateHeader,
        color: theme.primary,
        padding: "10px 14px",
        fontWeight: 700,
      };
    }
    return {
      backgroundColor: theme.primary,
      color: "#FFFFFF",
      padding: "10px 14px",
      fontWeight: 700,
    };
  };

  const bodyStyle: React.CSSProperties = {
    backgroundColor: theme.secondary,
    color: "#FFFFFF",
    padding: "10px 14px",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.accent,
    color: theme.primary,
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: baseFontSize,
  };

  const smallButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    padding: "6px 10px",
    fontSize: baseFontSize - 1,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #CCCCCC",
    marginTop: 4,
    marginBottom: 8,
    fontSize: baseFontSize,
    color: "#000000",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: baseFontSize,
    fontWeight: 600,
    marginTop: 6,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: baseFontSize + 2,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
  };

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  const getEntityName = (entityId: string) =>
    entities.find((e) => e.id === entityId)?.name || "Unassigned";

  return (
    <div style={appStyle}>
      <h1 style={{ fontSize: baseFontSize + 6, fontWeight: 700, marginBottom: 8 }}>
        TaxSavvy — Personal Version (Full Build)
      </h1>

      <p style={{ marginBottom: 16 }}>
        Properties, entities, payments, expenses, reports, accountants, theme, accessibility, and backup — all in one file.
      </p>

      {/ PROPERTIES /}
      <div style={sectionTitleStyle}>Properties</div>
      <button style={smallButtonStyle} onClick={addProperty}>
        Add Property
      </button>

      {properties.map((property) => (
        <div key={property.id} style={cardStyle}>
          <div style={headerStyle(property)}>
            <div>{getEntityName(property.entityId)}</div>
            <div style={{ fontSize: baseFontSize - 1, opacity: 0.9 }}>
              {property.name} —{" "}
              {property.type === "Corporate"
                ? "Corporate Property"
                : property.type === "Personal"
                ? "Owner Occupied"
                : "Rental"}
            </div>
          </div>
          <div style={bodyStyle}>
            {editingPropertyId === property.id ? (
              <>
                <div style={labelStyle}>Name</div>
                <input
                  style={inputStyle}
                  value={property.name}
                  onChange={(e) =>
                    updatePropertyField(property.id, "name", e.target.value)
                  }
                />

                <div style={labelStyle}>Address</div>
                <input
                  style={inputStyle}
                  value={property.address}
                  onChange={(e) =>
                    updatePropertyField(property.id, "address", e.target.value)
                  }
                />

                <div style={labelStyle}>ZIP</div>
                <input
                  style={inputStyle}
                  value={property.zip}
                  onChange={(e) =>
                    updatePropertyField(property.id, "zip", e.target.value)
                  }
                />

                <div style={labelStyle}>Entity</div>
                <select
                  style={inputStyle}
                  value={property.entityId}
                  onChange={(e) =>
                    updatePropertyField(property.id, "entityId", e.target.value)
                  }
                >
                  <option value="">Unassigned</option>
                  {entities.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.name}
                    </option>
                  ))}
                </select>

                <div style={labelStyle}>Type</div>
                <select
                  style={inputStyle}
                  value={property.type}
                  onChange={(e) =>
                    updatePropertyField(
                      property.id,
                      "type",
                      e.target.value as PropertyType
                    )
                  }
                >
                  <option value="Rental">Rental</option>
                  <option value="Personal">Personal</option>
                  <option value="Corporate">Corporate</option>
                </select>

                <div style={labelStyle}>Monthly Rent</div>
                <input
                  type="number"
                  style={inputStyle}
                  value={property.monthlyRent}
                  onChange={(e) =>
                    updatePropertyField(
                      property.id,
                      "monthlyRent",
                      Number(e.target.value) || 0
                    )
                  }
                />
              </>
            ) : (
              <>
                <div>
                  <strong>Address:</strong> {property.address || "—"}
                </div>
                <div>
                  <strong>ZIP:</strong> {property.zip || "—"}
                </div>
                <div>
                  <strong>Monthly Rent:</strong>{" "}
                  {property.monthlyRent > 0 ? $${property.monthlyRent} : "N/A"}
                </div>
              </>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10,
              }}
            >
              <button
                style={smallButtonStyle}
                onClick={() =>
                  setEditingPropertyId(
                    editingPropertyId === property.id ? null : property.id
                  )
                }
              >
                {editingPropertyId === property.id ? "Done" : "Edit Property"}
              </button>

              {property.type !== "Personal" && (
                <>
                  <button
                    style={smallButtonStyle}
                    onClick={() => addFullPayment(property.id)}
                  >
                    Full Payment
                  </button>
                  <button
                    style={smallButtonStyle}
                    onClick={() => openPartialPaymentPanel(property.id)}
                  >
                    Partial Payment
                  </button>
                </>
              )}

              <button
                style={{
                  ...smallButtonStyle,
                  backgroundColor: "#FF4D4D",
                  color: "#FFFFFF",
                }}
                onClick={() => deleteProperty(property.id)}
              >
                Delete
              </button>

              <button
                style={smallButtonStyle}
                onClick={() => addExpense(property.id)}
              >
                Add Expense
              </button>
            </div>

            {/ PAYMENTS FOR PROPERTY /}
            <div style={{ marginTop: 10 }}>
              <strong>Payments:</strong>
              <ul style={{ marginTop: 4, paddingLeft: 16 }}>
                {payments
                  .filter((p) => p.propertyId === property.id)
                  .map((p) => (
                    <li key={p.id}>
                      ${p.amount} on {p.date} via{" "}
                      {p.method === "Other"
                        ? p.customMethod || "Other"
                        : p.method}{" "}
                      {p.isPartial ? "(partial)" : ""}{" "}
                      <button
                        style={{
                          ...smallButtonStyle,
                          padding: "2px 6px",
                          fontSize: baseFontSize - 2,
                        }}
                        onClick={() => startEditPayment(p.id)}
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                {payments.filter((p) => p.propertyId === property.id).length ===
                  0 && <li>No payments yet.</li>}
              </ul>
            </div>

            {/ EXPENSES FOR PROPERTY /}
            <div style={{ marginTop: 10 }}>
              <strong>Expenses:</strong>
              <ul style={{ marginTop: 4, paddingLeft: 16 }}>
                {expenses
                  .filter((e) => e.propertyId === property.id)
                  .map((e) => (
                    <li key={e.id}>
                      ${e.amount} on {e.date} ({e.category}){" "}
                      <button
                        style={{
                          ...smallButtonStyle,
                          padding: "2px 6px",
                          fontSize: baseFontSize - 2,
                        }}
                        onClick={() => setEditingExpenseId(e.id)}
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                {expenses.filter((e) => e.propertyId === property.id).length ===
                  0 && <li>No expenses yet.</li>}
              </ul>
            </div>
          </div>
        </div>
      ))}

      {/ ENTITIES /}
      <div style={sectionTitleStyle}>Entities</div>
      <button style={smallButtonStyle} onClick={addEntity}>
        Add Entity
      </button>
      {entities.map((ent) => (
        <div key={ent.id} style={cardStyle}>
          <div style={headerStyle()}>
            <div>{ent.name}</div>
            <div style={{ fontSize: baseFontSize - 1, opacity: 0.9 }}>
              {ent.type}
            </div>
          </div>
          <div style={bodyStyle}>
            {editingEntityId === ent.id ? (
              <>
                <div style={labelStyle}>Name</div>
                <input
                  style={inputStyle}
                  value={ent.name}
                  onChange={(e) =>
                    updateEntityField(ent.id, "name", e.target.value)
                  }
                />
                <div style={labelStyle}>Type</div>
                <select
                  style={inputStyle}
                  value={ent.type}
                  onChange={(e) =>
                    updateEntityField(
                      ent.id,
                      "type",
                      e.target.value as EntityType
                    )
                  }
                >
                  <option value="LLC">LLC</option>
                  <option value="Corp">Corp</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </>
            ) : (
              <>
                <div>
                  <strong>Type:</strong> {ent.type}
                </div>
              </>
            )}

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                style={smallButtonStyle}
                onClick={() =>
                  setEditingEntityId(
                    editingEntityId === ent.id ? null : ent.id
                  )
                }
              >
                {editingEntityId === ent.id ? "Done" : "Edit Entity"}
              </button>
              <button
                style={{
                  ...smallButtonStyle,
                  backgroundColor: "#FF4D4D",
                  color: "#FFFFFF",
                }}
                onClick={() => deleteEntity(ent.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {/ PAYMENTS EDITOR /}
      <div style={sectionTitleStyle}>All Payments</div>
      {payments.length === 0 && <div>No payments recorded yet.</div>}
      {payments.map((p) => {
        const prop = properties.find((pr) => pr.id === p.propertyId);
        return (
          <div key={p.id} style={cardStyle}>
            <div style={headerStyle()}>
              <div>
                {prop?.name || "Unknown Property"} —{" "}
                {p.isPartial ? "Partial" : "Full"} Payment
              </div>
            </div>
            <div style={bodyStyle}>
              {editingPaymentId === p.id ? (
                <>
                  <div style={labelStyle}>Amount</div>
                  <input
                    type="number"
                    style={inputStyle}
                    value={p.amount}
                    onChange={(e) =>
                      updatePaymentField(
                        p.id,
                        "amount",
                        Number(e.target.value) || 0
                      )
                    }
                  />

                  <div style={labelStyle}>Date</div>
                  <input
                    type="date"
                    style={inputStyle}
                    value={p.date}
                    onChange={(e) =>
                      updatePaymentField(p.id, "date", e.target.value)
                    }
                  />

                  <div style={labelStyle}>Method</div>
                  <select
                    style={inputStyle}
                    value={p.method}
                    onChange={(e) =>
                      updatePaymentField(
                        p.id,
                        "method",
                        e.target.value as PaymentMethod
                      )
                    }
                  >
                    {paymentMethods.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {p.method === "Other" && (
                    <>
                      <div style={labelStyle}>Custom Method</div>
                      <input
                        style={inputStyle}
                        value={p.customMethod || ""}
                        onChange={(e) =>
                          updatePaymentField(
                            p.id,
                            "customMethod",
                            e.target.value
                          )
                        }
                      />
                    </>
                  )}

                  <div style={labelStyle}>Notes</div>
                  <textarea
                    style={{ ...inputStyle, minHeight: 60 }}
                    value={p.notes || ""}
                    onChange={(e) =>
                      updatePaymentField(p.id, "notes", e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <div>
                    <strong>Amount:</strong> ${p.amount}
                  </div>
                  <div>
                    <strong>Date:</strong> {p.date}
                  </div>
                  <div>
                    <strong>Method:</strong>{" "}
                    {p.method === "Other"
                      ? p.customMethod || "Other"
                      : p.method}
                  </div>
                  {p.notes && (
                    <div>
                      <strong>Notes:</strong> {p.notes}
                    </div>
                  )}
                </>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={smallButtonStyle}
                  onClick={() =>
                    setEditingPaymentId(
                      editingPaymentId === p.id ? null : p.id
                    )
                  }
                >
                  {editingPaymentId === p.id ? "Done" : "Edit Payment"}
                </button>
                <button
                  style={{
                    ...smallButtonStyle,
                    backgroundColor: "#FF4D4D",
                    color: "#FFFFFF",
                  }}
                  onClick={() => deletePayment(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/ EXPENSES EDITOR /}
      <div style={sectionTitleStyle}>All Expenses</div>
      {expenses.length === 0 && <div>No expenses recorded yet.</div>}
      {expenses.map((e) => {
        const prop = properties.find((pr) => pr.id === e.propertyId);
        return (
          <div key={e.id} style={cardStyle}>
            <div style={headerStyle()}>
              <div>
                {prop?.name || "Unknown Property"} — Expense ({e.category})
              </div>
            </div>
            <div style={bodyStyle}>
              {editingExpenseId === e.id ? (
                <>
                  <div style={labelStyle}>Amount</div>
                  <input
                    type="number"
                    style={inputStyle}
                    value={e.amount}
                    onChange={(ev) =>
                      updateExpenseField(
                        e.id,
                        "amount",
                        Number(ev.target.value) || 0
                      )
                    }
                  />

                  <div style={labelStyle}>Date</div>
                  <input
                    type="date"
                    style={inputStyle}
                    value={e.date}
                    onChange={(ev) =>
                      updateExpenseField(e.id, "date", ev.target.value)
                    }
                  />

                  <div style={labelStyle}>Category</div>
                  <select
                    style={inputStyle}
                    value={e.category}
                    onChange={(ev) =>
                      updateExpenseField(
                        e.id,
                        "category",
                        ev.target.value as ExpenseCategory
                      )
                    }
                  >
                    {expenseCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <div style={labelStyle}>Notes</div>
                  <textarea
                    style={{ ...inputStyle, minHeight: 60 }}
                    value={e.notes || ""}
                    onChange={(ev) =>
                      updateExpenseField(e.id, "notes", ev.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <div>
                    <strong>Amount:</strong> ${e.amount}
                  </div>
                  <div>
                    <strong>Date:</strong> {e.date}
                  </div>
                  <div>
                    <strong>Category:</strong> {e.category}
                  </div>
                  {e.notes && (
                    <div>
                      <strong>Notes:</strong> {e.notes}
                    </div>
                  )}
                </>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={smallButtonStyle}
                  onClick={() =>
                    setEditingExpenseId(
                      editingExpenseId === e.id ? null : e.id
                    )
                  }
                >
                  {editingExpenseId === e.id ? "Done" : "Edit Expense"}
                </button>
                <button
                  style={{
                    ...smallButtonStyle,
                    backgroundColor: "#FF4D4D",
                    color: "#FFFFFF",
                  }}
                  onClick={() => deleteExpense(e.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/ ACCOUNTANTS /}
      <div style={sectionTitleStyle}>Accountants</div>
      <button style={smallButtonStyle} onClick={addAccountant}>
        Add Accountant
      </button>
      {accountants.map((a) => (
        <div key={a.id} style={cardStyle}>
          <div style={headerStyle()}>
            <div>{a.name}</div>
          </div>
          <div style={bodyStyle}>
            {editingAccountantId === a.id ? (
              <>
                <div style={labelStyle}>Name</div>
                <input
                  style={inputStyle}
                  value={a.name}
                  onChange={(e) =>
                    updateAccountantField(a.id, "name", e.target.value)
                  }
                />

                <div style={labelStyle}>Email</div>
                <input
                  style={inputStyle}
                  value={a.email}
                  onChange={(e) =>
                    updateAccountantField(a.id, "email", e.target.value)
                  }
                />

                <div style={labelStyle}>Phone</div>
                <input
                  style={inputStyle}
                  value={a.phone || ""}
                  onChange={(e) =>
                    updateAccountantField(a.id, "phone", e.target.value)
                  }
                />
              </>
            ) : (
              <>
                <div>
                  <strong>Email:</strong> {a.email || "—"}
                </div>
                <div>
                  <strong>Phone:</strong> {a.phone || "—"}
                </div>
              </>
            )}

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                style={smallButtonStyle}
                onClick={() =>
                  setEditingAccountantId(
                    editingAccountantId === a.id ? null : a.id
                  )
                }
              >
                {editingAccountantId === a.id ? "Done" : "Edit Accountant"}
              </button>
              <button
                style={{
                  ...smallButtonStyle,
                  backgroundColor: "#FF4D4D",
                  color: "#FFFFFF",
                }}
                onClick={() => deleteAccountant(a.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {/ REPORTS /}
      <div style={sectionTitleStyle}>Reports (Summary)</div>
      <div style={cardStyle}>
        <div style={headerStyle()}>
          <div>Overall Summary</div>
        </div>
        <div style={bodyStyle}>
          <div>
            <strong>Total Income:</strong> ${totalIncome.toFixed(2)}
          </div>
          <div>
            <strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}
          </div>
          <div>
            <strong>Profit:</strong> ${profit.toFixed(2)}
          </div>
        </div>
      </div>

      {incomeByEntity.map(({ entity, income, expenses: entExp, profit }) => (
        <div key={entity.id} style={cardStyle}>
          <div style={headerStyle()}>
            <div>{entity.name}</div>
          </div>
          <div style={bodyStyle}>
            <div>
              <strong>Income:</strong> ${income.toFixed(2)}
            </div>
            <div>
              <strong>Expenses:</strong> ${entExp.toFixed(2)}
            </div>
            <div>
              <strong>Profit:</strong> ${profit.toFixed(2)}
            </div>
          </div>
        </div>
      ))}

      {/ THEME /}
      <div style={sectionTitleStyle}>Theme</div>
      <div style={cardStyle}>
        <div style={headerStyle()}>
          <div>Colors</div>
        </div>
        <div style={bodyStyle}>
          <div style={labelStyle}>Primary</div>
          <input
            style={inputStyle}
            value={theme.primary}
            onChange={(e) => updateThemeField("primary", e.target.value)}
          />

          <div style={labelStyle}>Secondary</div>
          <input
            style={inputStyle}
            value={theme.secondary}
            onChange={(e) => updateThemeField("secondary", e.target.value)}
          />

          <div style={labelStyle}>Accent</div>
          <input
            style={inputStyle}
            value={theme.accent}
            onChange={(e) => updateThemeField("accent", e.target.value)}
          />

          <div style={labelStyle}>Corporate Header</div>
          <input
            style={inputStyle}
            value={theme.corporateHeader}
            onChange={(e) =>
              updateThemeField("corporateHeader", e.target.value)
            }
          />

          <div style={labelStyle}>Corporate Body</div>
          <input
            style={inputStyle}
            value={theme.corporateBody}
            onChange={(e) =>
              updateThemeField("corporateBody", e.target.value)
            }
          />
        </div>
      </div>

      {/ ACCESSIBILITY /}
      <div style={sectionTitleStyle}>Accessibility</div>
      <div style={cardStyle}>
        <div style={headerStyle()}>
          <div>Display Options</div>
        </div>
        <div style={bodyStyle}>
          <div style={{ marginBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={() => toggleAccessibility("highContrast")}
                style={{ marginRight: 6 }}
              />
              High contrast mode
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={accessibility.largeText}
                onChange={() => toggleAccessibility("largeText")}
                style={{ marginRight: 6 }}
              />
              Large text
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={accessibility.colorBlindSafe}
                onChange={() => toggleAccessibility("colorBlindSafe")}
                style={{ marginRight: 6 }}
              />
              Color‑blind safe palette (visual only for now)
            </label>
          </div>
        </div>
      </div>

      {/ BACKUP / RESTORE /}
      <div style={sectionTitleStyle}>Backup & Restore</div>
      <div style={cardStyle}>
        <div style={headerStyle()}>
          <div>Data Backup</div>
        </div>
        <div style={bodyStyle}>
          <div style={{ marginBottom: 8 }}>
            <button style={smallButtonStyle} onClick={createBackup}>
              Create Backup JSON
            </button>
          </div>
          <div style={labelStyle}>Backup JSON</div>
          <textarea
            style={{ ...inputStyle, minHeight: 120 }}
            value={backupText}
            onChange={(e) => setBackupText(e.target.value)}
          />
          <div style={{ marginTop: 8 }}>
            <button style={smallButtonStyle} onClick={restoreBackup}>
              Restore from JSON
            </button>
          </div>
        </div>
      </div>

      {/ SLIDE-UP PARTIAL PAYMENT PANEL /}
      {partialOpen && partialPayment && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.secondary,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            boxShadow: "0 -4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 999,
              backgroundColor: "#888",
              margin: "0 auto 10px",
            }}
          />

          <h2
            style={{
              fontSize: baseFontSize + 2,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Partial Payment
          </h2>

          <div style={labelStyle}>Amount Paid</div>
          <input
            type="number"
            style={inputStyle}
            value={partialPayment.amount || ""}
            onChange={(e) =>
              updatePartialField("amount", Number(e.target.value) || 0)
            }
          />

          <div style={labelStyle}>Date Paid</div>
          <input
            type="date"
            style={inputStyle}
            value={partialPayment.date}
            onChange={(e) => updatePartialField("date", e.target.value)}
          />

          <div style={labelStyle}>Payment Method</div>
          <select
            style={inputStyle}
            value={partialPayment.method}
            onChange={(e) =>
              updatePartialField("method", e.target.value as PaymentMethod)
            }
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {partialPayment.method === "Other" && (
            <>
              <div style={labelStyle}>Custom Method</div>
              <input
                type="text"
                style={inputStyle}
                value={partialPayment.customMethod || ""}
                onChange={(e) =>
                  updatePartialField("customMethod", e.target.value)
                }
              />
            </>
          )}

          <div style={labelStyle}>Notes (optional)</div>
          <textarea
            style={{ ...inputStyle, minHeight: 60 }}
            value={partialPayment.notes || ""}
            onChange={(e) => updatePartialField("notes", e.target.value)}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              gap: 8,
            }}
          >
            <button
              style={{
                ...buttonStyle,
                backgroundColor: "#FFFFFF",
                color: theme.primary,
              }}
              onClick={() => {
                setPartialOpen(false);
                setPartialPayment(null);
                setSelectedPropertyId(null);
              }}
            >
              Cancel
            </button>
            <button style={buttonStyle} onClick={savePartialPayment}>
              Save Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`
