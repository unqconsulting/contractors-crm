import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client } from '../types/types';

type ClientState = {
  allClients: Client[];
  setAllClients: (clients: Client[]) => void;
  deleteStoreClient: (clientId: number) => void;
  addStoreClient: (client: Client) => void;
  updateStoreClient: (client: Client) => void;
};

export const useClientStore = create(
  persist<ClientState>(
    (set) => ({
      allClients: [],
      setAllClients: (clients) => set({ allClients: clients }),
      deleteStoreClient: (clientId) =>
        set((state) => ({
          allClients: state.allClients.filter(
            (client) => client.client_id !== clientId
          ),
        })),
      addStoreClient: (client) =>
        set((state) => ({
          allClients: [...state.allClients, client],
        })),
      updateStoreClient: (client) =>
        set((state) => ({
          allClients: state.allClients.map((c) =>
            c.client_id === client.client_id ? client : c
          ),
        })),
    }),
    { name: 'client-storage' } // Key for localStorage
  )
);
