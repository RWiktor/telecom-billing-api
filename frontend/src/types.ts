export type ApiId = number

export type DecimalLike = number | string

export interface User {
  id: ApiId
  email: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Plan {
  id: ApiId
  name: string
  monthlyFee: DecimalLike
  minutesLimit?: number | null
  dataMBLimit?: number | null
  smsLimit?: number | null
  overageMinutePrice?: DecimalLike | null
  overageDataPrice?: DecimalLike | null
  overageSmsPrice?: DecimalLike | null
  createdAt?: string
  updatedAt?: string
}

export interface Subscription {
  id: ApiId
  userId: ApiId
  planId: ApiId
  phoneNumber: string
  startDate: string
  endDate: string | null
  createdAt: string
  updatedAt: string
  plan: Plan
  user?: User
}

export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE' | 'CANCELLED'

export interface Invoice {
  id: ApiId
  subscriptionId: ApiId
  year: number
  month: number
  baseFee: DecimalLike
  overageFee: DecimalLike
  totalAmount: DecimalLike
  status: InvoiceStatus
  paidAt: string | null
  createdAt: string
  updatedAt: string
  subscription?: Subscription
}

export interface UsageRecord {
  id: ApiId
  subscriptionId: ApiId
  timestamp: string
  minutes: number
  dataMB: number
  smsCount: number
  createdAt: string
}

export interface SubscriptionUsageResponse {
  records: UsageRecord[]
  summary: {
    totalMinutes: number
    totalDataMB: number
    totalSms: number
  }
}

export interface LoginResponse {
  token: string
  user: Pick<User, 'id' | 'email' | 'name'>
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
