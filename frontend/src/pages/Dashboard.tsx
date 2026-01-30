import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <h1>Panel Dashboard</h1>
      <p>Witaj, {user?.name || user?.email}!</p>
      <button
        type='button'
        className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
        onClick={handleLogout}
      >
        Wyloguj się
      </button>
    </div>
  )
}
