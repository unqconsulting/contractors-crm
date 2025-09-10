import { supabase } from '@/lib/supabase/supabaseClient';

export const updateClient = async (id: number, name: string) => {
  const { data, error } = await supabase
    .from('Clients')
    .update({ name: name })
    .eq('client_id', id)
    .select()
    .single();

  return { data, error };
};

export const createNewClient = async (name: string) => {
  const { data, error } = await supabase
    .from('Clients')
    .insert([{ name: name }])
    .select()
    .single();

  return { data, error };
};

export const deleteClient = async (id: number) => {
  const { data, error } = await supabase
    .from('Clients')
    .delete()
    .eq('client_id', id);

  return { data, error };
};
