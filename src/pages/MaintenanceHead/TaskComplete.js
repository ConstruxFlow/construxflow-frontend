import { CheckCircle, User } from "lucide-react";
import { useState } from "react";
import NavBar from "../../components/NavBar";

export default function TaskCompleteContainer() {
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
    
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Success Banner */}
        <div className="bg-[#EFC11A] rounded-lg flex flex-col items-center justify-center py-8 mb-8">
          <CheckCircle className="w-10 h-10 text-[#236571] mb-2" />
          <h2 className="text-xl font-semibold text-[#236571] mb-1">Task Completed Successfully</h2>
          <div className="text-gray-800 text-sm">Completed on December 20, 2024 at 3:45 PM</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Request Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="font-semibold text-[#236571] mb-3">Request Summary</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Request ID:</div>
                  <div className="font-medium text-gray-900">MR-2024-001</div>
                </div>
                <div>
                  <div className="text-gray-500">Equipment Name:</div>
                  <div className="font-medium text-gray-900">Building A - Floor 3 - Room 301</div>
                </div>
                <div>
                  <div className="text-gray-500">Category:</div>
                  <div className="font-medium text-gray-900">Plumbing</div>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="font-semibold text-[#236571] mb-3">Status Update</div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Previous Status:</div>
                  <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium mt-1">
                    High Priority - Plumbing Issue
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Current Status:</div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#EFC11A] text-yellow-900 text-xs font-medium mt-1">
                    Operational - Active
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="font-semibold text-[#236571] mb-3">Completion Details</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#236571] flex items-center justify-center text-white font-bold text-base">
                  JS
                </div>
                <div className="font-medium text-gray-900 text-sm">John Smith</div>
                <span className="text-xs text-gray-500">Assigned Technician</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-sm">
                <div>
                  <div className="text-gray-500">Actual Duration:</div>
                  <div className="font-medium text-gray-900">
                    1.5 hours <span className="text-gray-500 text-xs">(Expected: 1-2 hours)</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Materials Used:</div>
                  <ul className="list-disc ml-5 text-gray-900">
                    <li>Pipe fitting (2x)</li>
                    <li>Plumber’s tape (1 roll)</li>
                    <li>Pipe sealant (1 tube)</li>
                  </ul>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-gray-500 text-sm mb-1">Work Performed:</div>
                <div className="text-gray-900 text-sm">
                  Replaced faulty pipe connection under sink. Tested water pressure and flow. Applied new sealant and verified no leaks. System fully operational.
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="text-gray-500 text-sm">Quality Check:</div>
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Passed</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Equipment Status Updated */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-[#236571]">Equipment Status Updated</div>
                <span className="px-3 py-1 rounded-full bg-[#236571] text-white text-xs font-medium">Operational</span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <div className="flex justify-between">
                  <span>Next Maintenance:</span>
                  <span className="font-medium">June 20, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspection Due:</span>
                  <span className="font-medium">March 20, 2025</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button className="w-full bg-[#EFC11A] hover:bg-yellow-400 text-[#236571] font-semibold rounded-md py-2 transition">Generate Work Report</button>
              <button className="w-full bg-[#236571] hover:bg-[#17484b] text-white font-semibold rounded-md py-2 transition">Schedule Follow-up</button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-md py-2 transition">Close Request</button>
              <button className="w-full border border-gray-400 text-gray-800 font-semibold rounded-md py-2 transition">Return to Dashboard</button>
            </div>

            {/* Recommended Actions */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="font-semibold text-gray-600 mb-2">Recommended Actions</div>
              <div className="bg-white rounded mb-2 p-3 shadow-sm">
                <div className="font-semibold text-gray-800 text-sm">Preventive Maintenance</div>
                <div className="text-xs text-gray-600">Schedule quarterly plumbing inspection for Building A</div>
              </div>
              <div className="bg-white rounded p-3 shadow-sm">
                <div className="font-semibold text-gray-800 text-sm">Related Equipment</div>
                <div className="text-xs text-gray-600">Check adjacent rooms 300 and 302 for similar issues</div>
              </div>
            </div>

            {/* Notifications Sent */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="font-semibold text-gray-600 mb-2">Notifications Sent</div>
              <div className="flex flex-col gap-1 text-sm text-gray-800">
                <div className="flex items-center gap-2">
                  <span>Facility Manager</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Inventory Manager</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Requesting Department</span>
                  <span className="text-green-600">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
