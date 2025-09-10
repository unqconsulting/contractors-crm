import { supabase } from '@/lib/supabase/supabaseClient';
import { Consultant } from '../types/types';

export const updateConsultant = async (id: number, consultant: Consultant) => {
  const { data, error } = await supabase
    .from('Consultants')
    .update(consultant)
    .eq('consultant_id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteConsultant = async (id: number) => {
  const { data, error } = await supabase
    .from('Consultants')
    .delete()
    .eq('consultant_id', id);

  return { data, error };
};

export const createNewConsultant = async (consultant: Consultant) => {
  const { data, error } = await supabase
    .from('Consultants')
    .insert([consultant])
    .select()
    .single();

  return { data, error };
};
