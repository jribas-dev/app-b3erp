// lib/useSession.ts
'use client'

import { useState, useEffect } from 'react'
import { getSessionAction } from '@/lib/auth.service'
import { type SessionData } from '@/types/session-data'

interface UseSessionReturn {
  session: SessionData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const sessionData = await getSessionAction()
      setSession(sessionData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar sessão')
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  return {
    session,
    isLoading,
    error,
    refetch: fetchSession
  }
}