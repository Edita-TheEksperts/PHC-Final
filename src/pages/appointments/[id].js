import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [appointment, setAppointment] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !id) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/appointments/${id}`);
        if (!res.ok) throw new Error("Termin nicht gefunden.");
        const data = await res.json();
        setAppointment(data);

        // Fetch matchmaking + all employees in parallel
        if (data?.user?.id) {
          const [recRes, empRes] = await Promise.all([
            fetch(`/api/admin/matchmaking?clientId=${data.user.id}`),
            fetch(`/api/admin/employees`),
          ]);
          const recData = await recRes.json();
          const empData = await empRes.json();
          setRecommendations(Array.isArray(recData) ? recData : []);
          const emps = Array.isArray(empData) ? empData : empData?.employees || [];
          setAllEmployees(emps.filter((e) => e.status === "approved"));
        }
      } catch (err) {
        setError(err.message || "Fehler beim Laden.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router.isReady, id]);

  async function handleAssignEmployee() {
    if (!selectedEmployee) return;
    setAssigning(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/assign-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: id,
          userId: appointment.user?.id,
          employeeId: selectedEmployee,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: "error", text: data.message || "Fehler bei der Zuweisung" });
      } else {
        setToast({ type: "success", text: "Mitarbeiter erfolgreich zugewiesen!" });
        setTimeout(() => router.reload(), 1500);
      }
    } catch {
      setToast({ type: "error", text: "Netzwerkfehler" });
    } finally {
      setAssigning(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#04436F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Lade Termin...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-sm text-red-700">{error}</div>
    </div>
  );
  if (!appointment) return null;

  const { date, startTime, hours, user, employee } = appointment;
  const employeeName = employee ? `${employee.firstName} ${employee.lastName}`.trim() : null;
  const clientName = user ? `${user.firstName} ${user.lastName}`.trim() : "—";
  const serviceToShow = appointment.serviceName || "—";
  const subServiceToShow = appointment.subServiceName || "—";

  const labelCls = "text-xs font-medium text-gray-400 uppercase tracking-wide";
  const valueCls = "text-sm font-semibold text-gray-900 mt-0.5";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Termindetails</h1>
          <p className="text-xs text-gray-400 mt-0.5">ID: {appointment.id}</p>
        </div>
        <Link href="/admin/kunden">
          <button className="px-4 py-2 bg-[#04436F] text-white rounded-lg text-xs font-medium hover:bg-[#033558] transition">
            Zurück
          </button>
        </Link>
      </div>

      {/* Mapping badge */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <span className="font-medium text-gray-900">{clientName}</span>
          </div>
          <span className="text-gray-300">→</span>
          {employeeName ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </div>
              <span className="font-medium text-gray-900">{employeeName}</span>
            </div>
          ) : (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">Nicht zugewiesen</span>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {/* Termin Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Termin-Infos</h2>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div>
              <p className={labelCls}>Datum</p>
              <p className={valueCls}>{date ? new Date(date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</p>
            </div>
            <div>
              <p className={labelCls}>Uhrzeit</p>
              <p className={valueCls}>{startTime || "—"} Uhr</p>
            </div>
            <div>
              <p className={labelCls}>Dauer</p>
              <p className={valueCls}>{hours || "—"} Stunden</p>
            </div>
            <div>
              <p className={labelCls}>Service</p>
              <p className={valueCls}>{serviceToShow}</p>
            </div>
            <div>
              <p className={labelCls}>Unterkategorie</p>
              <p className={valueCls}>{subServiceToShow}</p>
            </div>
            <div>
              <p className={labelCls}>Status</p>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border mt-0.5 ${
                appointment.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                appointment.status === "terminated" ? "bg-gray-100 text-gray-600 border-gray-200" :
                "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>{appointment.status || "active"}</span>
            </div>
          </div>
        </div>

        {/* Kunden Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kunde</h2>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div>
              <p className={labelCls}>Name</p>
              <p className={valueCls}>{clientName}</p>
            </div>
            <div>
              <p className={labelCls}>Adresse</p>
              <p className={valueCls}>{[user?.address, user?.careCity].filter(Boolean).join(", ") || "—"}</p>
            </div>
            <div>
              <p className={labelCls}>Telefon</p>
              <p className={valueCls}>{user?.phone || "—"}</p>
            </div>
            <div>
              <p className={labelCls}>E-Mail</p>
              <p className={valueCls}>{user?.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* Mitarbeiter Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mitarbeiter</h2>
          </div>

          {employee ? (
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <p className={labelCls}>Name</p>
                <p className={valueCls}>{employeeName}</p>
              </div>
              <div>
                <p className={labelCls}>Stadt</p>
                <p className={valueCls}>{employee.city || "—"}</p>
              </div>
              <div>
                <p className={labelCls}>Telefon</p>
                <p className={valueCls}>{employee.phone || "—"}</p>
              </div>
              <div>
                <p className={labelCls}>E-Mail</p>
                <p className={valueCls}>{employee.email || "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className={labelCls}>Sprachen</p>
                <p className={valueCls}>{Array.isArray(employee.languages) ? employee.languages.join(", ") : "—"}</p>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Recommendations */}
              {recommendations.length > 0 && recommendations[0].score !== undefined && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Empfohlene Mitarbeiter</p>
                  <div className="space-y-1.5">
                    {recommendations.slice(0, 3).map((r) => (
                      <div key={r.employeeId} className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-emerald-900">{r.firstName} {r.lastName}</span>
                          <span className="ml-2 text-xs text-emerald-600">({r.score}% Match)</span>
                        </div>
                        <button
                          onClick={() => { setSelectedEmployee(r.employeeId); handleAssignEmployee(); }}
                          className="text-xs px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                        >
                          Zuweisen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual select */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Manuell zuweisen</p>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F]"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Mitarbeiter auswählen...</option>
                    {allEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} {emp.city ? `(${emp.city})` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignEmployee}
                    disabled={!selectedEmployee || assigning}
                    className="px-4 py-2 bg-[#04436F] text-white text-sm font-medium rounded-lg hover:bg-[#033558] transition disabled:opacity-50"
                  >
                    {assigning ? "..." : "Zuweisen"}
                  </button>
                </div>
              </div>

              {/* Toast */}
              {toast && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" :
                  "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {toast.text}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
