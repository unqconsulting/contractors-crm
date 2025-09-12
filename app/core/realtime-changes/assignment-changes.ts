import { ConsultantAssignment } from '../types/types';
import { RealtimeChannel } from '@supabase/supabase-js';

export const ConsultantAssignmentRealTimeChanges = (
  channel: RealtimeChannel,
  callbacks: {
    deleteStoreAssignment: (id: number) => void;
    addAssignment: (assignment: ConsultantAssignment) => void;
    updateAssignment: (assignment: ConsultantAssignment) => void;
  },
  consultantAssignments: ConsultantAssignment[]
) => {
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'ConsultantAssignments' },
    (payload) => {
      if (payload.eventType === 'DELETE') {
        const deletedConsultantAssignmentId =
          payload.old.consultant_assignment_id;
        callbacks.deleteStoreAssignment(deletedConsultantAssignmentId);
      } else if (payload.eventType === 'INSERT') {
        const newConsultantAssignment = payload.new;
        if (
          !consultantAssignments.some(
            (a) => a.assignment_id === newConsultantAssignment.assignment_id
          )
        ) {
          callbacks.addAssignment(
            newConsultantAssignment as ConsultantAssignment
          );
        }
      } else if (payload.eventType === 'UPDATE') {
        const updatedConsultantAssignment = payload.new;
        callbacks.updateAssignment(
          updatedConsultantAssignment as ConsultantAssignment
        );
      }
    }
  );
};
