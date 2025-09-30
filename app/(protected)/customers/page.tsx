'use client';
import Modal from '@/components/modal';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useClientsOrPartners } from '@/app/hooks/useClientsOrPartners';

export default function Page() {
  const {
    loading,
    isOpen,
    errorDelete,
    selectedClient,
    rows,
    openModal,
    closeModal,
    removeSelectedItem,
  } = useClientsOrPartners(false);

  if (loading) return <LoadingSpinner />;
  return (
    <>
      <CustomTable
        columns={['Clients']}
        rows={rows}
        type="customers"
        openModal={openModal}
      />

      <CustomLink href="/customers/create" variant="button">
        Create new client
      </CustomLink>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        onDelete={removeSelectedItem}
        title="Delete client"
        showPrimaryButton={!errorDelete}
      >
        {!errorDelete ? (
          <p>Are you sure you want to delete {selectedClient?.name}?</p>
        ) : (
          <p>
            <span className="font-bold">{selectedClient?.name}</span> is used in
            assignments and cannot be deleted.
          </p>
        )}
      </Modal>
    </>
  );
}
