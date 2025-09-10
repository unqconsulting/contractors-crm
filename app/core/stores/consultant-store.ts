import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Consultant } from '../types/types';

type ConsultantState = {
  active: Consultant | undefined;
  allConsultants: Consultant[];
  setActive: (consultant: Consultant | undefined) => void;
  setAllConsultants: (consultants: Consultant[]) => void;
  deleteStoreConsultant: (consultantId: number) => void;
  addStoreConsultant: (consultant: Consultant) => void;
  updateStoreConsultant: (consultant: Consultant) => void;
};

export const useConsultantStore = create(
  persist<ConsultantState>(
    (set) => ({
      active: undefined,
      allConsultants: [],
      setActive: (consultant) => set({ active: consultant }),
      setAllConsultants: (consultants) => set({ allConsultants: consultants }),
      deleteStoreConsultant: (consultantId) =>
        set((state) => ({
          allConsultants: state.allConsultants.filter(
            (consultant) => consultant.consultant_id !== consultantId
          ),
        })),
      addStoreConsultant: (consultant) =>
        set((state) => ({
          allConsultants: [...state.allConsultants, consultant],
        })),
      updateStoreConsultant: (consultant) =>
        set((state) => ({
          allConsultants: state.allConsultants.map((c) =>
            c.consultant_id === consultant.consultant_id ? consultant : c
          ),
        })),
    }),
    { name: 'consult-storage' } // Key for localStorage
  )
);
