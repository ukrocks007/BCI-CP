/**
 * Prisma Seed Script
 * 
 * Populates database with sample data for demonstration
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a sample session
  const session = await prisma.session.create({
    data: {
      userId: 'demo-user-001',
      status: 'active',
      calibration: {
        create: {
          flashSpeed: 1.0,
          objectCount: 3,
        },
      },
    },
  });

  console.log(`✅ Created session: ${session.id}`);

  // Create sample trials
  for (let i = 1; i <= 5; i++) {
    const trial = await prisma.trial.create({
      data: {
        sessionId: session.id,
        trialNumber: i,
        targetType: i % 2 === 0 ? 'target' : 'nontarget',
        responseTime: 400 + Math.random() * 200,
        accuracy: Math.random() > 0.3,
        predictions: {
          create: {
            prediction: Math.random() > 0.3 ? 'YES' : 'NO',
            confidence: 0.5 + Math.random() * 0.4,
          },
        },
      },
    });

    console.log(`✅ Created trial: ${trial.id}`);
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
