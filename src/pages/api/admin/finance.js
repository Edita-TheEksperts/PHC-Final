import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // -------------------------------------------------------
    // 💰 Income per Service + SubServices
    // -------------------------------------------------------
    const services = await prisma.service.findMany({
      include: {
        users: { select: { totalPayment: true, createdAt: true } },
        subServices: {
          include: {
            users: { select: { totalPayment: true, createdAt: true } },
          },
        },
      },
    });

    const incomePerService = await Promise.all(
      services.map(async (s) => {
        const allTime = s.users.reduce(
          (sum, u) => sum + (u.totalPayment || 0),
          0
        );

        const thisMonthTx = await prisma.transaction.findMany({
          where: {
            status: "completed",
            createdAt: { gte: startOfMonth, lte: endOfMonth },
            schedule: { user: { services: { some: { id: s.id } } } },
          },
        });

        const thisMonth = thisMonthTx.reduce(
          (sum, t) => sum + (t.amountClient || 0),
          0
        );

        // ✅ subservice split
        const subserviceSplit = s.subServices.map((sub) => {
          const allTime = sub.users.reduce(
            (sum, u) => sum + (u.totalPayment || 0),
            0
          );
          return {
            subServiceName: sub.name,
            allTime,
          };
        });

        return {
          serviceName: s.name,
          allTime,
          thisMonth,
          subserviceSplit,
        };
      })
    );

    const totalIncomeAllTime = incomePerService.reduce(
      (sum, s) => sum + s.allTime,
      0
    );

    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        status: "completed",
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const totalIncomeThisMonth = monthlyTransactions.reduce(
      (sum, t) => sum + (t.amountClient || 0),
      0
    );

    // -------------------------------------------------------
    // 💸 Cost per Service + Subservices
    // -------------------------------------------------------
    const schedules = await prisma.schedule.findMany({
      include: {
        user: { include: { services: true, subServices: true } },
      },
    });

    const serviceCostMap = {};
    const subserviceCostMap = {};
    let totalCostThisMonth = 0;

    schedules.forEach((s) => {
      const cost = s.hours * 30 + (s.kilometers || 0) * 0.5;

      // all time
      s.user.services.forEach((service) => {
        serviceCostMap[service.name] = serviceCostMap[service.name] || {
          allTime: 0,
          thisMonth: 0,
        };
        serviceCostMap[service.name].allTime += cost;

        // subservices
        s.user.subServices.forEach((sub) => {
          if (!subserviceCostMap[service.name]) {
            subserviceCostMap[service.name] = {};
          }
          subserviceCostMap[service.name][sub.name] =
            (subserviceCostMap[service.name][sub.name] || 0) + cost;
        });
      });

      // only this month
      if (s.date && s.date >= startOfMonth && s.date <= endOfMonth) {
        s.user.services.forEach((service) => {
          serviceCostMap[service.name].thisMonth += cost;
        });
        totalCostThisMonth += cost;
      }
    });

    const costPerService = Object.entries(serviceCostMap).map(
      ([serviceName, amounts]) => ({
        serviceName,
        allTime: amounts.allTime,
        thisMonth: amounts.thisMonth,
        subserviceSplit: subserviceCostMap[serviceName]
          ? Object.entries(subserviceCostMap[serviceName]).map(
              ([sub, amt]) => ({
                subServiceName: sub,
                allTime: amt,
              })
            )
          : [],
      })
    );

    const totalCost = costPerService.reduce((sum, s) => sum + s.allTime, 0);

    // -------------------------------------------------------
    // 🔄 Moved the code you had outside into here
    // -------------------------------------------------------
    const monthlySchedules = schedules.filter(
      (s) => s.date && s.date >= startOfMonth && s.date <= endOfMonth
    );

    const altTotalCostThisMonth = monthlySchedules.reduce((sum, s) => {
      const cost = s.hours * 30 + (s.kilometers || 0) * 0.5;
      return sum + cost;
    }, 0);

    // -------------------------------------------------------
    // 📤 Response
    // -------------------------------------------------------
    res.json({
      incomePerService,
      costPerService,
      totalIncomeAllTime,
      totalIncomeThisMonth,
      totalCost,              // all time
      totalCostThisMonth,     // nga llogaritja e parë
      altTotalCostThisMonth,  // nga llogaritja e fundit që e kishe jashtë
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
