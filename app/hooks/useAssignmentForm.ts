import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ConsultantAssignment,
  DropdownErrors,
  DropdownOption,
} from '../core/types/types';
import { getConsultantAssignmentById } from '../core/queries/consult-assignment-queries';
import {
  calculateRevenueMarginAndProfit,
  createConsultantAssignmentObject,
  getOptionMonths,
} from '../utilities/helpers/helpers';
import {
  createNewConsultantAssignment,
  updateConsultantAssignment,
} from '../core/commands/consult-assignment-commands';
import { PostgrestError } from '@supabase/supabase-js';
import { getConsultants } from '../core/queries/consultant-queries';
import { getClients } from '../core/queries/client-queries';
import { getPartners } from '../core/queries/partner-queries';

interface UseAssignmentFormReturn {
  error: string;
  loading: boolean;
  createAllowed: boolean;
  dropdownErrors: DropdownErrors;
  consultants: DropdownOption[];
  clients: DropdownOption[];
  partners: DropdownOption[];
  consultAssignment: ConsultantAssignment;
  createOrUpdate: (e: React.FormEvent) => Promise<void>;
  choosenMonth: DropdownOption | undefined;
  optionMonths: DropdownOption[];
  setAssignmentValues: (type: string, val: string) => void;
}

export const useAssignmentForm = ({
  id,
  create,
}: {
  id?: number;
  create?: boolean;
}): UseAssignmentFormReturn => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [consultants, setConsultants] = useState<DropdownOption[]>([]);
  const [clients, setClients] = useState<DropdownOption[]>([]);
  const [partners, setPartners] = useState<DropdownOption[]>([]);
  const [consultAssignment, setConsultantAssignment] =
    useState<ConsultantAssignment>(createConsultantAssignmentObject());
  const [oldValues, setOldValues] = useState<{
    clientId: number | undefined;
    consultantId: number | undefined;
    month: string;
  }>({ clientId: undefined, consultantId: undefined, month: '' });
  const [createAllowed, setCreateAllowed] = useState(false);
  const [dropdownErrors, setDropdownErrors] = useState<DropdownErrors>({
    clientError: '',
    consultantError: '',
    monthError: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { data: assignment, error } = await getConsultantAssignmentById(
          id as number
        );
        if (error) {
          setError(error.message);
        } else {
          setConsultantAssignment(assignment);
          setOldValues({
            clientId: assignment.client_id,
            consultantId: assignment.consultant_id,
            month: assignment.month,
          });
        }
      }
      const consultants = (await getConsultants()).map((c) => {
        return {
          value: c.consultant_id.toString(),
          label: c.name,
        };
      });

      setConsultants(consultants);
      const clients = (await getClients()).map((c) => {
        return {
          value: c.client_id.toString(),
          label: c.name,
        };
      });
      setClients(clients);
      const partners = (await getPartners()).map((p) => {
        return {
          value: p.partner_id.toString(),
          label: p.name,
        };
      });
      setPartners(partners);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const optionMonths = getOptionMonths();
  const choosenMonth = optionMonths.find(
    (m) => m.value === consultAssignment?.month
  );

  const createOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasDropdownError = false;
    if (!consultAssignment.client_id) {
      setDropdownErrors((prev) => ({
        ...prev,
        clientError: 'Client is required',
      }));
      hasDropdownError = true;
    }
    if (!consultAssignment.consultant_id) {
      setDropdownErrors((prev) => ({
        ...prev,
        consultantError: 'Consultant is required',
      }));
      hasDropdownError = true;
    }
    if (!consultAssignment.month) {
      setDropdownErrors((prev) => ({
        ...prev,
        monthError: 'Month is required',
      }));
      hasDropdownError = true;
    }
    if (hasDropdownError) {
      return;
    }
    const { totalRevenue, margin, profit } =
      calculateRevenueMarginAndProfit(consultAssignment);
    consultAssignment.total_revenue = totalRevenue;
    consultAssignment.margin_percent = margin;
    consultAssignment.profit = profit;

    setConsultantAssignment(consultAssignment);
    setLoading(true);
    const copy = { ...consultAssignment };
    if (create || !id) {
      const { error } = await createNewConsultantAssignment(
        copy as ConsultantAssignment
      );

      handleRespone(error);
    } else {
      const { error } = await updateConsultantAssignment(
        id as number,
        copy as ConsultantAssignment
      );
      if (!error) {
      }
      handleRespone(error);
    }
  };

  const setAssignmentValues = (type: string, val: string) => {
    if (type === 'client') {
      setConsultantAssignment(
        consultAssignment && {
          ...consultAssignment,
          client_id: +val,
          client: {
            name:
              clients.find((c) => c.value && +c.value === +val)?.label ?? '',
          },
        }
      );
      setDropdownErrors((prev) => ({ ...prev, clientError: '' }));
      checkClient(+val);
    } else if (type === 'consultant') {
      setConsultantAssignment(
        consultAssignment && {
          ...consultAssignment,
          consultant_id: +val,
          consultant: {
            name: consultants.find((c) => c.value && +c.value === +val)?.label,
          },
        }
      );
      setDropdownErrors((prev) => ({ ...prev, consultantError: '' }));
      checkConsultant(+val);
    } else if (type === 'month') {
      setConsultantAssignment(
        consultAssignment && {
          ...consultAssignment,
          month: val,
        }
      );
      setDropdownErrors((prev) => ({ ...prev, monthError: '' }));
      checkMonth(val);
    } else if (type === 'full-time') {
      setConsultantAssignment(
        consultAssignment && {
          ...consultAssignment,
          cost_fulltime: val,
        }
      );
    } else if (type === 'hourly-rate') {
      setConsultantAssignment(
        consultAssignment && {
          ...consultAssignment,
          hourly_rate: val,
        }
      );
    } else if (type === 'hours-worked') {
      setConsultantAssignment(
        consultAssignment && {
          ...consultAssignment,
          hours_worked: val,
        }
      );
    } else {
      setConsultantAssignment(
        consultAssignment && {
          ...consultAssignment,
          partner_id: +val,
          partner: {
            name:
              partners.find((p) => p.value && +p.value === +val)?.label ?? '',
          },
        }
      );
    }
  };

  const checkMonth = (val: string) => {
    setCreateAllowed(val !== oldValues.month);
  };
  const checkClient = (val: number) => {
    setCreateAllowed(val !== oldValues.clientId);
  };
  const checkConsultant = (val: number) => {
    setCreateAllowed(val !== oldValues.consultantId);
  };

  const handleRespone = (error: PostgrestError | null) => {
    if (error) {
      setLoading(false);
      setError(error.message);
    } else {
      router.push('/assignments'); // Redirect to the consultants page
    }
  };

  return {
    error,
    loading,
    createAllowed,
    dropdownErrors,
    consultants,
    clients,
    partners,
    consultAssignment,
    createOrUpdate,
    choosenMonth,
    optionMonths,
    setAssignmentValues,
  };
};
