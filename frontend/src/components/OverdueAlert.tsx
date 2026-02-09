import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

export default function OverdueAlert({ overdueInvoices }: { overdueInvoices: number }) {
  return (
    <Alert className='max-w-xl border-red-200 bg-red-100 text-red-700'>
      <AlertCircleIcon />
      <AlertTitle>Pay overdue invoices</AlertTitle>
      <AlertDescription>
        You have {overdueInvoices} overdue invoices. Please pay them to avoid losing your services.
      </AlertDescription>
    </Alert>
  )
}
