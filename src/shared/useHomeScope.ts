import { useContext } from 'react'
import type { Scope } from '@artifact/client/api'
import HomeScopeContext from './homeScopeContext'

export default function useHomeScope(): Scope | null {
  return useContext(HomeScopeContext)
}
