import { useState } from 'react'
import { signInWithGoogle, signInWithApple, signUpWithEmail, logInWithEmail } from '../lib/firebase'
import type { User } from 'firebase/auth'
import './AuthModal.css'

interface AuthModalProps {
  onClose: () => void
  onLoginSuccess: (user: User) => void
}

export function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleApple = async () => {
    setError(''); setLoading(true)
    try {
      const result = await signInWithApple()
      onLoginSuccess(result.user)
      onClose()
    } catch (e: any) {
      setError(e.message || 'Apple sign-in failed')
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
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </div>
        <div className="auth-sub">
          {mode === 'login' ? 'Sign in to access your full chart reading'
            : 'Create your account to unlock guardian readings'}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Social Buttons */}
        <div className="auth-social-group">
          <button className="auth-btn auth-btn-social" onClick={handleApple} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.365 14.363c-.024-2.585 2.106-3.834 2.2-3.886-1.2-1.758-3.072-1.996-3.75-2.03-1.604-.162-3.13.948-3.953.948-.823 0-2.073-.923-3.394-.897-1.706.026-3.277.994-4.156 2.527-1.782 3.104-.456 7.697 1.282 10.21.854 1.233 1.863 2.613 3.193 2.562 1.278-.052 1.763-.827 3.307-.827 1.542 0 1.977.827 3.332.8 1.38-.026 2.235-1.258 3.085-2.49 1.01-1.474 1.425-2.905 1.447-2.983-.03-.013-2.793-1.074-2.815-3.66m-2.146-5.836c.692-.84 1.157-2.006 1.03-3.17-.996.04-2.226.663-2.942 1.503-.57.667-1.126 1.85-.976 2.99 1.112.086 2.193-.48 2.888-1.323" />
            </svg>
            Continue with Apple
          </button>

          <button className="auth-btn auth-btn-social" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <div className="auth-divider"><span>or with email</span></div>

        {/* Email form */}
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
            {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>No account? <button type="button" onClick={() => { setMode('signup'); setError('') }}>Sign up free</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => { setMode('login'); setError('') }}>Sign in</button></>
          )}
        </div>

        <div className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}
