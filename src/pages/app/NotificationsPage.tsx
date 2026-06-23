"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import {
  AlertTriangle,
  ClipboardList,
  Radio,
  Shield,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Check,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface NotificationItem {
  id: number
  title: string
  text: string
  time: string
  category: 'Registrations' | 'Investigations' | 'Consultations' | 'Conflicts' | 'Surveys' | 'Suspicious'
  unread: boolean
  link: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Conflict Detected',
    text: 'Boundary overlap detected between Parcel CM-2847 and CM-2848 in Yaoundé, Bastos district.',
    time: '2 min ago',
    category: 'Conflicts',
    unread: true,
    link: '/conflicts'
  },
  {
    id: 2,
    title: 'New Registration Submitted',
    text: 'Registration REG-1203 submitted by Pierre Mballa for parcel in Yaoundé, Bastos.',
    time: '15 min ago',
    category: 'Registrations',
    unread: true,
    link: '/registrations'
  },
  {
    id: 3,
    title: 'QField Submission Received',
    text: 'Surveyor Paul Biya Jr submitted GPS data for REG-1202 — 24 points recorded.',
    time: '1h ago',
    category: 'Surveys',
    unread: true,
    link: '/qfield-submissions'
  },
  {
    id: 4,
    title: 'Investigation Opened',
    text: 'New investigation INV-047 opened for parcel CM-2848 — Boundary Overlap.',
    time: '2h ago',
    category: 'Investigations',
    unread: false,
    link: '/investigations'
  },
  {
    id: 5,
    title: 'Consultation Request',
    text: 'Amina Fouda requested consultation for parcel CM-2848 in Douala, Bonanjo.',
    time: '3h ago',
    category: 'Consultations',
    unread: false,
    link: '/consultations'
  },
  {
    id: 6,
    title: 'Suspicious Activity Detected',
    text: 'Multiple login attempts from IP 197.155.99.142 for user account j.mballa@client.cm',
    time: '5h ago',
    category: 'Suspicious',
    unread: true,
    link: '/users'
  },
  {
    id: 7,
    title: 'Registration Approved',
    text: 'Registration REG-1201 for Grace Tanda has been approved and parcel published.',
    time: 'Yesterday',
    category: 'Registrations',
    unread: false,
    link: '/registrations'
  }
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Conflicts':
      return { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-100' }
    case 'Registrations':
      return { icon: ClipboardList, color: 'text-blue-600 bg-blue-50 border-blue-100' }
    case 'Surveys':
      return { icon: Radio, color: 'text-purple-600 bg-purple-50 border-purple-100' }
    case 'Investigations':
      return { icon: Shield, color: 'text-indigo-650 bg-indigo-50 border-indigo-100' }
    case 'Consultations':
      return { icon: MessageSquare, color: 'text-pink-600 bg-pink-50 border-pink-100' }
    case 'Suspicious':
      return { icon: AlertCircle, color: 'text-rose-650 bg-rose-50 border-rose-100' }
    default:
      return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
  }
}

const NotificationsPage = () => {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Categories list for tags filter
  const categoriesList = ['All', 'Registrations', 'Investigations', 'Consultations', 'Conflicts', 'Surveys', 'Suspicious']

  // Unread count
  const unreadCount = notifications.filter(n => n.unread).length

  // Filtered notifications list
  const filteredNotifications = notifications.filter((notif) => {
    if (activeCategory === 'All') return true
    return notif.category === activeCategory
  })

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  // Clear all notifications
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([])
    }
  }

  // Mark single as read
  const handleMarkSingleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )
  }

  // Delete single notification
  const handleDeleteSingle = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Navigate to links
  const handleGoTo = (link: string) => {
    router.push(link)
  }

  return (
    <DashboardChildrenLayout
      title="Notifications"
      subtitle="Manage system alerts, status updates, and notifications"
    >
      <div className="space-y-6 text-left">
        {/* Top Controls Tag bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          {/* Left Category tags */}
          <div className="flex flex-wrap items-center gap-2">
            {categoriesList.map((cat) => {
              const isSelected = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-xs leading-relaxed",
                    isSelected
                      ? "bg-emerald-800 border-emerald-900 text-white font-bold"
                      : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350"
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Right global actions */}
          <div className="flex items-center gap-2">
            {/* Mark read button */}
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border shadow-xs transition-all cursor-pointer",
                unreadCount > 0
                  ? "bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/50"
                  : "bg-slate-50 text-slate-350 border-slate-100 cursor-not-allowed"
              )}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Mark all read {unreadCount > 0 && `(${unreadCount})`}</span>
            </button>

            {/* Clear all button */}
            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border shadow-xs transition-all cursor-pointer",
                notifications.length > 0
                  ? "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100/50"
                  : "bg-slate-50 text-slate-350 border-slate-100 cursor-not-allowed"
              )}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          </div>
        </div>

        {/* Notifications list layout */}
        <div className="space-y-3.5">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const { icon: IconComp, color: iconColor } = getCategoryIcon(item.category)
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 rounded-2xl transition-all border shadow-xs relative text-left",
                    item.unread
                      ? "bg-emerald-50/15 border-emerald-100/60"
                      : "bg-white border-slate-100/70"
                  )}
                >
                  {/* Left content block: Icon + Text */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon container rounded box */}
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner shrink-0 mt-0.5", iconColor)}>
                      <IconComp className="w-5 h-5 stroke-[2]" />
                    </div>

                    {/* Notification info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 leading-none">
                          {item.title}
                        </h4>
                        {/* Green unread dot */}
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-3xl">
                        {item.text}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  {/* Right side buttons stack */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-start md:justify-center gap-2 shrink-0 md:min-w-[100px]">
                    {/* Mark read */}
                    {item.unread && (
                      <button
                        onClick={() => handleMarkSingleRead(item.id)}
                        className="px-3 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/50 rounded-lg transition-colors cursor-pointer w-full text-center"
                      >
                        Mark read
                      </button>
                    )}

                    {/* Go to redirect */}
                    <button
                      onClick={() => handleGoTo(item.link)}
                      className="flex items-center justify-center gap-1 px-3 py-1 text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer w-full"
                    >
                      <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                      <span>Go to</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSingle(item.id)}
                      className="px-3 py-1 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100/50 rounded-lg transition-colors cursor-pointer w-full text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">All caught up!</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                No notifications found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardChildrenLayout>
  )
}

export default NotificationsPage
