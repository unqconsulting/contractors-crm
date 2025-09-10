'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

import { ConsultantAssignment, DropdownOption } from '@/app/core/types/types';
import {
  createNewConsultantAssignment,
  updateConsultantAssignment,
} from '@/app/core/commands/consult-assignment-commands';
import {
  calculateRevenueMarginAndProfit,
  createConsultantAssignmentObject,
  getOptionMonths,
} from '@/app/utilities/helpers/helpers';
import { getConsultantAssignmentById } from '@/app/core/queries/consult-assignment-queries';
import { getConsultants } from '@/app/core/queries/consultant-queries';
import { getClients } from '@/app/core/queries/client-queries';
import { getPartners } from '@/app/core/queries/partner-queries';
import Dropdown from './ui/dropdown';
import CustomLink from './ui/link';
import { LoadingSpinner } from './ui/spinner';
import { PostgrestError } from '@supabase/supabase-js';
import { useAssignmentStore } from '@/app/core/stores/assignment-store';

export function UpdateOrCreateConsultantAssignment({
  id,
  create,
}: {
  id?: number;
  create?: boolean;
}) {
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
  const [dropdownErrors, setDropdownErrors] = useState<{
    clientError: string;
    consultantError: string;
    monthError: string;
  }>({ clientError: '', consultantError: '', monthError: '' });

  const { addAssignment, updateAssignment } = useAssignmentStore();

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
      const { data, error } = await createNewConsultantAssignment(
        copy as ConsultantAssignment
      );
      if (!error) {
        consultAssignment.assignment_id = data.assignment_id;
        addAssignment(consultAssignment as ConsultantAssignment);
      }
      handleRespone(error);
    } else {
      const { error } = await updateConsultantAssignment(
        id as number,
        copy as ConsultantAssignment
      );
      if (!error) {
        updateAssignment(consultAssignment as ConsultantAssignment);
      }
      handleRespone(error);
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

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <CustomLink href="/assignments" className="mb-2 px-0">
        Back
      </CustomLink>
      <div className="mb-6">
        {create ? (
          <>
            <p>Create new assignment</p>
            <p>
              <span className="font-bold">Note: </span>{' '}
              <span className="italic">
                (Consultant, Client or Month must be changed)
              </span>
            </p>
          </>
        ) : id ? (
          'Update the consultant assignment below.'
        ) : (
          'Fill in the form below to create a new consultant assignment.'
        )}
      </div>
      <form onSubmit={createOrUpdate}>
        <Dropdown
          options={consultants}
          onSelect={(val) => {
            setConsultantAssignment(
              consultAssignment && {
                ...consultAssignment,
                consultant_id: +val,
                consultant: {
                  name: consultants.find((c) => c.value && +c.value === +val)
                    ?.label,
                },
              }
            );
            setDropdownErrors((prev) => ({ ...prev, consultantError: '' }));
            checkConsultant(+val);
          }}
          setValue={
            create || id
              ? {
                  value:
                    consultAssignment?.consultant?.consultant_id?.toString(),
                  label: consultAssignment?.consultant?.name,
                }
              : undefined
          }
          label="Consultant"
          id="consultant"
          placeholder="Choose a consultant"
          error={dropdownErrors.consultantError}
        />

        <Dropdown
          options={clients}
          onSelect={(val) => {
            setConsultantAssignment(
              consultAssignment && {
                ...consultAssignment,
                client_id: +val,
                client: {
                  name:
                    clients.find((c) => c.value && +c.value === +val)?.label ??
                    '',
                },
              }
            );
            setDropdownErrors((prev) => ({ ...prev, clientError: '' }));
            checkClient(+val);
          }}
          setValue={
            create || id
              ? {
                  value: consultAssignment?.client?.client_id?.toString(),
                  label: consultAssignment?.client?.name,
                }
              : undefined
          }
          label="Client"
          id="client"
          placeholder="Choose a client"
          error={dropdownErrors.clientError}
        />

        <Dropdown
          options={partners}
          onSelect={(val) =>
            setConsultantAssignment(
              consultAssignment && {
                ...consultAssignment,
                partner_id: +val,
                partner: {
                  name:
                    partners.find((p) => p.value && +p.value === +val)?.label ??
                    '',
                },
              }
            )
          }
          setValue={
            create || id
              ? {
                  value: consultAssignment?.partner?.partner_id?.toString(),
                  label: consultAssignment?.partner?.name,
                }
              : undefined
          }
          label="Partner"
          id="partner"
          placeholder="Choose a partner"
        />

        <Dropdown
          options={optionMonths}
          onSelect={(val) => {
            setConsultantAssignment(
              consultAssignment && {
                ...consultAssignment,
                month: val,
              }
            );
            setDropdownErrors((prev) => ({ ...prev, monthError: '' }));
            checkMonth(val);
          }}
          setValue={create || id ? choosenMonth : undefined}
          placeholder="Choose a month"
          label="Month"
          id="month"
          error={dropdownErrors.monthError}
        />
        <Input
          placeholder="Cost full time"
          type="number"
          label="Cost full time"
          id="full-time"
          value={consultAssignment?.cost_fulltime ?? ''}
          onChange={(e) =>
            setConsultantAssignment(
              consultAssignment && {
                ...consultAssignment,
                cost_fulltime: e.target.value,
              }
            )
          }
          required
        />
        <Input
          placeholder="Hourly rate"
          type="number"
          label="Hourly rate"
          id="hourly-rate"
          value={consultAssignment?.hourly_rate ?? ''}
          onChange={(e) => {
            setConsultantAssignment(
              consultAssignment && {
                ...consultAssignment,
                hourly_rate: e.target.value,
              }
            );
          }}
          required
        />
        <Input
          placeholder="Worked Hours"
          type="number"
          label="Hours worked"
          id="hours-worked"
          value={consultAssignment?.hours_worked ?? ''}
          onChange={(e) =>
            setConsultantAssignment(
              consultAssignment && {
                ...consultAssignment,
                hours_worked: e.target.value,
              }
            )
          }
          required
        />
        <Button type="submit" disabled={create ? !createAllowed : false}>
          {create
            ? 'Create assignment'
            : id
            ? 'Update Assignment'
            : 'Create Assignment'}
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </>
  );
}
