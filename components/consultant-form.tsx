'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomLink from './ui/link';
import { LoadingSpinner } from './ui/spinner';
import { useConsultantForm } from '@/app/hooks/useConsultantForm';

export function ConsultantForm({ id }: { id?: number }) {
  const {
    loading,
    duplicateError,
    createOrUpdate,
    handleInputChange,
    register,
    errors,
    isSubmitted,
    handleSubmit,
    consultant,
  } = useConsultantForm({ id });

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <CustomLink href="/consultants" className="mb-2 px-0">
        Back
      </CustomLink>
      <p className="mb-6">
        {!id
          ? 'Fill in the form below to create a new consultant.'
          : 'Update the consultant below'}
      </p>
      <form onSubmit={handleSubmit(createOrUpdate)} role="form">
        <Input
          placeholder="Consultant Name"
          type="text"
          label="Name"
          id="name"
          value={consultant?.name}
          onChange={(e) => handleInputChange(e, 'name')}
          error={duplicateError}
          required
        />
        <Input
          placeholder="Phone number"
          type="text"
          label="Phone number"
          id="phone-number"
          {...register('phone')}
          value={consultant?.phone}
          onChange={(e) => handleInputChange(e, 'phone')}
          required
          error={!isSubmitted ? undefined : (errors.phone?.message as string)} // Only show errors after submission
        />

        <Input
          placeholder="Email Address"
          type="email" // Changed from text to email
          label="Email"
          id="email"
          {...register('email')}
          value={consultant?.email}
          onChange={(e) => handleInputChange(e, 'email')}
          required
          error={!isSubmitted ? undefined : (errors.email?.message as string)} // Only show errors after submission
        />

        <Button type="submit">
          {!id ? 'Create Consultant' : 'Update Consultant'}
        </Button>
      </form>
    </>
  );
}
