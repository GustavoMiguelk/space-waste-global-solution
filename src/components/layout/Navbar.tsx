import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  acoes?: ReactNode
}

export default function Navbar({ acoes }: NavbarProps) {
  const { pathname } = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)

  const links = [
    { path: '/',            label: 'Início' },
    { path: '/sobre',       label: 'Sobre' },
    { path: '/integrantes', label: 'Integrantes' },
    { path: '/faq',         label: 'FAQ' },
    { path: '/contato',     label: 'Contato' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-20 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <Link to="/">
          <img src="/logo.png" alt="SpaceWaste" className="h-30 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--color-text-muted)]">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition hover:text-[var(--color-primary)] ${
                pathname === link.path ? 'text-[var(--color-primary)] font-semibold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {acoes}
          <button
            onClick={() => setMenuAberto(prev => !prev)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <motion.span
              animate={menuAberto ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-[var(--color-text)]"
            />
            <motion.span
              animate={menuAberto ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-0.5 bg-[var(--color-text)]"
            />
            <motion.span
              animate={menuAberto ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-[var(--color-text)]"
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md md:hidden"
          >
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuAberto(false)}
                className={`flex px-6 py-4 text-sm border-b border-[var(--color-border)] transition hover:text-[var(--color-primary)] ${
                  pathname === link.path
                    ? 'text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}