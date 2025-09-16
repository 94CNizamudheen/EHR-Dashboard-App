import React from 'react'

export default function Topbar() {
  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      <div className="text-lg font-medium">EHR Dashboard</div>
      <div>
        <button className="px-3 py-1 rounded border">Profile</button>
      </div>
    </header>
  )
}
