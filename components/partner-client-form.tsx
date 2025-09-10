'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import {
  createNewPartner,
  updatePartner,
} from '@/app/core/commands/partner-commands';
import CustomLink from './ui/link';
import { LoadingSpinner } from './ui/spinner';
import { getClientById, getClients } from '@/app/core/queries/client-queries';
import {
  getPartnerById,
  getPartners,
} from '@/app/core/queries/partner-queries';
import { Client, Partner } from '@/app/core/types/types';
import {
  createNewClient,
  updateClient,
} from '@/app/core/commands/client-commands';
import { checkName } from '@/app/utilities/helpers/helpers';
import { usePartnerStore } from '@/app/core/stores/partner-store';
import { useClientStore } from '@/app/core/stores/client-store';
import { useAssignmentStore } from '@/app/core/stores/assignment-store';

export default function CreateOrUpdatePartnerOrClient({
  id,
  isPartner,
}: {
  id?: number;
  isPartner?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [partnersOrClients, setPartnersOrClients] = useState<
    Partner[] | Client[]
  >([]);
  const errorMessage =
    (isPartner ? 'Partner ' : 'Client ') + 'with this name already exists';

  const { addStorePartner, updateStorePartner } = usePartnerStore();
  const { addStoreClient, updateStoreClient } = useClientStore();
  const { updateAssignmentClient, updateAssignmentPartner } =
    useAssignmentStore();

  useEffect(() => {
    const fetchAll = async () => {
      if (isPartner) {
        const partners = await getPartners();
        setPartnersOrClients(partners);
      } else {
        const clients = await getClients();
        setPartnersOrClients(clients);
      }

      setLoading(false);
    };
    fetchAll();
  }, [isPartner]);

  useEffect(() => {
    const getName = async (id: number) => {
      setLoading(true);
      const { data, error } = isPartner
        ? await getPartnerById(id)
        : await getClientById(id);

      if (error) {
        console.error('Error fetching client:', error);
      } else {
        setName(data.name);
      }
      setLoading(false);
    };
    if (id) {
      getName(id as number);
    }
  }, [id, isPartner]);

  const create = async () => {
    const inputName = name.trim();
    const nameError = checkName(partnersOrClients, name);
    if (nameError) {
      setDuplicateError(errorMessage);
      return;
    }

    const { data, error } = isPartner
      ? await createNewPartner(inputName)
      : await createNewClient(inputName);

    if (error) {
      console.error('Error adding partner:', error);
    } else {
      if (isPartner) {
        addStorePartner(data as Partner);
        router.push('/partners');
      } else {
        addStoreClient(data as Client);
        router.push('/customers');
      }
    }
  };

  const update = async () => {
    const inputName = name.trim();
    const nameError = checkName(partnersOrClients, name);
    if (nameError) {
      setDuplicateError(errorMessage);
      return;
    }
    const { data, error } = isPartner
      ? await updatePartner(id as number, inputName)
      : await updateClient(id as number, inputName);

    if (error) {
      console.error('Error updating partner:', error);
    } else {
      if (isPartner) {
        updateStorePartner(data as Partner);
        updateAssignmentPartner(data as Partner);
        router.push('/partners');
      } else {
        updateStoreClient(data as Client);
        updateAssignmentClient(data as Client);
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

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomLink
          href={isPartner ? '/partners' : '/customers'}
          className="mb-2 px-0"
        >
          Back
        </CustomLink>
        <p className="mb-6">
          {!id
            ? 'Fill in the form below to create a new' +
              `${isPartner ? ' partner.' : ' client.'}`
            : isPartner
            ? 'Update the partner below.'
            : 'Update the client below.'}
        </p>
        <Input
          placeholder="Name"
          type="text"
          label="Name"
          id="name"
          value={name}
          onChange={setNewName}
          required
          error={duplicateError}
        />
        <Button type="submit">
          {' '}
          {!id
            ? 'Create' + `${isPartner ? ' partner' : ' client'}`
            : isPartner
            ? 'Update partner'
            : 'Update client'}
        </Button>
      </form>
    </>
  );
}
