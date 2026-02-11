import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '@/api'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import InvoicesTable from '@/components/InvoicesTable'
import { Spinner } from '@/components/ui/spinner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Subscription, Invoice, UserWithSubscriptions } from '@/types'
import OverdueAlert from '@/components/OverdueAlert'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [overdueInvoices, setOverdueInvoices] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await api.get<UserWithSubscriptions>('/auth/me')
        const subscriptionsData = userData?.subscriptions || []
        setSubscriptions(subscriptionsData)

        const { data: invoicesData } = await api.get<Invoice[]>('/invoices')
        const subscriptionIds = subscriptionsData.map((sub) => sub.id)
        const userInvoices = invoicesData.filter((invoice) =>
          subscriptionIds.includes(invoice.subscriptionId),
        )
        setInvoices(userInvoices)
        setOverdueInvoices(userInvoices.filter((inv) => inv.status === 'OVERDUE').length)
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
        <Spinner className='size-10' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Header />

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8 flex-1'>
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
              {subscriptions.map((subscription) => (
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

          {overdueInvoices > 0 && <OverdueAlert overdueInvoices={overdueInvoices} />}

          <InvoicesTable invoices={invoices} subscriptions={subscriptions} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
