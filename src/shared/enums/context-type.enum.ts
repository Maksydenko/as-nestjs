import type { ValueOf } from '../types'

/**
 * Nest execution context kinds returned by {@link ArgumentsHost.getType}.
 */
export const ContextType = { HTTP: 'http', RPC: 'rpc', WS: 'ws' } as const
export type ContextType = ValueOf<typeof ContextType>
