import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Client,
  Consultant,
  ConsultantAssignment,
  Partner,
} from '../types/types';

type AssignmentState = {
  active: ConsultantAssignment | undefined;
  consultantAssignments: ConsultantAssignment[];
  setActive: (assignment: ConsultantAssignment | undefined) => void;
  setConsultantAssignments: (assignments: ConsultantAssignment[]) => void;
  deleteStoreAssignment: (assignmentId: number) => void;
  addAssignment: (assignment: ConsultantAssignment) => void;
  updateAssignment: (assignment: ConsultantAssignment) => void;
  updateAssignmentConsultant: (consultant: Consultant) => void;
  updateAssignmentClient: (client: Client) => void;
  updateAssignmentPartner: (partner: Partner) => void;
};

export const useAssignmentStore = create(
  persist<AssignmentState>(
    (set) => ({
      active: undefined,
      consultantAssignments: [],
      setActive: (assignment) => set({ active: assignment }),

      setConsultantAssignments: (assignments) =>
        set({ consultantAssignments: assignments }),
      deleteStoreAssignment: (assignmentId) =>
        set((state) => ({
          consultantAssignments: state.consultantAssignments.filter(
            (assignment) => assignment.assignment_id !== assignmentId
          ),
        })),
      addAssignment: (assignment) =>
        set((state) => ({
          consultantAssignments: [...state.consultantAssignments, assignment],
        })),
      updateAssignment: (assignment) =>
        set((state) => ({
          consultantAssignments: state.consultantAssignments.map((a) =>
            a.assignment_id === assignment.assignment_id ? assignment : a
          ),
        })),
      updateAssignmentConsultant: (consultant) => {
        set((state) => ({
          consultantAssignments: state.consultantAssignments.map((a) =>
            a.consultant_id === consultant.consultant_id
              ? { ...a, consultant }
              : a
          ),
        }));
      },
      updateAssignmentClient: (client) => {
        set((state) => ({
          consultantAssignments: state.consultantAssignments.map((a) =>
            a.client_id === client.client_id ? { ...a, client } : a
          ),
        }));
      },
      updateAssignmentPartner: (partner) => {
        set((state) => ({
          consultantAssignments: state.consultantAssignments.map((a) =>
            a.partner_id === partner.partner_id ? { ...a, partner } : a
          ),
        }));
      },
    }),
    { name: 'assignment-storage' } // Key for localStorage
  )
);
