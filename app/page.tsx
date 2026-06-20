"use client"
import { useEffect } from 'react'

const appHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TaxSavvy – Tax Manager</title>
<style>
:root{
  --navy:#0f1629;
  --green:#4cff34;
  --bg:#f5f2ec;
  --white:#ffffff;
  --text:#0f1629;
  --muted:#64748b;
  --line:#dde3ea;
  --line2:#cbd5e1;
  --soft:#f8f6f2;
  --card-shadow:0 1px 3px rgba(15,22,41,.06), 0 8px 24px rgba(15,22,41,.04);
  --radius:16px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:1.5;
  padding-bottom:76px;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}
a{color:#1a56db}
button,input,select,textarea{font:inherit}
input,select,textarea{
  width:100%;
  background:#fff;
  border:1px solid var(--line2);
  border-radius:12px;
  padding:12px 14px;
  color:var(--text);
}
input:focus,select:focus,textarea:focus{outline:2px solid #bfeeb7; border-color:#8edf7d}
label{font-size:13px;font-weight:600;color:#334155;display:block;margin-bottom:6px}

/* Header */
.site-header{
  position:sticky;top:0;z-index:1000;background:#0f1629;color:#fff;
  padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;
}
.brand-left{display:flex;align-items:center;gap:12px;min-width:0}
.brand-text h1{
  margin:0;font-size:19px;font-weight:800;letter-spacing:-.01em;outline:none;border-radius:6px;padding:2px 4px;
}
.brand-text h1:focus{background:rgba(255,255,255,.08)}
.brand-sub{color:#8aa0b8;font-size:13px;font-weight:600;outline:none;border-radius:6px;padding:2px 4px}
.brand-sub:focus{background:rgba(255,255,255,.08)}
.header-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.badge-mode{
  background:#4cff34;color:#0f1629;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap
}
.btn{
  border:none;padding:10px 14px;border-radius:10px;font-weight:700;cursor:pointer;
  min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;
  transition:.15s transform, .15s opacity;
}
.btn:active{transform:scale(.98)}
.btn-white{background:#fff;color:#0f1629}
.btn-green{background:#4cff34;color:#0f1629}
.btn-navy{background:#0f1629;color:#fff}
.btn-ghost{background:#fff;border:1px solid var(--line2);color:#0f1629}
.btn-sm{padding:8px 12px;min-height:38px;font-size:13px;border-radius:10px}
.save-status{color:#8aa0b8;font-size:12px;margin-left:4px;min-width:90px}

/* Demo banner */
#demoBanner{
  background:#4cff34;color:#0f1629;text-align:center;padding:9px 14px;font-weight:800;font-size:13.5px;
}

/* Top nav */
#topNav{
  position:sticky;top:64px;z-index:999;background:#f5f2ec;border-bottom:1px solid var(--line);
  padding:10px 16px;overflow-x:auto;white-space:nowrap;
  scrollbar-width: thin;
}
.nav-btn{
  color:#0f1629 !important; background:#ffffff !important; border:1px solid #cbd5e1 !important;
  border-radius:999px; padding:10px 16px; font-weight:600; cursor:pointer; margin-right:8px;
  font-size:14px; min-height:44px;
  transition:.15s;
}
.nav-btn.active{ background:#4cff34 !important; color:#0f1629 !important; font-weight:700 !important; border-color:#4cff34 !important }
.nav-btn:hover{background:#f2f7f0 !important}

/* Main */
main{max-width:1100px;margin:0 auto;padding:20px 16px 32px}
.tab-section h2{margin:4px 0 14px;font-size:26px;letter-spacing:-.01em}
.tab-section h3{margin:0 0 10px;font-size:17px}
.muted{color:var(--muted)}
.small{font-size:13px}
hr.sep{border:none;border-top:1px solid var(--line);margin:16px 0}

/* Cards / grid */
.grid{display:grid;gap:14px}
.grid-4{grid-template-columns:repeat(4,1fr)}
.grid-3{grid-template-columns:repeat(3,1fr)}
.grid-2{grid-template-columns:repeat(2,1fr)}
@media(max-width:900px){.grid-4{grid-template-columns:repeat(2,1fr)} .grid-3{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.grid-4,.grid-3,.grid-2{grid-template-columns:1fr}}

.card{
  background:#fff;border:1px solid #e6e0d8;border-radius:16px;padding:16px;
  box-shadow:var(--card-shadow);
}
.kpi{
  background:#0f1629;color:#fff;border-radius:16px;padding:20px 18px;min-height:112px;
}
.kpi .k-label{color:#4cff34;font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.kpi .k-val{font-size:30px;font-weight:800;margin-top:8px;letter-spacing:-.015em}
.kpi .k-sub{color:#9aadc2;font-size:13px;margin-top:6px}

/* Lists / tables */
.table-wrap{overflow-x:auto;background:#fff;border:1px solid #e6e0d8;border-radius:16px}
table{width:100%;border-collapse:collapse;font-size:14px;min-width:560px}
th,td{padding:12px 14px;text-align:left;border-bottom:1px solid #eee7dc}
th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#5b6b7c;background:#faf8f4}
tr:last-child td{border-bottom:none}

/* Property cards */
.prop-card{position:relative}
.prop-head{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:flex-start}
.editable-line{
  outline:none;border-radius:8px;padding:4px 6px;min-width:120px
}
.editable-line:focus{background:#f3f6f1; box-shadow:0 0 0 2px #d7f2cf}
.pill{font-size:12px;font-weight:700;background:#eef7ea;color:#22601a;padding:4px 9px;border-radius:999px}
.pill-gray{background:#eef0f3;color:#3b4554}

/* Forms */
.form-grid{display:grid;gap:12px}
.form-row{display:grid;gap:12px;grid-template-columns:1fr 1fr}
@media(max-width:640px){.form-row{grid-template-columns:1fr}}

.help{font-size:12.5px;color:#5a6778;margin-top:6px}

/* Report output */
.report-box{
  background:#fff;border:1px solid #e6e0d8;border-radius:16px;padding:18px;min-height:180px;
}
.report-headline{font-weight:800;font-size:18px;margin-bottom:6px}
.report-meta{color:#5b6b7c;font-size:13px;margin-bottom:14px}

/* Scanner */
.dropbox{
  border:2px dashed #cbd5e1;border-radius:14px;padding:18px;background:#faf9f6;text-align:center
}
.preview-img{max-width:100%;max-height:220px;border-radius:10px;margin-top:10px;border:1px solid #e5e0d7}

/* Toast */
#toast{
  position:fixed;right:16px;bottom:84px;background:#0f1629;color:#fff;padding:12px 14px;border-radius:12px;
  font-weight:700;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.2);opacity:0;transform:translateY(8px);
  transition:.2s;pointer-events:none;z-index:2000
}
#toast.show{opacity:1;transform:translateY(0)}

/* Bottom nav */
.bottom-nav{
  position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--line);
  z-index:1000;display:flex;justify-content:space-around;padding:8px 6px;gap:4px
}
.bottom-nav button{
  flex:1;background:transparent;border:none;color:#334155;font-size:11.5px;font-weight:700;
  padding:9px 4px;border-radius:10px;min-height:54px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px
}
.bottom-nav button .ico{font-size:18px}
.bottom-nav button.active{ background:#4cff34;color:#0f1629}
@media (min-width:769px){ .bottom-nav{display:none} body{padding-bottom:0} }

/* Utilities */
.flex{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.right{margin-left:auto}
.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}.mt20{margin-top:20px}
.chip-row{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:#fff;border:1px solid var(--line2);border-radius:999px;padding:9px 13px;font-weight:600;font-size:13px;cursor:pointer}
.chip.on{background:#4cff34;border-color:#4cff34}
.list-clean{list-style:none;padding:0;margin:0}
.list-clean li{padding:10px 0;border-bottom:1px solid #ece7de}
.list-clean li:last-child{border-bottom:none}
.badge{font-size:11px;font-weight:800;background:#eef7ea;color:#1f5d18;padding:3px 8px;border-radius:999px}
.badge-amber{background:#fff4cf;color:#6b5200}
.switch{
  display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e0d9cc;border-radius:12px;padding:10px 12px
}
footer.site-footer{color:#748193;font-size:12.5px;padding:28px 16px;text-align:center;border-top:1px solid #e6ddd0;margin-top:28px}

/* Contenteditable general */
[contenteditable="true"]{outline:none;border-radius:6px}
[contenteditable="true"]:focus{background:#f3f6f1; box-shadow:0 0 0 2px #d5f2ce}

/* Hide utility */
[hidden]{display:none !important}
</style>
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="brand-left">
      <!-- Logo -->
      <div aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-label="TaxSavvy logo">
          <circle cx="20" cy="20" r="20" fill="#e53935"/>
          <rect x="0" y="0" width="20" height="40" fill="#43a047"/>
          <text x="20" y="27" text-anchor="middle" fill="#fff" font-size="22" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"> $ </text>
        </svg>
      </div>
      <div class="brand-text">
        <h1 contenteditable="true" id="appName">TaxSavvy</h1>
        <div class="brand-sub" contenteditable="true">Tax Manager</div>
      </div>
    </div>
    <div class="header-right">
      <span id="modeBadge" class="badge-mode">DEMO</span>
      <button id="modeToggleBtn" onclick="toggleMode()" class="btn btn-white">Sign in</button>
      <button onclick="saveNow()" class="btn btn-green">Save</button>
      <span id="saveStatus" class="save-status"></span>
    </div>
  </header>

  <!-- Demo banner -->
  <div id="demoBanner">Demo Mode – 14-day free trial – No credit card required</div>

  <!-- Top Nav -->
  <nav id="topNav" aria-label="Primary">
    <button class="nav-btn active" onclick="navigate('dashboard')">Dashboard</button>
    <button class="nav-btn" onclick="navigate('properties')">Properties</button>
    <button class="nav-btn" onclick="navigate('rent')">Rent Ledger</button>
    <button class="nav-btn" onclick="navigate('expenses')">Expenses</button>
    <button class="nav-btn" onclick="navigate('scanner')">Receipt Scanner</button>
    <button class="nav-btn" onclick="navigate('homeoffice')">Home Office</button>
    <button class="nav-btn" onclick="navigate('officiating')">Officiating</button>
    <button class="nav-btn" onclick="navigate('reports')">Reports</button>
    <button class="nav-btn" onclick="navigate('ai')">AI Assistant</button>
    <button class="nav-btn" onclick="navigate('upgrade')">Upgrade</button>
    <button class="nav-btn" onclick="navigate('settings')">Settings</button>
  </nav>

  <main>
    <!-- DASHBOARD -->
    <section id="tab-dashboard" class="tab-section">
      <h2>Dashboard</h2>
      <p class="muted small" id="dashboardSubtitle">Welcome back. Here's your YTD snapshot.</p>
      <div class="grid grid-4 mt16" id="kpiGrid">
        <div class="kpi"><div class="k-label">Total Monthly Rent</div><div class="k-val" id="kpiRent">$0</div><div class="k-sub">Across active rentals</div></div>
        <div class="kpi"><div class="k-label">YTD Collected</div><div class="k-val" id="kpiCollected">$0</div><div class="k-sub" id="kpiCollectedSub">0 payments</div></div>
        <div class="kpi"><div class="k-label">Outstanding</div><div class="k-val" id="kpiOutstanding">$0</div><div class="k-sub">This month</div></div>
        <div class="kpi"><div class="k-label">Expense YTD</div><div class="k-val" id="kpiExpenses">$0</div><div class="k-sub" id="kpiExpensesSub">0 items</div></div>
      </div>

      <div class="grid grid-2 mt16">
        <div class="card">
          <h3>Recent Rent</h3>
          <ul id="recentRentList" class="list-clean small"></ul>
        </div>
        <div class="card">
          <h3>Recent Expenses</h3>
          <ul id="recentExpenseList" class="list-clean small"></ul>
        </div>
      </div>

      <div class="card mt16">
        <div class="flex">
          <div><strong>Quick actions</strong><div class="muted small">Jump into your most-used tools</div></div>
          <div class="right flex">
            <button class="btn btn-ghost btn-sm" onclick="navigate('rent')">Add Rent</button>
            <button class="btn btn-ghost btn-sm" onclick="navigate('scanner')">Scan Receipt</button>
            <button class="btn btn-green btn-sm" onclick="navigate('reports')">Run Report</button>
          </div>
        </div>
      </div>
    </section>

    <!-- PROPERTIES -->
    <section id="tab-properties" class="tab-section" hidden>
      <div class="flex" style="align-items:flex-end">
        <div>
          <h2>Properties</h2>
          <div class="muted small">Click any address, entity, tenant, or rent amount to edit inline. Changes auto-save.</div>
        </div>
        <div class="right">
          <button class="btn btn-ghost btn-sm" onclick="addProperty()">+ Add Property</button>
        </div>
      </div>

      <div class="switch mt12">
        <input type="checkbox" id="showPersonalToggle" style="width:auto" onchange="toggleShowPersonal(this.checked)">
        <label for="showPersonalToggle" style="margin:0">Show personal residence in reports</label>
        <span class="muted small">Default OFF. Personal property shows Expenses / Utilities only.</span>
      </div>

      <div id="propertyList" class="grid grid-2 mt16"></div>
    </section>

    <!-- RENT LEDGER -->
    <section id="tab-rent" class="tab-section" hidden>
      <h2>Rent Ledger</h2>
      <div class="grid grid-2">
        <div class="card">
          <h3>Add Rent Payment</h3>
          <div class="form-grid mt12">
            <div>
              <label for="rentProperty">Property</label>
              <select id="rentProperty"></select>
            </div>
            <div class="form-row">
              <div>
                <label for="rentDate">Date</label>
                <input type="date" id="rentDate">
              </div>
              <div>
                <label for="rentAmount">Amount</label>
                <input type="number" id="rentAmount" placeholder="0.00" step="0.01">
              </div>
            <div class="form-row">
              <div>
                <label for="rentTenant">Tenant</label>
                <input type="text" id="rentTenant" placeholder="Tenant name">
              </div>
              <div>
                <label for="rentMethod">Method</label>
                <select id="rentMethod">
                  <option>ACH</option><option>Check</option><option>Cash</option><option>Zelle</option><option>Venmo</option><option>Other</option>
                </select>
              </div>
            </div>
            <button class="btn btn-green" onclick="addRentEntry()">Add Rent Payment</button>
          </div>
        <div class="card">
          <h3>Export</h3>
          <p class="muted small">Export your rent ledger for your CPA or bookkeeping.</p>
          <div class="flex mt12">
            <button class="btn btn-ghost btn-sm" onclick="copyRentCSV()">Copy CSV</button>
            <button class="btn btn-ghost btn-sm" onclick="exportRentJSON()">Export JSON</button>
          </div>
          <p class="help">CSV: Date, Property, Tenant, Amount, Method</p>
        </div>
      </div>

      <div class="table-wrap mt16">
        <table id="rentTable">
          <thead><tr><th>Date</th><th>Property</th><th>Tenant</th><th>Method</th><th style="text-align:right">Amount</th><th></th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <!-- EXPENSES -->
    <section id="tab-expenses" class="tab-section" hidden>
      <div class="flex" style="align-items:flex-end">
        <h2 style="margin:0">Expenses</h2>
        <div class="right" style="min-width:220px;max-width:320px;width:100%">
          <label for="expenseFilter">Filter</label>
          <select id="expenseFilter" onchange="renderExpenses()"></select>
        </div>
      </div>
      <div class="table-wrap mt16">
        <table id="expenseTable">
          <thead><tr><th>Date</th><th>Vendor</th><th>Property</th><th>Category</th><th style="text-align:right">Amount</th><th></th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <!-- RECEIPT SCANNER -->
    <section id="tab-scanner" class="tab-section" hidden>
      <h2>Receipt Scanner</h2>
      <p class="muted small">Upload a photo, enter details, save to your expense ledger. Use “All Properties – split evenly” to auto-split across rentals.</p>
      <div class="grid grid-2 mt16">
        <div class="card">
          <div class="dropbox">
            <strong>Receipt Image</strong>
            <div class="muted small">JPG / PNG, up to ~10MB</div>
            <input type="file" id="receiptFile" accept="image/*" class="mt12" onchange="previewReceipt(this)">
            <img id="receiptPreview" class="preview-img" alt="" hidden>
          </div>
        <div class="card">
          <div class="form-grid">
            <div class="form-row">
              <div>
                <label for="scanDate">Date</label>
                <input type="date" id="scanDate">
              </div>
              <div>
                <label for="scanAmount">Amount</label>
                <input type="number" id="scanAmount" placeholder="0.00" step="0.01">
              </div>
            </div>
            <div>
              <label for="scanVendor">Vendor</label>
              <input type="text" id="scanVendor" placeholder="Home Depot, Lowes, etc.">
            </div>
            <div class="form-row">
              <div>
                <label for="scanProperty">Property</label>
                <select id="scanProperty"></select>
              </div>
              <div>
                <label for="scanCategory">Category</label>
                <select id="scanCategory">
                  <option>Repairs</option><option>Supplies</option><option>Utilities</option>
                  <option>Insurance</option><option>Taxes</option><option>Management</option>
                  <option>Mileage</option><option>Other</option>
                </select>
              </div>
            </div>
            <button class="btn btn-green" onclick="saveScannedExpense()">Save Expense</button>
            <div class="help">If “All Properties – split evenly” is selected, the amount is split across your 4 rental units (personal residence excluded).</div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOME OFFICE -->
    <section id="tab-homeoffice" class="tab-section" hidden>
      <h2>Home Office</h2>
      <div class="grid grid-2">
        <div class="card">
          <div class="form-grid">
            <div class="form-row">
              <div>
                <label>Office Sq Ft</label>
                <input type="number" id="hoOffice" value="180" min="0">
              </div>
              <div>
                <label>Total Home Sq Ft</label>
                <input type="number" id="hoTotal" value="2100" min="1">
              </div>
            </div>
            <div class="form-row">
              <div>
                <label>Annual Home Utilities / Etc.</label>
                <input type="number" id="hoUtilities" value="6200" min="0" step="0.01">
              </div>
              <div>
                <label>Simplified Rate ($/sqft)</label>
                <input type="number" id="hoRate" value="5" step="0.01">
              </div>
            <button class="btn btn-green" onclick="calcHomeOffice()">Calculate & Save</button>
          </div>
        </div>
        <div class="card">
          <h3>Deduction Estimate</h3>
          <div class="muted small" id="hoPct">Business use: —</div>
          <div style="font-size:28px;font-weight:800;margin-top:8px" id="hoDeduction">$0</div>
          <div class="muted small mt8">Simplified method capped at 300 sq ft. Actual expenses prorated.</div>
          <div class="help" id="hoBreakdown">—</div>
        </div>
      </div>
    </section>

    <!-- OFFICIATING -->
    <section id="tab-officiating" class="tab-section" hidden>
      <h2>Basketball Officiating</h2>
      <div class="grid grid-2">
        <div class="card">
          <h3>Log Game</h3>
          <div class="form-grid mt12">
            <div class="form-row">
              <div>
                <label>Sport / Level</label>
                <select id="offSport"><option>Boys Varsity</option><option>Girls Varsity</option><option>Boys JV</option><option>Girls JV</option><option>Modified</option><option>Youth</option></select>
              </div>
              <div>
                <label>Date</label>
                <input type="date" id="offDate">
              </div>
            </div>
            <div class="form-row">
              <div>
                <label>Game Fee</label>
                <input type="number" id="offFee" step="0.01" placeholder="95.00">
              </div>
              <div>
                <label>Miles (round trip)</label>
                <input type="number" id="offMiles" step="0.1" placeholder="32">
              </div>
            </div>
            <div>
              <label>Association / Notes</label>
              <input type="text" id="offAssoc" placeholder="Section IV, IAABO, etc.">
            </div>
            <button class="btn btn-green" onclick="addOfficiating()">Save Game</button>
          </div>
        </div>
        <div class="card">
          <h3>1099 Summary</h3>
          <div id="offSummary" class="muted">No games logged yet.</div>
          <div class="flex mt12">
            <button class="btn btn-ghost btn-sm" onclick="exportOfficiatingCSV()">Export CSV</button>
          </div>
          <p class="help">Mileage rate 2026: $0.70 / mile (editable in Settings – coming soon).</p>
        </div>
      <div class="table-wrap mt16">
        <table id="offTable">
          <thead><tr><th>Date</th><th>Sport</th><th>Association</th><th>Miles</th><th style="text-align:right">Fee</th><th></th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <!-- REPORTS -->
    <section id="tab-reports" class="tab-section" hidden>
      <h2>Reports</h2>
      <p class="muted small">Generate CPA-ready summaries. All exports include “Report generated by TaxSavvy”.</p>
      <div class="chip-row mt12">
        <button class="chip on" data-report="pl" onclick="setReportType(this,'pl')">P&L</button>
        <button class="chip" data-report="schedulee" onclick="setReportType(this,'schedulee')">Schedule E</button>
        <button class="chip" data-report="rentroll" onclick="setReportType(this,'rentroll')">Rent Roll</button>
        <button class="chip" data-report="mileage" onclick="setReportType(this,'mileage')">Mileage</button>
        <button class="btn btn-green btn-sm" onclick="runReport()">Run Report</button>
      </div>

      <div class="report-box mt16" id="reportOutput">
        <div class="report-headline">Ready</div>
        <div class="report-meta">Choose a report type and click Run Report.</div>
        <div class="muted small">Report generated by TaxSavvy</div>
      </div>

      <div class="card mt16">
        <strong>Send / Export</strong>
        <div class="flex mt12" style="gap:8px">
          <button class="btn btn-ghost btn-sm" onclick="emailReport('accountant')">Email to Accountant</button>
          <button class="btn btn-ghost btn-sm" onclick="emailReport('me')">Email to Me</button>
          <button class="btn btn-ghost btn-sm" onclick="emailReport('custom')">Custom Email</button>
        </div>
        <div class="flex mt12" style="gap:8px">
          <button class="btn btn-ghost btn-sm" onclick="exportReport('qb')">Export QuickBooks CSV</button>
          <button class="btn btn-ghost btn-sm" onclick="exportReport('excel')">Export Excel</button>
          <button class="btn btn-ghost btn-sm" onclick="exportReport('gsheets')">Export Google Sheets CSV</button>
          <button class="btn btn-ghost btn-sm" onclick="copyReportText()">Copy Report</button>
          <button class="btn btn-green btn-sm" onclick="downloadReportHTML()">Download HTML</button>
        </div>
        <div class="help mt12">Exports include full attribution footer required for archival access.</div>
      </div>

      <div class="card mt16" style="display:flex;align-items:center;gap:14px;justify-content:space-between;flex-wrap:wrap">
        <div class="muted small">Report generated by TaxSavvy</div>
        <div aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#e53935"/>
            <rect x="0" y="0" width="20" height="40" fill="#43a047"/>
            <text x="20" y="27" text-anchor="middle" fill="#fff" font-size="20" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"> $ </text>
          </svg>
        </div>
        <div class="muted small" id="reportDateStamp"></div>
      </div>
    </section>

    <!-- AI ASSISTANT -->
    <section id="tab-ai" class="tab-section" hidden>
      <h2>AI Assistant</h2>
      <p class="muted small">Ask tax categorization questions. Responses are saved as notes to your file (not tax advice).</p>
      <div class="card">
        <label for="aiPrompt">Your question</label>
        <textarea id="aiPrompt" rows="4" placeholder="e.g., Is a new water heater a repair or improvement for Schedule E?"></textarea>
        <div class="flex mt12">
          <button class="btn btn-green" onclick="askAI()">Ask Assistant</button>
          <button class="btn btn-ghost" onclick="document.getElementById('aiPrompt').value=''">Clear</button>
        </div>
        <div id="aiResponse" class="report-box mt16" hidden></div>
      </div>
      <div class="card mt16">
        <h3>Saved Notes</h3>
        <ul id="aiNotesList" class="list-clean small"></ul>
      </div>
    </section>

    <!-- UPGRADE -->
    <section id="tab-upgrade" class="tab-section" hidden>
      <h2>Upgrade TaxSavvy</h2>
      <div class="card">
        <strong>TaxSavvy Pro – $9/mo or $79/yr</strong>
        <ul class="small muted">
          <li>Unlimited properties & tenants</li>
          <li>Bank feed import (CSV/QFX)</li>
          <li>Schedule E + K-1 export</li>
          <li>Priority email support</li>
        </ul>
        <div class="chip-row mt12">
          <button class="btn btn-navy btn-sm" onclick="toast('Stripe checkout – connect in production')">Stripe</button>
          <button class="btn btn-ghost btn-sm" onclick="toast('PayPal – connect in production')">PayPal</button>
          <button class="btn btn-ghost btn-sm" onclick="toast('Venmo @TaxSavvy – placeholder')">Venmo</button>
          <button class="btn btn-ghost btn-sm" onclick="toast('Cash App $TaxSavvy – placeholder')">Cash App</button>
          <button class="btn btn-ghost btn-sm" onclick="toast('Zelle: billing@taxsavvy.app – placeholder')">Zelle</button>
          <button class="btn btn-ghost btn-sm" onclick="toast('ACH – contact support')">ACH / Wire</button>
        </div>
        <p class="help mt12">Demo mode is free for 14 days. No credit card required to try.</p>
      </div>
    </section>

    <!-- SETTINGS -->
    <section id="tab-settings" class="tab-section" hidden>
      <h2>Settings</h2>
      <div class="grid grid-2">
        <div class="card">
          <h3>Entities</h3>
          <p class="muted small">Click to edit. These appear on reports.</p>
          <div id="entityList" class="mt12"></div>
          <button class="btn btn-ghost btn-sm mt12" onclick="addEntity()">+ Add Entity</button>
        </div>

        <div class="card">
          <h3>App Preferences</h3>
          <div>
            <label for="settingsAppName">App Name (header)</label>
            <input type="text" id="settingsAppName" value="TaxSavvy">
          </div>
          <div class="mt12" id="pinBox" hidden>
            <button class="btn btn-ghost btn-sm" onclick="changePin()">Change PIN</button>
            <div class="help">PIN protects your Live / Private data on this device.</div>
          </div>
          <hr class="sep">
          <div class="flex" style="gap:8px">
            <button class="btn btn-ghost btn-sm" onclick="exportAllJSON()">Export JSON</button>
            <label class="btn btn-ghost btn-sm" style="cursor:pointer">
              Import JSON
              <input type="file" accept="application/json" onchange="importAllJSON(this.files[0])" hidden>
            </label>
          </div>
        </div>
      </div>

      <div class="card mt16">
        <h3>Terms & Cancellation</h3>
        <p style="font-size:14px;line-height:1.65;color:#334155">TaxSavvy Tax Manager is provided as-is for record keeping. You may export your data at any time. To cancel your subscription at any time, <a href="#" onclick="alert('Cancellation requested');return false" style="color:#1a56db;text-decoration:underline">click here to cancel</a>. Cancellations take effect at end of billing period. Report archives remain accessible with "Report generated by TaxSavvy" attribution.</p>
      </div>
    </section>

    <footer class="site-footer">
      TaxSavvy v22 – <span id="footerMode">Demo Mode</span> – Tax Manager – © 2026
    </footer>
  </main>

  <!-- Bottom mobile nav -->
  <nav class="bottom-nav" aria-label="Mobile">
    <button onclick="navigate('dashboard')" class="active"><span class="ico">🏠</span>Home</button>
    <button onclick="navigate('rent')"><span class="ico">📒</span>Ledger</button>
    <button onclick="navigate('expenses')"><span class="ico">🧾</span>Expenses</button>
    <button onclick="navigate('reports')"><span class="ico">📊</span>Reports</button>
    <button onclick="navigate('settings')"><span class="ico">⚙️</span>Settings</button>
  </nav>

  <div id="toast" role="status" aria-live="polite"></div>

<script>
/* ---------- Data / Mode ---------- */
var MODE_KEY = 'taxsavvy_mode';
var PIN_KEY  = 'taxsavvy_pin_hash';
var DEMO_STORE = 'taxsavvy_v22_demo';
var LIVE_STORE = 'taxsavvy_v22_live';

var mode = localStorage.getItem(MODE_KEY) || 'demo';

function getDemoSeed(){
  return {
    properties: [
      {id:1, address:"123 Main St, Anytown, USA", entity:"Personal", rent:0, is_personal:true, tenant:""},
      {id:2, address:"456 Oak Ave", entity:"Sample Rentals LLC", rent:1500, tenant:"A. Tenant"},
      {id:3, address:"789 Pine Rd Unit A", entity:"Sample Rentals LLC", rent:1350, tenant:"B. Renter"},
      {id:4, address:"789 Pine Rd Unit B", entity:"Sample Rentals LLC", rent:1100, tenant:""},
      {id:5, address:"321 Elm St", entity:"Demo Owner", rent:1650, tenant:"C. Lessee"}
    ],
    businesses: [{name:"Freelance Consulting", type:"1099", hq:"123 Main St"}, {name:"Sample Properties Inc", hq:"123 Main St"}],
    dividend_recipient: "Jane Demo, President",
    rentEntries: [
      {id:101, propertyId:2, date:"2026-01-05", tenant:"A. Tenant", method:"ACH", amount:1500},
      {id:102, propertyId:3, date:"2026-01-03", tenant:"B. Renter", method:"Check", amount:1350}
    ],
    expenses: [
      {id:201, date:"2026-01-10", vendor:"County Tax Collector", propertyId:2, category:"Taxes", amount:820},
      {id:202, date:"2026-01-18", vendor:"Ace Hardware", propertyId:3, category:"Repairs", amount:64.22},
      {id:203, date:"2026-02-02", vendor:"State Farm", propertyId:5, category:"Insurance", amount:310}
    ],
    officiating: [],
    aiNotes:[],
    homeOffice:{office:180,total:2100,utilities:6200,rate:5},
    showPersonalInReports:false,
    appName:"TaxSavvy"
  };
}
function getLiveSeed(){
  return {
    properties: [
      {id:1, address:"118 Daffodil Drive, Horseheads, NY", entity:"Personal", rent:0, is_personal:true, tenant:""},
      {id:2, address:"114 Orchard St, Horseheads, NY", entity:"Cronin NY Property Management LLC", rent:1405, tenant:""},
      {id:3, address:"220 Elmwood Ave Unit A, Elmira Heights, NY", entity:"Cronin NY Property Management LLC", rent:1400, tenant:""},
      {id:4, address:"220 Elmwood Ave Unit B, Elmira Heights, NY", entity:"Cronin NY Property Management LLC", rent:1100, tenant:""},
      {id:5, address:"146 W. Fourth Street, Corning, NY", entity:"Mark & Tammi Cronin", rent:1700, tenant:""}
    ],
    businesses: [{name:"Basketball Officiating", type:"1099", hq:"118 Daffodil Drive"}, {name:"MCMC Properties Inc", hq:"118 Daffodil Drive"}],
    dividend_recipient: "Mark Cronin, Vice President",
    rentEntries: [],
    expenses: [],
    officiating: [],
    aiNotes:[],
    homeOffice:{office:180,total:2100,utilities:6200,rate:5},
    showPersonalInReports:false,
    appName:"TaxSavvy"
  };
}
function storeKey(){ return mode === 'demo' ? DEMO_STORE : LIVE_STORE; }
var state;
function loadState(){
  var raw = localStorage.getItem(storeKey());
  if(raw){
    try{ state = JSON.parse(raw); } catch(e){ state=null; }
  }
  if(!state){
    state = (mode==='demo' ? getDemoSeed() : getLiveSeed());
  }
  // ensure arrays
  state.rentEntries = state.rentEntries || [];
  state.expenses = state.expenses || [];
  state.officiating = state.officiating || [];
  state.aiNotes = state.aiNotes || [];
}
var saveTimer=null;
function scheduleSave(){
  clearTimeout(saveTimer);
  document.getElementById('saveStatus').textContent = 'Saving…';
  saveTimer = setTimeout(function(){
    localStorage.setItem(storeKey(), JSON.stringify(state));
    document.getElementById('saveStatus').textContent = 'Auto-saved ✓';
    setTimeout(function(){ document.getElementById('saveStatus').textContent=''; }, 1400);
  }, 800);
}
function saveNow(){
  localStorage.setItem(storeKey(), JSON.stringify(state));
  document.getElementById('saveStatus').textContent = 'Saved ✓';
  toast('All changes saved');
  setTimeout(function(){ document.getElementById('saveStatus').textContent=''; }, 1500);
}

/* ---------- Mode Chrome ---------- */
function updateModeChrome(){
  var demoBanner = document.getElementById('demoBanner');
  var badge = document.getElementById('modeBadge');
  var toggleBtn = document.getElementById('modeToggleBtn');
  var footerMode = document.getElementById('footerMode');
  var pinBox = document.getElementById('pinBox');

  if(mode === 'demo'){
    if(demoBanner) demoBanner.hidden = false;
    badge.textContent = 'DEMO';
    badge.style.background = '#4cff34';
    badge.style.color = '#0f1629';
    toggleBtn.textContent = 'Sign in';
    footerMode.textContent = 'Demo Mode';
    if(pinBox) pinBox.hidden = true;
  } else {
    if(demoBanner) demoBanner.hidden = true;
    badge.textContent = 'LIVE – Private';
    badge.style.background = '#ffcc00';
    badge.style.color = '#0f1629';
    toggleBtn.textContent = 'Sign out → Demo';
    footerMode.textContent = 'Live Private';
    if(pinBox) pinBox.hidden = false;
  }
  var appNameEl = document.getElementById('appName');
  if(appNameEl && state.appName) appNameEl.textContent = state.appName;
  var settingsAppName = document.getElementById('settingsAppName');
  if(settingsAppName) settingsAppName.value = state.appName || 'TaxSavvy';
}
function toggleMode(){
  if(mode === 'demo'){
    var pin = localStorage.getItem(PIN_KEY);
    if(!pin){
      var np = prompt('Create a 4-digit PIN for your private (Live) account:');
      if(!np) return;
      localStorage.setItem(PIN_KEY, btoa(np));
    } else {
      var entered = prompt('Enter PIN to sign in to Live mode:');
      if(!entered || btoa(entered) !== localStorage.getItem(PIN_KEY)){ alert('Incorrect PIN'); return; }
    }
    mode='live';
    localStorage.setItem(MODE_KEY, 'live');
    location.reload();
  } else {
    mode='demo';
    localStorage.setItem(MODE_KEY, 'demo');
    location.reload();
  }
}
function changePin(){
  var current = prompt('Enter current PIN:');
  if(!current || btoa(current) !== localStorage.getItem(PIN_KEY)){ alert('Incorrect PIN'); return; }
  var np = prompt('Enter new 4-digit PIN:');
  if(!np) return;
  localStorage.setItem(PIN_KEY, btoa(np));
  toast('PIN updated');
}

/* ---------- Navigation (global, robust) ---------- */
window.navigate = function(tab){
  document.querySelectorAll('main section[id^="tab-"]').forEach(function(s){ s.hidden = true; });
  var el = document.getElementById('tab-'+tab);
  if(el) el.hidden = false;

  document.querySelectorAll('#topNav .nav-btn').forEach(function(b){
    var oc = b.getAttribute('onclick') || '';
    var isActive = oc.indexOf("'"+tab+"'") !== -1;
    b.classList.toggle('active', isActive);
  });
  document.querySelectorAll('.bottom-nav button').forEach(function(b){
    var oc = b.getAttribute('onclick')||'';
    b.classList.toggle('active', oc.indexOf("'"+tab+"'") !== -1);
  });
  window.scrollTo(0,0);

  if(tab==='dashboard' && typeof renderDashboard==='function') renderDashboard();
  if(tab==='properties' && typeof renderProperties==='function') renderProperties();
  if(tab==='rent' && typeof renderRent==='function') renderRent();
  if(tab==='expenses' && typeof renderExpenses==='function') renderExpenses();
  if(tab==='scanner' && typeof renderScanner==='function') renderScanner();
  if(tab==='officiating' && typeof renderOfficiating==='function') renderOfficiating();
  if(tab==='settings' && typeof renderSettings==='function') renderSettings();
};

/* ---------- Helpers ---------- */
function toast(msg){
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tm);
  t._tm = setTimeout(function(){ t.classList.remove('show'); }, 2100);
}
function money(n){ return '$' + Number(n||0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}); }
function money0(n){ return '$' + Number(n||0).toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0}); }
function findProp(id){ return state.properties.find(function(p){return p.id===id}) || {}; }
function rentalProps(){ return state.properties.filter(function(p){ return !p.is_personal; }); }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ---------- Dashboard ---------- */
function renderDashboard(){
  var rentals = rentalProps();
  var monthlyRent = rentals.reduce(function(sum,p){ return sum + Number(p.rent||0); }, 0);
  var ytdCollected = state.rentEntries.reduce(function(sum,r){ return sum + Number(r.amount||0); }, 0);
  var expenseYtd = state.expenses.reduce(function(sum,e){ return sum + Number(e.amount||0); }, 0);

  document.getElementById('kpiRent').textContent = money0(monthlyRent);
  document.getElementById('kpiCollected').textContent = money0(ytdCollected);
  document.getElementById('kpiCollectedSub').textContent = state.rentEntries.length + ' payments';
  document.getElementById('kpiOutstanding').textContent = money0(Math.max(0, monthlyRent - (ytdCollected % (monthlyRent||1))));
  document.getElementById('kpiExpenses').textContent = money0(expenseYtd);
  document.getElementById('kpiExpensesSub').textContent = state.expenses.length + ' items';

  var rr = document.getElementById('recentRentList');
  rr.innerHTML = '';
  state.rentEntries.slice(-4).reverse().forEach(function(r){
    var p = findProp(r.propertyId);
    var li = document.createElement('li');
    li.innerHTML = '<strong>'+money(r.amount)+'</strong> – ' + esc(p.address||'Property') + '<br><span class="muted">'+esc(r.date)+' · ' + esc(r.tenant||'') +'</span>';
    rr.appendChild(li);
  });
  if(!state.rentEntries.length){ rr.innerHTML = '<li class="muted">No rent recorded yet.</li>'; }

  var re = document.getElementById('recentExpenseList');
  re.innerHTML = '';
  state.expenses.slice(-4).reverse().forEach(function(x){
    var p = findProp(x.propertyId);
    var li = document.createElement('li');
    li.innerHTML = '<strong>'+money(x.amount)+'</strong> – ' + esc(x.vendor) + '<br><span class="muted">'+esc(x.category)+' · ' + esc(p.address||'—') +'</span>';
    re.appendChild(li);
  });
  if(!state.expenses.length){ re.innerHTML = '<li class="muted">No expenses yet.</li>'; }

  var subtitle = document.getElementById('dashboardSubtitle');
  if(subtitle) subtitle.textContent = mode==='demo' ? 'Demo data loaded – Sign in to use your private Live mode.' : 'Live Private – your data is stored locally on this device.';
}

/* ---------- Properties ---------- */
function renderProperties(){
  var list = document.getElementById('propertyList');
  list.innerHTML = '';
  var toggle = document.getElementById('showPersonalToggle');
  if(toggle) toggle.checked = !!state.showPersonalInReports;

  state.properties.forEach(function(p){
    var card = document.createElement('div');
    card.className = 'card prop-card';
    card.innerHTML =
      '<div class="prop-head">'+
        '<div style="min-width:0;flex:1">'+
          '<div class="editable-line" contenteditable="true" data-prop-field="address" data-prop-id="'+p.id+'" style="font-weight:700;font-size:16px">'+esc(p.address)+'</div>'+
          '<div class="muted small mt8">Entity: <span class="editable-line" contenteditable="true" data-prop-field="entity" data-prop-id="'+p.id+'">'+esc(p.entity||'')+'</span></div>'+
          (p.is_personal ? '<div class="muted small">Type: Personal residence – Expenses / Utilities only</div>' : '<div class="muted small">Tenant: <span class="editable-line" contenteditable="true" data-prop-field="tenant" data-prop-id="'+p.id+'">'+esc(p.tenant||'')+'</span></div>')+
        '</div>'+
        '<div style="text-align:right"><span class="pill '+(p.is_personal?'pill-gray':'')+'">'+(p.is_personal?'Personal':'Rental')+'</span>'+
        '<div class="mt8"><span class="muted small">Monthly rent</span><br><span class="editable-line" contenteditable="true" data-prop-field="rent" data-prop-id="'+p.id+'" style="font-weight:800;font-size:18px">$'+esc(p.rent||0)+'</span></div></div>'+
      '</div>';
    list.appendChild(card);
  });

  list.querySelectorAll('[contenteditable="true"][data-prop-id]').forEach(function(el){
    el.addEventListener('input', function(){
      var id = Number(el.dataset.propId);
      var field = el.dataset.propField;
      var prop = state.properties.find(function(x){ return x.id===id; });
      if(!prop) return;
      var val = el.textContent.trim();
      if(field==='rent'){
        val = val.replace(/[^0-9.]/g,'');
        prop.rent = Number(val)||0;
        el.textContent = prop.rent;
      } else {
        prop[field] = val;
      }
      scheduleSave();
    });
  });
}
function toggleShowPersonal(v){
  state.showPersonalInReports = !!v;
  scheduleSave();
}
function addProperty(){
  var id = Date.now();
  state.properties.push({id:id, address:"New Property", entity:"", rent:0, tenant:"", is_personal:false});
  scheduleSave();
  renderProperties();
  toast('Property added');
}

/* ---------- Rent Ledger ---------- */
function populateRentPropertySelect(){
  var sel = document.getElementById('rentProperty');
  if(!sel) return;
  sel.innerHTML = '';
  rentalProps().forEach(function(p){
    var o = document.createElement('option');
    o.value = p.id; o.textContent = p.address;
    sel.appendChild(o);
  });
}
function renderRent(){
  populateRentPropertySelect();
  var tbody = document.querySelector('#rentTable tbody');
  tbody.innerHTML = '';
  var rows = state.rentEntries.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
  rows.forEach(function(r){
    var p = findProp(r.propertyId);
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>'+esc(r.date)+'</td><td>'+esc(p.address||'')+'</td><td>'+esc(r.tenant||'')+'</td><td>'+esc(r.method||'')+'</td><td style="text-align:right;font-weight:700">'+money(r.amount)+'</td><td><button class="btn btn-ghost btn-sm" onclick="deleteRent('+r.id+')">Delete</button></td>';
    tbody.appendChild(tr);
  });
  if(!rows.length){
    tbody.innerHTML = '<tr><td colspan="6" class="muted">No rent entries yet.</td></tr>';
  }
  var d = document.getElementById('rentDate');
  if(d && !d.value) d.valueAsDate = new Date();
}
function addRentEntry(){
  var propertyId = Number(document.getElementById('rentProperty').value);
  var date = document.getElementById('rentDate').value;
  var amount = Number(document.getElementById('rentAmount').value);
  var tenant = document.getElementById('rentTenant').value.trim();
  var method = document.getElementById('rentMethod').value;
  if(!propertyId || !date || !amount){ alert('Property, Date, and Amount are required.'); return; }
  state.rentEntries.push({id:Date.now(), propertyId:propertyId, date:date, amount:amount, tenant:tenant, method:method});
  document.getElementById('rentAmount').value = '';
  document.getElementById('rentTenant').value = '';
  scheduleSave();
  renderRent();
  toast('Rent payment added');
}
function deleteRent(id){
  state.rentEntries = state.rentEntries.filter(function(r){ return r.id!==id; });
  scheduleSave(); renderRent();
}
function copyRentCSV(){
  var lines = ['Date,Property,Tenant,Amount,Method'];
  state.rentEntries.forEach(function(r){
    var p = findProp(r.propertyId);
    lines.push([r.date, '"'+(p.address||'').replace(/"/g,'""')+'"', '"'+(r.tenant||'').replace(/"/g,'""')+'"', r.amount, r.method].join(','));
  });
  navigator.clipboard.writeText(lines.join('\\n')).then(function(){ toast('Rent CSV copied'); }, function(){ toast('Copy failed'); });
}
function exportRentJSON(){
  var blob = new Blob([JSON.stringify(state.rentEntries, null, 2)], {type:'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'rent-ledger.json'; a.click(); URL.revokeObjectURL(a.href);
}

/* ---------- Expenses ---------- */
function renderExpenses(){
  var filterSel = document.getElementById('expenseFilter');
  var currentFilter = filterSel ? filterSel.value : 'all';
  if(filterSel && filterSel.options.length===0){
    filterSel.innerHTML = '<option value="all">All properties</option>';
    state.properties.forEach(function(p){
      var o = document.createElement('option'); o.value=p.id; o.textContent=p.address; filterSel.appendChild(o);
    });
  }
  if(filterSel) filterSel.value = currentFilter;

  var tbody = document.querySelector('#expenseTable tbody');
  tbody.innerHTML = '';
  var list = state.expenses.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
  if(currentFilter && currentFilter !== 'all'){
    list = list.filter(function(x){ return String(x.propertyId)===String(currentFilter); });
  }
  list.forEach(function(x){
    var p = findProp(x.propertyId);
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>'+esc(x.date)+'</td><td>'+esc(x.vendor)+'</td><td>'+esc(p.address||'—')+'</td><td>'+esc(x.category)+'</td><td style="text-align:right;font-weight:700">'+money(x.amount)+'</td><td><button class="btn btn-ghost btn-sm" onclick="deleteExpense('+x.id+')">Delete</button></td>';
    tbody.appendChild(tr);
  });
  if(!list.length) tbody.innerHTML = '<tr><td colspan="6" class="muted">No expenses found.</td></tr>';
}
function deleteExpense(id){
  state.expenses = state.expenses.filter(function(e){ return e.id!==id; });
  scheduleSave(); renderExpenses();
}

/* ---------- Scanner ---------- */
function renderScanner(){
  var sel = document.getElementById('scanProperty');
  if(!sel) return;
  sel.innerHTML = '';
  state.properties.forEach(function(p){
    var o = document.createElement('option'); o.value = p.id; o.textContent = p.address + (p.is_personal ? ' (Personal)':''); sel.appendChild(o);
  });
  var oAll = document.createElement('option'); oAll.value='ALL'; oAll.textContent='All Properties – split evenly'; sel.appendChild(oAll);
  var sd = document.getElementById('scanDate'); if(sd && !sd.value) sd.valueAsDate = new Date();
}
function previewReceipt(inp){
  var f = inp.files && inp.files[0];
  var img = document.getElementById('receiptPreview');
  if(!f){ img.hidden = true; return; }
  img.src = URL.createObjectURL(f);
  img.hidden = false;
}
function saveScannedExpense(){
  var date = document.getElementById('scanDate').value;
  var amount = Number(document.getElementById('scanAmount').value);
  var vendor = document.getElementById('scanVendor').value.trim() || 'Receipt';
  var propertyVal = document.getElementById('scanProperty').value;
  var category = document.getElementById('scanCategory').value;
  if(!date || !amount){ alert('Date and Amount are required.'); return; }

  if(propertyVal === 'ALL'){
    var rentals = rentalProps();
    if(!rentals.length){ alert('No rental properties found.'); return; }
    var split = Math.round((amount / rentals.length) * 100)/100;
    var remainder = Math.round((amount - split * rentals.length)*100)/100;
    rentals.forEach(function(p, i){
      var amt = split + (i===0 ? remainder : 0);
      state.expenses.push({id: Date.now()+i, date:date, vendor:vendor, propertyId:p.id, category:category, amount:amt});
    });
    toast('Split $' + amount.toFixed(2) + ' across ' + rentals.length + ' rentals');
  } else {
    state.expenses.push({id: Date.now(), date:date, vendor:vendor, propertyId:Number(propertyVal), category:category, amount:amount});
    toast('Expense saved');
  }
  document.getElementById('scanAmount').value='';
  document.getElementById('scanVendor').value='';
  var prev = document.getElementById('receiptPreview'); if(prev){ prev.hidden=true; prev.src=''; }
  document.getElementById('receiptFile').value='';
  scheduleSave();
}

/* ---------- Home Office ---------- */
function calcHomeOffice(){
  var office = Number(document.getElementById('hoOffice').value)||0;
  var total = Number(document.getElementById('hoTotal').value)||1;
  var utilities = Number(document.getElementById('hoUtilities').value)||0;
  var rate = Number(document.getElementById('hoRate').value)||5;
  var pct = office/total;
  var simplified = Math.min(office,300) * rate;
  var actual = utilities * pct;
  var deduction = Math.max(simplified, actual);

  state.homeOffice = {office:office,total:total,utilities:utilities,rate:rate};
  scheduleSave();

  document.getElementById('hoPct').textContent = 'Business use: ' + (pct*100).toFixed(1) + '% ('+office+' / '+total+' sq ft)';
  document.getElementById('hoDeduction').textContent = money(deduction);
  document.getElementById('hoBreakdown').textContent = 'Simplified: '+money(simplified)+' · Actual-expense portion: '+money(actual);
  toast('Home office saved');
}

/* ---------- Officiating ---------- */
function renderOfficiating(){
  var tbody = document.querySelector('#offTable tbody');
  tbody.innerHTML='';
  var rows = state.officiating.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
  var totalFees=0, totalMiles=0;
  rows.forEach(function(o){
    totalFees += Number(o.fee||0);
    totalMiles += Number(o.miles||0);
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>'+esc(o.date)+'</td><td>'+esc(o.sport)+'</td><td>'+esc(o.assoc||'')+'</td><td>'+esc(o.miles||0)+'</td><td style="text-align:right;font-weight:700">'+money(o.fee)+'</td><td><button class="btn btn-ghost btn-sm" onclick="deleteOff('+o.id+')">Delete</button></td>';
    tbody.appendChild(tr);
  });
  if(!rows.length) tbody.innerHTML = '<tr><td colspan="6" class="muted">No games logged yet.</td></tr>';
  var sum = document.getElementById('offSummary');
  var mileageRate = 0.70;
  sum.innerHTML = rows.length ? 
    'Games: <strong>'+rows.length+'</strong> · Fees: <strong>'+money(totalFees)+'</strong> · Miles: <strong>'+totalMiles.toFixed(1)+'</strong> · Mileage deduction @ $'+mileageRate.toFixed(2)+' ≈ <strong>'+money(totalMiles*mileageRate)+'</strong>'
    : 'No games logged yet.';
  var od = document.getElementById('offDate'); if(od && !od.value) od.valueAsDate = new Date();
}
function addOfficiating(){
  var sport = document.getElementById('offSport').value;
  var date = document.getElementById('offDate').value;
  var fee = Number(document.getElementById('offFee').value)||0;
  var miles = Number(document.getElementById('offMiles').value)||0;
  var assoc = document.getElementById('offAssoc').value.trim();
  if(!date){ alert('Date is required'); return; }
  state.officiating.push({id:Date.now(), sport:sport, date:date, fee:fee, miles:miles, assoc:assoc});
  document.getElementById('offFee').value=''; document.getElementById('offMiles').value=''; document.getElementById('offAssoc').value='';
  scheduleSave(); renderOfficiating(); toast('Game saved');
}
function deleteOff(id){ state.officiating = state.officiating.filter(function(x){return x.id!==id}); scheduleSave(); renderOfficiating(); }
function exportOfficiatingCSV(){
  var lines = ['Date,Sport,Association,Miles,Fee'];
  state.officiating.forEach(function(o){
    lines.push([o.date, '"'+o.sport+'"', '"'+(o.assoc||'')+'"', o.miles, o.fee].join(','));
  });
  var blob = new Blob([lines.join('\\n')], {type:'text/csv'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='officiating-2026.csv'; a.click(); URL.revokeObjectURL(a.href);
}

/* ---------- Reports ---------- */
var currentReportType = 'pl';
var lastReportText = '';
var lastReportHTML = '';

function setReportType(btn, type){
  currentReportType = type;
  document.querySelectorAll('[data-report]').forEach(function(c){ c.classList.remove('on'); });
  if(btn) btn.classList.add('on');
}

function runReport(){
  var rentals = state.showPersonalInReports ? state.properties : rentalProps();
  var rentTotal = state.rentEntries.reduce(function(s,r){ return s + Number(r.amount||0); },0);
  var expenseTotal = state.expenses.reduce(function(s,e){ return s + Number(e.amount||0); },0);
  var dateStr = new Date().toLocaleDateString();

  var title = {pl:'Profit & Loss', schedulee:'Schedule E Worksheet', rentroll:'Rent Roll', mileage:'Mileage Log'}[currentReportType] || 'Report';
  var bodyText = '';
  var bodyHTML = '';

  if(currentReportType==='pl'){
    bodyText = 'Rental Income: '+money(rentTotal)+'\\nExpenses: '+money(expenseTotal)+'\\nNet: '+money(rentTotal-expenseTotal);
    bodyHTML = '<table style="width:100%;border-collapse:collapse"><tr><td>Rental Income</td><td style="text-align:right;font-weight:700">'+money(rentTotal)+'</td></tr><tr><td>Expenses</td><td style="text-align:right">'+money(expenseTotal)+'</td></tr><tr><td><strong>Net</strong></td><td style="text-align:right"><strong>'+money(rentTotal-expenseTotal)+'</strong></td></tr></table>';
  } else if(currentReportType==='schedulee'){
    bodyText = rentals.map(function(p){
      var pRent = state.rentEntries.filter(function(r){ return r.propertyId===p.id }).reduce(function(s,r){return s+Number(r.amount||0)},0);
      var pExp = state.expenses.filter(function(e){ return e.propertyId===p.id }).reduce(function(s,e){return s+Number(e.amount||0)},0);
      return p.address + ' — Income '+money(pRent)+', Expenses '+money(pExp);
    }).join('\\n');
    bodyHTML = '<ul>'+rentals.map(function(p){
      var pRent = state.rentEntries.filter(function(r){ return r.propertyId===p.id }).reduce(function(s,r){return s+Number(r.amount||0)},0);
      var pExp = state.expenses.filter(function(e){ return e.propertyId===p.id }).reduce(function(s,e){return s+Number(e.amount||0)},0);
      return '<li>'+esc(p.address)+' — Income <strong>'+money(pRent)+'</strong>, Expenses '+money(pExp)+'</li>';
    }).join('')+'</ul>';
  } else if(currentReportType==='rentroll'){
    bodyText = rentals.map(function(p){
      var collected = state.rentEntries.filter(function(r){return r.propertyId===p.id}).reduce(function(s,r){return s+Number(r.amount||0)},0);
      return p.address + ' | Rent $'+(p.rent||0)+'/mo | YTD Collected '+money(collected)+' | Tenant: '+(p.tenant||'—');
    }).join('\\n');
    bodyHTML = '<table style="width:100%;border-collapse:collapse;font-size:14px"><tr><th align="left">Property</th><th align="right">Monthly</th><th align="right">YTD</th><th>Tenant</th></tr>' + rentals.map(function(p){
      var collected = state.rentEntries.filter(function(r){return r.propertyId===p.id}).reduce(function(s,r){return s+Number(r.amount||0)},0);
      return '<tr><td>'+esc(p.address)+'</td><td align="right">'+money(p.rent||0)+'</td><td align="right">'+money(collected)+'</td><td>'+esc(p.tenant||'—')+'</td></tr>';
    }).join('') + '</table>';
  } else if(currentReportType==='mileage'){
    var miles = state.officiating.reduce(function(s,o){return s + Number(o.miles||0)},0);
    bodyText = 'Officiating miles YTD: '+miles.toFixed(1)+'  @ $0.70 = '+money(miles*0.70);
    bodyHTML = '<p>Officiating miles YTD: <strong>'+miles.toFixed(1)+'</strong><br>Deduction @ $0.70 = <strong>'+money(miles*0.70)+'</strong></p>';
  }

  var demoNote = mode==='demo' ? ' – SAMPLE DEMO – not for filing' : '';
  var generatedBy = 'Report generated by TaxSavvy' + demoNote;

  lastReportText = title + '\\n' + dateStr + '\\n\\n' + bodyText + '\\n\\n' + generatedBy;
  lastReportHTML = '<h2>'+esc(title)+'</h2><div style="color:#5b6b7c">'+esc(dateStr)+'</div><div style="margin:14px 0">'+bodyHTML+'</div><hr><div style="font-size:12px;color:#5b6b7c">'+esc(generatedBy)+'</div>';

  document.getElementById('reportOutput').innerHTML =
    '<div class="report-headline">'+esc(title)+'</div>'+
    '<div class="report-meta">'+esc(dateStr)+' · '+esc(state.businesses.map(function(b){return b.name}).join(' / '))+'</div>'+
    '<div>'+bodyHTML+'</div>'+
    '<div class="mt12 muted small">'+esc(generatedBy)+'</div>';

  document.getElementById('reportDateStamp').textContent = dateStr;
  toast('Report generated');
}
function emailReport(target){
  if(!lastReportText){ toast('Run a report first'); return; }
  var subject = encodeURIComponent('TaxSavvy Report – ' + currentReportType.toUpperCase());
  var body = encodeURIComponent(lastReportText + '\\n\\n—\\nSent from TaxSavvy Tax Manager');
  var to = target==='accountant' ? '' : target==='me' ? '' : '';
  if(target==='custom'){
    var email = prompt('Enter recipient email:');
    if(!email) return;
    to = email;
  }
  window.location.href = 'mailto:'+to+'?subject='+subject+'&body='+body;
}
function exportReport(kind){
  if(!lastReportText){ toast('Run a report first'); return; }
  var csv = 'Section,Amount\\nRental Income,'+ state.rentEntries.reduce((s,r)=>s+Number(r.amount||0),0)+'\\nExpenses,'+ state.expenses.reduce((s,e)=>s+Number(e.amount||0),0)+'\\n';
  var blob = new Blob([kind==='qb' || kind==='gsheets' ? csv : lastReportText], {type:'text/plain'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='taxsavvy-report-'+currentReportType + (kind==='qb' ? '.csv' : '.txt'); a.click(); URL.revokeObjectURL(a.href);
  toast('Exported');
}
function copyReportText(){
  if(!lastReportText){ toast('Run a report first'); return; }
  navigator.clipboard.writeText(lastReportText).then(function(){ toast('Report copied'); });
}
function downloadReportHTML(){
  if(!lastReportHTML){ toast('Run a report first'); return; }
  var html = '<!doctype html><meta charset="utf-8"><title>TaxSavvy Report</title><body style="font-family:system-ui,-apple-system, Segoe UI, Roboto, Arial, sans-serif;max-width:760px;margin:32px auto;padding:0 16px;color:#0f1629">'+lastReportHTML+'<p style="margin-top:24px;color:#64748b;font-size:12px">Report generated by TaxSavvy – Tax Manager © 2026</p><script>(function(){document.addEventListener("click",function(e){var a=e.target.closest("[data-product-id]");if(!a)return;e.preventDefault();var pid=a.getAttribute("data-product-id");if(pid)parent.postMessage({type:"ecto-artifact-link-click",productId:pid},"*")})})();</script>
</body>';
  var blob = new Blob([html], {type:'text/html'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='taxsavvy-report.html'; a.click(); URL.revokeObjectURL(a.href);
}

/* ---------- AI ---------- */
function askAI(){
  var prompt = document.getElementById('aiPrompt').value.trim();
  if(!prompt){ toast('Enter a question'); return; }
  var responses = [
    "For Schedule E: repairs that keep property in ordinary operating condition are generally expensed in the year incurred. Improvements that better, restore, or adapt the property are capitalized. Keep invoices and before/after photos.",
    "Mileage for rental activities: trips to check on properties, meet contractors, or purchase supplies are deductible. Commuting from home to a regular office is not. Keep a contemporaneous log: date, miles, purpose.",
    "Home office: you must use a portion of your home regularly and exclusively for business. Simplified method is up to 300 sq ft × $5. Actual expense method prorates mortgage interest, taxes, utilities, insurance, repairs.",
    "Tenant security deposits are not rental income when received if you intend to return them. If you keep any portion, that amount becomes income in that year."
  ];
  var resp = responses[Math.floor(Math.random()*responses.length)];
  var box = document.getElementById('aiResponse');
  box.hidden = false;
  box.innerHTML = '<strong>TaxSavvy Assistant</strong><div class="muted small mt8">This is general information, not tax advice. Consult your CPA.</div><p style="margin-top:10px">'+esc(resp)+'</p><button class="btn btn-ghost btn-sm" onclick="saveAINote(\`Q: '+esc(prompt).replace(/\`/g,'')+'\\\\nA: '+esc(resp).replace(/\`/g,'')+'\`)">Save Note</button>';
}
function saveAINote(text){
  if(typeof text !== 'string'){
    text = document.getElementById('aiResponse').innerText;
  }
  state.aiNotes.push({id:Date.now(), text:text, date:new Date().toISOString().slice(0,10)});
  scheduleSave();
  renderAINotes();
  toast('Note saved');
}
function renderAINotes(){
  var ul = document.getElementById('aiNotesList');
  if(!ul) return;
  ul.innerHTML='';
  state.aiNotes.slice().reverse().forEach(function(n){
    var li=document.createElement('li');
    li.textContent = (n.date||'') + ' — ' + n.text.slice(0,140) + (n.text.length>140?'…':'');
    ul.appendChild(li);
  });
  if(!state.aiNotes.length) ul.innerHTML = '<li class="muted">No saved notes yet.</li>';
}

/* ---------- Settings ---------- */
function renderSettings(){
  renderAINotes();
  var box = document.getElementById('entityList');
  box.innerHTML='';
  state.businesses.forEach(function(b, idx){
    var div = document.createElement('div');
    div.className='card';
    div.style.padding='12px'; div.style.marginBottom='10px';
    div.innerHTML = '<div contenteditable="true" data-entity-idx="'+idx+'" data-entity-field="name" style="font-weight:700">'+esc(b.name)+'</div>'+
      '<div class="muted small" contenteditable="true" data-entity-idx="'+idx+'" data-entity-field="hq">'+esc(b.hq||'')+'</div>';
    box.appendChild(div);
  });
  box.querySelectorAll('[contenteditable][data-entity-idx]').forEach(function(el){
    el.addEventListener('input', function(){
      var i = Number(el.dataset.entityIdx);
      var field = el.dataset.entityField;
      state.businesses[i][field] = el.textContent.trim();
      scheduleSave();
    });
  });
  var appInput = document.getElementById('settingsAppName');
  if(appInput){
    appInput.value = state.appName || 'TaxSavvy';
    appInput.oninput = function(){
      state.appName = appInput.value;
      document.getElementById('appName').textContent = state.appName;
      scheduleSave();
    };
  }
  var pinBox = document.getElementById('pinBox');
  if(pinBox) pinBox.hidden = (mode!=='live');
}
function addEntity(){
  state.businesses.push({name:"New Entity", hq:""});
  scheduleSave(); renderSettings();
}
function exportAllJSON(){
  var blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='taxsavvy-backup-'+mode+'.json'; a.click(); URL.revokeObjectURL(a.href);
}
function importAllJSON(file){
  if(!file) return;
  var reader = new FileReader();
  reader.onload = function(){
    try{
      var data = JSON.parse(reader.result);
      if(!data.properties){ alert('Invalid file'); return; }
      state = data;
      saveNow();
      location.reload();
    } catch(e){ alert('Import failed: '+e.message); }
  };
  reader.readAsText(file);
}

/* ---------- Boot ---------- */
function boot(){
  loadState();
  updateModeChrome();

  // Wire appName header inline editing
  var appNameEl = document.getElementById('appName');
  if(appNameEl){
    appNameEl.addEventListener('input', function(){
      state.appName = appNameEl.textContent.trim() || 'TaxSavvy';
      var sInput = document.getElementById('settingsAppName');
      if(sInput) sInput.value = state.appName;
      scheduleSave();
    });
  }
  var brandSub = document.querySelector('.brand-sub');
  if(brandSub){
    brandSub.addEventListener('input', function(){ scheduleSave(); });
  }

  // Set today defaults
  var today = new Date().toISOString().slice(0,10);
  ['rentDate','scanDate','offDate'].forEach(function(id){
    var el=document.getElementById(id); if(el && !el.value) el.value = today;
  });

  // Initial renders
  renderDashboard();
  renderProperties();
  renderRent();
  renderExpenses();
  renderScanner();
  renderOfficiating();
  renderSettings();

  // Start on dashboard
  navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', boot);
</script>
</body>
</html>`

export default function Page() {
  useEffect(() => {
    document.open()
    document.write(appHtml)
    document.close()
  }, [])
  return null
}
