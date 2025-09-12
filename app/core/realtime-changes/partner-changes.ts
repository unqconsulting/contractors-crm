import { Partner } from '../types/types';
import { RealtimeChannel } from '@supabase/supabase-js';

export const PartnerRealTimeChanges = (
  channel: RealtimeChannel,
  callbacks: {
    deleteStorePartner: (id: number) => void;
    addStorePartner: (partner: Partner) => void;
    updateStorePartner: (partner: Partner) => void;
  },
  allPartners: Partner[]
) => {
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'Partners' },
    (payload) => {
      debugger;
      console.log('Partner payload:', payload);
      if (payload.eventType === 'DELETE') {
        const deletedPartnerId = payload.old.partner_id;
        callbacks.deleteStorePartner(deletedPartnerId);
      } else if (payload.eventType === 'INSERT') {
        const newPartner = payload.new;
        if (!allPartners.some((p) => p.partner_id === newPartner.partner_id)) {
          // Prevent duplicate insertion
          callbacks.addStorePartner(newPartner as Partner);
        }
      } else if (payload.eventType === 'UPDATE') {
        const updatedPartner = payload.new;
        callbacks.updateStorePartner(updatedPartner as Partner);
      }
    }
  );
};
