const { PrismaClient } = require('@prisma/client'); // Import Prisma client

const prisma = new PrismaClient(); // Initialize Prisma client

async function main() {
  // Adding employees with different statuses
  const employee1 = await prisma.employee.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Cityville',
      experienceYears: 5,
      experienceWhere: 'Company XYZ',
      hasLicense: true,
      availabilityFrom: new Date(),
      availabilityDays: ['Mon', 'Wed', 'Fri'],
      servicesOffered: ['Cleaning', 'Cooking'],
      howFarCanYouTravel: '20 miles',
      resumeUrl: 'http://example.com/resume',
      photoUrl: 'http://example.com/photo.jpg',
      status: 'pending', // This employee is in 'pending' status
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      address: '456 Elm St, Townsville',
      experienceYears: 3,
      experienceWhere: 'Company ABC',
      hasLicense: false,
      availabilityFrom: new Date(),
      availabilityDays: ['Tue', 'Thu'],
      servicesOffered: ['Cleaning'],
      howFarCanYouTravel: '10 miles',
      resumeUrl: 'http://example.com/jane_resume',
      photoUrl: 'http://example.com/jane_photo.jpg',
      status: 'approved', // This employee is in 'approved' status
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      firstName: 'Michael',
      lastName: 'Jordan',
      email: 'michael.jordan@example.com',
      phone: '456-789-0123',
      address: '789 Oak St, Villagetown',
      experienceYears: 10,
      experienceWhere: 'Company DEF',
      hasLicense: true,
      availabilityFrom: new Date(),
      availabilityDays: ['Mon', 'Tue', 'Fri'],
      servicesOffered: ['Cooking', 'Care'],
      howFarCanYouTravel: '50 miles',
      resumeUrl: 'http://example.com/michael_resume',
      photoUrl: 'http://example.com/michael_photo.jpg',
      status: 'pending', // This employee is in 'pending' status
    },
  });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
