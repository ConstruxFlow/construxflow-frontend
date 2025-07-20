// src/components/InventoryManager/forms/ViewScheduleForm.js
import React from 'react';

const ViewScheduleForm = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto">
    
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">Equipment</label>
        
            <input type="text" placeholder="Tower Crane TC-400" className="w-full border border-[#E4E4E4] rounded p-2" />
            
            
        </div>

        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">From Date</label>
          <input type="text" placeholder="12/12/2024" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">To Date</label>
          <input type="text" placeholder="12/12/2024" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

<div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">Loaction</label>
          <input type="text" placeholder="Site A" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        
      </form>
    </div>
  );
};

export default ViewScheduleForm;




// import React, { useState } from 'react';
// import { Calendar, MapPin, Settings, Eye, Search, Filter } from 'lucide-react';

// const ViewScheduleForm = () => {
//   const [formData, setFormData] = useState({
//     equipment: 'Tower Crane TC-400',
//     fromDate: '2024-12-12',
//     toDate: '2024-12-12',
//     location: 'Site A'
//   });

//   const [scheduleData] = useState([
//     {
//       id: 1,
//       date: '2024-12-12',
//       time: '08:00 - 16:00',
//       operator: 'John Smith',
//       status: 'Active',
//       project: 'Building A Construction',
//       notes: 'Regular operation'
//     },
//     {
//       id: 2,
//       date: '2024-12-13',
//       time: '09:00 - 17:00',
//       operator: 'Mike Johnson',
//       status: 'Scheduled',
//       project: 'Foundation Work',
//       notes: 'Maintenance check required'
//     },
//     {
//       id: 3,
//       date: '2024-12-14',
//       time: '07:00 - 15:00',
//       operator: 'Sarah Wilson',
//       status: 'Scheduled',
//       project: 'Steel Frame Installation',
//       notes: 'Weather dependent'
//     }
//   ]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Active':
//         return 'bg-green-100 text-green-800';
//       case 'Scheduled':
//         return 'bg-web_yellow/20 text-web_yellow';
//       case 'Completed':
//         return 'bg-deep_green/10 text-deep_green';
//       case 'Cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-main_dark mb-2">View Equipment Schedule</h1>
//         <p className="text-slatebluegray text-base">Monitor and track equipment scheduling across your projects</p>
//       </div>

//       {/* Filter Form */}
//       <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
//         <div className="flex items-center gap-3 mb-6">
//           <h2 className="text-lg font-semibold text-main_dark">Schedule Filters</h2>
//         </div>
        
//         <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-slatebluegray mb-2">
//               Equipment
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="equipment"
//                 value={formData.equipment}
//                 onChange={handleInputChange}
//                 placeholder="Enter equipment name"
//                 className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
//               />
//               <Settings className="absolute left-3 top-3.5 w-4 h-4 text-deep_green" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slatebluegray mb-2">
//               From Date
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 name="fromDate"
//                 value={formData.fromDate}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
//               />
//               <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-deep_green" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slatebluegray mb-2">
//               To Date
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 name="toDate"
//                 value={formData.toDate}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
//               />
//               <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-deep_green" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slatebluegray mb-2">
//               Location
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 placeholder="Enter location"
//                 className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
//               />
//               <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-deep_green" />
//             </div>
//           </div>
//         </form>

//         <div className="flex gap-3 mt-6">
//           <button className="bg-deep_green hover:bg-deep_green/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2">
//             <Search className="w-4 h-4" />
//             Search Schedule
//           </button>
//           <button className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2">
//             <Filter className="w-4 h-4" />
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Schedule Results */}
//       <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-main_dark">Schedule Results</h2>
//             <span className="text-sm text-slatebluegray bg-light_gray/40 px-3 py-1 rounded-full">
//               {scheduleData.length} schedules found
//             </span>
//           </div>
//         </div>

//         {/* Desktop Table View */}
//         <div className="hidden lg:block overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slatebluegray uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slatebluegray uppercase tracking-wider">Time</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slatebluegray uppercase tracking-wider">Operator</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slatebluegray uppercase tracking-wider">Project</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slatebluegray uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slatebluegray uppercase tracking-wider">Notes</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {scheduleData.map((schedule) => (
//                 <tr key={schedule.id} className="hover:bg-gray-50 transition-colors duration-150">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-deep_green" />
//                       <span className="text-sm font-medium text-main_dark">{schedule.date}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slatebluegray">
//                     {schedule.time}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-main_dark">{schedule.operator}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-slatebluegray">{schedule.project}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
//                       {schedule.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slatebluegray">
//                     {schedule.notes}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile Card View */}
//         <div className="lg:hidden divide-y divide-gray-200">
//           {scheduleData.map((schedule) => (
//             <div key={schedule.id} className="p-6">
//               <div className="flex justify-between items-start mb-3">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4 text-deep_green" />
//                   <h3 className="font-semibold text-main_dark">{schedule.date}</h3>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
//                   {schedule.status}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mb-3">
//                 <div>
//                   <label className="text-xs text-slatebluegray font-medium">Time</label>
//                   <p className="text-sm text-main_dark">{schedule.time}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs text-slatebluegray font-medium">Operator</label>
//                   <p className="text-sm text-main_dark">{schedule.operator}</p>
//                 </div>
//               </div>
              
//               <div className="mb-3">
//                 <label className="text-xs text-slatebluegray font-medium">Project</label>
//                 <p className="text-sm text-main_dark">{schedule.project}</p>
//               </div>
              
//               <div>
//                 <label className="text-xs text-slatebluegray font-medium">Notes</label>
//                 <p className="text-sm text-slatebluegray">{schedule.notes}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewScheduleForm;
