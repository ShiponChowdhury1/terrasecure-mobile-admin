"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Search, Eye, Pencil, Trash2, Download, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface Investigation {
  id: string
  associatedId: string // e.g., REG-1203 or CM-2847
  disputant: string
  investigator: string
  type: 'Boundary Overlap' | 'Ownership Claim' | 'Document Verification' | 'Encroachment'
  severity: 'High' | 'Medium' | 'Low'
  createdDate: string
  status: 'Pending' | 'Active' | 'Under Review' | 'Resolved'
  description: string
}

const initialInvestigations: Investigation[] = [
  {
    id: 'INV-204',
    associatedId: 'REG-1203',
    disputant: 'Samuel Kotto',
    investigator: 'Marie Nkodo',
    type: 'Boundary Overlap',
    severity: 'High',
    createdDate: '22 Jun 2026',
    status: 'Active',
    description: 'Reported overlap of approximately 50 square meters with the neighboring parcel registered under Jean Alima in Akwa district.'
  },
  {
    id: 'INV-203',
    associatedId: 'CM-2847',
    disputant: 'François Ngono',
    investigator: 'Jean Alima',
    type: 'Ownership Claim',
    severity: 'Medium',
    createdDate: '18 Jun 2026',
    status: 'Under Review',
    description: 'Dispute regarding the sales contract authenticity signed by the local chief. Currently verifying signatures with archives.'
  },
  {
    id: 'INV-202',
    associatedId: 'REG-1200',
    disputant: 'Pierre Mballa',
    investigator: 'Paul Biya Jr',
    type: 'Encroachment',
    severity: 'High',
    createdDate: '12 Jun 2026',
    status: 'Pending',
    description: 'Encroachment claim filed by the applicant. Neighbor has built a concrete boundary wall past the surveyed perimeter.'
  },
  {
    id: 'INV-201',
    associatedId: 'CM-2849',
    disputant: 'Grace Tanda',
    investigator: 'Marie Nkodo',
    type: 'Document Verification',
    severity: 'Low',
    createdDate: '05 Jun 2026',
    status: 'Resolved',
    description: 'Verify if the submitted land tax certificate is original. Documents verified and matched with state treasury records.'
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
        <span className="truncate">{selected === 'All' || selected === 'Severity' ? label : selected}</span>
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

const InvestigationsPage = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>(initialInvestigations)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('Severity')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Modals / Drawer state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editInvestigationData, setEditInvestigationData] = useState<Investigation | null>(null)
  const [activeDrawerInvestigation, setActiveDrawerInvestigation] = useState<Investigation | null>(null)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }
  const handleTypeChange = (val: string) => {
    setTypeFilter(val)
    setCurrentPage(1)
  }
  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }
  const handleSeverityChange = (val: string) => {
    setSeverityFilter(val)
    setCurrentPage(1)
  }

  // Filtering
  const filteredInvestigations = investigations.filter((inv) => {
    const matchesSearch =
      inv.disputant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.associatedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.investigator.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === 'All' || inv.type === typeFilter
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter
    const matchesSeverity = severityFilter === 'Severity' || inv.severity === severityFilter

    return matchesSearch && matchesType && matchesStatus && matchesSeverity
  })

  // Pagination calculations
  const totalEntries = filteredInvestigations.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedInvestigations = filteredInvestigations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleCreateInvestigation = (newInv: Omit<Investigation, 'id' | 'createdDate'>) => {
    const created: Investigation = {
      ...newInv,
      id: `INV-${204 + investigations.length + 1}`,
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    setInvestigations([created, ...investigations])
    setIsAddModalOpen(false)
  }

  const handleUpdateInvestigation = (updatedInv: Investigation) => {
    setInvestigations(investigations.map(inv => inv.id === updatedInv.id ? updatedInv : inv))
    setEditInvestigationData(null)
    if (activeDrawerInvestigation && activeDrawerInvestigation.id === updatedInv.id) {
      setActiveDrawerInvestigation(updatedInv)
    }
  }

  const handleDeleteInvestigation = (id: string) => {
    if (confirm('Are you sure you want to delete this investigation record?')) {
      setInvestigations(investigations.filter(inv => inv.id !== id))
      setActiveDrawerInvestigation(null)
    }
  }

  const handleStatusTransition = (inv: Investigation, newStatus: Investigation['status']) => {
    const updated: Investigation = {
      ...inv,
      status: newStatus
    }
    setInvestigations(investigations.map(i => i.id === inv.id ? updated : i))
    if (activeDrawerInvestigation && activeDrawerInvestigation.id === inv.id) {
      setActiveDrawerInvestigation(updated)
    }
  }

  return (
    <DashboardChildrenLayout title="Investigations" subtitle="Track and investigate boundary disputes and ownership claims">
      
      {/* Split Layout Container */}
      <div className="flex gap-6 items-start relative w-full h-full">
        
        {/* Main Table Panel */}
        <div className={cn("flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 transition-all duration-300", activeDrawerInvestigation ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full")}>
          
          {/* Action / Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
              
              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search disputes..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold leading-relaxed"
                />
              </div>

              {/* Type dropdown */}
              <CustomFilterDropdown
                label="All Types"
                header="All Types"
                options={['All', 'Boundary Overlap', 'Ownership Claim', 'Document Verification', 'Encroachment']}
                selected={typeFilter}
                onSelect={handleTypeChange}
              />

              {/* Statuses dropdown */}
              <CustomFilterDropdown
                label="All Statuses"
                header="All Statuses"
                options={['All', 'Pending', 'Active', 'Under Review', 'Resolved']}
                selected={statusFilter}
                onSelect={handleStatusChange}
              />

              {/* Severity dropdown */}
              <CustomFilterDropdown
                label="Severity"
                header="Severity"
                options={['Severity', 'High', 'Medium', 'Low']}
                selected={severityFilter}
                onSelect={handleSeverityChange}
              />

            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end shrink-0">
              <button
                onClick={() => alert('Exporting investigations data as CSV...')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>New Investigation</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Case ID</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Parcel / Registration ID</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Disputant Name</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Investigation Type</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Severity</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Investigator</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedInvestigations.length > 0 ? (
                  paginatedInvestigations.map((inv) => {
                    const isSelected = activeDrawerInvestigation?.id === inv.id
                    return (
                      <tr 
                        key={inv.id} 
                        className={cn(
                          "hover:bg-slate-50/20 transition-colors cursor-pointer",
                          isSelected && "bg-blue-50/25"
                        )}
                        onClick={() => setActiveDrawerInvestigation(inv)}
                      >
                        {/* Case ID */}
                        <td className="py-4 px-4 text-sm font-bold text-blue-600 font-mono">
                          {inv.id}
                        </td>

                        {/* Parcel ID */}
                        <td className="py-4 px-4 text-sm font-bold text-slate-900 font-mono">
                          {inv.associatedId}
                        </td>

                        {/* Disputant Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              {inv.disputant.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-bold text-slate-900 leading-tight">{inv.disputant}</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {inv.type}
                        </td>

                        {/* Severity Badges */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[10px] font-bold text-white shadow-sm whitespace-nowrap",
                              inv.severity === 'High' && 'bg-rose-600',
                              inv.severity === 'Medium' && 'bg-amber-500',
                              inv.severity === 'Low' && 'bg-slate-500'
                            )}
                          >
                            {inv.severity}
                          </span>
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[11px] font-bold border whitespace-nowrap",
                              inv.status === 'Pending' && 'bg-blue-50 text-blue-600 border-blue-100',
                              inv.status === 'Active' && 'bg-amber-50 text-amber-600 border-amber-100',
                              inv.status === 'Under Review' && 'bg-indigo-50 text-indigo-600 border-indigo-100',
                              inv.status === 'Resolved' && 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            )}
                          >
                            {inv.status}
                          </span>
                        </td>

                        {/* Assigned Investigator */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {inv.investigator}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View */}
                            <button
                              onClick={() => setActiveDrawerInvestigation(inv)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => setEditInvestigationData(inv)}
                              className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                              title="Edit Record"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Trash */}
                            <button
                              onClick={() => handleDeleteInvestigation(inv.id)}
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
                    <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                      No investigation records found matching your search.
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
        {activeDrawerInvestigation && (
          <InvestigationDetailsDrawer
            key={activeDrawerInvestigation.id}
            investigation={activeDrawerInvestigation}
            onClose={() => setActiveDrawerInvestigation(null)}
            onEdit={(inv) => setEditInvestigationData(inv)}
            onStatusTransition={handleStatusTransition}
            onDelete={handleDeleteInvestigation}
          />
        )}

      </div>

      {/* New Investigation Modal */}
      {isAddModalOpen && (
        <CreateInvestigationModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateInvestigation}
        />
      )}

      {/* Edit Investigation Modal */}
      {editInvestigationData && (
        <EditInvestigationModal
          investigation={editInvestigationData}
          onClose={() => setEditInvestigationData(null)}
          onSubmit={handleUpdateInvestigation}
        />
      )}

    </DashboardChildrenLayout>
  )
}

// Side Drawer Details component
interface InvestigationDetailsDrawerProps {
  investigation: Investigation
  onClose: () => void
  onEdit: (inv: Investigation) => void
  onStatusTransition: (inv: Investigation, s: Investigation['status']) => void
  onDelete: (id: string) => void
}

const InvestigationDetailsDrawer = ({
  investigation,
  onClose,
  onEdit,
  onStatusTransition,
  onDelete
}: InvestigationDetailsDrawerProps) => {
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
        <h3 className="text-lg font-bold text-slate-900">Investigation Case</h3>
      </div>

      {/* Case Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow select-none">
          {investigation.disputant.split(' ').map(n => n[0]).join('')}
        </div>
        <h4 className="text-base font-bold text-slate-900 mt-1">{investigation.disputant}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white bg-slate-900 shadow-sm">
            {investigation.id}
          </span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded text-[10px] font-bold border",
              investigation.status === 'Pending' && 'bg-blue-50 text-blue-650 border-blue-100',
              investigation.status === 'Active' && 'bg-amber-50 text-amber-650 border-amber-100',
              investigation.status === 'Under Review' && 'bg-indigo-50 text-indigo-650 border-indigo-100',
              investigation.status === 'Resolved' && 'bg-emerald-50 text-emerald-650 border-emerald-100'
            )}
          >
            {investigation.status}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
        
        <div className="space-y-3.5 text-xs font-semibold">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Case Type</span>
            <span className="text-slate-700 font-bold">{investigation.type}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Parcel / Reg Reference</span>
            <span className="text-blue-600 font-bold font-mono">{investigation.associatedId}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Severity / Urgency</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm",
              investigation.severity === 'High' && 'bg-rose-600',
              investigation.severity === 'Medium' && 'bg-amber-500',
              investigation.severity === 'Low' && 'bg-slate-500'
            )}>
              {investigation.severity}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Date Opened</span>
            <span className="text-slate-700 font-bold">{investigation.createdDate}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Assigned Investigator</span>
            <span className="text-slate-700 font-bold">{investigation.investigator}</span>
          </div>
        </div>

        {/* Case Description Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[10px]">Case Notes & Description</h5>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">{investigation.description}</p>
        </div>

      </div>

      {/* Actions Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        {investigation.status === 'Pending' && (
          <button
            onClick={() => onStatusTransition(investigation, 'Active')}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all cursor-pointer text-center"
          >
            Start Investigation
          </button>
        )}

        {investigation.status === 'Active' && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusTransition(investigation, 'Under Review')}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-750 transition-all cursor-pointer text-center"
            >
              Set Under Review
            </button>
            <button
              onClick={() => onStatusTransition(investigation, 'Resolved')}
              className="flex-1 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-950 transition-all cursor-pointer text-center"
            >
              Mark Resolved
            </button>
          </div>
        )}

        {investigation.status === 'Under Review' && (
          <button
            onClick={() => onStatusTransition(investigation, 'Resolved')}
            className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-950 transition-all cursor-pointer text-center"
          >
            Mark as Resolved
          </button>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={() => onEdit(investigation)}
            className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[11px] hover:bg-slate-100 transition-all cursor-pointer text-center"
          >
            Edit Record
          </button>
          <button
            onClick={() => onDelete(investigation.id)}
            className="flex-1 py-2 rounded-xl bg-red-50 text-red-650 border border-red-100 font-bold text-[11px] hover:bg-red-100 transition-all cursor-pointer text-center"
          >
            Delete
          </button>
        </div>
      </div>

    </div>
  )
}

// Create Modal
interface CreateInvestigationModalProps {
  onClose: () => void
  onSubmit: (data: Omit<Investigation, 'id' | 'createdDate'>) => void
}

const CreateInvestigationModal = ({ onClose, onSubmit }: CreateInvestigationModalProps) => {
  const [formData, setFormData] = useState({
    associatedId: '',
    disputant: '',
    investigator: 'Marie Nkodo',
    type: 'Boundary Overlap' as Investigation['type'],
    severity: 'Medium' as Investigation['severity'],
    status: 'Pending' as Investigation['status'],
    description: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.associatedId || !formData.disputant || !formData.description) {
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
          <h3 className="text-lg font-bold text-slate-900">New Investigation Case</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Parcel / Reg ID</label>
              <input
                type="text"
                name="associatedId"
                required
                placeholder="e.g. REG-1203"
                value={formData.associatedId}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Disputant Name</label>
              <input
                type="text"
                name="disputant"
                required
                placeholder="e.g. Pierre Mballa"
                value={formData.disputant}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Investigation Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Boundary Overlap', 'Ownership Claim', 'Document Verification', 'Encroachment'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Severity</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold font-bold"
              >
                {['High', 'Medium', 'Low'].map((sev) => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Assigned Investigator</label>
              <select
                name="investigator"
                value={formData.investigator}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Marie Nkodo', 'Jean Alima', 'Paul Biya Jr'].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Pending', 'Active', 'Under Review'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Case Description / Evidence Remarks</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Describe the nature of the overlap or dispute..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all cursor-pointer text-center"
            >
              Create Case
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// Edit Modal
interface EditInvestigationModalProps {
  investigation: Investigation
  onClose: () => void
  onSubmit: (data: Investigation) => void
}

const EditInvestigationModal = ({ investigation, onClose, onSubmit }: EditInvestigationModalProps) => {
  const [formData, setFormData] = useState<Investigation>({ ...investigation })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.associatedId || !formData.disputant || !formData.description) {
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
          <h3 className="text-lg font-bold text-slate-900">Edit Investigation</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Parcel / Reg ID</label>
              <input
                type="text"
                name="associatedId"
                required
                placeholder="e.g. REG-1203"
                value={formData.associatedId}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Disputant Name</label>
              <input
                type="text"
                name="disputant"
                required
                placeholder="e.g. Pierre Mballa"
                value={formData.disputant}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Investigation Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Boundary Overlap', 'Ownership Claim', 'Document Verification', 'Encroachment'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Severity</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold font-bold"
              >
                {['High', 'Medium', 'Low'].map((sev) => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Assigned Investigator</label>
              <select
                name="investigator"
                value={formData.investigator}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Marie Nkodo', 'Jean Alima', 'Paul Biya Jr'].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Case Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Pending', 'Active', 'Under Review', 'Resolved'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Case Description / Evidence Remarks</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Describe the nature of the overlap or dispute..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default InvestigationsPage
