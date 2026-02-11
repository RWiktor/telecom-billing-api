export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  monthlyFee: number
  dataLimit: number
  minutesLimit: number
  smsLimit: number
  overageRates: {
    perMB: number
    perMinute: number
    perSMS: number
  }
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  phoneNumber: string
  startDate: string
  endDate: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
  plan: Plan
  user?: User
}

export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE' | 'CANCELLED'

export interface Invoice {
  id: string
  subscriptionId: string
  month: number
  year: number
  baseFee: number
  overageFee: number
  totalAmount: number
  status: InvoiceStatus
  dueDate: string
  paidAt: string | null
  createdAt: string
  updatedAt: string
  subscription?: Subscription
}

export interface Usage {
  id: string
  subscriptionId: string
  usageDate: string
  dataUsageMB: number
  voiceMinutes: number
  smsCount: number
  createdAt: string
  subscription?: Subscription
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UserWithSubscriptions extends User {
  subscriptions: Subscription[]
}

export interface InvoicesTableProps {
  invoices: Invoice[]
  subscriptions: Subscription[]
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
}
