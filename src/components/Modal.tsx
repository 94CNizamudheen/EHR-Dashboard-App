import React from 'react'

export default function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-11/12 max-w-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="font-medium">{title}</div>
          <button onClick={onClose} className="px-2 py-1">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
