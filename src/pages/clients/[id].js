import { useRouter } from "next/router";
import { useState, useEffect } from "react";

// Define the ClientDetails component
export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;  // Get the client ID from the URL
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchClientDetails() {
        try {
          const res = await fetch(`/api/clients/${id}`); // Fetch client details using the ID
          if (!res.ok) {
            throw new Error('Failed to fetch client details');
          }
          const data = await res.json();
          setClient(data);  // Set the client data once fetched
        } catch (error) {
          setClient(null);  // If error occurs, set client to null
        } finally {
          setLoading(false);
        }
      }

      fetchClientDetails();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>; // Show loading state while fetching
  }

  if (!client) {
    return <p>Client not found or failed to load data.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-[120px]">
    <h1 className="text-3xl font-semibold text-[#04436F] mb-6">Client Details</h1>
    
    {/* Client Info */}
    <div className="space-y-4">
      <p className="text-lg">
        <strong className="font-medium">Name:</strong> {client.firstName} {client.lastName}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Email:</strong> {client.email}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Phone:</strong> {client.phone || "N/A"}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Address:</strong> {client.address || "N/A"}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Service:</strong> {client.service || "N/A"}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Sub-Service:</strong> {client.subService || "N/A"}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Frequency:</strong> {client.frequency || "N/A"}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Time Window:</strong> {client.timeWindow || "N/A"}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Created At:</strong> {new Date(client.createdAt).toLocaleString()}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Updated At:</strong> {new Date(client.updatedAt).toLocaleString()}
      </p>
      <p className="text-lg">
        <strong className="font-medium">Reset Token:</strong> {client.resetToken || "N/A"}
      </p>
    </div>
  
    {/* Health Questions Section */}
    {client.healthQuestion && (
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-[#04436F] mb-4">Health Questions</h2>
        <p className="text-lg">
          <strong className="font-medium">Allergies:</strong> {client.healthQuestion.allergies || "N/A"}
        </p>
        <p className="text-lg">
          <strong className="font-medium">Special Requests:</strong> {client.healthQuestion.specialRequests || "N/A"}
        </p>
      </div>
    )}
  </div>
  
  );
}
