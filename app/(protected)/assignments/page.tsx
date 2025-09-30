'use client';
import Modal from '@/components/modal';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useConsultantAssignments } from '@/app/hooks/useConsultantAssignments';

export default function Page() {
  const {
    loading,
    rows,
    columns,
    isModalOpen,
    openModal,
    closeModal,
    deleteAssignment,
  } = useConsultantAssignments();

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
        onClose={closeModal}
        onDelete={deleteAssignment}
        title="Delete assigment"
      >
        <p>Are you sure you want to delete the assigment?</p>
      </Modal>
    </>
  );
}
