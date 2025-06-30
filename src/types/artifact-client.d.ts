import '@artifact/client/react'

declare module '@artifact/client/react' {
  interface ArtifactWebProps {
    /** Optional replacement for getSecureToken */
    getToken?: () => Promise<string> | string
    /** Deprecated in favor of getToken */
    getSecureToken?: () => Promise<string> | string
  }
}
