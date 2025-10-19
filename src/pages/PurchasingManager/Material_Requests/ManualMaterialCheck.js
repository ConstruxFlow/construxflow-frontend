import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../../components/NavBar";

const ManualMaterialCheck = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requestData, setRequestData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [checkResult, setCheckResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch request details
  const fetchRequest = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/material-requests/find/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRequestData(data);
      } else {
        toast.error("Failed to fetch request data");
      }
    } catch (err) {
      toast.error("Network error fetching request");
    }
  };

  // Fetch project details
  const fetchProject = async (projectId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProjectData(data);
      } else {
        toast.error("Failed to fetch project data");
      }
    } catch (err) {
      toast.error("Network error fetching project");
    }
  };

  // Perform the comparison check
  const performCheck = () => {
    if (!requestData || !projectData || !projectData.phases || !requestData.requestedMaterials) {
      setCheckResult("Insufficient data for comparison.");
      return;
    }

    const allWithinLimits = requestData.requestedMaterials.every((requestedMat) => {
      return projectData.phases.some((phase) =>
        phase.materials.some((phaseMat) => {
          return (
            phaseMat.materialName === requestedMat.materialName &&
            (phaseMat.materialType ?? "") === (requestedMat.materialType ?? "") &&
            requestedMat.unitPrice <= phaseMat.rate &&
            requestedMat.quantity <= phaseMat.quantity
          );
        })
      );
    });

    if (allWithinLimits) {
      setCheckResult(
        "RESULT: All requested materials are within the project phase material limits."
      );
    } else {
      setCheckResult(
        "RESULT: Some requested materials exceed the project phase material limits."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchRequest();
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (requestData?.projectId) {
      fetchProject(requestData.projectId);
    }
  }, [requestData]);

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        profileURL="/purchasing/profile"
        links={[
          { name: "Dashboard", path: "/purchasing/dashboard" },
          { name: "Material Requests", path: "/purchasing/materialrequests/overview" },
          { name: "Suppliers", path: "/purchasing/supplier/dashboard" },
          { name: "Quotation Requests", path: "/purchasing/quotationrequest/overview" },
          { name: "Purchasing Orders", path: "/purchasing/orders/overview" },
        ]}
      />

      <main className="py-6">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10">
          <h1 className="text-2xl font-bold mb-6 text-main_dark">
            Manual Material Limit Check
          </h1>

          {isLoading && (
            <p className="text-gray-600">Loading data...</p>
          )}

          {requestData && projectData ? (
            <>
              <div className="mb-6 p-6 bg-purewhite border border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-main_dark">
                  Request Details
                </h2>
                <p className="mb-1 font-medium text-slatebluegray">Request ID: {requestData.requestId}</p>
                <p className="font-medium text-slatebluegray">Project: {requestData.projectName} ({requestData.projectId})</p>
              </div>

              <div className="mb-6 p-6 bg-purewhite border border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-main_dark">
                  Project Phases & Materials
                </h2>
                {projectData.phases.map((phase) => (
                  <div key={phase.phaseId} className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <h3 className="mb-2 font-semibold text-slatebluegray">{phase.phaseName}</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {phase.materials.map((mat) => (
                        <li key={mat.materialId}>
                          {mat.materialName} | Type: {mat.materialType || "-"} | Rate: LKR {mat.rate} | Qty: {mat.quantity} {mat.unitOfMeasurement || ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-6 p-6 bg-purewhite border border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-main_dark">
                  Requested Materials
                </h2>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {requestData.requestedMaterials.map((mat) => (
                    <li key={mat.requestedMaterialId}>
                      {mat.materialName} | Type: {mat.materialType || "-"} | Unit Price: LKR {mat.unitPrice} | Quantity: {mat.quantity} {mat.unitOfMeasurement || ""}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={performCheck}
                className="mb-6 px-6 py-3 bg-deep_green hover:bg-deep_green/90 text-purewhite font-semibold rounded-md transition-colors"
              >
                Check If Within Limits
              </button>

              {checkResult && (
                <div
                  className={`p-5 rounded-md border ${
                    checkResult.startsWith("RESULT: All")
                      ? "bg-green-100 border-green-400 text-green-800"
                      : "bg-red-100 border-red-400 text-red-800"
                  }`}
                >
                  {checkResult}
                </div>
              )}
            </>
          ) : (
            !isLoading && <p className="text-gray-600">No data available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManualMaterialCheck;
