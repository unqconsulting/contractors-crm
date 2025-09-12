import { Client } from '../types/types';
import { RealtimeChannel } from '@supabase/supabase-js';

export const ClientRealTimeChanges = (
  channel: RealtimeChannel,
  callbacks: {
    deleteStoreClient: (id: number) => void;
    addStoreClient: (client: Client) => void;
    updateStoreClient: (client: Client) => void;
  },
  allClients: Client[]
) => {
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'Clients' },
    (payload) => {
      if (payload.eventType === 'DELETE') {
        const deletedClientId = payload.old.client_id;
        callbacks.deleteStoreClient(deletedClientId);
      } else if (payload.eventType === 'INSERT') {
        const newClient = payload.new;
        if (!allClients.some((c) => c.client_id === newClient.client_id)) {
          // Prevent duplicate insertion
          callbacks.addStoreClient(newClient as Client);
        }
      } else if (payload.eventType === 'UPDATE') {
        const updatedClient = payload.new;
        callbacks.updateStoreClient(updatedClient as Client);
      }
    }
  );
};
