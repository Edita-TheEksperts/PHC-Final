const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteTestUsers() {
  try {
    // Step 1: Find user IDs by email
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['fisnik.salihu@the-eksperts.com', 'fi.salihu@gmail.com'],
        },
      },
      select: { id: true, email: true },
    });

    for (const user of users) {
      // Step 2: Delete assignments linked to the user
      await prisma.assignment.deleteMany({
        where: { userId: user.id },
      });

      // Step 3: Delete the user
      await prisma.user.delete({
        where: { id: user.id },
      });
    }
  } catch (error) {
    console.error('❌ Error deleting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestUsers();
