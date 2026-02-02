import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '@/api'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${user?.id}`)
        setSubscriptions(data?.subscriptions || [])
        console.log(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [user?.id])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b bg-card'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Welcome, {user?.name || user?.email}!
            </p>
          </div>
          <Button variant='outline' onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {/* Numbers Section */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4 text-foreground'>My Numbers</h2>

          {subscriptions.length === 0 ? (
            <Card>
              <CardContent className='py-8'>
                <p className='text-center text-muted-foreground'>No phone numbers</p>
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {subscriptions.map((subscription: any) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <CardTitle className='text-lg'>{subscription.phoneNumber}</CardTitle>
                    <CardDescription>Subscription: {subscription.plan.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Status:</span>
                        <span className='font-medium'>{subscription.status || 'Active'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
