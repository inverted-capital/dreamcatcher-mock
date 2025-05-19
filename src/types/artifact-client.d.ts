/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@artifact/client' {
  import type { FC } from 'react'

  export const ArtifactBase: FC<any>
  export const ArtifactScope: FC<any>
  export const useIsArtifactReady: () => any
  export const useArtifact: () => any
  export interface Artifact {
    [key: string]: unknown
  }
  export interface ArtifactScopeInstance {
    [key: string]: unknown
  }
  export interface RepoScope {
    repo: { publicKey: string; name: string }
  }
  export function useTree(...args: any[]): RepoScope[]
  export function useScope(...args: any[]): RepoScope | null
  export function isRepoScope(scope: any): scope is RepoScope
}
