import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Rodape from './Rodape'

export default function ConteudoPrincipal() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar />
      <main className="flex-1 pt-16 mx-auto w-full max-w-7xl px-4">
        <Outlet />
      </main>
      <Rodape />
    </div>
  )
}