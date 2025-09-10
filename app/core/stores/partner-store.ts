import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Partner } from '../types/types';

type PartnerState = {
  allPartners: Partner[];
  setAllPartners: (partners: Partner[]) => void;
  deleteStorePartner: (partnerId: number) => void;
  addStorePartner: (partner: Partner) => void;
  updateStorePartner: (partner: Partner) => void;
};

export const usePartnerStore = create(
  persist<PartnerState>(
    (set) => ({
      allPartners: [],
      setAllPartners: (partners) => set({ allPartners: partners }),
      deleteStorePartner: (partnerId) =>
        set((state) => ({
          allPartners: state.allPartners.filter(
            (partner) => partner.partner_id !== partnerId
          ),
        })),
      addStorePartner: (partner) =>
        set((state) => ({
          allPartners: [...state.allPartners, partner],
        })),
      updateStorePartner: (partner) =>
        set((state) => ({
          allPartners: state.allPartners.map((p) =>
            p.partner_id === partner.partner_id ? partner : p
          ),
        })),
    }),

    { name: 'partner-storage' } // Key for localStorage
  )
);
