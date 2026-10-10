import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Eye, EyeOff, HeartHandshake, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { sampleUsers } from '../data/sampleData.js'
import { useApp } from '../hooks/useApp'

const loginSchema = z.object({ email: z.string().email('Enter a valid email address.'), password: z.string().min(1, 'Enter a password to continue.'), remember: z.boolean().optional() })
const registerSchema = z.object({ name: z.string().min(2, 'Enter your full name.'), email: z.string().email('Enter a valid email address.'), phone: z.string().min(7, 'Enter a valid phone number.'), password: z.string().min(8, 'Use at least 8 characters.').regex(/[a-z]/, 'Include a lowercase letter.').regex(/[A-Z]/, 'Include an uppercase letter.').regex(/[0-9]/, 'Include a number.'), confirmPassword: z.string(), role: z.enum(['client', 'expert']), terms: z.literal(true, { errorMap: () => ({ message: 'Please accept the terms to continue.' }) }) }).refine((values) => values.password === values.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' })
const resetSchema = z.object({ email: z.string().email('Enter a valid email address.') })

function AuthFrame({ children, title, copy, eyebrow = 'YOUR NEXT STEP' }) {
  return <main className="auth-page"><Link to="/" className="brand auth-brand"><span className="brand-mark"><HeartHandshake size={21} /></span><span>marriage<span>care</span></span></Link><div className="auth-frame"><div className="auth-visual"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div><p className="auth-photo-note">SUPPLIED PHOTOGRAPHY · FICTIONAL PROFILES</p></div><div className="auth-content">{children}</div></div><p className="auth-footnote"><ShieldAlert size={15} /> Simulated authentication only. Do not use a real password or enter confidential counselling information.</p></main>
}

function FieldError({ children }) {
  return children ? <small className="field-error">{children}</small> : null
}

function Destination({ account }) {
  return `/${account.role}/dashboard`
}

export function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const [visiblePassword, setVisiblePassword] = useState(false)
  const { signIn, toast } = useApp()
  const navigate = useNavigate()
  const schema = isRegister ? registerSchema : loginSchema
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { role: 'client', remember: true } })

  function onSubmit(values) {
    let account
    if (isRegister) {
      account = { name: values.name, email: values.email, role: values.role, phone: values.phone }
      toast('sample account created. No password was stored.')
    } else {
      const match = sampleUsers.find((item) => item.email.toLowerCase() === values.email.toLowerCase())
      account = match || { name: values.email.split('@')[0].replace(/[._-]/g, ' '), email: values.email, role: 'client' }
      toast(match ? 'sample sign-in successful.' : 'Signed in to a client sample account.')
    }
    const signedInAccount = signIn(account, values.remember)
    navigate(Destination({ account: signedInAccount }), { replace: true })
  }

  function openSamplePortal(account) {
    signIn(account)
    toast(`${account.role[0].toUpperCase()}${account.role.slice(1)} portal opened.`)
    navigate(`/${account.role}/dashboard`, { replace: true })
  }

  return <AuthFrame title={isRegister ? 'A thoughtful place to begin.' : 'Welcome back to your next step.'} copy={isRegister ? 'Create a sample account to explore a client or professional portal.' : 'Sign in to continue exploring the MarriageCare sample.'} eyebrow={isRegister ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}>
    <Link to="/" className="back-link auth-back"><ArrowLeft size={15} /> Back to MarriageCare</Link><h2>{isRegister ? 'Create an account' : 'Sign in'}</h2><p className="auth-subtitle">{isRegister ? 'Choose the sample experience that fits you.' : 'Use a sample account or enter any email and password.'}</p>
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {isRegister && <><label>Full name<input {...register('name')} autoComplete="name" placeholder="Your full name" /><FieldError>{errors.name?.message}</FieldError></label><label>Phone number<input {...register('phone')} type="tel" autoComplete="tel" placeholder="+233 ..." /><FieldError>{errors.phone?.message}</FieldError></label></>}
      <label>Email address<input {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" /><FieldError>{errors.email?.message}</FieldError></label>
      <label>Password<span className="password-input"><input {...register('password')} type={visiblePassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'At least 8 characters' : 'Enter any sample password'} /><button type="button" aria-label={visiblePassword ? 'Hide password' : 'Show password'} onClick={() => setVisiblePassword((value) => !value)}>{visiblePassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span><FieldError>{errors.password?.message}</FieldError></label>
      {isRegister && <><label>Confirm password<input {...register('confirmPassword')} type="password" autoComplete="new-password" placeholder="Re-enter your password" /><FieldError>{errors.confirmPassword?.message}</FieldError></label><fieldset className="role-choice"><legend>Account type</legend><label><input type="radio" value="client" {...register('role')} /> Client</label><label><input type="radio" value="expert" {...register('role')} /> Expert</label></fieldset><label className="check-row"><input type="checkbox" {...register('terms')} /><span>I agree to the sample terms and privacy notice.</span></label><FieldError>{errors.terms?.message}</FieldError></>}
      {!isRegister && <div className="auth-options"><label className="check-row"><input type="checkbox" {...register('remember')} /><span>Remember me on this device</span></label><Link to="/forgot-password">Forgot password?</Link></div>}
      <p className="form-disclaimer">Simulated sign-in. Passwords are checked in this form but never saved in browser storage. Do not enter a real password.</p>
      <button className="button button-primary auth-submit" disabled={isSubmitting}>{isRegister ? 'Create sample account' : 'Sign in'} <ArrowRight size={16} /></button>
    </form>
    {!isRegister && <div className="sample-signins"><span>Open a portal</span><div><button onClick={() => openSamplePortal(sampleUsers[0])}>Client</button><button onClick={() => openSamplePortal(sampleUsers[6])}>Expert</button><button onClick={() => openSamplePortal(sampleUsers[8])}>Admin</button></div></div>}
    <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to MarriageCare?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
  </AuthFrame>
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resetSchema) })
  return <AuthFrame title="Let’s get you back in." copy="Enter the email address for your sample account. No email will be sent." eyebrow="ACCOUNT HELP"><Link to="/login" className="back-link auth-back"><ArrowLeft size={15} /> Back to sign in</Link><h2>Reset your password</h2>{sent ? <div className="success-panel reset-success"><span><CheckCircle2 size={21} /></span><h3>Sample reset prepared</h3><p>No reset email was sent. Return to sign in and open a sample portal.</p><Link to="/login" className="button button-primary">Back to sign in <ArrowRight size={16} /></Link></div> : <form className="auth-form" onSubmit={handleSubmit(() => setSent(true))} noValidate><p className="auth-subtitle">We’ll show a confirmation here to illustrate the reset flow.</p><label>Email address<input {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" /><FieldError>{errors.email?.message}</FieldError></label><p className="form-disclaimer">This is a simulated reset. No email address is stored or contacted.</p><button className="button button-primary auth-submit">Show sample confirmation <ArrowRight size={16} /></button></form>}</AuthFrame>
}