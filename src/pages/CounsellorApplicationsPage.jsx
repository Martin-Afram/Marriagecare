import { useState } from 'react'
import { ArrowUpRight, Check, Clock3, FileText, ShieldAlert, UserRound, X } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import '../recruitment.css'

const filters = [
  ['pending', 'New applications'],
  ['reviewing', 'In review'],
  ['approved', 'Approved'],
  ['declined', 'Declined'],
  ['all', 'All'],
]

const statusClass = {
  pending: 'status-pending',
  reviewing: 'status-reviewing',
  approved: 'status-approved',
  declined: 'status-declined',
}

function openCvFile(file) {
  if (!file) return
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noreferrer'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 60000)
}

export function CounsellorApplicationsPage() {
  const { applications, updateApplication, toast } = useApp()
  const [filter, setFilter] = useState('pending')
  const [selectedId, setSelectedId] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const shown = applications.filter((application) => filter === 'all' || application.status === filter)
  const selected = shown.find((application) => application.id === selectedId) || shown[0]

  function setStatus(status) {
    if (!selected) return
    updateApplication(selected.id, { status, reviewNote: reviewNote.trim(), reviewedAt: new Date().toISOString() })
    toast(status === 'approved' ? 'Application approved for onboarding. Credentials still require independent verification.' : status === 'declined' ? 'Application declined.' : 'Application moved to review.')
    setReviewNote('')
  }

  return <div className="applications-admin-page">
    <div className="portal-welcome"><div><span className="eyebrow">COUNSELLOR RECRUITMENT</span><h1>Application review</h1><p>Review submitted qualifications and practice information before considering a profile for onboarding.</p></div><span className="application-queue-count"><Clock3 size={16} /> {applications.filter((item) => item.status === 'pending').length} awaiting review</span></div>
    <div className="application-review-notice"><ShieldAlert size={18} /><p>Applications and CV filenames are stored in this browser only. Files are available to review only in this active session. Approval here is not identity, qualification, or registration verification.</p></div>
    <div className="application-admin-tabs" role="tablist">{filters.map(([value, label]) => <button key={value} className={filter === value ? 'is-active' : ''} role="tab" aria-selected={filter === value} onClick={() => setFilter(value)}>{label}<span>{value === 'all' ? applications.length : applications.filter((item) => item.status === value).length}</span></button>)}</div>
    {!shown.length ? <div className="empty-state application-empty"><FileText size={25} /><h3>No applications in this view.</h3><p>New counsellor applications will appear here after submission in this browser.</p></div> : <div className="application-admin-layout"><div className="application-admin-list">{shown.map((application) => <button key={application.id} className={`application-admin-item ${selected?.id === application.id ? 'is-selected' : ''}`} onClick={() => { setSelectedId(application.id); setReviewNote(application.reviewNote || '') }}><span className="application-admin-avatar">{application.fullName.slice(0, 1)}</span><span className="application-admin-person"><strong>{application.fullName}</strong><small>{application.professionalTitle}</small><small>{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : ''}</small></span><span className={`status-pill ${statusClass[application.status] || ''}`}>{application.status}</span></button>)}</div>
      {selected && <article className="application-detail-panel"><div className="application-detail-heading"><span><span className="eyebrow">APPLICATION {selected.id}</span><h2>{selected.fullName}</h2><p>{selected.professionalTitle} · {selected.city}</p></span><span className={`status-pill ${statusClass[selected.status] || ''}`}>{selected.status}</span></div>
        <section><h3>Contact</h3><div className="application-detail-grid"><div><small>Email</small><span>{selected.email}</span></div><div><small>Phone</small><span>{selected.phone}</span></div><div><small>Location</small><span>{selected.city}</span></div></div></section>
        <section><h3>Qualifications & experience</h3><div className="application-detail-grid"><div><small>Highest qualification</small><span>{selected.highestQualification}</span></div><div><small>Institution</small><span>{selected.institution}</span></div><div><small>Field of study</small><span>{selected.fieldOfStudy}</span></div><div><small>Relevant experience</small><span>{selected.yearsExperience} years</span></div><div><small>Registration</small><span>{selected.registration}</span></div></div></section>
        <section><h3>Areas of expertise</h3><div className="application-specialties">{selected.specialties.map((specialty) => <span className="tag" key={specialty}>{specialty}</span>)}</div><div className="application-detail-grid"><div><small>Languages</small><span>{selected.languages.join(', ')}</span></div></div></section>
        <section><h3>Practice approach</h3><p className="application-approach">{selected.approach}</p></section>
        <section className="application-cv-row"><span className="cv-upload-icon"><FileText size={19} /></span><span><strong>{selected.cvName}</strong><small>{selected.cvFile ? 'Available during this browser session' : 'File content is not available after a page reload'}</small></span><button type="button" className="button button-outline" disabled={!selected.cvFile} onClick={() => openCvFile(selected.cvFile)}>Open CV <ArrowUpRight size={14} /></button></section>
        <label className="application-review-note-field">Reviewer note<textarea rows="3" value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} placeholder="Record a brief internal review note" /></label>
        {selected.reviewNote && <p className="previous-review-note"><strong>Previous review note:</strong> {selected.reviewNote}</p>}
        <div className="application-review-actions"><button className="button button-outline" onClick={() => setStatus('reviewing')}><UserRound size={15} /> Mark in review</button><button className="button button-outline application-decline" onClick={() => setStatus('declined')}><X size={15} /> Decline</button><button className="button button-primary" onClick={() => setStatus('approved')}><Check size={15} /> Approve for onboarding</button></div>
        <p className="application-verification-footnote">Before public listing, independently verify identity, qualifications, professional registration, references, and suitability.</p>
      </article>}
    </div>}
  </div>
}