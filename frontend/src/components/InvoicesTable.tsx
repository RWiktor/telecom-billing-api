import type { InvoiceStatus, InvoicesTableProps } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  PAID: 'bg-green-100 text-green-700',
  UNPAID: 'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
}

export default function InvoicesTable({ invoices, subscriptions }: InvoicesTableProps) {
  return (
    <Card className='mt-4'>
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
                const subscription = subscriptions.find((sub) => sub.id === invoice.subscriptionId)

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className='font-medium'>
                      {new Date(invoice.year, invoice.month - 1, 1).toLocaleString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
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
  )
}
