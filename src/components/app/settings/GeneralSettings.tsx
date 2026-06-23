"use client"
import React, { useState } from 'react'
import { Settings, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const GeneralSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [platformName, setPlatformName] = useState('LandSecure')
  const [supportEmail, setSupportEmail] = useState('support@landsecure.cm')
  const [language, setLanguage] = useState('English')
  const [currency, setCurrency] = useState('XAF')

  const [tempData, setTempData] = useState({
    maintenanceMode: false,
    platformName: 'LandSecure',
    supportEmail: 'support@landsecure.cm',
    language: 'English',
    currency: 'XAF'
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setTempData({
      maintenanceMode,
      platformName,
      supportEmail,
      language,
      currency
    })
    alert('General settings saved successfully.')
  }

  const handleCancel = () => {
    setMaintenanceMode(tempData.maintenanceMode)
    setPlatformName(tempData.platformName)
    setSupportEmail(tempData.supportEmail)
    setLanguage(tempData.language)
    setCurrency(tempData.currency)
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs relative text-left">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-800" />
          <h3 className="text-sm font-bold text-slate-900">General Settings</h3>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[9px] font-bold border leading-none uppercase",
              maintenanceMode
                ? "bg-amber-50 text-amber-700 border-amber-105"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            )}
          >
            {maintenanceMode ? 'System Offline' : 'System Online'}
          </span>
        </div>
        {/* Toggle Maintenance Mode */}
        <button
          type="button"
          onClick={() => setMaintenanceMode(!maintenanceMode)}
          className="focus:outline-none cursor-pointer"
        >
          <div
            className={cn(
              "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
              maintenanceMode ? "bg-amber-500 justify-end" : "bg-emerald-600 justify-end"
            )}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="p-3.5 bg-blue-50/40 border border-blue-105 rounded-xl flex items-start gap-2.5">
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0 [animation-duration:10s] mt-0.5" />
          <p className="text-xs font-semibold text-blue-700 leading-relaxed">
            Changing platform settings takes effect immediately across all client applications (Android, iOS, Web).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-655">Platform Name</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-655">Primary Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-655">System Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-655">System Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="XAF">XAF</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-50">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
          >
            Save
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

export default GeneralSettings
