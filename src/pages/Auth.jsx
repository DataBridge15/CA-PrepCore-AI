import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'
import { createUserProfile } from '../userData'

function Auth({
  initialMode = 'login',
  onSuccess = () => {},
  onBack = () => {},
}) {
  const [mode, setMode] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    level: 'CA Foundation',
    attempt: 'January 2027',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setMessage('')
    setError('')
    setShowPassword(false)
  }

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setMessage('')
    setError('')
  }

  const getAttempts = (level) => {
    if (level === 'CA Foundation') {
      return [
        'January 2027',
        'May/June 2027',
        'September 2027',
      ]
    }

    if (level === 'CA Intermediate') {
      return [
        'January 2027',
        'May/June 2027',
        'September 2027',
      ]
    }

    return [
      'January 2027',
      'May/June 2027',
      'September 2027',
    ]
  }

  const handleLevelChange = (event) => {
    const newLevel = event.target.value
    const attempts = getAttempts(newLevel)

    setForm((current) => ({
      ...current,
      level: newLevel,
      attempt: attempts[0],
    }))

    setMessage('')
    setError('')
  }

  const getFirebaseError = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'

      case 'auth/user-not-found':
        return 'No account was found with this email address.'

      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'

      case 'auth/invalid-credential':
        return 'Email or password is incorrect.'

      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'

      case 'auth/weak-password':
        return 'Password should contain at least 8 characters.'

      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait and try again.'

      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.'

      case 'auth/operation-not-allowed':
        return 'Email/password authentication is not enabled in Firebase.'

      default:
        return 'Something went wrong. Please try again.'
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setMessage('')
    setError('')

    const email = form.email.trim()

    if (mode === 'login') {
      if (!email || !form.password) {
        setError('Please enter your email and password.')
        return
      }

      setLoading(true)

      try {
        await signInWithEmailAndPassword(
          auth,
          email,
          form.password,
        )

        setMessage('Login successful.')
        onSuccess()
      } catch (firebaseError) {
        console.error('LOGIN ERROR:', firebaseError)
        setError(getFirebaseError(firebaseError.code))
      } finally {
        setLoading(false)
      }

      return
    }

    if (mode === 'signup') {
      const name = form.name.trim()

      if (!name) {
        setError('Please enter your full name.')
        return
      }

      if (!form.level) {
        setError('Please select your CA level.')
        return
      }

      if (!form.attempt) {
        setError('Please select your attempt.')
        return
      }

      if (!email) {
        setError('Please enter your email address.')
        return
      }

      if (!form.password) {
        setError('Please create a password.')
        return
      }

      if (form.password.length < 8) {
        setError('Password should contain at least 8 characters.')
        return
      }

      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      setLoading(true)

      try {
        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            form.password,
          )

        await updateProfile(credential.user, {
          displayName: name,
        })

        await createUserProfile(credential.user, {
          name,
          level: form.level,
          attempt: form.attempt,
        })

        setMessage('Account created successfully.')
        onSuccess()
      } catch (firebaseError) {
        console.error('SIGNUP ERROR:', firebaseError)
        setError(getFirebaseError(firebaseError.code))
      } finally {
        setLoading(false)
      }

      return
    }

    if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your email address.')
        return
      }

      setLoading(true)

      try {
        await sendPasswordResetEmail(auth, email)

        setMessage(
          'Password reset instructions have been sent to your email.',
        )
      } catch (firebaseError) {
        console.error(
          'PASSWORD RESET ERROR:',
          firebaseError,
        )

        setError(getFirebaseError(firebaseError.code))
      } finally {
        setLoading(false)
      }
    }
  }

  const attempts = getAttempts(form.level)

  const title =
    mode === 'signup'
      ? 'Create your account'
      : mode === 'forgot'
        ? 'Reset your password'
        : 'Welcome back'

  const subtitle =
    mode === 'signup'
      ? 'Tell us a little about your CA preparation.'
      : mode === 'forgot'
        ? 'Enter your email and we’ll help you get back in.'
        : 'Continue your CA preparation journey.'

  const buttonText = loading
    ? 'Please wait...'
    : mode === 'signup'
      ? 'Create Account'
      : mode === 'forgot'
        ? 'Send Reset Link'
        : 'Log In'

  return (
    <div style={styles.page}>
      <style>
        {`
          .auth-page {
            width: 100%;
            min-height: 100vh;
          }

          .auth-left-panel {
            min-width: 0;
          }

          .auth-right-panel {
            min-width: 0;
          }

          .auth-two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .auth-card {
            width: 100%;
          }

          .auth-input,
          .auth-select {
            min-width: 0;
          }

          .auth-bottom-note {
            text-align: center;
          }

          @media (max-width: 980px) {
            .auth-page {
              grid-template-columns: 1fr !important;
              min-height: 100vh !important;
            }

            .auth-left-panel {
              min-height: auto !important;
              padding: 26px 28px 32px !important;
            }

            .auth-left-content {
              max-width: 720px !important;
              margin: 30px auto 0 !important;
              padding: 35px 0 20px !important;
            }

            .auth-left-title {
              font-size: 43px !important;
            }

            .auth-benefits {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            .auth-left-footer {
              margin-top: 28px;
            }

            .auth-right-panel {
              min-height: auto !important;
              padding: 35px 28px 30px !important;
            }

            .auth-card {
              max-width: 620px !important;
            }
          }

          @media (max-width: 650px) {
            .auth-left-panel {
              padding: 20px 16px 24px !important;
            }

            .auth-back-button {
              font-size: 11px !important;
            }

            .auth-brand-area {
              margin-top: 26px !important;
            }

            .auth-brand-logo-box {
              width: 34px !important;
              height: 34px !important;
              font-size: 11px !important;
            }

            .auth-brand-text {
              font-size: 19px !important;
            }

            .auth-left-content {
              padding: 28px 0 14px !important;
            }

            .auth-left-title {
              font-size: 35px !important;
              line-height: 1.06 !important;
            }

            .auth-left-text {
              font-size: 13px !important;
              line-height: 1.65 !important;
            }

            .auth-benefits {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
              margin-top: 28px !important;
            }

            .auth-benefit-icon {
              width: 34px !important;
              height: 34px !important;
            }

            .auth-benefit-title {
              font-size: 13px !important;
            }

            .auth-benefit-text {
              font-size: 11px !important;
            }

            .auth-left-footer {
              font-size: 9px !important;
              flex-wrap: wrap;
            }

            .auth-right-panel {
              padding: 20px 14px 25px !important;
            }

            .auth-card {
              max-width: none !important;
              padding: 24px 17px !important;
              border-radius: 16px !important;
            }

            .auth-title {
              font-size: 28px !important;
            }

            .auth-subtitle {
              font-size: 12px !important;
            }

            .auth-two-column {
              grid-template-columns: 1fr !important;
              gap: 15px !important;
            }

            .auth-input,
            .auth-select {
              font-size: 13px !important;
              padding-top: 13px !important;
              padding-bottom: 13px !important;
            }

            .auth-login-options {
              align-items: flex-start !important;
            }

            .auth-submit-button {
              padding: 14px !important;
            }

            .auth-switch-area {
              flex-wrap: wrap;
              text-align: center;
              line-height: 1.5;
            }

            .auth-bottom-note {
              flex-wrap: wrap;
              justify-content: center;
              font-size: 9px !important;
              line-height: 1.5;
            }
          }

          @media (max-width: 380px) {
            .auth-left-title {
              font-size: 32px !important;
            }

            .auth-card {
              padding: 21px 14px !important;
            }

            .auth-title {
              font-size: 26px !important;
            }
          }
        `}
      </style>

      <div
        className="auth-page"
        style={styles.layout}
      >
        {/* LEFT PANEL */}
        <div
          className="auth-left-panel"
          style={styles.leftPanel}
        >
          <button
            type="button"
            className="auth-back-button"
            onClick={onBack}
            style={styles.backButton}
            disabled={loading}
          >
            ← Back to PrepCore.AI
          </button>

          <div
            className="auth-brand-area"
            style={styles.brandArea}
          >
            <div style={styles.logoWrap}>
              <div
                className="auth-brand-logo-box"
                style={styles.logoBox}
              >
                CA
              </div>

              <div
                className="auth-brand-text"
                style={styles.logoText}
              >
                <strong>PrepCore</strong>
                <span>.AI</span>
              </div>
            </div>

            <div style={styles.brandBadge}>
              <span>✦</span>
              CA STUDY PLATFORM
            </div>
          </div>

          <div
            className="auth-left-content"
            style={styles.leftContent}
          >
            <h1
              className="auth-left-title"
              style={styles.leftTitle}
            >
              Your preparation.
              <br />
              <span>One focused system.</span>
            </h1>

            <p
              className="auth-left-text"
              style={styles.leftText}
            >
              Plan your study, track every chapter, revise on
              time, practice questions and get help from
              PrepCore AI.
            </p>

            <div
              className="auth-benefits"
              style={styles.benefits}
            >
              <Benefit
                icon="✦"
                title="AI Doubt Solver"
                text="Clear explanations for your CA doubts."
              />

              <Benefit
                icon="◷"
                title="Study Planner"
                text="Keep your daily preparation organised."
              />

              <Benefit
                icon="✓"
                title="Practice & Revision"
                text="Turn preparation into measurable progress."
              />
            </div>
          </div>

          <div
            className="auth-left-footer"
            style={styles.leftFooter}
          >
            <span>CA PrepCore.AI</span>
            <span>Built for CA students</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="auth-right-panel"
          style={styles.rightPanel}
        >
          <div
            className="auth-card"
            style={styles.authCard}
          >
            <div style={styles.authHeader}>
              <div style={styles.authEyebrow}>
                {mode === 'signup'
                  ? 'CREATE YOUR ACCOUNT'
                  : mode === 'forgot'
                    ? 'ACCOUNT RECOVERY'
                    : 'CA PREPCORE.AI'}
              </div>

              <h2
                className="auth-title"
                style={styles.authTitle}
              >
                {title}
              </h2>

              <p
                className="auth-subtitle"
                style={styles.authSubtitle}
              >
                {subtitle}
              </p>
            </div>

            {message && (
              <div style={styles.successMessage}>
                <span>✓</span>
                <p style={styles.messageText}>
                  {message}
                </p>
              </div>
            )}

            {error && (
              <div style={styles.errorMessage}>
                <span>!</span>
                <p style={styles.messageText}>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {mode === 'signup' && (
                <>
                  <label style={styles.field}>
                    <span style={styles.label}>
                      Full Name
                    </span>

                    <div style={styles.inputWrap}>
                      <span style={styles.inputIcon}>◯</span>

                      <input
                        className="auth-input"
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                          updateField(
                            'name',
                            event.target.value,
                          )
                        }
                        placeholder="Enter your full name"
                        style={styles.input}
                        autoComplete="name"
                        disabled={loading}
                      />
                    </div>
                  </label>

                  <div
                    className="auth-two-column"
                    style={styles.twoColumn}
                  >
                    <label style={styles.field}>
                      <span style={styles.label}>
                        CA Level
                      </span>

                      <div style={styles.inputWrap}>
                        <span style={styles.inputIcon}>
                          ◎
                        </span>

                        <select
                          className="auth-select"
                          value={form.level}
                          onChange={handleLevelChange}
                          style={styles.select}
                          disabled={loading}
                        >
                          <option value="CA Foundation">
                            CA Foundation
                          </option>

                          <option value="CA Intermediate">
                            CA Intermediate
                          </option>

                          <option value="CA Final">
                            CA Final
                          </option>
                        </select>
                      </div>
                    </label>

                    <label style={styles.field}>
                      <span style={styles.label}>
                        Attempt
                      </span>

                      <div style={styles.inputWrap}>
                        <span style={styles.inputIcon}>
                          ◷
                        </span>

                        <select
                          className="auth-select"
                          value={form.attempt}
                          onChange={(event) =>
                            updateField(
                              'attempt',
                              event.target.value,
                            )
                          }
                          style={styles.select}
                          disabled={loading}
                        >
                          {attempts.map((attempt) => (
                            <option
                              key={attempt}
                              value={attempt}
                            >
                              {attempt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                  </div>
                </>
              )}

              <label style={styles.field}>
                <span style={styles.label}>
                  Email Address
                </span>

                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>@</span>

                  <input
                    className="auth-input"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        'email',
                        event.target.value,
                      )
                    }
                    placeholder="you@example.com"
                    style={styles.input}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </label>

              {mode !== 'forgot' && (
                <>
                  <label style={styles.field}>
                    <span style={styles.label}>
                      Password
                    </span>

                    <div style={styles.inputWrap}>
                      <span style={styles.inputIcon}>•</span>

                      <input
                        className="auth-input"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={form.password}
                        onChange={(event) =>
                          updateField(
                            'password',
                            event.target.value,
                          )
                        }
                        placeholder="Enter your password"
                        style={{
                          ...styles.input,
                          paddingRight: '48px',
                        }}
                        autoComplete={
                          mode === 'signup'
                            ? 'new-password'
                            : 'current-password'
                        }
                        disabled={loading}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword,
                          )
                        }
                        style={styles.passwordButton}
                        disabled={loading}
                      >
                        {showPassword ? '◉' : '◌'}
                      </button>
                    </div>
                  </label>

                  {mode === 'signup' && (
                    <label style={styles.field}>
                      <span style={styles.label}>
                        Confirm Password
                      </span>

                      <div style={styles.inputWrap}>
                        <span style={styles.inputIcon}>
                          •
                        </span>

                        <input
                          className="auth-input"
                          type="password"
                          value={form.confirmPassword}
                          onChange={(event) =>
                            updateField(
                              'confirmPassword',
                              event.target.value,
                            )
                          }
                          placeholder="Confirm your password"
                          style={styles.input}
                          autoComplete="new-password"
                          disabled={loading}
                        />
                      </div>
                    </label>
                  )}
                </>
              )}

              {mode === 'login' && (
                <div
                  className="auth-login-options"
                  style={styles.loginOptions}
                >
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      changeMode('forgot')
                    }
                    style={styles.textLinkButton}
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === 'forgot' && (
                <div style={styles.infoBox}>
                  <span>i</span>

                  <p style={{ margin: 0 }}>
                    Enter the email address associated with
                    your PrepCore account.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-button"
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
              >
                {buttonText}

                {!loading && <span>→</span>}
              </button>
            </form>

            {mode !== 'forgot' ? (
              <div
                className="auth-switch-area"
                style={styles.switchArea}
              >
                <span>
                  {mode === 'login'
                    ? "Don't have an account?"
                    : 'Already have an account?'}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    changeMode(
                      mode === 'login'
                        ? 'signup'
                        : 'login',
                    )
                  }
                  style={styles.switchButton}
                  disabled={loading}
                >
                  {mode === 'login'
                    ? 'Create account'
                    : 'Log in'}
                </button>
              </div>
            ) : (
              <div
                className="auth-switch-area"
                style={styles.switchArea}
              >
                <span>
                  Remember your password?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    changeMode('login')
                  }
                  style={styles.switchButton}
                >
                  Back to login
                </button>
              </div>
            )}

            <div style={styles.securityNote}>
              <span>✓</span>

              <p style={{ margin: 0 }}>
                Your account information stays protected.
                Never share your password with anyone.
              </p>
            </div>
          </div>

          <div
            className="auth-bottom-note"
            style={styles.bottomNote}
          >
            <span>© 2026 PrepCore.AI</span>
            <span>·</span>
            <span>
              CA Foundation · Intermediate · Final
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Benefit({ icon, title, text }) {
  return (
    <div style={styles.benefit}>
      <div
        className="auth-benefit-icon"
        style={styles.benefitIcon}
      >
        {icon}
      </div>

      <div>
        <strong
          className="auth-benefit-title"
          style={styles.benefitTitle}
        >
          {title}
        </strong>

        <p
          className="auth-benefit-text"
          style={styles.benefitText}
        >
          {text}
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f6f9fc',
    color: '#102d4f',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  layout: {
    width: '100%',
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '47% 53%',
  },

  leftPanel: {
    position: 'relative',
    minHeight: '100vh',
    padding: '34px 8%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    color: '#fff',
    background:
      'linear-gradient(145deg, #102c4d 0%, #173d69 58%, #1b4b7d 100%)',
  },

  backButton: {
    alignSelf: 'flex-start',
    border: 'none',
    background: 'transparent',
    color: '#b9c9dc',
    padding: 0,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  brandArea: {
    marginTop: '40px',
  },

  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },

  logoBox: {
    width: '40px',
    height: '40px',
    borderRadius: '11px',
    display: 'grid',
    placeItems: 'center',
    background:
      'linear-gradient(145deg, #e3b552, #b77d25)',
    color: '#16375c',
    fontSize: '13px',
    fontWeight: 800,
  },

  logoText: {
    fontSize: '22px',
    letterSpacing: '-.04em',
    color: '#fff',
  },

  brandBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '18px',
    color: '#cfdbeb',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '.14em',
  },

  leftContent: {
    maxWidth: '570px',
    margin: '30px 0 auto',
    padding: '80px 0 70px',
  },

  leftTitle: {
    margin: '0 0 22px',
    fontSize: '53px',
    lineHeight: 1.04,
    letterSpacing: '-.05em',
    fontWeight: 800,
  },

  leftText: {
    margin: 0,
    maxWidth: '520px',
    color: '#c4d2e1',
    fontSize: '16px',
    lineHeight: 1.75,
  },

  benefits: {
    display: 'grid',
    gap: '19px',
    marginTop: '40px',
  },

  benefit: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '13px',
  },

  benefitIcon: {
    width: '37px',
    height: '37px',
    borderRadius: '10px',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,.10)',
    color: '#e3b552',
    fontWeight: 800,
    flexShrink: 0,
  },

  benefitTitle: {
    display: 'block',
    fontSize: '14px',
    color: '#fff',
    marginBottom: '3px',
  },

  benefitText: {
    margin: 0,
    color: '#adbed2',
    fontSize: '12px',
    lineHeight: 1.5,
  },

  leftFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    color: '#8fa4bb',
    fontSize: '11px',
    borderTop: '1px solid rgba(255,255,255,.10)',
    paddingTop: '18px',
  },

  rightPanel: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '45px 7%',
    background:
      'radial-gradient(circle at 80% 10%, rgba(36,77,121,.06), transparent 30%), #f7f9fc',
    overflowY: 'auto',
  },

  authCard: {
    width: '100%',
    maxWidth: '560px',
    padding: '38px',
    borderRadius: '20px',
    background: '#fff',
    border: '1px solid #e2e9f1',
    boxShadow:
      '0 25px 60px rgba(22,48,78,.08)',
  },

  authHeader: {
    marginBottom: '25px',
  },

  authEyebrow: {
    color: '#b0802e',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '.15em',
  },

  authTitle: {
    margin: '9px 0 8px',
    color: '#102d4f',
    fontSize: '34px',
    lineHeight: 1.1,
    letterSpacing: '-.04em',
  },

  authSubtitle: {
    margin: 0,
    color: '#73839a',
    fontSize: '14px',
    lineHeight: 1.6,
  },

  successMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    padding: '12px 14px',
    marginBottom: '18px',
    borderRadius: '10px',
    background: '#edf8f2',
    border: '1px solid #d2ecdc',
    color: '#27704a',
  },

  errorMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    padding: '12px 14px',
    marginBottom: '18px',
    borderRadius: '10px',
    background: '#fff1f1',
    border: '1px solid #f0d3d3',
    color: '#9e4545',
  },

  messageText: {
    margin: 0,
    fontSize: '12px',
    lineHeight: 1.5,
  },

  form: {
    display: 'grid',
    gap: '17px',
  },

  field: {
    display: 'grid',
    gap: '8px',
  },

  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },

  label: {
    color: '#294563',
    fontSize: '12px',
    fontWeight: 800,
  },

  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  inputIcon: {
    position: 'absolute',
    left: '15px',
    zIndex: 1,
    color: '#91a0b2',
    fontSize: '14px',
    pointerEvents: 'none',
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 15px 14px 42px',
    border: '1px solid #d9e2ec',
    borderRadius: '10px',
    outline: 'none',
    background: '#fbfcfe',
    color: '#153557',
    fontSize: '14px',
  },

  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 12px 14px 42px',
    border: '1px solid #d9e2ec',
    borderRadius: '10px',
    outline: 'none',
    background: '#fbfcfe',
    color: '#153557',
    fontSize: '13px',
  },

  passwordButton: {
    position: 'absolute',
    right: '10px',
    border: 'none',
    background: 'transparent',
    color: '#73849a',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
  },

  loginOptions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#75859a',
    fontSize: '12px',
    cursor: 'pointer',
  },

  textLinkButton: {
    border: 'none',
    background: 'transparent',
    color: '#1b4c83',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
  },

  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    padding: '12px 14px',
    borderRadius: '10px',
    background: '#f2f6fa',
    color: '#60738a',
    fontSize: '12px',
    lineHeight: 1.5,
  },

  submitButton: {
    width: '100%',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    border: 'none',
    borderRadius: '10px',
    background: '#17375f',
    color: '#fff',
    padding: '15px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow:
      '0 10px 24px rgba(23,55,95,.17)',
  },

  switchArea: {
    marginTop: '22px',
    paddingTop: '20px',
    borderTop: '1px solid #e8edf3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#7b899b',
  },

  switchButton: {
    border: 'none',
    background: 'transparent',
    color: '#1b4c83',
    fontWeight: 800,
    cursor: 'pointer',
    padding: 0,
    fontSize: '12px',
  },

  securityNote: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '7px',
    marginTop: '20px',
    color: '#99a5b4',
    fontSize: '10px',
    lineHeight: 1.5,
    textAlign: 'center',
  },

  bottomNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginTop: '15px',
    color: '#9aa7b8',
    fontSize: '10px',
  },
}

export default Auth