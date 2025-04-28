import { Document } from 'mongoose';
import { LeanSchema } from '../types/lean.type';

export async function saveAndLean<T extends Document, R = LeanSchema<T>>(
  doc: T,
): Promise<R> {
  return doc.save().then((saved) => saved.toObject<R>());
}
