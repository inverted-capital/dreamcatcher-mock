import React from 'react'
import { IframeResizer } from '@open-iframe-resizer/react'

const AccountView: React.FC = () => {
  return (
    <IframeResizer
      src="https://inverted-capital.github.io/widget-account-panel/"
      title="Account Panel"
      scrolling="no"
      checkOrigin={false}
      className="w-full h-[calc(100vh-48px)] "
    />
  )
}

export default AccountView
