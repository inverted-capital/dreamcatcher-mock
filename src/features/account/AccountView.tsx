import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'

const AccountView: React.FC = () => {
  const scope = useScope()
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-account-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Account Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default AccountView
