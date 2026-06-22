'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Mode = 'live';

type PaymentMethod = 'cash' | 'check' | 'zelle' | 'venmo' | 'ach' | 'card';

type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  rentAmount: number;
  owner: string;
  tenant?: string;
  purchaseDate?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  isPersonal?: boolean;
};

type RentPayment = {
  id: string;
  propertyId: string;
  amount: number;
  date: string; // ISO string
  month: number; // 1-12
  year: number;
  type: 'full' | 'partial';
  method?: PaymentMethod;
  note?: string;
};

type Expense = {
  id: string;
  propertyId?: string;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
};

type AppState = {
  mode: Mode;
  properties: Property[];
  rentPayments: RentPayment[];
  expenses: Expense[];
  companyName: string;
  appName: string;
  subtitle: string;
};

const NAVY = '#123A6F';
const NAVY_LIGHT = '#1A4A7A';
const NEON_GREEN = '#39FF14';
const TEXT_WHITE = '#FFFFFF';

const generateId = () => Math.random().toString(36).substring(2, 9);

const INITIAL_STATE: AppState = {
  mode: 'live',
  appName: 'TaxSavvy',
  companyName: 'Cronin Rentals LLC',
  subtitle: 'State and Federal Income Tax Preparation Software',
  properties: [
    {
      id: 'p1',
      name: '118 Daffodil Drive',
      address: '118 Daffodil Dr',
      city: 'Horseheads',
      state: 'NY',
      zip: '14845',
      rentAmount: 0,
      owner: 'Personal',
      isPersonal: true,
    },
    {
      id: 'p2',
      name: '114 Orchard St',
      address: '114 Orchard St',
      city: 'Horseheads',
      state: 'NY',
      zip: '14845',
      rentAmount: 1405,
      owner: 'Cronin NY Property Management LLC',
      tenant: 'John Smith',
    },
  ],
  rentPayments: [],
  expenses: [],
};

type Tab =
  | 'dashboard'
  | 'properties'
  | 'rentLedger'
  | 'expenses'
  | 'reports'
  | 'settings'
  | 'homeOffice';

export default function Page() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Payment entry form
  const [paymentPropertyId, setPaymentPropertyId] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [paymentMonth, setPaymentMonth] = useState<number>(new Date().getMonth() + 1);
  const [paymentYear, setPaymentYear] = useState<number>(new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentNote, setPaymentNote] = useState<string>('');

  // Expense entry form
  const [expensePropertyId, setExpensePropertyId] = useState<string | null>(null);
  const [expenseVendor, setExpenseVendor] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<string>('Repairs');
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>('');
  const [expenseDescription, setExpenseDescription] = useState<string>('');

  // Settings editable fields
  const [appName, setAppName] = useState<string>(state.appName);
  const [companyName, setCompanyName] = useState<string>(state.companyName);
  const [subtitle, setSubtitle] = useState<string>(state.subtitle);

  // Month/year selector for dashboard / rent ledger
  const [viewMonth, setViewMonth] = useState<number>(new Date().getMonth() + 1);
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const stored = localStorage.getItem('taxSavvyAppState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
        setAppName(parsed.appName ?? INITIAL_STATE.appName);
        setCompanyName(parsed.companyName ?? INITIAL_STATE.companyName);
        setSubtitle(parsed.subtitle ?? INITIAL_STATE.subtitle);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taxSavvyAppState', JSON.stringify(state));
  }, [state]);

  const currentMonthPayments = useMemo(
    () =>
      state.rentPayments.filter(
        (p) => p.month === viewMonth && p.year === viewYear,
      ),
    [state.rentPayments, viewMonth, viewYear],
  );

  const collectedMTD = useMemo(
    () => currentMonthPayments.reduce((sum, p) => sum + p.amount, 0),
    [currentMonthPayments],
  );

  const outstandingByProperty = useMemo(() => {
    const result: Record<string, number> = {};
    state.properties.forEach((prop) => {
      if (!prop.rentAmount || prop.rentAmount <= 0) return;
      const paid = currentMonthPayments
        .filter((p) => p.propertyId === prop.id)
        .reduce((sum, p) => sum + p.amount, 0);
      const outstanding = Math.max(0, prop.rentAmount - paid);
      result[prop.id] = outstanding;
    });
    return result;
  }, [state.properties, currentMonthPayments]);

  const totalOutstanding = useMemo(
    () => Object.values(outstandingByProperty).reduce((sum, v) => sum + v, 0),
    [outstandingByProperty],
  );

  const occupiedUnits = useMemo(
    () =>
      state.properties.filter((p) => !!p.tenant && !p.isPersonal).length,
    [state.properties],
  );

  const totalUnits = useMemo(
    () => state.properties.filter((p) => !p.isPersonal).length,
    [state.properties],
  );

  const occupancyPercent = totalUnits === 0 ? 0 : Math.round((occupiedUnits / totalUnits) * 100);

  const ytdExpenses = useMemo(() => {
    const nowYear = viewYear;
    return state.expenses
      .filter((e) => new Date(e.date).getFullYear() === nowYear)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [state.expenses, viewYear]);

  const handleSaveSettings = () => {
    setState((prev) => ({
      ...prev,
      appName,
      companyName,
      subtitle,
    }));
  };

  const handleAddPayment = () => {
    if (!paymentPropertyId) return;
    const property = state.properties.find((p) => p.id === paymentPropertyId);
    if (!property) return;

    const amount =
      paymentType === 'full'
        ? property.rentAmount
        : Number(paymentAmount || '0');

    if (!amount || amount <= 0) return;

    const date =
      paymentDate && paymentDate.trim().length > 0
        ? paymentDate
        : new Date().toISOString().slice(0, 10);

    const newPayment: RentPayment = {
      id: generateId(),
      propertyId: property.id,
      amount,
      date,
      month: paymentMonth,
      year: paymentYear,
      type: paymentType,
      method: paymentMethod,
      note: paymentNote,
    };

    setState((prev) => ({
      ...prev,
      rentPayments: [...prev.rentPayments, newPayment],
    }));

    setPaymentAmount('');
    setPaymentDate('');
    setPaymentNote('');
  };

  const handleAddExpense = () => {
    const amount = Number(expenseAmount || '0');
    if (!amount || amount <= 0) return;

    const date =
      expenseDate && expenseDate.trim().length > 0
        ? expenseDate
        : new Date().toISOString().slice(0, 10);

    const newExpense: Expense = {
      id: generateId(),
      propertyId: expensePropertyId || undefined,
      vendor: expenseVendor || 'Vendor',
      category: expenseCategory || 'General',
      amount,
      date,
      description: expenseDescription,
    };

    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));

    setExpenseVendor('');
    setExpenseCategory('Repairs');
    setExpenseAmount('');
    setExpenseDate('');
    setExpenseDescription('');
  };

  const handleEditPropertyField = (
    propertyId: string,
    field: keyof Property,
    value: string | number | boolean,
  ) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.map((p) =>
        p.id === propertyId ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleDeletePayment = (paymentId: string) => {
    setState((prev) => ({
      ...prev,
      rentPayments: prev.rentPayments.filter((p) => p.id !== paymentId),
    }));
  };

  const handleAddProperty = () => {
    const newProp: Property = {
      id: generateId(),
      name: 'New Property',
      address: 'New Address',
      city: 'City',
      state: 'NY',
      zip: '00000',
      rentAmount: 0,
      owner: companyName || 'Owner',
    };
    setState((prev) => ({
      ...prev,
      properties: [...prev.properties, newProp],
    }));
  };

  const monthLabel = (m: number) =>
    new Date(viewYear, m - 1, 1).toLocaleString('default', {
      month: 'short',
    });

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: NAVY,
    color: TEXT_WHITE,
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: `1px solid ${NEON_GREEN}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  };

  const logoCircleStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: TEXT_WHITE,
    fontWeight: 700,
    fontSize: 18,
  };

  const topTitleStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const topButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  };

  const pillButton = (active?: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: 999,
    border: active ? `1px solid ${NEON_GREEN}` : `1px solid ${TEXT_WHITE}`,
    backgroundColor: active ? NEON_GREEN : 'transparent',
    color: active ? NAVY : TEXT_WHITE,
    fontSize: 12,
    cursor: 'pointer',
  });

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 12px 64px',
    gap: 12,
  };

  const cardsRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  };

  const metricCardStyle: React.CSSProperties = {
    flex: '1 1 160px',
    minWidth: 160,
    backgroundColor: NAVY_LIGHT,
    borderRadius: 8,
    padding: 10,
    border: `1px solid ${NEON_GREEN}`,
  };

  const sectionCardStyle: React.CSSProperties = {
    backgroundColor: NAVY_LIGHT,
    borderRadius: 8,
    padding: 10,
    border: `1px solid ${NEON_GREEN}`,
  };

  const bottomNavStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NAVY,
    borderTop: `1px solid ${NEON_GREEN}`,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '6px 4px',
    zIndex: 20,
  };

  const bottomButton = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    margin: '0 4px',
    padding: '6px 4px',
    borderRadius: 999,
    border: `1px solid ${NEON_GREEN}`,
    backgroundColor: isActive ? NEON_GREEN : NAVY,
    color: isActive ? NAVY : TEXT_WHITE,
    fontSize: 11,
    textAlign: 'center',
    cursor: 'pointer',
  });

  const tabButton = (target: Tab, label: string) => (
    <button
      style={bottomButton(tab === target)}
      onClick={() => setTab(target)}
    >
      {label}
    </button>
  );

  const renderDashboard = () => (
    <div style={sectionCardStyle}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 14 }}>Good afternoon, Mark</div>
        <div style={{ fontSize: 12, color: NEON_GREEN }}>
          Here&apos;s your {monthLabel(viewMonth)} {viewYear} portfolio snapshot
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <button
          style={pillButton(false)}
          onClick={() => setTab('rentLedger')}
        >
          Open Rent Ledger
        </button>
        <button
          style={pillButton(false)}
          onClick={() => {
            setTab('rentLedger');
          }}
        >
          + Add rent entry
        </button>
      </div>

      <div style={cardsRowStyle}>
        <div style={metricCardStyle}>
          <div style={{ fontSize: 11, color: NEON_GREEN }}>Collected MTD</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            ${collectedMTD.toFixed(2)}
          </div>
          <div style={{ fontSize: 11 }}>Month: {monthLabel(viewMonth)} {viewYear}</div>
        </div>
        <div style={metricCardStyle}>
          <div style={{ fontSize: 11, color: NEON_GREEN }}>Outstanding</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            ${totalOutstanding.toFixed(2)}
          </div>
          <div style={{ fontSize: 11 }}>
            {occupiedUnits} occupied / {totalUnits} units
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={{ fontSize: 11, color: NEON_GREEN }}>Occupancy</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {occupancyPercent}%
          </div>
          <div style={{ fontSize: 11 }}>
            {occupiedUnits} of {totalUnits} units
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={{ fontSize: 11, color: NEON_GREEN }}>YTD Expenses</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            ${ytdExpenses.toFixed(2)}
          </div>
          <div style={{ fontSize: 11 }}>Schedule E ready</div>
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11 }}>View month</div>
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            style={{
              backgroundColor: NAVY,
              color: TEXT_WHITE,
              borderRadius: 4,
              border: `1px solid ${NEON_GREEN}`,
              padding: '4px 6px',
              fontSize: 11,
            }}
          >
            {Array.from({ length: 12 }).map((_, idx) => {
              const m = idx + 1;
              return (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11 }}>View year</div>
          <input
            type="number"
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            style={{
              backgroundColor: NAVY,
              color: TEXT_WHITE,
              borderRadius: 4,
              border: `1px solid ${NEON_GREEN}`,
              padding: '4px 6px',
              fontSize: 11,
              width: 80,
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div style={sectionCardStyle}>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: NEON_GREEN }}>Properties</div>
        <button style={pillButton(false)} onClick={handleAddProperty}>
          + Add property
        </button>
      </div>
      <div style={cardsRowStyle}>
        {state.properties.map((prop) => {
          const outstanding = outstandingByProperty[prop.id] ?? 0;
          const paid = currentMonthPayments
            .filter((p) => p.propertyId === prop.id)
            .reduce((sum, p) => sum + p.amount, 0);

          return (
            <div
              key={prop.id}
              style={{
                ...metricCardStyle,
                border: `1px solid ${NEON_GREEN}`,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedPropertyId(prop.id)}
            >
              <div style={{ fontSize: 11, color: NEON_GREEN }}>
                {prop.isPersonal ? 'Personal • Owner Occupied' : 'Rental'}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{prop.name}</div>
              <div style={{ fontSize: 11 }}>
                {prop.address}, {prop.city}, {prop.state} {prop.zip}
              </div>
              <div style={{ marginTop: 6, fontSize: 11 }}>
                Owner: {prop.owner}
              </div>
              {prop.tenant && (
                <div style={{ fontSize: 11 }}>Tenant: {prop.tenant}</div>
              )}
              <div style={{ marginTop: 6, fontSize: 11 }}>
                Rent: ${prop.rentAmount.toFixed(2)}
              </div>
              <div style={{ fontSize: 11 }}>
                Paid this month: ${paid.toFixed(2)}
              </div>
              <div style={{ fontSize: 11 }}>
                Outstanding: ${outstanding.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPropertyId && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: `1px solid ${NEON_GREEN}`,
          }}
        >
          {renderPropertyDetails(selectedPropertyId)}
        </div>
      )}
    </div>
  );

  const renderPropertyDetails = (propertyId: string) => {
    const prop = state.properties.find((p) => p.id === propertyId);
    if (!prop) return null;

    const payments = state.rentPayments.filter((p) => p.propertyId === propertyId);

    return (
      <div>
        <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 6 }}>
          Property details (editable)
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 11 }}>Name</div>
            <input
              value={prop.name}
              onChange={(e) =>
                handleEditPropertyField(propertyId, 'name', e.target.value)
              }
              style={inputStyle()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11 }}>Address</div>
            <input
              value={prop.address}
              onChange={(e) =>
                handleEditPropertyField(propertyId, 'address', e.target.value)
              }
              style={inputStyle()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11 }}>City</div>
            <input
              value={prop.city}
              onChange={(e) =>
                handleEditPropertyField(propertyId, 'city', e.target.value)
              }
              style={inputStyle()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11 }}>State</div>
            <input
              value={prop.state}
              onChange={(e) =>
                handleEditPropertyField(propertyId, 'state', e.target.value)
              }
              style={inputStyle()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11 }}>ZIP</div>
            <input
              value={prop.zip}
              onChange={(e) =>
                handleEditPropertyField(propertyId, 'zip', e.target.value)
              }
              style={inputStyle()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11 }}>Owner</div>
            <input
              value={prop.owner}
              onChange={(e) =>
                handleEditPropertyField(propertyId, 'owner', e.target.value)
              }
              style={inputStyle()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11 }}>Tenant</div>
            <input
              value={prop.tenant || ''}
              onChange={(e) =>
                handleEditPropertyField(propertyId, 'tenant', e.target.value)
              }
              style={inputStyle()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11 }}>Rent amount</div>
            <input
              type="number"
              value={prop.rentAmount}
              onChange={(e) =>
                handleEditPropertyField(
                  propertyId,
                  'rentAmount',
                  Number(e.target.value || '0'),
                )
              }
              style={inputStyle()}
            />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 4 }}>
            Payment history
          </div>
          {payments.length === 0 && (
            <div style={{ fontSize: 11 }}>No payments recorded yet.</div>
          )}
          {payments.map((p) => (
            <div
              key={p.id}
              style={{
                marginBottom: 4,
                padding: 6,
                borderRadius: 4,
                backgroundColor: NAVY,
                border: `1px solid ${NEON_GREEN}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div style={{ fontSize: 11 }}>
                {p.type === 'full' ? 'Full' : 'Partial'} ${p.amount.toFixed(2)}{' '}
                on {p.date} ({monthLabel(p.month)} {p.year})
                {p.method && ` • ${p.method}`}
                {p.note && ` • ${p.note}`}
              </div>
              <button
                style={{
                  ...pillButton(false),
                  padding: '2px 8px',
                  fontSize: 10,
                }}
                onClick={() => handleDeletePayment(p.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const inputStyle = (): React.CSSProperties => ({
    width: '100%',
    backgroundColor: NAVY,
    color: TEXT_WHITE,
    borderRadius: 4,
    border: `1px solid ${NEON_GREEN}`,
    padding: '4px 6px',
    fontSize: 11,
  });

  const renderRentLedger = () => (
    <div style={sectionCardStyle}>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: NEON_GREEN }}>Rent Ledger</div>
        <div style={{ fontSize: 11 }}>
          Month: {monthLabel(viewMonth)} {viewYear}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 11 }}>Property</div>
          <select
            value={paymentPropertyId || ''}
            onChange={(e) => setPaymentPropertyId(e.target.value || null)}
            style={inputStyle()}
          >
            <option value="">Select property</option>
            {state.properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Payment type</div>
          <select
            value={paymentType}
            onChange={(e) =>
              setPaymentType(e.target.value as 'full' | 'partial')
            }
            style={inputStyle()}
          >
            <option value="full">Paid in full</option>
            <option value="partial">Partial payment</option>
          </select>
        </div>
        {paymentType === 'partial' && (
          <div>
            <div style={{ fontSize: 11 }}>Amount</div>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              style={inputStyle()}
            />
          </div>
        )}
        <div>
          <div style={{ fontSize: 11 }}>Date</div>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Month</div>
          <select
            value={paymentMonth}
            onChange={(e) => setPaymentMonth(Number(e.target.value))}
            style={inputStyle()}
          >
            {Array.from({ length: 12 }).map((_, idx) => {
              const m = idx + 1;
              return (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Year</div>
          <input
            type="number"
            value={paymentYear}
            onChange={(e) => setPaymentYear(Number(e.target.value))}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Payment method</div>
          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as PaymentMethod)
            }
            style={inputStyle()}
          >
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="zelle">Zelle</option>
            <option value="venmo">Venmo</option>
            <option value="ach">ACH</option>
            <option value="card">Card</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Note</div>
          <input
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            style={inputStyle()}
          />
        </div>
      </div>

      <button style={pillButton(true)} onClick={handleAddPayment}>
        Save payment
      </button>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 4 }}>
          Payments for {monthLabel(viewMonth)} {viewYear}
        </div>
        {currentMonthPayments.length === 0 && (
          <div style={{ fontSize: 11 }}>No payments recorded for this month.</div>
        )}
        {currentMonthPayments.map((p) => {
          const prop = state.properties.find((x) => x.id === p.propertyId);
          return (
            <div
              key={p.id}
              style={{
                marginBottom: 4,
                padding: 6,
                borderRadius: 4,
                backgroundColor: NAVY,
                border: `1px solid ${NEON_GREEN}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div style={{ fontSize: 11 }}>
                {prop?.name || 'Property'} • {p.type === 'full' ? 'Full' : 'Partial'} $
                {p.amount.toFixed(2)} on {p.date}
                {p.method && ` • ${p.method}`}
                {p.note && ` • ${p.note}`}
              </div>
              <button
                style={{
                  ...pillButton(false),
                  padding: '2px 8px',
                  fontSize: 10,
                }}
                onClick={() => handleDeletePayment(p.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div style={sectionCardStyle}>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: NEON_GREEN }}>Expenses</div>
        <button style={pillButton(false)} onClick={handleAddExpense}>
          + Add expense
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 11 }}>Property (optional)</div>
          <select
            value={expensePropertyId || ''}
            onChange={(e) => setExpensePropertyId(e.target.value || null)}
            style={inputStyle()}
          >
            <option value="">Unassigned</option>
            {state.properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Vendor</div>
          <input
            value={expenseVendor}
            onChange={(e) => setExpenseVendor(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Category</div>
          <input
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Amount</div>
          <input
            type="number"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Date</div>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Description</div>
          <input
            value={expenseDescription}
            onChange={(e) => setExpenseDescription(e.target.value)}
            style={inputStyle()}
          />
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 4 }}>
          Saved expenses
        </div>
        {state.expenses.length === 0 && (
          <div style={{ fontSize: 11 }}>No expenses recorded yet.</div>
        )}
        {state.expenses.map((e) => {
          const prop = state.properties.find((p) => p.id === e.propertyId);
          return (
            <div
              key={e.id}
              style={{
                marginBottom: 4,
                padding: 6,
                borderRadius: 4,
                backgroundColor: NAVY,
                border: `1px solid ${NEON_GREEN}`,
              }}
            >
              <div style={{ fontSize: 11 }}>
                {e.vendor} • {e.category} • ${e.amount.toFixed(2)} on {e.date}
              </div>
              {prop && (
                <div style={{ fontSize: 11 }}>
                  Property: {prop.name} ({prop.address})
                </div>
              )}
              {e.description && (
                <div style={{ fontSize: 11 }}>{e.description}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReports = () => (
    <div style={sectionCardStyle}>
      <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 6 }}>
        Reports
      </div>
      <div style={{ fontSize: 11, marginBottom: 6 }}>
        Future: Schedule E, Schedule A, P&amp;L, Home office, Mileage, etc.
      </div>
      <div style={{ fontSize: 11 }}>
        You can later add a &quot;Send to accountant&quot; feature here and a
        14-day trial (no credit card) invite link from Settings.
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={sectionCardStyle}>
      <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 6 }}>
        Settings (everything editable)
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 11 }}>App name</div>
          <input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Company name</div>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <div style={{ fontSize: 11 }}>Subtitle</div>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            style={inputStyle()}
          />
        </div>
      </div>
      <button style={pillButton(true)} onClick={handleSaveSettings}>
        Save settings
      </button>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 4 }}>
          Invite / Demo (future)
        </div>
        <div style={{ fontSize: 11 }}>
          Later you can add a &quot;Send invite&quot; link here for the live
          version with zero properties, 14-day trial, no credit card needed.
        </div>
      </div>
    </div>
  );

  const renderHomeOffice = () => (
    <div style={sectionCardStyle}>
      <div style={{ fontSize: 13, color: NEON_GREEN, marginBottom: 6 }}>
        Home office (future)
      </div>
      <div style={{ fontSize: 11 }}>
        You can track square footage, business-use percentage, and home office
        expenses here later.
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={logoCircleStyle}>
            $
          </div>
          <div style={topTitleStyle}>
            <div style={{ fontSize: 16, fontWeight: 700, color: NEON_GREEN }}>
              {state.appName}
            </div>
            <div style={{ fontSize: 11 }}>{state.subtitle}</div>
          </div>
        </div>
        <div style={topButtonsStyle}>
          <button style={pillButton(false)}>Demo</button>
          <button style={pillButton(true)}>Live</button>
          <button style={pillButton(false)}>Save</button>
        </div>
      </header>

      <main style={mainStyle}>
        {tab === 'dashboard' && renderDashboard()}
        {tab === 'properties' && renderProperties()}
        {tab === 'rentLedger' && renderRentLedger()}
        {tab === 'expenses' && renderExpenses()}
        {tab === 'reports' && renderReports()}
        {tab === 'settings' && renderSettings()}
        {tab === 'homeOffice' && renderHomeOffice()}
      </main>

      <div style={bottomNavStyle}>
        {tabButton('dashboard', 'Home')}
        {tabButton('properties', 'Properties')}
        {tabButton('rentLedger', 'Rent Ledger')}
        {tabButton('expenses', 'Expenses')}
        {tabButton('reports', 'Reports')}
        {tabButton('settings', 'Settings')}
      </div>
    </div>
  );
}
