import { useContext } from 'react'
import type { BranchScope } from '@artifact/client/api'
import HomeScopeContext from './homeScopeContext'

export default function useHomeScope(): BranchScope | null {
  return useContext(HomeScopeContext)
}
