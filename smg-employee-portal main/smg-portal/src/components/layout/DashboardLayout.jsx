import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ children, pageTitle = 'Dashboard' }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />

      {/* Main area shifts right when sidebar is open on desktop */}
      <div className={`
        flex flex-col flex-1 min-w-0 transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        <Topbar
          onMenuToggle={() => setSidebarCollapsed(p => !p)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
