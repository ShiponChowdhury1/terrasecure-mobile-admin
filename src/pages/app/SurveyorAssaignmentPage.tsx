"use client"
import React, { useState, useEffect } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Check, X, Pencil, Star, MapPin, Target, ClipboardList, Send, Calendar, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Surveyor {
  id: string
  initials: string
  name: string
  status: 'busy' | 'available' | 'offline'
  region: string
  specialty: string
  activeCount: number
  doneCount: number
  rating: number
}

export interface Assignment {
  id: string
  parcelId: string
  status: 'pending' | 'in progress' | 'completed' | 'cancelled'
  priority: 'low priority' | 'medium priority' | 'high priority'
  surveyor: string
  scheduledDate: string
  visitType: 'Initial Survey' | 'Verification Visit' | 'Dispute Investigation' | 'Final Assessment'
  notes: string
}

const initialSurveyors: Surveyor[] = [
  {
    id: 'PBJ',
    initials: 'PBJ',
    name: 'Paul Biya Jr',
    status: 'busy',
    region: 'Centre Region',
    specialty: 'Urban Parcels',
    activeCount: 2,
    doneCount: 147,
    rating: 4.8
  },
  {
    id: 'ME',
    initials: 'ME',
    name: 'Martin Essono',
    status: 'available',
    region: 'Littoral Region',
    specialty: 'GIS Mapping',
    activeCount: 0,
    doneCount: 203,
    rating: 4.9
  },
  {
    id: 'CO',
    initials: 'CO',
    name: 'Cécile Ondoua',
    status: 'available',
    region: 'South Region',
    specialty: 'Rural Parcels',
    activeCount: 1,
    doneCount: 89,
    rating: 4.6
  },
  {
    id: 'AD',
    initials: 'AD',
    name: 'Alain Dimi',
    status: 'offline',
    region: 'Northwest Region',
    specialty: 'Boundary Disputes',
    activeCount: 0,
    doneCount: 64,
    rating: 4.3
  }
]

const initialAssignments: Assignment[] = [
  {
    id: 'ASN-012',
    parcelId: 'CM-2849',
    status: 'in progress',
    priority: 'high priority',
    surveyor: 'Paul Biya Jr',
    scheduledDate: '15 Jun 2025 09:00',
    visitType: 'Initial Survey',
    notes: 'GPS equipment confirmed. Check northern boundary carefully.'
  },
  {
    id: 'ASN-011',
    parcelId: 'CM-2847',
    status: 'completed',
    priority: 'medium priority',
    surveyor: 'Martin Essono',
    scheduledDate: '12 Jun 2025 14:00',
    visitType: 'Verification Visit',
    notes: 'Completed. All 24 GPS points submitted.'
  },
  {
    id: 'ASN-010',
    parcelId: 'CM-2852',
    status: 'in progress',
    priority: 'high priority',
    surveyor: 'Paul Biya Jr',
    scheduledDate: '10 Jun 2025 10:30',
    visitType: 'Dispute Investigation',
    notes: 'Boundary dispute between CM-2852 and CM-2853.'
  },
  {
    id: 'ASN-009',
    parcelId: 'CM-2850',
    status: 'completed',
    priority: 'low priority',
    surveyor: 'Cécile Ondoua',
    scheduledDate: '05 Jun 2025 11:00',
    visitType: 'Initial Survey',
    notes: 'Standard GIS field check on parcel boundaries.'
  }
]

const SurveyorAssaignmentPage = () => {
  const [surveyors, setSurveyors] = useState<Surveyor[]>(initialSurveyors)
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in progress' | 'completed' | 'cancelled'>('all')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)

  // Filter assignments by tab
  const filteredAssignments = assignments.filter((asn) => {
    if (activeTab === 'all') return true
    return asn.status === activeTab
  })

  const handleCreateAssignment = (newAsn: Omit<Assignment, 'id'>) => {
    const created: Assignment = {
      ...newAsn,
      id: `ASN-0${8 + assignments.length + 1}`
    }

    // Update active count for surveyor
    setSurveyors(prev => prev.map(s => {
      if (s.name === newAsn.surveyor) {
        return {
          ...s,
          activeCount: s.activeCount + 1,
          status: s.status === 'offline' ? 'offline' : 'busy'
        }
      }
      return s
    }))

    setAssignments([created, ...assignments])
    setIsCreateModalOpen(false)
  }

  const handleUpdateAssignment = (updatedAsn: Assignment) => {
    // If surveyor changed, adjust stats
    const oldAsn = assignments.find(a => a.id === updatedAsn.id)
    if (oldAsn && oldAsn.surveyor !== updatedAsn.surveyor) {
      setSurveyors(prev => prev.map(s => {
        let sc = { ...s }
        if (s.name === oldAsn.surveyor) {
          sc.activeCount = Math.max(0, s.activeCount - 1)
          if (sc.activeCount === 0 && sc.status !== 'offline') sc.status = 'available'
        }
        if (s.name === updatedAsn.surveyor) {
          sc.activeCount = s.activeCount + 1
          if (sc.status !== 'offline') sc.status = 'busy'
        }
        return sc
      }))
    }

    setAssignments(assignments.map(a => a.id === updatedAsn.id ? updatedAsn : a))
    setEditingAssignment(null)
  }

  const handleCancelAssignment = (id: string) => {
    if (confirm('Are you sure you want to cancel this surveyor assignment?')) {
      const oldAsn = assignments.find(a => a.id === id)
      if (oldAsn) {
        setSurveyors(prev => prev.map(s => {
          if (s.name === oldAsn.surveyor) {
            const ac = Math.max(0, s.activeCount - 1)
            return {
              ...s,
              activeCount: ac,
              status: ac === 0 && s.status !== 'offline' ? 'available' as const : s.status
            }
          }
          return s
        }))
      }
      setAssignments(assignments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    }
  }

  return (
    <DashboardChildrenLayout title="Surveyor Assignment" subtitle="Assign surveyors to parcels and manage field visit scheduling">
      
      {/* Surveyor Roster section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-4 select-none">Surveyor Roster</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {surveyors.map((s) => (
            <div 
              key={s.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Name & Badge header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-100 select-none shrink-0">
                    {s.initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-sm truncate">{s.name}</span>
                    <span
                      className={cn(
                        "self-start px-2 py-0.5 rounded text-[10px] font-bold mt-1 shadow-sm select-none",
                        s.status === 'available' && 'bg-emerald-50 text-emerald-600 border border-emerald-100',
                        s.status === 'busy' && 'bg-amber-50 text-amber-600 border border-amber-100',
                        s.status === 'offline' && 'bg-slate-50 text-slate-400 border border-slate-100'
                      )}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.specialty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{s.activeCount} active / {s.doneCount} done</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{s.rating}/5.0</span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Assign Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-1.5 self-start overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          {(['all', 'pending', 'in progress', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                activeTab === tab
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-650"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Surveyor</span>
        </button>
      </div>

      {/* Assignments list */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((asn) => (
            <div 
              key={asn.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column Information */}
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 font-mono">{asn.id}</span>
                  <span className="text-sm font-bold text-blue-600 font-mono">{asn.parcelId}</span>
                  
                  {/* Status Badge */}
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap",
                      asn.status === 'pending' && 'bg-amber-50 text-amber-600 border-amber-100',
                      asn.status === 'in progress' && 'bg-blue-50 text-blue-650 border-blue-100',
                      asn.status === 'completed' && 'bg-emerald-50 text-emerald-650 border-emerald-100',
                      asn.status === 'cancelled' && 'bg-slate-50 text-slate-400 border-slate-100'
                    )}
                  >
                    {asn.status}
                  </span>

                  {/* Priority Badge */}
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap",
                      asn.priority === 'high priority' && 'bg-rose-50 text-rose-650 border-rose-100',
                      asn.priority === 'medium priority' && 'bg-amber-50 text-amber-750 border-amber-100',
                      asn.priority === 'low priority' && 'bg-slate-50 text-slate-550 border-slate-100'
                    )}
                  >
                    {asn.priority}
                  </span>
                </div>

                {/* Sub info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">👤</span>
                    <span>{asn.surveyor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asn.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asn.visitType}</span>
                  </div>
                </div>

                {/* Notes instructions */}
                {asn.notes && (
                  <p className="text-xs font-semibold text-slate-450 italic leading-relaxed pl-3 border-l-2 border-slate-200">
                    {asn.notes}
                  </p>
                )}
              </div>

              {/* Right Column Action triggers */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {asn.status === 'completed' || asn.status === 'cancelled' ? (
                  <span className="flex items-center justify-center p-2 text-emerald-600" title="Completed Task">
                    <Check className="w-5 h-5 rounded-full border border-emerald-100 bg-emerald-50 p-0.5" />
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingAssignment(asn)}
                      className="p-2 text-slate-550 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Assignment"
                    >
                      <Pencil className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleCancelAssignment(asn.id)}
                      className="p-2 text-slate-550 hover:text-red-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      title="Cancel Assignment"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl py-12 text-center text-sm font-semibold text-slate-400">
            No surveyor assignments found for this tab.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateAssignmentModal
          surveyors={surveyors}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAssignment}
        />
      )}

      {/* Edit Modal */}
      {editingAssignment && (
        <EditAssignmentModal
          assignment={editingAssignment}
          surveyors={surveyors}
          onClose={() => setEditingAssignment(null)}
          onSubmit={handleUpdateAssignment}
        />
      )}

    </DashboardChildrenLayout>
  )
}

// Create Assignment Modal Component
interface CreateAssignmentModalProps {
  surveyors: Surveyor[]
  onClose: () => void
  onSubmit: (data: Omit<Assignment, 'id'>) => void
}

const CreateAssignmentModal = ({
  surveyors,
  onClose,
  onSubmit
}: CreateAssignmentModalProps) => {
  const [parcelId, setParcelId] = useState('')
  const [selectedSurveyor, setSelectedSurveyor] = useState<Surveyor>(surveyors[0])
  const [visitType, setVisitType] = useState<Assignment['visitType']>('Initial Survey')
  const [priority, setPriority] = useState<Assignment['priority']>('medium priority')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [notes, setNotes] = useState('')
  const [sendSms, setSendSms] = useState(true)

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parcelId || !scheduledDate || !scheduledTime) {
      alert('Please fill out all required fields.')
      return
    }

    // Format date string from mm/dd/yyyy and hh:mm to e.g. "15 Jun 2025 09:00"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateObj = new Date(scheduledDate)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()
    const formattedDate = `${day} ${month} ${year} ${scheduledTime}`

    onSubmit({
      parcelId,
      status: 'pending',
      priority,
      surveyor: selectedSurveyor.name,
      scheduledDate: formattedDate,
      visitType,
      notes
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Assign Surveyor</h3>
          <p className="text-xs font-semibold text-slate-450 mt-1">Create a new surveyor assignment</p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Parcel ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Parcel ID *</label>
            <input
              type="text"
              required
              placeholder="e.g. CM-2849"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold font-mono"
            />
          </div>

          {/* Select Surveyor List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Select Surveyor *</label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {surveyors.map((s) => {
                const isSelected = selectedSurveyor.id === s.id
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSurveyor(s)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
                      isSelected 
                        ? "border-blue-600 bg-blue-50/10 shadow-sm ring-1 ring-blue-600" 
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 select-none border border-emerald-100">
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs truncate">{s.name}</span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider",
                            s.status === 'available' && 'bg-emerald-50 text-emerald-600 border border-emerald-100',
                            s.status === 'busy' && 'bg-amber-50 text-amber-600 border border-amber-100',
                            s.status === 'offline' && 'bg-slate-50 text-slate-400 border border-slate-100'
                          )}
                        >
                          {s.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5 leading-tight truncate">
                        {s.region} · {s.specialty} · {s.activeCount} active · ⭐ {s.rating}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Visit Type & Priority dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700">Visit Type</label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as Assignment['visitType'])}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold"
              >
                {['Initial Survey', 'Verification Visit', 'Dispute Investigation', 'Final Assessment'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Assignment['priority'])}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold"
              >
                <option value="low priority">Low</option>
                <option value="medium priority">Medium</option>
                <option value="high priority">High</option>
              </select>
            </div>
          </div>

          {/* Scheduled Date & Time fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 font-mono">Date *</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold font-mono"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 font-mono">Time *</label>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Notes / Instructions</label>
            <textarea
              rows={3}
              placeholder="Special instructions for the surveyor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          {/* SMS checkbox card */}
          <div 
            onClick={() => setSendSms(!sendSms)}
            className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-[11px] font-bold text-blue-800 leading-tight">Send SMS notification to surveyor</span>
            </div>
            <input
              type="checkbox"
              checked={sendSms}
              onChange={() => {}} // handled by div click
              className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer text-center shadow-sm"
            >
              Create Assignment
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// Edit Assignment Modal Component
interface EditAssignmentModalProps {
  assignment: Assignment
  surveyors: Surveyor[]
  onClose: () => void
  onSubmit: (data: Assignment) => void
}

const EditAssignmentModal = ({
  assignment,
  surveyors,
  onClose,
  onSubmit
}: EditAssignmentModalProps) => {
  const [formData, setFormData] = useState<Assignment>({ ...assignment })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.parcelId || !formData.scheduledDate) {
      alert('Please fill out all required fields.')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Edit Assignment</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Parcel ID *</label>
            <input
              type="text"
              required
              placeholder="e.g. CM-2849"
              value={formData.parcelId}
              onChange={(e) => setFormData({ ...formData, parcelId: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Select Surveyor *</label>
            <select
              value={formData.surveyor}
              onChange={(e) => setFormData({ ...formData, surveyor: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold"
            >
              {surveyors.map((s) => (
                <option key={s.id} value={s.name}>{s.name} ({s.status})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Visit Type</label>
              <select
                value={formData.visitType}
                onChange={(e) => setFormData({ ...formData, visitType: e.target.value as Assignment['visitType'] })}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold"
              >
                {['Initial Survey', 'Verification Visit', 'Dispute Investigation', 'Final Assessment'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Assignment['priority'] })}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold"
              >
                <option value="low priority">Low</option>
                <option value="medium priority">Medium</option>
                <option value="high priority">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-mono">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Assignment['status'] })}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-mono">Scheduled Date & Time *</label>
              <input
                type="text"
                required
                placeholder="e.g. 15 Jun 2025 09:00"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Notes / Instructions</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-650 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer text-center shadow-sm"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default SurveyorAssaignmentPage
