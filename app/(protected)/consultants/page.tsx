'use client';
import Modal from '@/components/modal';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useConsultants } from '@/app/hooks/useConsultants';

export default function Page() {
  const {
    loading,
    isModalOpen,
    errorDelete,
    rows,
    columns,
    selectedConsultant,
    openModal,
    closeModal,
    removeConsultant,
  } = useConsultants();

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <CustomTable
        columns={columns}
        rows={rows}
        type="consultants"
        openModal={openModal}
      />

      <CustomLink href="/consultants/create" variant="button">
        Create new consultant
      </CustomLink>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onDelete={removeConsultant}
        title="Delete consultant"
        showPrimaryButton={!errorDelete}
      >
        {!errorDelete ? (
          <p>Are you sure you want to delete {selectedConsultant?.name}?</p>
        ) : (
          <p>
            <span className="font-bold">{selectedConsultant?.name}</span> is
            used in assignments and cannot be deleted.
          </p>
        )}
      </Modal>
    </>
  );
}
