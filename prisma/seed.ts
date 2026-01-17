import { PrismaClient } from '../src/generated/prisma/client.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

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
      startDate: new Date('2025-11-01'),
    },
  })

  const sub2 = await prisma.subscription.create({
    data: {
      userId: user1.id,
      planId: premiumPlan.id,
      phoneNumber: '+48987654321',
      startDate: new Date('2025-12-15'),
    },
  })

  const sub3 = await prisma.subscription.create({
    data: {
      userId: user2.id,
      planId: unlimitedPlan.id,
      phoneNumber: '+48555123456',
      startDate: new Date('2025-10-01'),
    },
  })

  const sub4 = await prisma.subscription.create({
    data: {
      userId: user3.id,
      planId: premiumPlan.id,
      phoneNumber: '+48777888999',
      startDate: new Date('2025-12-01'),
    },
  })

  console.log('Created 4 subscriptions')

  console.log('Creating usage records...')

  await prisma.usageRecord.createMany({
    data: [
      {
        subscriptionId: sub1.id,
        timestamp: new Date('2025-12-05T10:30:00'),
        minutes: 200,
        dataMB: 3000,
        smsCount: 80,
      },
      {
        subscriptionId: sub1.id,
        timestamp: new Date('2025-12-15T14:20:00'),
        minutes: 250,
        dataMB: 5000,
        smsCount: 90,
      },
      {
        subscriptionId: sub1.id,
        timestamp: new Date('2025-12-28T09:15:00'),
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
        timestamp: new Date('2026-01-08T11:00:00'),
        minutes: 120,
        dataMB: 2000,
        smsCount: 40,
      },
      {
        subscriptionId: sub1.id,
        timestamp: new Date('2026-01-15T16:30:00'),
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
        timestamp: new Date('2025-12-16T08:00:00'),
        minutes: 500,
        dataMB: 15000,
        smsCount: 200,
      },
      {
        subscriptionId: sub2.id,
        timestamp: new Date('2025-12-28T19:00:00'),
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
        timestamp: new Date('2026-01-10T10:00:00'),
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
        timestamp: new Date('2025-12-10T14:30:00'),
        minutes: 3000,
        dataMB: 80000,
        smsCount: 1500,
      },
      {
        subscriptionId: sub3.id,
        timestamp: new Date('2025-12-25T20:00:00'),
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
        timestamp: new Date('2026-01-12T09:00:00'),
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
        timestamp: new Date('2025-12-05T11:00:00'),
        minutes: 600,
        dataMB: 20000,
        smsCount: 300,
      },
      {
        subscriptionId: sub4.id,
        timestamp: new Date('2025-12-20T15:30:00'),
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
        timestamp: new Date('2026-01-14T13:00:00'),
        minutes: 400,
        dataMB: 12000,
        smsCount: 150,
      },
    ],
  })

  console.log('Created usage records')

  console.log('Creating invoices...')

  await prisma.invoice.createMany({
    data: [
      {
        subscriptionId: sub1.id,
        year: 2025,
        month: 12,
        baseFee: 49.99,
        overageFee: 30.0 + 20.0 + 6.0,
        totalAmount: 49.99 + 56.0,
        status: 'PAID',
        paidAt: new Date('2026-01-05T10:00:00'),
      },
      {
        subscriptionId: sub2.id,
        year: 2025,
        month: 12,
        baseFee: 44.99,
        overageFee: 0,
        totalAmount: 44.99,
        status: 'PAID',
        paidAt: new Date('2026-01-03T12:00:00'),
      },
      {
        subscriptionId: sub3.id,
        year: 2025,
        month: 12,
        baseFee: 149.99,
        overageFee: 0,
        totalAmount: 149.99,
        status: 'PAID',
        paidAt: new Date('2026-01-02T14:30:00'),
      },
      {
        subscriptionId: sub4.id,
        year: 2025,
        month: 12,
        baseFee: 89.99,
        overageFee: 0,
        totalAmount: 89.99,
        status: 'UNPAID',
      },
      {
        subscriptionId: sub1.id,
        year: 2025,
        month: 11,
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
  console.log('Usage records: Multiple entries (Dec 2025 - Jan 2026)')
  console.log('Invoices: 5 (mostly Dec 2025)')
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
