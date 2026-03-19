import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [appointment, setAppointment] = useState(null);
  const [matchingEmployees, setMatchingEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ helper: pranon vetëm employees që janë accepted/approved (sipas sistemit tuaj)
  function isAcceptedStatus(status) {
    const s = (status || "").toLowerCase();
    return s === "accepted" || s === "approved";
  }

  function getEmployeeStatusFromRec(r) {
    // matchmaking mund të kthejë status direkt ose brenda employee
    return (
      r?.employee?.status ??
      r?.status ??
      r?.employeeStatus ??
      r?.employee_status
    );
  }

  useEffect(() => {
    if (!router.isReady || !id) return;

    async function fetchAppointment() {
      try {
        const res = await fetch(`/api/appointments/${id}`);
        if (!res.ok) throw new Error("Termin nicht gefunden.");
        const data = await res.json();
        setAppointment(data);

        // ✅ Fetch matchmaking results
        if (data?.user?.id) {
          const recRes = await fetch(
            `/api/admin/matchmaking?clientId=${data.user.id}`
          );
          const recData = await recRes.json();

          const safeRecData = Array.isArray(recData) ? recData : [];

          // ✅ 1) VETËM ACCEPTED employees nga matchmaking
          const acceptedRecs = safeRecData.filter((r) =>
            isAcceptedStatus(getEmployeeStatusFromRec(r))
          );

          // ✅ 2) Pastaj best matches (>=70 score & no allergy)
          const strongMatches = acceptedRecs
            .filter((r) => r.score >= 70 && !r.hasAllergy)
            .slice(0, 2);

          setMatchingEmployees(strongMatches);

          // ✅ If no matches → fallback load all employees (vetëm accepted)
          if (strongMatches.length === 0) {
            const allRes = await fetch(`/api/admin/employees`);
            const allEmployees = await allRes.json();

            const safeAll = Array.isArray(allEmployees) ? allEmployees : [];
            const acceptedOnly = safeAll.filter((emp) =>
              isAcceptedStatus(emp.status)
            );

            setMatchingEmployees(acceptedOnly);
          }
        }
      } catch (err) {
        setError(err.message || "Fehler beim Laden.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [router.isReady, id]);

  async function handleAssignEmployee() {
    if (!selectedEmployee) return alert("Bitte Mitarbeiter auswählen!");

    const payload = {
      appointmentId: id,
      userId: appointment.user?.id,
      employeeId: selectedEmployee,
    };
    // Use payload in your API call or logic

    const res = await fetch("/api/admin/assign-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: id,
        userId: appointment.user?.id, // ID e klientit
        employeeId: selectedEmployee, // ID e punonjësit
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert("Error: " + data.message);
    }

    alert("Mitarbeiter erfolgreich zugewiesen!");
    router.reload();
  }

  if (loading) return <div className="p-6 text-gray-600">⏳ Lade Termin...</div>;
  if (error) return <div className="p-6 text-red-600">❌ {error}</div>;
  if (!appointment) return null;

  const { date, startTime, hours, user, notes, employee } = appointment;

  const employeeName = employee
    ? `${employee.firstName || ""} ${employee.lastName || ""}`.trim()
    : "—";
  const clientName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "—";

  const languages = Array.isArray(employee?.languages)
    ? employee.languages.join(", ")
    : typeof employee?.languages === "object"
    ? Object.keys(employee.languages).join(", ")
    : "–";

  // ✅ Service/Subservice: MERREN NGA USER (relations),
  //    por nëse API nuk i ka përfshirë, bëjmë fallback te Schedule fields.
  const userServices =
    Array.isArray(user?.services) && user.services.length > 0
      ? user.services.map((s) => s?.name).filter(Boolean).join(", ")
      : null;

  const userSubServices =
    Array.isArray(user?.subServices) && user.subServices.length > 0
      ? user.subServices.map((s) => s?.name).filter(Boolean).join(", ")
      : null;

  const serviceToShow = userServices || appointment?.serviceName || "—";
  const subServiceToShow = userSubServices || appointment?.subServiceName || "—";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white border rounded-2xl shadow-md mt-6">
      <h1 className="text-2xl font-bold text-[#04436F] mb-6"> Termindetails</h1>

      {/* Quick mapping: Employee → Client */}
      <div className="mb-6 text-sm">
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200">
          {employeeName}
          <span className="mx-1">→</span>
          👤 {clientName}
        </span>
      </div>

      {/* Appointment Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Termin-Infos</h2>
        <ul className="space-y-2 text-sm text-gray-800">
          <li>
            <b> Datum:</b> {date ? new Date(date).toLocaleDateString() : "–"}
          </li>
          <li>
            <b> Uhrzeit:</b> {startTime || "–"}
          </li>
          <li>
            <b>⏱ Dauer:</b> {hours} Stunden
          </li>
          <li>
            <b> Service:</b> {serviceToShow}
          </li>
          <li>
            <b> Subservice:</b> {subServiceToShow}
          </li>
          {typeof notes === "string" && notes.trim() && (
            <li>
              <b> Notizen:</b>
              <p className="mt-1 bg-gray-50 border border-gray-200 p-3 rounded-md text-gray-700 whitespace-pre-line">
                {notes}
              </p>
            </li>
          )}
        </ul>
      </section>

      {/* Client Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3"> Kunden</h2>
        <ul className="space-y-2 text-sm text-gray-800">
          <li>
            <b> Name:</b> {clientName}
          </li>
          <li>
            <b> Adresse:</b> {user?.address || "–"}, {user?.careCity || "–"}
          </li>
          <li>
            <b> Telefon:</b> {user?.phone || "–"}
          </li>
        </ul>
      </section>

      {/* Employee Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3"> Mitarbeitende</h2>

        {/* ✅ If employee exists */}
        {employee ? (
          <div className="flex items-start gap-4">
            <ul className="space-y-2 text-sm text-gray-800">
              <li>
                <b>Name:</b> {employeeName}
              </li>
              <li>
                <b> Stadt:</b> {employee.city || "–"}
              </li>
              <li>
                <b> Telefon:</b> {employee.phone || "–"}
              </li>
              <li>
                <b> Sprachen:</b> {languages}
              </li>
            </ul>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-3">
              Kein/e Mitarbeitende/r zugewiesen.
            </div>

            {!employee && (
              <>
                {/* ✅ Show top recommended first */}
                {matchingEmployees.length > 0 &&
                  matchingEmployees[0].score !== undefined &&
                  matchingEmployees.map((emp) => (
                    <div
                      key={emp.employeeId}
                      className="flex justify-between items-center p-2 mb-2 border border-green-300 bg-green-50 rounded-lg"
                    >
                      <span className="text-green-800 text-sm font-semibold">
                        {emp.firstName} {emp.lastName} ({emp.score}% Match)
                      </span>
                    </div>
                  ))}

                {/* ✅ Dropdown for assigning (vetëm accepted) */}
                <select
                  className="w-full border rounded-lg p-2 mt-2"
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Mitarbeiter auswählen --
                  </option>

                  {matchingEmployees.map((emp) => (
                    <option
                      key={emp.employeeId || emp.id}
                      value={emp.employeeId || emp.id}
                    >
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssignEmployee}
                  disabled={!selectedEmployee}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm disabled:bg-gray-300"
                >
                  Mitarbeiter zuweisen
                </button>
              </>
            )}
          </>
        )}
      </section>

      {/* Back button */}
      <div className="text-center mt-8">
        <Link href="/admin-dashboard">
          <button className="px-5 py-2 bg-[#04436F] text-white rounded-xl hover:bg-[#033252] text-sm font-medium">
            ⬅ Zurück zum Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
