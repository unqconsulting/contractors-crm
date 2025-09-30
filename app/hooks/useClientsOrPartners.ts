import { useCallback, useEffect, useState } from 'react';
import { Client, Partner } from '../core/types/types';
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { getClients } from '../core/queries/client-queries';
import { sortByName } from '../utilities/helpers/helpers';
import { deleteClient } from '../core/commands/client-commands';
import { getPartners } from '../core/queries/partner-queries';
import { deletePartner } from '../core/commands/partner-commands';

interface ClientsOrPartnersReturn {
  clients: Client[] | undefined;
  partners: Partner[] | undefined;
  loading: boolean;
  errorDelete?: boolean;
  isOpen: boolean;
  rows: Array<{ id: number; values: string[] }>;
  selectedClient?: Client | null;
  selectedPartner?: Partner | null;
  openModal: (rowIndex: number) => void;
  closeModal: () => void;
  removeSelectedItem: () => Promise<void>;
}

export const useClientsOrPartners = (
  isPartner: boolean
): ClientsOrPartnersReturn => {
  const [clients, setClients] = useState<Client[] | undefined>(undefined);
  const [partners, setPartners] = useState<Partner[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClients] = useState<Client | null>(null);
  const [selectedPartner, setSelectedPartners] = useState<Partner | null>(null);
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchClients = useCallback(
    async (signal?: AbortSignal) => {
      if (!user) router.push('/auth/login');
      setLoading(true);
      const items = isPartner ? await getPartners() : await getClients();
      if (signal?.aborted) return;
      if (isPartner) setPartners(items);
      else setClients(items);
      setLoading(false);
    },
    [isPartner, router, user]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchClients(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchClients]);

  if (clients) sortByName(clients);

  const setItems = (items: (Client | Partner)[] | undefined) => {
    if (items) {
      return items.map((item) => {
        const id = isPartner
          ? (item as Partner).partner_id
          : (item as Client).client_id;
        return {
          id: id as number,
          values: [item.name],
        };
      });
    } else {
      return [];
    }
  };

  const rows = isPartner ? setItems(partners) : setItems(clients);

  const openModal = (rowIndex: number) => {
    setIsOpen(true);
    if (isPartner) {
      setSelectedPartners(partners ? partners[rowIndex] : null);
    } else {
      setSelectedClients(clients ? clients[rowIndex] : null);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrorDelete(false);
  };

  const removeSelectedItem = async () => {
    if (
      (isPartner && selectedPartner === null) ||
      (!isPartner && selectedClient === null)
    ) {
      return;
    }
    const id = isPartner
      ? (selectedPartner?.partner_id as number)
      : (selectedClient?.client_id as number);
    const { error } = isPartner
      ? await deletePartner(id)
      : await deleteClient(id);
    if (error) {
      setErrorDelete(true);
    } else {
      if (isPartner) {
        setPartners(
          partners?.filter((item) => {
            return item.partner_id !== id;
          })
        );
      } else {
        setClients(
          clients?.filter((item) => {
            return item.client_id !== id;
          })
        );
      }
      setIsOpen(false);
    }
  };

  return {
    clients,
    partners,
    loading,
    isOpen,
    errorDelete,
    selectedClient,
    selectedPartner,
    rows,
    openModal,
    closeModal,
    removeSelectedItem,
  };
};
