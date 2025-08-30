import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteManagerDashboard from './SiteManagerDashboard';
import Existing_Projects_List from './Existing_Projects_List';
import Create_Project from './Create_Project';
import Edit_Project from './Edit_Project';
import Project_Phase from "./Project_Phase";
import Create_Material_Request from "./Create_Material_Request";
import Material_Request from "./Material_Request";
import MaterialRequestList from "./MaterialRequestList";
import Site_EquipmentInfo from "./Site_EquipmentInfo";
import Site_EquipmentRequest from "./Site_EquipmentRequest";
import Site_MaterialInfo from "./Site_MaterialInfo";
import Site_MaterialAdd from "./Site_MaterialAdd";
import Site_MaterialUpdate from "./Site_MaterialUpdate";
import Purchase_Order from "./Purchase_Order";
import SiteManager_Profile from "./SiteManager_Profile";
import ManagerProfileView from "./ManagerProfile";
import SiteInventory from "./Site_inventory";

// Import new equipment management components
import EquipmentSelection from '../../components/SiteManager/EquipmentSelection';
import EquipmentRequestForm from '../../components/SiteManager/EquipmentRequestForm';
import ProjectEquipmentDashboard from '../../components/SiteManager/ProjectEquipmentDashboard';
import EquipmentUsageUpdate from '../../components/SiteManager/EquipmentUsageUpdate';
import ProjectSelection from '../../components/SiteManager/ProjectSelection';

export const siteManagerRoutes = {
  path: '/site-manager',
  element: <Outlet />,
  children: [
    {
      path: '',
      element: <SiteManagerDashboard />,
    },
    {
      path: 'projects-list',
      element: <Existing_Projects_List />,
    },
    {
      path: 'projects-list/create-project',
      element: <Create_Project />,
    },
    {
      path: 'projects-list/edit-project',
      element: <Edit_Project />,
    },
    {
      path: 'projects-list/edit-project/:projectId',
      element: <Edit_Project />,
    },
    {
      path: 'projects-list/create-project/project-phase',
      element: <Project_Phase />,
    },
    {
      path: 'materials',
      element: <Existing_Projects_List />,
    },
    {
      path: 'materials/project/:projectId/material-requests',
      element: <MaterialRequestList />,
    },
    {
      path: 'materials/create-request',
      element: <Create_Material_Request />,
    },
    {
      path: 'materials/edit-request/:requestId',
      element: <Create_Material_Request />,
    },
    {
      path: 'material-request-list/material-request',
      element: <Create_Material_Request />,
    },
    {
      path: 'material-request-list',
      element: <Material_Request />,
    },
    {
      path: 'site-inventory',
      element: <SiteInventory />,
    },
    {
      path: 'site-equipment-info',
      element: <Site_EquipmentInfo />,
    },
    {
      path: 'site-equipment-request',
      element: <Site_EquipmentRequest />,
    },
    {
      path: 'site-material-info',
      element: <Site_MaterialInfo />,
    },
    {
      path: 'site-material-add',
      element: <Site_MaterialAdd />,
    },
    {
      path: 'site-material-update',
      element: <Site_MaterialUpdate />,
    },
    {
      path: 'purchase-order',
      element: <Purchase_Order />,
    },
    {
      path: 'profile',
      element: <ManagerProfileView/>,
    },
    // New Equipment Management Routes
    {
      path: 'project-selection',
      element: <ProjectSelection />,
    },
    {
      path: 'equipment-selection/:projectId',
      element: <EquipmentSelection />,
    },
    {
      path: 'equipment-request/:projectId',
      element: <EquipmentRequestForm />,
    },
    {
      path: 'project-equipment/:projectId',
      element: <ProjectEquipmentDashboard />,
    },
    {
      path: 'equipment-usage/:equipmentId',
      element: <EquipmentUsageUpdate />,
    }
  ]
}; 