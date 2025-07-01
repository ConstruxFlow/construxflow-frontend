import { useState } from "react";
import { Camera, User, Mail, Lock } from "lucide-react";
import NavBar from "../../components/NavBar";

export default function ProfileManagement() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [showTeam, setShowTeam] = useState(false);
  return (

    <>
    <NavBar
      links={[
          { name: "Dashboard", href: "#" },
          { name: "Task", href: "#" },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" },
          { name: "Request Tracker", href: "#" },
        ]}
        showButton={true}
    />
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Management</h1>
        <p className="text-gray-600 mb-8">Manage your personal information and account settings.</p>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-full max-w-xs">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-[#236571] object-cover"
                />
                <label className="absolute bottom-2 right-2 bg-[#EFC11A] p-1 rounded-full cursor-pointer border-2 border-white shadow">
                  <Camera className="w-5 h-5 text-[#236571]" />
                  <input type="file" className="hidden" />
                </label>
              </div>
              <button className="w-full bg-[#236571] hover:bg-[#17484b] text-white font-semibold rounded-md py-2 mb-1 transition">
                <span className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4" /> Upload New Photo
                </span>
              </button>
              <button className="w-full text-red-500 hover:underline text-sm font-medium mt-1">
                Remove Photo
              </button>
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="font-semibold text-gray-700 mb-3">Quick Actions</div>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center gap-2 text-[#236571] cursor-pointer hover:underline">
                  <Lock className="w-4 h-4" /> Change Password
                </li>
                <li className="flex items-center gap-2 text-[#236571] cursor-pointer hover:underline">
                  <Mail className="w-4 h-4" /> Notification Settings
                </li>
                <li className="flex items-center gap-2 text-[#236571] cursor-pointer hover:underline">
                  <User className="w-4 h-4" /> Privacy Settings
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Personal Info */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    defaultValue="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    defaultValue="Smith"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    defaultValue="john.smith@company.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    defaultValue="Maintenance Head"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white">
                    <option>Warehouse</option>
                    <option>Procurement</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    rows={2}
                    defaultValue="123 Business Ave, Suite 100
City, State 12345"
                  />
                </div>
              </div>
              {/* Notification Preferences */}
              <div className="mt-6">
                <div className="font-semibold text-gray-900 mb-2">Notification Preferences</div>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-800">Email Notifications</div>
                        <div className="text-xs text-gray-500">Receive updates about orders and system changes</div>
                      </div>
                      <button
                        type="button"
                        className={`w-11 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-200 ${emailNotifications ? "bg-[#EFC11A]" : ""}`}
                        onClick={() => setEmailNotifications((v) => !v)}
                        aria-pressed={emailNotifications}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transform duration-200 ${emailNotifications ? "translate-x-5" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-800">Weekly Reports</div>
                        <div className="text-xs text-gray-500">Receive weekly procurement summaries</div>
                      </div>
                      <button
                        type="button"
                        className={`w-11 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-200 ${weeklyReports ? "bg-[#EFC11A]" : ""}`}
                        onClick={() => setWeeklyReports((v) => !v)}
                        aria-pressed={weeklyReports}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transform duration-200 ${weeklyReports ? "translate-x-5" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Save/Cancel Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 font-medium bg-white hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button className="px-6 py-2 rounded-md bg-[#EFC11A] hover:bg-yellow-400 text-yellow-900 font-semibold transition">
                  Save Changes
                </button>
              </div>
            </div>
            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="font-semibold text-gray-900 mb-4">Change Password</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white" />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 rounded-md bg-[#236571] hover:bg-[#17484b] text-white font-semibold transition">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
