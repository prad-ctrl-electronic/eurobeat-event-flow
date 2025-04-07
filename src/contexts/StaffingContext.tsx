
import React, { createContext, useState, useContext, ReactNode } from "react";
import { StaffMember, Department, StaffAssignment } from "../components/finance/budget/types";
import { staffMembersData, departmentsData } from "../data/staffingData";
import { useEvent } from "./EventContext";

type StaffingContextType = {
  staff: StaffMember[];
  setStaff: (staff: StaffMember[]) => void;
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  assignments: StaffAssignment[];
  setAssignments: (assignments: StaffAssignment[]) => void;
  filteredStaff: StaffMember[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  payrollTypeFilter: string;
  setPayrollTypeFilter: (type: string) => void;
  addStaffMember: (member: Omit<StaffMember, "id" | "initials">) => void;
  updateStaffMember: (id: number, updates: Partial<StaffMember>) => void;
  deleteStaffMember: (id: number) => void;
  getStaffMemberById: (id: number) => StaffMember | undefined;
};

const StaffingContext = createContext<StaffingContextType | undefined>(undefined);

export const StaffingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<StaffMember[]>(staffMembersData);
  const [departments, setDepartments] = useState<Department[]>(departmentsData);
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [payrollTypeFilter, setPayrollTypeFilter] = useState<string>("");
  
  const { selectedEventId } = useEvent();

  // Filter staff based on search term and filters
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = departmentFilter ? member.department === departmentFilter : true;
    const matchesStatus = statusFilter ? member.status === statusFilter : true;
    const matchesPayrollType = payrollTypeFilter ? member.payrollType === payrollTypeFilter : true;
    const matchesEvent = selectedEventId !== "all" ? 
      assignments.some(a => a.staffId === member.id && a.eventId === selectedEventId) : true;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesPayrollType && matchesEvent;
  });

  // Generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  // Add new staff member
  const addStaffMember = (member: Omit<StaffMember, "id" | "initials">) => {
    const newId = Math.max(0, ...staff.map(s => s.id)) + 1;
    const initials = getInitials(member.name);
    
    const newStaff = [...staff, { ...member, id: newId, initials }];
    setStaff(newStaff);
    return newId;
  };

  // Update existing staff member
  const updateStaffMember = (id: number, updates: Partial<StaffMember>) => {
    setStaff(staff.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  // Delete staff member
  const deleteStaffMember = (id: number) => {
    setStaff(staff.filter(member => member.id !== id));
    setAssignments(assignments.filter(assignment => assignment.staffId !== id));
  };

  // Get staff member by ID
  const getStaffMemberById = (id: number) => {
    return staff.find(member => member.id === id);
  };

  return (
    <StaffingContext.Provider
      value={{
        staff,
        setStaff,
        departments,
        setDepartments,
        assignments,
        setAssignments,
        filteredStaff,
        searchTerm,
        setSearchTerm,
        departmentFilter,
        setDepartmentFilter,
        statusFilter,
        setStatusFilter,
        payrollTypeFilter,
        setPayrollTypeFilter,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        getStaffMemberById
      }}
    >
      {children}
    </StaffingContext.Provider>
  );
};

export const useStaffing = (): StaffingContextType => {
  const context = useContext(StaffingContext);
  if (context === undefined) {
    throw new Error("useStaffing must be used within a StaffingProvider");
  }
  return context;
};
