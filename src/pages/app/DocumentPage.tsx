"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Search, ChevronDown, Check, X, Download, FileText, Eye, Archive, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface DocumentItem {
  id: string
  name: string
  type: 'Title Deed' | 'Survey Plan' | 'ID Document' | 'Tax Clearance' | 'Photo Evidence'
  parcelId: string
  owner: string
  status: 'Approved' | 'Pending' | 'Rejected' | 'Archived'
  date: string
  size?: string
}

const initialDocuments: DocumentItem[] = [
  {
    id: 'DOC-101',
    name: 'Title_Deed_CM2847.pdf',
    type: 'Title Deed',
    parcelId: 'CM-2847',
    owner: 'Pierre Mballa',
    status: 'Approved',
    date: '10 Jun 2025',
    size: '2.4 MB'
  },
  {
    id: 'DOC-102',
    name: 'Survey_Plan_CM2849.pdf',
    type: 'Survey Plan',
    parcelId: 'CM-2849',
    owner: 'Jean-Pierre Nkodo',
    status: 'Pending',
    date: '08 Jun 2025',
    size: '4.1 MB'
  },
  {
    id: 'DOC-103',
    name: 'NationalID_Fouda.jpg',
    type: 'ID Document',
    parcelId: 'CM-2848',
    owner: 'Amina Fouda',
    status: 'Rejected',
    date: '05 Jun 2025',
    size: '1.2 MB'
  },
  {
    id: 'DOC-104',
    name: 'TaxClear_Tanda.pdf',
    type: 'Tax Clearance',
    parcelId: 'CM-2850',
    owner: 'Grace Tanda',
    status: 'Approved',
    date: '01 Jun 2025',
    size: '850 KB'
  },
  {
    id: 'DOC-105',
    name: 'Photo_CM2852.jpg',
    type: 'Photo Evidence',
    parcelId: 'CM-2852',
    owner: 'Halima Bello',
    status: 'Pending',
    date: '28 May 2025',
    size: '3.7 MB'
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
        <span className="truncate">{selected === 'All' || selected === 'Doc Type' || selected === 'Date Range' ? label : selected}</span>
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

const DocumentPage = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('Doc Type')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal / Drawer state
  const [activeDrawerDoc, setActiveDrawerDoc] = useState<DocumentItem | null>(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [docToReject, setDocToReject] = useState<DocumentItem | null>(null)

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
  const handleDateChange = (val: string) => {
    setDateFilter(val)
    setCurrentPage(1)
  }

  // Filter logic
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.parcelId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === 'Doc Type' || doc.type === typeFilter
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter

    let matchesDate = true
    if (dateFilter === 'This Week') {
      matchesDate = doc.date.includes('Jun 2025')
    } else if (dateFilter === 'This Month') {
      matchesDate = doc.date.includes('Jun 2025') || doc.date.includes('May 2025')
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  // Pagination
  const totalEntries = filteredDocs.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = paginatedDocs.map(d => d.id)
      setSelectedIds(ids)
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(x => x !== id))
    }
  }

  // Individual Actions
  const handleApproveDoc = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'Approved' } : d))
    if (activeDrawerDoc && activeDrawerDoc.id === id) {
      setActiveDrawerDoc(prev => prev ? { ...prev, status: 'Approved' } : null)
    }
  }

  const handleOpenRejectModal = (doc: DocumentItem) => {
    setDocToReject(doc)
    setRejectionReason('')
    setIsRejectModalOpen(true)
  }

  const handleConfirmReject = () => {
    if (!docToReject) return
    setDocuments(prev => prev.map(d => d.id === docToReject.id ? { ...d, status: 'Rejected' } : d))
    if (activeDrawerDoc && activeDrawerDoc.id === docToReject.id) {
      setActiveDrawerDoc(prev => prev ? { ...prev, status: 'Rejected' } : null)
    }
    setIsRejectModalOpen(false)
    setDocToReject(null)
  }

  const handleArchiveDoc = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'Archived' } : d))
    if (activeDrawerDoc && activeDrawerDoc.id === id) {
      setActiveDrawerDoc(prev => prev ? { ...prev, status: 'Archived' } : null)
    }
  }

  // Bulk Actions
  const handleBulkApprove = () => {
    setDocuments(prev => prev.map(d => selectedIds.includes(d.id) ? { ...d, status: 'Approved' } : d))
    setSelectedIds([])
  }

  const handleBulkReject = () => {
    setDocuments(prev => prev.map(d => selectedIds.includes(d.id) ? { ...d, status: 'Rejected' } : d))
    setSelectedIds([])
  }

  const handleBulkArchive = () => {
    setDocuments(prev => prev.map(d => selectedIds.includes(d.id) ? { ...d, status: 'Archived' } : d))
    setSelectedIds([])
  }

  return (
    <DashboardChildrenLayout title="Document Management" subtitle="Review, approve, and manage uploaded documents">
      
      {/* Split Layout Container */}
      <div className="flex gap-6 items-start relative w-full h-full">
        
        {/* Main Content Table Container */}
        <div className={cn("flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 transition-all duration-300", activeDrawerDoc ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full")}>
          
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

              {/* Doc Type filter */}
              <CustomFilterDropdown
                label="Doc Type"
                header="Doc Type"
                options={['Doc Type', 'Title Deed', 'Survey Plan', 'ID Document', 'Tax Clearance', 'Photo Evidence']}
                selected={typeFilter}
                onSelect={handleTypeChange}
              />

              {/* Status filter */}
              <CustomFilterDropdown
                label="All Statuses"
                header="All Statuses"
                options={['All', 'Approved', 'Pending', 'Rejected', 'Archived']}
                selected={statusFilter}
                onSelect={handleStatusChange}
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
          </div>

          {/* Bulk Action Bar (shows when selectedIds is not empty) */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 rounded-xl px-4 py-3 mb-6 animate-in slide-in-from-top duration-200">
              <span className="text-xs font-bold text-emerald-800">
                {selectedIds.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkApprove}
                  className="flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Approve
                </button>
                <button
                  onClick={handleBulkReject}
                  className="flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-red-650 hover:bg-red-700 text-white rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Reject
                </button>
                <button
                  onClick={handleBulkArchive}
                  className="flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Archive
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-4 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedDocs.length > 0 && paginatedDocs.every(d => selectedIds.includes(d.id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Document Name</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Type</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Parcel</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Owner</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Date</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedDocs.length > 0 ? (
                  paginatedDocs.map((doc) => {
                    const isSelected = selectedIds.includes(doc.id)
                    const isRowOpen = activeDrawerDoc?.id === doc.id
                    return (
                      <tr 
                        key={doc.id}
                        className={cn(
                          "hover:bg-slate-50/20 transition-colors cursor-pointer",
                          isRowOpen && "bg-blue-50/25"
                        )}
                        onClick={() => setActiveDrawerDoc(doc)}
                      >
                        {/* Checkbox column */}
                        <td className="py-4 px-4 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectOne(doc.id, e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Document name */}
                        <td className="py-4 px-4 text-sm font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📄</span>
                            <span className="hover:underline">{doc.name}</span>
                          </div>
                        </td>

                        {/* Document type */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-650">
                          {doc.type}
                        </td>

                        {/* Parcel link */}
                        <td className="py-4 px-4 text-sm font-bold text-blue-600 font-mono">
                          {doc.parcelId}
                        </td>

                        {/* Owner */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {doc.owner}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[11px] font-bold border whitespace-nowrap",
                              doc.status === 'Approved' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                              doc.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-100',
                              doc.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-100',
                              doc.status === 'Archived' && 'bg-slate-50 text-slate-500 border-slate-100'
                            )}
                          >
                            {doc.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-650">
                          {doc.date}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Approve */}
                            <button
                              onClick={() => handleApproveDoc(doc.id)}
                              disabled={doc.status === 'Approved'}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors cursor-pointer",
                                doc.status === 'Approved' 
                                  ? "text-slate-300 cursor-not-allowed" 
                                  : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                              )}
                              title="Approve Document"
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() => handleOpenRejectModal(doc)}
                              disabled={doc.status === 'Rejected'}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors cursor-pointer",
                                doc.status === 'Rejected'
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              )}
                              title="Reject Document"
                            >
                              <X className="w-4.5 h-4.5" />
                            </button>

                            {/* Download */}
                            <button
                              onClick={() => alert(`Downloading ${doc.name}...`)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Download File"
                            >
                              <Download className="w-4.5 h-4.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                      No documents found matching the search criteria.
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

        {/* Side Details Panel */}
        {activeDrawerDoc && (
          <DocumentDetailsDrawer
            key={activeDrawerDoc.id}
            doc={activeDrawerDoc}
            onClose={() => setActiveDrawerDoc(null)}
            onApprove={handleApproveDoc}
            onReject={handleOpenRejectModal}
            onArchive={handleArchiveDoc}
          />
        )}

      </div>

      {/* Reject Reason Confirmation Modal */}
      {isRejectModalOpen && docToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Reject Document</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Please provide a reason for rejecting {docToReject.name}.</p>
            </div>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., File is blurry, incorrect land parcel reference..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false)
                  setDocToReject(null)
                }}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-lg bg-red-650 hover:bg-red-700 text-white font-semibold text-xs transition-all cursor-pointer text-center shadow-sm"
              >
                Reject Document
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardChildrenLayout>
  )
}

// Interactive Document Details Drawer Component
interface DocumentDetailsDrawerProps {
  doc: DocumentItem
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (doc: DocumentItem) => void
  onArchive: (id: string) => void
}

const DocumentDetailsDrawer = ({
  doc,
  onClose,
  onApprove,
  onReject,
  onArchive
}: DocumentDetailsDrawerProps) => {
  return (
    <div className="w-full lg:w-[39%] shrink-0 border border-slate-100 bg-white rounded-2xl shadow-xl overflow-hidden p-6 animate-in slide-in-from-right duration-300 relative flex flex-col max-h-[85vh] sticky top-20">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Drawer Header */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Document Review</h3>
      </div>

      {/* File Icon & Name Display */}
      <div className="flex flex-col items-center text-center gap-3 mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 relative overflow-hidden group">
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner select-none transition-transform group-hover:scale-105 duration-200">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 break-all px-2">{doc.name}</h4>
          <p className="text-[11px] font-semibold text-slate-400">{doc.size || 'Unknown Size'}</p>
        </div>
        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border shadow-sm select-none",
            doc.status === 'Approved' && 'bg-emerald-50 text-emerald-650 border-emerald-100',
            doc.status === 'Pending' && 'bg-amber-50 text-amber-655 border-amber-100',
            doc.status === 'Rejected' && 'bg-rose-50 text-rose-655 border-rose-100',
            doc.status === 'Archived' && 'bg-slate-50 text-slate-550 border-slate-100'
          )}
        >
          {doc.status}
        </span>
      </div>

      {/* Metadata Detail Fields */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
        
        <div className="space-y-3.5 text-xs font-semibold">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Document ID</span>
            <span className="text-slate-700 font-bold font-mono">{doc.id}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Document Type</span>
            <span className="text-slate-700 font-bold">{doc.type}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Associated Land Parcel</span>
            <span className="text-blue-600 font-bold font-mono">{doc.parcelId}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Owner / Submitter</span>
            <span className="text-slate-700 font-bold">{doc.owner}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Uploaded Date</span>
            <span className="text-slate-700 font-bold">{doc.date}</span>
          </div>
        </div>

        {/* Security / Verification Badge */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-4.5 h-4.5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-[11px] font-semibold text-blue-800 leading-tight">
            This document has been secure-scanned by LandSecure virus checker and is safe to open.
          </div>
        </div>

      </div>

      {/* Actions Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        
        {doc.status === 'Pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject(doc)}
              className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-rose-600 border border-slate-200 font-bold text-xs transition-all cursor-pointer text-center"
            >
              Reject Document
            </button>
            <button
              onClick={() => onApprove(doc.id)}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Approve Document</span>
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => alert(`Opening secure preview for ${doc.name}...`)}
            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-[11px] transition-all cursor-pointer text-center flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Preview</span>
          </button>
          <button
            onClick={() => onArchive(doc.id)}
            disabled={doc.status === 'Archived'}
            className={cn(
              "flex-1 py-2 rounded-xl border font-bold text-[11px] transition-all cursor-pointer text-center flex items-center justify-center gap-1",
              doc.status === 'Archived'
                ? "bg-slate-50 border-slate-150 text-slate-400 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
        </div>

      </div>

    </div>
  )
}

export default DocumentPage
