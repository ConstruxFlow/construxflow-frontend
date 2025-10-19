import { Outlet } from "react-router-dom";
import MaintenanceDashboard from "./MaintenanceDashboard";
import MaintenanceMaterialRequest from "./MaintenanceMaterialRequest";
import MaintenanceRequestTracker from "./MaintenanceTracker";
import EquipmentLogContainer from "./EquipmentLog";
import ServiceHistoryContainer from "./MaintenanceLog";
import TechnicianAssignmentMain from "./TechnicianAssign";
import NextScheduleContainer from "./UpcomingSchedule";
import TaskCompleteContainer from "./TaskComplete";
import WorkerProfile from "./WorkerProfile";
import ProfileManagement from "./MaintenanceProfile";
import MaintenanceScheduling from "./MaintenanceScheduling";
import EquipmentMaintenanceContainer from "./UpdateEquipmentMaintenance";
import UpdateEquipmentMaintenance from "./UpdateEquipmentMaintenance";
import ScheduleMaintenanceAndRequestMaterials from "./MaintenanceScheduling";
import TeamMemberDetailsForm from "./TeamMemberDetailsForm";
import ManagerProfileView from "./ManagerProfile";
import MaintenanceRequestDashboard from "./InventoryManagerRequest";

export const MaintenanceRoute = {
  path: "/maintenance",
  element: <Outlet />,
  children: [
    {
      path: "dashboard",
      element: <MaintenanceDashboard />,
    },
    {
      path: "requests",
      element: <MaintenanceMaterialRequest />,
    },
    {
      path: "tracker",
      element: <MaintenanceRequestTracker />,
    },
    {
      path: "equipment",
      element: <EquipmentLogContainer />,
    },
    {
      path: "log",
      element: <ServiceHistoryContainer />,
    },
    {
      path: "technician-assignment/:id",
      element: <TechnicianAssignmentMain />,
    },
    {
      path: "upcoming-maintenance",
      element: <NextScheduleContainer />,
    },
    {
      path: "task-complete/:id",
      element: <TaskCompleteContainer />,
    },
    {
      path: "worker-profile/:id",
      element: <WorkerProfile />,
    },
    {
      path: "profile",
      element: <ManagerProfileView />,
    },
    {
      path: "scheduling",
      element: <ScheduleMaintenanceAndRequestMaterials />,
    },
    {
      path: "scheduling/:equipmentId",
      element: <ScheduleMaintenanceAndRequestMaterials />,
    },
    {
      path: "update-equipment-maintenance",
      element: <UpdateEquipmentMaintenance />,
    },
    {
      path: "add-member",
      element: <TeamMemberDetailsForm />,
    },
    {
      path: "inventory-request",
      element: <MaintenanceRequestDashboard/>
    }
  ],
};
