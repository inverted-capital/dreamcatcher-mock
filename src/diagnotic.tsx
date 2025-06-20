import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArtifactFrame } from '@artifact/client/react'
import { useFrame, useArtifact } from '@artifact/client/hooks'

interface FileMeta {
  path: string
}

function Diagnostic() {
  const frame = useFrame()
  const artifact = useArtifact()
  const [files, setFiles] = useState<FileMeta[]>()
  const [branches, setBranches] = useState<string[]>()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!artifact) return
    let active = true
    const updateFiles = async () => {
      const list = await artifact.files.read.ls('.')
      if (active) setFiles(list)
    }
    const watchFiles = async () => {
      for await (const event of artifact.files.read.watch('.')) {
        void event
        if (!active) break
        await updateFiles()
      }
    }
    updateFiles()
    watchFiles()
    return () => {
      active = false
    }
  }, [artifact])

  useEffect(() => {
    if (!artifact) return
    let active = true
    const updateBranches = async () => {
      const list = await artifact.repo.branches.ls()
      if (active) setBranches(list)
    }
    const watchBranches = async () => {
      for await (const ev of artifact.repo.branches.watch()) {
        void ev
        if (!active) break
        await updateBranches()
      }
    }
    updateBranches()
    watchBranches()
    return () => {
      active = false
    }
  }, [artifact])

  const addFile = () => {
    if (!artifact) return
    const path = `diagnostic-${Date.now()}-${count}.txt`
    setCount((c) => c + 1)
    artifact.files.write.text(path, 'diagnostic file')
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: 10 }}>
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
      <h3>Scope</h3>
      <pre>{JSON.stringify(artifact?.scope, null, 2)}</pre>
      <h3>Branches</h3>
      <pre>{JSON.stringify(branches, null, 2)}</pre>
      <h3>Files</h3>
      <pre>{JSON.stringify(files, null, 2)}</pre>
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
