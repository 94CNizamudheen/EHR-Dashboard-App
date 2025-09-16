import './globals.css'
import Sidebar from '../components/Sidebar' 
import Topbar from '../components/TopBar' 
import { AuthProvider } from './context/AuthContext' 
import React from 'react'

export const metadata = {
  title: 'EHR Dashboard',
  description: 'Electronic Health Records Dashboard'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
