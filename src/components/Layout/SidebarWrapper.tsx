
import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface SidebarWrapperProps {
  defaultCollapsed: boolean;
}

/**
 * Wrapper component for the Sidebar to handle the isCollapsed prop correctly.
 * This wrapper matches what the MainLayout expects but passes valid props to the underlying Sidebar component.
 */
const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ defaultCollapsed }) => {
  return <Sidebar defaultCollapsed={defaultCollapsed} />;
};

export default SidebarWrapper;
