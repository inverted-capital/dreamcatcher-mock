import { createContext } from 'react'
import type { BranchScope } from '@artifact/client/api'

const HomeScopeContext = createContext<BranchScope | null>(null)
export default HomeScopeContext
