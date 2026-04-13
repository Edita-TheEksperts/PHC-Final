import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import EmployeeTable from "../../components/EmployeeTable";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Fetch all employees
  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setEmployees(data.employees || []);
    }
    fetchEmployees();
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

  // Add employee
  async function handleAddEmployee(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/add-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    });

    const data = await res.json();
    if (data.success) {
      setEmployees((prev) => [...prev, data.employee]); // add to list
      setNewEmployee({ firstName: "", lastName: "", email: "" }); // reset
    } else {
      alert("Fehler beim Hinzufügen des Mitarbeiters");
    }
  }

  return (
    <AdminLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Mitarbeiter</h1>
            <p className="text-sm text-gray-500 mt-0.5">Alle genehmigten Mitarbeiter</p>
          </div>
          <a
            href="/api/admin/export/employees"
            download
            className="flex items-center gap-2 px-4 py-2 bg-[#04436F] text-white rounded-lg text-sm font-medium hover:bg-[#033558] transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV exportieren
          </a>
        </div>
        <EmployeeTable
          employees={employees}
          onApprove={handleApproval}
          onReject={handleRejection}
          onInvite={handleInvite}
        />
      </div>
    </AdminLayout>
  );
}
