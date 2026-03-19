export default function PersonalInfoCard({ userData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-2">
      <h2 className="text-xl font-semibold text-[#B99B5F]">Personal Information</h2>
      <p><strong>Name:</strong> {userData.fullName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
      <p><strong>Address:</strong> {userData.address}</p>
    </div>
  );
}
