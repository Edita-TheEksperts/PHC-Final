import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { Ticket, CheckCircle, PauseCircle, Clock, Search, PlusCircle, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import DashboardCard from "../components/DashboardCard";
import ActiveClients from "../components/ActiveClients";
import EmployeesOnAssignment from "../components/EmployeesOnAssignment";
import AppointmentCalendar from "../components/AppointmentCalendar";
import ApplicationOverview from "../components/ApplicationOverview";
import WorkingTimeTracking from "../components/WorkingTimeTracking";
import OvertimeAlerts from "../components/OvertimeAlerts";
import CurrentRevenue from "../components/CurrentRevenue";
import EmployeeTable from "../components/EmployeeTable";
import ClientTable from "../components/ClientTable";
import Mitarbeiter from "../components/Mitarbeiter";
import Kunden from "../components/Kunden";
import Einsaetze from "../components/Einsaetze";
import Finanzen from "../components/Finanzen";
import EmailTemplatesAdmin from "../components/EmailTemplatesAdmin";
import BlogsTab from "../components/BlogsTab";
import { useRouter } from "next/router";

import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ── Inline tab components ──────────────────────────────────────────────────

function BewerberTab({ employees, onApprove, onReject, onInvite, router }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createdDate, setCreatedDate] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const filtered = employees
    .filter(e => e.status !== "approved")
    .filter(e => `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(e => { if (statusFilter === "invited") return e.invited; if (statusFilter === "pending") return e.status === "pending"; return true; })
    .filter(e => { if (!createdDate) return true; return new Date(e.createdAt).toISOString().split("T")[0] === createdDate; });

  const statusBadge = (emp) => {
    const base = "px-2 py-0.5 rounded-full text-xs font-medium border";
    if (emp.status === "approved") return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>Genehmigt</span>;
    if (emp.status === "rejected") return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>Abgelehnt</span>;
    return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>Ausstehend</span>;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Bewerber</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} Bewerber gefunden</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Vor- oder Nachname..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]">
            <option value="all">Alle Status</option>
            <option value="invited">Eingeladen</option>
            <option value="pending">Ausstehend</option>
          </select>
          <input type="date" value={createdDate} onChange={e => setCreatedDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">E-Mail</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Telefon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Erstellt am</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">Keine Bewerber gefunden</td></tr>
              ) : filtered.slice(0, visibleCount).map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{emp.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{emp.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(emp.createdAt).toLocaleDateString("de-DE")}</td>
                  <td className="px-4 py-3">{statusBadge(emp)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {emp.status === "pending" && (<>
                        <button onClick={() => onApprove(emp)} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100 transition">Genehmigen</button>
                        <button onClick={() => onReject(emp)} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition">Ablehnen</button>
                        {!emp.invited && <button onClick={() => onInvite(emp)} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium hover:bg-blue-100 transition">Einladen</button>}
                      </>)}
                      <button onClick={() => router.push(`/admin/employees/${emp.id}`)} className="px-2.5 py-1 bg-[#0F1F38] text-white rounded-md text-xs font-medium hover:bg-[#1a3050] transition">Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleCount < filtered.length && (
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button onClick={() => setVisibleCount(v => v + 20)} className="px-4 py-1.5 text-sm text-[#0F1F38] font-medium hover:bg-gray-50 rounded-lg transition">
              Mehr laden ({filtered.length - visibleCount} verbleibend)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SystemwartungTab() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const formatDate = (v) => { if (!v) return ""; const d = new Date(v); if (isNaN(d)) return v; return `${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}.${d.getFullYear()}`; };
  async function send() {
    if (!dateStart || !dateEnd || !timeStart || !timeEnd) { setMessage("Bitte alle Felder ausfüllen."); return; }
    setSending(true); setMessage("");
    try {
      const res = await fetch("/api/admin/send-maintenance-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: `${dateStart} bis ${dateEnd}`, timeStart, timeEnd }) });
      setMessage(res.ok ? "✅ Wartungs-Mail gesendet." : "❌ Fehler beim Senden.");
    } catch { setMessage("❌ Serverfehler."); } finally { setSending(false); }
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl mx-auto space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Systemwartung E-Mail</h2>
        <p className="text-xs text-gray-500 mt-0.5">E-Mail an alle Kunden über geplante Wartungsarbeiten</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="flex flex-col"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Startdatum</span><input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" /></label>
        <label className="flex flex-col"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Enddatum</span><input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" /></label>
        <label className="flex flex-col"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Startzeit</span><input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" /></label>
        <label className="flex flex-col"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Endzeit</span><input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" /></label>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
        <p className="font-medium text-gray-500 text-xs mb-2 uppercase tracking-wide">Vorschau</p>
        <strong>Betreff:</strong> Information: Vorübergehende Systemwartung{"\n\n"}Vom {formatDate(dateStart)} bis {formatDate(dateEnd)} zwischen {timeStart} und {timeEnd} führen wir Wartungsarbeiten durch.
      </div>
      <button onClick={send} disabled={sending} className={`w-full py-2.5 rounded-lg text-sm text-white font-medium transition ${sending ? "bg-gray-300 cursor-not-allowed" : "bg-[#0F1F38] hover:bg-[#1a3050]"}`}>{sending ? "Wird gesendet..." : "E-Mail an alle Kunden senden"}</button>
      {message && <p className={`text-center text-sm ${message.startsWith("❌") ? "text-red-600" : "text-emerald-600"}`}>{message}</p>}
    </div>
  );
}

function FeedbackEmailTab() {
  const [clients, setClients] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [feedbackLink, setFeedbackLink] = useState("");
  useEffect(() => {
    fetch("/api/admin/clients").then(r => r.json()).then(d => setClients(d.clients || [])).catch(() => {});
  }, []);
  async function send() {
    if (!caregiverName || !feedbackLink) { setMessage("Bitte Betreuername und Feedback-Link ausfüllen."); return; }
    setSending(true); setMessage("");
    try {
      const res = await fetch("/api/admin/send-feedback-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caregiverName, feedbackLink }) });
      setMessage(res.ok ? `✅ Feedback-Mail an ${clients.length} Kunden gesendet.` : "❌ Fehler beim Senden.");
    } catch { setMessage("❌ Serverfehler."); } finally { setSending(false); }
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl mx-auto space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Feedbackanfrage E-Mail</h2>
        <p className="text-xs text-gray-500 mt-0.5">Wird an alle {clients.length} Kunden gesendet</p>
      </div>
      <div className="space-y-4">
        <label className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Betreuername</span>
          <input type="text" value={caregiverName} onChange={e => setCaregiverName(e.target.value)} placeholder="Name der Betreuungsperson"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" />
        </label>
        <label className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Feedback-Link</span>
          <input type="url" value={feedbackLink} onChange={e => setFeedbackLink(e.target.value)} placeholder="https://example.com/feedback"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]" />
        </label>
      </div>
      <button onClick={send} disabled={sending || clients.length === 0}
        className={`w-full py-2.5 rounded-lg text-sm text-white font-medium transition ${sending || clients.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#0F1F38] hover:bg-[#1a3050]"}`}>
        {sending ? "Wird gesendet..." : `Feedback-E-Mail an alle ${clients.length} Kunden senden`}
      </button>
      {message && <p className={`text-center text-sm ${message.startsWith("❌") ? "text-red-600" : "text-emerald-600"}`}>{message}</p>}
    </div>
  );
}

function GutscheinTab() {
  const [vouchers, setVouchers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ code: "", discountType: "percent", discountValue: "", maxUses: 100, validFrom: new Date().toISOString().slice(0,10), validUntil: "2026-12-31", isActive: true });
  useEffect(() => { fetchVouchers(); }, []);
  useEffect(() => { if (!search.trim()) setFiltered(vouchers); else { const s = search.toLowerCase(); setFiltered(vouchers.filter(v => v.code.toLowerCase().includes(s))); } }, [search, vouchers]);
  async function fetchVouchers() { setLoading(true); try { const r = await fetch("/api/admin/vouchers"); const d = await r.json(); if (Array.isArray(d.vouchers)) { setVouchers(d.vouchers); setFiltered(d.vouchers); } } catch {} finally { setLoading(false); } }
  async function handleSubmit(e) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST"; const url = editing ? `/api/admin/vouchers/${editing}` : "/api/admin/vouchers";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    const d = await res.json();
    if (res.ok) { alert(editing ? "Gutschein aktualisiert!" : "Gutschein erstellt!"); setEditing(null); setFormData({ code: "", discountType: "percent", discountValue: "", maxUses: 100, validFrom: new Date().toISOString().slice(0,10), validUntil: "2026-12-31", isActive: true }); fetchVouchers(); }
    else { alert("Fehler: " + (d.error || "Operation fehlgeschlagen.")); }
  }
  async function handleDelete(id) { if (!confirm("Diesen Gutschein wirklich löschen?")) return; const res = await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" }); if (res.ok) { alert("Gutschein gelöscht!"); fetchVouchers(); } }
  function handleEdit(v) { setEditing(v.id); setFormData({ code: v.code, discountType: v.discountType, discountValue: v.discountValue, maxUses: v.maxUses, validFrom: v.validFrom?.slice(0,10) || new Date().toISOString().slice(0,10), validUntil: v.validUntil?.slice(0,10) || "2026-12-31", isActive: v.isActive }); }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gutscheinverwaltung</h1>
      <div className="flex items-center border rounded-lg overflow-hidden max-w-md mb-6"><Search className="text-gray-400 ml-3" size={18} /><input type="text" placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-3 outline-none text-sm" /></div>
      <div className="bg-white border rounded-2xl shadow-sm p-6 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Code</label><input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="WELCOME10" className="w-full p-3 border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Rabatt-Typ</label><select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full p-3 border rounded-lg"><option value="percent">Prozent (%)</option><option value="fixed">Fixbetrag (CHF)</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Wert</label><input type="number" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} placeholder="10" className="w-full p-3 border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Max. Verwendung</label><input type="number" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Gültig von</label><input type="date" value={formData.validFrom} onChange={e => setFormData({...formData, validFrom: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Gültig bis</label><input type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} /><label className="text-sm font-medium text-gray-700">Aktiv</label></div>
          <div className="flex items-end"><button type="submit" className={`w-full ${editing ? "bg-amber-600 hover:bg-amber-700" : "bg-[#0F1F38] hover:opacity-90"} text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2`}>{editing ? <><CheckCircle2 size={18} /> Aktualisieren</> : <><PlusCircle size={18} /> Erstellen</>}</button></div>
        </form>
        {editing && <button onClick={() => setEditing(null)} className="mt-3 text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"><XCircle size={16} /> Abbrechen</button>}
      </div>
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="py-10 text-center text-gray-500">Wird geladen...</div> : filtered.length === 0 ? <div className="py-16 text-center text-gray-400">Keine Gutscheine gefunden</div> : (
          <div className="overflow-x-auto"><table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#0F1F38] text-white text-sm uppercase"><tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Typ</th><th className="px-4 py-3">Wert</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Gültig bis</th><th className="px-4 py-3 text-right">Aktionen</th></tr></thead>
            <tbody>{filtered.map(v => (<tr key={v.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 font-medium">{v.code}</td><td className="px-4 py-3 capitalize">{v.discountType}</td><td className="px-4 py-3">{v.discountValue}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{v.isActive ? "Aktiv" : "Inaktiv"}</span></td><td className="px-4 py-3">{new Date(v.validUntil).toLocaleDateString()}</td><td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => handleEdit(v)} className="p-2 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100"><Pencil size={16} /></button><button onClick={() => handleDelete(v.id)} className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={16} /></button></div></td></tr>))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {

  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "admin") {
      router.replace("/login");
    }
  }, []);

  const [employees, setEmployees] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [andereDetails, setAndereDetails] = useState([]);
  const [vacations, setVacations] = useState([]);

const [activity, setActivity] = useState([
  {
    actor: "Admin",
    action: "approved John Doe",
    timestamp: "2025-08-01T10:00:00Z",
  },
  {
    actor: "System",
    action: "sent reminder to Anna",
    timestamp: "2025-08-01T08:30:00Z",
  },
]);

useEffect(() => {
  fetchData();
  fetchStats();
  fetchWarnings();
  fetchVacations();   // 👈 add this
}, []);





async function fetchVacations() {
  try {
    const res = await fetch("/api/admin/vacations");
    const data = await res.json();

    // Check if backend wraps in { vacations: [...] }
    if (Array.isArray(data)) {
      setVacations(data);
    } else if (Array.isArray(data.vacations)) {
      setVacations(data.vacations);
    } else {
      setVacations([]);
    }
  } catch (err) {
    setVacations([]);
  }
}

const { tab, create } = router.query;

const [data, setData] = useState({
  totalIncomeAllTime: 0,
  totalIncomeThisMonth: 0,
  totalCost: 0,
  incomePerService: [],
  costPerService: [],
});

useEffect(() => {
  axios.get("/api/admin/finance").then((res) => {
    setData(res.data);
  });
}, []);


  async function fetchData() {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();

    const allEmployees = data.employees || [];
    setEmployees(allEmployees);

    const approved = allEmployees.filter(emp => emp.status === "approved");
    setApprovedEmployees(approved);

    setClients(data.clients || []);
    setSchedules(data.schedules || []);

    const sourceStats = {};
    const andereItems = [];
    allEmployees.forEach(emp => {
      const raw = emp.howDidYouHearAboutUs || "Unbekannt";
      if (raw.startsWith("Andere:")) {
        sourceStats["Andere"] = (sourceStats["Andere"] || 0) + 1;
        andereItems.push(raw.replace("Andere:", "").trim());
      } else {
        const key = raw || "Unbekannt";
        sourceStats[key] = (sourceStats[key] || 0) + 1;
      }
    });
    const chartData = Object.entries(sourceStats).map(([name, value]) => ({ name, value }));
    setSourceData(chartData);
    setAndereDetails(andereItems);
  }




  async function fetchWarnings() {
    try {
      const res = await fetch("/api/admin/rejection-warnings");
      const data = await res.json();
      setWarnings(data);
    } catch (err) {
    }
  }

  async function cancelVacation(id) {
  const res = await fetch(`/api/admin/vacations/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  alert(data.message || "Vacation cancelled");
}

async function reassignVacation(id) {
  const res = await fetch(`/api/admin/vacations/reassign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  alert(data.message || "Vacation reassigned");
}

async function getSuggestions(id) {
  const res = await fetch(`/api/admin/vacations/suggestions?vacationId=${id}`);
  const data = await res.json();
  alert("Suggested dates: " + JSON.stringify(data));
}
useEffect(() => {
  async function fetchConflicts() {
    const res = await fetch("/api/admin/vacations/conflicts");
    const data = await res.json();
  }
  fetchConflicts();
}, []);

const [cancelledAppointments, setCancelledAppointments] = useState([]);
useEffect(() => {
  async function fetchCancelledAppointments() {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      const cancelled = (data.schedules || []).filter(
        (s) => s.status === "cancelled"
      );
      setCancelledAppointments(cancelled);
    } catch (err) {
    }
  }
  fetchCancelledAppointments();
}, []);



function isThisWeek(date) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // e hënë
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
}

function isThisMonth(date) {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function isNextMonth(date) {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return date.getMonth() === nextMonth.getMonth() && date.getFullYear() === nextMonth.getFullYear();
}
// ✅ Move this near your other top-level async functions
async function fetchStats() {
  try {
    const res = await fetch("/api/admin/vouchers/status");
    if (!res.ok) throw new Error("Failed to fetch voucher stats");
    const data = await res.json();
    setStats(data);
  } catch (err) {
    setStats(null);
  }
}

function isThisYear(date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
}

  const appointmentsThisWeek = schedules.filter(
    (s) => s.date && isThisWeek(new Date(s.date))
  ).length;

  const appointmentsThisMonth = schedules.filter(
    (s) => s.date && isThisMonth(new Date(s.date))
  ).length;

  const appointmentsNextMonth = schedules.filter(
    (s) => s.date && isNextMonth(new Date(s.date))
  ).length;

  const appointmentsThisYear = schedules.filter(
    (s) => s.date && isThisYear(new Date(s.date))
  ).length;

 useEffect(() => {
    async function fetchApproved() {
      try {
        const res = await fetch("/api/employees/approved");
        if (!res.ok) throw new Error("Failed to fetch approved employees");
        const data = await res.json();
        setApprovedEmployees(data);
      } catch (error) {
      }
    }

    fetchApproved();
  }, []);
  
const [activityLogs, setActivityLogs] = useState([]);
const [activitySearch, setActivitySearch] = useState("");
const [stornierungSearch, setStornierungSearch] = useState("");
useEffect(() => {
  fetch("/api/admin/activity?limit=20")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setActivityLogs(data);
      } else if (Array.isArray(data.activity)) {
        setActivityLogs(data.activity);
      } else {
        setActivityLogs([]); // fallback bosh
      }
    })
    .catch(() => {});
}, []);
// Approve employee
async function handleApproval(emp) {
  try {
    const response = await fetch("/api/approve-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emp.email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      alert(`Fehler bei der Genehmigung: ${data.message || 'Unbekannter Fehler'}`);
      return;
    }
    
    alert(`✅ ${emp.firstName} ${emp.lastName} wurde genehmigt und die E-Mail wurde gesendet.`);
    
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: "approved" } : e))
    );
  } catch (error) {
    alert(`Fehler beim Genehmigen: ${error.message}`);
  }
}

// Reject employee
async function handleRejection(emp) {
  try {
    const response = await fetch("/api/reject-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emp.email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      alert(`Fehler bei der Ablehnung: ${data.message || 'Unbekannter Fehler'}`);
      return;
    }
    
    alert(`✅ ${emp.firstName} ${emp.lastName} wurde abgelehnt und die E-Mail wurde gesendet.`);
    
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: "rejected" } : e))
    );
  } catch (error) {
    alert(`Fehler beim Ablehnen: ${error.message}`);
  }
}
const employeeVacations = vacations.filter(v => v.employee);

// Invite employee
async function handleInvite(emp) {
  await fetch("/api/invite-employee", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: emp.email, firstName: emp.firstName }),
  });

  setEmployees((prev) =>
    prev.map((e) =>
      e.id === emp.id ? { ...e, invited: true } : e
    )
  );
}


  return (
    <AdminLayout>
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#0F1F38] text-white py-2 px-5 rounded-lg shadow-lg z-50 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="px-6 lg:px-8 py-6 space-y-8">

        {/* ── PAGE HEADER ── */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Übersicht aller Aktivitäten und Kennzahlen</p>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mitarbeiter</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{approvedEmployees.length}</p>
            <p className="text-xs text-gray-400 mt-1">Genehmigt</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kunden</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{clients.length}</p>
            <p className="text-xs text-gray-400 mt-1">Registriert</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Einnahmen (Monat)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">CHF {data.totalIncomeThisMonth.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Total: CHF {data.totalIncomeAllTime.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Termine diese Woche</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{appointmentsThisWeek}</p>
            <p className="text-xs text-gray-400 mt-1">Diesen Monat: {appointmentsThisMonth}</p>
          </div>
          <div className="bg-white rounded-xl border border-l-4 border-l-amber-400 border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bewerber</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{employees.filter(e => e.status === "pending").length}</p>
            <p className="text-xs text-gray-400 mt-1">Ausstehend</p>
          </div>
          <div className="bg-white rounded-xl border border-l-4 border-l-red-400 border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stornierungen</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{cancelledAppointments.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total storniert</p>
          </div>
        </div>

        {/* ── WARNINGS BANNER ── */}
        {warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Ablehnungs-Warnungen ({warnings.length})</p>
              <div className="mt-1.5 space-y-1">
                {warnings.slice(0, 3).map((w, i) => (
                  <p key={i} className="text-xs text-amber-700">{w.message || JSON.stringify(w)}</p>
                ))}
                {warnings.length > 3 && <p className="text-xs text-amber-600 font-medium">+{warnings.length - 3} weitere Warnungen</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── SECOND ROW: Activity + Cancellations + Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Aktivitätsprotokoll</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={activitySearch}
                onChange={e => setActivitySearch(e.target.value)}
                placeholder="Suchen…"
                className="w-full mb-3 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
              />
              <div className="overflow-y-auto max-h-64 space-y-3">
                {activityLogs.filter(log => {
                  if (!activitySearch.trim()) return true;
                  const q = activitySearch.toLowerCase();
                  const name = log.actorUser ? `${log.actorUser.firstName} ${log.actorUser.lastName}` : log.actorEmployee ? `${log.actorEmployee.firstName} ${log.actorEmployee.lastName}` : "";
                  return name.toLowerCase().includes(q) || log.action?.toLowerCase().includes(q);
                }).map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0F1F38]/10 text-[#0F1F38] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {log.actorUser ? log.actorUser.firstName?.[0] : log.actorEmployee ? log.actorEmployee.firstName?.[0] : "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-tight">
                        <span className="font-medium">
                          {log.actorUser ? `${log.actorUser.firstName} ${log.actorUser.lastName}` : log.actorEmployee ? `${log.actorEmployee.firstName} ${log.actorEmployee.lastName}` : "System"}
                        </span>{" "}
                        <span className="text-gray-500">{log.action}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(log.createdAt).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancellations */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Stornierungen</h3>
              {cancelledAppointments.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {cancelledAppointments.length}
                </span>
              )}
            </div>
            <div className="p-4">
              <input
                type="text"
                value={stornierungSearch}
                onChange={e => setStornierungSearch(e.target.value)}
                placeholder="Suchen…"
                className="w-full mb-3 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
              />
              <div className="overflow-y-auto max-h-64 space-y-2">
                {cancelledAppointments.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Keine Stornierungen</p>
                ) : (
                  cancelledAppointments.filter(s => {
                    if (!stornierungSearch.trim()) return true;
                    const q = stornierungSearch.toLowerCase();
                    const name = s.user ? `${s.user.firstName} ${s.user.lastName}` : "";
                    const emp = s.employee ? `${s.employee.firstName} ${s.employee.lastName}` : "";
                    return name.toLowerCase().includes(q) || emp.toLowerCase().includes(q);
                  }).map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-none">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {s.user ? `${s.user.firstName} ${s.user.lastName}` : "Unbekannter Kunde"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.date ? new Date(s.date).toLocaleDateString("de-CH") : s.day || "–"}
                          {s.employee ? ` · ${s.employee.firstName} ${s.employee.lastName}` : ""}
                        </p>
                      </div>
                      <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">storniert</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── CHARTS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Einnahmen pro Dienstleistung</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.incomePerService}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="serviceName" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const service = data.incomePerService.find(s => s.serviceName === label);
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow text-xs">
                        <p className="font-semibold mb-1">{label}</p>
                        <p>Diesen Monat: CHF {service.thisMonth.toFixed(2)}</p>
                        <p>Gesamt: CHF {service.allTime.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="thisMonth" fill="#22C55E" name="Diesen Monat" radius={[3,3,0,0]} />
                <Bar dataKey="allTime" fill="#3B82F6" name="Gesamt" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Kosten pro Dienstleistung</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.costPerService}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="serviceName" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const service = data.costPerService.find(s => s.serviceName === label);
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow text-xs">
                        <p className="font-semibold mb-1">{label}</p>
                        <p>Diesen Monat: CHF {service.thisMonth.toFixed(2)}</p>
                        <p>Gesamt: CHF {service.allTime.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="thisMonth" fill="#FBBF24" name="Diesen Monat" radius={[3,3,0,0]} />
                <Bar dataKey="allTime" fill="#EF4444" name="Gesamt" radius={[3,3,0,0]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white rounded-xl border border-gray-200">
          <Tab.Group>
            <div className="px-5 py-3 border-b border-gray-100 overflow-x-auto">
              <Tab.List className="flex gap-1 min-w-max">
                {[
                  "Übersicht",
                  "New Mitarbeiter",
                  "Bewerber",
                  "New Kunden",
                  "Einsätze",
                  "Finanzen",
                  "Systemwartung",
                  "Feedback Email",
                  "Email Vorlagen",
                  "Gutschein",
                  "Blogs",
                ].map((tabLabel) => (
                  <Tab
                    key={tabLabel}
                    className={({ selected }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition
                      ${selected ? "bg-[#0F1F38] text-white" : "text-gray-600 hover:bg-gray-100"}`
                    }
                  >
                    {tabLabel}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="p-6">
              {/* ── 1. Übersicht ── */}
              <Tab.Panel>
                <div className="space-y-6">
                  {/* Quick actions */}
                  <div className="flex flex-wrap gap-2">
                    <a href="/admin/newEmployee" className="flex items-center gap-2 px-4 py-2 bg-[#0F1F38] text-white rounded-lg text-sm font-medium hover:bg-[#1a3050] transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      Bewerber verwalten
                    </a>
                    <a href="/admin/einsaetze" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Einsätze
                    </a>
                    <a href="/admin/finanzen" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Finanzen
                    </a>
                    <a href="/api/admin/export/clients" download className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Kunden CSV
                    </a>
                    <a href="/api/admin/export/employees" download className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Mitarbeiter CSV
                    </a>
                  </div>

                  {/* Upcoming appointments */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Nächste Termine</h3>
                      <span className="text-xs text-gray-400">{appointmentsThisWeek} diese Woche · {appointmentsNextMonth} nächsten Monat</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {schedules
                        .filter(s => s.date && new Date(s.date) >= new Date() && s.status !== "cancelled")
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(0, 8)
                        .map(s => (
                          <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {s.user ? `${s.user.firstName} ${s.user.lastName}` : "—"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(s.date).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" })}
                                {s.startTime ? ` · ${s.startTime}` : ""}
                                {s.hours ? ` · ${s.hours}h` : ""}
                                {s.serviceName ? ` · ${s.serviceName}` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {s.employee ? (
                                <span className="text-xs text-gray-500">{s.employee.firstName} {s.employee.lastName}</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">Kein Mitarbeiter</span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border
                                ${s.status === "active" ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : s.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                {s.status || "pending"}
                              </span>
                            </div>
                          </div>
                        ))}
                      {schedules.filter(s => s.date && new Date(s.date) >= new Date() && s.status !== "cancelled").length === 0 && (
                        <p className="px-5 py-8 text-sm text-gray-400 text-center">Keine bevorstehenden Termine</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <DashboardCard title="Aktive Kunden">
                      <ActiveClients clients={clients} />
                    </DashboardCard>
                    <DashboardCard title="Zuweisungen">
                      <EmployeesOnAssignment employees={employees} />
                    </DashboardCard>
                    <DashboardCard title="Termine">
                      <AppointmentCalendar schedules={schedules} />
                    </DashboardCard>
                  </div>
                </div>
              </Tab.Panel>

              {/* ── 2. New Mitarbeiter ── */}
              <Tab.Panel>
                <Mitarbeiter />
              </Tab.Panel>

              {/* ── 3. Bewerber ── */}
              <Tab.Panel>
                <BewerberTab
                  employees={employees}
                  onApprove={handleApproval}
                  onReject={handleRejection}
                  onInvite={handleInvite}
                  router={router}
                />
              </Tab.Panel>

              {/* ── 4. New Kunden ── */}
              <Tab.Panel>
                <Kunden />
              </Tab.Panel>

              {/* ── 5. Einsätze ── */}
              <Tab.Panel>
                <Einsaetze />
              </Tab.Panel>

              {/* ── 6. Finanzen ── */}
              <Tab.Panel>
                <Finanzen />
              </Tab.Panel>

              {/* ── 7. Systemwartung ── */}
              <Tab.Panel>
                <SystemwartungTab />
              </Tab.Panel>

              {/* ── 8. Feedback Email ── */}
              <Tab.Panel>
                <FeedbackEmailTab />
              </Tab.Panel>

              {/* ── 9. Email Vorlagen ── */}
              <Tab.Panel>
                <EmailTemplatesAdmin />
              </Tab.Panel>

              {/* ── 10. Gutschein ── */}
              <Tab.Panel>
                <GutscheinTab />
              </Tab.Panel>

              {/* ── 11. Blogs ── */}
              <Tab.Panel>
                <BlogsTab />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

      </div>
    </AdminLayout>
  );
}