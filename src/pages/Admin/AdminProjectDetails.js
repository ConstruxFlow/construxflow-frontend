import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClipboardList,
  FaDownload,
  FaFileContract,
  FaChartPie,
  FaTable,
  FaUsers,
  FaTools,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBuilding,
  FaPercentage,
  FaLayerGroup,
  FaCube,
  FaBalanceScale,
  FaFileInvoiceDollar,
  FaLock,
  FaPlay,
  FaPause,
  FaStop,
  FaShoppingCart,
  FaEquals,
  FaPrint,
  FaFileAlt,
  FaBarChart,
  FaInfoCircle,
  FaTachometerAlt,
  FaEye,
} from "react-icons/fa";
import { IoIosTrendingUp, IoIosTrendingDown } from "react-icons/io";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import LoadingOverlay from "../../components/LoadingOverlay";

const AdminProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  // Phase status options for display only
  const phaseStatusOptions = [
    {
      value: "",
      label: "Not Started",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
    {
      value: "In Progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "Complete",
      label: "Complete",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "On Hold",
      label: "On Hold",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      value: "Delayed",
      label: "Delayed",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchProjectOrders();
    }
  }, [projectId]);

  // Fetch purchase orders for the project
  const fetchProjectOrders = async () => {
    if (!projectId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/purchasingorder/project/${projectId}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setPurchaseOrders(data.data || []);
      } else {
        toast.error("Failed to fetch project orders");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch project orders");
      console.error("Error fetching project orders:", error);
    }
  };

  // Calculate total actual spent from purchase orders
  const getTotalActualSpent = () => {
    if (!purchaseOrders || purchaseOrders.length === 0) return 0;
    return purchaseOrders.reduce((total, order) => {
      return total + (order?.subTotal || 0);
    }, 0);
  };

  // Calculate actual spent by material/phase
  const getActualSpentByMaterial = () => {
    if (!purchaseOrders || purchaseOrders.length === 0) return {};

    const spentByMaterial = {};

    purchaseOrders.forEach((order) => {
      if (order?.materials && Array.isArray(order.materials)) {
        order.materials.forEach((material) => {
          if (material?.material?.materialName) {
            const materialName = material.material.materialName;
            if (!spentByMaterial[materialName]) {
              spentByMaterial[materialName] = {
                actualSpent: 0,
                actualQuantity: 0,
                orders: [],
              };
            }
            spentByMaterial[materialName].actualSpent += material.cost || 0;
            spentByMaterial[materialName].actualQuantity +=
              material.quantity || 0;
            spentByMaterial[materialName].orders.push({
              orderNumber: order?.ponumber || "",
              quantity: material.quantity || 0,
              cost: material.cost || 0,
              supplier: order?.supplier?.name || "",
              orderDate: order?.orderDate || "",
            });
          }
        });
      }
    });

    return spentByMaterial;
  };

  // Calculate project cost variance
  const getCostVariance = () => {
    const totalEstimated = calculateProjectBudget() || 0;
    const totalActual = getTotalActualSpent() || 0;
    const variance = totalActual - totalEstimated;
    const variancePercentage =
      totalEstimated > 0 ? (variance / totalEstimated) * 100 : 0;

    return {
      estimated: totalEstimated,
      actual: totalActual,
      variance: variance,
      variancePercentage: variancePercentage,
      status: variance > 0 ? "over" : variance < 0 ? "under" : "ontrack",
    };
  };

  // Predict final project cost
  const getPredictedFinalCost = () => {
    const overallProgress = getOverallProgress() || 0;
    const actualSpent = getTotalActualSpent() || 0;
    const estimatedTotal = calculateProjectBudget() || 0;

    if (overallProgress === 0 || actualSpent === 0) {
      return {
        predicted: estimatedTotal,
        variance: 0,
        variancePercentage: 0,
      };
    }

    const burnRate = actualSpent / overallProgress;
    const predictedFinalCost = burnRate * 100;

    return {
      predicted: predictedFinalCost || estimatedTotal,
      variance: (predictedFinalCost || estimatedTotal) - estimatedTotal,
      variancePercentage:
        estimatedTotal > 0
          ? (((predictedFinalCost || estimatedTotal) - estimatedTotal) /
              estimatedTotal) *
            100
          : 0,
    };
  };

  // Get phase cost analysis
  const getPhasesCostAnalysis = () => {
    if (!project || !project.phases || !Array.isArray(project.phases))
      return [];

    const actualSpentByMaterial = getActualSpentByMaterial();

    return project.phases.map((phase) => {
      let phaseActualSpent = 0;

      if (phase.materials && Array.isArray(phase.materials)) {
        phase.materials.forEach((material) => {
          const materialName = material?.materialName;
          if (materialName && actualSpentByMaterial[materialName]) {
            const estimatedQuantity = material.quantity || 0;
            const actualData = actualSpentByMaterial[materialName];
            const actualQuantity = actualData.actualQuantity || 1;
            const proportionalSpent =
              (actualData.actualSpent || 0) *
              (estimatedQuantity / actualQuantity);
            phaseActualSpent += proportionalSpent;
          }
        });
      }

      const phaseEstimated = phase.subtotal || 0;
      const phaseVariance = phaseActualSpent - phaseEstimated;
      const phaseVariancePercentage =
        phaseEstimated > 0 ? (phaseVariance / phaseEstimated) * 100 : 0;

      return {
        ...phase,
        estimatedCost: phaseEstimated,
        actualSpent: phaseActualSpent,
        variance: phaseVariance,
        variancePercentage: phaseVariancePercentage,
        costProgress:
          phaseEstimated > 0 ? (phaseActualSpent / phaseEstimated) * 100 : 0,
        materialCount: phase.materials?.length || 0,
        avgMaterialCost:
          (phase.materials?.length || 0) > 0
            ? phaseEstimated / phase.materials.length
            : 0,
        costPercentage:
          calculateProjectBudget() > 0
            ? (phaseEstimated / calculateProjectBudget()) * 100
            : 0,
      };
    });
  };

  // Calculate date-based progress
  const calculateDateBasedProgress = (phase) => {
    if (!phase?.startDate || !phase?.endDate) return 0;

    const today = new Date();
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);

    if (today < startDate) return 0;
    if (today > endDate) return 100;

    const totalDuration = endDate - startDate;
    const elapsedTime = today - startDate;
    const estimatedProgress = (elapsedTime / totalDuration) * 100;

    return Math.min(Math.max(Math.round(estimatedProgress), 0), 100);
  };

  // Calculate status-based progress
  const calculateStatusBasedProgress = (phase) => {
    if (!phase) return 0;

    const status = phase.status?.toLowerCase();
    switch (status) {
      case "complete":
      case "completed":
        return 100;
      case "in progress":
        const dateProgress = calculateDateBasedProgress(phase);
        return Math.min(dateProgress, 90);
      case "on hold":
        const onHoldProgress = calculateDateBasedProgress(phase);
        return Math.min(onHoldProgress * 0.5, 50);
      case "delayed":
        const delayedProgress = calculateDateBasedProgress(phase);
        return Math.min(delayedProgress * 0.7, 70);
      default:
        return 0;
    }
  };

  const getPhaseProgress = (phase, context = "status") => {
    if (!phase) return 0;

    if (context === "timeline") {
      return calculateDateBasedProgress(phase);
    }
    return calculateStatusBasedProgress(phase);
  };

  const getProgressBarColor = (phase, progress) => {
    if (!phase) return "bg-gray-400";

    const status = phase.status?.toLowerCase();
    const dateProgress = calculateDateBasedProgress(phase);

    switch (status) {
      case "complete":
      case "completed":
        return "bg-green-500";
      case "in progress":
        return progress < dateProgress * 0.8 ? "bg-yellow-500" : "bg-blue-500";
      case "on hold":
        return "bg-yellow-500";
      case "delayed":
        return "bg-red-500";
      default:
        return dateProgress > 0 ? "bg-red-500" : "bg-gray-400";
    }
  };

  const getDaysStatus = (phase) => {
    if (!phase?.startDate || !phase?.endDate) {
      return { status: "unknown", days: 0, text: "Unknown" };
    }

    const today = new Date();
    const endDate = new Date(phase.endDate);
    const startDate = new Date(phase.startDate);

    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: "overdue",
        days: Math.abs(diffDays),
        text: `${Math.abs(diffDays)} days overdue`,
      };
    } else if (diffDays === 0) {
      return { status: "due", days: 0, text: "Due today" };
    } else if (today < startDate) {
      const startDiff = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
      return {
        status: "future",
        days: startDiff,
        text: `Starts in ${startDiff} days`,
      };
    } else {
      return {
        status: "active",
        days: diffDays,
        text: `${diffDays} days remaining`,
      };
    }
  };

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}`
      );
      const data = await response.json();

      if (response.ok) {
        setProject(data);
        setLoading(false);
      } else {
        toast.error("Failed to fetch project details");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch project details");
      console.error("Error fetching project details:", error);
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProjectBudget = () => {
    if (!project?.phases || !Array.isArray(project.phases)) return 0;
    return project.phases.reduce(
      (total, phase) => total + (phase?.subtotal || 0),
      0
    );
  };

  const getOverallProgress = () => {
    if (
      !project?.phases ||
      !Array.isArray(project.phases) ||
      project.phases.length === 0
    )
      return 0;
    const totalProgress = project.phases.reduce(
      (sum, phase) => sum + getPhaseProgress(phase, "status"),
      0
    );
    return Math.round(totalProgress / project.phases.length);
  };

  const getMaterialCostBreakdown = () => {
    if (!project?.phases || !Array.isArray(project.phases)) return [];

    const materialTypes = {};
    project.phases.forEach((phase) => {
      if (phase?.materials && Array.isArray(phase.materials)) {
        phase.materials.forEach((material) => {
          const type = material?.materialType || "General";
          if (!materialTypes[type]) {
            materialTypes[type] = { total: 0, count: 0 };
          }
          materialTypes[type].total += material?.total || 0;
          materialTypes[type].count += 1;
        });
      }
    });

    const projectBudget = calculateProjectBudget();
    return Object.entries(materialTypes).map(([type, data]) => ({
      type,
      total: data.total,
      count: data.count,
      percentage: projectBudget > 0 ? (data.total / projectBudget) * 100 : 0,
    }));
  };

  const getPhaseFinancialSummary = () => {
    if (!project?.phases || !Array.isArray(project.phases)) return [];

    const projectBudget = calculateProjectBudget();
    return project.phases.map((phase) => ({
      ...phase,
      materialCount: phase?.materials?.length || 0,
      avgMaterialCost:
        (phase?.materials?.length || 0) > 0
          ? (phase?.subtotal || 0) / phase.materials.length
          : 0,
      costPercentage:
        projectBudget > 0 ? ((phase?.subtotal || 0) / projectBudget) * 100 : 0,
    }));
  };

  const getTopExpensiveMaterials = () => {
    if (!project?.phases || !Array.isArray(project.phases)) return [];

    const allMaterials = [];
    project.phases.forEach((phase) => {
      if (phase?.materials && Array.isArray(phase.materials)) {
        phase.materials.forEach((material) => {
          allMaterials.push({
            ...material,
            phaseName: phase?.phaseName || "Unknown Phase",
          });
        });
      }
    });

    return allMaterials
      .sort((a, b) => (b?.total || 0) - (a?.total || 0))
      .slice(0, 10);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "not-started":
      case "":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "in-progress":
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
      case "complete":
        return "bg-green-100 text-green-800 border-green-200";
      case "on-hold":
      case "on hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
      case "completed":
        return <FaCheckCircle className="w-4 h-4 text-green-600" />;
      case "in progress":
      case "in-progress":
        return <FaPlay className="w-4 h-4 text-blue-600" />;
      case "on hold":
      case "on-hold":
        return <FaPause className="w-4 h-4 text-yellow-600" />;
      case "delayed":
        return <FaStop className="w-4 h-4 text-red-600" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(safeAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getProjectDuration = () => {
    if (!project?.startDate || !project?.endDate) return 0;
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTimeRemaining = () => {
    if (!project?.endDate) return 0;
    const today = new Date();
    const end = new Date(project.endDate);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Generate comprehensive project summary report (same as before)
  const getComprehensiveProjectSummary = () => {
    if (!project) return null;

    const totalBudget = calculateProjectBudget();
    const totalActualSpent = getTotalActualSpent();
    const costVariance = getCostVariance();
    const predictedFinalCost = getPredictedFinalCost();
    const overallProgress = getOverallProgress();
    const phasesCostAnalysis = getPhasesCostAnalysis();
    const actualSpentByMaterial = getActualSpentByMaterial();

    const completedPhases =
      project.phases?.filter((p) => p.status === "Complete").length || 0;
    const totalPhases = project.phases?.length || 0;
    const completionRate =
      totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;

    const today = new Date();
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    const totalDuration = Math.ceil(
      (projectEnd - projectStart) / (1000 * 60 * 60 * 24)
    );
    const elapsedDuration = Math.max(
      0,
      Math.ceil((today - projectStart) / (1000 * 60 * 60 * 24))
    );
    const remainingDuration = Math.max(
      0,
      Math.ceil((projectEnd - today) / (1000 * 60 * 60 * 24))
    );
    const timeProgress =
      totalDuration > 0 ? (elapsedDuration / totalDuration) * 100 : 0;

    const totalMaterials =
      project.phases?.reduce(
        (sum, phase) => sum + (phase.materials?.length || 0),
        0
      ) || 0;
    const orderedMaterials = Object.keys(actualSpentByMaterial).length;
    const materialOrderRate =
      totalMaterials > 0 ? (orderedMaterials / totalMaterials) * 100 : 0;

    const schedulePerformanceIndex =
      timeProgress > 0 ? (overallProgress / timeProgress) * 100 : 100;
    const costPerformanceIndex =
      totalBudget > 0
        ? ((totalBudget - totalActualSpent) / totalBudget) * 100
        : 0;

    const getRiskLevel = () => {
      let riskScore = 0;

      if (schedulePerformanceIndex < 80) riskScore += 3;
      else if (schedulePerformanceIndex < 90) riskScore += 2;
      else if (schedulePerformanceIndex < 100) riskScore += 1;

      if (costVariance.variancePercentage > 20) riskScore += 3;
      else if (costVariance.variancePercentage > 10) riskScore += 2;
      else if (costVariance.variancePercentage > 0) riskScore += 1;

      if (overallProgress < timeProgress * 0.8) riskScore += 2;
      else if (overallProgress < timeProgress * 0.9) riskScore += 1;

      if (riskScore >= 6)
        return { level: "High", color: "text-red-600", bgColor: "bg-red-50" };
      if (riskScore >= 3)
        return {
          level: "Medium",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      return { level: "Low", color: "text-green-600", bgColor: "bg-green-50" };
    };

    const riskAssessment = getRiskLevel();

    const healthScore = Math.round(
      completionRate * 0.3 +
        Math.min(schedulePerformanceIndex, 100) * 0.25 +
        Math.max(100 - Math.abs(costVariance.variancePercentage), 0) * 0.25 +
        materialOrderRate * 0.2
    );

    return {
      projectInfo: {
        name: project.projectName,
        id: project.projectId,
        location: project.location,
        status: project.progressStatus,
        managerId: project.managerId,
        startDate: project.startDate,
        endDate: project.endDate,
      },
      financialSummary: {
        totalBudget,
        totalActualSpent,
        costVariance: costVariance.variance,
        costVariancePercentage: costVariance.variancePercentage,
        predictedFinalCost: predictedFinalCost.predicted,
        predictedVariance: predictedFinalCost.variance,
        remainingBudget: totalBudget - totalActualSpent,
        spendingRate:
          totalBudget > 0 ? (totalActualSpent / totalBudget) * 100 : 0,
      },
      timelineSummary: {
        totalDuration,
        elapsedDuration,
        remainingDuration,
        timeProgress,
        schedulePerformanceIndex,
        isOverdue: today > projectEnd,
        daysOverdue:
          today > projectEnd
            ? Math.ceil((today - projectEnd) / (1000 * 60 * 60 * 24))
            : 0,
      },
      progressSummary: {
        overallProgress,
        completionRate,
        completedPhases,
        totalPhases,
        inProgressPhases:
          project.phases?.filter((p) => p.status === "In Progress").length || 0,
        pendingPhases:
          project.phases?.filter((p) => !p.status || p.status === "Not Started")
            .length || 0,
      },
      resourceSummary: {
        totalMaterials,
        orderedMaterials,
        materialOrderRate,
        totalPurchaseOrders: purchaseOrders?.length || 0,
        averageOrderValue:
          purchaseOrders?.length > 0
            ? totalActualSpent / purchaseOrders.length
            : 0,
      },
      performanceMetrics: {
        healthScore,
        costPerformanceIndex,
        schedulePerformanceIndex,
        riskAssessment,
        efficiency:
          overallProgress > 0 ? totalActualSpent / overallProgress : 0,
      },
      phaseBreakdown: phasesCostAnalysis.map((phase) => ({
        name: phase.phaseName,
        status: phase.status,
        estimatedCost: phase.estimatedCost,
        actualSpent: phase.actualSpent,
        variance: phase.variance,
        variancePercentage: phase.variancePercentage,
        progress: getPhaseProgress(phase, "status"),
        timeProgress: getPhaseProgress(phase, "timeline"),
        materialCount: phase.materialCount,
      })),
      materialSummary: Object.entries(actualSpentByMaterial).map(
        ([materialName, data]) => ({
          materialName,
          actualSpent: data.actualSpent,
          actualQuantity: data.actualQuantity,
          orderCount: data.orders.length,
          suppliers: [...new Set(data.orders.map((o) => o.supplier))],
          lastOrderDate: data.orders.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          )[0]?.orderDate,
        })
      ),
    };
  };

  // Export PDF report function (same as before - keeping for report generation)
  const exportProjectReport = async () => {
    const reportData = getComprehensiveProjectSummary();
    if (!reportData) {
      toast.error("No report data available");
      return;
    }

    try {
      const loadingToast = toast.info("Generating PDF report...", {
        autoClose: false,
      });

      const reportElement = document.createElement("div");
      reportElement.style.position = "absolute";
      reportElement.style.left = "-9999px";
      reportElement.style.top = "0";
      reportElement.style.width = "210mm";
      reportElement.style.padding = "20px";
      reportElement.style.fontFamily = "Arial, sans-serif";
      reportElement.style.backgroundColor = "white";

      reportElement.innerHTML = `
        <div style="max-width: 100%; margin: 0 auto;">
          <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0; font-size: 28px;">${
              reportData.projectInfo.name
            }</h1>
            <h2 style="color: #6b7280; margin: 10px 0 0 0; font-size: 20px;">Comprehensive Project Report</h2>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Project ID: ${
              reportData.projectInfo.id
            } | Location: ${reportData.projectInfo.location}</p>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">📊 Executive Summary</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px;">
              <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px; background-color: #eff6ff; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${
                  reportData.performanceMetrics.healthScore
                }%</div>
                <div style="font-size: 14px; color: #6b7280;">Project Health Score</div>
              </div>
              <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${
                  reportData.progressSummary.overallProgress
                }%</div>
                <div style="font-size: 14px; color: #6b7280;">Overall Completion</div>
              </div>
              <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px; background-color: ${
                reportData.financialSummary.costVariancePercentage > 0
                  ? "#fef2f2"
                  : "#f0fdf4"
              }; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: ${
                  reportData.financialSummary.costVariancePercentage > 0
                    ? "#dc2626"
                    : "#16a34a"
                };">
                  ${
                    reportData.financialSummary.costVariancePercentage >= 0
                      ? "+"
                      : ""
                  }${reportData.financialSummary.costVariancePercentage.toFixed(
        1
      )}%
                </div>
                <div style="font-size: 14px; color: #6b7280;">Cost Variance</div>
              </div>
              <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px; background-color: ${
                reportData.performanceMetrics.riskAssessment.level === "High"
                  ? "#fef2f2"
                  : reportData.performanceMetrics.riskAssessment.level ===
                    "Medium"
                  ? "#fefce8"
                  : "#f0fdf4"
              }; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: ${
                  reportData.performanceMetrics.riskAssessment.level === "High"
                    ? "#dc2626"
                    : reportData.performanceMetrics.riskAssessment.level ===
                      "Medium"
                    ? "#ca8a04"
                    : "#16a34a"
                };">
                  ${reportData.performanceMetrics.riskAssessment.level}
                </div>
                <div style="font-size: 14px; color: #6b7280;">Risk Level</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">📋 Project Overview</h3>
            <div style="display: flex; gap: 20px; margin-top: 15px;">
              <div style="flex: 1;">
                <h4 style="color: #374151; margin-bottom: 10px;">Project Status</h4>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                  ${reportData.progressSummary.completedPhases} of ${
        reportData.progressSummary.totalPhases
      } phases completed. 
                  Project is ${
                    reportData.timelineSummary.isOverdue
                      ? `${reportData.timelineSummary.daysOverdue} days overdue`
                      : `${reportData.timelineSummary.remainingDuration} days remaining`
                  }.
                </p>
              </div>
              <div style="flex: 1;">
                <h4 style="color: #374151; margin-bottom: 10px;">Financial Health</h4>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                  ${formatCurrency(
                    reportData.financialSummary.totalActualSpent
                  )} spent of ${formatCurrency(
        reportData.financialSummary.totalBudget
      )} budget 
                  (${reportData.financialSummary.spendingRate.toFixed(
                    1
                  )}% utilized).
                </p>
              </div>
              <div style="flex: 1;">
                <h4 style="color: #374151; margin-bottom: 10px;">Resource Utilization</h4>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                  ${reportData.resourceSummary.orderedMaterials} of ${
        reportData.resourceSummary.totalMaterials
      } materials ordered 
                  (${reportData.resourceSummary.materialOrderRate.toFixed(1)}%).
                </p>
              </div>
            </div>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 5px 0;">Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p style="margin: 5px 0;">Data includes all project phases, materials, and purchase orders as of report generation date.</p>
          </div>
        </div>
      `;

      document.body.appendChild(reportElement);

      const canvas = await html2canvas(reportElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
      });

      document.body.removeChild(reportElement);

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      const fileName = `${reportData.projectInfo.id}_comprehensive_report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      toast.dismiss(loadingToast);
      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report. Please try again.");
    }
  };

  // Navigation links (adjust based on role)
  const navLinks = [
    { name: "Dashboard", href: "/finance-officer" }, // or "/admin" based on role
    { name: "Projects", href: "/finance-officer/projects-list" },
    { name: "Reports", href: "/finance-officer/reports" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
       profileURL='/admin/profile'
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Projects", href: "/admin/projects-list" },
          { name: "Inventory", href: "/admin-inventory" },
          { name: "Users", href: "/admin-users" },
        ]}
      />
        <div className="py-6">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FaExclamationTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-main_dark mb-2">
                Project Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The project you're looking for doesn't exist or has been
                removed.
              </p>
              <button
                onClick={() => navigate("/finance-officer/projects-list")}
                className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalBudget = calculateProjectBudget();
  const totalActualSpent = getTotalActualSpent();
  const costVariance = getCostVariance();
  const predictedFinalCost = getPredictedFinalCost();
  const overallProgress = getOverallProgress();
  const materialBreakdown = getMaterialCostBreakdown();
  const phaseFinancialSummary = getPhaseFinancialSummary();
  const phasesCostAnalysis = getPhasesCostAnalysis();
  const topExpensiveMaterials = getTopExpensiveMaterials();
  const duration = getProjectDuration();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay />}

      <NavBar
       profileURL='/admin/profile'
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Projects", href: "/admin/projects-list" },
          { name: "Inventory", href: "/admin-inventory" },
          { name: "Users", href: "/admin-users" },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header with Read-Only Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <button
                onClick={() => navigate("/admin/projects-list")}
                className="text-gray-600 hover:text-main_dark transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                    {project?.projectName || "Unknown Project"}
                  </h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                    <FaEye className="w-3 h-3" />
                    Read-Only View
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaBuilding className="w-4 h-4" />
                    {project?.projectId || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    {project?.location || "N/A"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      project?.progressStatus
                    )}`}
                  >
                    {(project?.progressStatus || "unknown")
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards - Same as before */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">
                    {formatCurrency(totalBudget)}
                  </div>
                  <div className="text-sm text-gray-600">Estimated Budget</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaDollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">
                    {formatCurrency(totalActualSpent)}
                  </div>
                  <div className="text-sm text-gray-600">Actual Spent</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaShoppingCart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-2xl font-bold ${
                      (costVariance?.status || "ontrack") === "over"
                        ? "text-red-600"
                        : (costVariance?.status || "ontrack") === "under"
                        ? "text-green-600"
                        : "text-main_dark"
                    }`}
                  >
                    {(costVariance?.variance || 0) >= 0 ? "+" : ""}
                    {formatCurrency(costVariance?.variance || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Cost Variance</div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    (costVariance?.status || "ontrack") === "over"
                      ? "bg-red-100"
                      : (costVariance?.status || "ontrack") === "under"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {(costVariance?.status || "ontrack") === "over" ? (
                    <IoIosTrendingUp className="w-6 h-6 text-red-600" />
                  ) : (costVariance?.status || "ontrack") === "under" ? (
                    <IoIosTrendingDown className="w-6 h-6 text-green-600" />
                  ) : (
                    <FaEquals className="w-6 h-6 text-gray-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">
                    {overallProgress || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
                <div className="p-3 bg-web_yellow/20 rounded-lg">
                  <FaChartPie className="w-6 h-6 text-main_dark" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">
                    {formatCurrency(predictedFinalCost?.predicted || 0)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Predicted Final Cost
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaFileInvoiceDollar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Cost Variance Summary - Same visualization but read-only */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-main_dark">
                Cost Analysis Summary
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  (costVariance?.status || "ontrack") === "over"
                    ? "bg-red-100 text-red-800"
                    : (costVariance?.status || "ontrack") === "under"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {(costVariance?.variancePercentage || 0).toFixed(1)}%{" "}
                {(costVariance?.status || "ontrack") === "over"
                  ? "Over Budget"
                  : (costVariance?.status || "ontrack") === "under"
                  ? "Under Budget"
                  : "On Track"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalBudget)}
                </div>
                <div className="text-sm text-gray-600">Estimated Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalActualSpent)}
                </div>
                <div className="text-sm text-gray-600">
                  Actual Spent (
                  {totalBudget > 0
                    ? ((totalActualSpent / totalBudget) * 100).toFixed(1)
                    : "0"}
                  %)
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    (predictedFinalCost?.variance || 0) > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {formatCurrency(predictedFinalCost?.predicted || 0)}
                </div>
                <div className="text-sm text-gray-600">
                  Predicted Final (
                  {(predictedFinalCost?.variancePercentage || 0).toFixed(1)}%
                  variance)
                </div>
              </div>
            </div>

            {/* Progress vs Spending Chart */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress vs Spending
                </span>
                <span className="text-sm text-gray-600">
                  {overallProgress || 0}% Progress |{" "}
                  {totalBudget > 0
                    ? ((totalActualSpent / totalBudget) * 100).toFixed(1)
                    : "0"}
                  % Budget Used
                </span>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress || 0}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-600 mb-2">
                  Progress: {overallProgress || 0}%
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      totalBudget > 0 &&
                      (totalActualSpent / totalBudget) * 100 >
                        (overallProgress || 0)
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        totalBudget > 0
                          ? (totalActualSpent / totalBudget) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div
                  className={`text-xs ${
                    totalBudget > 0 &&
                    (totalActualSpent / totalBudget) * 100 >
                      (overallProgress || 0)
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Spending:{" "}
                  {totalBudget > 0
                    ? ((totalActualSpent / totalBudget) * 100).toFixed(1)
                    : "0"}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap space-x-4 sm:space-x-8 px-4 sm:px-6">
                {[
                  { id: "overview", name: "Cost Overview", icon: FaChartPie },
                  { id: "phases", name: "Phase Overview", icon: FaLayerGroup },
                  { id: "materials", name: "Material Costs", icon: FaCube },
                  { id: "timeline", name: "Timeline", icon: FaCalendarAlt },
                  {
                    id: "purchase-orders",
                    name: "Purchase Orders",
                    icon: FaShoppingCart,
                  },
                  {
                    id: "summary-report",
                    name: "Full Summary Report",
                    icon: FaFileAlt,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-web_yellow text-main_dark"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content - ALL READ-ONLY */}
            <div className="p-4 sm:p-6">
              {/* Overview Tab - Same visualization */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Note: This section remains the same as your original but without edit capabilities */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-main_dark mb-4">
                        Estimated vs Actual Cost by Phase
                      </h4>
                      <div className="space-y-3">
                        {(phasesCostAnalysis || []).map((phase) => (
                          <div
                            key={phase?.phaseId || Math.random()}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-main_dark">
                                {phase?.phaseName || "Unknown Phase"}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded ${
                                  (phase?.variance || 0) > 0
                                    ? "bg-red-100 text-red-600"
                                    : (phase?.variance || 0) < 0
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {(phase?.variancePercentage || 0).toFixed(1)}%
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>
                                    Estimated:{" "}
                                    {formatCurrency(phase?.estimatedCost || 0)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-400 h-2 rounded-full"
                                    style={{ width: "100%" }}
                                  ></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>
                                    Actual:{" "}
                                    {formatCurrency(phase?.actualSpent || 0)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      (phase?.actualSpent || 0) >
                                      (phase?.estimatedCost || 0)
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        (phase?.estimatedCost || 0) > 0
                                          ? ((phase?.actualSpent || 0) /
                                              (phase?.estimatedCost || 1)) *
                                              100
                                          : 0,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Statistics */}
                    <div>
                      <h4 className="text-lg font-semibold text-main_dark mb-4">
                        Project Statistics
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaShoppingCart className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Total Purchase Orders
                              </div>
                              <div className="text-lg font-semibold text-main_dark">
                                {(purchaseOrders || []).length}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaBalanceScale className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Average Order Value
                              </div>
                              <div className="text-lg font-semibold text-main_dark">
                                {(purchaseOrders || []).length > 0
                                  ? formatCurrency(
                                      totalActualSpent /
                                        (purchaseOrders || []).length
                                    )
                                  : formatCurrency(0)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaFileInvoiceDollar className="w-5 h-5 text-purple-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Cost per Day
                              </div>
                              <div className="text-lg font-semibold text-main_dark">
                                {formatCurrency(
                                  duration > 0 ? totalBudget / duration : 0
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-web_yellow/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <IoIosTrendingUp className="w-5 h-5 text-main_dark" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Burn Rate (Daily Spending)
                              </div>
                              <div className="text-lg font-semibold text-main_dark">
                                {(overallProgress || 0) > 0 && duration > 0
                                  ? formatCurrency(
                                      totalActualSpent /
                                        (duration *
                                          ((overallProgress || 0) / 100))
                                    )
                                  : formatCurrency(0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Expensive Materials Table - Read Only */}
                  <div>
                    <h4 className="text-lg font-semibold text-main_dark mb-4">
                      Materials Cost Analysis (Estimated vs Actual)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Material
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phase
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estimated Cost
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actual Spent
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Variance
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topExpensiveMaterials.map((material, index) => {
                            const actualSpentData = getActualSpentByMaterial();
                            const actualSpent =
                              actualSpentData[material?.materialName]
                                ?.actualSpent || 0;
                            const variance =
                              actualSpent - (material?.total || 0);
                            const variancePercentage =
                              (material?.total || 0) > 0
                                ? (variance / (material?.total || 1)) * 100
                                : 0;

                            return (
                              <tr
                                key={`${
                                  material?.phaseMaterialId || index
                                }-${index}`}
                              >
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                  {material?.materialName || "Unknown Material"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {material?.phaseName || "Unknown Phase"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(material?.total || 0)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-main_dark">
                                  {formatCurrency(actualSpent)}
                                </td>
                                <td
                                  className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                                    variance > 0
                                      ? "text-red-600"
                                      : variance < 0
                                      ? "text-green-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {variance >= 0 ? "+" : ""}
                                  {formatCurrency(variance)}(
                                  {variancePercentage.toFixed(1)}%)
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      actualSpent === 0
                                        ? "bg-gray-100 text-gray-800"
                                        : variance > 0
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {actualSpent === 0
                                      ? "Not Ordered"
                                      : variance > 0
                                      ? "Over Budget"
                                      : "Under Budget"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Phases Tab - READ ONLY (No Edit Buttons) */}
              {activeTab === "phases" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-main_dark">
                      Phase Overview & Cost Analysis
                    </h4>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <FaLock className="w-4 h-4" />
                      Read-Only View
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {(phasesCostAnalysis || []).map((phase, index) => {
                      const statusProgress = getPhaseProgress(phase, "status");
                      const timeProgress = getPhaseProgress(phase, "timeline");
                      const daysStatus = getDaysStatus(phase);

                      return (
                        <div
                          key={phase?.phaseId || index}
                          className="bg-gray-50 rounded-lg p-4 sm:p-6"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="text-lg font-semibold text-main_dark">
                                  {phase?.phaseName || "Unknown Phase"}
                                </h5>
                                {getStatusIcon(phase?.status)}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {formatDate(phase?.startDate)} -{" "}
                                {formatDate(phase?.endDate)}
                              </div>

                              {/* Days status indicator */}
                              <div
                                className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${
                                  daysStatus.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : daysStatus.status === "due"
                                    ? "bg-orange-100 text-orange-800"
                                    : daysStatus.status === "future"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {daysStatus.text}
                              </div>

                              {/* Status Display - No Edit Capability */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    phase?.status
                                  )}`}
                                >
                                  {phase?.status || "Not Started"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  (View Only)
                                </span>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <div className="text-2xl font-bold text-main_dark">
                                {formatCurrency(phase?.estimatedCost || 0)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {(phase?.costPercentage || 0).toFixed(1)}% of
                                total budget
                              </div>
                              <div
                                className={`text-sm font-medium ${
                                  (phase?.variance || 0) > 0
                                    ? "text-red-600"
                                    : (phase?.variance || 0) < 0
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                              >
                                Actual:{" "}
                                {formatCurrency(phase?.actualSpent || 0)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600">
                                Materials Count
                              </div>
                              <div className="text-xl font-semibold text-main_dark">
                                {phase?.materialCount || 0}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600">
                                Estimated Cost
                              </div>
                              <div className="text-xl font-semibold text-main_dark">
                                {formatCurrency(phase?.estimatedCost || 0)}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600">
                                Actual Spent
                              </div>
                              <div className="text-xl font-semibold text-main_dark">
                                {formatCurrency(phase?.actualSpent || 0)}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600">
                                Cost Variance
                              </div>
                              <div
                                className={`text-xl font-semibold ${
                                  (phase?.variance || 0) > 0
                                    ? "text-red-600"
                                    : (phase?.variance || 0) < 0
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {(phase?.variance || 0) >= 0 ? "+" : ""}
                                {formatCurrency(phase?.variance || 0)}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600">
                                Status Progress
                              </div>
                              <div className="text-xl font-semibold text-main_dark">
                                {statusProgress || 0}%
                              </div>
                            </div>
                          </div>

                          {/* Progress Bars */}
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Status Progress
                                </span>
                                <span className="text-sm text-gray-600">
                                  {statusProgress || 0}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                                    phase,
                                    statusProgress
                                  )}`}
                                  style={{ width: `${statusProgress || 0}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Timeline Progress
                                </span>
                                <span className="text-sm text-gray-600">
                                  {timeProgress || 0}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${timeProgress || 0}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Cost Progress
                                </span>
                                <span className="text-sm text-gray-600">
                                  {(phase?.costProgress || 0).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    (phase?.costProgress || 0) > 100
                                      ? "bg-red-500"
                                      : "bg-purple-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      phase?.costProgress || 0,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Materials Tab */}
              {activeTab === "materials" && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-main_dark">
                    Detailed Material Costs
                  </h4>
                  {(project?.phases || []).map((phase) => (
                    <div
                      key={phase?.phaseId || Math.random()}
                      className="bg-gray-50 rounded-lg p-4 sm:p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-semibold text-main_dark">
                          {phase?.phaseName || "Unknown Phase"}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            phase?.status
                          )}`}
                        >
                          {phase?.status || "Not Started"}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Material
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rate
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {(phase?.materials || []).map((material) => (
                              <tr
                                key={material?.phaseMaterialId || Math.random()}
                              >
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                  {material?.materialName || "Unknown Material"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {material?.materialType || "N/A"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {material?.quantity || 0}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {material?.unitOfMeasurement || "N/A"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(material?.rate || 0)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-main_dark">
                                  {formatCurrency(material?.total || 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-light_brown/30">
                            <tr>
                              <td
                                colSpan="5"
                                className="px-4 py-3 text-sm font-semibold text-main_dark text-right"
                              >
                                Phase Subtotal:
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-main_dark">
                                {formatCurrency(phase?.subtotal || 0)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-main_dark">
                    Project Timeline & Milestones
                  </h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 md:hidden"></div>
                    <div className="space-y-6">
                      {(project?.phases || []).map((phase, index) => {
                        const statusProgress = getPhaseProgress(
                          phase,
                          "status"
                        );
                        const timeProgress = getPhaseProgress(
                          phase,
                          "timeline"
                        );
                        const daysStatus = getDaysStatus(phase);

                        return (
                          <div
                            key={phase?.phaseId || index}
                            className="relative flex flex-col md:flex-row items-start md:items-center"
                          >
                            <div
                              className={`md:absolute md:left-2 w-4 h-4 rounded-full border-2 ${
                                phase?.status === "Complete"
                                  ? "bg-green-500 border-green-500"
                                  : phase?.status === "In Progress"
                                  ? "bg-blue-500 border-blue-500"
                                  : phase?.status === "On Hold"
                                  ? "bg-yellow-500 border-yellow-500"
                                  : phase?.status === "Delayed"
                                  ? "bg-red-500 border-red-500"
                                  : timeProgress > 0
                                  ? "bg-red-500 border-red-500"
                                  : "bg-gray-300 border-gray-300"
                              }`}
                            ></div>
                            <div className="ml-0 md:ml-10 flex-1">
                              <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2 sm:gap-0">
                                  <div className="flex items-center gap-3">
                                    <h5 className="text-lg font-semibold text-main_dark">
                                      {phase?.phaseName || "Unknown Phase"}
                                    </h5>
                                    {getStatusIcon(phase?.status)}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                        phase?.status
                                      )}`}
                                    >
                                      {phase?.status || "Not Started"}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        daysStatus.status === "overdue"
                                          ? "bg-red-100 text-red-800"
                                          : daysStatus.status === "due"
                                          ? "bg-orange-100 text-orange-800"
                                          : daysStatus.status === "future"
                                          ? "bg-gray-100 text-gray-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {daysStatus.text}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <div className="text-sm text-gray-600">
                                      Start Date
                                    </div>
                                    <div className="font-medium">
                                      {formatDate(phase?.startDate)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">
                                      End Date
                                    </div>
                                    <div className="font-medium">
                                      {formatDate(phase?.endDate)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">
                                      Budget
                                    </div>
                                    <div className="font-medium">
                                      {formatCurrency(phase?.subtotal || 0)}
                                    </div>
                                  </div>
                                </div>

                                {/* Timeline Progress Bars */}
                                <div className="space-y-3">
                                  {/* Actual Progress (Status-based) */}
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-700">
                                        Actual Progress
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        {statusProgress || 0}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                                          phase,
                                          statusProgress
                                        )}`}
                                        style={{
                                          width: `${statusProgress || 0}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Expected Progress (Time-based) */}
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-700">
                                        Expected Progress (Timeline)
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        {timeProgress || 0}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                                        style={{
                                          width: `${timeProgress || 0}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Based on elapsed time:{" "}
                                      {Math.max(
                                        0,
                                        Math.round(
                                          (new Date() -
                                            new Date(
                                              phase?.startDate || new Date()
                                            )) /
                                            (1000 * 60 * 60 * 24)
                                        )
                                      )}{" "}
                                      /{" "}
                                      {Math.round(
                                        (new Date(
                                          phase?.endDate || new Date()
                                        ) -
                                          new Date(
                                            phase?.startDate || new Date()
                                          )) /
                                          (1000 * 60 * 60 * 24)
                                      )}{" "}
                                      days
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "summary-report" && (
                <div className="space-y-6">
                  {(() => {
                    const reportData = getComprehensiveProjectSummary();
                    if (!reportData) return <div>Loading...</div>;

                    return (
                      <>
                        {/* Report Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="text-2xl font-bold text-main_dark">
                              Comprehensive Project Report
                            </h4>
                            <p className="text-gray-600">
                              Complete analysis of project performance, costs,
                              and completion status
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={exportProjectReport}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <FaDownload className="w-4 h-4" />
                              Export Report
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                              <FaPrint className="w-4 h-4" />
                              Print
                            </button>
                          </div>
                        </div>

                        {/* Executive Summary */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h5 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                            <FaTachometerAlt className="w-5 h-5" />
                            Executive Summary
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-3xl font-bold text-blue-600">
                                {reportData.performanceMetrics.healthScore}%
                              </div>
                              <div className="text-sm text-gray-600">
                                Project Health Score
                              </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-3xl font-bold text-green-600">
                                {reportData.progressSummary.overallProgress}%
                              </div>
                              <div className="text-sm text-gray-600">
                                Overall Completion
                              </div>
                            </div>
                            <div
                              className={`text-center p-4 rounded-lg ${
                                reportData.financialSummary
                                  .costVariancePercentage > 0
                                  ? "bg-red-50"
                                  : "bg-green-50"
                              }`}
                            >
                              <div
                                className={`text-3xl font-bold ${
                                  reportData.financialSummary
                                    .costVariancePercentage > 0
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {reportData.financialSummary
                                  .costVariancePercentage >= 0
                                  ? "+"
                                  : ""}
                                {reportData.financialSummary.costVariancePercentage.toFixed(
                                  1
                                )}
                                %
                              </div>
                              <div className="text-sm text-gray-600">
                                Cost Variance
                              </div>
                            </div>
                            <div
                              className={`text-center p-4 rounded-lg ${reportData.performanceMetrics.riskAssessment.bgColor}`}
                            >
                              <div
                                className={`text-3xl font-bold ${reportData.performanceMetrics.riskAssessment.color}`}
                              >
                                {
                                  reportData.performanceMetrics.riskAssessment
                                    .level
                                }
                              </div>
                              <div className="text-sm text-gray-600">
                                Risk Level
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h6 className="font-semibold text-main_dark mb-2">
                                Project Status
                              </h6>
                              <p className="text-sm text-gray-600">
                                {reportData.progressSummary.completedPhases} of{" "}
                                {reportData.progressSummary.totalPhases} phases
                                completed. Project is{" "}
                                {reportData.timelineSummary.isOverdue
                                  ? `${reportData.timelineSummary.daysOverdue} days overdue`
                                  : `${reportData.timelineSummary.remainingDuration} days remaining`}
                                .
                              </p>
                            </div>
                            <div>
                              <h6 className="font-semibold text-main_dark mb-2">
                                Financial Health
                              </h6>
                              <p className="text-sm text-gray-600">
                                {formatCurrency(
                                  reportData.financialSummary.totalActualSpent
                                )}{" "}
                                spent of{" "}
                                {formatCurrency(
                                  reportData.financialSummary.totalBudget
                                )}{" "}
                                budget (
                                {reportData.financialSummary.spendingRate.toFixed(
                                  1
                                )}
                                % utilized). Projected final cost:{" "}
                                {formatCurrency(
                                  reportData.financialSummary.predictedFinalCost
                                )}
                                .
                              </p>
                            </div>
                            <div>
                              <h6 className="font-semibold text-main_dark mb-2">
                                Resource Utilization
                              </h6>
                              <p className="text-sm text-gray-600">
                                {reportData.resourceSummary.orderedMaterials} of{" "}
                                {reportData.resourceSummary.totalMaterials}{" "}
                                materials ordered (
                                {reportData.resourceSummary.materialOrderRate.toFixed(
                                  1
                                )}
                                % completion rate).
                                {
                                  reportData.resourceSummary.totalPurchaseOrders
                                }{" "}
                                purchase orders processed.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Financial Analysis */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h5 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                            <FaDollarSign className="w-5 h-5" />
                            Financial Analysis
                          </h5>

                          <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Metric
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estimated
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actual
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Variance
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Variance %
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                    Total Project Cost
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(
                                      reportData.financialSummary.totalBudget
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(
                                      reportData.financialSummary
                                        .totalActualSpent
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(
                                      reportData.financialSummary.costVariance
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {reportData.financialSummary.costVariancePercentage.toFixed(
                                      2
                                    )}
                                    %
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        reportData.financialSummary
                                          .costVariancePercentage > 5
                                          ? "bg-red-100 text-red-800"
                                          : reportData.financialSummary
                                              .costVariancePercentage < -5
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {reportData.financialSummary
                                        .costVariancePercentage > 5
                                        ? "Over Budget"
                                        : reportData.financialSummary
                                            .costVariancePercentage < -5
                                        ? "Under Budget"
                                        : "On Track"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                    Predicted Final Cost
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(
                                      reportData.financialSummary.totalBudget
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(
                                      reportData.financialSummary
                                        .predictedFinalCost
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(
                                      reportData.financialSummary
                                        .predictedVariance
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {(
                                      (reportData.financialSummary
                                        .predictedVariance /
                                        reportData.financialSummary
                                          .totalBudget) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        reportData.financialSummary
                                          .predictedVariance > 0
                                          ? "bg-red-100 text-red-800"
                                          : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {reportData.financialSummary
                                        .predictedVariance > 0
                                        ? "Projection Over"
                                        : "Projection Under"}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Phase Performance Analysis */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h5 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                            <FaLayerGroup className="w-5 h-5" />
                            Phase Performance Analysis
                          </h5>

                          <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phase Name
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progress
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estimated Cost
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actual Spent
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Variance
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Materials
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.phaseBreakdown.map(
                                  (phase, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                        {phase.name}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap">
                                        <span
                                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                            phase.status
                                          )}`}
                                        >
                                          {phase.status || "Not Started"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {phase.progress}%
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(phase.estimatedCost)}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(phase.actualSpent)}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span
                                          className={`${
                                            phase.variance > 0
                                              ? "text-red-600"
                                              : phase.variance < 0
                                              ? "text-green-600"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {formatCurrency(phase.variance)} (
                                          {phase.variancePercentage.toFixed(1)}
                                          %)
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {phase.materialCount}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Timeline Analysis */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h5 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="w-5 h-5" />
                            Timeline Analysis
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {reportData.timelineSummary.totalDuration}
                              </div>
                              <div className="text-sm text-gray-600">
                                Total Duration (Days)
                              </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {reportData.timelineSummary.elapsedDuration}
                              </div>
                              <div className="text-sm text-gray-600">
                                Elapsed Days
                              </div>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                              <div className="text-2xl font-bold text-yellow-600">
                                {reportData.timelineSummary.remainingDuration}
                              </div>
                              <div className="text-sm text-gray-600">
                                Remaining Days
                              </div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {reportData.timelineSummary.schedulePerformanceIndex.toFixed(
                                  1
                                )}
                                %
                              </div>
                              <div className="text-sm text-gray-600">
                                Schedule Performance
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h6 className="font-semibold text-main_dark mb-2">
                              Timeline Status
                            </h6>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Time Progress
                              </span>
                              <span className="text-sm text-gray-600">
                                {reportData.timelineSummary.timeProgress.toFixed(
                                  1
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(
                                    reportData.timelineSummary.timeProgress,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-medium text-gray-700">
                                Work Progress
                              </span>
                              <span className="text-sm text-gray-600">
                                {reportData.progressSummary.overallProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-300 ${
                                  reportData.progressSummary.overallProgress >=
                                  reportData.timelineSummary.timeProgress * 0.9
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${reportData.progressSummary.overallProgress}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Material Analysis */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h5 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                            <FaCube className="w-5 h-5" />
                            Material Analysis
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {reportData.resourceSummary.totalMaterials}
                              </div>
                              <div className="text-sm text-gray-600">
                                Total Materials
                              </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {reportData.resourceSummary.orderedMaterials}
                              </div>
                              <div className="text-sm text-gray-600">
                                Materials Ordered
                              </div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {reportData.resourceSummary.materialOrderRate.toFixed(
                                  1
                                )}
                                %
                              </div>
                              <div className="text-sm text-gray-600">
                                Order Completion Rate
                              </div>
                            </div>
                          </div>

                          {reportData.materialSummary.length > 0 && (
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-max">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Material Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actual Spent
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Quantity Ordered
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Orders Count
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Suppliers
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Last Order
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {reportData.materialSummary
                                    .slice(0, 10)
                                    .map((material, index) => (
                                      <tr key={index}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                          {material.materialName}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {formatCurrency(material.actualSpent)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {material.actualQuantity}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {material.orderCount}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {material.suppliers.join(", ")}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {formatDate(material.lastOrderDate)}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h5 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                            <FaInfoCircle className="w-5 h-5" />
                            Recommendations & Insights
                          </h5>

                          <div className="space-y-4">
                            {/* Cost Recommendations */}
                            {reportData.financialSummary
                              .costVariancePercentage > 10 && (
                              <div className="p-4 bg-red-50 border-l-4 border-red-400">
                                <div className="flex">
                                  <FaExclamationTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                                  <div>
                                    <h6 className="text-red-800 font-semibold">
                                      Cost Overrun Alert
                                    </h6>
                                    <p className="text-red-700 text-sm">
                                      Project is{" "}
                                      {reportData.financialSummary.costVariancePercentage.toFixed(
                                        1
                                      )}
                                      % over budget. Consider reviewing material
                                      costs and purchase orders for optimization
                                      opportunities.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Schedule Recommendations */}
                            {reportData.timelineSummary
                              .schedulePerformanceIndex < 90 && (
                              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                                <div className="flex">
                                  <FaClock className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                                  <div>
                                    <h6 className="text-yellow-800 font-semibold">
                                      Schedule Performance Warning
                                    </h6>
                                    <p className="text-yellow-700 text-sm">
                                      Project progress (
                                      {
                                        reportData.progressSummary
                                          .overallProgress
                                      }
                                      %) is behind time progress (
                                      {reportData.timelineSummary.timeProgress.toFixed(
                                        1
                                      )}
                                      %). Consider resource reallocation.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Positive Insights */}
                            {reportData.performanceMetrics.healthScore > 80 && (
                              <div className="p-4 bg-green-50 border-l-4 border-green-400">
                                <div className="flex">
                                  <FaCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                                  <div>
                                    <h6 className="text-green-800 font-semibold">
                                      Excellent Performance
                                    </h6>
                                    <p className="text-green-700 text-sm">
                                      Project health score of{" "}
                                      {
                                        reportData.performanceMetrics
                                          .healthScore
                                      }
                                      % indicates strong performance across
                                      cost, schedule, and completion metrics.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Material Ordering Recommendations */}
                            {reportData.resourceSummary.materialOrderRate <
                              70 && (
                              <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                                <div className="flex">
                                  <FaShoppingCart className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                                  <div>
                                    <h6 className="text-blue-800 font-semibold">
                                      Material Ordering Required
                                    </h6>
                                    <p className="text-blue-700 text-sm">
                                      Only{" "}
                                      {reportData.resourceSummary.materialOrderRate.toFixed(
                                        1
                                      )}
                                      % of materials have been ordered. Consider
                                      accelerating procurement to avoid project
                                      delays.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Report Footer */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-600">
                            Report generated on{" "}
                            {new Date().toLocaleDateString()} at{" "}
                            {new Date().toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Data includes all project phases, materials, and
                            purchase orders as of report generation date.
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Purchase Orders Tab - READ ONLY */}
              {activeTab === "purchase-orders" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-main_dark">
                      Purchase Orders Summary
                    </h4>
                    <div className="text-sm text-gray-500">
                      Total: {(purchaseOrders || []).length} orders |{" "}
                      {formatCurrency(totalActualSpent)}
                    </div>
                  </div>

                  {!purchaseOrders || purchaseOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <FaShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Purchase Orders
                      </h3>
                      <p className="text-gray-600">
                        No purchase orders have been created for this project
                        yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {purchaseOrders.map((order) => (
                        <div
                          key={order?.poId || Math.random()}
                          className="bg-gray-50 rounded-lg p-4 sm:p-6"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                            <div>
                              <h5 className="text-lg font-semibold text-main_dark mb-1">
                                {order?.ponumber || "Unknown Order"}
                              </h5>
                              <div className="text-sm text-gray-600">
                                Supplier: {order?.supplier?.name || "Unknown"} |
                                Order Date: {formatDate(order?.orderDate)}
                              </div>
                            </div>
                            <div className="text-right mt-2 sm:mt-0">
                              <div className="text-2xl font-bold text-main_dark">
                                {formatCurrency(order?.subTotal || 0)}
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  order?.status
                                )}`}
                              >
                                {order?.status || "Unknown"}
                              </span>
                            </div>
                          </div>

                          {/* Order Materials */}
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                              <thead className="bg-white">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Material
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Cost
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {(order?.materials || []).map((material) => (
                                  <tr
                                    key={
                                      material?.purchasingOrderMaterialId ||
                                      Math.random()
                                    }
                                  >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                      {material?.material?.materialName ||
                                        "Unknown Material"}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {material?.quantity || 0}{" "}
                                      {material?.material?.unitOfMeasurement ||
                                        ""}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {formatCurrency(material?.unitPrice || 0)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-main_dark">
                                      {formatCurrency(material?.cost || 0)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Payment Information */}
                          {order?.orderPayment && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <h6 className="font-semibold text-main_dark mb-2">
                                Payment Information
                              </h6>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Total Amount:
                                  </span>
                                  <span className="font-semibold ml-2">
                                    {formatCurrency(
                                      order.orderPayment.amount || 0
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">
                                    Paid Amount:
                                  </span>
                                  <span className="font-semibold ml-2 text-green-600">
                                    {formatCurrency(
                                      order.orderPayment.paidAmount || 0
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">
                                    Remaining:
                                  </span>
                                  <span className="font-semibold ml-2 text-red-600">
                                    {formatCurrency(
                                      order.orderPayment.remainingAmount || 0
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Documents Section - READ ONLY */}
          {project?.documentPaths &&
            Array.isArray(project.documentPaths) &&
            project.documentPaths.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">
                  Project Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.documentPaths.map((docPath, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0"
                    >
                      <FaFileContract className="w-5 h-5 text-blue-600 mr-0 sm:mr-3 mb-2 sm:mb-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-main_dark">
                          {docPath?.split("\\")?.pop() || "Unknown Document"}
                        </div>
                        <div className="text-xs text-gray-500">
                          BOQ Document
                        </div>
                      </div>
                      <button className="text-deep_green hover:text-deep_green/80 transition-colors mt-2 sm:mt-0">
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminProjectDetails;
