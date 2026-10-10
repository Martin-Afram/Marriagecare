import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, FileText, ShieldAlert, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import '../recruitment.css'

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Enter your full legal name.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().min(7, 'Enter a valid phone number.'),
  city: z.string().min(2, 'Enter your city or region.'),
  professionalTitle: z.string().min(3, 'Enter the title you are applying under.'),
  highestQualification: z.string().min(2, 'Add your highest relevant qualification.'),
  institution: z.string().min(2, 'Enter the awarding institution.'),
  fieldOfStudy: z.string().min(2, 'Enter your field of study.'),
  yearsExperience: z.string().min(1, 'Enter your years of relevant experience.'),
  specialties: z.string().min(3, 'Add at least one area of expertise.'),
  languages: z.string().min(2, 'List the languages you can counsel in.'),
  registration: z.string().min(2, 'Describe your professional registration status.'),
  approach: z.string().min(80, 'Please provide at least 80 characters about your approach.'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm the application declaration.' }) }),
})

export function CounsellorApplicationPage() {
  const [cvFile, setCvFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const { submitApplication } = useApp()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(applicationSchema) })

  function onFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return setCvFile(null)
    const allowedType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    const allowedExtension = /\.(pdf|doc|docx)$/i.test(file.name)
    if ((!allowedType && !allowedExtension) || file.size > 10 * 1024 * 1024) {
      setCvFile(null)
      setFileError('Choose a PDF or Word document up to 10 MB.')
      event.target.value = ''
      return
    }
    setFileError('')
    setCvFile(file)
  }

  function onSubmit(values) {
    if (!cvFile) {
      setFileError('Attach your CV to continue.')
      return
    }
    const application = submitApplication({
      ...values,
      specialties: values.specialties.split(',').map((item) => item.trim()).filter(Boolean),
      languages: values.languages.split(',').map((item) => item.trim()).filter(Boolean),
      cvName: cvFile.name,
    }, cvFile)
    setSubmitted(application)
  }

  if (submitted) return <main className="application-page"><div className="application-success"><span className="confirmation-icon"><Check size={26} /></span><span className="eyebrow">APPLICATION RECEIVED</span><h1>Thank you for putting yourself forward.</h1><p>Your counsellor application has been added to the platform administrator’s review queue in this browser.</p><div className="application-reference"><span>Application reference</span><strong>{submitted.id}</strong></div><div className="application-review-note"><ShieldAlert size={18} /><p>Your application is pending review. Qualifications, registration, references, and identity still need independent verification before any professional listing or client access.</p></div><div className="application-actions"><Link className="button button-primary" to="/">Return to MarriageCare</Link><Link className="button button-outline" to="/admin/applications">Open administrator review</Link></div></div></main>

  return <main className="application-page">
    <div className="application-top"><Link className="brand" to="/"><span className="brand-mark"><FileText size={20} /></span><span>marriage<span>care</span></span></Link><Link to="/experts" className="back-link"><ArrowLeft size={15} /> For clients</Link></div>
    <div className="application-wrap"><header className="application-intro"><span className="eyebrow">JOIN OUR PROFESSIONAL NETWORK</span><h1>Bring your experience<br /><em>to the conversation.</em></h1><p>Tell us about your training, experience, and approach to relationship support. Applications are reviewed before a counsellor profile can be approved.</p></header>
      <div className="application-disclaimer"><ShieldAlert size={19} /><p>This application is a frontend workflow. Submission appears in the administrator queue in this browser only; it is not sent to MarriageCare staff. Do not provide sensitive client records or confidential case material.</p></div>
      <form className="application-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="application-section"><span className="application-section-number">01</span><div><h2>Contact information</h2><p>Use the contact details where you can be reached about your application.</p></div><div className="application-grid"><label>Full legal name<input {...register('fullName')} autoComplete="name" />{errors.fullName && <small className="field-error">{errors.fullName.message}</small>}</label><label>Email address<input {...register('email')} type="email" autoComplete="email" />{errors.email && <small className="field-error">{errors.email.message}</small>}</label><label>Phone number<input {...register('phone')} type="tel" autoComplete="tel" placeholder="+233 ..." />{errors.phone && <small className="field-error">{errors.phone.message}</small>}</label><label>City or region<input {...register('city')} autoComplete="address-level2" />{errors.city && <small className="field-error">{errors.city.message}</small>}</label></div></section>
        <section className="application-section"><span className="application-section-number">02</span><div><h2>Professional qualifications</h2><p>Provide enough detail for a reviewer to understand your training and practice history.</p></div><div className="application-grid"><label>Professional title<input {...register('professionalTitle')} placeholder="e.g. Marriage counsellor" />{errors.professionalTitle && <small className="field-error">{errors.professionalTitle.message}</small>}</label><label>Highest relevant qualification<input {...register('highestQualification')} placeholder="Degree, diploma, or certification" />{errors.highestQualification && <small className="field-error">{errors.highestQualification.message}</small>}</label><label>Awarding institution<input {...register('institution')} />{errors.institution && <small className="field-error">{errors.institution.message}</small>}</label><label>Field of study<input {...register('fieldOfStudy')} />{errors.fieldOfStudy && <small className="field-error">{errors.fieldOfStudy.message}</small>}</label><label>Years of relevant experience<input {...register('yearsExperience')} type="number" min="0" max="70" />{errors.yearsExperience && <small className="field-error">{errors.yearsExperience.message}</small>}</label><label>Registration or professional body<input {...register('registration')} placeholder="Name, membership number, or not applicable" />{errors.registration && <small className="field-error">{errors.registration.message}</small>}</label><label className="application-field-full">Areas of expertise<input {...register('specialties')} placeholder="Couples communication, premarital support" />{errors.specialties && <small className="field-error">{errors.specialties.message}</small>}<small className="field-hint">Separate areas with commas.</small></label><label className="application-field-full">Languages you can counsel in<input {...register('languages')} placeholder="English, Twi" />{errors.languages && <small className="field-error">{errors.languages.message}</small>}<small className="field-hint">Separate languages with commas.</small></label></div></section>
        <section className="application-section"><span className="application-section-number">03</span><div><h2>Practice and approach</h2><p>Describe the populations you work with and the methods you use. Do not include identifiable client information.</p></div><div className="application-grid"><label className="application-field-full">Your counselling approach<textarea {...register('approach')} rows="6" placeholder="Describe your approach, relevant settings, and the kinds of relationship support you provide." />{errors.approach && <small className="field-error">{errors.approach.message}</small>}</label></div></section>
        <section className="application-section"><span className="application-section-number">04</span><div><h2>Curriculum vitae</h2><p>Attach a current CV that outlines your education, work history, and relevant professional development.</p></div><label className="cv-upload"><input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFileChange} /><span className="cv-upload-icon"><Upload size={21} /></span><strong>{cvFile ? cvFile.name : 'Choose a CV file'}</strong><small>{cvFile ? `${(cvFile.size / 1024 / 1024).toFixed(1)} MB · Selected` : 'PDF or Word document · Up to 10 MB'}</small><span className="button button-outline">Browse files</span>{fileError && <small className="field-error">{fileError}</small>}</label><p className="cv-privacy-note">The selected file is kept in browser memory for this session and is not uploaded. The administrator queue retains the file name only; secure document review requires a backend.</p></section>
        <section className="application-declaration"><label className="check-row"><input type="checkbox" {...register('consent')} /><span>I confirm this information is accurate to the best of my knowledge and understand that submitting an application does not verify my qualifications or guarantee approval.</span></label>{errors.consent && <small className="field-error">{errors.consent.message}</small>}</section>
        <button className="button button-primary application-submit" disabled={isSubmitting}>Submit for administrator review <ArrowRight size={16} /></button>
      </form>
    </div>
  </main>
}