import { connectDateBase } from '../config/databaseConnection.js';
export const initializaApp = async (): Promise<void> => {
  await connectDateBase();
};
