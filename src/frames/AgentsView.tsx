import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import useHomeScope from '@/shared/useHomeScope'

const BranchesView: React.FC = () => {
  const scope = useHomeScope()
  if (!scope) return <div>Loading home scope...</div>

  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-agents-panel/"
      target={scope}
      diffs={[]}
      expandedAccess={[]}
      onSelection={(sel) => {
        console.log(sel)
      }}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Agents Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default BranchesView
