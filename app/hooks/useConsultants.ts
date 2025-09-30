import { useRouter } from 'next/navigation';
import { deleteConsultant } from '../core/commands/consultants-commands';
import { Consultant } from '../core/types/types';
import { useAuth } from '../providers/authProvider';
import { useCallback, useEffect, useState } from 'react';
import { getConsultants } from '../core/queries/consultant-queries';
import { sortByName } from '../utilities/helpers/helpers';

interface ConsultantsReturn {
  consultants: Consultant[] | undefined;
  loading: boolean;
  isModalOpen: boolean;
  errorDelete: boolean;
  rows: Array<{ id: number; values: string[] }>;
  columns: string[];
  selectedConsultant?: Consultant | null;
  openModal: (rowIndex: number) => void;
  closeModal: () => void;
  removeConsultant: () => Promise<void>;
}

export const useConsultants = (): ConsultantsReturn => {
  const [consultants, setConsultants] = useState<Consultant[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] =
    useState<Consultant | null>();
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchConsultants = useCallback(
    async (signal?: AbortSignal) => {
      if (!user) router.push('/auth/login');
      const consultants = await getConsultants();
      if (signal?.aborted) return;
      setConsultants(consultants);

      setLoading(false);
    },
    [user, router]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchConsultants(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchConsultants]);

  const columns = ['Name', 'Phone number', 'Email'];

  if (consultants) {
    sortByName(consultants);
  }

  const rows = consultants
    ? consultants.map((consultant) => {
        return {
          id: consultant.consultant_id as number,
          values: [
            consultant.name,
            consultant.phone,
            consultant.email,
          ] as string[],
        };
      })
    : [];

  const openModal = (rowIndex: number) => {
    setIsModalOpen(true);
    setSelectedConsultant(consultants ? consultants[rowIndex] : null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorDelete(false);
  };

  const removeConsultant = async () => {
    if (selectedConsultant == null) return;
    const { error } = await deleteConsultant(
      selectedConsultant?.consultant_id as number
    );

    if (error) {
      setErrorDelete(true);
    } else {
      setConsultants(
        consultants?.filter(
          (consultant) =>
            consultant.consultant_id !== selectedConsultant.consultant_id
        )
      );
      setIsModalOpen(false);
    }
  };

  return {
    consultants,
    loading,
    isModalOpen,
    errorDelete,
    rows,
    columns,
    selectedConsultant,
    openModal,
    closeModal,
    removeConsultant,
  };
};
