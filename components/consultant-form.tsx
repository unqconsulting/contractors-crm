'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import {
  createNewConsultant,
  updateConsultant,
} from '@/app/core/commands/consultants-commands';
import CustomLink from './ui/link';
import { LoadingSpinner } from './ui/spinner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { getConsultantById } from '@/app/core/queries/consultant-queries';
import { Consultant } from '@/app/core/types/types';
import {
  checkName,
  createConsultantObject,
} from '@/app/utilities/helpers/helpers';
import {
  getConsultantById,
  getConsultants,
} from '@/app/core/queries/consultant-queries';
import { useConsultantStore } from '@/app/core/stores/consultant-store';
import { useAssignmentStore } from '@/app/core/stores/assignment-store';

const formSchema = z.object({
  email: z.email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      'Invalid phone number format (e.g., 1234567890 or +11234567890)'
    ),
});

type FormData = z.infer<typeof formSchema>;

export function ConsultantForm({ id }: { id?: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [consultant, setConsultant] = useState<Consultant>(
    createConsultantObject()
  );
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [duplicateError, setDuplicateError] = useState('');

  const { addStoreConsultant, updateStoreConsultant } = useConsultantStore();
  const { updateAssignmentConsultant } = useAssignmentStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    mode: 'onChange', // Changed from onTouched to onChange
  });

  // Handle autofill detection
  useEffect(() => {
    const checkAutofill = () => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const phoneInput = document.getElementById(
        'phone-number'
      ) as HTMLInputElement;

      // Check if inputs have autofilled values
      if (emailInput?.value && emailInput.matches(':-webkit-autofill')) {
        setValue('email', emailInput.value);
        trigger('email');
      }
      if (phoneInput?.value && phoneInput.matches(':-webkit-autofill')) {
        setValue('phone', phoneInput.value);
        trigger('phone');
      }
    };

    // Run immediately and after a short delay
    checkAutofill();
    const timer = setTimeout(checkAutofill, 300);

    return () => clearTimeout(timer);
  }, [setValue, trigger]);

  // // Update form values when consultant changes
  useEffect(() => {
    if (consultant) {
      setValue('email', consultant.email || '');
      setValue('phone', consultant.phone || '');
    }
  }, [consultant, setValue]);

  useEffect(() => {
    const fetchAll = async () => {
      const consultants = await getConsultants();
      setConsultants(consultants);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    const fetchConsultant = async () => {
      if (id) {
        setLoading(true);
        const { data, error } = await getConsultantById(id as number);
        if (error) {
          console.error('Error fetching consultant:', error);
        } else {
          setConsultant(data);
        }
        setLoading(false);
      }
    };
    fetchConsultant();
  }, [id]);

  const createOrUpdate = async (formData: FormData) => {
    const ConsultantError = checkName(
      consultants,
      consultant.name as string
    ) as Consultant;
    if (
      ConsultantError &&
      ConsultantError.consultant_id !== consultant.consultant_id
    ) {
      setDuplicateError('Consultant with this name already exists');
      return;
    }
    setLoading(true);
    try {
      const updatedConsultant = {
        ...consultant,
        name: consultant.name?.trim(),
        email: formData.email,
        phone: formData.phone,
      };

      if (!id) {
        delete updatedConsultant.consultant_id;
        const { data, error } = await createNewConsultant(
          updatedConsultant as Consultant
        );
        if (error) {
          throw error;
        } else {
          addStoreConsultant(data as Consultant);
        }
      } else {
        const { data, error } = await updateConsultant(id, updatedConsultant);
        if (error) {
          throw error;
        } else {
          updateAssignmentConsultant(data as Consultant);
          updateStoreConsultant(data as Consultant);
        }
      }

      router.push('/consultants');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Consultant
  ) => {
    if (field === 'name') {
      setDuplicateError('');
    }
    const newValue = e.target.value;
    setConsultant((prev) => ({
      ...prev,
      [field]: newValue,
    }));
    setValue(field as keyof FormData, newValue);
    reset({ [field]: '' });
  };

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
      <form onSubmit={handleSubmit(createOrUpdate)}>
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
          error={!isSubmitted ? undefined : errors.phone?.message} // Only show errors after submission
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
          error={!isSubmitted ? undefined : errors.email?.message} // Only show errors after submission
        />

        <Button type="submit">
          {!id ? 'Create Consultant' : 'Update Consultant'}
        </Button>
      </form>
    </>
  );
}
