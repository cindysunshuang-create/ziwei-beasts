import { useState } from 'react'
import { signInWithGoogle, signUpWithEmail, logInWithEmail } from '../lib/firebase'
import type { User } from 'firebase/auth'
import './AuthModal.css'

interface AuthModalProps {
  onClose: () => void
  onLoginSuccess: (user: User) => void
}

export function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'email'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const emailBtnLabel = mode === 'signup' ? 'Create Account' : 'Sign In'

  const handleGoogle = async () => {
    setError(''); setLoading(true)
    try {
      const result = await signInWithGoogle()
      onLoginSuccess(result.user)
      onClose()
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed')
    } finally { setLoading(false) }
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const fn = mode === 'signup' ? signUpWithEmail : logInWithEmail
      const result = await fn(email, password)
      onLoginSuccess(result.user)
      onClose()
    } catch (e: any) {
      const msg = e.code === 'auth/user-not-found' ? 'Account not found. Please sign up first.'
        : e.code === 'auth/wrong-password' ? 'Incorrect password.'
        : e.code === 'auth/email-already-in-use' ? 'Email already registered. Try logging in.'
        : e.message || 'Authentication failed'
      setError(msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-card">
        <button className="auth-close" onClick={onClose}>✕</button>

        <div className="auth-brand">✦ Eastern Mystical ✦</div>
        <div className="auth-title">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Sign In with Email'}
        </div>
        <div className="auth-sub">
          {mode === 'login' ? 'Sign in to access your full chart reading'
            : mode === 'signup' ? 'Create your account to unlock guardian readings'
            : 'Enter your credentials'}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Google */}
        <button className="auth-btn auth-btn-google" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        {/* Email form */}
        {mode === 'email' && (
          <form className="auth-form" onSubmit={handleEmail}>
            <input
              className="auth-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button className="auth-btn auth-btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : emailBtnLabel}
            </button>
          </form>
        )}

        {mode !== 'email' && (
          <button className="auth-btn auth-btn-email" onClick={() => setMode('email')}>
            Continue with Email
          </button>
        )}

        <div className="auth-switch">
          {mode === 'login' ? (
            <>No account? <button onClick={() => { setMode('signup'); setError('') }}>Sign up free</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError('') }}>Sign in</button></>
          )}
        </div>

        <div className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}
