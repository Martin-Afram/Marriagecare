import { useState } from 'react'
import { ArrowUpRight, HeartHandshake, Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Our approach', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Find an expert', to: '/experts' },
  { label: 'Resources', to: '/resources' },
  { label: 'For counsellors', to: '/apply-as-counsellor' },
  { label: 'Contact', to: '/contact' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut } = useApp()
  const dashboard = user ? `/${user.role}/dashboard` : '/login'

  return <header className="site-header">
    <div className="header-inner">
      <Link to="/" className="brand" aria-label="MarriageCare home" onClick={() => setMenuOpen(false)}><span className="brand-mark"><HeartHandshake size={21} strokeWidth={1.8} /></span><span>marriage<span>care</span></span></Link>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>)}
        <div className="mobile-nav-actions">
          {user ? <><Link className="button button-quiet" to={dashboard} onClick={() => setMenuOpen(false)}>My portal</Link><button className="button button-primary" onClick={() => { signOut(); setMenuOpen(false) }}>Sign out</button></> : <><Link className="button button-quiet" to="/login" onClick={() => setMenuOpen(false)}>Log in</Link><Link className="button button-primary" to="/register" onClick={() => setMenuOpen(false)}>Get started <ArrowUpRight size={15} /></Link></>}
        </div>
      </nav>
      <div className="header-actions">
        {user ? <><Link className="button button-quiet" to={dashboard}>My portal</Link><button className="button button-primary" onClick={signOut}>Sign out</button></> : <><Link className="button button-quiet" to="/login">Log in</Link><Link className="button button-primary" to="/register">Get started <ArrowUpRight size={15} /></Link></>}
      </div>
    </div>
  </header>
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand"><Link to="/" className="brand"><span className="brand-mark"><HeartHandshake size={21} /></span><span>marriage<span>care</span></span></Link><p>Thoughtful support for the relationships that matter to you.</p><a href="mailto:hello@marriagecare.test">hello@marriagecare.test <ArrowUpRight size={14} /></a></div>
      <div className="footer-col"><h3>Explore</h3><Link to="/about">Our approach</Link><Link to="/services">Services</Link><Link to="/experts">Find an expert</Link><Link to="/resources">Resources</Link></div>
      <div className="footer-col"><h3>Get in touch</h3><Link to="/contact">Contact</Link><Link to="/login">Client portal</Link><Link to="/apply-as-counsellor">Apply as a counsellor</Link><span>Accra, Ghana · Illustrative details</span></div>
    </div>
    <div className="footer-bottom"><span>© 2026 MarriageCare · Frontend prototype</span><span>Fictional profiles, sample reviews, and indicative prices.</span><Link to="/contact">Privacy & terms</Link></div>
    <p className="footer-safety">MarriageCare is not an emergency service. If you are in immediate danger, contact local emergency services or a trusted local support organization.</p>
  </footer>
}

export function PublicLayout() {
  return <><Header /><Outlet /><Footer /></>
}

export function ExpertCard({ expert }) {
  return <article className="expert-card">
    <Link to={`/experts/${expert.id}`} className="expert-photo-link" aria-label={`View ${expert.name}'s sample profile`}><img className="expert-photo" src={expert.image} alt="" loading="lazy" /><span className="sample-tag">Sample profile</span></Link>
    <div className="expert-card-body"><div className="expert-title-row"><div><h3>{expert.name}</h3><p>{expert.title}</p></div><span className="rating">★ {expert.rating.toFixed(1)}</span></div>
      <div className="tag-list">{expert.specialties.slice(0, 2).map((specialty) => <span className="tag" key={specialty}>{specialty}</span>)}</div>
      <div className="expert-meta"><span>{expert.experience} years’ experience</span><span>{expert.city} · {expert.formats.join(' / ')}</span></div>
      <div className="expert-card-bottom"><span>From <strong>GHS {expert.fee}</strong> <small>/ session</small></span><Link className="text-link" to={`/experts/${expert.id}`}>View profile <ArrowUpRight size={15} /></Link></div>
    </div>
  </article>
}

export function PageIntro({ eyebrow, title, description }) {
  return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
}