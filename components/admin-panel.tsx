"use client"

import { useState } from "react"

const ADMIN_PASSWORD = "CRONIN2026"

export function AdminPanel({
  billingEnabled,
  onToggleBilling,
}: {
  billingEnabled: boolean
  onToggleBilling: (next: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [pw, setPw] = useState("")
  const [error, setError] = useState(false)

  const tryLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setLoggedIn(true)
      setError(false)
      setPw("")
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div
          className="mb-2 w-64 rounded-lg border border-white/10 p-4 shadow-xl"
          style={{ backgroundColor: "#1e293b" }}
        >
          {!loggedIn ? (
            <div>
              <p className="mb-2 text-sm font-medium text-white">Admin Login</p>
              <input
                className="gts-input"
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value)
                  setError(false)
                }}
                onKeyDown={(e) => e.key === "Enter" && tryLogin()}
              />
              {error && <p className="mt-1 text-xs text-red-400">Incorrect password</p>}
              <button
                type="button"
                onClick={tryLogin}
                className="mt-2 w-full rounded-md bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25"
              >
                Log In
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-sm font-medium text-white">Admin Panel</p>
              <div className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2">
                <div>
                  <p className="text-sm text-white">Billing</p>
                  <p className="text-xs text-white/60">$20/mo subscription</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleBilling(!billingEnabled)}
                  className="relative h-6 w-11 rounded-full transition-colors"
                  style={{ backgroundColor: billingEnabled ? "#22c55e" : "#475569" }}
                  aria-label="Toggle billing"
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                    style={{ left: billingEnabled ? "1.375rem" : "0.125rem" }}
                  />
                </button>
              </div>
              <p className="mt-2 text-xs text-white/60">
                Billing is {billingEnabled ? "ON — $20/mo enabled" : "OFF by default"}
              </p>
              <button
                type="button"
                onClick={() => setLoggedIn(false)}
                className="mt-2 w-full rounded-md bg-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/20"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur hover:bg-white/20"
      >
        Admin
      </button>
    </div>
  )
}
