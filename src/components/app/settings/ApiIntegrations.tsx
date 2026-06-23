"use client"
import React, { useState } from 'react'
import { Plus, Search, Key, ShieldCheck, X, FileText, Clipboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApiKeyItem {
  id: string
  name: string
  keyId: string
  created: string
  expires: string
  status: 'Active' | 'Expired' | 'Revoked'
}

const initialKeys: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'QField Sync Client',
    keyId: 'qf_sync_8c49f3e1a8b9e02c',
    created: '10 Jun 2025',
    expires: '10 Jun 2026',
    status: 'Active'
  },
  {
    id: 'key-2',
    name: 'Government Registrar API',
    keyId: 'gov_reg_9a12b3c4d5e6f7a8',
    created: '1 Jan 2025',
    expires: 'Never',
    status: 'Active'
  },
  {
    id: 'key-3',
    name: 'Public GIS Map Widget',
    keyId: 'pub_gis_3c87d6e5f4a3b2c1',
    created: '15 Feb 2025',
    expires: '15 Feb 2026',
    status: 'Expired'
  }
]

const ApiIntegrations = () => {
  const [keysList, setKeysList] = useState<ApiKeyItem[]>(initialKeys)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal control states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  // Form states for creating key
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyExpires, setNewKeyExpires] = useState('1 Year')
  const [selectedScopes, setSelectedScopes] = useState({
    Dashboard: true,
    Parcels: true,
    Users: false,
    Transactions: false,
    GIS: true
  })

  // Filtering list
  const filteredKeys = keysList.filter(k =>
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.keyId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRevokeKey = (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke the API key "${name}"? Apps using this key will immediately lose access.`)) {
      setKeysList(prev =>
        prev.map(k => k.id === id ? { ...k, status: 'Revoked' } : k)
      )
    }
  }

  const handleDeleteKey = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete the API key "${name}"?`)) {
      setKeysList(prev => prev.filter(k => k.id !== id))
    }
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName) {
      alert('Please fill out the key name.')
      return
    }

    const randomSuffix = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    const newKeyToken = `ls_live_${randomSuffix}`

    const newKeyObj: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyId: `${newKeyName.toLowerCase().replace(/ /g, '_')}_${randomSuffix.substring(0, 8)}`,
      created: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      expires: newKeyExpires === 'Never' ? 'Never' : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Active'
    }

    setKeysList(prev => [newKeyObj, ...prev])
    setGeneratedKey(newKeyToken)
    setIsCreateModalOpen(false)

    // Reset fields
    setNewKeyName('')
    setNewKeyExpires('1 Year')
  }

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey)
      alert('API key copied to clipboard! Save it securely.')
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
        <Key className="w-5 h-5 text-emerald-800" />
        <h3 className="text-sm font-bold text-slate-900">API Keys & Integrations</h3>
      </div>

      <div className="p-3.5 bg-blue-50/40 border border-blue-105 rounded-xl flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-blue-700 leading-relaxed">
          Manage secure credentials for external service sync clients, QField survey integration endpoints, and GIS registrar webhooks.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search API keys..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Key</span>
          </button>
        </div>

        {/* API keys table */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Key Name</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Key ID</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Created</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Expires</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredKeys.length > 0 ? (
                filteredKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-4 px-4 text-xs font-bold text-slate-800">{k.name}</td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-500 font-semibold">{k.keyId}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-450">{k.created}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-450">{k.expires}</td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border",
                          k.status === 'Active' && 'bg-emerald-50 text-emerald-700 border-emerald-100',
                          k.status === 'Expired' && 'bg-amber-50 text-amber-700 border-amber-100',
                          k.status === 'Revoked' && 'bg-rose-50 text-rose-700 border-rose-100'
                        )}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {k.status === 'Active' && (
                          <button
                            onClick={() => handleRevokeKey(k.id, k.name)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-750 border border-amber-100 hover:bg-amber-100/50 rounded-lg transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteKey(k.id, k.name)}
                          className="p-1 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete API key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-semibold text-slate-400">
                    No API keys found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE API KEY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-5 pb-3 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Create API Key</h3>
              <p className="text-xs font-semibold text-slate-450 mt-0.5">Generate a secure programmatic token</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Key Name *</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. QField Sync Client..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Expiration Date</label>
                <select
                  value={newKeyExpires}
                  onChange={(e) => setNewKeyExpires(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
                >
                  <option value="30 Days">30 Days</option>
                  <option value="90 Days">90 Days</option>
                  <option value="1 Year">1 Year</option>
                  <option value="Never">Never</option>
                </select>
              </div>

              {/* Scopes scope selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Select Scope Scopes</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50/50 border border-slate-100 rounded-xl p-3">
                  {Object.keys(selectedScopes).map((scope) => {
                    const isChecked = (selectedScopes as any)[scope]
                    return (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => setSelectedScopes(prev => ({ ...prev, [scope]: !isChecked }))}
                        className="flex items-center gap-2 py-1 hover:opacity-85 text-left focus:outline-none cursor-pointer"
                      >
                        <span
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                            isChecked ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white border-slate-205"
                          )}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                        <span className="text-xs font-semibold text-slate-655">{scope} Access</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-50 mt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATED KEY COPY MODAL */}
      {generatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in zoom-in-95 duration-200 text-left">
            <div className="mb-4 pb-3 border-b border-slate-55">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
                <span>Key Generated Successfully</span>
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Copy this key and save it in a secure location. It will not be shown again.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3">
                <input
                  type="text"
                  readOnly
                  value={generatedKey}
                  className="flex-1 bg-transparent border-none text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
                <button
                  onClick={handleCopyKey}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                  title="Copy to clipboard"
                >
                  <Clipboard className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setGeneratedKey(null)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiIntegrations
