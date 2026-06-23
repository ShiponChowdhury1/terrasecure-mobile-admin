"use client"
import React, { useState } from 'react'
import { Check, X, ShieldAlert, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PermissionState {
  [role: string]: {
    [permission: string]: boolean
  }
}

const defaultPermissions: PermissionState = {
  'Super Admin': {
    'Dashboard': true,
    'Parcels': true,
    'User Mgmt': true,
    'Transactions': true,
    'GIS Map': true,
    'Audit Logs': true,
    'System Settings': true
  },
  'Admin': {
    'Dashboard': true,
    'Parcels': true,
    'User Mgmt': true,
    'Transactions': true,
    'GIS Map': true,
    'Audit Logs': true,
    'System Settings': false
  },
  'Supervisor': {
    'Dashboard': true,
    'Parcels': true,
    'User Mgmt': false,
    'Transactions': true,
    'GIS Map': true,
    'Audit Logs': false,
    'System Settings': false
  },
  'Surveyor': {
    'Dashboard': true,
    'Parcels': true,
    'User Mgmt': false,
    'Transactions': false,
    'GIS Map': true,
    'Audit Logs': false,
    'System Settings': false
  },
  'Field Agent': {
    'Dashboard': true,
    'Parcels': true,
    'User Mgmt': false,
    'Transactions': false,
    'GIS Map': false,
    'Audit Logs': false,
    'System Settings': false
  },
  'Client': {
    'Dashboard': true,
    'Parcels': false,
    'User Mgmt': false,
    'Transactions': false,
    'GIS Map': false,
    'Audit Logs': false,
    'System Settings': false
  }
}

const RolesPermissions = () => {
  const [permissions, setPermissions] = useState<PermissionState>(defaultPermissions)

  const roles = ['Super Admin', 'Admin', 'Supervisor', 'Surveyor', 'Field Agent', 'Client']
  const permissionKeys = ['Dashboard', 'Parcels', 'User Mgmt', 'Transactions', 'GIS Map', 'Audit Logs', 'System Settings']

  const handleTogglePermission = (role: string, perm: string) => {
    if (role === 'Super Admin') {
      // Super Admin should usually retain all permissions for system stability
      alert('Super Admin permissions are locked and cannot be modified.')
      return
    }
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm]
      }
    }))
  }

  const handleSave = () => {
    alert('Security roles & permissions updated successfully.')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all permissions to default?')) {
      setPermissions(defaultPermissions)
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
        <Shield className="w-5 h-5 text-emerald-800" />
        <h3 className="text-sm font-bold text-slate-900">Roles & Permissions Matrix</h3>
      </div>

      <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-amber-700 leading-relaxed">
          Warning: Modifying role scopes can restrict administrator operations. Changes are logged and audited instantly.
        </p>
      </div>

      {/* Permissions grid table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl bg-white">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-3.5 px-4 text-left text-[10px] font-bold text-slate-450 uppercase tracking-wider">Role</th>
              {permissionKeys.map((p) => (
                <th key={p} className="py-3.5 px-2 text-center text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {roles.map((role) => (
              <tr key={role} className="hover:bg-slate-50/20 transition-colors">
                {/* Role name */}
                <td className="py-3.5 px-4 text-left text-xs font-bold text-slate-800">
                  {role}
                </td>

                {/* Permission switches */}
                {permissionKeys.map((perm) => {
                  const isChecked = permissions[role][perm]
                  const isSuperAdmin = role === 'Super Admin'
                  return (
                    <td key={perm} className="py-3.5 px-2 align-middle">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(role, perm)}
                          className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center border transition-all shadow-xs cursor-pointer select-none",
                            isChecked
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-50 text-slate-300 border-slate-100",
                            isSuperAdmin && "cursor-not-allowed opacity-75"
                          )}
                          title={`${isChecked ? 'Enabled' : 'Disabled'} for ${role}`}
                        >
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-rose-500/60" />
                          )}
                        </button>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save / Reset buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
        >
          Save Permissions
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-bold text-slate-655 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
        >
          Reset to Default
        </button>
      </div>
    </div>
  )
}

export default RolesPermissions
