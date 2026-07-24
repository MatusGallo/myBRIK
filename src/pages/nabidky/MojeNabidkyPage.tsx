import { useState } from 'react'
import NabidkyFilterBar, { NabidkyFilterValues, emptyFilterValues } from '../../components/nabidky/NabidkyFilterBar'
import NabidkyTable from '../../components/nabidky/NabidkyTable'

export default function MojeNabidkyPage() {
  const [, setActiveFilter] = useState<NabidkyFilterValues>(emptyFilterValues)
  const [page, setPage] = useState(1)

  function handleFilter(values: NabidkyFilterValues) {
    setActiveFilter(values)
    setPage(1)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[var(--t-textPrimary)] leading-none">Moje nabídky</h1>
      </div>

      <NabidkyFilterBar onChange={handleFilter} hasData={false} />

      <NabidkyTable
        data={[]}
        page={page}
        totalPages={1}
        onPageChange={setPage}
        totalCount={0}
      />
    </div>
  )
}
