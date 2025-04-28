import { Types } from 'mongoose';

export type LeanSchema<T> = T & { _id: Types.ObjectId };
