import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Example: get the user name from localStorage after login
    const storedName = localStorage.getItem("name") || "User";
    setUserName(storedName);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#04436F] text-white p-6">
        <h1 className="text-2xl font-semibold">PHC</h1>
        <div className="mt-10 space-y-6">
          <a href="#" className="block text-white">Dashboard</a>
          <a href="#" className="block text-white">Jobs</a>
          <a href="#" className="block text-white">Applications</a>
          <a href="#" className="block text-white">My Profile</a>
          <a href="#" className="block text-white">Statistics</a>
          <a href="#" className="block text-white">Companies</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#04436F]">
              Welcome, {userName}!
            </h1>
            <p className="text-gray-500">SuperAdmin Dashboard</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-gray-600">26</div>
            <div className="text-gray-600">4</div>
            <div className="text-gray-600">15</div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* First Stats Card */}
          <div className="flex flex-col bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-3xl font-semibold text-[#04436F]">342</h2>
            <p className="text-gray-500">Interview Schedules</p>
            <div className="flex justify-between items-center mt-6">
              <div className="text-green-500">+0.5%</div>
              <div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center">
                <span className="text-lg">📈</span>
              </div>
            </div>
          </div>

          {/* Second Stats Card */}
          <div className="flex flex-col bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-3xl font-semibold text-[#04436F]">984</h2>
            <p className="text-gray-500">Application Sent</p>
            <div className="flex justify-between items-center mt-6">
              <div className="text-green-500">+0.5%</div>
              <div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center">
                <span className="text-lg">📩</span>
              </div>
            </div>
          </div>

          {/* Third Stats Card */}
          <div className="flex flex-col bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-3xl font-semibold text-[#04436F]">1,567k</h2>
            <p className="text-gray-500">Profile Viewed</p>
            <div className="flex justify-between items-center mt-6">
              <div className="text-red-500">-2.0%</div>
              <div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center">
                <span className="text-lg">👀</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vacancy Stats and Graph */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#04436F]">Vacancy Stats</h2>
          <div className="flex justify-end space-x-4 my-4">
            <button className="bg-[#FA5C5C] text-white py-2 px-4 rounded-full">Monthly</button>
            <button className="bg-gray-300 text-black py-2 px-4 rounded-full">Weekly</button>
            <button className="bg-gray-300 text-black py-2 px-4 rounded-full">Daily</button>
          </div>
          {/* Insert your chart here */}
          <div></div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#04436F]">Recent Activity</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-500">Bubles Studios have 5 available positions for you</p>
              <span className="text-gray-500">8 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500">Electra Studios has invited you to interview meeting tomorrow</p>
              <span className="text-gray-500">8 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500">Highspeed Design Team have 2 available positions for you</p>
              <span className="text-gray-500">8 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
