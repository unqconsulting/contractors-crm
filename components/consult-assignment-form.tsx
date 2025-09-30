'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import Dropdown from './ui/dropdown';
import CustomLink from './ui/link';
import { LoadingSpinner } from './ui/spinner';
import { useAssignmentForm } from '@/app/hooks/useAssignmentForm';

export function UpdateOrCreateConsultantAssignment({
  id,
  create,
}: {
  id?: number;
  create?: boolean;
}) {
  const {
    error,
    loading,
    consultants,
    clients,
    partners,
    consultAssignment,
    createOrUpdate,
    optionMonths,
    choosenMonth,
    createAllowed,
    setAssignmentValues,
    dropdownErrors,
  } = useAssignmentForm({ id, create });

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
            setAssignmentValues('consultant', val);
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
            setAssignmentValues('client', val);
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
          onSelect={(val) => {
            setAssignmentValues('partner', val);
          }}
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
            setAssignmentValues('month', val);
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
          onChange={(e) => setAssignmentValues('full-time', e.target.value)}
          required
        />
        <Input
          placeholder="Hourly rate"
          type="number"
          label="Hourly rate"
          id="hourly-rate"
          value={consultAssignment?.hourly_rate ?? ''}
          onChange={(e) => {
            setAssignmentValues('hourly-rate', e.target.value);
          }}
          required
        />
        <Input
          placeholder="Worked Hours"
          type="number"
          label="Hours worked"
          id="hours-worked"
          value={consultAssignment?.hours_worked ?? ''}
          onChange={(e) => setAssignmentValues('hours-worked', e.target.value)}
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
