"use client"
import { useEffect } from 'react'

const appHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TaxSavvy – Tax Manager</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<style>
:root{
  --navy:#0f1629;
  --green:#4cff34;
  --bg:#f5f2ec;
  --paper:#ffffff;
  --text:#0f1629;
  --muted:#64748b;
  --border:#dde3ea;
  --border-soft:#cbd5e1;
  --yellow:#ffcc00;
  --red:#e53935;
  --green-dark:#43a047;
  --shadow:0 8px 30px rgba(15,22,41,.08);
  --radius:18px;
  --radius-sm:12px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing:antialiased;
  line-height:1.5;
  padding-bottom: 74px;
}
a{color:#2563eb}
input,select,textarea,button{font:inherit}
input[type="text"], input[type="number"], input[type="date"], input[type="email"], select, textarea{
  width:100%;
  background:#fff;
  border:1.5px solid var(--border-soft);
  border-radius:12px;
  padding:12px 13px;
  color:var(--text);
  outline:none;
  transition:border .15s;
}
input:focus, select:focus, textarea:focus{border-color:#8b9db0; box-shadow:0 0 0 3px rgba(15,22,41,.07)}
textarea{min-height:112px;resize:vertical}

/* Demo banner */
#demoBanner{
  background:#4cff34;
  color:#0f1629;
  text-align:center;
  padding:9px 14px;
  font-weight:700;
  font-size:13.5px;
  position:sticky;
  top:0;
  z-index:1100;
  line-height:1.35;
}
#demoBanner button{
  background:transparent;border:none;text-decoration:underline;font-weight:800;cursor:pointer;color:inherit;
}

/* Header */
#appHeader{
  position:sticky;
  top:0;
  background:#0f1629;
  color:#fff;
  padding:12px 16px;
  z-index:1000;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
  box-shadow:0 2px 18px rgba(0,0,0,.18);
}
.brand-left{display:flex;align-items:center;min-width:0;flex:1 1 auto}
.brand-left h1{color:#fff;margin:0 0 0 10px;font-size:20px;font-weight:800;white-space:nowrap;outline:none}
.brand-tag{color:#8aa0b8;margin-left:8px;outline:none}
.header-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.pill-badge{
  background:#4cff34;color:#0f1629;padding:5px 11px;border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap;
}
.pill-badge.live{background:#ffcc00}
.btn{
  border:none;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer;transition:transform .05s,opacity .15s;white-space:nowrap;
}
.btn:active{transform:translateY(1px)}
.btn-navy{background:#18233d;color:#fff}
.btn-white{background:#ffffff;color:#0f1629;border:1px solid #d6dde6}
.btn-green{background:#4cff34;color:#0f1629}
.btn-ghost{background:transparent;color:#64748b;border:1px solid var(--border-soft)}
.btn-sm{padding:8px 12px;font-size:13px;border-radius:9px}
#saveStatus{color:#8aa0b8;font-size:12px;min-width:92px}

/* Top nav */
#topNav{
  position:sticky;
  top:64px;
  z-index:999;
  background:#f5f2ec;
  border-bottom:1px solid var(--border);
  padding:10px 16px;
  overflow-x:auto;
  white-space:nowrap;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
}
#topNav::-webkit-scrollbar{display:none}
.nav-btn{
  color:#0f1629 !important;
  background:#ffffff !important;
  border:1px solid #cbd5e1 !important;
  border-radius:999px;
  padding:10px 16px;
  font-weight:600;
  cursor:pointer;
  margin-right:8px;
  font-size:14px;
  transition:.15s;
}
.nav-btn:hover{background:#f7f7f7 !important}
.nav-btn.active{
  background:#4cff34 !important;
  color:#0f1629 !important;
  font-weight:700 !important;
  box-shadow:0 2px 10px rgba(76,255,52,0.28) !important;
  border-color:#32d91f !important;
}

/* Layout */
main{max-width:1100px;margin:0 auto;padding:26px 18px 40px}
.page-title{font-size:28px;font-weight:800;margin:4px 0 16px;letter-spacing:-.015em}
.section-label{color:var(--muted);font-size:13px;margin-bottom:6px}
.card{
  background:var(--paper);
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:18px 18px;
  box-shadow:var(--shadow);
}
.card-sm{padding:14px 15px;border-radius:14px}
.grid{display:grid;gap:16px}
.grid-2{grid-template-columns:repeat(2,1fr)}
.grid-3{grid-template-columns:repeat(2,1fr)}
.grid-4{grid-template-columns:repeat(4,1fr)}
.kpi{
  background:#0f1629;
  color:#fff;
  border-radius:20px;
  padding:22px 20px;
  min-height:118px;
}
.kpi .k{color:#4cff34;font-size:12.5px;font-weight:800;letter-spacing:.04em}
.kpi .v{font-size:30px;font-weight:800;margin-top:10px}
.kpi .sub{color:#8aa0b8;font-size:12.5px;margin-top:4px}
.muted{color:var(--muted)}
.small{font-size:13px}
hr.sep{border:none;border-top:1px solid var(--border);margin:14px 0}

/* Property cards */
.prop-grid{display:grid;gap:16px;grid-template-columns:repeat(2,1fr)}
.prop-card{background:#fff;border:1px solid var(--border);border-radius:18px;padding:16px 16px;box-shadow:var(--shadow)}
.prop-card .addr{font-weight:800;font-size:17px;outline:none;min-height:24px}
.prop-card .entity{color:#64748b;font-size:13px;margin-top:2px;outline:none}
.prop-meta{display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:14px}
.prop-meta b{font-weight:700}
.editable{outline:none;border-radius:6px;padding:2px 4px}
.editable:focus{background:#f3f6ef;box-shadow:0 0 0 2px rgba(76,255,52,.45)}
[contenteditable="true"]:hover{background:rgba(76,255,52,.06)}

/* Tables */
.table-wrap{overflow-x:auto;background:#fff;border:1px solid var(--border);border-radius:16px}
table{width:100%;border-collapse:collapse;min-width:640px}
th,td{padding:12px 14px;text-align:left;border-bottom:1px solid #e9edf2;font-size:14px;vertical-align:top}
th{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#64748b;background:#faf7f1}
tr:last-child td{border-bottom:none}

/* Forms */
.form-row{display:grid;gap:12px}
.form-row.cols-2{grid-template-columns:1fr 1fr}
.form-row.cols-3{grid-template-columns:1fr 1fr 1fr}
label.field-label{display:block;font-size:12px;color:#475569;font-weight:700;margin-bottom:6px}

/* Lists */
.item-list{display:flex;flex-direction:column;gap:10px}
.list-item{background:#fff;border:1px solid var(--border);border-radius:14px;padding:12px 14px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.list-item .li-main{flex:1;min-width:0}
.badge{font-size:11.5px;background:#eef2f6;border-radius:999px;padding:3px 9px;color:#334155;font-weight:600}

/* Report area */
.report-box{background:#fff;border:1px solid var(--border);border-radius:16px;padding:18px;min-height:160px}
.report-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.report-footer{margin-top:16px;padding-top:14px;border-top:1px solid #dde3ea;font-size:12px;color:#64748b;display:flex;flex-wrap:wrap;gap:10px;align-items:center}

/* Helpers */
.flex{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.right{margin-left:auto}
.hidden{display:none !important}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.chip{background:#fff;border:1px solid var(--border-soft);border-radius:999px;padding:7px 12px;font-size:13px}

/* Bottom nav mobile */
.bottom-nav{
  position:fixed;bottom:0;left:0;right:0;background:#ffffff;border-top:1px solid #dde3ea;z-index:1000;display:flex;justify-content:space-around;padding:7px 4px 9px;
}
.bottom-nav button{
  color:#0f1629;background:transparent;border:none;padding:8px 10px;font-size:11.5px;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:64px;border-radius:10px;cursor:pointer;
}
.bottom-nav button.active{background:#4cff34;color:#0f1629;font-weight:700}
.bottom-nav .ico{font-size:18px;line-height:1}

/* Toast */
#toast{
  position:fixed;right:16px;bottom:84px;background:#0f1629;color:#fff;padding:11px 14px;border-radius:12px;font-weight:700;box-shadow:0 12px 30px rgba(0,0,0,.22);opacity:0;transform:translateY(8px);pointer-events:none;transition:.2s;z-index:2000;
}
#toast.show{opacity:1;transform:translateY(0)}

/* Responsive */
@media (min-width:900px){
  .grid-3{grid-template-columns:repeat(3,1fr)}
  .grid-4{grid-template-columns:repeat(4,1fr)}
  .prop-grid{grid-template-columns:repeat(3,1fr)}
}
@media (max-width:768px){
  .grid-2,.grid-3,.grid-4,.form-row.cols-2,.form-row.cols-3{grid-template-columns:1fr}
  .prop-grid{grid-template-columns:1fr}
  .page-title{font-size:24px}
  .kpi .v{font-size:26px}
  main{padding:18px 14px 30px}
  .header-right{width:100%;justify-content:flex-start}
  #appHeader{align-items:flex-start}
}
@media (min-width:769px){
  .bottom-nav{display:none}
  body{padding-bottom:0}
  #toast{bottom:22px}
}

/* Utilities */
.mt-8{margin-top:8px}.mt-12{margin-top:12px}.mt-16{margin-top:16px}.mt-24{margin-top:24px}
.mb-8{margin-bottom:8px}
.w-full{width:100%}
</style>
</head>
<body>

<div id="demoBanner">
  Demo Mode – 14-day free trial – No credit card required – <button type="button" onclick="showSignup()">Sign up later</button>
</div>

<header id="appHeader">
  <div class="brand-left">
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style="flex:0 0 auto"><circle cx="20" cy="20" r="20" fill="#e53935"/><path d="M0 0h20v40H0z" fill="#43a047" opacity="0.95"/><text x="20" y="27" text-anchor="middle" fill="#fff" font-size="22" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">$</text></svg>
    <h1 contenteditable="true" id="appName" spellcheck="false">TaxSavvy</h1>
    <span contenteditable="true" id="appTagline" class="brand-tag">Tax Manager</span>
  </div>
  <div class="header-right">
    <span id="modeBadge" class="pill-badge">DEMO</span>
    <button id="modeToggleBtn" onclick="toggleMode()" class="btn btn-white btn-sm">My Account / Sign in</button>
    <button onclick="saveNow()" class="btn btn-green btn-sm">Save</button>
    <span id="saveStatus"></span>
  </div>
</header>

<nav id="topNav" aria-label="Primary">
  <button class="nav-btn active" data-tab="dashboard">Dashboard</button>
  <button class="nav-btn" data-tab="properties">Properties</button>
  <button class="nav-btn" data-tab="rent">Rent Ledger</button>
  <button class="nav-btn" data-tab="expenses">Expenses</button>
  <button class="nav-btn" data-tab="scanner">Receipt Scanner</button>
  <button class="nav-btn" data-tab="homeoffice">Home Office</button>
  <button class="nav-btn" data-tab="officiating">Officiating</button>
  <button class="nav-btn" data-tab="reports">Reports</button>
  <button class="nav-btn" data-tab="ai">AI Assistant</button>
  <button class="nav-btn" data-tab="upgrade">Upgrade</button>
  <button class="nav-btn" data-tab="settings">Settings</button>
</nav>

<main id="mainContent">
  <!-- Dashboard -->
  <section id="tab-dashboard">
    <h2 class="page-title">Dashboard</h2>
    <div class="grid grid-4" id="kpiGrid">
      <div class="kpi"><div class="k">TOTAL MONTHLY RENT</div><div class="v" id="kpiMonthly">$0</div><div class="sub" id="kpiMonthlySub">4 rental units</div></div>
      <div class="kpi"><div class="k">YTD COLLECTED</div><div class="v" id="kpiCollected">$0</div><div class="sub">2026</div></div>
      <div class="kpi"><div class="k">OUTSTANDING</div><div class="v" id="kpiOutstanding">$0</div><div class="sub">This month</div></div>
      <div class="kpi"><div class="k">EXPENSE YTD</div><div class="v" id="kpiExpense">$0</div><div class="sub">All properties</div></div>
    </div>

    <div class="grid grid-2 mt-24">
      <div class="card">
        <div style="font-weight:800;font-size:17px;margin-bottom:8px">Recent Rent</div>
        <div id="dashRentList" class="small muted">No rent recorded yet.</div>
      </div>
      <div class="card">
        <div style="font-weight:800;font-size:17px;margin-bottom:8px">Recent Expenses</div>
        <div id="dashExpenseList" class="small muted">No expenses yet.</div>
      </div>
    </div>
  </section>

  <!-- Properties -->
  <section id="tab-properties" hidden>
    <div class="flex" style="align-items:flex-end; margin-bottom:12px; gap:14px">
      <h2 class="page-title" style="margin:0">Properties</h2>
      <button class="btn btn-green btn-sm" onclick="addProperty()">+ Add Property</button>
    </div>
    <div class="card card-sm mb-8">
      <label style="display:flex;align-items:center;gap:10px;font-weight:600;cursor:pointer">
        <input type="checkbox" id="showPersonalToggle" style="width:18px;height:18px">
        <span>Show personal residence in reports</span>
      </label>
      <div class="small muted mt-8">When off, your personal property is hidden from Rent Ledger and Reports. Expenses still track.</div>
    </div>
    <div id="propertiesGrid" class="prop-grid mt-12"></div>
  </section>

  <!-- Rent Ledger -->
  <section id="tab-rent" hidden>
    <h2 class="page-title">Rent Ledger</h2>
    <div class="toolbar">
      <button class="btn btn-white btn-sm" onclick="copyRentCsv()">Copy CSV</button>
      <button class="btn btn-white btn-sm" onclick="exportJson()">Export JSON</button>
      <span class="chip" id="rentLedgerNote"></span>
    </div>
    <div class="card mb-8">
      <div style="font-weight:700;margin-bottom:8px">Add Rent Payment</div>
      <div class="form-row cols-3">
        <div><label class="field-label">Property</label><select id="rentProp"></select></div>
        <div><label class="field-label">Date</label><input type="date" id="rentDate"></div>
        <div><label class="field-label">Amount</label><input type="number" id="rentAmount" step="0.01" placeholder="0.00"></div>
        <div><label class="field-label">Tenant</label><input type="text" id="rentTenant" placeholder="Tenant name"></div>
        <div><label class="field-label">Method</label><select id="rentMethod"><option>ACH</option><option>Check</option><option>Cash</option><option>Zelle</option><option>Venmo</option></select></div>
        <div><label class="field-label">&nbsp;</label><button class="btn btn-green w-full" onclick="addRent()">Save Rent</button></div>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Date</th><th>Property</th><th>Tenant</th><th>Amount</th><th>Method</th><th></th></tr></thead>
        <tbody id="rentTbody"></tbody>
      </table>
    </div>
  </section>

  <!-- Expenses -->
  <section id="tab-expenses" hidden>
    <h2 class="page-title">Expenses</h2>
    <div class="toolbar">
      <select id="expenseFilterProp" onchange="renderExpenses()" style="max-width:260px">
        <option value="all">All properties</option>
      </select>
      <input id="expenseSearch" placeholder="Search vendor / notes" oninput="renderExpenses()" style="max-width:260px">
    </div>
    <div id="expensesList" class="item-list"></div>
  </section>

  <!-- Receipt Scanner -->
  <section id="tab-scanner" hidden>
    <h2 class="page-title">Receipt Scanner</h2>
    <div class="grid grid-2">
      <div class="card">
        <label class="field-label">Attach receipt image</label>
        <input type="file" accept="image/*" id="receiptFile">
        <div class="small muted mt-8">Image is not uploaded – fields are entered manually for your records.</div>
        <div class="form-row cols-2 mt-16">
          <div><label class="field-label">Date</label><input type="date" id="scanDate"></div>
          <div><label class="field-label">Amount</label><input type="number" id="scanAmount" step="0.01" placeholder="0.00"></div>
        </div>
        <div class="mt-12"><label class="field-label">Vendor</label><input type="text" id="scanVendor" placeholder="Vendor name"></div>
        <div class="mt-12"><label class="field-label">Property</label><select id="scanProperty"></select></div>
        <div class="mt-12"><label class="field-label">Category</label>
          <select id="scanCategory">
            <option>Repairs</option><option>Maintenance</option><option>Utilities</option><option>Insurance</option><option>Supplies</option><option>Landscaping</option><option>Management</option><option>Other</option>
          </select>
        </div>
        <div class="mt-12"><label class="field-label">Notes</label><input type="text" id="scanNotes" placeholder="Optional"></div>
        <button class="btn btn-green mt-16 w-full" onclick="saveScannedExpense()">Save Expense</button>
      </div>
      <div class="card">
        <div style="font-weight:800;margin-bottom:8px">Recent Expenses</div>
        <div id="scannerExpenseList" class="small"></div>
      </div>
    </div>
  </section>

  <!-- Home Office -->
  <section id="tab-homeoffice" hidden>
    <h2 class="page-title">Home Office</h2>
    <div class="card" style="max-width:720px">
      <div class="form-row cols-3">
        <div><label class="field-label">Office Sq Ft</label><input type="number" id="hoSqft" placeholder="e.g. 180"></div>
        <div><label class="field-label">Total Home Sq Ft</label><input type="number" id="hoTotal" placeholder="e.g. 1800"></div>
        <div><label class="field-label">Utilities % override</label><input type="number" id="hoUtilPct" placeholder="Auto" min="0" max="100"></div>
      </div>
      <div class="form-row cols-3 mt-12">
        <div><label class="field-label">Monthly Utilities $</label><input type="number" id="hoUtilAmt" step="0.01" placeholder="0.00"></div>
        <div><label class="field-label">Annual Rent / Mortgage Interest</label><input type="number" id="hoRent" step="0.01"></div>
        <div><label class="field-label">&nbsp;</label><button class="btn btn-green w-full" onclick="saveHomeOffice()">Save</button></div>
      </div>
      <div id="hoResult" class="mt-16" style="background:#f6f4ef;border-radius:12px;padding:14px;font-weight:700"></div>
      <div class="small muted mt-8">Home office deduction is estimated. Consult your tax professional.</div>
    </div>
  </section>

  <!-- Officiating -->
  <section id="tab-officiating" hidden>
    <h2 class="page-title">Officiating</h2>
    <div class="grid grid-2">
      <div class="card">
        <div style="font-weight:800;margin-bottom:10px">Add Game</div>
        <div class="form-row cols-2">
          <div><label class="field-label">Date</label><input type="date" id="offDate"></div>
          <div><label class="field-label">Sport</label>
            <select id="offSport"><option>Basketball – Boys</option><option>Basketball – Girls</option><option>Basketball – Men's</option><option>Basketball – Women's</option><option>Other</option></select>
          </div>
          <div><label class="field-label">Fee $</label><input type="number" id="offFee" step="0.01"></div>
          <div><label class="field-label">Miles</label><input type="number" id="offMiles" step="0.1"></div>
        </div>
        <div class="mt-12"><label class="field-label">Association / School</label><input type="text" id="offAssoc" placeholder="Association"></div>
        <button class="btn btn-green mt-12 w-full" onclick="addOfficiating()">Save Game</button>
      </div>
      <div class="card">
        <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:800">Games</div>
          <button class="btn btn-white btn-sm" onclick="exportOfficiatingCsv()">Export CSV</button>
        </div>
        <div class="table-wrap">
          <table><thead><tr><th>Date</th><th>Sport</th><th>Fee</th><th>Miles</th><th>Assoc.</th><th></th></tr></thead><tbody id="offTbody"></tbody></table>
        </div>
      </div>
    </div>
  </section>

  <!-- Reports -->
  <section id="tab-reports" hidden>
    <h2 class="page-title">Reports</h2>
    <div class="toolbar">
      <button class="btn btn-white btn-sm" onclick="runReport('pl')">P&L</button>
      <button class="btn btn-white btn-sm" onclick="runReport('schedulee')">Schedule E</button>
      <button class="btn btn-white btn-sm" onclick="runReport('rentroll')">Rent Roll</button>
      <button class="btn btn-white btn-sm" onclick="runReport('mileage')">Mileage Report</button>
    </div>
    <div class="report-box" id="reportOutput">
      <div class="muted">Choose a report to generate.</div>
    </div>
    <div class="report-actions">
      <button class="btn btn-white btn-sm" onclick="emailReport('accountant')">Email to Accountant</button>
      <button class="btn btn-white btn-sm" onclick="emailReport('me')">Email to Me</button>
      <button class="btn btn-white btn-sm" onclick="emailReport('custom')">Custom Email</button>
      <span style="flex:1"></span>
      <button class="btn btn-ghost btn-sm" onclick="exportReport('qb')">Export QuickBooks CSV</button>
      <button class="btn btn-ghost btn-sm" onclick="exportReport('excel')">Export Excel</button>
      <button class="btn btn-ghost btn-sm" onclick="exportReport('gsheets')">Export Google Sheets CSV</button>
      <button class="btn btn-ghost btn-sm" onclick="copyReport()">Copy Report</button>
      <button class="btn btn-ghost btn-sm" onclick="downloadReportHtml()">Download HTML</button>
    </div>
    <div class="report-footer">
      <span style="display:inline-flex;align-items:center;gap:7px">
        <svg width="20" height="20" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#e53935"/><path d="M0 0h20v40H0z" fill="#43a047" opacity="0.95"/><text x="20" y="27" text-anchor="middle" fill="#fff" font-size="22" font-weight="700" font-family="system-ui, sans-serif">$</text></svg>
        Report generated by TaxSavvy
      </span>
      <span id="reportModeTag"></span>
      <span>– <span id="reportDate"></span></span>
    </div>
  </section>

  <!-- AI Assistant -->
  <section id="tab-ai" hidden>
    <h2 class="page-title">AI Assistant</h2>
    <div class="card" style="max-width:780px">
      <label class="field-label">Ask about taxes…</label>
      <textarea id="aiQuery" placeholder="e.g. Can I deduct mileage between my rental properties?"></textarea>
      <div class="flex mt-12">
        <button class="btn btn-green" onclick="askAi()">Ask</button>
        <button class="btn btn-white" onclick="saveAiNote()">Save Note</button>
        <span class="muted small">Responses are informational, not tax advice.</span>
      </div>
      <div id="aiAnswer" class="mt-16" style="background:#f6f4ef;border-radius:12px;padding:14px;min-height:64px"></div>
      <div class="mt-16">
        <div style="font-weight:700;margin-bottom:6px">Saved Notes</div>
        <div id="aiNotesList" class="small muted">No notes yet.</div>
      </div>
    </div>
  </section>

  <!-- Upgrade -->
  <section id="tab-upgrade" hidden>
    <h2 class="page-title">Upgrade – TaxSavvy Pro</h2>
    <div class="card" style="max-width:760px">
      <p class="muted">Unlock unlimited properties, automated bank import, CPA-ready exports, and priority support.</p>
      <div class="grid grid-3 mt-16">
        <button class="btn btn-navy w-full" onclick="mockPay('Stripe')">Stripe</button>
        <button class="btn btn-white w-full" onclick="mockPay('PayPal')">PayPal</button>
        <button class="btn btn-white w-full" onclick="mockPay('Venmo')">Venmo</button>
        <button class="btn btn-white w-full" onclick="mockPay('Cash App')">Cash App</button>
        <button class="btn btn-white w-full" onclick="mockPay('Zelle')">Zelle</button>
        <button class="btn btn-white w-full" onclick="mockPay('ACH')">ACH</button>
      </div>
      <p class="small muted mt-16">Demo Mode – payments are placeholders. In Live mode, connect your processor in Settings.</p>
    </div>
  </section>

  <!-- Settings -->
  <section id="tab-settings" hidden>
    <h2 class="page-title">Settings</h2>
    <div class="grid grid-2">
      <div class="card">
        <div style="font-weight:800;margin-bottom:8px">Entities</div>
        <div id="businessesEditor" class="item-list"></div>
        <div class="flex mt-12">
          <input type="text" id="newBusinessName" placeholder="Add business / entity" style="flex:1">
          <button class="btn btn-green btn-sm" onclick="addBusiness()">Add</button>
        </div>
        <div class="small muted mt-8">Click any entity name to edit inline. Changes auto-save.</div>
        <hr class="sep">
        <div style="font-weight:700;margin-bottom:6px">App Name</div>
        <input type="text" id="settingsAppName" oninput="syncAppName(this.value)">
        <p class="small muted mt-8">The app name in the header is editable there too.</p>
        <hr class="sep">
        <div id="pinSettingsWrap" class="hidden">
          <div style="font-weight:700;margin-bottom:6px">Privacy PIN</div>
          <button class="btn btn-white btn-sm" onclick="changePin()">Change PIN</button>
          <p class="small muted mt-8">Live mode data is protected by your PIN on this device.</p>
          <hr class="sep">
        </div>
        <div class="flex">
          <button class="btn btn-green" onclick="saveNow()">Save All</button>
          <button class="btn btn-white" onclick="exportJson()">Export JSON</button>
          <label class="btn btn-white" style="cursor:pointer">Import JSON
            <input type="file" id="importFile" accept="application/json" hidden onchange="importJsonFile(event)">
          </label>
        </div>
      </div>
      <div class="card">
        <div style="font-weight:800;margin-bottom:8px">Terms & Cancellation</div>
        <p style="font-size:14px;line-height:1.65;color:#334155">
          TaxSavvy Tax Manager is provided as-is for record keeping. You may export your data at any time. To cancel your subscription at any time, <a href="#" onclick="alert('Cancellation requested – demo');return false" style="color:#1d4ed8;text-decoration:underline">click here to cancel</a>. Cancellations take effect at end of billing period. Report archives remain accessible with "Report generated by TaxSavvy" attribution.
        </p>
        <hr class="sep">
        <div class="small muted">
          Dividend recipient (editable): <span id="dividendRecipient" class="editable" contenteditable="true" style="font-weight:600;color:#0f1629"></span>
        </div>
        <hr class="sep">
        <div class="small muted">
          TaxSavvy v22 – <span id="footerMode">Demo Mode</span> – Tax Manager – © 2026 – Terms
        </div>
      </div>
    </div>
  </section>
</main>

<!-- Mobile bottom nav -->
<nav class="bottom-nav" aria-label="Mobile">
  <button data-tab="dashboard" class="active" onclick="navigate('dashboard')"><span class="ico">🏠</span>Home</button>
  <button data-tab="rent" onclick="navigate('rent')"><span class="ico">📒</span>Ledger</button>
  <button data-tab="expenses" onclick="navigate('expenses')"><span class="ico">🧾</span>Expenses</button>
  <button data-tab="reports" onclick="navigate('reports')"><span class="ico">📊</span>Reports</button>
  <button data-tab="settings" onclick="navigate('settings')"><span class="ico">⚙️</span>Settings</button>
</nav>

<div id="toast" role="status" aria-live="polite"></div>

<script>
/* ---------- Data Seeds ---------- */
const DEMO_SEED = {
  appName: "TaxSavvy",
  showPersonalInReports: false,
  properties: [
    {id:1, address:"123 Main St, Anytown, USA", entity:"Personal", rent:0, tenant:"", is_personal:true},
    {id:2, address:"456 Oak Ave, Anytown, USA", entity:"Sample Rentals LLC", rent:1500, tenant:"", is_personal:false},
    {id:3, address:"789 Pine Rd Unit A", entity:"Sample Rentals LLC", rent:1350, tenant:"", is_personal:false},
    {id:4, address:"789 Pine Rd Unit B", entity:"Sample Rentals LLC", rent:1100, tenant:"", is_personal:false},
    {id:5, address:"321 Elm St", entity:"Demo Owner", rent:1650, tenant:"", is_personal:false}
  ],
  businesses: [
    {name:"Freelance Consulting", type:"1099", hq:"123 Main St"},
    {name:"Sample Properties Inc", hq:"123 Main St"}
  ],
  dividend_recipient: "Jane Demo, President",
  expenses: [
    {id:101, date:"2026-01-05", vendor:"Lowe's", amount:245.00, propertyId:2, category:"Repairs", notes:"Kitchen faucet"},
    {id:102, date:"2026-01-12", vendor:"NYSEG", amount:132.40, propertyId:3, category:"Utilities", notes:""},
    {id:103, date:"2026-02-02", vendor:"Ace Hardware", amount:68.90, propertyId:4, category:"Supplies", notes:""}
  ],
  rents: [
    {id:201, propertyId:2, date:"2026-01-01", amount:1500, tenant:"R. Tenant", method:"ACH"},
    {id:202, propertyId:3, date:"2026-01-03", amount:1350, tenant:"A. Renter", method:"Check"}
  ],
  mileage: [
    {id:301, date:"2026-01-10", miles:22, purpose:"Property visit", propertyId:2}
  ],
  officiating: [],
  homeOffice: {sqft:"180", totalSqft:"1800", utilPct:"", utilAmt:"210", rentAnnual:""},
  aiNotes: []
};

const LIVE_SEED = {
  appName: "TaxSavvy",
  showPersonalInReports: false,
  properties: [
    {id:1, address:"118 Daffodil Drive, Horseheads, NY", entity:"Personal", rent:0, tenant:"", is_personal:true},
    {id:2, address:"114 Orchard St, Horseheads, NY", entity:"Cronin NY Property Management LLC", rent:1405, tenant:"", is_personal:false},
    {id:3, address:"220 Elmwood Ave Unit A, Elmira Heights, NY", entity:"Cronin NY Property Management LLC", rent:1400, tenant:"", is_personal:false},
    {id:4, address:"220 Elmwood Ave Unit B, Elmira Heights, NY", entity:"Cronin NY Property Management LLC", rent:1100, tenant:"", is_personal:false},
    {id:5, address:"146 W. Fourth Street, Corning, NY", entity:"Mark & Tammi Cronin", rent:1700, tenant:"", is_personal:false}
  ],
  businesses: [
    {name:"Basketball Officiating", type:"1099", hq:"118 Daffodil Drive"},
    {name:"MCMC Properties Inc", hq:"118 Daffodil Drive"}
  ],
  dividend_recipient: "Mark Cronin, Vice President",
  expenses: [],
  rents: [],
  mileage: [],
  officiating: [],
  homeOffice: {sqft:"", totalSqft:"", utilPct:"", utilAmt:"", rentAnnual:""},
  aiNotes: []
};

/* ---------- Mode / State ---------- */
let mode = localStorage.getItem('taxsavvy_mode') || 'demo';
let state = null;
let saveTimer = null;
let currentReportHtml = '';
let currentReportText = '';

function storeKey(){ return mode === 'demo' ? 'taxsavvy_v22_demo' : 'taxsavvy_v22_live'; }

function loadState(){
  const raw = localStorage.getItem(storeKey());
  if(raw){ try{ return JSON.parse(raw); }catch(e){} }
  return JSON.parse(JSON.stringify(mode === 'demo' ? DEMO_SEED : LIVE_SEED));
}

function saveState(immediate=false){
  clearTimeout(saveTimer);
  const doSave = ()=>{
    localStorage.setItem(storeKey(), JSON.stringify(state));
    const s = document.getElementById('saveStatus');
    s.textContent = 'Auto-saved ✓';
    setTimeout(()=>{ s.textContent=''; }, 2000);
  };
  if(immediate) doSave();
  else saveTimer = setTimeout(doSave, 800);
}

function saveNow(){
  localStorage.setItem(storeKey(), JSON.stringify(state));
  showToast('Saved');
  const s = document.getElementById('saveStatus');
  s.textContent='Saved ✓';
  setTimeout(()=>{ s.textContent=''; }, 1800);
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 2100);
}

/* PIN */
function hashPin(pin){
  let h=0; for(let i=0;i<pin.length;i++){ h = ((h<<5)-h) + pin.charCodeAt(i); h |= 0; }
  return 'h'+h;
}
function verifyPin(pin){
  return hashPin(pin) === localStorage.getItem('taxsavvy_pin_hash');
}

/* Mode toggle */
function toggleMode(){
  saveState(true);
  if(mode === 'demo'){
    const existing = localStorage.getItem('taxsavvy_pin_hash');
    if(!existing){
      const np = prompt('Set a 4-digit PIN to protect your private data');
      if(!np){ showToast('PIN required to enter Live mode'); return; }
      localStorage.setItem('taxsavvy_pin_hash', hashPin(np));
    } else {
      const ep = prompt('Enter PIN to access Live – Private data');
      if(!ep || !verifyPin(ep)){ alert('Incorrect PIN'); return; }
    }
    mode = 'live';
    localStorage.setItem('taxsavvy_mode', 'live');
  } else {
    mode = 'demo';
    localStorage.setItem('taxsavvy_mode', 'demo');
  }
  boot();
  showToast(mode === 'live' ? 'Live – Private' : 'Demo Mode');
}

function updateModeChrome(){
  const badge = document.getElementById('modeBadge');
  const banner = document.getElementById('demoBanner');
  const footerMode = document.getElementById('footerMode');
  const pinWrap = document.getElementById('pinSettingsWrap');
  if(mode === 'demo'){
    badge.textContent='DEMO'; badge.classList.remove('live');
    banner.style.display='';
    if(footerMode) footerMode.textContent='Demo Mode';
    if(pinWrap) pinWrap.classList.add('hidden');
  } else {
    badge.textContent='LIVE – Private'; badge.classList.add('live');
    banner.style.display='none';
    if(footerMode) footerMode.textContent='Live – Private';
    if(pinWrap) pinWrap.classList.remove('hidden');
  }
  const reportModeTag = document.getElementById('reportModeTag');
  if(reportModeTag){
    reportModeTag.textContent = mode==='demo' ? ' – SAMPLE DEMO – not for filing' : '';
  }
  updateStickyOffsets();
}

function updateStickyOffsets(){
  const banner = document.getElementById('demoBanner');
  const header = document.getElementById('appHeader');
  const nav = document.getElementById('topNav');
  const bannerVisible = banner && banner.style.display !== 'none';
  const bannerH = bannerVisible ? banner.offsetHeight : 0;
  header.style.top = bannerH + 'px';
  nav.style.top = (bannerH + header.offsetHeight) + 'px';
}

/* ---------- Navigation ---------- */
function navigate(tab){
  document.querySelectorAll('main section[id^="tab-"]').forEach(s=>s.hidden=true);
  const el = document.getElementById('tab-'+tab);
  if(el) el.hidden = false;
  document.querySelectorAll('#topNav .nav-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  document.querySelectorAll('.bottom-nav button').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  window.scrollTo({top:0, behavior:'auto'});
  // re-render tab specific
  if(tab==='dashboard') renderDashboard();
  if(tab==='properties') renderProperties();
  if(tab==='rent') renderRent();
  if(tab==='expenses') renderExpenses();
  if(tab==='scanner') renderScanner();
  if(tab==='officiating') renderOfficiating();
  if(tab==='settings') renderSettings();
}

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('#topNav .nav-btn');
  if(btn) navigate(btn.dataset.tab);
});

/* ---------- Helpers ---------- */
const fmt = n => '$' + Number(n||0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
const propById = id => state.properties.find(p=>p.id===id);
const visibleProps = () => state.showPersonalInReports ? state.properties : state.properties.filter(p=>!p.is_personal);

/* ---------- Renderers ---------- */
function renderDashboard(){
  const rentals = state.properties.filter(p=>!p.is_personal);
  const monthly = rentals.reduce((s,p)=>s+Number(p.rent||0),0);
  const collected = state.rents.reduce((s,r)=>s+Number(r.amount||0),0);
  const now = new Date();
  const thisMonth = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  const collectedMonth = state.rents.filter(r=> (r.date||'').startsWith(thisMonth)).reduce((s,r)=>s+Number(r.amount||0),0);
  const outstanding = Math.max(0, monthly - collectedMonth);
  const expenseYtd = state.expenses.reduce((s,e)=>s+Number(e.amount||0),0);
  document.getElementById('kpiMonthly').textContent = fmt(monthly);
  document.getElementById('kpiCollected').textContent = fmt(collected);
  document.getElementById('kpiOutstanding').textContent = fmt(outstanding);
  document.getElementById('kpiExpense').textContent = fmt(expenseYtd);
  document.getElementById('kpiMonthlySub').textContent = rentals.length + ' rental unit' + (rentals.length!==1?'s':'');
  const rList = document.getElementById('dashRentList');
  if(state.rents.length){
    rList.innerHTML = state.rents.slice(-3).reverse().map(r=>{
      const p = propById(r.propertyId);
      return \`<div>\${r.date} – \${p ? p.address.split(',')[0] : 'Property'} – <b>\${fmt(r.amount)}</b></div>\`;
    }).join('');
  } else { rList.textContent='No rent recorded yet.'; rList.className='small muted'; }
  const eList = document.getElementById('dashExpenseList');
  if(state.expenses.length){
    eList.innerHTML = state.expenses.slice(-3).reverse().map(e=>{
      return \`<div>\${e.date} – \${e.vendor} – <b>\${fmt(e.amount)}</b></div>\`;
    }).join('');
  } else { eList.textContent='No expenses yet.'; eList.className='small muted'; }
}

function renderProperties(){
  const grid = document.getElementById('propertiesGrid');
  grid.innerHTML = state.properties.map(p=>{
    const isPersonal = !!p.is_personal;
    return \`<div class="prop-card">
      <div class="addr editable" contenteditable="true" oninput="updateProp(\${p.id},'address',this.innerText)">\${esc(p.address)}</div>
      <div class="entity editable" contenteditable="true" oninput="updateProp(\${p.id},'entity',this.innerText)">\${esc(p.entity||'')}</div>
      \${isPersonal ? \`
        <div class="prop-meta muted small" style="margin-top:12px">
          Personal residence – expenses tracked separately.<br>
          Utilities / Home office in Home Office tab.
        </div>
      \` : \`
        <div class="prop-meta">
          <div>Rent: $<span class="editable" contenteditable="true" oninput="updateProp(\${p.id},'rent',this.innerText.replace(/[^0-9.]/g,''))">\${esc(String(p.rent||0))}</span>/mo</div>
          <div>Tenant: <span class="editable" contenteditable="true" oninput="updateProp(\${p.id},'tenant',this.innerText)" style="min-width:90px;display:inline-block">\${esc(p.tenant||'')}</span></div>
        </div>
      \`}
      <div class="flex mt-12">
        <button class="btn btn-ghost btn-sm" onclick="removeProperty(\${p.id})">Delete</button>
      </div>
    </div>\`;
  }).join('');
  document.getElementById('showPersonalToggle').checked = !!state.showPersonalInReports;
}

function updateProp(id, field, value){
  const p = propById(id);
  if(!p) return;
  if(field==='rent') p[field] = Number(value)||0;
  else p[field] = value;
  saveState();
  renderDashboard();
}

function addProperty(){
  const id = Math.max(0,...state.properties.map(p=>p.id))+1;
  state.properties.push({id, address:"New Property", entity:"", rent:0, tenant:"", is_personal:false});
  saveState(true);
  renderProperties();
  renderScanner();
  showToast('Property added');
}
function removeProperty(id){
  if(!confirm('Delete this property?')) return;
  state.properties = state.properties.filter(p=>p.id!==id);
  state.expenses = state.expenses.filter(e=>e.propertyId!==id);
  state.rents = state.rents.filter(r=>r.propertyId!==id);
  saveState(true);
  renderProperties();
  showToast('Deleted');
}

function renderRent(){
  const sel = document.getElementById('rentProp');
  const props = visibleProps();
  sel.innerHTML = props.map(p=>\`<option value="\${p.id}">\${esc(p.address)}</option>\`).join('');
  document.getElementById('rentDate').value = new Date().toISOString().slice(0,10);
  const tbody = document.getElementById('rentTbody');
  const rows = state.rents.slice().reverse().filter(r=>{
    const p = propById(r.propertyId);
    if(!p) return true;
    if(p.is_personal && !state.showPersonalInReports) return false;
    return true;
  });
  if(!rows.length){
    tbody.innerHTML = \`<tr><td colspan="6" class="muted">No rent payments yet.</td></tr>\`;
  } else {
    tbody.innerHTML = rows.map(r=>{
      const p = propById(r.propertyId);
      return \`<tr>
        <td>\${esc(r.date||'')}</td>
        <td>\${p?esc(p.address):''}</td>
        <td contenteditable="true" oninput="updateRent(\${r.id},'tenant',this.innerText)">\${esc(r.tenant||'')}</td>
        <td>\${fmt(r.amount)}</td>
        <td>\${esc(r.method||'')}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="deleteRent(\${r.id})">Delete</button></td>
      </tr>\`;
    }).join('');
  }
  document.getElementById('rentLedgerNote').textContent = state.showPersonalInReports ? 'Personal residence included' : 'Personal residence hidden';
}

function updateRent(id, field, val){
  const r = state.rents.find(x=>x.id===id);
  if(r){ r[field]=val; saveState(); }
}
function addRent(){
  const propertyId = Number(document.getElementById('rentProp').value);
  const date = document.getElementById('rentDate').value;
  const amount = Number(document.getElementById('rentAmount').value);
  const tenant = document.getElementById('rentTenant').value.trim();
  const method = document.getElementById('rentMethod').value;
  if(!propertyId || !date || !amount){ alert('Property, date and amount required'); return; }
  state.rents.push({id:Date.now(), propertyId, date, amount, tenant, method});
  document.getElementById('rentAmount').value=''; document.getElementById('rentTenant').value='';
  saveState(true);
  renderRent(); renderDashboard();
  showToast('Rent saved');
}
function deleteRent(id){
  state.rents = state.rents.filter(r=>r.id!==id);
  saveState(true); renderRent(); renderDashboard();
}
function copyRentCsv(){
  const rows = [['Date','Property','Tenant','Amount','Method']];
  state.rents.forEach(r=>{
    const p = propById(r.propertyId);
    rows.push([r.date, p ? p.address : '', r.tenant||'', r.amount, r.method||'']);
  });
  const csv = rows.map(a=>a.map(v=>\`"\${String(v).replace(/"/g,'""')}"\`).join(',')).join('\\n');
  navigator.clipboard.writeText(csv).then(()=>showToast('CSV copied'), ()=>alert(csv));
}

/* Expenses */
function renderExpenses(){
  const filterSel = document.getElementById('expenseFilterProp');
  if(filterSel && filterSel.options.length <=1){
    state.properties.forEach(p=>{
      const o = document.createElement('option');
      o.value = p.id; o.textContent = p.address;
      filterSel.appendChild(o);
    });
  }
  const fProp = document.getElementById('expenseFilterProp')?.value || 'all';
  const q = (document.getElementById('expenseSearch')?.value || '').toLowerCase();
  let list = state.expenses.slice().reverse();
  if(fProp !== 'all') list = list.filter(e=> String(e.propertyId)===String(fProp));
  if(q) list = list.filter(e=> (e.vendor+' '+(e.notes||'')+' '+(e.category||'')).toLowerCase().includes(q));
  const box = document.getElementById('expensesList');
  if(!list.length){ box.innerHTML = \`<div class="muted small">No expenses found.</div>\`; return; }
  box.innerHTML = list.map(e=>{
    const p = propById(e.propertyId);
    return \`<div class="list-item">
      <div class="li-main">
        <div style="font-weight:700">\${esc(e.vendor||'Vendor')} – \${fmt(e.amount)}</div>
        <div class="small muted">\${esc(e.date||'')} · \${p?esc(p.address):'—'} · <span class="badge">\${esc(e.category||'Other')}</span></div>
        <div class="small" contenteditable="true" oninput="updateExpense(\${e.id},'notes',this.innerText)">\${esc(e.notes||'Add notes…')}</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="deleteExpense(\${e.id})">Delete</button>
    </div>\`;
  }).join('');
}
function updateExpense(id, field, val){
  const ex = state.expenses.find(x=>x.id===id);
  if(ex){ ex[field]=val; saveState(); }
}
function deleteExpense(id){
  if(!confirm('Delete expense?')) return;
  state.expenses = state.expenses.filter(e=>e.id!==id);
  saveState(true); renderExpenses(); renderDashboard(); renderScanner();
}

/* Scanner */
function renderScanner(){
  const sel = document.getElementById('scanProperty');
  if(!sel) return;
  const rentals = state.properties.filter(p=>!p.is_personal);
  sel.innerHTML = state.properties.map(p=>\`<option value="\${p.id}">\${esc(p.address)}</option>\`).join('') +
    \`<option value="all">All Properties – split evenly</option>\`;
  document.getElementById('scanDate').value = new Date().toISOString().slice(0,10);
  const list = document.getElementById('scannerExpenseList');
  const recent = state.expenses.slice(-6).reverse();
  list.innerHTML = recent.length ? recent.map(e=>{
    const p = propById(e.propertyId);
    return \`<div style="padding:6px 0;border-bottom:1px solid #ece7dd">\${esc(e.date)} · \${esc(e.vendor)} · <b>\${fmt(e.amount)}</b><br><span class="muted">\${p?esc(p.address):''}</span></div>\`;
  }).join('') : '<span class="muted">No expenses yet.</span>';
}
function saveScannedExpense(){
  const date = document.getElementById('scanDate').value;
  const amount = Number(document.getElementById('scanAmount').value);
  const vendor = document.getElementById('scanVendor').value.trim();
  const propVal = document.getElementById('scanProperty').value;
  const category = document.getElementById('scanCategory').value;
  const notes = document.getElementById('scanNotes').value.trim();
  if(!date || !amount || !vendor){ alert('Date, vendor and amount required'); return; }
  if(propVal === 'all'){
    const rentals = state.properties.filter(p=>!p.is_personal);
    if(!rentals.length){ alert('No rental properties found'); return; }
    const split = +(amount / rentals.length).toFixed(2);
    rentals.forEach(p=>{
      state.expenses.push({id: Date.now()+p.id, date, vendor, amount: split, propertyId: p.id, category, notes: notes + ' (split)'});
    });
    showToast(\`Split $\${amount.toFixed(2)} across \${rentals.length} rentals\`);
  } else {
    state.expenses.push({id: Date.now(), date, vendor, amount, propertyId: Number(propVal), category, notes});
    showToast('Expense saved');
  }
  document.getElementById('scanAmount').value='';
  document.getElementById('scanVendor').value='';
  document.getElementById('scanNotes').value='';
  saveState(true);
  renderScanner(); renderExpenses(); renderDashboard();
}

/* Home Office */
function renderHomeOffice(){
  const ho = state.homeOffice || {};
  ['Sqft','Total','UtilPct','UtilAmt','Rent'].forEach(k=>{
    const el = document.getElementById('ho'+k);
    if(el){ el.value = ho[k.toLowerCase()==='sqft'?'sqft':k.toLowerCase()==='total'?'totalSqft':k.toLowerCase()==='utilpct'?'utilPct':k.toLowerCase()==='utilamt'?'utilAmt':'rentAnnual'] || '';}
  });
  calcHomeOffice();
}
function saveHomeOffice(){
  state.homeOffice = {
    sqft: document.getElementById('hoSqft').value,
    totalSqft: document.getElementById('hoTotal').value,
    utilPct: document.getElementById('hoUtilPct').value,
    utilAmt: document.getElementById('hoUtilAmt').value,
    rentAnnual: document.getElementById('hoRent').value
  };
  saveState(true);
  calcHomeOffice();
  showToast('Home office saved');
}
function calcHomeOffice(){
  const sq = Number(document.getElementById('hoSqft')?.value||0);
  const total = Number(document.getElementById('hoTotal')?.value||0);
  const utilAmt = Number(document.getElementById('hoUtilAmt')?.value||0);
  const rentA = Number(document.getElementById('hoRent')?.value||0);
  const pctOverride = document.getElementById('hoUtilPct')?.value;
  let pct = total>0 ? sq/total : 0;
  if(pctOverride) pct = Number(pctOverride)/100;
  const deduction = (utilAmt*12 + rentA) * pct;
  const out = document.getElementById('hoResult');
  if(out) out.textContent = pct>0 ? \`Estimated home office deduction: \${fmt(deduction)} / year (\${(pct*100).toFixed(1)}% business use)\` : 'Enter office sq ft and total sq ft to estimate.';
}
['hoSqft','hoTotal','hoUtilPct','hoUtilAmt','hoRent'].forEach(id=>{
  document.addEventListener('input', e=>{
    if(e.target.id === id) calcHomeOffice();
  });
});

/* Officiating */
function renderOfficiating(){
  const tbody = document.getElementById('offTbody');
  const rows = state.officiating.slice().reverse();
  tbody.innerHTML = rows.length ? rows.map(o=>\`
    <tr><td>\${esc(o.date)}</td><td>\${esc(o.sport)}</td><td>\${fmt(o.fee)}</td><td>\${esc(o.miles||0)}</td><td>\${esc(o.assoc||'')}</td>
    <td><button class="btn btn-ghost btn-sm" onclick="deleteOff(\${o.id})">Del</button></td></tr>
  \`).join('') : \`<tr><td colspan="6" class="muted">No games yet.</td></tr>\`;
  const d = document.getElementById('offDate'); if(d && !d.value) d.value = new Date().toISOString().slice(0,10);
}
function addOfficiating(){
  const date = document.getElementById('offDate').value;
  const sport = document.getElementById('offSport').value;
  const fee = Number(document.getElementById('offFee').value||0);
  const miles = Number(document.getElementById('offMiles').value||0);
  const assoc = document.getElementById('offAssoc').value.trim();
  if(!date){ alert('Date required'); return; }
  state.officiating.push({id:Date.now(), date, sport, fee, miles, assoc});
  document.getElementById('offFee').value=''; document.getElementById('offMiles').value=''; document.getElementById('offAssoc').value='';
  saveState(true); renderOfficiating(); showToast('Game saved');
}
function deleteOff(id){ state.officiating = state.officiating.filter(o=>o.id!==id); saveState(true); renderOfficiating(); }
function exportOfficiatingCsv(){
  const rows = [['Date','Sport','Fee','Miles','Association']].concat(state.officiating.map(o=>[o.date,o.sport,o.fee,o.miles,o.assoc||'']));
  downloadCsv(rows, 'officiating.csv');
}

/* Reports */
function runReport(type){
  const props = visibleProps();
  const rents = state.rents.filter(r=>{
    const p = propById(r.propertyId);
    return !p || !p.is_personal || state.showPersonalInReports;
  });
  const expenses = state.expenses.filter(e=>{
    const p = propById(e.propertyId);
    return !p || !p.is_personal || state.showPersonalInReports;
  });
  const rentIncome = rents.reduce((s,r)=>s+Number(r.amount||0),0);
  const expenseTotal = expenses.reduce((s,e)=>s+Number(e.amount||0),0);
  let html = '', text='';
  if(type==='pl'){
    html = \`<h3>Profit & Loss – 2026</h3>
    <table><tr><td>Rent Income</td><td style="text-align:right">\${fmt(rentIncome)}</td></tr>
    <tr><td>Expenses</td><td style="text-align:right">\${fmt(expenseTotal)}</td></tr>
    <tr><td><b>Net Income</b></td><td style="text-align:right"><b>\${fmt(rentIncome-expenseTotal)}</b></td></tr></table>\`;
    text = \`P&L 2026\\nRent Income: \${rentIncome}\\nExpenses: \${expenseTotal}\\nNet: \${rentIncome-expenseTotal}\`;
  } else if(type==='schedulee'){
    let rows = props.filter(p=>!p.is_personal).map(p=>{
      const pr = rents.filter(r=>r.propertyId===p.id).reduce((s,r)=>s+Number(r.amount||0),0);
      const pe = expenses.filter(e=>e.propertyId===p.id).reduce((s,e)=>s+Number(e.amount||0),0);
      return \`<tr><td>\${esc(p.address)}</td><td style="text-align:right">\${fmt(pr)}</td><td style="text-align:right">\${fmt(pe)}</td><td style="text-align:right">\${fmt(pr-pe)}</td></tr>\`;
    }).join('');
    html = \`<h3>Schedule E – Rental Summary</h3><table><thead><tr><th>Property</th><th>Rents</th><th>Expenses</th><th>Net</th></tr></thead><tbody>\${rows||'<tr><td colspan="4">No rental activity</td></tr>'}</tbody></table>\`;
    text = 'Schedule E Rental Summary';
  } else if(type==='rentroll'){
    const rows = props.filter(p=>!p.is_personal).map(p=>{
      return \`<tr><td>\${esc(p.address)}</td><td>\${esc(p.tenant||'—')}</td><td>\${fmt(p.rent||0)}/mo</td><td>\${esc(p.entity||'')}</td></tr>\`;
    }).join('');
    html = \`<h3>Rent Roll</h3><table><thead><tr><th>Property</th><th>Tenant</th><th>Rent</th><th>Entity</th></tr></thead><tbody>\${rows||'<tr><td colspan="4">No rentals</td></tr>'}</tbody></table>\`;
    text = 'Rent Roll';
  } else if(type==='mileage'){
    const miles = (state.mileage||[]).concat(state.officiating.map(o=>({date:o.date, miles:o.miles, purpose:o.sport+' – '+(o.assoc||''), propertyId:null})));
    const totalMiles = miles.reduce((s,m)=>s+Number(m.miles||0),0);
    const rows = miles.map(m=>{
      const p = m.propertyId ? propById(m.propertyId) : null;
      return \`<tr><td>\${esc(m.date||'')}</td><td>\${esc(m.miles||0)}</td><td>\${esc(m.purpose|| (p?p.address:''))}</td></tr>\`;
    }).join('');
    html = \`<h3>Mileage Report – 2026</h3><p><b>Total miles: \${totalMiles}</b></p><table><thead><tr><th>Date</th><th>Miles</th><th>Purpose</th></tr></thead><tbody>\${rows||'<tr><td colspan="3">No mileage logged</td></tr>'}</tbody></table>\`;
    text = \`Mileage Report – \${totalMiles} miles\`;
  }
  currentReportHtml = html;
  currentReportText = text;
  document.getElementById('reportOutput').innerHTML = html;
  document.getElementById('reportDate').textContent = new Date().toLocaleDateString();
}
function emailReport(kind){
  const subject = encodeURIComponent('TaxSavvy Report');
  const body = encodeURIComponent((currentReportText||'TaxSavvy Report') + '\\n\\nReport generated by TaxSavvy\\n'+window.location.href);
  let to = '';
  if(kind==='accountant') to = '';
  if(kind==='me') to = '';
  window.location.href = \`mailto:\${to}?subject=\${subject}&body=\${body}\`;
}
function exportReport(kind){
  if(!currentReportHtml){ showToast('Generate a report first'); return; }
  const rows = [['Report','TaxSavvy'], ['Date', new Date().toLocaleDateString()], [], ['Content'] , [currentReportText]];
  downloadCsv(rows, kind==='qb' ? 'taxsavvy_quickbooks.csv' : kind==='excel' ? 'taxsavvy_report.csv' : 'taxsavvy_gsheets.csv');
}
function copyReport(){
  if(!currentReportText){ showToast('Generate a report first'); return; }
  navigator.clipboard.writeText(currentReportText + '\\n\\nReport generated by TaxSavvy').then(()=>showToast('Report copied'));
}
function downloadReportHtml(){
  if(!currentReportHtml){ showToast('Generate a report first'); return; }
  const html = \`<!doctype html><meta charset="utf-8"><title>TaxSavvy Report</title><body style="font-family:system-ui;padding:24px">\${currentReportHtml}<hr><p style="color:#64748b;font-size:12px">Report generated by TaxSavvy – \${mode==='demo'?'SAMPLE DEMO – not for filing':''} – \${new Date().toLocaleString()}</p><script>(function(){document.addEventListener("click",function(e){var a=e.target.closest("[data-product-id]");if(!a)return;e.preventDefault();var pid=a.getAttribute("data-product-id");if(pid)parent.postMessage({type:"ecto-artifact-link-click",productId:pid},"*")})})();</script>
</body>\`;
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'taxsavvy-report.html'; a.click(); URL.revokeObjectURL(a.href);
}

/* AI */
function askAi(){
  const q = document.getElementById('aiQuery').value.trim();
  const out = document.getElementById('aiAnswer');
  if(!q){ out.textContent='Enter a question first.'; return; }
  const rentals = state.properties.filter(p=>!p.is_personal).length;
  out.innerHTML = \`<b>TaxSavvy Assistant (informational)</b><br><br>
  For: <em>\${esc(q)}</em><br><br>
  With \${rentals} rental unit\${rentals!==1?'s':''} in your \${mode} file, keep contemporaneous mileage logs, separate personal expenses, and retain receipts. Home office must be exclusive and regular use. Rental income and expenses are generally reported on Schedule E. Consult a qualified tax professional for advice specific to your situation.\`;
}
function saveAiNote(){
  const txt = document.getElementById('aiAnswer').innerText.trim();
  if(!txt){ showToast('Ask a question first'); return; }
  state.aiNotes = state.aiNotes||[];
  state.aiNotes.push({date:new Date().toISOString().slice(0,10), text:txt.slice(0,600)});
  saveState(true);
  renderAiNotes();
  showToast('Note saved');
}
function renderAiNotes(){
  const box = document.getElementById('aiNotesList');
  if(!box) return;
  const notes = state.aiNotes||[];
  box.innerHTML = notes.length ? notes.slice().reverse().map(n=>\`<div style="padding:6px 0;border-bottom:1px solid #ece7dd"><b>\${n.date}</b><br>\${esc(n.text.slice(0,180))}…</div>\`).join('') : 'No notes yet.';
}

/* Upgrade */
function mockPay(provider){ showToast(provider + ' – Connect in Live mode'); }

/* Settings */
function renderSettings(){
  const box = document.getElementById('businessesEditor');
  box.innerHTML = state.businesses.map((b,i)=>\`
    <div class="list-item">
      <div>
        <div style="font-weight:700" contenteditable="true" oninput="updateBusiness(\${i},'name',this.innerText)">\${esc(b.name)}</div>
        <div class="small muted"><span contenteditable="true" oninput="updateBusiness(\${i},'hq',this.innerText)">\${esc(b.hq||'')}</span> · <span contenteditable="true" oninput="updateBusiness(\${i},'type',this.innerText)">\${esc(b.type||'')}</span></div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="removeBusiness(\${i})">Remove</button>
    </div>\`).join('') || '<div class="muted small">No entities yet.</div>';
  document.getElementById('settingsAppName').value = state.appName || 'TaxSavvy';
  document.getElementById('appName').innerText = state.appName || 'TaxSavvy';
  const dr = document.getElementById('dividendRecipient');
  dr.innerText = state.dividend_recipient || '';
  dr.oninput = ()=>{ state.dividend_recipient = dr.innerText; saveState(); };
  renderAiNotes();
}
function updateBusiness(i, field, val){ if(state.businesses[i]){ state.businesses[i][field]=val; saveState(); } }
function addBusiness(){
  const name = document.getElementById('newBusinessName').value.trim();
  if(!name) return;
  state.businesses.push({name, type:"", hq:""});
  document.getElementById('newBusinessName').value='';
  saveState(true); renderSettings(); showToast('Entity added');
}
function removeBusiness(i){ state.businesses.splice(i,1); saveState(true); renderSettings(); }
function syncAppName(v){ state.appName = v; document.getElementById('appName').innerText = v; saveState(); }
document.getElementById('appName').addEventListener('input', e=>{ state.appName = e.target.innerText; document.getElementById('settingsAppName').value = state.appName; saveState(); });

function changePin(){
  const current = prompt('Enter current PIN');
  if(!current || !verifyPin(current)){ alert('Incorrect'); return; }
  const np = prompt('New 4-digit PIN');
  if(!np) return;
  localStorage.setItem('taxsavvy_pin_hash', hashPin(np));
  showToast('PIN changed');
}

/* Export / Import JSON */
function exportJson(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = \`taxsavvy-\${mode}-\${new Date().toISOString().slice(0,10)}.json\`; a.click(); URL.revokeObjectURL(a.href);
  showToast('JSON exported');
}
function importJsonFile(e){
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      state = data;
      saveState(true);
      boot(false);
      showToast('Import complete');
    } catch(err){ alert('Invalid JSON'); }
  };
  reader.readAsText(f);
  e.target.value='';
}

/* Misc utils */
function downloadCsv(rows, filename){
  const csv = rows.map(a=>a.map(v=>\`"\${String(v??'').replace(/"/g,'""')}"\`).join(',')).join('\\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}
function esc(s){ return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function showSignup(){ alert('Demo Mode – 14-day free trial. Connect Stripe in Live mode to activate Pro.'); }

/* Init */
function boot(resetTab=true){
  state = loadState();
  updateModeChrome();
  document.getElementById('appName').innerText = state.appName || 'TaxSavvy';
  document.getElementById('settingsAppName') && (document.getElementById('settingsAppName').value = state.appName || 'TaxSavvy');
  renderDashboard();
  renderProperties();
  renderRent();
  renderExpenses();
  renderScanner();
  renderHomeOffice();
  renderOfficiating();
  renderSettings();
  if(resetTab) navigate('dashboard');
  document.getElementById('reportDate').textContent = new Date().toLocaleDateString();
}

document.getElementById('showPersonalToggle').addEventListener('change', e=>{
  state.showPersonalInReports = e.target.checked;
  saveState();
  renderRent();
  showToast(state.showPersonalInReports ? 'Personal residence shown in reports' : 'Personal residence hidden');
});

// Start
boot();
window.addEventListener('resize', updateStickyOffsets);
setTimeout(updateStickyOffsets, 80);

</script>
</body>
</html>`

export default function Page() {
  useEffect(() => {
    // Replace the entire document with the TaxSavvy standalone app
    // This lets us run the full Demo + Live HTML inside Next.js
    document.open()
    document.write(appHtml)
    document.close()
  }, [])
  return null
}
