import { Document } from 'mongoose';
import { LeanDocument } from '../types/lean.type';

export async function saveAndLean<T extends Document, R = LeanDocument<T>>(
  doc: T,
): Promise<R> {
  return doc.save().then((saved) => saved.toObject<R>());
}
