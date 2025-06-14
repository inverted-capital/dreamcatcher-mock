import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import useHomeScope from '@/shared/useHomeScope'

const HelpView: React.FC = () => {
  const scope = useHomeScope()
  if (!scope) return <div>Loading home scope...</div>

  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-help-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Help Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default HelpView
