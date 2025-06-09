import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'

const NappsView: React.FC = () => {
  const scope = useScope()
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-napps-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Napps Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default NappsView
