import { Meeting } from 'src/modules/meeting/schemas/meeting.schema';
import { Participant } from 'src/modules/participant/schemas/participant.schema';
import { LeanSchema } from '../lean.type';

export interface MeetingPopulated
  extends Omit<LeanSchema<Meeting>, 'maleParticipants' | 'femaleParticipants'> {
  maleParticipants: LeanSchema<Participant>[];
  femaleParticipants: LeanSchema<Participant>[];
}
