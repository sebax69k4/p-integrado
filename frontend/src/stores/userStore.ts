import { atom } from 'nanostores';

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export const user = atom<User | null>(null);
