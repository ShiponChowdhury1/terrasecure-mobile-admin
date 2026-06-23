"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Settings, Shield, Key, Lock, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import GeneralSettings from '@/components/app/settings/GeneralSettings'
import RolesPermissions from '@/components/app/settings/RolesPermissions'
import ApiIntegrations from '@/components/app/settings/ApiIntegrations'
import SecuritySettings from '@/components/app/settings/SecuritySettings'
import BackupRestore from '@/components/app/settings/BackupRestore'

type SettingsTab = 'general' | 'roles' | 'api' | 'security' | 'backup'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  const tabs = [
    { id: 'general' as const, name: 'General', icon: Settings },
    { id: 'roles' as const, name: 'Roles & Permissions', icon: Shield },
    { id: 'api' as const, name: 'API Keys & Integrations', icon: Key },
    { id: 'security' as const, name: 'Security Settings', icon: Lock },
    { id: 'backup' as const, name: 'Backup & Restore', icon: Database }
  ]

  return (
    <DashboardChildrenLayout
      title="Settings"
      subtitle="System configuration, roles, API integrations, and security settings"
    >
      <div className="space-y-6 text-left">
        {/* Navigation tabs header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-1.5">
          {tabs.map((t) => {
            const IconComp = t.icon
            const isSelected = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs border",
                  isSelected
                    ? "bg-emerald-800 border-emerald-900 text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350"
                )}
              >
                <IconComp className="w-4.5 h-4.5" />
                <span>{t.name}</span>
              </button>
            )
          })}
        </div>

        {/* Tab contents panel */}
        <div className="w-full">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'roles' && <RolesPermissions />}
          {activeTab === 'api' && <ApiIntegrations />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'backup' && <BackupRestore />}
        </div>
      </div>
    </DashboardChildrenLayout>
  )
}

export default SettingsPage
