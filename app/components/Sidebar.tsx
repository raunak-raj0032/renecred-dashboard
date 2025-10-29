'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Leaf,
  UsersRound,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronUp, // Added for collapse indicator
  Building,
  Phone,
  Mail,
  SquarePen,
  History,
  ChevronLeft, // Added for main collapse toggle
} from 'lucide-react'

// --- Menu items (no change) ---
const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Project', href: '/project', icon: Briefcase },
  { label: 'Farmers', href: '/farmers', icon: Users },
  { label: 'Carbon Credits', href: '/carbon-credits', icon: Leaf },
  { label: 'Customers', href: '/customers', icon: UsersRound },
  { label: 'Retirements', href: '/retirements', icon: History },
  { label: 'VVB', href: '/vvb', icon: Building },
]

const userSubMenu = [
  { label: 'User List', href: '/users/list' },
  { label: 'Add User', href: '/users/add' },
]

const masterSubMenu = [
  { label: 'Master 1', href: '/master/1' },
  { label: 'Master 2', href: '/master/2' },
]
// ---

export default function Sidebar() {
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const [orgDetailsOpen, setOrgDetailsOpen] = useState(false)

  // ✅ State for main sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (href: string) => pathname.startsWith(href)

  const handleSubMenuToggle = (menu: 'users' | 'master') => {
    if (isCollapsed) {
      // If sidebar is closed, opening a submenu should open the sidebar
      setIsCollapsed(false)
      if (menu === 'users') setUserMenuOpen(true)
      else if (menu === 'master') setMasterMenuOpen(true)
    } else {
      // Toggle submenus normally
      if (menu === 'users') setUserMenuOpen(!userMenuOpen)
      else if (menu === 'master') setMasterMenuOpen(!masterMenuOpen)
    }
  }

  return (
    <aside
      className={clsx(
        'bg-white h-screen flex flex-col p-4 transition-all duration-300 sticky top-0',
        isCollapsed ? 'w-20' : 'w-64' // ✅ Collapsible width
      )}
        style={{ backgroundColor: '#FAFBFF' }}

    >
      {/* Logo and Collapse Toggle */}
      <div className="flex items-center justify-between mb-3 h-8">
        {/* Max Logo (visible when open) */}
        <img
          src="/logo_max.png"
          alt="ReneWCred"
          className={clsx(
            'h-6 w-auto transition-all duration-300 whitespace-nowrap overflow-hidden',
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          )}
        />
        {/* Min Logo (visible when collapsed) */}
        <img
          src="/logo_min.png"
          alt="R"
          className={clsx(
            'h-8 w-8 transition-all duration-300',
            !isCollapsed ? 'w-0 opacity-0' : 'w-8 opacity-100'
          )}
        />

        {/* Toggle Button (always visible) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-gray-800"
        >
          <ChevronLeft
            className={clsx(
              'w-5 h-5 transition-transform duration-300',
              isCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5 mb-5">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={isCollapsed ? item.label : undefined} // Tooltip when collapsed
            className={clsx(
              'flex items-center gap-3 p-2.5 rounded-xl text-[13px] font-semibold tracking-tight transition-colors overflow-hidden',
              isActive(item.href)
                ? 'bg-pink-100 text-red-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              isCollapsed && 'justify-center' // Center icon when collapsed
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span
              className={clsx(
                'transition-all duration-200 whitespace-nowrap',
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}

        {/* Users Collapsible Menu */}
        <div>
          <button
            onClick={() => handleSubMenuToggle('users')}
            title={isCollapsed ? 'Users' : undefined}
            className={clsx(
              'flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] font-semibold tracking-tight text-gray-600 hover:bg-gray-50 hover:text-gray-900 overflow-hidden',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 flex-shrink-0" />
              <span
                className={clsx(
                  'transition-all duration-200 whitespace-nowrap',
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}
              >
                Users
              </span>
            </div>
            {/* Hide chevron when collapsed */}
            {!isCollapsed &&
              (userMenuOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
          </button>
          {/* Hide submenu when sidebar is collapsed */}
          {!isCollapsed && userMenuOpen && (
            <div className="pl-8 space-y-0.5 mt-0.5">
              {userSubMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'block p-2 rounded-lg text-[13px] font-semibold tracking-tight',
                    isActive(item.href)
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <Link
          href="/notifications"
          title={isCollapsed ? 'Notifications' : undefined}
          className={clsx(
            'flex items-center gap-3 p-2.5 rounded-xl text-[13px] font-semibold tracking-tight transition-colors overflow-hidden',
            isActive('/notifications')
              ? 'bg-pink-100 text-red-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            isCollapsed && 'justify-center'
          )}
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span
            className={clsx(
              'transition-all duration-200 whitespace-nowrap',
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            )}
          >
            Notifications
          </span>
        </Link>

        {/* Master Collapsible Menu */}
        <div>
          <button
            onClick={() => handleSubMenuToggle('master')}
            title={isCollapsed ? 'Master' : undefined}
            className={clsx(
              'flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] font-semibold tracking-tight text-gray-600 hover:bg-gray-50 hover:text-gray-900 overflow-hidden',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span
                className={clsx(
                  'transition-all duration-200 whitespace-nowrap',
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}
              >
                Master
              </span>
            </div>
            {/* Hide chevron when collapsed */}
            {!isCollapsed &&
              (masterMenuOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
          </button>
          {/* Hide submenu when sidebar is collapsed */}
          {!isCollapsed && masterMenuOpen && (
            <div className="pl-8 space-y-0.5 mt-0.5">
              {masterSubMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'block p-2 rounded-lg text-[13px] font-semibold tracking-tight',
                    isActive(item.href)
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>


<div
  className={clsx(
    'bg-white rounded-lg border border-gray-200 overflow-hidden mt-auto transition-all duration-300',
    isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'
  )}
>
  {/* Outer wrapper changed from <button> → <div> */}
  <div
    onClick={() => setOrgDetailsOpen(!orgDetailsOpen)}
    role="button"
    tabIndex={0}
    className="flex justify-between items-start w-full bg-[#fdf2f8] p-4 text-left cursor-pointer"
  >
    <div>
      <h4 className="font-semibold text-[13px] text-gray-800 mb-1">
        Organization Name
      </h4>
      <div className="space-y-1 text-[12px] text-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span>Yogendra Panchal</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span>+91 9876543210</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span>info@ola.com</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Collapse Indicator */}
      {orgDetailsOpen ? (
        <ChevronUp className="w-4 h-4 text-gray-500" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-500" />
      )}

      {/* ✅ Edit Organization stays as a <button> */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="text-gray-500 hover:text-gray-700"
        title="Edit Organization"
      >
        <SquarePen className="w-4 h-4" />
      </button>
    </div>
  </div>

  {/* Collapsible Details */}
  {orgDetailsOpen && (
    <div className="p-4 bg-white max-h-40 overflow-y-auto">
      <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-[12px]">
        <span className="font-semibold text-gray-500 col-span-1">Address</span>
        <span className="col-span-2 text-gray-700">
          Near MMRDA Grounds, Kolivary Village, MMRDA Area, Bandra Kurla
          Complex, Bandra East, Mumbai, Maharashtra 400051
        </span>

        <span className="font-semibold text-gray-500 col-span-1">City</span>
        <span className="col-span-2 text-gray-700">Mumbai</span>

        <span className="font-semibold text-gray-500 col-span-1">State</span>
        <span className="col-span-2 text-gray-700">Maharashtra</span>

        <span className="font-semibold text-gray-500 col-span-1">Pincode</span>
        <span className="col-span-2 text-gray-700">400051</span>

        <span className="font-semibold text-gray-500 col-span-1">GST No.</span>
        <span className="col-span-2 text-gray-700">XXXXXXXXXX</span>

        <span className="font-semibold text-gray-500 col-span-1">PAN No.</span>
        <span className="col-span-2 text-gray-700">XXXXXXXXXX</span>

        <span className="font-semibold text-gray-500 col-span-1">CIN No.</span>
        <span className="col-span-2 text-gray-700">XXXXXXXXXX</span>
      </div>
    </div>
  )}
</div>

    </aside>
  )
}

