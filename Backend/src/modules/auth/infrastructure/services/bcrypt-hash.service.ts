import bcrypt from 'bcrypt'
import { IHashServive } from '../../domain/services/hash.service.interface.js'
export class BcryptHashService implements IHashServive{
    async hash(value: string): Promise<string> {
        return bcrypt.hash(value,10)
    }

    async comapre(value: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(value,hashed)
    }
}