import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'

const ChatsView: React.FC = () => {
  const scope = useScope()
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-chats-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Chats Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default ChatsView
