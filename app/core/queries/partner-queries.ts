import { supabase } from '@/lib/supabase/supabaseClient';

export const getPartners = async () => {
  const { data: partners, error } = await supabase.from('Partners').select();

  if (error) {
    console.error('Error fetching partners:', error);
    return [];
  }

  return partners;
};

export const getPartnerById = async (id: number) => {
  return await supabase.from('Partners').select().eq('partner_id', id).single();
};
