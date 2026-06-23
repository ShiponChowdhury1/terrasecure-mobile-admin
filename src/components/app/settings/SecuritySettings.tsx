"use client"
import React, { useState } from 'react'
import { ShieldCheck, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const SecuritySettings = () => {
  const [requireMfa, setRequireMfa] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('30 minutes')
  const [passwordComplexity, setPasswordComplexity] = useState('Strong')
  const [ipWhitelisting, setIpWhitelisting] = useState(false)
  const [allowedIps, setAllowedIps] = useState('197.155.0.0/16, 41.200.0.0/12')

  const [tempRules, setTempRules] = useState({
    requireMfa: true,
    sessionTimeout: '30 minutes',
    passwordComplexity: 'Strong',
    ipWhitelisting: false,
    allowedIps: '197.155.0.0/16, 41.200.0.0/12'
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setTempRules({
      requireMfa,
      sessionTimeout,
      passwordComplexity,
      ipWhitelisting,
      allowedIps
    })
    alert('Security configurations updated successfully.')
  }

  const handleCancel = () => {
    setRequireMfa(tempRules.requireMfa)
    setSessionTimeout(tempRules.sessionTimeout)
    setPasswordComplexity(tempRules.passwordComplexity)
    setIpWhitelisting(tempRules.ipWhitelisting)
    setAllowedIps(tempRules.allowedIps)
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
        <Lock className="w-5 h-5 text-emerald-800" />
        <h3 className="text-sm font-bold text-slate-900">Security Settings</h3>
      </div>

      <div className="p-3.5 bg-blue-50/40 border border-blue-105 rounded-xl flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-blue-700 leading-relaxed">
          Configure multi-factor policies, administrative session locks, API password complexities, and regional subnet whitelists.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Toggle MFA */}
        <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-xl p-4">
          <div>
            <span className="text-xs font-bold text-slate-700 block">Require Multi-Factor Authentication (MFA)</span>
            <span className="text-[10px] text-slate-450 font-medium leading-relaxed">
              Force all administrative users to configure MFA via authenticator app.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRequireMfa(!requireMfa)}
            className="focus:outline-none cursor-pointer shrink-0"
          >
            <div
              className={cn(
                "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                requireMfa ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
              )}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </button>
        </div>

        {/* Dropdowns timeouts complexity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-655">Session Timeout</label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="4 hours">4 hours</option>
              <option value="24 hours">24 hours</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-655">Password Complexity</label>
            <select
              value={passwordComplexity}
              onChange={(e) => setPasswordComplexity(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="Basic">Basic (6+ chars)</option>
              <option value="Medium">Medium (8+ chars, numbers)</option>
              <option value="Strong">Strong (8+ chars, uppercase, numbers, special characters)</option>
            </select>
          </div>
        </div>

        {/* IP Whitelisting Toggle & Input */}
        <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-xl p-4">
          <div>
            <span className="text-xs font-bold text-slate-700 block">IP Whitelisting</span>
            <span className="text-[10px] text-slate-450 font-medium leading-relaxed">
              Restrict administrative dashboard access to trusted IP ranges.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIpWhitelisting(!ipWhitelisting)}
            className="focus:outline-none cursor-pointer shrink-0"
          >
            <div
              className={cn(
                "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                ipWhitelisting ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
              )}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </button>
        </div>

        {ipWhitelisting && (
          <div className="space-y-1.5 bg-slate-50/30 border border-slate-100 p-4 rounded-xl animate-in fade-in slide-in-from-top-1 duration-150">
            <label className="text-xs font-bold text-slate-655">Allowed IP Ranges (comma-separated)</label>
            <input
              type="text"
              value={allowedIps}
              onChange={(e) => setAllowedIps(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-white"
              placeholder="e.g. 192.168.1.1, 10.0.0.0/24"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-50">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
          >
            Save Security Rules
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SecuritySettings
