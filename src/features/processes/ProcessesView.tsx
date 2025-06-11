import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'

const ProcessesView: React.FC = () => {
  const scope = useScope()
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-processes-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Processes Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default ProcessesView
