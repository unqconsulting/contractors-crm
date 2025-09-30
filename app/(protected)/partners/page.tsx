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
    selectedPartner: partner,
    rows,
    openModal,
    closeModal,
    removeSelectedItem,
  } = useClientsOrPartners(true);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <CustomTable
        columns={['Partners']}
        rows={rows}
        type="partners"
        openModal={openModal}
      />
      <CustomLink href="/partners/create" variant="button">
        Create new partner
      </CustomLink>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        onDelete={removeSelectedItem}
        title="Delete partner"
        showPrimaryButton={!errorDelete}
      >
        {!errorDelete ? (
          <p>Are you sure you want to delete {partner?.name}?</p>
        ) : (
          <p>
            <span className="font-bold">{partner?.name}</span> is used in
            assignments and cannot be deleted.
          </p>
        )}
      </Modal>
    </>
  );
}
