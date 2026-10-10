import { useEffect, useState } from 'react'
import { AppContext } from './appContext'
import { initialAppointments } from '../data/sampleData.js'

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readStored('marriagecare-user', null) ?? readStored('marriagecare-session', null))
  const [appointments, setAppointments] = useState(() => readStored('marriagecare-appointments', initialAppointments))
  const [applications, setApplications] = useState(() => readStored('marriagecare-applications', []))
  const [notice, setNotice] = useState('')

  useEffect(() => {
    localStorage.setItem('marriagecare-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    const storedApplications = applications.map((application) => Object.fromEntries(Object.entries(application).filter(([key]) => key !== 'cvFile')))
    localStorage.setItem('marriagecare-applications', JSON.stringify(storedApplications))
  }, [applications])

  function signIn(account, remember = true) {
    const nextUser = { ...account, id: account.email.toLowerCase() }
    localStorage.removeItem('marriagecare-user')
    sessionStorage.removeItem('marriagecare-session')
    ;(remember ? localStorage : sessionStorage).setItem(remember ? 'marriagecare-user' : 'marriagecare-session', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  function signOut() {
    localStorage.removeItem('marriagecare-user')
    sessionStorage.removeItem('marriagecare-session')
    setUser(null)
  }

  function addAppointment(details) {
    const booking = { ...details, id: `MC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, status: 'pending' }
    setAppointments((current) => [booking, ...current])
    return booking
  }

  function updateAppointment(id, updates) {
    setAppointments((current) => current.map((appointment) => appointment.id === id ? { ...appointment, ...updates } : appointment))
  }

  function submitApplication(details, cvFile) {
    const application = {
      ...details,
      id: `MC-AP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      cvFile,
    }
    setApplications((current) => [application, ...current])
    return application
  }

  function updateApplication(id, updates) {
    setApplications((current) => current.map((application) => application.id === id ? { ...application, ...updates } : application))
  }

  function toast(message) {
    setNotice(message)
    window.clearTimeout(toast.timeout)
    toast.timeout = window.setTimeout(() => setNotice(''), 3200)
  }

  function resetSampleData() {
    setAppointments(initialAppointments)
    signOut()
    localStorage.removeItem('marriagecare-appointments')
    toast('Sample records have been reset.')
  }

  return <AppContext.Provider value={{ user, appointments, applications, signIn, signOut, addAppointment, updateAppointment, submitApplication, updateApplication, toast, notice, resetSampleData }}>{children}</AppContext.Provider>
}