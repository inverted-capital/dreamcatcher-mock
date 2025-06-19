import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import useHomeScope from '@/shared/useHomeScope'
import useSelectionUpdater from '@/shared/useSelectionUpdater'
import { useFrameSrcStore } from '@/shared/frameSrc'

const HelpView: React.FC = () => {
  const scope = useHomeScope()
  const onSelection = useSelectionUpdater()
  const src = useFrameSrcStore((s) => s.getSrc('help'))
  if (!scope) return <div className="p-6">Loading home scope...</div>

  return (
    <ArtifactHolder
      src={src}
      target={scope}
      diffs={[]}
      expandedAccess={[]}
      onSelection={onSelection}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Help Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default HelpView
