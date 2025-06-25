import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import type { Scope } from '@artifact/client/api'
import type { View } from '@/shared/types'
import {
  DIAGNOSTIC_PATH,
  useRegularSrc,
  useFrameSrcStore
} from '@/shared/frameSrc'
import useSelectionUpdater from '@/shared/useSelectionUpdater'

interface Props {
  view: View
  scope: Scope
  title: string
}

const FrameWithDiagnostic: React.FC<Props> = ({ view, scope, title }) => {
  const diagnostic = useFrameSrcStore((s) => s.diagnostic)
  const src = useRegularSrc(view)
  const onSelection = useSelectionUpdater()

  return (
    <>
      <ArtifactHolder
        src={src}
        target={scope}
        onSelection={onSelection}
        title={title}
        className={diagnostic ? 'hidden w-full h-full' : 'w-full h-full'}
      />
      {diagnostic && (
        <ArtifactHolder
          src={DIAGNOSTIC_PATH}
          target={scope}
          onSelection={onSelection}
          title="Diagnostic Panel"
          className="w-full h-full"
        />
      )}
    </>
  )
}

export default FrameWithDiagnostic
