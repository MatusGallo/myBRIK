export function renderDatum(key: string) {
  return (r: Record<string, unknown>) => {
    const val = String(r[key] ?? '')
    const spaceIdx = val.indexOf(' ')
    const date = spaceIdx >= 0 ? val.slice(0, spaceIdx) : val
    const time = spaceIdx >= 0 ? val.slice(spaceIdx + 1) : ''
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 14, color: 'var(--t-textPrimary)', whiteSpace: 'nowrap' }}>{date || '–'}</span>
        {time && <span style={{ fontSize: 12, color: 'var(--t-textSecondary)', whiteSpace: 'nowrap' }}>{time}</span>}
      </div>
    )
  }
}
