import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import useHomeScope from '@/shared/useHomeScope'
import useSelectionUpdater from '@/shared/useSelectionUpdater'

const ContactsView: React.FC = () => {
  const scope = useHomeScope()
  const onSelection = useSelectionUpdater()
  if (!scope) return <div className="p-6">Loading home scope...</div>

  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-contacts-panel/"
      target={scope}
      diffs={[]}
      expandedAccess={[]}
      onSelection={onSelection}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Contacts Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default ContactsView
