"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Search, Eye, Download, X, ChevronDown, CreditCard, ShieldCheck, Check, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface Payment {
  id: string
  user: string
  parcelId: string
  amount: string
  type: 'Registration Fee' | 'Consultation Fee' | 'Transfer Tax' | 'Land Purchase' | 'Surveying Fee'
  status: 'Verified' | 'Pending' | 'Rejected'
  date: string
}

export interface PaymentHistoryItem {
  type: string
  amount: string
  date: string
  status: 'Verified' | 'Pending' | 'Rejected'
}

const initialPayments: Payment[] = [
  {
    id: 'PAY-8821',
    user: 'Pierre Mballa',
    parcelId: 'CM-2847',
    amount: '450,000 XAF',
    type: 'Registration Fee',
    status: 'Verified',
    date: '10 Jun 2025'
  },
  {
    id: 'PAY-8820',
    user: 'Amina Fouda',
    parcelId: 'CM-2848',
    amount: '200,000 XAF',
    type: 'Consultation Fee',
    status: 'Pending',
    date: '8 Jun 2025'
  },
  {
    id: 'PAY-8819',
    user: 'Grace Tanda',
    parcelId: 'CM-2850',
    amount: '1,200,000 XAF',
    type: 'Transfer Tax',
    status: 'Verified',
    date: '05 Jun 2025'
  },
  {
    id: 'PAY-8818',
    user: 'Samuel Kotto',
    parcelId: 'CM-2853',
    amount: '350,000 XAF',
    type: 'Registration Fee',
    status: 'Pending',
    date: '01 Jun 2025'
  },
  {
    id: 'PAY-8817',
    user: 'François Ngono',
    parcelId: 'CM-2851',
    amount: '890,000 XAF',
    type: 'Land Purchase',
    status: 'Verified',
    date: '28 May 2025'
  },
  {
    id: 'PAY-8816',
    user: 'Halima Bello',
    parcelId: 'CM-2852',
    amount: '150,000 XAF',
    type: 'Surveying Fee',
    status: 'Rejected',
    date: '25 May 2025'
  }
]

// Mock payment history mapping by parcelId
const paymentHistoryMock: Record<string, PaymentHistoryItem[]> = {
  'CM-2847': [
    { type: 'Registration Fee', amount: '450,000 XAF', date: '10 Jun 2025', status: 'Verified' },
    { type: 'Document Submission', amount: '50,000 XAF', date: '08 Jan 2025', status: 'Verified' }
  ],
  'CM-2848': [
    { type: 'Consultation Fee', amount: '200,000 XAF', date: '08 Jun 2025', status: 'Pending' }
  ],
  'CM-2850': [
    { type: 'Transfer Tax', amount: '1,200,000 XAF', date: '05 Jun 2025', status: 'Verified' },
    { type: 'Site Survey Fee', amount: '150,000 XAF', date: '12 Apr 2025', status: 'Verified' }
  ],
  'CM-2853': [
    { type: 'Registration Fee', amount: '350,000 XAF', date: '01 Jun 2025', status: 'Pending' }
  ],
  'CM-2851': [
    { type: 'Land Purchase', amount: '890,000 XAF', date: '28 May 2025', status: 'Verified' }
  ],
  'CM-2852': [
    { type: 'Surveying Fee', amount: '150,000 XAF', date: '25 May 2025', status: 'Rejected' }
  ]
}

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
        <span className="truncate">{selected === 'All' || selected === 'Payment Type' || selected === 'Date Range' ? label : selected}</span>
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

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'methods'>('list')
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('Payment Type')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Side Drawer state
  const [activeDrawerPayment, setActiveDrawerPayment] = useState<Payment | null>(null)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }
  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }
  const handleTypeChange = (val: string) => {
    setTypeFilter(val)
    setCurrentPage(1)
  }
  const handleDateChange = (val: string) => {
    setDateFilter(val)
    setCurrentPage(1)
  }

  // Filter payments
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.parcelId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter
    const matchesType = typeFilter === 'Payment Type' || pay.type === typeFilter

    let matchesDate = true
    if (dateFilter === 'This Week') {
      matchesDate = pay.date.includes('Jun 2025')
    } else if (dateFilter === 'This Month') {
      matchesDate = pay.date.includes('Jun 2025') || pay.date.includes('May 2025')
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  // Pagination calculations
  const totalEntries = filteredPayments.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleVerifyPayment = (id: string) => {
    const updated = payments.map(p => p.id === id ? { ...p, status: 'Verified' as const } : p)
    setPayments(updated)
    if (activeDrawerPayment && activeDrawerPayment.id === id) {
      setActiveDrawerPayment({ ...activeDrawerPayment, status: 'Verified' })
    }
  }

  const handleRejectPayment = (id: string) => {
    const updated = payments.map(p => p.id === id ? { ...p, status: 'Rejected' as const } : p)
    setPayments(updated)
    if (activeDrawerPayment && activeDrawerPayment.id === id) {
      setActiveDrawerPayment({ ...activeDrawerPayment, status: 'Rejected' })
    }
  }

  return (
    <DashboardChildrenLayout title="Payments" subtitle="Track registration fees and land transactions">
      
      {/* Tab Switcher Headers */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer",
            activeTab === 'list' 
              ? "bg-[#1E3A8A] text-white shadow-sm" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-650"
          )}
        >
          Payments List
        </button>
        <button
          onClick={() => setActiveTab('methods')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer",
            activeTab === 'methods' 
              ? "bg-[#1E3A8A] text-white shadow-sm" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-650"
          )}
        >
          Payment Methods
        </button>
      </div>

      {activeTab === 'list' ? (
        /* Split Layout Container */
        <div className="flex gap-6 items-start relative w-full h-full">
          
          {/* Table Container */}
          <div className={cn("flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 transition-all duration-300", activeDrawerPayment ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full")}>
            
            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
                
                {/* Search */}
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

                {/* Statuses dropdown */}
                <CustomFilterDropdown
                  label="All Statuses"
                  header="All Statuses"
                  options={['All', 'Verified', 'Pending', 'Rejected']}
                  selected={statusFilter}
                  onSelect={handleStatusChange}
                />

                {/* Type dropdown */}
                <CustomFilterDropdown
                  label="Payment Type"
                  header="Payment Type"
                  options={['Payment Type', 'Registration Fee', 'Consultation Fee', 'Transfer Tax', 'Land Purchase', 'Surveying Fee']}
                  selected={typeFilter}
                  onSelect={handleTypeChange}
                />

                {/* Date range dropdown */}
                <CustomFilterDropdown
                  label="Date Range"
                  header="Date Range"
                  options={['Date Range', 'This Week', 'This Month']}
                  selected={dateFilter}
                  onSelect={handleDateChange}
                />

              </div>

              {/* Export button */}
              <button
                onClick={() => alert('Exporting payments history to CSV...')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all cursor-pointer shadow-sm w-full lg:w-auto shrink-0 justify-end"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100">
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Payment ID</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">User</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Parcel</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Amount</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Type</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Date</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((pay) => {
                      const isSelected = activeDrawerPayment?.id === pay.id
                      return (
                        <tr 
                          key={pay.id}
                          className={cn(
                            "hover:bg-slate-50/20 transition-colors cursor-pointer",
                            isSelected && "bg-blue-50/25"
                          )}
                          onClick={() => setActiveDrawerPayment(pay)}
                        >
                          {/* Payment ID */}
                          <td className="py-4 px-4 text-sm font-bold text-slate-900 font-mono">
                            {pay.id}
                          </td>

                          {/* User */}
                          <td className="py-4 px-4">
                            <span className="text-sm font-bold text-slate-900">{pay.user}</span>
                          </td>

                          {/* Parcel ID Link */}
                          <td className="py-4 px-4 text-sm font-bold text-blue-600 font-mono">
                            {pay.parcelId}
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 text-sm font-bold text-slate-950 font-mono">
                            {pay.amount}
                          </td>

                          {/* Type */}
                          <td className="py-4 px-4 text-sm font-semibold text-slate-650">
                            {pay.type}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            <span
                              className={cn(
                                "px-2.5 py-0.5 rounded text-[11px] font-bold border whitespace-nowrap",
                                pay.status === 'Verified' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                                pay.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-100',
                                pay.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-100'
                              )}
                            >
                              {pay.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-4 px-4 text-sm font-semibold text-slate-650">
                            {pay.date}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveDrawerPayment(pay)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                        No transactions found matching your selection.
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

          {/* Details Drawer */}
          {activeDrawerPayment && (
            <PaymentDetailsDrawer
              key={activeDrawerPayment.id}
              payment={activeDrawerPayment}
              onClose={() => setActiveDrawerPayment(null)}
              onVerify={handleVerifyPayment}
              onReject={handleRejectPayment}
            />
          )}

        </div>
      ) : (
        /* Payment Methods Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {[
            { name: 'Mobile Money', desc: 'Generic local mobile payments API gateway.', comingSoon: true, logo: <Phone className="w-8 h-8 text-blue-600" /> },
            { name: 'Orange Money', desc: 'Direct Orange Cameroon merchant payments API.', comingSoon: true, logo: <div className="w-8 h-8 rounded bg-orange-500 text-white flex items-center justify-center font-bold text-xs">OM</div> },
            { name: 'MTN MoMo', desc: 'Direct MTN Cameroon merchant payments API.', comingSoon: true, logo: <div className="w-8 h-8 rounded bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs">MTN</div> },
            { name: 'Bank Card', desc: 'Accept worldwide Credit Card / Visa / Mastercard payments.', comingSoon: true, logo: <CreditCard className="w-8 h-8 text-slate-700" /> }
          ].map((method) => (
            <div 
              key={method.name}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-all group"
            >
              {method.comingSoon && (
                <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm select-none">
                  Coming Soon
                </span>
              )}
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner shrink-0">
                  {method.logo}
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">{method.name}</h4>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">{method.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  disabled={method.comingSoon}
                  className={cn(
                    "w-full py-2.5 rounded-xl font-bold text-xs text-center border transition-all select-none shadow-sm",
                    method.comingSoon 
                      ? "bg-slate-50 border-slate-150 text-slate-400 cursor-not-allowed" 
                      : "bg-[#1E3A8A] border-[#1E3A8A] text-white hover:bg-[#152e72] cursor-pointer"
                  )}
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardChildrenLayout>
  )
}

// Side Details Drawer
interface PaymentDetailsDrawerProps {
  payment: Payment
  onClose: () => void
  onVerify: (id: string) => void
  onReject: (id: string) => void
}

const PaymentDetailsDrawer = ({
  payment,
  onClose,
  onVerify,
  onReject
}: PaymentDetailsDrawerProps) => {
  const history = paymentHistoryMock[payment.parcelId] || []

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
        <h3 className="text-lg font-bold text-slate-900">Payment Details</h3>
      </div>

      {/* Case Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border",
            payment.status === 'Verified' && 'bg-emerald-50 text-emerald-650 border-emerald-100',
            payment.status === 'Pending' && 'bg-amber-50 text-amber-655 border-amber-100',
            payment.status === 'Rejected' && 'bg-rose-50 text-rose-655 border-rose-100'
          )}
        >
          {payment.status}
        </span>
        <h4 className="text-2xl font-black text-slate-950 font-mono mt-1">{payment.amount}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold text-slate-450">Reference:</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-slate-900 shadow-sm font-mono">
            {payment.id}
          </span>
        </div>
      </div>

      {/* Drawer Body Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin">
        
        {/* Details list */}
        <div className="space-y-3.5 text-xs font-semibold">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">User</span>
            <span className="text-slate-700 font-bold">{payment.user}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Associated Parcel</span>
            <span className="text-blue-600 font-bold font-mono">{payment.parcelId}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Payment Type</span>
            <span className="text-slate-700 font-bold">{payment.type}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Transaction Date</span>
            <span className="text-slate-700 font-bold">{payment.date}</span>
          </div>
        </div>

        {/* Action card for PDF receipt */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-900">Payment Receipt</h5>
            <p className="text-[11px] font-semibold text-slate-450">PDF preview available</p>
          </div>
          <button
            onClick={() => alert(`Downloading payment receipt for ${payment.id}...`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Receipt</span>
          </button>
        </div>

        {/* History Table */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-900">Payment History for {payment.parcelId}</h5>
          
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-2.5 px-3 font-bold text-slate-500">Type</th>
                  <th className="py-2.5 px-3 font-bold text-slate-500">Amount</th>
                  <th className="py-2.5 px-3 font-bold text-slate-500">Date</th>
                  <th className="py-2.5 px-3 font-bold text-slate-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.length > 0 ? (
                  history.map((hist, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{hist.type}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-950 font-mono">{hist.amount}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-450">{hist.date}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                            hist.status === 'Verified' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                            hist.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-100',
                            hist.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-100'
                          )}
                        >
                          {hist.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center font-semibold text-slate-400">
                      No other payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 mt-2">
        {payment.status === 'Pending' ? (
          <div className="flex gap-3">
            <button
              onClick={() => onReject(payment.id)}
              className="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-650 hover:bg-rose-100 border border-rose-100 font-bold text-xs transition-all cursor-pointer text-center"
            >
              Reject Payment
            </button>
            <button
              onClick={() => onVerify(payment.id)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-950 font-bold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Verify Payment</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => alert(`Printing official transaction receipt for ${payment.id}...`)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verify Receipt Details</span>
          </button>
        )}
      </div>

    </div>
  )
}

export default PaymentsPage
