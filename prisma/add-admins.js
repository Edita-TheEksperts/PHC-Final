const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAdmins() {
  const admins = [
    {
      email: 'br@alterswohnhilfe.ch',
      role: 'admin',
      passwordHash: 'changeme',
      address: 'Bahnhofstrasse 1, 8001 Zürich, Switzerland',
      frequency: 'admin',
      phone: '+41 44 123 45 67',
      firstName: 'Bruno',
      lastName: 'Roth',
      kanton: 'ZH',
      careCity: 'Zürich',
      carePostalCode: '8001',
    },
    {
      email: 'sk@alterswohnhilfe.ch',
      role: 'admin',
      passwordHash: 'changeme',
      address: 'Marktplatz 2, 4001 Basel, Switzerland',
      frequency: 'admin',
      phone: '+41 61 987 65 43',
      firstName: 'Sandra',
      lastName: 'Keller',
      kanton: 'BS',
      careCity: 'Basel',
      carePostalCode: '4001',
    },
    {
      email: 'fisnik.salihu@the-eksperts.com',
      role: 'admin',
      passwordHash: 'changeme',
      address: 'Bundesplatz 3, 3011 Bern, Switzerland',
      frequency: 'admin',
      phone: '+41 31 555 66 77',
      firstName: 'Fisnik',
      lastName: 'Salihu',
      kanton: 'BE',
      careCity: 'Bern',
      carePostalCode: '3011',
    },
  ];
  try {
    for (const admin of admins) {
      await prisma.user.upsert({
        where: { email: admin.email },
        update: { role: 'admin' },
        create: admin,
      });
    }
    console.log('✅ Admins added or updated.');
  } catch (error) {
    console.error('❌ Error adding admins:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdmins();
