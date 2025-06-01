import React from 'react'
import { ArtifactFrameHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'

const AccountView: React.FC = () => {
  const scope = useScope()
  return (
    <ArtifactFrameHolder
      src="https://inverted-capital.github.io/widget-account-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Account Panel"
      scrolling="no"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default AccountView
