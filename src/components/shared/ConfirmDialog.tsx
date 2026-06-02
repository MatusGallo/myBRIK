import { createPortal } from 'react-dom'
import { Dialog } from '@matusgallo/mysabds'

interface Props {
  title: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  destructive?: boolean
  onPrimary: () => void
  onSecondary: () => void
}

export default function ConfirmDialog(props: Props) {
  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10, 13, 18, 0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        border: '1px solid var(--t-borderPrimary)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
      <Dialog
        title={props.title}
        description={props.description}
        primaryLabel={props.primaryLabel}
        secondaryLabel={props.secondaryLabel}
        destructive={props.destructive}
        onPrimary={props.onPrimary}
        onSecondary={props.onSecondary}
      />
      </div>
    </div>,
    document.body
  )
}
