import { prisma } from '../db'
import { Prisma } from '../../prisma/generated/client'

type CreateInvoiceInput = {
  subscriptionId: number
  year: number
  month: number
}

export const createInvoiceForSubscription = async ({
  subscriptionId,
  year,
  month,
}: CreateInvoiceInput) => {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { plan: true },
  })

  if (!subscription) {
    throw new Error('Subscription not found')
  }

  const usageAggregation = await prisma.usageRecord.aggregate({
    where: {
      subscriptionId,
      timestamp: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    _sum: {
      minutes: true,
      dataMB: true,
      smsCount: true,
    },
  })

  const totals = {
    minutes: Number(usageAggregation._sum.minutes || 0),
    dataMB: Number(usageAggregation._sum.dataMB || 0),
    smsCount: Number(usageAggregation._sum.smsCount || 0),
  }

  let overageFee = 0
  const p = subscription.plan

  const addOverage = (actual: number, limit: number | null, price: Prisma.Decimal | null) => {
    if (limit !== null && price !== null && actual > limit) {
      overageFee += (actual - limit) * price.toNumber()
    }
  }

  addOverage(totals.minutes, p.minutesLimit, p.overageMinutePrice)
  addOverage(totals.dataMB, p.dataMBLimit, p.overageDataPrice)
  addOverage(totals.smsCount, p.smsLimit, p.overageSmsPrice)

  const baseFee = p.monthlyFee.toNumber()
  const totalAmount = Math.round((baseFee + overageFee) * 100) / 100

  return prisma.invoice.create({
    data: {
      subscriptionId,
      year,
      month,
      baseFee,
      overageFee,
      totalAmount,
    },
  })
}
