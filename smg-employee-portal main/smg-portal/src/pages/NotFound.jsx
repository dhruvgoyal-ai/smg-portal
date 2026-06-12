import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0d2137] rounded mb-4">
          <span className="text-white font-black text-lg">SMG</span>
        </div>
        <h1 className="text-5xl font-black text-[#0d2137] mb-2">404</h1>
        <p className="text-slate-600 font-semibold text-sm mb-1">Page Not Found</p>
        <p className="text-slate-400 text-xs mb-5">The page you requested does not exist in the SMG portal.</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-[#0d2137] hover:bg-[#1a3a5c] text-white px-4 py-2.5 rounded text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Go Back
        </button>
      </div>
    </div>
  )
}
