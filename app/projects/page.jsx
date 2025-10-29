'use client'

import Sidebar from '@/app/components/Sidebar'
import Topbar from '@/app/components/Topbar'
import DistributorTable from '@/app/components/DistributorTable'
import {
  LayoutDashboard,
  Building,
  DatabaseZap,
  Users,
  SquarePen,
} from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 rounded-2xl" style={{ backgroundColor: '#ffffff' }}>
          {/* ✅ Project Banner Section */}
          <div
            className="h-48 rounded-xl bg-cover bg-center shadow-md p-6 flex flex-col justify-center mb-6 relative"
            style={{
              backgroundImage:
                "url('https://placehold.co/1600x300/1a202c/ffffff?text=Project+Banner')",
            }}
          >
            <h1 className="text-4xl font-bold text-white tracking-wide">CH4OW</h1>
            <p className="text-lg font-semibold text-white mt-1">ME0001</p>

            {/* ✅ Edit Icon Button */}
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors">
              <SquarePen className="w-5 h-5" />
            </button>
          </div>

          {/* ✅ Navigation Tabs */}
          <nav className="flex items-center gap-3 mb-6">
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-500" />
              Overview
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Building className="w-4 h-4 text-gray-500" />
              Manufacturers
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <DatabaseZap className="w-4 h-4 text-gray-500" />
              Feed Concentrator
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#c02626] border border-transparent rounded-full shadow-sm transition-colors"
            >
              <Users className="w-4 h-4 text-white" />
              Distributor
            </a>
          </nav>

          {/* ✅ Distributor Table */}
          <DistributorTable />
        </main>
      </div>
    </div>
  )
}
