import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ArtifactFrame } from '@artifact/client/react'
import {
  useFrame,
  useArtifact,
  useTree,
  useDir,
  useBranches,
  useRemotes
} from '@artifact/client/hooks'
import { isCommitScope } from '@artifact/client/api'

function Diagnostic() {
  const frame = useFrame()
  const artifact = useArtifact()
  const tree = useTree()
  const rootDir = useDir('.')
  const branches = useBranches()
  const remotes = useRemotes()
  const [count, setCount] = useState(0)
  const [windowInfo, setWindowInfo] = useState(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight
  }))

  useEffect(() => {
    const handler = () =>
      setWindowInfo({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight
      })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const addFile = () => {
    if (!artifact || !isCommitScope(artifact.scope)) return
    const path = `diagnostic-${Date.now()}-${count}.txt`
    setCount((c) => c + 1)
    artifact.files.write.text(path, 'diagnostic file')
  }

  return (
    <div
      style={{
        fontFamily: 'monospace',
        padding: 10,
        overflow: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <h2>Diagnostic Frame</h2>
      <h3>Props</h3>
      <pre>
        {JSON.stringify(
          {
            target: frame.target,
            diffs: frame.diffs,
            expandedAccess: frame.expandedAccess,
            selection: frame.selection
          },
          null,
          2
        )}
      </pre>
      <h3>Window Info</h3>
      <pre>{JSON.stringify(windowInfo, null, 2)}</pre>
      <h3>Scope</h3>
      <pre>{JSON.stringify(artifact?.scope, null, 2)}</pre>
      <h3>Tree</h3>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
      <h3>Branches</h3>
      <pre>{JSON.stringify(branches, null, 2)}</pre>
      <h3>Remotes</h3>
      <pre>{JSON.stringify(remotes, null, 2)}</pre>
      <h3>Files</h3>
      <pre>{JSON.stringify(rootDir, null, 2)}</pre>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => frame.onSelection?.(frame.target)}>
          onSelection
        </button>
        <button onClick={() => frame.onMessage?.({ type: 'diagnostic' })}>
          onMessage
        </button>
        <button onClick={() => frame.onAccessRequest?.([frame.target])}>
          onAccessRequest
        </button>
        <button onClick={() => frame.onNavigateTo?.(frame.target)}>
          onNavigateTo
        </button>
        <button onClick={addFile}>Add File</button>
      </div>
    </div>
  )
}

function Boot() {
  return (
    <ArtifactFrame>
      <Diagnostic />
    </ArtifactFrame>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Boot />
  </StrictMode>
)
