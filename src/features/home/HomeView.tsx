import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import useHomeScope from '@/shared/useHomeScope'

const HomeView: React.FC = () => {
  const scope = useHomeScope()
  if (!scope) return <div>Loading home scope...</div>

  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-home-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Home Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default HomeView
