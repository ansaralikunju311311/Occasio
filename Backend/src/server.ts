// import "../shared/config/env"
import '../src/shared/loader/env';
import app from './app';
import { initializaApp } from './shared/loader/index';
// import { clearExpiredOtpJob } from "../shared/loaders/index"
const startServer = async (): Promise<void> => {
  try {
    await initializaApp();
    //    clearExpiredOtpJob()
    app.listen(3001, () => {
      console.log(`the server is running propelrly`);
    });
  } catch (error: unknown) {
    console.log(error);
  }
};
startServer();
