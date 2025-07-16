// src/components/MaintenanceRequestDetails.js
import React from 'react';
import { FaCalendarAlt, FaExclamationCircle, FaMapMarkerAlt, FaTools } from 'react-icons/fa';

const MaintenanceRequestDetails = ({ request }) => {
  return (
    <div className="bg-[#FCFCFC] p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-[#236571] mb-2">Maintenance Request Details</h2>
      <p className="text-[#2E2F34] mb-4 text-sm">Review and manage material requests for maintenance operations</p>

      {/* Maintenance Information */}
      <div className="bg-white border border-[#E4E4E4] p-6 rounded-lg mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="text-[#2E2F34] text-sm font-medium mb-1 block">Equipment Name</label>
            <input
              type="text"
              readOnly
              value={request.equipmentName}
              className="w-full bg-white border border-[#E4E4E4] px-4 py-2 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="text-[#2E2F34] text-sm font-medium mb-1 block">Requested By</label>
            <input
              type="text"
              readOnly
              value={request.requestedBy}
              className="w-full bg-white border border-[#E4E4E4] px-4 py-2 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="text-[#2E2F34] text-sm font-medium mb-1 block">Scheduled Date & Time</label>
            <div className="w-full flex items-center gap-2 bg-white border border-[#E4E4E4] px-4 py-2 rounded-md shadow-sm">
              <FaCalendarAlt className="text-[#236571]" />
              <span>{request.schedule}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[#2E2F34] text-sm font-medium mb-1 block">Priority Level</label>
            <div className="w-full flex items-center gap-2 bg-white border border-[#E4E4E4] px-4 py-2 rounded-md shadow-sm">
              <FaExclamationCircle className="text-yellow-500" />
              <span className="text-yellow-700 font-semibold">{request.priority}</span>
            </div>
          </div>

          <div className="md:col-span-2 mb-4">
            <label className="text-[#2E2F34] text-sm font-medium mb-1 block">Availability Status</label>
            <div className="w-full flex items-center gap-2 bg-white border border-[#E4E4E4] px-4 py-2 rounded-md shadow-sm">
              <FaMapMarkerAlt className="text-[#236571]" />
              <span>{request.availability}</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-[#2E2F34] text-sm font-medium mb-1 block">Comments</label>
            <textarea
              rows={3}
              defaultValue={request.comments}
              className="w-full bg-white border border-[#E4E4E4] px-4 py-2 rounded-md shadow-sm"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Requested Materials */}
      <div className="bg-white border border-[#E4E4E4] p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold text-[#2E2F34] mb-4 flex items-center gap-2">
          <FaTools className="text-[#236571]" /> Requested Materials
        </h3>
        {request.materials.map((mat, index) => (
          <div key={index} className="bg-[#F9F9F9] p-4 rounded-md border border-[#E4E4E4] mb-4">
            <p className="font-semibold text-[#191919]">{mat.name}</p>
            <p className="text-sm text-gray-600">{mat.desc}</p>
            <p className="text-sm mt-1">Qty: {mat.qty} | In Stock: {mat.stock}</p>
            {mat.notes && <p className="text-xs text-gray-500 mt-1 italic">Notes: {mat.notes}</p>}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="bg-[#efc11a] px-6 py-2 text-white rounded hover:opacity-90">✔ Approve Request</button>
        <button className="bg-[#E4E4E4] px-6 py-2 text-[#2E2F34] rounded hover:bg-[#d5d5d5]">✖ Reject Request</button>
        <button className="bg-[#236571] px-6 py-2 text-white rounded hover:opacity-90">Update Inventory</button>
      </div>
    </div>
  );
};

export default MaintenanceRequestDetails;