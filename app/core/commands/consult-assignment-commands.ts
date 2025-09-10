import { supabase } from '@/lib/supabase/supabaseClient';
import { ConsultantAssignment } from '../types/types';

export const updateConsultantAssignment = async (
  id: number,
  consultantAssignment: ConsultantAssignment
) => {
  consultantAssignment = {
    ...consultantAssignment,
    consultant: undefined,
    client: undefined,
    partner: undefined,
  };
  const { data, error } = await supabase
    .from('ConsultantAssignments')
    .update(consultantAssignment)
    .eq('assignment_id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteConsultantAssignment = async (id: number) => {
  const { data, error } = await supabase
    .from('ConsultantAssignments')
    .delete()
    .eq('assignment_id', id);

  return { data, error };
};

export const createNewConsultantAssignment = async (
  consultantAssignment: ConsultantAssignment
) => {
  delete consultantAssignment.client;
  delete consultantAssignment.partner;
  delete consultantAssignment.consultant;
  delete consultantAssignment.assignment_id;

  const { data, error } = await supabase
    .from('ConsultantAssignments')
    .insert([consultantAssignment])
    .select()
    .single();

  return { data, error };
};
