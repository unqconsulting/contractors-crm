import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import z from 'zod';
import { Consultant } from '../core/types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  checkName,
  createConsultantObject,
} from '../utilities/helpers/helpers';
import {
  getConsultantById,
  getConsultants,
} from '../core/queries/consultant-queries';
import {
  createNewConsultant,
  updateConsultant,
} from '../core/commands/consultants-commands';
type FormData = z.infer<typeof formSchema>;

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

interface UseConsultantFormReturn {
  loading: boolean;
  duplicateError: string;
  createOrUpdate: (data: FormData) => Promise<void>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Consultant
  ) => void;
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  isSubmitted: ReturnType<typeof useForm<FormData>>['formState']['isSubmitted'];
  handleSubmit: ReturnType<typeof useForm<FormData>>['handleSubmit'];
  consultantId?: number;
  consultant: Consultant;
}

export const useConsultantForm = ({
  id,
}: {
  id?: number;
}): UseConsultantFormReturn => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<Consultant>(
    createConsultantObject()
  );
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [duplicateError, setDuplicateError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    mode: 'onChange', // Changed from onTouched to onChange
  });

  useEffect(() => {
    const fetch = async () => {
      const consultants = await getConsultants();
      setConsultants(consultants);
      if (id) {
        const { data, error } = await getConsultantById(id as number);
        if (!error) {
          setConsultant(data);
        }
      }
      setLoading(false);
    };

    fetch();
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
        const { error } = await createNewConsultant(
          updatedConsultant as Consultant
        );
        if (error) {
          throw error;
        }
      } else {
        const { error } = await updateConsultant(id, updatedConsultant);
        if (error) {
          throw error;
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
    // Update react-hook-form state
    setValue(field as keyof FormData, newValue, {
      shouldValidate: true, // Optional: triggers validation on change
      shouldDirty: true, // Optional: marks field as dirty
    });
  };

  return {
    loading,
    consultant,
    duplicateError,
    createOrUpdate,
    handleInputChange,
    register,
    errors,
    isSubmitted,
    handleSubmit,
  };
};
