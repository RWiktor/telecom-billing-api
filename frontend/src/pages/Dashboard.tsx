import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '@/api'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Subscription, Invoice, UserWithSubscriptions, InvoiceStatus } from '@/types'

const MONTH_NAMES = [
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
] as const

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  PAID: 'bg-green-100 text-green-700',
  UNPAID: 'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await api.get<UserWithSubscriptions>(`/users/${user?.id}`)
        const subscriptionsData = userData?.subscriptions || []
        setSubscriptions(subscriptionsData)

        const { data: invoicesData } = await api.get<Invoice[]>('/invoices')
        const subscriptionIds = subscriptionsData.map((sub) => sub.id)
        const userInvoices = invoicesData.filter((invoice) =>
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

          <Card>
            {invoices.length === 0 ? (
              <CardContent className='py-8'>
                <p className='text-center text-muted-foreground'>No invoices</p>
              </CardContent>
            ) : (
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Base Fee</TableHead>
                      <TableHead>Overage Fee</TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                      <TableHead className='text-right'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => {
                      const subscription = subscriptions.find(
                        (sub) => sub.id === invoice.subscriptionId,
                      )

                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className='font-medium'>
                            {MONTH_NAMES[invoice.month - 1]} {invoice.year}
                          </TableCell>
                          <TableCell className='text-muted-foreground'>
                            {subscription?.phoneNumber || '—'}
                          </TableCell>
                          <TableCell>{Number(invoice.baseFee).toFixed(2)} PLN</TableCell>
                          <TableCell>
                            {Number(invoice.overageFee) > 0
                              ? `${Number(invoice.overageFee).toFixed(2)} PLN`
                              : '—'}
                          </TableCell>
                          <TableCell className='text-right font-semibold'>
                            {Number(invoice.totalAmount).toFixed(2)} PLN
                          </TableCell>
                          <TableCell className='text-right'>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                STATUS_COLORS[invoice.status] || 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
