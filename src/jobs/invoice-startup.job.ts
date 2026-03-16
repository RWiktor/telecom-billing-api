import { prisma } from '../db'
import { createInvoiceForSubscription } from '../services/invoices.service'

const getPreviousMonthPeriod = () => {
  const now = new Date()
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  return {
    year: previousMonthDate.getFullYear(),
    month: previousMonthDate.getMonth() + 1,
    previousMonthStart: new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth(), 1),
    currentMonthStart: new Date(now.getFullYear(), now.getMonth(), 1),
  }
}

export const ensurePreviousMonthInvoices = async () => {
  const { year, month, previousMonthStart, currentMonthStart } = getPreviousMonthPeriod()

  const subscriptions = await prisma.subscription.findMany({
    where: {
      startDate: { lt: currentMonthStart },
      OR: [{ endDate: null }, { endDate: { gte: previousMonthStart } }],
    },
    select: { id: true },
  })

  if (subscriptions.length === 0) {
    return
  }

  const existingInvoices = await prisma.invoice.findMany({
    where: {
      year,
      month,
      subscriptionId: { in: subscriptions.map((subscription) => subscription.id) },
    },
    select: { subscriptionId: true },
  })

  const existingSubscriptionIds = new Set(existingInvoices.map((invoice) => invoice.subscriptionId))

  let generatedCount = 0
  for (const subscription of subscriptions) {
    if (existingSubscriptionIds.has(subscription.id)) {
      continue
    }

    try {
      await createInvoiceForSubscription({
        subscriptionId: subscription.id,
        year,
        month,
      })
      generatedCount += 1
    } catch (error: any) {
      if (error?.code !== 'P2002') {
        throw error
      }
    }
  }

  if (generatedCount > 0) {
    console.log(`[startup] Generated ${generatedCount} missing invoices for ${month}-${year}`)
  }
}
