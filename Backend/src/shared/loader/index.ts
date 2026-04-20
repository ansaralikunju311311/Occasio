import { connectDateBase } from '../config/databaseConnection';
export const initializaApp = async (): Promise<void> => {
  await connectDateBase();
};
