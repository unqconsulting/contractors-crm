'use client';
import { useEffect, useState } from 'react';
import { getClients } from '../../core/queries/client-queries';

import { deleteClient } from '../../core/commands/client-commands';
import { Client } from '../../core/types/types';
import Modal from '@/components/modal';
import { CustomTable } from '@/components/custom-table';
import CustomLink from '@/components/ui/link';
import { LoadingSpinner } from '@/components/ui/spinner';
import { sortByName } from '@/app/utilities/helpers/helpers';
import { useAuth } from '@/app/providers/authProvider';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [clients, setClients] = useState<Client[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    const fetchClients = async () => {
      if (!user) router.push('/auth/login');
      const clients = await getClients();
      if (ignore) return;
      setClients(clients);

      setLoading(false);
    };
    fetchClients();
    return () => {
      ignore = true;
    };
  }, [router, user]);

  if (clients) sortByName(clients);

  const rows = clients
    ? clients.map((client) => {
        return {
          id: client.client_id,
          values: [client.name],
        };
      })
    : [];

  const openModal = (rowIndex: number) => {
    setIsModalOpen(true);
    setSelectedClient(clients ? clients[rowIndex] : null);
  };

  const deleteC = async () => {
    if (selectedClient === null) return;
    const id = selectedClient.client_id as number;
    const { error } = await deleteClient(id);
    if (error) {
      setErrorDelete(true);
      console.error('Error deleting client:', error);
    } else {
      setIsModalOpen(false);
      setClients(clients?.filter((client) => client.client_id !== id));
    }
  };

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
        isOpen={isModalOpen}
        onClose={() => (setIsModalOpen(false), setErrorDelete(false))}
        onCancel={() => (setIsModalOpen(false), setErrorDelete(false))}
        onDelete={deleteC}
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
