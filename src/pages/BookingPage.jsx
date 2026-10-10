import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, HeartHandshake, MapPin, Video, Phone, UserRound, ShieldAlert } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { experts, services } from '../data/sampleData.js'
import { useApp } from '../hooks/useApp'

const bookingSchema = z.object({ clientName: z.string().min(2, 'Enter your name.'), email: z.string().email('Enter a valid email address.'), phone: z.string().min(7, 'Enter a valid phone number.'), notes: z.string().max(240, 'Please keep this to 240 characters or fewer.').optional(), contactMethod: z.enum(['Email', 'Phone']) })
const steps = ['Service', 'Professional', 'Format', 'Date & time', 'Your details', 'Review', 'Confirmation']
const slots = ['09:00', '11:00', '14:00', '16:00']
const today = new Date()
const dateValue = (offset) => { const value = new Date(today); value.setDate(value.getDate() + offset); return value.toISOString().slice(0, 10) }

function FormatIcon({ format }) {
  if (format === 'Video') return <Video size={21} />
  if (format === 'Phone') return <Phone size={21} />
  return <MapPin size={21} />
}

export function BookingPage({ confirmation = false }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, appointments, addAppointment } = useApp()
  const presetService = services.find((service) => service.id === searchParams.get('service'))
  const presetExpert = experts.find((expert) => expert.id === searchParams.get('expert'))
  const [step, setStep] = useState(presetExpert ? 1 : 0)
  const [selection, setSelection] = useState({ service: presetService || services[0], expert: presetExpert || null, format: '', date: dateValue(2), time: '' })
  const [booking, setBooking] = useState(null)
  const { register, trigger, getValues, formState: { errors } } = useForm({ resolver: zodResolver(bookingSchema), defaultValues: { clientName: user?.name || '', email: user?.email || '', phone: '', notes: '', contactMethod: 'Email' } })

  const occupied = useMemo(() => new Set(appointments.filter((item) => item.expertId === selection.expert?.id && item.date === selection.date && item.status !== 'cancelled' && item.status !== 'declined').map((item) => item.time)), [appointments, selection.date, selection.expert])
  const canContinue = step === 0 ? Boolean(selection.service) : step === 1 ? Boolean(selection.expert) : step === 2 ? Boolean(selection.format) : step === 3 ? Boolean(selection.date && selection.time && !occupied.has(selection.time)) : true

  async function next() {
    if (step === 4 && !(await trigger())) return
    if (canContinue) setStep((current) => Math.min(current + 1, 5))
  }

  function submitBooking() {
    const values = getValues()
    const created = addAppointment({ ...selection, service: selection.service.name, expertName: selection.expert.name, expertId: selection.expert.id, clientName: values.clientName, clientEmail: values.email, phone: values.phone, notes: values.notes, contactMethod: values.contactMethod, fee: selection.expert.fee, status: 'pending', createdAt: new Date().toISOString() })
    setBooking(created)
    setStep(6)
    navigate(`/booking-confirmation/${created.id}`, { replace: true })
  }

  if (confirmation && booking) return <Confirmation booking={booking} user={user} />
  if (confirmation && !booking) {
    const existing = appointments.find((appointment) => appointment.id === window.location.pathname.split('/').pop())
    if (existing) return <Confirmation booking={existing} user={user} />
  }

  return <main className="booking-page"><div className="booking-top"><Link to="/" className="brand"><span className="brand-mark"><HeartHandshake size={21} /></span><span>marriage<span>care</span></span></Link><span>sample booking · No real appointment is created</span></div><div className="booking-shell"><div className="booking-heading"><Link to="/experts" className="back-link"><ArrowLeft size={15} /> Back to professionals</Link><span className="eyebrow">YOUR NEXT STEP</span><h1>Let’s find a time to talk.</h1><p>Choose what works for you. You can review everything before confirming.</p></div>
    <div className="booking-progress" aria-label={`Step ${Math.min(step + 1, 7)} of 7`}>{steps.map((label, index) => <div className={`progress-step ${index < step ? 'is-done' : ''} ${index === step ? 'is-current' : ''}`} key={label}><span>{index < step ? <Check size={14} /> : index + 1}</span><small>{label}</small></div>)}</div>
    <section className="booking-card">
      {step === 0 && <><span className="eyebrow">STEP 01 · WHAT BRINGS YOU HERE?</span><h2>Choose a service.</h2><p className="booking-help">Start with the kind of support that feels closest to what you need.</p><div className="booking-choice-grid">{services.map((service) => <button key={service.id} className={`choice-card ${selection.service.id === service.id ? 'is-selected' : ''}`} onClick={() => setSelection((current) => ({ ...current, service }))}><span className="choice-check">{selection.service.id === service.id && <Check size={14} />}</span><strong>{service.name}</strong><small>{service.description}</small><span className="choice-price">Illustrative · GHS {service.price}+</span></button>)}</div></>}
      {step === 1 && <><span className="eyebrow">STEP 02 · WHO WOULD YOU LIKE TO MEET?</span><h2>Choose a professional.</h2><p className="booking-help">These are fictional sample profiles. Fees are illustrative.</p><div className="booking-expert-list">{experts.filter((expert) => !selection.service || expert.specialties.some((specialty) => `${selection.service.name} ${selection.service.category}`.toLowerCase().split(' ').some((word) => word.length > 4 && specialty.toLowerCase().includes(word))) || expert.id === presetExpert?.id).slice(0, 6).map((expert) => <button key={expert.id} className={`booking-expert ${selection.expert?.id === expert.id ? 'is-selected' : ''}`} onClick={() => setSelection((current) => ({ ...current, expert, format: expert.formats.includes(current.format) ? current.format : '' }))}><img src={expert.image} alt="" /><span><strong>{expert.name}</strong><small>{expert.title} · {expert.experience} years</small><small>{expert.formats.join(' · ')} · {expert.languages.join(', ')}</small></span><b>GHS {expert.fee}</b><span className="choice-check">{selection.expert?.id === expert.id && <Check size={14} />}</span></button>)}</div></>}
      {step === 2 && <><span className="eyebrow">STEP 03 · HOW WOULD YOU LIKE TO MEET?</span><h2>Choose a session format.</h2><p className="booking-help">Your selected professional offers the following sample formats.</p><div className="format-options">{(selection.expert?.formats || []).map((format) => <button key={format} className={`format-card ${selection.format === format ? 'is-selected' : ''}`} onClick={() => setSelection((current) => ({ ...current, format }))}><FormatIcon format={format} /><strong>{format}</strong><small>{format === 'In person' ? 'Location arrangements are simulated.' : `A simulated ${format.toLowerCase()} appointment.`}</small>{selection.format === format && <Check size={16} />}</button>)}</div><p className="form-disclaimer">No call or in-person meeting will take place. This is a frontend prototype.</p></>}
      {step === 3 && <><span className="eyebrow">STEP 04 · PICK A MOMENT</span><h2>Choose a date and time.</h2><p className="booking-help">All availability is simulated. Times shown in Ghana time (GMT).</p><label className="booking-date">Date<input type="date" min={dateValue(0)} value={selection.date} onChange={(event) => setSelection((current) => ({ ...current, date: event.target.value, time: '' }))} /></label><div className="time-slots">{slots.map((time) => <button key={time} disabled={occupied.has(time)} className={`time-slot ${selection.time === time ? 'is-selected' : ''}`} onClick={() => setSelection((current) => ({ ...current, time }))}><Clock3 size={15} />{time}{occupied.has(time) && <small>Booked</small>}</button>)}</div>{selection.expert && occupied.size > 0 && <p className="field-error">Some sample times are already booked with {selection.expert.name}.</p>}</>}
      {step === 4 && <><span className="eyebrow">STEP 05 · JUST THE ESSENTIALS</span><h2>How can we reach you?</h2><p className="booking-help">Share only the details needed for this sample booking. Please avoid sensitive relationship or health information.</p><div className="form-grid booking-form-grid"><label>Your name<input {...register('clientName')} autoComplete="name" placeholder="Full name" />{errors.clientName && <small className="field-error">{errors.clientName.message}</small>}</label><label>Email address<input {...register('email')} autoComplete="email" type="email" placeholder="you@example.com" />{errors.email && <small className="field-error">{errors.email.message}</small>}</label><label>Phone number<input {...register('phone')} autoComplete="tel" type="tel" placeholder="+233 ..." />{errors.phone && <small className="field-error">{errors.phone.message}</small>}</label><label>Preferred contact<select {...register('contactMethod')}><option>Email</option><option>Phone</option></select></label><label className="field-full">A short note (optional)<textarea {...register('notes')} maxLength="240" rows="3" placeholder="A sentence about the kind of support you’re looking for" />{errors.notes && <small className="field-error">{errors.notes.message}</small>}</label><p className="form-disclaimer field-full">Keep this general. The sample does not store detailed personal histories or private counselling notes.</p></div></>}
      {step === 5 && <><span className="eyebrow">STEP 06 · PLEASE CHECK THE DETAILS</span><h2>Review your booking.</h2><p className="booking-help">Your appointment will remain pending in this sample.</p><div className="booking-review"><div><span>Service</span><strong>{selection.service.name}</strong></div><div><span>Professional</span><strong>{selection.expert?.name}</strong></div><div><span>Format</span><strong>{selection.format}</strong></div><div><span>Date & time</span><strong>{new Date(`${selection.date}T${selection.time}:00`).toLocaleString('en-GH', { dateStyle: 'long', timeStyle: 'short' })}</strong></div><div><span>Client</span><strong>{getValues('clientName')} · {getValues('email')}</strong></div><div><span>Illustrative fee</span><strong>GHS {selection.expert?.fee}</strong></div></div><div className="booking-policy"><ShieldAlert size={17} /><p>sample booking only. No payment is collected, and no appointment or cancellation policy applies to a real service.</p></div></>}
      {step === 6 && booking && <Confirmation booking={booking} user={user} />}
      {step < 6 && <div className="booking-footer"><button className="button button-quiet" onClick={() => step === 0 ? navigate('/experts') : setStep((current) => current - 1)}><ArrowLeft size={16} /> Back</button><span>Step {step + 1} of 7</span>{step === 5 ? <button className="button button-primary" onClick={submitBooking}>Confirm sample booking <CheckCircle2 size={17} /></button> : <button className="button button-primary" disabled={!canContinue} onClick={next}>Continue <ArrowRight size={16} /></button>}</div>}
    </section><p className="booking-footnote"><ShieldAlert size={15} /> This is a simulated experience. Do not submit real personal or confidential information.</p></div></main>
}

function Confirmation({ booking, user }) {
  return <main className="confirmation-page"><div className="confirmation-card"><span className="confirmation-icon"><CheckCircle2 size={31} /></span><span className="eyebrow">STEP 07 · CONFIRMED IN sample</span><h1>Your next step is booked.</h1><p>This is a simulated appointment request. Nothing has been sent to a professional.</p><div className="confirmation-reference"><span>sample booking reference</span><strong>{booking.id}</strong></div><div className="confirmation-details"><div><CalendarDays size={17} /><span>{new Date(`${booking.date}T${booking.time}:00`).toLocaleString('en-GH', { dateStyle: 'medium', timeStyle: 'short' })}</span></div><div><UserRound size={17} /><span>{booking.expertName}</span></div><div><Video size={17} /><span>{booking.format} · Pending response</span></div><div><span>GHS</span><span>Illustrative fee: GHS {booking.fee}</span></div></div><div className="booking-policy"><ShieldAlert size={17} /><p>No real appointment was created and no payment was collected. This sample request is stored only in this browser.</p></div><div className="confirmation-actions">{user?.role === 'client' && <Link className="button button-primary" to="/client/appointments">View sample appointments <ArrowRight size={16} /></Link>}<Link className="button button-outline" to="/">Return home</Link></div></div></main>
}