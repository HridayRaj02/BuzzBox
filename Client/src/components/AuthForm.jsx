// Shared sign-in/sign-up form. The mode prop controls its fields and API action.
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import buzzboxLogo from '../../../BUZZ BOX LOGO.png'
import Button from './Button.jsx'
import { tw } from '../styles/tailwind.js'
import { useAuth } from '../hooks/useAuthContext.js'

function Field({ id, label, type = 'text', placeholder, autoComplete, minLength, action, onAction, optional = false, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' && showPassword ? 'text' : type
  return (
    <label className={tw.field} htmlFor={id}>
      <span className={tw.fieldLabel}>{label}{optional && <span className={tw.fieldOptional}>OPTIONAL</span>}{action && <button className={tw.fieldAction} type="button" onClick={onAction}>{action}</button>}</span>
      <span className={tw.inputFrame}>
        <input className={tw.input} id={id} name={id} type={inputType} placeholder={placeholder} autoComplete={autoComplete} required={!optional} minLength={minLength} value={value} onChange={onChange} />
        {type === 'password' && <button className={tw.inputIcon} type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? '◉' : '◎'}</button>}
      </span>
    </label>
  )
}

function GoogleSignInButton() {
  // OAuth must begin with a browser redirect so Google can show its consent screen.
  return <a href="/api/auth/google" className="flex h-[38px] w-full items-center justify-center border border-[#333339] bg-[#18181c] text-[8px] font-extrabold tracking-[.07em] text-[#dfff00] transition hover:border-[#dfff00] hover:bg-[#232520]"><b className="mr-1.5 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-[13px] text-transparent">G</b>CONTINUE WITH GOOGLE</a>
}

export default function AuthForm({ mode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup } = useAuth()
  const isSignup = mode === 'signup'
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [showResetInfo, setShowResetInfo] = useState(false)
  const [email, setEmail] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  async function submit(event) {
    event.preventDefault()
    setNotice(null)
    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    if (isSignup && password !== formData.get('confirmPassword')) {
      setNotice({ type: 'error', message: 'Your passwords do not match.' })
      return
    }

    setBusy(true)
    try {
      if (isSignup) await signup({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          password,
        })
      else await login(formData.get('email'), password)
      navigate(location?.state?.from || '/explore', { replace: true })
    } catch (error) {
      setNotice({ type: 'error', message: error instanceof TypeError ? 'Could not reach the sign-in service. Check that the API server is running.' : error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={tw.authCard}>
      <div className="flex items-center gap-2 text-[8px] font-extrabold tracking-[.17em] text-[#aaa99f]"><img className="h-[25px] w-[25px] object-contain" src={buzzboxLogo} alt="" />YOUR NIGHT, UNLOCKED</div>
      <h1 className="mb-1.5 mt-[17px] font-[Epilogue] text-[23px] leading-tight font-extrabold tracking-[-.045em]">{isSignup ? 'CREATE YOUR ACCOUNT' : 'ENTER THE SCENE'}</h1>
      <p className="mb-[18px] text-[11px] leading-[1.65] text-[#aaa99f]">{isSignup ? 'Sign up to discover events, save your scene, and manage your passes.' : 'Sign in to save events, manage your passes, and book tickets.'}</p>

      <form onSubmit={submit}>
        {isSignup && <Field id="name" label="FULL NAME" placeholder="How should we call you?" autoComplete="name" minLength={2} />}
        <Field id="email" label="EMAIL ADDRESS" type="email" placeholder="you@example.com" autoComplete="email" value={isSignup ? undefined : email} onChange={isSignup ? undefined : (event) => setEmail(event.target.value)} />
        {isSignup && <Field id="phone" label="MOBILE NUMBER" type="tel" placeholder="+91  00000 00000" autoComplete="tel" optional />}
        <Field id="password" label="PASSWORD" type="password" placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={8} action={!isSignup ? 'FORGOT?' : undefined} onAction={() => setShowResetInfo(true)} value={isSignup ? undefined : passwordValue} onChange={isSignup ? undefined : (event) => setPasswordValue(event.target.value)} />
        {isSignup && <Field id="confirmPassword" label="CONFIRM PASSWORD" type="password" placeholder="Enter your password again" autoComplete="new-password" minLength={8} />}
        <Button className="mt-1" type="submit" disabled={busy}>{busy ? 'PLEASE WAIT…' : isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'} <span className="text-[17px]">↗</span></Button>
      </form>

      {showResetInfo && <p className="mt-2 border-l-2 border-[#dfff00] bg-[#232520] p-2 text-[10px] leading-5 text-[#e9edc6]" role="status">Password reset is not set up yet. Please contact BuzzBox support.</p>}
      {notice && <p className={`${tw.notice} ${notice.type === 'error' ? 'border-[#ff534a] bg-[#281b1c] text-[#ffd2ce]' : 'border-[#dfff00] bg-[#232520] text-[#e9edc6]'}`} role="status">{notice.message}</p>}

      <div className="my-3 flex items-center gap-2.5 text-[8px] font-extrabold tracking-[.14em] text-[#77776f]"><span className="h-px flex-1 bg-[#333339]" />OR<span className="h-px flex-1 bg-[#333339]" /></div>
      <GoogleSignInButton />
      <div className="mt-[17px] border-t border-[#303036] pt-[15px] text-center text-[8px] font-extrabold tracking-[.08em] text-[#aaa99f]">{isSignup ? 'ALREADY HAVE AN ACCOUNT?' : 'NEW TO THE SCENE?'} <Link className="pl-1 text-[#dfff00]" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'SIGN IN' : 'CREATE ACCOUNT'} <span className="ml-0.5 text-[13px]">→</span></Link></div>
      <button className="mx-auto mt-3.5 block border-0 bg-transparent text-[8px] font-extrabold tracking-[.09em] text-[#bab9b1]" type="button" onClick={() => setNotice({ type: 'error', message: 'Organizer accounts are coming soon.' })}>{isSignup ? 'CREATE ORGANIZER ACCOUNT' : 'PROMOTER DESK'} <span className="ml-0.5 text-[13px]">→</span></button>
      {isSignup && <p className="mt-3.5 text-center text-[9px] leading-relaxed text-[#8e8d86]">By creating an account, you agree to the <a className="text-[#deddd6] underline" href="#terms">BuzzBox Terms of Service</a> and <a className="text-[#deddd6] underline" href="#privacy">Privacy Policy</a>.</p>}
    </section>
  )
}
