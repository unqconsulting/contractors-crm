'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomLink from './ui/link';
import { LoadingSpinner } from './ui/spinner';
import { usePartnerClientForm } from '@/app/hooks/usePartnerClientForm';

export default function CreateOrUpdatePartnerOrClient({
  id,
  isPartner,
}: {
  id?: number;
  isPartner?: boolean;
}) {
  const { loading, duplicateError, handleSubmit, setNewName, name } =
    usePartnerClientForm({
      id,
      isPartner,
    });

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
