import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '#capabilities', label: '서비스' },
  { href: '#japan-proof', label: '한일 특송' },
  { href: '#network', label: '글로벌 네트워크' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="brand" href="#hero" aria-label="KSE 홈">
        <img src="/assets/kse-logo.png" alt="KSE 국제로지스틱" />
      </a>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav id="site-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="주요 메뉴">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a className="header-cta" href="#contact" onClick={() => setOpen(false)}>
          물류 상담
        </a>
      </nav>
    </header>
  )
}
