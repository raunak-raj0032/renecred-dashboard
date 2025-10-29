'use client'

import { Search, Bell, Settings, User } from 'lucide-react' // Added User icon

export default function Topbar() {
  return (
    // Removed border-b
<header className="flex justify-between items-center h-16 px-6 sticky top-0 z-10" style={{ backgroundColor: '#fafbff' }}>
      {/* Search Bar - Updated width and color */}
      <div className="relative w-1/2 min-w-[500px]">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full bg-gray-100 py-2.5 px-5 text-sm font-medium text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300" // Changed bg-slate-50 to bg-gray-100
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>

      {/* Right-side Icons & Profile */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative text-gray-500 hover:text-gray-800">
          <Bell className="w-6 h-6" />
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Settings Icon */}
        <button className="text-gray-500 hover:text-gray-800">
          <Settings className="w-6 h-6" />
        </button>

        {/* Profile Dropdown Button */}
        <button className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pr-4 transition-colors hover:bg-gray-50">
          {/* Replaced img with User icon */}
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
            <User className="w-5 h-5" />
          </span>
          <div>
            <span className="block text-left font-semibold text-sm text-gray-800">
              Abhimanyu Rathi
            </span>
            <p className="block text-left text-xs text-red-500">@gobroli</p>
          </div>
        </button>
      </div>
    </header>
  )
}

