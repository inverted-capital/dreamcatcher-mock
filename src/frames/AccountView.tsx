import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import useHomeScope from '@/shared/useHomeScope'
import useSelectionUpdater from '@/shared/useSelectionUpdater'

const AccountView: React.FC = () => {
  const scope = useHomeScope()
  const onSelection = useSelectionUpdater()
  if (!scope) return <div className="p-6">Loading home scope...</div>

  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-account-panel/"
      target={scope}
      onSelection={onSelection}
      onNavigateTo={() => {}}
      title="Account Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default AccountView
