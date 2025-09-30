import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPartnerById } from '../core/queries/partner-queries';
import { getClientById } from '../core/queries/client-queries';
import {
  createNewPartner,
  updatePartner,
} from '../core/commands/partner-commands';
import {
  createNewClient,
  updateClient,
} from '../core/commands/client-commands';

interface PartnerClientReturn {
  loading: boolean;
  duplicateError: string;
  setNewName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export const usePartnerClientForm = ({
  id,
  isPartner,
}: {
  id?: number;
  isPartner?: boolean;
}): PartnerClientReturn => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [loading, setLoading] = useState(false);
  const errorMessage =
    (isPartner ? 'Partner ' : 'Client ') + 'with this name already exists';

  useEffect(() => {
    if (id) {
      const getName = async (id: number) => {
        setLoading(true);
        const { data, error } = isPartner
          ? await getPartnerById(id)
          : await getClientById(id);

        if (!error) {
          setName(data.name);
        }
        setLoading(false);
      };

      getName(id as number);
    }
  }, [id, isPartner]);

  const create = async () => {
    const inputName = name.trim();
    const { error } = isPartner
      ? await createNewPartner(inputName)
      : await createNewClient(inputName);

    if (error?.code === '23505') {
      setDuplicateError(errorMessage);
      return;
    } else {
      if (isPartner) {
        router.push('/partners');
      } else {
        router.push('/customers');
      }
    }
  };

  const update = async () => {
    const inputName = name.trim();
    const { error } = isPartner
      ? await updatePartner(id as number, inputName)
      : await updateClient(id as number, inputName);

    if (error?.code === '23505') {
      setDuplicateError(errorMessage);
      return;
    } else {
      if (isPartner) {
        router.push('/partners');
      } else {
        router.push('/customers');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !id ? create() : update();
  };

  const setNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setDuplicateError('');
  };
  return { loading, duplicateError, setNewName, name, handleSubmit };
};
