import { Link } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { useAlbum } from '@/store/useAlbum'
import { useNotifications } from '@/store/useNotifications'
import { usePackCooldownSeconds, formatCooldown } from '@/store/usePacks'

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const { points, resetAlbum } = useAlbum()
  const addNotification = useNotifications((state) => state.addNotification)
  const cooldownSeconds = usePackCooldownSeconds()
  const hasCooldown = cooldownSeconds > 0

  const handleReset = () => {
    if (!confirm('¿Estás seguro de que quieres borrar todo el almacenamiento? Se reiniciarán tus puntos y tu álbum.')) {
      return
    }

    resetAlbum()
    addNotification('✅ Almacenamiento borrado. Se han restaurado 1000 puntos iniciales.', 'success')
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><Link to="/get">Obtener Láminas</Link></li>
            <li><Link to="/album">Mi Álbum</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">SWX Album</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/get">Obtener Láminas</Link></li>
          <li><Link to="/album">Mi Álbum</Link></li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {hasCooldown && (
          <div className="badge badge-lg badge-warning gap-2 px-4 py-3">
            <span className="text-lg">⏳</span>
            <span className="font-semibold">Nuevo sobre en {formatCooldown(cooldownSeconds)}</span>
          </div>
        )}
        <div className="badge badge-lg badge-primary gap-2 px-4 py-3">
          <span className="text-lg">💰</span>
          <span className="font-bold">{points} puntos</span>
        </div>
        <label className="swap swap-rotate">
          <input 
            type="checkbox" 
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
          </svg>
          <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
          </svg>
        </label>
        <button className="btn btn-ghost" onClick={handleReset}>Borrar storage</button>
      </div>
    </div>
  )
}

export default Header