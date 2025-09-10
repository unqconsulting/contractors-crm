'use client';
import { useEffect, useState } from 'react';
import { getConsultants } from '../../core/queries/consultant-queries';
import { deleteConsultant } from '../../core/commands/consultants-commands';
import { Consultant } from '../../core/types/types';
import Modal from '@/components/modal';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { sortByName } from '@/app/utilities/helpers/helpers';
import { useConsultantStore } from '@/app/core/stores/consultant-store';

export default function Page() {
  const [consultants, setConsultants] = useState<Consultant[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] =
    useState<Consultant | null>();
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const { allConsultants, setAllConsultants, deleteStoreConsultant } =
    useConsultantStore();

  useEffect(() => {
    const fetch = async () => {
      if ((!allConsultants || allConsultants.length === 0) && !consultants) {
        const consultants = await getConsultants();
        setConsultants(consultants);
        setAllConsultants(consultants);
      } else {
        setConsultants(allConsultants);
      }
      setLoading(false);
    };
    fetch();
  }, [allConsultants, setAllConsultants, consultants]);

  const columns = ['Name', 'Phone number', 'Email'];
  if (consultants) {
    sortByName(consultants);
  }
  const rows = consultants
    ? consultants.map((consultant) => {
        return {
          id: consultant.consultant_id,
          values: [consultant.name, consultant.phone, consultant.email],
        };
      })
    : [];
  const openModal = (rowIndex: number) => {
    setIsModalOpen(true);
    setSelectedConsultant(consultants ? consultants[rowIndex] : null);
  };

  const deleteC = async () => {
    if (selectedConsultant == null) return;
    const { data, error } = await deleteConsultant(
      selectedConsultant?.consultant_id as number
    );

    if (error) {
      setErrorDelete(true);
      console.error('Error deleting consultant:', error);
    } else {
      deleteStoreConsultant(selectedConsultant.consultant_id as number);
      setConsultants(
        consultants?.filter(
          (consultant) =>
            consultant.consultant_id !== selectedConsultant.consultant_id
        )
      );
      console.log('Consultant deleted:', data);
      setIsModalOpen(false);
    }
  };

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
        onClose={() => (setIsModalOpen(false), setErrorDelete(false))}
        onCancel={() => (setIsModalOpen(false), setErrorDelete(false))}
        onDelete={deleteC}
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
