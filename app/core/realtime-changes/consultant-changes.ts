import { Consultant } from '../types/types';
import { RealtimeChannel } from '@supabase/supabase-js';

export const ConsultantRealTimeChanges = (
  channel: RealtimeChannel,
  callbacks: {
    deleteStoreConsultant: (id: number) => void;
    addStoreConsultant: (consultant: Consultant) => void;
    updateStoreConsultant: (consultant: Consultant) => void;
  },
  allConsultants: Consultant[]
) => {
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'Consultants' },
    (payload) => {
      debugger;
      if (payload.eventType === 'DELETE') {
        const deletedConsultantId = payload.old.consultant_id;
        callbacks.deleteStoreConsultant(deletedConsultantId);
      } else if (payload.eventType === 'INSERT') {
        const newConsultant = payload.new;
        if (
          !allConsultants.some(
            (c) => c.consultant_id === newConsultant.consultant_id
          )
        ) {
          callbacks.addStoreConsultant(newConsultant as Consultant);
        }
      } else if (payload.eventType === 'UPDATE') {
        const updatedConsultant = payload.new;
        callbacks.updateStoreConsultant(updatedConsultant as Consultant);
      }
    }
  );
};
