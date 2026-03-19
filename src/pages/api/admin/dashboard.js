import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all employees with assignments and schedules
async function fetchEmployees() {
  return await prisma.employee.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
      invited: true,
      createdAt: true,
      howDidYouHearAboutUs: true,
      documentStatus: true,
      assignments: {
        select: {
          status: true,
          serviceName: true,
          firstDate: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              schedules: true,
            },
          },
        },
      },
      schedules: {
        select: {
          id: true,
          day: true,
          startTime: true,
          hours: true,
          kilometers: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}


// Fetch all clients with related data
async function fetchClients() {
  return await prisma.user.findMany({
    where: { role: 'client' },
    include: {
      services: true,
      subServices: true,
      assignments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { employee: true },
      },
    },
  });
}

// Approve an employee
async function approveEmployeeInDB(employeeId) {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: { status: 'approved' },
  });
}

// Reject an employee
async function rejectEmployeeInDB(employeeId) {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: { status: 'rejected' },
  });
}

// Unified API route handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const employees = await fetchEmployees();
      const clients = await fetchClients();
const schedules = await prisma.schedule.findMany({
  include: {
    user: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        services: { select: { name: true }},
      }
    },
    employee: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true
      }
    }
  },
  orderBy: { date: "asc" }
});


const schedulesWithService = schedules.map(s => ({
  ...s,
  serviceName:
    s.serviceName || 
    (s.user?.services?.[0]?.name ?? null),
  subServiceName: s.subServiceName || null,
}));

return res.status(200).json({
  employees,
  clients,
  schedules: schedulesWithService
});


    } catch (error) {
      return res.status(500).json({ message: 'Error fetching dashboard data' });
    }
  }

  if (req.method === 'POST') {
    const { employeeId, action } = req.body;

    try {
      if (action === 'approve') {
        await approveEmployeeInDB(employeeId);
        return res.status(200).json({ message: 'Employee approved' });
      }

      if (action === 'reject') {
        await rejectEmployeeInDB(employeeId);
        return res.status(200).json({ message: 'Employee rejected' });
      }

      return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating employee status' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
