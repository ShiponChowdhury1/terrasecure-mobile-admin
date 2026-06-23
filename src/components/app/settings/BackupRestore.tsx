"use client"
import React, { useState } from 'react'
import { Plus, Database, RotateCcw, Download, Trash2, ShieldAlert, X, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackupItem {
  id: string
  name: string
  date: string
  size: string
  type: 'Scheduled' | 'Manual'
  status: 'Completed' | 'Failed' | 'Restoring...'
}

const initialBackups: BackupItem[] = [
  {
    id: 'b-1',
    name: 'Auto-Backup Daily',
    date: '23 Jun 2026 04:00',
    size: '45.2 MB',
    type: 'Scheduled',
    status: 'Completed'
  },
  {
    id: 'b-2',
    name: 'Pre-Upgrade Backup',
    date: '20 Jun 2026 15:32',
    size: '44.8 MB',
    type: 'Manual',
    status: 'Completed'
  },
  {
    id: 'b-3',
    name: 'Auto-Backup Daily',
    date: '22 Jun 2026 04:00',
    size: '45.1 MB',
    type: 'Scheduled',
    status: 'Completed'
  }
]

const BackupRestore = () => {
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups)

  // Confirmation overlay states
  const [restoringBackup, setRestoringBackup] = useState<BackupItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCreateManualBackup = () => {
    const timeString = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const newBackup: BackupItem = {
      id: `b-${Date.now()}`,
      name: 'Manual Backup',
      date: timeString,
      size: '43.7 MB',
      type: 'Manual',
      status: 'Completed'
    }

    setBackups(prev => [newBackup, ...prev])
    alert('Manual system database backup completed successfully.')
  }

  const handleDownload = (name: string) => {
    alert(`Downloading backup archive "${name}"...`)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete the backup "${name}"?`)) {
      setBackups(prev => prev.filter(b => b.id !== id))
    }
  }

  const triggerRestore = () => {
    if (!restoringBackup) return
    setIsProcessing(true)

    // Simulate system restore delay
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Database successfully restored to state matching backup "${restoringBackup.name}" (${restoringBackup.date}).`)
      setRestoringBackup(null)
    }, 2000)
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
        <Database className="w-5 h-5 text-emerald-800" />
        <h3 className="text-sm font-bold text-slate-900">Backup & Restore</h3>
      </div>

      <div className="p-3.5 bg-amber-50/50 border border-amber-105 rounded-xl flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-amber-700 leading-relaxed">
          Important: Restoring database records will overwrite current platform entries. Please make a manual backup before performing recovery.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">System Backups</h4>
            <p className="text-xs font-semibold text-slate-400">Manage database snapshots</p>
          </div>
          <button
            onClick={handleCreateManualBackup}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Manual Backup</span>
          </button>
        </div>

        {/* Backups table */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Backup Name</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Size</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="py-4 px-4 text-xs font-bold text-slate-800">{b.name}</td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-450 whitespace-nowrap">{b.date}</td>
                  <td className="py-4 px-4 text-xs font-mono font-bold text-slate-550">{b.size}</td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-400">{b.type}</td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        b.status === 'Completed' && 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        b.status === 'Failed' && 'bg-rose-50 text-rose-700 border-rose-100',
                        b.status === 'Restoring...' && 'bg-blue-50 text-blue-700 border-blue-100'
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {/* Restore */}
                      <button
                        onClick={() => setRestoringBackup(b)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 hover:border-blue-100 border border-transparent rounded-lg transition-colors cursor-pointer"
                        title="Restore system backup"
                      >
                        <RotateCcw className="w-4.5 h-4.5" />
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => handleDownload(b.name)}
                        className="p-1.5 text-slate-500 hover:bg-slate-50 hover:border-slate-200 border border-transparent rounded-lg transition-colors cursor-pointer"
                        title="Download archive"
                      >
                        <Download className="w-4.5 h-4.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 hover:border-rose-100 border border-transparent rounded-lg transition-colors cursor-pointer"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM RESTORE DATABASE OVERLAY */}
      {restoringBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in zoom-in-95 duration-200 text-left">
            {!isProcessing ? (
              <>
                <button
                  onClick={() => setRestoringBackup(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="mb-4 pb-3 border-b border-slate-50">
                  <h3 className="text-sm font-bold text-slate-905 flex items-center gap-1.5 text-rose-700">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Confirm Restore</span>
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1">
                    System database rollback configuration
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-semibold text-slate-650 leading-relaxed">
                    Are you sure you want to restore the system to backup <span className="font-bold text-slate-900">"{restoringBackup.name}"</span>?
                  </p>
                  <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                    <p className="text-[11px] font-semibold text-rose-700 leading-relaxed">
                      ⚠️ This operation is destructive and will overwrite all current system records with database snapshot state from <span className="font-bold">{restoringBackup.date}</span>.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => setRestoringBackup(null)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={triggerRestore}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-750 border border-rose-700 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Confirm Restore
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin shrink-0 [animation-duration:1.5s]" />
                <h3 className="text-sm font-bold text-slate-800">Restoring Database...</h3>
                <p className="text-xs font-semibold text-slate-400">Reloading records from {restoringBackup.date}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BackupRestore
