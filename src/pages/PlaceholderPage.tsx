import { Construction } from 'lucide-react'

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <Construction size={40} className="text-[var(--t-textTertiary)] mb-4" />
      <p className="text-base font-semibold text-[var(--t-textPrimary)]">Str�nka se p�ipravuje</p>
      <p className="text-sm text-[var(--t-textSecondary)] mt-1">Tato sekce bude brzy dostupn�.</p>
    </div>
  )
}
