import { useState } from 'react'
import { Link } from 'react-router-dom'
import buzzboxLogo from '../../../BUZZ BOX LOGO.png'
import Button from './Button.jsx'
import { tw } from '../styles/tailwind.js'

function Field({ id, label, type = 'text', placeholder, autoComplete, minLength, action, onAction, optional = false }) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' && showPassword ? 'text' : type
  return (
    <label className={tw.field} htmlFor={id}>
      <span className={tw.fieldLabel}>{label}{optional && <span className={tw.fieldOptional}>OPTIONAL</span>}{action && <button className={tw.fieldAction} type="button" onClick={onAction}>{action}</button>}</span>
      <span className={tw.inputFrame}>
        <input className={tw.input} id={id} name={id} type={inputType} placeholder={placeholder} autoComplete={autoComplete} required={!optional} minLength={minLength} />
        {type === 'password' && <button className={tw.inputIcon} type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? '◉' : '◎'}</button>}
      </span>
    </label>
  )
}

function SocialButtons() {
  return <div className="grid grid-cols-[1.5fr_1fr] gap-2">
    <Button variant="outline" type="button" disabled title="Google sign-in is not configured yet"><b className="mr-1.5 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-[13px] text-transparent">G</b>GOOGLE · SOON</Button>
    <Button variant="outline" type="button" disabled title="Apple sign-in is not configured yet"><b className="mr-1.5 text-[13px]">⌘</b>APPLE · SOON</Button>
  </div>
}

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [showResetInfo, setShowResetInfo] = useState(false)

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
      const response = await fetch(`/api/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          password,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not complete your request.')
      setNotice({ type: 'success', message: isSignup ? `Account created. Welcome to the scene, ${result.user.name}.` : `Welcome back, ${result.user.name}.` })
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
      <p className="mb-[18px] text-[11px] leading-[1.65] text-[#aaa99f]">{isSignup ? 'Sign up to discover events, save your scene, and manage your passes.' : 'Sign in to unlock passes, secret lineups, and your digital ticket vault.'}</p>

      {!isSignup && <div className="mb-[17px] grid grid-cols-2 border-b border-[#39393e] text-center text-[9px] font-extrabold tracking-[.08em]"><button className="cursor-not-allowed px-1 py-[11px] text-[#77776f]" type="button" disabled title="Phone sign-in needs an SMS provider">PHONE OTP · SOON</button><span className="border-b-2 border-[#dfff00] px-1 py-[11px] text-[#dfff00]">EMAIL &amp; PASSWORD</span></div>}

      <form onSubmit={submit}>
        {isSignup && <Field id="name" label="FULL NAME" placeholder="How should we call you?" autoComplete="name" minLength={2} />}
        <Field id="email" label="EMAIL ADDRESS" type="email" placeholder="you@example.com" autoComplete="email" />
        {isSignup && <Field id="phone" label="MOBILE NUMBER" type="tel" placeholder="+91  00000 00000" autoComplete="tel" optional />}
        <Field id="password" label="PASSWORD" type="password" placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={8} action={!isSignup ? 'FORGOT?' : undefined} onAction={() => setShowResetInfo(true)} />
        {isSignup && <Field id="confirmPassword" label="CONFIRM PASSWORD" type="password" placeholder="Enter your password again" autoComplete="new-password" minLength={8} />}
        <Button className="mt-1" type="submit" disabled={busy}>{busy ? 'PLEASE WAIT…' : isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'} <span className="text-[17px]">↗</span></Button>
      </form>

      {showResetInfo && <p className="mt-2 border-l-2 border-[#dfff00] bg-[#232520] p-2 text-[10px] leading-5 text-[#e9edc6]" role="status">Password reset is not set up yet. Please contact BuzzBox support.</p>}
      {notice && <p className={`${tw.notice} ${notice.type === 'error' ? 'border-[#ff534a] bg-[#281b1c] text-[#ffd2ce]' : 'border-[#dfff00] bg-[#232520] text-[#e9edc6]'}`} role="status">{notice.message}</p>}

      {!isSignup && <button className="mt-2.5 flex w-full items-center gap-2 border border-[#38383e] bg-[#1d1d22] p-2.5 text-left text-[8px] tracking-[.06em] text-[#d9d8d1]" type="button" onClick={() => setNotice({ type: 'error', message: 'Truecaller autofill needs its mobile provider SDK.' })}><span className="text-sm text-[#dfff00]">✓</span><b>1-TAP TRUECALLER INSTANT</b><small className="ml-auto text-[7px] tracking-[.13em] text-[#a9a99e]">AUTO FILL</small></button>}
      <div className="my-3 flex items-center gap-2.5 text-[8px] font-extrabold tracking-[.14em] text-[#77776f]"><span className="h-px flex-1 bg-[#333339]" />OR CONTINUE WITH<span className="h-px flex-1 bg-[#333339]" /></div>
      <SocialButtons />
      {!isSignup && <button className="mt-3.5 block w-full text-center text-[8px] font-extrabold tracking-[.07em] text-[#dfff00]" type="button" onClick={() => setNotice({ type: 'error', message: 'Pass recovery by phone will be available once SMS sign-in is configured.' })}>↳ &nbsp; LOST TICKET LINK? RETRIEVE PASS WITH PHONE</button>}
      <div className="mt-[17px] border-t border-[#303036] pt-[15px] text-center text-[8px] font-extrabold tracking-[.08em] text-[#aaa99f]">{isSignup ? 'ALREADY HAVE AN ACCOUNT?' : 'NEW TO THE SCENE?'} <Link className="pl-1 text-[#dfff00]" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'SIGN IN' : 'CREATE ACCOUNT'} <span className="ml-0.5 text-[13px]">→</span></Link></div>
      <button className="mx-auto mt-3.5 block border-0 bg-transparent text-[8px] font-extrabold tracking-[.09em] text-[#bab9b1]" type="button" onClick={() => setNotice({ type: 'error', message: 'Organizer accounts are coming soon.' })}>{isSignup ? 'CREATE ORGANIZER ACCOUNT' : 'PROMOTER DESK'} <span className="ml-0.5 text-[13px]">→</span></button>
      {isSignup && <p className="mt-3.5 text-center text-[9px] leading-relaxed text-[#8e8d86]">By creating an account, you agree to the <a className="text-[#deddd6] underline" href="#terms">BuzzBox Terms of Service</a> and <a className="text-[#deddd6] underline" href="#privacy">Privacy Policy</a>.</p>}
    </section>
  )
}
