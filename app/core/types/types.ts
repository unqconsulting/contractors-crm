export interface Partner {
  partner_id?: number;
  name: string;
}

export interface Consultant {
  consultant_id?: number;
  name?: string;
  phone?: string;
  email?: string;
}

export interface Client {
  client_id?: number;
  name: string;
}
export interface ConsultantAssignment {
  assignment_id?: number;
  consultant_id?: number;
  client_id?: number;
  partner_id?: number;
  month?: string;
  cost_fulltime?: string;
  hourly_rate?: string;
  hours_worked?: string;
  total_revenue?: number;
  margin_percent?: number;
  profit?: number;
  consultant?: Consultant;
  client?: Client;
  partner?: Partner;
}

export interface DropdownOption {
  value?: string;
  label?: string;
}

export type InputSizeVariant = 'sm' | 'md' | 'lg';
