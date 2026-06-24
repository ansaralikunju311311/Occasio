import bcrypt from 'bcrypt';

import type { IHashServive } from '../../domain/services/hash.service.interface';
export class BcryptHashService implements IHashServive {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async comapre(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
