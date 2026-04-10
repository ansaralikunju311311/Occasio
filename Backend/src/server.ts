// import "../shared/config/env.js"
import '../src/shared/loader/env.js';
import app from './app.js';
import { initializaApp } from './shared/loader/index.js';
// import { clearExpiredOtpJob } from "../shared/loaders/index.js"
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
