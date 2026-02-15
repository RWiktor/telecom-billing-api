import api from '@/api'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Invoice, Subscription, SubscriptionUsageResponse } from '@/types'
import PageSpinner from '@/components/PageSpinner'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import InvoicesTable from '@/components/InvoicesTable'
import { useDelayedSpinner } from '@/hooks/useDelayedSpinner'

export default function SubscriptionDetail() {
  const { id } = useParams()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [usage, setUsage] = useState<SubscriptionUsageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const showSpinner = useDelayedSpinner(loading)

  useEffect(() => {
    const now = new Date()
    const params = new URLSearchParams({
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1),
    })

    const fetchData = async () => {
      const [subResult, invResult, usageResult] = await Promise.allSettled([
        api.get<Subscription>(`/subscriptions/${id}`),
        api.get<Invoice[]>(`/subscriptions/${id}/invoices`),
        api.get<SubscriptionUsageResponse>(`/subscriptions/${id}/usage?${params}`),
      ])

      if (subResult.status === 'fulfilled') {
        setSubscription(subResult.value.data)
      } else {
        setSubscription(null)
      }

      if (invResult.status === 'fulfilled') {
        setInvoices(invResult.value.data)
      } else {
        setInvoices([])
      }

      if (usageResult.status === 'fulfilled') {
        setUsage(usageResult.value.data)
      } else {
        setUsage(null)
      }

      setLoading(false)
    }
    fetchData()
  }, [id])

  if (showSpinner) return <PageSpinner />

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex flex-col'>
        <Header />
        <main className='container mx-auto px-4 py-8 flex-1'>
          <Button variant='ghost' className='mb-4 -ml-2' onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className='min-h-screen bg-background flex flex-col'>
        <Header />
        <main className='container mx-auto px-4 py-8 flex-1'>
          <Card>
            <CardContent className='py-8'>
              <p className='text-center text-muted-foreground'>Subscription not found</p>
              <Button className='mt-4 w-full' onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Header />
      <main className='container mx-auto px-4 py-8 flex-1'>
        <Button variant='ghost' className='mb-4 -ml-2' onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>

        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-foreground'>{subscription.phoneNumber}</h1>
          <p className='text-muted-foreground mt-1'>
            {subscription.plan.name} •{' '}
            {!subscription.endDate || new Date(subscription.endDate) > new Date()
              ? 'Active'
              : 'Inactive'}
          </p>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8 mt-8'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Plan</CardTitle>
                <CardDescription>{subscription.plan.name}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Monthly fee:</span>
                  <span>{Number(subscription.plan.monthlyFee).toFixed(2)} PLN</span>
                </div>
                {subscription.plan.minutesLimit != null && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Minutes limit:</span>
                    <span>{subscription.plan.minutesLimit} min</span>
                  </div>
                )}
                {subscription.plan.dataMBLimit != null && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Data limit:</span>
                    <span>{(subscription.plan.dataMBLimit / 1000).toFixed(1)} GB</span>
                  </div>
                )}
                {subscription.plan.smsLimit != null && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>SMS limit:</span>
                    <span>{subscription.plan.smsLimit}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Current usage</CardTitle>
                <CardDescription>
                  {new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Minutes:</span>
                  <span>
                    {usage?.summary.totalMinutes ?? 0} min
                    {subscription.plan.minutesLimit != null && (
                      <span className='text-muted-foreground'>
                        {' '}
                        / {subscription.plan.minutesLimit}
                      </span>
                    )}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Data:</span>
                  <span>
                    {usage ? (usage.summary.totalDataMB / 1000).toFixed(1) : 0} GB
                    {subscription.plan.dataMBLimit != null && (
                      <span className='text-muted-foreground'>
                        {' '}
                        / {(subscription.plan.dataMBLimit / 1000).toFixed(1)}
                      </span>
                    )}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>SMS:</span>
                  <span>
                    {usage?.summary.totalSms ?? 0}
                    {subscription.plan.smsLimit != null && (
                      <span className='text-muted-foreground'> / {subscription.plan.smsLimit}</span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='mt-8'>
            <h2 className='text-xl font-semibold mb-4 text-foreground'>Invoices</h2>
            <InvoicesTable invoices={invoices} subscriptions={[subscription]} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
