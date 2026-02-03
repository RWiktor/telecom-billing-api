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
  const [invoices, setInvoices] = useState([])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await api.get(`/users/${user?.id}`)
        const subscriptionsData = userData?.subscriptions || []
        setSubscriptions(subscriptionsData)

        const { data: invoicesData } = await api.get('/invoices')
        const subscriptionIds = subscriptionsData.map((sub: any) => sub.id)
        const userInvoices = invoicesData.filter((invoice: any) =>
          subscriptionIds.includes(invoice.subscriptionId),
        )
        setInvoices(userInvoices)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
          <Button variant='default' onClick={handleLogout}>
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
            <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {subscriptions.map((subscription: any) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <CardTitle className='text-lg'>{subscription.phoneNumber}</CardTitle>
                    <CardDescription>Subscription: {subscription.plan.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4 text-sm'>
                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Status:</span>
                        <span className='font-medium'>
                          {!subscription.endDate || new Date(subscription.endDate) > new Date()
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </div>
                      <Button variant='outline' className='w-full'>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}
        </div>

        {/* Invoices Section */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4 text-foreground'>Invoices</h2>

          {invoices.length === 0 ? (
            <Card>
              <CardContent className='py-8'>
                <p className='text-center text-muted-foreground'>No invoices</p>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {invoices.map((invoice: any) => {
                const subscription = subscriptions.find(
                  (sub: any) => sub.id === invoice.subscriptionId,
                ) as any
                const monthNames = [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ]
                const statusColors: Record<string, string> = {
                  PAID: 'text-green-600',
                  UNPAID: 'text-yellow-600',
                  OVERDUE: 'text-red-600',
                  CANCELLED: 'text-gray-600',
                }

                return (
                  <Card key={invoice.id}>
                    <CardContent className='pt-6'>
                      <div className='flex justify-between items-start'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-4'>
                            <h3 className='font-semibold text-lg'>
                              {monthNames[invoice.month - 1]} {invoice.year}
                            </h3>
                            <span
                              className={`text-sm font-medium ${
                                statusColors[invoice.status] || 'text-gray-600'
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </div>
                          {subscription && (
                            <p className='text-sm text-muted-foreground'>
                              {subscription.phoneNumber}
                            </p>
                          )}
                          <div className='text-sm space-y-1'>
                            <div className='flex justify-between gap-4'>
                              <span className='text-muted-foreground'>Base fee:</span>
                              <span>{Number(invoice.baseFee).toFixed(2)} PLN</span>
                            </div>
                            {Number(invoice.overageFee) > 0 && (
                              <div className='flex justify-between gap-4'>
                                <span className='text-muted-foreground'>Overage fee:</span>
                                <span>{Number(invoice.overageFee).toFixed(2)} PLN</span>
                              </div>
                            )}
                            <div className='flex justify-between gap-4 pt-2 border-t'>
                              <span className='font-semibold'>Total:</span>
                              <span className='font-semibold'>
                                {Number(invoice.totalAmount).toFixed(2)} PLN
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
