"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Search, Eye, Pencil, Trash2, X, ChevronDown, Calendar, CheckSquare, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface SiteVisit {
  id: string
  parcelId: string
  surveyor: string
  scheduledDate: string // e.g., "15 Jun 2025 09:00"
  status: 'Scheduled' | 'Completed' | 'In Progress' | 'Cancelled'
  jobType: 'Initial Survey' | 'Verification' | 'Dispute Check' | 'Final Assessment'
  notes: string
}

const initialSiteVisits: SiteVisit[] = [
  {
    id: 'VST-042',
    parcelId: 'CM-2849',
    surveyor: 'Paul Biya Jr',
    scheduledDate: '15 Jun 2025 09:00',
    status: 'Scheduled',
    jobType: 'Initial Survey',
    notes: 'Verify outer boundaries bordering public road. Ensure coordinates match local municipal blueprint.'
  },
  {
    id: 'VST-041',
    parcelId: 'CM-2847',
    surveyor: 'Martin Essono',
    scheduledDate: '12 Jun 2025 14:00',
    status: 'Completed',
    jobType: 'Verification',
    notes: 'Confirm construction foundation boundaries match the submitted deed dimensions.'
  },
  {
    id: 'VST-040',
    parcelId: 'CM-2852',
    surveyor: 'Paul Biya Jr',
    scheduledDate: '10 Jun 2025 10:30',
    status: 'In Progress',
    jobType: 'Dispute Check',
    notes: 'Assess the overlap claim made by the neighbors regarding the concrete perimeter fence.'
  },
  {
    id: 'VST-039',
    parcelId: 'CM-2850',
    surveyor: 'Cécile Ondoua',
    scheduledDate: '05 Jun 2025 11:00',
    status: 'Completed',
    jobType: 'Final Assessment',
    notes: 'Perform standard GIS tracking and file coordinates to the central database server.'
  },
  {
    id: 'VST-038',
    parcelId: 'CM-2848',
    surveyor: 'Martin Essono',
    scheduledDate: '01 Jun 2025 09:30',
    status: 'Completed',
    jobType: 'Initial Survey',
    notes: 'Establish primary control points on undeveloped forest boundary line.'
  }
]

interface CustomFilterDropdownProps {
  label: string
  header: string
  options: string[]
  selected: string
  onSelect: (val: string) => void
}

const CustomFilterDropdown = ({
  label,
  header,
  options,
  selected,
  onSelect
}: CustomFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all cursor-pointer w-40 sm:w-44 leading-relaxed"
      >
        <span className="truncate">{selected === 'All' || selected === 'Assignee' || selected === 'Date Range' ? label : selected}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="bg-blue-600 text-white px-4 py-2 text-xs font-bold text-center border-b border-blue-400/20 tracking-wider uppercase">
            {header}
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onSelect(opt)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors",
                  selected === opt && "bg-slate-50 text-blue-600 font-bold"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const SiteVisitsPage = () => {
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(initialSiteVisits)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [surveyorFilter, setSurveyorFilter] = useState('Assignee')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Modals / Drawer State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editVisitData, setEditVisitData] = useState<SiteVisit | null>(null)
  const [activeDrawerVisit, setActiveDrawerVisit] = useState<SiteVisit | null>(null)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }
  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }
  const handleSurveyorChange = (val: string) => {
    setSurveyorFilter(val)
    setCurrentPage(1)
  }
  const handleDateChange = (val: string) => {
    setDateFilter(val)
    setCurrentPage(1)
  }

  // Filter site visits
  const filteredVisits = siteVisits.filter((visit) => {
    const matchesSearch =
      visit.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.surveyor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || visit.status === statusFilter
    const matchesSurveyor = surveyorFilter === 'Assignee' || visit.surveyor === surveyorFilter

    // Simple date range mock checks
    let matchesDate = true
    if (dateFilter === 'This Week') {
      matchesDate = visit.scheduledDate.includes('Jun 2025')
    } else if (dateFilter === 'This Month') {
      matchesDate = visit.scheduledDate.includes('Jun 2025')
    }

    return matchesSearch && matchesStatus && matchesSurveyor && matchesDate
  })

  // Pagination
  const totalEntries = filteredVisits.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedVisits = filteredVisits.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleCreateVisit = (newVisit: Omit<SiteVisit, 'id'>) => {
    const created: SiteVisit = {
      ...newVisit,
      id: `VST-0${38 + siteVisits.length + 1}`
    }
    setSiteVisits([created, ...siteVisits])
    setIsAddModalOpen(false)
  }

  const handleUpdateVisit = (updatedVisit: SiteVisit) => {
    setSiteVisits(siteVisits.map(v => v.id === updatedVisit.id ? updatedVisit : v))
    setEditVisitData(null)
    if (activeDrawerVisit && activeDrawerVisit.id === updatedVisit.id) {
      setActiveDrawerVisit(updatedVisit)
    }
  }

  const handleDeleteVisit = (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled site visit?')) {
      setSiteVisits(siteVisits.filter(v => v.id !== id))
      setActiveDrawerVisit(null)
    }
  }

  const handleStatusTransition = (visit: SiteVisit, newStatus: SiteVisit['status']) => {
    const updated: SiteVisit = {
      ...visit,
      status: newStatus
    }
    setSiteVisits(siteVisits.map(v => v.id === visit.id ? updated : v))
    if (activeDrawerVisit && activeDrawerVisit.id === visit.id) {
      setActiveDrawerVisit(updated)
    }
  }

  return (
    <DashboardChildrenLayout title="Site Visits" subtitle="Schedule and track field surveyor visits">
      
      {/* Split Layout Container */}
      <div className="flex gap-6 items-start relative w-full h-full">
        
        {/* Main Content Table */}
        <div className={cn("flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 transition-all duration-300", activeDrawerVisit ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full")}>
          
          {/* Action / Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
              
              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search parcels..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold leading-relaxed"
                />
              </div>

              {/* Status filter */}
              <CustomFilterDropdown
                label="All Statuses"
                header="All Statuses"
                options={['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled']}
                selected={statusFilter}
                onSelect={handleStatusChange}
              />

              {/* Assignee filter */}
              <CustomFilterDropdown
                label="Assignee"
                header="Assignee"
                options={['Assignee', 'Paul Biya Jr', 'Martin Essono', 'Cécile Ondoua']}
                selected={surveyorFilter}
                onSelect={handleSurveyorChange}
              />

              {/* Date Range filter */}
              <CustomFilterDropdown
                label="Date Range"
                header="Date Range"
                options={['Date Range', 'This Week', 'This Month']}
                selected={dateFilter}
                onSelect={handleDateChange}
              />

            </div>

            {/* Schedule Visit Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm w-full lg:w-auto shrink-0"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Schedule Visit</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Visit ID</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Parcel</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Surveyor</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Scheduled Date</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedVisits.length > 0 ? (
                  paginatedVisits.map((visit) => {
                    const isSelected = activeDrawerVisit?.id === visit.id
                    return (
                      <tr 
                        key={visit.id} 
                        className={cn(
                          "hover:bg-slate-50/20 transition-colors cursor-pointer",
                          isSelected && "bg-blue-50/25"
                        )}
                        onClick={() => setActiveDrawerVisit(visit)}
                      >
                        {/* Visit ID */}
                        <td className="py-4 px-4 text-sm font-bold text-slate-900 font-mono">
                          {visit.id}
                        </td>

                        {/* Parcel ID link */}
                        <td className="py-4 px-4 text-sm font-bold text-blue-600 font-mono">
                          {visit.parcelId}
                        </td>

                        {/* Surveyor */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {visit.surveyor}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-sm font-medium text-slate-650">
                          {visit.scheduledDate}
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[11px] font-bold border whitespace-nowrap",
                              visit.status === 'Scheduled' && 'bg-purple-50 text-purple-600 border-purple-100',
                              visit.status === 'In Progress' && 'bg-blue-50 text-blue-600 border-blue-100',
                              visit.status === 'Completed' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                              visit.status === 'Cancelled' && 'bg-slate-50 text-slate-500 border-slate-100'
                            )}
                          >
                            {visit.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View details */}
                            <button
                              onClick={() => setActiveDrawerVisit(visit)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => setEditVisitData(visit)}
                              className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                              title="Edit Record"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Trash */}
                            <button
                              onClick={() => handleDeleteVisit(visit.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm font-semibold text-slate-400">
                      No scheduled site visits found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Custom Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalEntries={totalEntries}
            pageSize={pageSize}
          />

        </div>

        {/* Side Panel Drawer */}
        {activeDrawerVisit && (
          <SiteVisitDetailsDrawer
            key={activeDrawerVisit.id}
            visit={activeDrawerVisit}
            onClose={() => setActiveDrawerVisit(null)}
            onEdit={(v) => setEditVisitData(v)}
            onStatusTransition={handleStatusTransition}
            onDelete={handleDeleteVisit}
          />
        )}

      </div>

      {/* Schedule Visit Modal */}
      {isAddModalOpen && (
        <ScheduleVisitModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateVisit}
        />
      )}

      {/* Edit Visit Modal */}
      {editVisitData && (
        <EditVisitModal
          visit={editVisitData}
          onClose={() => setEditVisitData(null)}
          onSubmit={handleUpdateVisit}
        />
      )}

    </DashboardChildrenLayout>
  )
}

// Side Drawer Details component
interface SiteVisitDetailsDrawerProps {
  visit: SiteVisit
  onClose: () => void
  onEdit: (v: SiteVisit) => void
  onStatusTransition: (v: SiteVisit, s: SiteVisit['status']) => void
  onDelete: (id: string) => void
}

const SiteVisitDetailsDrawer = ({
  visit,
  onClose,
  onEdit,
  onStatusTransition,
  onDelete
}: SiteVisitDetailsDrawerProps) => {
  return (
    <div className="w-full lg:w-[39%] shrink-0 border border-slate-100 bg-white rounded-2xl shadow-xl overflow-hidden p-6 animate-in slide-in-from-right duration-300 relative flex flex-col max-h-[85vh] sticky top-20">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Drawer Title */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Site Visit Details</h3>
      </div>

      {/* Header Info */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner select-none">
          <Calendar className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-slate-900 mt-1">{visit.id}</h4>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white bg-slate-900 shadow-sm">
            {visit.parcelId}
          </span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded text-[10px] font-bold border",
              visit.status === 'Scheduled' && 'bg-purple-50 text-purple-655 border-purple-100',
              visit.status === 'In Progress' && 'bg-blue-50 text-blue-655 border-blue-100',
              visit.status === 'Completed' && 'bg-emerald-50 text-emerald-655 border-emerald-100',
              visit.status === 'Cancelled' && 'bg-slate-50 text-slate-550 border-slate-100'
            )}
          >
            {visit.status}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
        
        <div className="space-y-3.5 text-xs font-semibold">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Assigned Surveyor</span>
            <span className="text-slate-700 font-bold">{visit.surveyor}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Job Category</span>
            <span className="text-slate-700 font-bold">{visit.jobType}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Scheduled Date & Time</span>
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{visit.scheduledDate}</span>
            </div>
          </div>
        </div>

        {/* Surveyor Notes */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[10px]">Surveyor Instructions</h5>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">{visit.notes}</p>
        </div>

      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        {visit.status === 'Scheduled' && (
          <button
            onClick={() => onStatusTransition(visit, 'In Progress')}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all cursor-pointer text-center shadow-sm"
          >
            Start Field Assessment
          </button>
        )}

        {visit.status === 'In Progress' && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusTransition(visit, 'Completed')}
              className="flex-1 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-950 transition-all cursor-pointer text-center shadow-sm"
            >
              Complete Visit
            </button>
            <button
              onClick={() => onStatusTransition(visit, 'Cancelled')}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer text-center"
            >
              Cancel Visit
            </button>
          </div>
        )}

        {visit.status === 'Scheduled' && (
          <button
            onClick={() => onStatusTransition(visit, 'Cancelled')}
            className="w-full py-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer text-center border border-slate-100"
          >
            Cancel Visit
          </button>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={() => onEdit(visit)}
            className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[11px] hover:bg-slate-100 transition-all cursor-pointer text-center"
          >
            Edit Visit
          </button>
          <button
            onClick={() => onDelete(visit.id)}
            className="flex-1 py-2 rounded-xl bg-red-50 text-red-650 border border-red-100 font-bold text-[11px] hover:bg-red-100 transition-all cursor-pointer text-center"
          >
            Delete Record
          </button>
        </div>
      </div>

    </div>
  )
}

// Create Modal
interface ScheduleVisitModalProps {
  onClose: () => void
  onSubmit: (data: Omit<SiteVisit, 'id'>) => void
}

const ScheduleVisitModal = ({ onClose, onSubmit }: ScheduleVisitModalProps) => {
  const [formData, setFormData] = useState({
    parcelId: '',
    surveyor: 'Paul Biya Jr',
    scheduledDate: '15 Jun 2025 09:00',
    status: 'Scheduled' as SiteVisit['status'],
    jobType: 'Initial Survey' as SiteVisit['jobType'],
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.parcelId || !formData.notes) {
      alert('Please fill out all required fields.')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Schedule Site Visit</h3>
          <p className="text-xs font-semibold text-slate-450 mt-1">Assign surveyors to land parcels</p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Parcel ID</label>
            <input
              type="text"
              name="parcelId"
              required
              placeholder="e.g., CM-2849"
              value={formData.parcelId}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Assign Surveyor</label>
            <select
              name="surveyor"
              value={formData.surveyor}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            >
              {['Paul Biya Jr', 'Martin Essono', 'Cécile Ondoua'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Scheduled Date & Time</label>
              <input
                type="text"
                name="scheduledDate"
                required
                placeholder="e.g. 15 Jun 2025 09:00"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Initial Survey', 'Verification', 'Dispute Check', 'Final Assessment'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Notes / Instructions</label>
            <textarea
              name="notes"
              rows={3}
              required
              placeholder="General instructions for the surveyor..."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5">
            <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-[11px] font-semibold text-blue-800 leading-tight">
              Send SMS notification to surveyor and parcel owners automatically.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
              Schedule Visit
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// Edit Modal
interface EditVisitModalProps {
  visit: SiteVisit
  onClose: () => void
  onSubmit: (data: SiteVisit) => void
}

const EditVisitModal = ({ visit, onClose, onSubmit }: EditVisitModalProps) => {
  const [formData, setFormData] = useState<SiteVisit>({ ...visit })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.parcelId || !formData.notes) {
      alert('Please fill out all required fields.')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Edit Site Visit</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Parcel ID</label>
            <input
              type="text"
              name="parcelId"
              required
              placeholder="e.g., CM-2849"
              value={formData.parcelId}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Assign Surveyor</label>
            <select
              name="surveyor"
              value={formData.surveyor}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            >
              {['Paul Biya Jr', 'Martin Essono', 'Cécile Ondoua'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Scheduled Date & Time</label>
              <input
                type="text"
                name="scheduledDate"
                required
                placeholder="e.g. 15 Jun 2025 09:00"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Initial Survey', 'Verification', 'Dispute Check', 'Final Assessment'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Notes / Instructions</label>
            <textarea
              name="notes"
              rows={3}
              required
              placeholder="General instructions for the surveyor..."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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

export default SiteVisitsPage
