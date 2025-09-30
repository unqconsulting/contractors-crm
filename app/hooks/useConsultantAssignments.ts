'use client';
import { useEffect, useState, useCallback } from 'react';
import { getConsultantsAssignments } from '../core/queries/consult-assignment-queries';
import { ConsultantAssignment } from '../core/types/types';
import { deleteConsultantAssignment } from '../core/commands/consult-assignment-commands';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/authProvider';
import { getAssignmentMonth } from '@/app/utilities/helpers/helpers';

export interface UseConsultantAssignmentsReturn {
  assignments: ConsultantAssignment[] | undefined;
  loading: boolean;
  isModalOpen: boolean;
  selectedAssignment: ConsultantAssignment | null;
  rows: Array<{ id: number; detailsId: number; values: string[] }>;
  columns: string[];
  openModal: (rowIndex: number) => void;
  closeModal: () => void;
  deleteAssignment: () => Promise<void>;
  fetchAssignments: () => Promise<void>;
}

export const useConsultantAssignments = (): UseConsultantAssignmentsReturn => {
  const [assignments, setAssignments] = useState<
    ConsultantAssignment[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ConsultantAssignment | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  const columns = [
    'Consultant name',
    'Client',
    'Partner',
    'Hourly rate consultant',
    'Hourly rate client',
    'Hours worked',
    'Month',
    'Total revenue',
    'Profit',
    'Margin',
  ];

  const fetchAssignments = useCallback(
    async (signal?: AbortSignal) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setLoading(true);
      const { data: assignments, error } = await getConsultantsAssignments();

      if (signal?.aborted) return;

      if (error) {
        console.error('Error fetching assignments:', error);
      } else {
        setAssignments(assignments);
      }
      setLoading(false);
    },
    [user, router]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchAssignments(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchAssignments]);

  const openModal = useCallback(
    (rowIndex: number) => {
      setIsModalOpen(true);
      setSelectedAssignment(assignments ? assignments[rowIndex] : null);
    },
    [assignments]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  }, []);

  const deleteAssignment = useCallback(async () => {
    closeModal();

    if (!selectedAssignment) return;

    const { data, error } = await deleteConsultantAssignment(
      selectedAssignment.assignment_id as number
    );

    if (error) {
      console.log('Error deleting assignment:', error);
      closeModal();
    } else {
      setAssignments((prevAssignments) =>
        prevAssignments?.filter(
          (assignment) =>
            assignment.assignment_id !== selectedAssignment.assignment_id
        )
      );
      console.log('Assignment deleted:', data);
    }
  }, [selectedAssignment, closeModal]);

  // Sort assignments
  const sortedAssignments = assignments?.sort((a, b) => {
    if (a.month && b.month) {
      if (+a.month > +b.month) return 1;
      if (+a.month === +b.month) return 0;
    }
    return -1;
  });

  // Prepare rows for table
  const rows = sortedAssignments
    ? sortedAssignments.map((assignment) => ({
        id: assignment.assignment_id as number,
        detailsId: assignment.consultant_id as number,
        values: [
          assignment.consultant?.name || '',
          assignment.client?.name || '',
          assignment.partner?.name || '',
          assignment.cost_fulltime?.toString() || '',
          assignment.hourly_rate?.toString() || '',
          assignment.hours_worked?.toString() || '',
          getAssignmentMonth(assignment.month ?? ''),
          assignment.total_revenue?.toString() || '',
          assignment.profit?.toString() || '',
          assignment.margin_percent ? `${assignment.margin_percent} %` : '',
        ],
      }))
    : [];

  return {
    assignments: sortedAssignments,
    loading,
    isModalOpen,
    selectedAssignment,
    rows,
    columns,
    openModal,
    closeModal,
    deleteAssignment,
    fetchAssignments,
  };
};
