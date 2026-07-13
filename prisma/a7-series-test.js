require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
const BASE = "http://localhost:3000";
let ADMIN = "";
const post = (path, body, auth) => fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${ADMIN}` } : {}) }, body: JSON.stringify(body) }).then((r) => r.json().then((j) => ({ status: r.status, j })));
const adminPost = (path, body) => post(path, body, true);
const ok = (c, m) => console.log(`${c ? "  ✓" : "  ✗ FAIL"} ${m}`);

(async () => {
  let user, emps;
  try {
    const login = await post("/api/login", { email: "admin@phc.local", password: "TestAdmin2026!" });
    ADMIN = login.j.token;
    if (!ADMIN) throw new Error("admin login failed");
    emps = await p.employee.findMany({ where: { status: "approved" }, take: 2, select: { id: true, email: true } });
    if (emps.length < 2) throw new Error("need 2 approved employees");
    user = await p.user.create({ data: { email: "a7test@phc.local", address: "Teststrasse 1", frequency: "wöchentlich", firstName: "A7", lastName: "Test" } });

    const future = (days) => { const d = new Date(); d.setDate(d.getDate() + days); d.setHours(9, 0, 0, 0); return d; };
    const mk = (day, date) => p.schedule.create({ data: { day, startTime: "09:00", hours: 2, userId: user.id, date, status: "active", serviceName: "A7-TEST" } });
    const S1 = await mk("Montag", future(7));
    const S2 = await mk("Mittwoch", future(9));
    const S3 = await mk("Freitag", future(11));
    console.log(`Setup: user=${user.id.slice(0, 8)} schedules=[${S1.id},${S2.id},${S3.id}] emp=${emps[0].id.slice(0, 8)}\n`);

    // 1) SERIES ASSIGN — status active → series (scheduleId null); schedules NOT stamped yet
    console.log("Test 1 — series assign:");
    await adminPost("/api/admin/assign-employee", { appointmentId: S1.id, userId: user.id, employeeId: emps[0].id });
    let asg = await p.assignment.findFirst({ where: { userId: user.id, employeeId: emps[0].id, scheduleId: null }, orderBy: { createdAt: "desc" } });
    ok(!!asg, "series assignment created with scheduleId=null");
    let scheds = await p.schedule.findMany({ where: { userId: user.id }, orderBy: { id: "asc" } });
    ok(scheds.every((s) => s.employeeId === null), "schedules NOT stamped before acceptance");

    // 2) ACCEPT — propagates employeeId to all 3 future schedules
    console.log("Test 2 — accept propagates:");
    await post("/api/employee/confirm-assignment", { assignmentId: asg.id, action: "confirmed" });
    scheds = await p.schedule.findMany({ where: { userId: user.id }, orderBy: { id: "asc" } });
    ok(scheds.every((s) => s.employeeId === emps[0].id), `all 3 schedules stamped with primary employee`);

    // 3) ABSENCE — release S2 only
    console.log("Test 3 — per-appointment absence:");
    await post("/api/employee/release-schedule", { email: emps[0].email, scheduleId: S2.id });
    const s2 = await p.schedule.findUnique({ where: { id: S2.id } });
    ok(s2.employeeId === null && s2.status === "ersatz_noetig", "S2 released: employeeId=null, status=ersatz_noetig");
    const s1 = await p.schedule.findUnique({ where: { id: S1.id } });
    ok(s1.employeeId === emps[0].id, "S1 (rest of series) still with primary");

    // 4) REPLACEMENT — single assign to the released S2 → emp2
    console.log("Test 4 — replacement single-assign:");
    await adminPost("/api/admin/assign-employee", { appointmentId: S2.id, userId: user.id, employeeId: emps[1].id });
    const s2b = await p.schedule.findUnique({ where: { id: S2.id } });
    ok(s2b.employeeId === emps[1].id && s2b.status === "active", "S2 now has replacement employee, status active");
    const repAsg = await p.assignment.findFirst({ where: { userId: user.id, employeeId: emps[1].id, scheduleId: S2.id } });
    ok(!!repAsg, "single (replacement) assignment created with scheduleId=S2");

    // 5) REJECT (series) — fresh pending series → reject releases all
    console.log("Test 5 — series reject releases all:");
    await p.assignment.deleteMany({ where: { userId: user.id } });
    await p.schedule.updateMany({ where: { userId: user.id }, data: { employeeId: null, status: "active" } });
    await adminPost("/api/admin/assign-employee", { appointmentId: S1.id, userId: user.id, employeeId: emps[0].id });
    await p.schedule.updateMany({ where: { userId: user.id }, data: { employeeId: emps[0].id } }); // simulate accepted
    const asg2 = await p.assignment.findFirst({ where: { userId: user.id, scheduleId: null }, orderBy: { createdAt: "desc" } });
    await post("/api/employee/confirm-assignment", { assignmentId: asg2.id, action: "rejected" });
    scheds = await p.schedule.findMany({ where: { userId: user.id } });
    ok(scheds.every((s) => s.employeeId === null), "all schedules released after series reject");
  } catch (e) {
    console.error("ERROR:", e.message);
  } finally {
    // Cleanup
    if (user) {
      await p.assignment.deleteMany({ where: { userId: user.id } }).catch(() => {});
      await p.schedule.deleteMany({ where: { userId: user.id } }).catch(() => {});
      await p.user.delete({ where: { id: user.id } }).catch(() => {});
      console.log("\nCleanup: test user + schedules + assignments removed.");
    }
    await p.$disconnect();
  }
})();
