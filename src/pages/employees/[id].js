export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      async function fetchEmployee() {
        try {
          const res = await fetch(`/api/employees/${id}`);
          if (!res.ok) throw new Error("Error fetching employee details");
          const data = await res.json();
          setEmployee(data);
        } catch (error) {
          setError("Failed to fetch employee details");
        } finally {
          setLoading(false);
        }
      }
      fetchEmployee();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!employee) return <div>Employee not found</div>;

  // helpers to ensure values are safe to render
  const safeText = (val, fallback = "N/A") =>
    typeof val === "string" || typeof val === "number" ? val : fallback;

  return (
    <div className="mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-semibold text-[#04436F]">Employee Details</h1>

      <div className="mt-6 space-y-2">
        <p><strong>Name:</strong> {safeText(employee.firstName)} {safeText(employee.lastName)}</p>
        <p><strong>Email:</strong> {safeText(employee.email)}</p>
        <p><strong>Phone:</strong> {safeText(employee.phone)}</p>
        <p><strong>Address:</strong> {safeText(employee.address)}</p>
        <p><strong>Experience (Years):</strong> {safeText(employee.experienceYears)}</p>
        <p><strong>Status:</strong> {safeText(employee.status)}</p>
        <p><strong>Availability From:</strong> {safeText(employee.availabilityFrom)}</p>
        <p><strong>How Far Can You Travel:</strong> {safeText(employee.howFarCanYouTravel)}</p>

        <p>
          <strong>Resume:</strong>{" "}
          <a
            href={typeof employee.resumeUrl === "string" ? employee.resumeUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </a>
        </p>

        <p>
          <strong>Photo:</strong>{" "}
          {typeof employee.photoUrl === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={employee.photoUrl}
              alt="Employee photo"
              className="w-32 h-32 rounded-full"
            />
          ) : (
            "N/A"
          )}
        </p>

        {employee.healthQuestion && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Health Questions</h2>
            <p><strong>Allergies:</strong> {safeText(employee.healthQuestion.allergies)}</p>
            <p><strong>Special Requests:</strong> {safeText(employee.healthQuestion.specialRequests)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
