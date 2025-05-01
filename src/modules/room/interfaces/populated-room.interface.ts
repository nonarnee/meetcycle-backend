import { LeanDocument } from 'src/common/types/lean.type';
import { Participant } from 'src/modules/participant/schemas/participant.schema';
import { Cycle } from 'src/modules/cycle/schemas/cycle.schema';
import { Types } from 'mongoose';

export interface PopulatedRoom {
  _id: Types.ObjectId;
  cycle: LeanDocument<Cycle>;
  maleParticipant: LeanDocument<Participant>;
  femaleParticipant: LeanDocument<Participant>;
  status: string;
  maleLiked: boolean | null;
  femaleLiked: boolean | null;
  isMatched: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
