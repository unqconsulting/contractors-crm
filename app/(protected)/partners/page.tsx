'use client';
import { useEffect, useState } from 'react';
import { getPartners } from '../../core/queries/partner-queries';
import { deletePartner } from '../../core/commands/partner-commands';
import { Partner } from '../../core/types/types';
import Modal from '@/components/modal';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { sortByName } from '@/app/utilities/helpers/helpers';
import { usePartnerStore } from '@/app/core/stores/partner-store';

export default function Page() {
  const [partners, setPartners] = useState<Partner[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partner, setSelectedPartner] = useState<Partner | null>();
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const { allPartners, setAllPartners, deleteStorePartner } = usePartnerStore();

  useEffect(() => {
    const fetchPartners = async () => {
      if ((!allPartners || allPartners.length === 0) && !partners) {
        const partners = await getPartners();
        setPartners(partners);
        setAllPartners(partners);
      } else {
        setPartners(allPartners);
      }
      setLoading(false);
    };
    fetchPartners();
  }, [allPartners, setAllPartners, partners]);

  if (partners) sortByName(partners);

  const rows = partners
    ? partners.map((partner) => {
        return {
          id: partner.partner_id,
          values: [partner.name],
        };
      })
    : [];

  const openModal = (rowIndex: number) => {
    setIsModalOpen(true);
    setSelectedPartner(partners ? partners[rowIndex] : null);
  };

  const deleteP = async () => {
    if (partner == null) return;
    const { data, error } = await deletePartner(partner?.partner_id as number);

    if (error) {
      console.error('Error deleting partner:', error);
      setErrorDelete(true);
    } else {
      console.log('Partner deleted:', data);
      deleteStorePartner(partner?.partner_id as number);
      setPartners(partners?.filter((p) => p.partner_id !== partner.partner_id));
      setIsModalOpen(false);
    }
  };

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
        isOpen={isModalOpen}
        onClose={() => (setIsModalOpen(false), setErrorDelete(false))}
        onCancel={() => (setIsModalOpen(false), setErrorDelete(false))}
        onDelete={deleteP}
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
