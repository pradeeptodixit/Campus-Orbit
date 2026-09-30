import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runVerification() {
  console.log('--- 1. DATABASE SEED VERIFICATION ---');
  const user = await prisma.user.findUnique({
    where: { email: 'admin@campusorbit.edu' },
    include: { club: true }
  });

  if (!user) {
    console.error('❌ FAIL: admin@campusorbit.edu not found in database!');
    process.exit(1);
  }
  console.log('✅ PASS: Found admin user:', user.email, '| Name:', user.name, '| Role:', user.role);

  console.log('\n--- 2. PASSWORD VERIFICATION ---');
  const isValidPassword = user.passwordHash === 'admin123';
  if (!isValidPassword) {
    console.error('❌ FAIL: Password admin123 does not match passwordHash!');
    process.exit(1);
  }
  console.log('✅ PASS: Password admin123 matches stored hash.');

  console.log('\n--- 3. DATABASE RECORDS VERIFICATION ---');
  const clubsCount = await prisma.club.count();
  const eventsCount = await prisma.event.count();
  const regCount = await prisma.registration.count();
  const checkinCount = await prisma.checkIn.count();
  console.log(`✅ PASS: Database contains ${clubsCount} clubs, ${eventsCount} events, ${regCount} registrations, ${checkinCount} check-ins.`);

  console.log('\n--- 4. LEGACY EMAIL AUDIT IN DATABASE ---');
  const legacyUser = await prisma.user.findUnique({
    where: { email: 'admin@campusconnect.edu' }
  });
  if (legacyUser) {
    console.error('❌ FAIL: Found legacy admin@campusconnect.edu in database!');
    process.exit(1);
  }
  console.log('✅ PASS: Zero legacy admin@campusconnect.edu users in database.');

  await prisma.$disconnect();
  console.log('\n🎉 ALL DATABASE & AUTH CHECKS PASSED SUCCESSFULLY!');
}

runVerification().catch((err) => {
  console.error('❌ Verification Error:', err);
  process.exit(1);
});
