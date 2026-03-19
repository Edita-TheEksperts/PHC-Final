import { prisma } from "./src/lib/prisma.js";

async function main() {
  console.log("⏳ Creating a test schedule for yesterday...");

  // 1) Data e Djeshme
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // 2) Kalkulojmë ditën (Mon, Tue, Wed...)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[yesterday.getDay()];

  // 3) Marrim user + employee ekzistues
  const user = await prisma.user.findFirst();
  const employee = await prisma.employee.findFirst();

  if (!user || !employee) {
    console.log("❌ No user or employee found!");
    return;
  }

  // 4) Krijojmë schedule-in e djeshëm
  const schedule = await prisma.schedule.create({
    data: {
      day: dayName,
      date: yesterday,
      startTime: "09:00",
      hours: 2,
      status: "active",
      userId: user.id,
      employeeId: employee.id
    }
  });

  console.log("✅ Schedule CREATED:");
  console.log(schedule);
}

main()
  .catch((e) => {
    console.error("❌ Error creating schedule:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
