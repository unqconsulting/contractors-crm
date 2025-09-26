import {
  Client,
  Consultant,
  ConsultantAssignment,
  DropdownOption,
  Partner,
} from '@/app/core/types/types';

export const calculateRevenueMarginAndProfit = (
  consultAssignment: ConsultantAssignment
): { totalRevenue: number; margin: number; profit: number } => {
  const totalRevenue =
    +(consultAssignment?.hourly_rate ?? 0) *
    +(consultAssignment?.hours_worked ?? 0);
  if (totalRevenue === 0) return { totalRevenue, margin: 0, profit: 0 }; // Avoid division by zero
  const totalCost =
    +(consultAssignment?.cost_fulltime ?? 0) *
    +(consultAssignment?.hours_worked ?? 0);
  const margin = Math.round(((totalRevenue - totalCost) / totalRevenue) * 100); // Return margin as a percentage
  const profit = totalRevenue - totalCost;
  return { totalRevenue, margin, profit };
};

export const createConsultantAssignmentObject = (): ConsultantAssignment => {
  return {
    consultant_id: undefined,
    client_id: undefined,
    partner_id: undefined,
    month: undefined,
    cost_fulltime: undefined,
    hourly_rate: undefined,
    hours_worked: undefined,
    total_revenue: undefined,
    margin_percent: undefined,
    profit: undefined,
  };
};

export const createConsultantObject = (): Consultant => {
  return {
    consultant_id: undefined,
    name: undefined,
    phone: undefined,
    email: undefined,
  };
};

const months = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December',
];

const monthsOptions = months.map((m, index) => {
  return {
    value: index.toString(),
    label: m,
  };
});

export const getOptionMonths = (): DropdownOption[] => {
  return monthsOptions;
};

export const getAssignmentMonth = (val: string): string => {
  return monthsOptions.find((m) => m.value === val)?.label ?? '';
};

export const checkName = (entitiesList: unknown[], name: string): unknown => {
  for (let i = 0; i < entitiesList.length; i++) {
    const entity = entitiesList[i] as { name: string };
    if (entity.name.toLowerCase() === name.trim().toLowerCase()) {
      return entitiesList[i];
    }
  }
  return;
};

export const sortByName = (list: Client[] | Partner[] | Consultant[]) => {
  list.sort((a, b) => {
    if (a.name && b.name) {
      if (a?.name.toLowerCase() > b?.name.toLowerCase()) {
        return 1;
      } else if (a?.name.toLowerCase() === b?.name.toLowerCase()) return 0;
    }
    return -1;
  });
};
