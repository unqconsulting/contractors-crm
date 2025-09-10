'use client';
import { useEffect, useState } from 'react';
import { getConsultantsAssignments } from '../../core/queries/consult-assignment-queries';
import { ConsultantAssignment } from '../../core/types/types';
import { deleteConsultantAssignment } from '../../core/commands/consult-assignment-commands';
import Modal from '@/components/modal';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { getAssignmentMonth } from '@/app/utilities/helpers/helpers';
import { useAssignmentStore } from '@/app/core/stores/assignment-store';

export default function Page() {
  const [assignments, setAssignments] = useState<
    ConsultantAssignment[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ConsultantAssignment | null>();
  const {
    consultantAssignments,
    setConsultantAssignments,
    deleteStoreAssignment,
  } = useAssignmentStore();

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

  useEffect(() => {
    const fetchConsultantsAssignments = async () => {
      if (
        (!consultantAssignments || consultantAssignments.length === 0) &&
        !assignments
      ) {
        const { data: assignments, error } = await getConsultantsAssignments();
        if (error) {
          console.error('Error fetching assignments:', error);
        } else {
          setAssignments(assignments);
          setConsultantAssignments(assignments);
        }
      } else {
        setAssignments(consultantAssignments);
      }
      setLoading(false);
    };
    fetchConsultantsAssignments();
  }, [consultantAssignments, setConsultantAssignments, assignments]);

  const openModal = (rowIndex: number) => {
    setIsModalOpen(true);
    setSelectedAssignment(assignments ? assignments[rowIndex] : null);
  };
  assignments?.sort((a, b) => {
    if (a.month && b.month) {
      if (a?.month > b?.month) {
        return 1;
      } else if (a?.month === b?.month) return 0;
    }
    return -1;
  });
  const rows = assignments
    ? assignments.map((assignment) => {
        return {
          id: assignment.assignment_id,
          detailsId: assignment.consultant_id,
          values: [
            assignment.consultant?.name,
            assignment.client?.name,
            assignment.partner?.name,
            assignment.cost_fulltime,
            assignment.hourly_rate,
            assignment.hours_worked,
            getAssignmentMonth(assignment.month ?? ''),
            assignment.total_revenue,
            assignment.profit,
            assignment.margin_percent + ' %',
          ],
        };
      })
    : [];

  const deleteA = async () => {
    setIsModalOpen(false);
    if (selectedAssignment == null) return;
    const { data, error } = await deleteConsultantAssignment(
      selectedAssignment?.assignment_id as number
    );
    if (error) {
      console.error('Error deleting assigment:', error);
    } else {
      deleteStoreAssignment(selectedAssignment.assignment_id as number);
      setAssignments(
        assignments?.filter(
          (assignment) =>
            assignment.assignment_id !== selectedAssignment.assignment_id
        )
      );
      console.log('Assigment deleted:', data);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <CustomTable
        columns={columns}
        rows={rows}
        type="assignments"
        openModal={openModal}
      />

      <CustomLink href="/assignments/create" variant="button">
        Create new assignment
      </CustomLink>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        onDelete={deleteA}
        title="Delete assigment"
      >
        <p>Are you sure you want to delete the assigment?</p>
      </Modal>
    </>
  );
}
