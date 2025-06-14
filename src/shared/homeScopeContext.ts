import { createContext } from 'react'
import type { Scope } from '@artifact/client/api'

const HomeScopeContext = createContext<Scope | null>(null)
export default HomeScopeContext
