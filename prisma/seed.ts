import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

function getLastTwoMonths() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-based

  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

  const twoMonthsAgo = lastMonth === 1 ? 12 : lastMonth - 1
  const twoMonthsAgoYear = lastMonth === 1 ? lastMonthYear - 1 : lastMonthYear

  return {
    last: { year: lastMonthYear, month: lastMonth },
    twoMonthsAgo: { year: twoMonthsAgoYear, month: twoMonthsAgo },
    now,
  }
}

async function main() {
  console.log('Starting seed...')

  const { last, twoMonthsAgo, now } = getLastTwoMonths()
  const lastStart = new Date(last.year, last.month - 1, 1)
  const twoStart = new Date(twoMonthsAgo.year, twoMonthsAgo.month - 1, 1)

  console.log(
    `Using dates: ${twoMonthsAgo.year}-${twoMonthsAgo.month} and ${last.year}-${last.month}`,
  )

  console.log('Clearing database...')
  await prisma.invoice.deleteMany()
  await prisma.usageRecord.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.user.deleteMany()
  console.log('Database cleared')

  console.log('Creating plans...')

  const basicPlan = await prisma.plan.create({
    data: {
      name: 'Basic',
      monthlyFee: 49.99,
      minutesLimit: 500,
      dataMBLimit: 10000,
      smsLimit: 200,
      overageMinutePrice: 0.3,
      overageDataPrice: 0.01,
      overageSmsPrice: 0.2,
    },
  })

  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'Premium',
      monthlyFee: 89.99,
      minutesLimit: 2000,
      dataMBLimit: 50000,
      smsLimit: 1000,
      overageMinutePrice: 0.25,
      overageDataPrice: 0.008,
      overageSmsPrice: 0.15,
    },
  })

  const unlimitedPlan = await prisma.plan.create({
    data: {
      name: 'Unlimited',
      monthlyFee: 149.99,
      minutesLimit: null,
      dataMBLimit: null,
      smsLimit: null,
      overageMinutePrice: null,
      overageDataPrice: null,
      overageSmsPrice: null,
    },
  })

  console.log('Created 3 plans')

  const hashedPassword = await bcrypt.hash('password123', 10)

  console.log('Creating users...')

  const user1 = await prisma.user.create({
    data: {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      password: hashedPassword,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Anna Nowak',
      email: 'anna.nowak@example.com',
      password: hashedPassword,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'Piotr Wisniewski',
      email: 'piotr.wisniewski@example.com',
      password: hashedPassword,
    },
  })

  console.log('Created 3 users')

  console.log('Creating subscriptions...')

  const sub1 = await prisma.subscription.create({
    data: {
      userId: user1.id,
      planId: basicPlan.id,
      phoneNumber: '+48123456789',
      startDate: twoStart,
    },
  })

  const sub2 = await prisma.subscription.create({
    data: {
      userId: user1.id,
      planId: premiumPlan.id,
      phoneNumber: '+48987654321',
      startDate: new Date(last.year, last.month - 1, 15),
    },
  })

  const sub3 = await prisma.subscription.create({
    data: {
      userId: user2.id,
      planId: unlimitedPlan.id,
      phoneNumber: '+48555123456',
      startDate: twoStart,
    },
  })

  const sub4 = await prisma.subscription.create({
    data: {
      userId: user3.id,
      planId: premiumPlan.id,
      phoneNumber: '+48777888999',
      startDate: lastStart,
    },
  })

  console.log('Created 4 subscriptions')

  console.log('Creating usage records...')

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub1.id,
        timestamp: new Date(twoMonthsAgo.year, twoMonthsAgo.month - 1, 5, 10, 30),
        minutes: 200,
        dataMB: 3000,
        smsCount: 80,
      },
      {
        subscriptionId: sub1.id,
        timestamp: new Date(twoMonthsAgo.year, twoMonthsAgo.month - 1, 15, 14, 20),
        minutes: 250,
        dataMB: 5000,
        smsCount: 90,
      },
      {
        subscriptionId: sub1.id,
        timestamp: new Date(twoMonthsAgo.year, twoMonthsAgo.month - 1, 28, 9, 15),
        minutes: 150,
        dataMB: 4000,
        smsCount: 60,
      },
    ],
  })

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub1.id,
        timestamp: new Date(last.year, last.month - 1, 8, 11, 0),
        minutes: 120,
        dataMB: 2000,
        smsCount: 40,
      },
      {
        subscriptionId: sub1.id,
        timestamp: new Date(last.year, last.month - 1, 15, 16, 30),
        minutes: 80,
        dataMB: 1500,
        smsCount: 25,
      },
    ],
  })

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub2.id,
        timestamp: new Date(last.year, last.month - 1, 16, 8, 0),
        minutes: 500,
        dataMB: 15000,
        smsCount: 200,
      },
      {
        subscriptionId: sub2.id,
        timestamp: new Date(last.year, last.month - 1, 28, 19, 0),
        minutes: 400,
        dataMB: 12000,
        smsCount: 180,
      },
    ],
  })

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub2.id,
        timestamp: new Date(last.year, last.month - 1, 10, 10, 0),
        minutes: 300,
        dataMB: 8000,
        smsCount: 100,
      },
    ],
  })

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub3.id,
        timestamp: new Date(twoMonthsAgo.year, twoMonthsAgo.month - 1, 10, 14, 30),
        minutes: 3000,
        dataMB: 80000,
        smsCount: 1500,
      },
      {
        subscriptionId: sub3.id,
        timestamp: new Date(twoMonthsAgo.year, twoMonthsAgo.month - 1, 25, 20, 0),
        minutes: 2500,
        dataMB: 60000,
        smsCount: 1200,
      },
    ],
  })

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub3.id,
        timestamp: new Date(last.year, last.month - 1, 12, 9, 0),
        minutes: 1500,
        dataMB: 40000,
        smsCount: 600,
      },
    ],
  })

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub4.id,
        timestamp: new Date(last.year, last.month - 1, 5, 11, 0),
        minutes: 600,
        dataMB: 20000,
        smsCount: 300,
      },
      {
        subscriptionId: sub4.id,
        timestamp: new Date(last.year, last.month - 1, 20, 15, 30),
        minutes: 500,
        dataMB: 18000,
        smsCount: 250,
      },
    ],
  })

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub4.id,
        timestamp: new Date(last.year, last.month - 1, 14, 13, 0),
        minutes: 400,
        dataMB: 12000,
        smsCount: 150,
      },
    ],
  })

  console.log('Created usage records')

  console.log('Creating invoices...')

  const paidAtEarly = new Date(now.getFullYear(), now.getMonth(), 2, 14, 30)
  const paidAtMid = new Date(now.getFullYear(), now.getMonth(), 3, 12, 0)
  const paidAtLate = new Date(now.getFullYear(), now.getMonth(), 5, 10, 0)

  await prisma.invoice.createMany({
    data: [
      {
        subscriptionId: sub1.id,
        year: last.year,
        month: last.month,
        baseFee: 49.99,
        overageFee: 30.0 + 20.0 + 6.0,
        totalAmount: 49.99 + 56.0,
        status: 'PAID',
        paidAt: paidAtLate,
      },
      {
        subscriptionId: sub2.id,
        year: last.year,
        month: last.month,
        baseFee: 89.99,
        overageFee: 0,
        totalAmount: 89.99,
        status: 'PAID',
        paidAt: paidAtMid,
      },
      {
        subscriptionId: sub3.id,
        year: last.year,
        month: last.month,
        baseFee: 149.99,
        overageFee: 0,
        totalAmount: 149.99,
        status: 'PAID',
        paidAt: paidAtEarly,
      },
      {
        subscriptionId: sub4.id,
        year: last.year,
        month: last.month,
        baseFee: 89.99,
        overageFee: 0,
        totalAmount: 89.99,
        status: 'UNPAID',
      },
      {
        subscriptionId: sub1.id,
        year: twoMonthsAgo.year,
        month: twoMonthsAgo.month,
        baseFee: 49.99,
        overageFee: 0,
        totalAmount: 49.99,
        status: 'OVERDUE',
      },
    ],
  })

  console.log('Created 5 invoices')

  console.log('')
  console.log('===== SEED SUMMARY =====')
  console.log('Plans: 3 (Basic, Premium, Unlimited)')
  console.log('Users: 3')
  console.log('Subscriptions: 4 phone numbers')
  console.log(
    `Usage records: Multiple entries (${twoMonthsAgo.year}-${twoMonthsAgo.month}, ${last.year}-${last.month})`,
  )
  console.log('Invoices: 5')
  console.log('')
  console.log('Test accounts:')
  console.log('  jan.kowalski@example.com (2 numbers)')
  console.log('  anna.nowak@example.com (1 unlimited)')
  console.log('  piotr.wisniewski@example.com (1 premium)')
  console.log('  Password for all: password123')
  console.log('')
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
