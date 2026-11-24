import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { neon } from '../neonClient'

type Session = NonNullable<Awaited<ReturnType<typeof neon.auth.getSession>>['data']['session']>

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

interface AuthContextValue {
  session: Session | null
  loading: boolean
  authError: string | null
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  async function refreshSession() {
    const { data, error } = await neon.auth.getSession()
    if (error) throw new Error(error.message ?? 'Unable to read your session.')
    setSession(data?.session ?? null)
  }

  useEffect(() => {
    let active = true

    neon.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return
        if (error) setAuthError(error.message ?? 'Unable to restore your session.')
        else setSession(data?.session ?? null)
      })
      .catch((error: unknown) => {
        if (active) setAuthError(getErrorMessage(error, 'Unable to restore your session.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function signUp(email: string, password: string) {
    try {
      const { error } = await neon.auth.signUp.email({
        name: email.split('@')[0] || 'User',
        email,
        password
      })
      if (error) return { error: error.message ?? 'Unable to create your account.' }
      await refreshSession()
      setAuthError(null)
      return { error: null }
    } catch (error) {
      return { error: getErrorMessage(error, 'Unable to create your account.') }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await neon.auth.signIn.email({ email, password })
      if (error) return { error: error.message ?? 'Unable to sign in.' }
      await refreshSession()
      setAuthError(null)
      return { error: null }
    } catch (error) {
      return { error: getErrorMessage(error, 'Unable to sign in.') }
    }
  }

  async function signOut() {
    try {
      const { error } = await neon.auth.signOut()
      if (error) throw new Error(error.message ?? 'Unable to sign out.')
      setSession(null)
      setAuthError(null)
    } catch (error) {
      setAuthError(getErrorMessage(error, 'Unable to sign out.'))
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await neon.auth.requestPasswordReset({
        email,
        redirectTo: window.location.origin
      })
      return { error: error?.message ?? null }
    } catch (error) {
      return { error: getErrorMessage(error, 'Unable to request a password reset.') }
    }
  }

  return (
    <AuthContext.Provider value={{ session, loading, authError, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
