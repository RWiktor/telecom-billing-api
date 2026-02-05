import { Button } from './ui/button'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className='border-b bg-card'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Welcome, {user?.name || user?.email}!
          </p>
        </div>
        <Button variant='default' onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
