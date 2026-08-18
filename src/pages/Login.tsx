import { useState, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)

    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password)

    setBusy(false)
    if (result.error) {
      setError(result.error)
    } else if (mode === 'signup') {
      setNotice('Account created, please check your email to confirm, then sign in.')
      setMode('signin')
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden px-3 py-4 sm:px-4">
      <div className="mx-auto w-full max-w-sm rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-forest">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Track PCE hours and locations with ease.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {notice && <p className="text-sm text-forest">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-forest py-2 font-medium text-sand hover:bg-forest/90 disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setNotice(null)
          }}
          className="mt-4 w-full text-center text-sm text-ink/60 hover:text-forest"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
        {mode === 'signin' && (
          <div className="mt-2 text-center">
            <button
              onClick={async () => {
                setError(null)
                setNotice(null)
                if (!email) return setError('Enter your email to reset password')
                setBusy(true)
                const res = await resetPassword(email)
                setBusy(false)
                if (res.error) setError(res.error)
                else setNotice('If that email exists, a password reset link has been sent.')
              }}
              className="text-sm text-ink/60 hover:text-forest"
              disabled={busy}
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
